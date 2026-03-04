import { requireRole } from '@/server/guards/require-role';
import { getTenantBookings } from '@/server/services/bookings.service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function TenantDashboardPage() {
  const user = await requireRole('tenant');
  const bookings = await getTenantBookings(user.id);

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader className="flex items-start justify-between gap-4 sm:flex-row">
          <div>
            <CardTitle className="text-2xl text-foreground">Tenant dashboard</CardTitle>
          </div>
          <Badge variant="info" className="mt-1">
            Active requests: {bookings.length}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </section>
  );
}
