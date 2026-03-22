'use server';

import { requireVerifiedRole } from '@/server/guards/require-verified-role';
import {
  createBookingForTenant,
  createBookingPaymentIntent,
  setBookingStatus,
} from '@/server/services/bookings.service';
import { getListingById } from '@/server/services/listings.service';
import { fetchProfileById } from '@/server/repositories/profiles.repository';
import { fetchBookingById } from '@/server/repositories/bookings.repository';
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

  const listing = await getListingById(parsed.data.listingId);
  if (!listing || listing.status !== 'published') {
    throw new ValidationError('Listing is not available for booking');
  }

  const [landlordProfile, tenantProfile] = await Promise.all([
    fetchProfileById(listing.user_id),
    fetchProfileById(user.id),
  ]);

  const tenantEmail = user.email ?? tenantProfile?.email ?? null;

  return createBookingForTenant({
    listingId: parsed.data.listingId,
    tenantUserId: user.id,
    notes: parsed.data.notes,
    moveInDateRequested: parsed.data.moveInDateRequested,
    messageToLandlord: parsed.data.messageToLandlord,
    notifyLandlord: {
      landlordUserId: listing.user_id,
      landlordEmail: landlordProfile?.email,
      landlordName: landlordProfile?.full_name,
      tenantName: tenantProfile?.full_name,
      listingTitle: listing.title,
      listingAddress: listing.address,
      moveInDate: parsed.data.moveInDateRequested,
      message: parsed.data.messageToLandlord,
    },
    notifyTenant: {
      tenantUserId: user.id,
      tenantEmail,
      tenantName: tenantProfile?.full_name,
      listingTitle: listing.title,
      listingAddress: listing.address,
      moveInDate: parsed.data.moveInDateRequested,
      messageToLandlord: parsed.data.messageToLandlord,
    },
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

  const booking = await fetchBookingById(parsed.data.bookingId);
  if (!booking) throw new ValidationError('Booking not found');

  const [listing, tenantProfile] = await Promise.all([
    getListingById(booking.listing_id),
    fetchProfileById(booking.tenant_user_id),
  ]);

  await setBookingStatus({
    bookingId: parsed.data.bookingId,
    actorUserId: user.id,
    nextStatus: parsed.data.status,
    notifyTenant: {
      tenantUserId: booking.tenant_user_id,
      tenantEmail: tenantProfile?.email,
      tenantName: tenantProfile?.full_name,
      listingTitle: listing?.title ?? 'Listing',
      listingAddress: listing?.address,
    },
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
