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

export interface BookingWithTenantProfile {
  id: string;
  listing_id: string;
  status: BookingStatus;
  requested_at: string;
  move_in_date_requested: string | null;
  message_to_landlord: string | null;
  screening_result: unknown;
  credit_check_result: unknown;
  background_check_result: unknown;
  tenant_user_id: string;
  tenant_name: string | null;
  tenant_email: string | null;
  tenant_phone: string | null;
  listing_title: string | null;
}

export async function fetchBookingsForLandlordWithTenantProfile(
  landlordUserId: string
): Promise<BookingWithTenantProfile[]> {
  const supabase = await createClient();

  const { data: bookings, error: bookingsErr } = await supabase
    .from('bookings')
    .select(`
      id, listing_id, status, requested_at, move_in_date_requested,
      message_to_landlord, screening_result, credit_check_result,
      background_check_result, tenant_user_id
    `)
    .eq('landlord_user_id', landlordUserId)
    .order('requested_at', { ascending: false });

  if (bookingsErr) throw bookingsErr;
  if (!bookings || bookings.length === 0) return [];

  const tenantIds = [...new Set(bookings.map((b) => b.tenant_user_id))];
  const listingIds = [...new Set(bookings.map((b) => b.listing_id))];

  const [profilesRes, listingsRes] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email, phone_number')
      .in('id', tenantIds),
    supabase
      .from('listings')
      .select('id, title')
      .in('id', listingIds),
  ]);

  const profileMap = new Map(
    (profilesRes.data ?? []).map((p: Record<string, unknown>) => [p.id as string, p])
  );
  const listingMap = new Map(
    (listingsRes.data ?? []).map((l: Record<string, unknown>) => [l.id as string, l])
  );

  return bookings.map((row) => {
    const profile = profileMap.get(row.tenant_user_id);
    const listing = listingMap.get(row.listing_id);
    return {
      id: row.id,
      listing_id: row.listing_id,
      status: row.status as BookingStatus,
      requested_at: row.requested_at,
      move_in_date_requested: row.move_in_date_requested,
      message_to_landlord: row.message_to_landlord,
      screening_result: row.screening_result,
      credit_check_result: row.credit_check_result,
      background_check_result: row.background_check_result,
      tenant_user_id: row.tenant_user_id,
      tenant_name: (profile?.full_name as string) ?? null,
      tenant_email: (profile?.email as string) ?? null,
      tenant_phone: (profile?.phone_number as string) ?? null,
      listing_title: (listing?.title as string) ?? null,
    };
  });
}

export async function insertBooking(input: {
  listing_id: string;
  tenant_user_id: string;
  landlord_user_id: string;
  notes?: string | null;
  move_in_date_requested?: string | null;
  message_to_landlord?: string | null;
}): Promise<Pick<Booking, 'id'>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      listing_id: input.listing_id,
      tenant_user_id: input.tenant_user_id,
      landlord_user_id: input.landlord_user_id,
      notes: input.notes ?? null,
      move_in_date_requested: input.move_in_date_requested ?? null,
      message_to_landlord: input.message_to_landlord ?? null,
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

export async function updateBookingScreeningResults(
  bookingId: string,
  results: {
    screening_result?: unknown;
    credit_check_result?: unknown;
    background_check_result?: unknown;
  }
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('bookings')
    .update(results)
    .eq('id', bookingId);

  if (error) throw error;
}

export async function fetchBookingById(
  bookingId: string
): Promise<Pick<Booking, 'id' | 'listing_id' | 'tenant_user_id' | 'landlord_user_id' | 'status' | 'move_in_date_requested'> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('id, listing_id, tenant_user_id, landlord_user_id, status, move_in_date_requested')
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
    { onConflict: 'booking_id' }
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
