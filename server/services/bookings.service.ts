import {
  fetchBookingById,
  fetchBookingsForLandlord,
  fetchBookingsForLandlordWithTenantProfile,
  fetchBookingsForTenant,
  fetchBookingsForTenantWithListing,
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
import {
  voidSendBookingApprovedToTenant,
  voidSendBookingApplicationSubmittedToTenant,
  voidSendBookingRejectedToTenant,
  voidSendBookingRequestToLandlord,
  voidSendPaymentReceivedToLandlord,
} from '@/lib/email/send-transactional';
import { insertNotificationLog } from '@/server/repositories/notification-logs.repository';
import { emailAppPath } from '@/lib/email/urls';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import type { BookingStatus } from '@/types/database';

export async function getTenantBookings(tenantUserId: string) {
  return fetchBookingsForTenant(tenantUserId);
}

export async function getTenantBookingsWithListing(tenantUserId: string) {
  return fetchBookingsForTenantWithListing(tenantUserId);
}

export async function getLandlordBookings(landlordUserId: string) {
  return fetchBookingsForLandlord(landlordUserId);
}

export async function getLandlordBookingsWithProfiles(landlordUserId: string) {
  return fetchBookingsForLandlordWithTenantProfile(landlordUserId);
}

export type BookingLandlordNotify = {
  landlordUserId: string;
  landlordEmail: string | null | undefined;
  landlordName: string | null | undefined;
  tenantName: string | null | undefined;
  listingTitle: string;
  listingAddress?: string | null;
  moveInDate?: string | null;
  message?: string | null;
};

/** Confirmation email + metadata for the tenant who submitted the application. */
export type BookingTenantApplicationSubmittedNotify = {
  tenantUserId: string;
  tenantEmail: string | null | undefined;
  tenantName: string | null | undefined;
  listingTitle: string;
  listingAddress?: string | null;
  moveInDate?: string | null;
  messageToLandlord?: string | null;
};

export async function createBookingForTenant(input: {
  listingId: string;
  tenantUserId: string;
  notes?: string;
  moveInDateRequested?: string;
  messageToLandlord?: string;
  /** Resolved in actions layer — never fetch recipient email inside this flow. */
  notifyLandlord?: BookingLandlordNotify;
  notifyTenant?: BookingTenantApplicationSubmittedNotify;
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

  if (input.notifyLandlord) {
    voidSendBookingRequestToLandlord({
      ...input.notifyLandlord,
      approvalsUrl: emailAppPath('/dashboard/landlord/approvals'),
    });
  }

  if (input.notifyTenant) {
    try {
      await insertNotificationLog({
        user_id: input.notifyTenant.tenantUserId,
        event_type: 'booking_application_submitted',
        title: 'Application submitted',
        body: `Your application for “${input.notifyTenant.listingTitle}” was sent to the landlord.`,
        metadata: {
          bookingId: booking.id,
          listingId: input.listingId,
          listingTitle: input.notifyTenant.listingTitle,
        },
      });
    } catch {
      /* non-blocking */
    }
    voidSendBookingApplicationSubmittedToTenant({
      ...input.notifyTenant,
      bookingsUrl: emailAppPath('/dashboard/tenant/bookings'),
    });
  }

  return booking;
}

export type BookingTenantNotify = {
  tenantUserId: string;
  tenantEmail: string | null | undefined;
  tenantName: string | null | undefined;
  listingTitle: string;
  listingAddress?: string | null;
};

export async function setBookingStatus(input: {
  bookingId: string;
  actorUserId: string;
  nextStatus: BookingStatus;
  /** Resolved in actions layer. */
  notifyTenant?: BookingTenantNotify;
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

  if (input.notifyTenant) {
    const n = input.notifyTenant;
    if (input.nextStatus === 'approved') {
      voidSendBookingApprovedToTenant({
        tenantUserId: n.tenantUserId,
        tenantEmail: n.tenantEmail,
        tenantName: n.tenantName,
        listingTitle: n.listingTitle,
        listingAddress: n.listingAddress,
        bookingsUrl: emailAppPath('/dashboard/tenant/bookings'),
      });
    } else if (input.nextStatus === 'rejected' || input.nextStatus === 'cancelled') {
      voidSendBookingRejectedToTenant({
        tenantUserId: n.tenantUserId,
        tenantEmail: n.tenantEmail,
        tenantName: n.tenantName,
        listingTitle: n.listingTitle,
        listingsUrl: emailAppPath('/dashboard/listings'),
      });
    }
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

  if (status !== 'succeeded') return;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.warn('[bookings] SUPABASE_SERVICE_ROLE_KEY unset — skipping payment confirmation email');
    return;
  }

  const admin = createSupabaseAdmin(url, serviceKey);
  const { data: payment } = await admin
    .from('payments')
    .select('booking_id, amount_cents')
    .eq('stripe_payment_intent_id', intentId)
    .maybeSingle();

  if (!payment?.booking_id) return;

  const { data: booking } = await admin
    .from('bookings')
    .select('listing_id, landlord_user_id, tenant_user_id')
    .eq('id', payment.booking_id)
    .maybeSingle();

  if (!booking) return;

  const [{ data: listing }, { data: landlordProfile }, { data: tenantProfile }] = await Promise.all([
    admin.from('listings').select('title').eq('id', booking.listing_id).maybeSingle(),
    admin.from('profiles').select('email, full_name').eq('id', booking.landlord_user_id).maybeSingle(),
    admin.from('profiles').select('full_name').eq('id', booking.tenant_user_id).maybeSingle(),
  ]);

  const amountFormatted = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format((payment.amount_cents as number) / 100);

  voidSendPaymentReceivedToLandlord({
    landlordUserId: booking.landlord_user_id as string,
    landlordEmail: (landlordProfile as { email?: string } | null)?.email,
    landlordName: (landlordProfile as { full_name?: string } | null)?.full_name,
    amountFormatted,
    tenantName: (tenantProfile as { full_name?: string } | null)?.full_name ?? 'Tenant',
    listingTitle: (listing as { title?: string } | null)?.title ?? 'Your listing',
    dashboardUrl: emailAppPath('/dashboard/landlord/bookings'),
  });
}
