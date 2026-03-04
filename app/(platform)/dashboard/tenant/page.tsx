import { requireRole } from '@/server/guards/require-role';
import { getTenantBookings } from '@/server/services/bookings.service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { DashboardSection } from '@/components/dashboard/dashboard-section';

export default async function TenantDashboardPage() {
  const user = await requireRole('tenant');
  const bookings = await getTenantBookings(user.id);
  const requested = bookings.filter((booking) => booking.status === 'requested').length;
  const approved = bookings.filter((booking) => booking.status === 'approved').length;
  const completed = bookings.filter((booking) => booking.status === 'completed').length;

  return (
    <DashboardSection
      breadcrumb={[{ label: 'Dashboard', href: '/dashboard/tenant' }, { label: 'Tenant workspace' }]}
      title="Tenant workspace"
      description="Track booking status and discover listings."
      action={
        <Button asChild size="sm">
          <Link href="/listings">Search listings</Link>
        </Button>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total requests" value={`${bookings.length}`} trend="All booking applications" />
        <KpiCard title="Awaiting response" value={`${requested}`} trend="Landlord action required" />
        <KpiCard title="Approved stays" value={`${approved}`} trend="Ready for payment and move-in" />
        <KpiCard title="Completed" value={`${completed}`} trend="Historical successful stays" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Move through your booking lifecycle faster.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/tenant/bookings">View bookings</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/tenant/profile">Profile settings</Link>
          </Button>
        </CardContent>
      </Card>

      <ActivityFeed
        title="Booking activity"
        items={bookings.slice(0, 6).map((booking) => ({
          id: booking.id,
          title: `Booking ${booking.id.slice(0, 8)} is ${booking.status}`,
          meta: new Date(booking.requested_at).toLocaleDateString(),
          tone: booking.status === 'approved' ? 'success' : booking.status === 'requested' ? 'warning' : 'default',
        }))}
      />
    </DashboardSection>
  );
}
