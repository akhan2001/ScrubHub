import {
  fetchBookingById,
  fetchBookingsForLandlord,
  fetchBookingsForLandlordWithTenantProfile,
  fetchBookingsForTenant,
  fetchPaymentByBookingId,
  insertBooking,
  insertBookingEvent,
  updatePaymentStatusByIntentId,
  updateBookingStatus,
  upsertPayment,
} from '@/server/repositories/bookings.repository';
import { getListingOwnerById } from '@/server/services/listings.service';
import { createPaymentIntent } from '@/lib/integrations/stripe';
import { sendSms } from '@/lib/integrations/twilio';
import { logAuditEvent } from '@/server/services/audit.service';
import { evaluateApplication } from '@/server/services/screening.service';
import { tryCreateLeaseFromApproval } from '@/server/services/leases.service';
import type { BookingStatus } from '@/types/database';

export async function getTenantBookings(tenantUserId: string) {
  return fetchBookingsForTenant(tenantUserId);
}

export async function getLandlordBookings(landlordUserId: string) {
  return fetchBookingsForLandlord(landlordUserId);
}

export async function getLandlordBookingsWithProfiles(landlordUserId: string) {
  return fetchBookingsForLandlordWithTenantProfile(landlordUserId);
}

export async function createBookingForTenant(input: {
  listingId: string;
  tenantUserId: string;
  notes?: string;
  moveInDateRequested?: string;
  messageToLandlord?: string;
}) {
  const listing = await getListingOwnerById(input.listingId);
  if (!listing || listing.status !== 'published') {
    throw new Error('Listing is not available for booking');
  }

  const booking = await insertBooking({
    listing_id: input.listingId,
    tenant_user_id: input.tenantUserId,
    landlord_user_id: listing.user_id,
    notes: input.notes ?? null,
    move_in_date_requested: input.moveInDateRequested ?? null,
    message_to_landlord: input.messageToLandlord ?? null,
  });

  await insertBookingEvent({
    booking_id: booking.id,
    actor_user_id: input.tenantUserId,
    event_type: 'booking_requested',
    payload: { listingId: input.listingId },
  });

  await logAuditEvent({
    actorUserId: input.tenantUserId,
    source: 'bookings.service',
    eventName: 'booking.requested',
    payload: { bookingId: booking.id, listingId: input.listingId },
  });

  try {
    await evaluateApplication(booking.id);
  } catch {
    // Screening evaluation failures should not block booking creation
  }

  return booking;
}

export async function setBookingStatus(input: {
  bookingId: string;
  actorUserId: string;
  nextStatus: BookingStatus;
}) {
  const booking = await fetchBookingById(input.bookingId);
  if (!booking) throw new Error('Booking not found');

  const allowedActor =
    booking.tenant_user_id === input.actorUserId || booking.landlord_user_id === input.actorUserId;
  if (!allowedActor) {
    throw new Error('Not allowed to update booking');
  }

  await updateBookingStatus(input.bookingId, input.nextStatus);
  await insertBookingEvent({
    booking_id: input.bookingId,
    actor_user_id: input.actorUserId,
    event_type: 'booking_status_updated',
    payload: { status: input.nextStatus },
  });

  if (input.nextStatus === 'approved') {
    try {
      await tryCreateLeaseFromApproval(input.bookingId);
    } catch {
      // Lease creation failure should not block the booking approval
    }
  }

  const notifyPhone = process.env.DEFAULT_BOOKING_ALERT_PHONE;
  if (notifyPhone) {
    await sendSms({
      to: notifyPhone,
      body: `Booking ${input.bookingId} updated to ${input.nextStatus}.`,
    });
  }
}

export async function createBookingPaymentIntent(input: {
  bookingId: string;
  actorUserId: string;
  amountCents: number;
}) {
  const booking = await fetchBookingById(input.bookingId);
  if (!booking) throw new Error('Booking not found');
  if (booking.tenant_user_id !== input.actorUserId) {
    throw new Error('Only booking tenant can create payment intent');
  }

  const intent = await createPaymentIntent({
    amountCents: input.amountCents,
    metadata: {
      bookingId: input.bookingId,
      tenantUserId: input.actorUserId,
    },
  });

  await upsertPayment({
    booking_id: input.bookingId,
    stripe_payment_intent_id: intent.id,
    amount_cents: input.amountCents,
    status: intent.status === 'succeeded' ? 'succeeded' : 'requires_action',
  });

  return intent;
}

export async function getBookingPayment(bookingId: string) {
  return fetchPaymentByBookingId(bookingId);
}

export async function setPaymentStatusFromWebhook(intentId: string, status: 'succeeded' | 'failed') {
  await updatePaymentStatusByIntentId(intentId, status);
}
