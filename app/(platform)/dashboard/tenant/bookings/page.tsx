import { requireRole } from '@/server/guards/require-role';
import { getTenantBookings } from '@/server/services/bookings.service';
import { CreatePaymentForm } from '@/components/bookings/create-payment-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DashboardSection } from '@/components/dashboard/dashboard-section';

export default async function TenantBookingsPage() {
  const user = await requireRole('tenant');
  const bookings = await getTenantBookings(user.id);

  return (
    <DashboardSection title="My bookings" description="Track booking requests and complete payments.">
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>All current booking activity for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          {!bookings.length ? (
            <p className="text-sm text-muted-foreground">No booking requests yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Payment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Badge variant={booking.status === 'approved' ? 'success' : 'secondary'} className="capitalize">
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(booking.requested_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <CreatePaymentForm bookingId={booking.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
