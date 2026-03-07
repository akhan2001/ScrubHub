import { insertJobApplication } from '@/server/repositories/job-applications.repository';
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

  return insertJobApplication({
    job_post_id: input.jobPostId,
    user_id: input.userId,
    email: input.email,
    phone: input.phone,
    resume_url: input.resumeUrl,
    cover_message: input.coverMessage ?? null,
  });
}
