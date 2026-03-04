import { createClient } from '@/lib/supabase/server';
import type { Booking, BookingStatus, Payment, PaymentStatus } from '@/types/database';

export async function fetchBookingsForTenant(
  tenantUserId: string
): Promise<Pick<Booking, 'id' | 'listing_id' | 'status' | 'requested_at'>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('id, listing_id, status, requested_at')
    .eq('tenant_user_id', tenantUserId)
    .order('requested_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchBookingsForLandlord(
  landlordUserId: string
): Promise<Pick<Booking, 'id' | 'listing_id' | 'status' | 'requested_at' | 'tenant_user_id'>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('id, listing_id, status, requested_at, tenant_user_id')
    .eq('landlord_user_id', landlordUserId)
    .order('requested_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function insertBooking(input: {
  listing_id: string;
  tenant_user_id: string;
  landlord_user_id: string;
  notes?: string | null;
}): Promise<Pick<Booking, 'id'>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      listing_id: input.listing_id,
      tenant_user_id: input.tenant_user_id,
      landlord_user_id: input.landlord_user_id,
      notes: input.notes ?? null,
      status: 'requested',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) throw error;
}

export async function fetchBookingById(
  bookingId: string
): Promise<Pick<Booking, 'id' | 'listing_id' | 'tenant_user_id' | 'landlord_user_id' | 'status'> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('id, listing_id, tenant_user_id, landlord_user_id, status')
    .eq('id', bookingId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function insertBookingEvent(input: {
  booking_id: string;
  actor_user_id: string;
  event_type: string;
  payload?: Record<string, unknown>;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('booking_events').insert({
    booking_id: input.booking_id,
    actor_user_id: input.actor_user_id,
    event_type: input.event_type,
    payload: input.payload ?? {},
  });

  if (error) throw error;
}

export async function upsertPayment(input: {
  booking_id: string;
  stripe_payment_intent_id?: string | null;
  amount_cents: number;
  currency?: string;
  status?: PaymentStatus;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('payments').upsert(
    {
      booking_id: input.booking_id,
      stripe_payment_intent_id: input.stripe_payment_intent_id ?? null,
      amount_cents: input.amount_cents,
      currency: input.currency ?? 'usd',
      status: input.status ?? 'pending',
    },
    {
      onConflict: 'booking_id',
    }
  );

  if (error) throw error;
}

export async function fetchPaymentByBookingId(
  bookingId: string
): Promise<Pick<Payment, 'id' | 'booking_id' | 'status' | 'amount_cents' | 'stripe_payment_intent_id'> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('payments')
    .select('id, booking_id, status, amount_cents, stripe_payment_intent_id')
    .eq('booking_id', bookingId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function updatePaymentStatusByIntentId(
  intentId: string,
  status: PaymentStatus
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('payments')
    .update({ status })
    .eq('stripe_payment_intent_id', intentId);

  if (error) throw error;
}
