import { requireRole } from '@/server/guards/require-role';
import { getLandlordListingsWithDetails, getLandlordListingsCount } from '@/server/services/listings.service';
import { getLandlordBookings } from '@/server/services/bookings.service';
import { getProfile } from '@/server/services/profiles.service';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListingsTable } from '@/components/dashboard/listings-table';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { DashboardSection } from '@/components/dashboard/dashboard-section';
import { N9LandlordSection } from '@/components/n9/N9LandlordSection';

export default async function LandlordDashboardPage() {
  const user = await requireRole('landlord');
  const profile = await getProfile(user.id);
  const count = await getLandlordListingsCount(user.id);
  const [listings, bookings] = await Promise.all([
    getLandlordListingsWithDetails(user.id),
    getLandlordBookings(user.id),
  ]);

  const activeApplications = bookings.filter((booking) => booking.status === 'requested').length;
  const pendingApprovals = bookings.filter((booking) => booking.status === 'approved').length;
  const recentListings = listings.slice(0, 6);

  return (
    <DashboardSection
      breadcrumb={[{ label: 'Dashboard', href: '/dashboard/landlord' }, { label: 'Overview' }]}
      title="Overview"
      description="Your listings, applications, and revenue at a glance."
      action={
        <Button asChild size="sm">
          <Link href="/dashboard/landlord/listings?create=1">Create listing</Link>
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total listings" value={`${count}`} trend="Across all active and draft properties" />
        <KpiCard title="Active applications" value={`${activeApplications}`} trend="Awaiting landlord decision" />
        <KpiCard title="Pending approvals" value={`${pendingApprovals}`} trend="Require payment follow-up" />
        <KpiCard
          title="Revenue (MTD)"
          value={count === 0 ? '—' : '$0'}
          trend={count === 0 ? 'Create listings to get started' : 'From approved bookings'}
        />
      </div>

      {profile?.verification_state !== 'verified' && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200/60 bg-amber-50/50 px-4 py-3.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <ShieldAlert className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-amber-900">Verification pending</p>
            <p className="mt-0.5 text-sm text-amber-700/80">
              Complete your identity verification to publish listings and approve tenants.
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="shrink-0 border-amber-300 text-amber-800 hover:bg-amber-100/60">
            <Link href="/dashboard/profile">Verify now</Link>
          </Button>
        </div>
      )}

      <N9LandlordSection />

      <Card>
        <CardHeader className="flex items-center justify-between gap-3 md:flex-row">
          <div>
            <CardTitle>Listings overview</CardTitle>
            <CardDescription>Manage and monitor your most recent properties.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/landlord/listings?create=1">Create listing</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentListings.length ? (
            <ListingsTable listings={recentListings} />
          ) : (
            <p className="text-sm text-muted-foreground">No listings found. Create your first listing to get started.</p>
          )}
        </CardContent>
      </Card>

      <ActivityFeed
        title="Applications activity"
        items={bookings.slice(0, 5).map((booking) => ({
          id: booking.id,
          title: `Booking request ${booking.id.slice(0, 8)}`,
          meta: `${booking.status} · ${new Date(booking.requested_at).toLocaleDateString()}`,
          tone: booking.status === 'requested' ? 'warning' : 'default',
        }))}
      />
    </DashboardSection>
  );
}
