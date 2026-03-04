import { requireRole } from '@/server/guards/require-role';
import { getLandlordListings, getLandlordListingsCount } from '@/server/services/listings.service';
import { getLandlordBookings } from '@/server/services/bookings.service';
import { getProfile } from '@/server/services/profiles.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListingsTable } from '@/components/dashboard/listings-table';
import { ActivityFeed } from '@/components/dashboard/activity-feed';

export default async function LandlordDashboardPage() {
  const user = await requireRole('landlord');
  const profile = await getProfile(user.id);
  const count = await getLandlordListingsCount(user.id);
  const [listings, bookings] = await Promise.all([
    getLandlordListings(user.id),
    getLandlordBookings(user.id),
  ]);

  const activeApplications = bookings.filter((booking) => booking.status === 'requested').length;
  const pendingApprovals = bookings.filter((booking) => booking.status === 'approved').length;
  const rows = listings.slice(0, 6).map((listing) => ({
    id: listing.id,
    property: listing.title,
    status: listing.status,
    applications: bookings.filter((booking) => booking.listing_id === listing.id).length,
    createdAt: new Date(listing.created_at).toLocaleDateString(),
  }));

  return (
    <section className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total listings" value={`${count}`} trend="Across all active and draft properties" />
        <KpiCard title="Active applications" value={`${activeApplications}`} trend="Awaiting landlord decision" />
        <KpiCard title="Pending approvals" value={`${pendingApprovals}`} trend="Require payment follow-up" />
        <KpiCard title="Revenue (MTD)" value="$12,450" trend="+8.2% compared to last month" />
      </div>

      {profile?.verification_state !== 'verified' && (
        <Alert tone="warning">
          <AlertTitle>Verification required</AlertTitle>
          <AlertDescription>
            Your landlord verification is <strong>{profile?.verification_state}</strong>. Listing creation and approvals are restricted until you are verified.
          </AlertDescription>
        </Alert>
      )}

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
          {rows.length ? (
            <ListingsTable rows={rows} />
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
    </section>
  );
}
