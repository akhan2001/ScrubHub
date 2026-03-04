import { requireRole } from '@/server/guards/require-role';
import { getTenantBookings } from '@/server/services/bookings.service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function TenantDashboardPage() {
  const user = await requireRole('tenant');
  const bookings = await getTenantBookings(user.id);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Tenant dashboard</h1>
      <p className="text-muted-foreground">
        You currently have <strong className="text-foreground">{bookings.length}</strong> booking request
        {bookings.length === 1 ? '' : 's'}.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/listings">Search listings</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/tenant/bookings">View bookings</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/tenant/profile">Profile</Link>
        </Button>
      </div>
    </div>
  );
}
