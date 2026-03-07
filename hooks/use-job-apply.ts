'use client';

import { useState } from 'react';
import { uploadResume } from '@/lib/integrations/supabase-storage';
import { applyForJob } from '@/actions/job-applications';
import type { JobApplicationData } from '@/lib/validations/job-application';

export function useJobApply(jobId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function apply(data: JobApplicationData & { resumeFile: File }) {
    setIsSubmitting(true);
    setError(null);
    try {
      const resumeUrl = await uploadResume(data.resumeFile);
      await applyForJob({
        jobId,
        email: data.email,
        phone: data.phone,
        resumeUrl,
        coverMessage: data.coverMessage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { apply, isSubmitting, error };
}
