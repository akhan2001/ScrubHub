'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ApplyButton } from '@/components/listings/apply-button';
import { getTenantApplicationContext } from '@/actions/tenant-application';

type FacilityMapListingApplyProps = {
  listingId: string;
  /** Path to redirect to after login (e.g. /dashboard/listings or /facility-map) */
  redirectPath?: string;
};

/**
 * Auth-aware apply block for the facility map (dashboard/listings).
 * Used when a tenant selects a listing from search or map — provides
 * Sign in, Apply, or profile completion CTAs.
 */
export function FacilityMapListingApply({
  listingId,
  redirectPath = '/dashboard/listings',
}: FacilityMapListingApplyProps) {
  const [appContext, setAppContext] = useState<
    Awaited<ReturnType<typeof getTenantApplicationContext>> | undefined
  >(undefined);

  useEffect(() => {
    setAppContext(undefined);
    getTenantApplicationContext().then(setAppContext);
  }, [listingId]);

  if (appContext === undefined) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-muted/50 py-2.5">
        <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (appContext === null) {
    return (
      <div className="space-y-2">
        <Button asChild className="w-full" size="lg">
          <Link
            href={`/login?redirectTo=${encodeURIComponent(redirectPath)}`}
          >
            Sign in to apply
          </Link>
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          or{' '}
          <Link href="/signup" className="font-medium text-primary hover:underline">
            sign up
          </Link>{' '}
          to create an account
        </p>
      </div>
    );
  }

  if (appContext.role !== 'tenant') {
    return (
      <div className="space-y-2">
        <p className="text-center text-xs text-muted-foreground">
          Switch to a tenant account to apply for this property.
        </p>
        <Button asChild variant="outline" className="w-full" size="sm">
          <Link href="/dashboard/profile">Go to Profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/10 bg-primary/[0.03] p-4">
      <ApplyButton listingId={listingId} completeness={appContext.profileCompleteness} />
    </div>
  );
}
