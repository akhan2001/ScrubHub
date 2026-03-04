import { requireRole } from '@/server/guards/require-role';
import { getLandlordBookings } from '@/server/services/bookings.service';
import { BookingApprovalActions } from '@/components/landlord/booking-approval-actions';
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

export default async function LandlordApprovalsPage() {
  const user = await requireRole('landlord');
  const bookings = await getLandlordBookings(user.id);

  return (
    <DashboardSection
      breadcrumb={[{ label: 'Dashboard', href: '/dashboard/landlord' }, { label: 'Approvals' }]}
      title="Approvals"
      description="Review booking requests and process landlord decisions."
    >
      <Card>
        <CardHeader>
          <CardTitle>Pending workflow</CardTitle>
          <CardDescription>All booking records requiring landlord action.</CardDescription>
        </CardHeader>
        <CardContent>
          {!bookings.length ? (
            <p className="text-sm text-muted-foreground">No pending booking activity.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id.slice(0, 10)}</TableCell>
                    <TableCell className="text-muted-foreground">{booking.tenant_user_id.slice(0, 10)}</TableCell>
                    <TableCell>
                      <Badge variant={booking.status === 'requested' ? 'default' : 'secondary'} className="capitalize">
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(booking.requested_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {booking.status === 'requested' ? (
                        <BookingApprovalActions bookingId={booking.id} />
                      ) : (
                        <span className="text-xs text-muted-foreground">No action</span>
                      )}
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
