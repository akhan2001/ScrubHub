'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/server/guards/require-role';
import { createJobApplication } from '@/server/services/job-applications.service';
import { fetchApplicationById } from '@/server/repositories/job-applications.repository';
import { getPrimaryOrganizationForUser } from '@/server/services/organizations.service';
import { jobApplicationSchema } from '@/lib/validations/job-application';
import { ValidationError } from '@/server/errors/app-error';
import { createClient } from '@/lib/supabase/server';

const RESUMES_BUCKET = 'resumes';

export async function getResumeSignedUrl(applicationId: string): Promise<string | null> {
  const user = await requireRole('enterprise');
  const application = await fetchApplicationById(applicationId);
  if (!application || !application.job_posts) return null;

  const org = await getPrimaryOrganizationForUser(user.id);
  if (!org || org.org_id !== application.job_posts.org_id) return null;

  const supabase = await createClient();
  const { data } = await supabase.storage
    .from(RESUMES_BUCKET)
    .createSignedUrl(application.resume_url, 60 * 60); // 1 hour

  return data?.signedUrl ?? null;
}

export async function applyForJob(input: {
  jobId: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverMessage?: string | null;
}) {
  const parsed = jobApplicationSchema.safeParse({
    email: input.email,
    phone: input.phone,
    resumeUrl: input.resumeUrl,
    coverMessage: input.coverMessage,
  });

  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Validation failed');
  }

  const user = await requireRole('tenant');

  await createJobApplication({
    userId: user.id,
    jobPostId: input.jobId,
    email: parsed.data.email,
    phone: parsed.data.phone,
    resumeUrl: parsed.data.resumeUrl,
    coverMessage: parsed.data.coverMessage,
  });

  revalidatePath('/staffing');
  revalidatePath(`/staffing/jobs/${input.jobId}`);
  revalidatePath('/jobs');
  revalidatePath(`/jobs/${input.jobId}`);
  revalidatePath('/dashboard/enterprise/applications');
}
