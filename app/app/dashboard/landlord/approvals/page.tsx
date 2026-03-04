import { requireRole } from '@/server/guards/require-role';
import { getLandlordBookings } from '@/server/services/bookings.service';
import { BookingApprovalActions } from '@/components/landlord/booking-approval-actions';

export default async function LandlordApprovalsPage() {
  const user = await requireRole('landlord');
  const bookings = await getLandlordBookings(user.id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Booking approvals</h1>
      {!bookings.length ? (
        <p className="text-muted-foreground">No pending booking activity.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <li key={booking.id} className="rounded-md border border-border p-3">
              <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
              <p className="text-sm text-muted-foreground">Tenant ID: {booking.tenant_user_id}</p>
              <p className="capitalize">Status: {booking.status}</p>
              {booking.status === 'requested' && <BookingApprovalActions bookingId={booking.id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
