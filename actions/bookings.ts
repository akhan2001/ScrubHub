'use server';

import { requireVerifiedRole } from '@/server/guards/require-verified-role';
import {
  createBookingForTenant,
  createBookingPaymentIntent,
  setBookingStatus,
} from '@/server/services/bookings.service';
import {
  createBookingSchema,
  createPaymentSchema,
  updateBookingStatusSchema,
} from '@/lib/validation/schemas';
import { ValidationError } from '@/server/errors/app-error';

export async function createBooking(input: {
  listingId: string;
  notes?: string;
  moveInDateRequested?: string;
  messageToLandlord?: string;
}) {
  const parsed = createBookingSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message);
  }

  const user = await requireVerifiedRole('tenant', { onFailure: 'throw' });
  return createBookingForTenant({
    listingId: parsed.data.listingId,
    tenantUserId: user.id,
    notes: parsed.data.notes,
    moveInDateRequested: parsed.data.moveInDateRequested,
    messageToLandlord: parsed.data.messageToLandlord,
  });
}

export async function updateBookingStatus(input: {
  bookingId: string;
  status: 'approved' | 'rejected' | 'cancelled' | 'completed' | 'reviewing' | 'withdrawn';
}) {
  const parsed = updateBookingStatusSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message);
  }

  const user = await requireVerifiedRole('landlord', { onFailure: 'throw' });
  await setBookingStatus({
    bookingId: parsed.data.bookingId,
    actorUserId: user.id,
    nextStatus: parsed.data.status,
  });
}

export async function createBookingPayment(input: {
  bookingId: string;
  amountCents: number;
}) {
  const parsed = createPaymentSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message);
  }

  const user = await requireVerifiedRole('tenant', { onFailure: 'throw' });
  return createBookingPaymentIntent({
    bookingId: parsed.data.bookingId,
    actorUserId: user.id,
    amountCents: parsed.data.amountCents,
  });
}
