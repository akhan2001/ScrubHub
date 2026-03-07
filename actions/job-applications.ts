'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/server/guards/require-role';
import { createJobApplication } from '@/server/services/job-applications.service';
import { jobApplicationSchema } from '@/lib/validations/job-application';
import { ValidationError } from '@/server/errors/app-error';

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
}
