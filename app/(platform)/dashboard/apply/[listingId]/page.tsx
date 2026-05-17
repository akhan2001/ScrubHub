import { redirect } from 'next/navigation';

/**
 * Tenant application moved to /(marketing)/listings/[id]/apply.
 * Kept as a permanent redirect so any cached link, email, or in-flight
 * OAuth bounce that still targets /dashboard/apply/[id] continues to work.
 */
export default async function DeprecatedDashboardApplyRoute({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  redirect(`/listings/${listingId}/apply`);
}
