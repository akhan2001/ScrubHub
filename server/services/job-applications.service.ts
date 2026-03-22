import {
  insertJobApplication,
  fetchApplicationByJobAndUser,
  fetchApplicationsByOrgId,
  fetchApplicationsByUserId,
  type JobApplicationWithJob,
} from '@/server/repositories/job-applications.repository';
import { fetchOrgMemberships } from '@/server/repositories/organizations.repository';
import { insertNotificationLog } from '@/server/repositories/notification-logs.repository';
import { fetchProfileById } from '@/server/repositories/profiles.repository';
import { voidSendJobApplicationToAdmin } from '@/lib/email/send-transactional';
import { emailAppPath } from '@/lib/email/urls';
import { getJobPostById } from '@/server/services/job-posts.service';
import { jobApplicationSchema } from '@/lib/validations/job-application';
import { ValidationError } from '@/server/errors/app-error';

export interface CreateJobApplicationInput {
  userId: string;
  jobPostId: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverMessage?: string | null;
}

export type ApplicationWithJobTitle = JobApplicationWithJob & { job_title: string };

export async function getApplicationsForOrg(orgId: string): Promise<ApplicationWithJobTitle[]> {
  const rows = await fetchApplicationsByOrgId(orgId);
  return rows.map((row) => ({
    ...row,
    job_title: row.job_posts?.title ?? 'Unknown job',
  }));
}

export async function getApplicationsForTenant(userId: string): Promise<ApplicationWithJobTitle[]> {
  const rows = await fetchApplicationsByUserId(userId);
  return rows.map((row) => ({
    ...row,
    job_title: row.job_posts?.title ?? 'Unknown job',
  }));
}

export async function createJobApplication(input: CreateJobApplicationInput) {
  const parsed = jobApplicationSchema.safeParse({
    email: input.email,
    phone: input.phone,
    resumeUrl: input.resumeUrl,
    coverMessage: input.coverMessage,
  });

  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Validation failed');
  }

  const job = await getJobPostById(input.jobPostId);
  if (!job || job.status !== 'published') {
    throw new ValidationError('Job not found or not accepting applications');
  }

  const existing = await fetchApplicationByJobAndUser(input.jobPostId, input.userId);
  if (existing) {
    throw new ValidationError('You have already applied for this job');
  }

  const application = await insertJobApplication({
    job_post_id: input.jobPostId,
    user_id: input.userId,
    email: input.email,
    phone: input.phone,
    resume_url: input.resumeUrl,
    cover_message: input.coverMessage ?? null,
  });

  const members = await fetchOrgMemberships(job.org_id);
  const adminsAndManagers = members.filter((m) => m.role === 'admin' || m.role === 'manager');
  const title = 'New job application';
  const body = `${input.email} applied for "${job.title}".`;
  const metadata = {
    job_post_id: input.jobPostId,
    application_id: application.id,
    applicant_email: input.email,
  };

  try {
    for (const m of adminsAndManagers) {
      await insertNotificationLog({
        user_id: m.user_id,
        event_type: 'job_application_submitted',
        title,
        body,
        metadata,
      });
    }
  } catch {
    // Notification creation is non-critical; application was saved successfully
  }

  const applicationsUrl = emailAppPath('/dashboard/enterprise/applications');
  for (const m of adminsAndManagers) {
    const profile = await fetchProfileById(m.user_id);
    voidSendJobApplicationToAdmin({
      adminUserId: m.user_id,
      adminEmail: profile?.email,
      adminName: profile?.full_name,
      applicantEmail: input.email,
      jobTitle: job.title,
      applicationsUrl,
    });
  }

  return application;
}
