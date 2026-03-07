'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { JobApplyForm } from '@/components/jobs/job-apply-form';
import { getAppLoginUrl, getAppSignupUrl } from '@/lib/app-url';

interface JobApplyButtonProps {
  jobId: string;
  redirectTo: string;
  user: { id: string; email?: string; phone?: string; role: string } | null;
  loginUrl?: string;
}

export function JobApplyButton({ jobId, redirectTo, user, loginUrl: loginUrlProp }: JobApplyButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const loginUrl = loginUrlProp ?? getAppLoginUrl();

  if (!user) {
    const url = loginUrl.includes('?')
      ? `${loginUrl}&redirectTo=${encodeURIComponent(redirectTo)}`
      : `${loginUrl}?redirectTo=${encodeURIComponent(redirectTo)}`;
    return (
      <Button asChild size="lg">
        <Link href={url}>Sign in to apply</Link>
      </Button>
    );
  }

  if (user.role !== 'tenant') {
    return (
      <div className="space-y-2">
        <Button size="lg" disabled>
          Tenant account required to apply
        </Button>
        <p className="text-sm text-muted-foreground">
          Create a free tenant account to apply for jobs.{' '}
          <Link href={getAppSignupUrl()} className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    );
  }

  if (showForm) {
    return (
      <JobApplyForm
        jobId={jobId}
        defaultEmail={user.email}
        defaultPhone={user.phone}
        onSuccess={() => setShowForm(false)}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <Button size="lg" onClick={() => setShowForm(true)}>
      Apply for this job
    </Button>
  );
}
