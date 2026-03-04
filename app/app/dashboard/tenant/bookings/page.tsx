import { requireRole } from '@/server/guards/require-role';
import { getTenantBookings } from '@/server/services/bookings.service';
import { CreatePaymentForm } from '@/components/bookings/create-payment-form';

export default async function TenantBookingsPage() {
  const user = await requireRole('tenant');
  const bookings = await getTenantBookings(user.id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-foreground">My bookings</h1>
      {!bookings.length ? (
        <p className="text-muted-foreground">No booking requests yet.</p>
      ) : (
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <li key={booking.id} className="rounded-md border border-border p-3">
              <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
              <p className="capitalize">Status: {booking.status}</p>
              <CreatePaymentForm bookingId={booking.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
