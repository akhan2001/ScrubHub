import {
  insertLease,
  fetchLeaseById,
  fetchLeasesForTenant,
  fetchLeasesForLandlord,
  updateLeaseStatus,
} from '@/server/repositories/leases.repository';
import { fetchBookingById } from '@/server/repositories/bookings.repository';
import { logAuditEvent } from '@/server/services/audit.service';
import type { Lease, LeaseStatus, LeaseType, RentalPeriod } from '@/types/database';
import { createClient } from '@/lib/supabase/server';

export async function createLeaseFromBooking(input: {
  bookingId: string;
  leaseType?: LeaseType;
  rentalPeriod?: RentalPeriod;
  startDate: string;
  endDate?: string;
  monthlyRentCents: number;
}): Promise<Pick<Lease, 'id'>> {
  const booking = await fetchBookingById(input.bookingId);
  if (!booking) throw new Error('Booking not found');
  if (booking.status !== 'approved') throw new Error('Booking must be approved to create a lease');

  const lease = await insertLease({
    booking_id: input.bookingId,
    listing_id: booking.listing_id,
    tenant_user_id: booking.tenant_user_id,
    landlord_user_id: booking.landlord_user_id,
    lease_type: input.leaseType ?? 'monthly',
    rental_period: input.rentalPeriod ?? 'monthly',
    start_date: input.startDate,
    end_date: input.endDate ?? null,
    monthly_rent_cents: input.monthlyRentCents,
  });

  await logAuditEvent({
    actorUserId: booking.landlord_user_id,
    source: 'leases.service',
    eventName: 'lease.created',
    payload: { leaseId: lease.id, bookingId: input.bookingId },
  });

  return lease;
}

export async function getLeaseById(leaseId: string): Promise<Lease | null> {
  return fetchLeaseById(leaseId);
}

export async function getActiveLeasesForTenant(tenantUserId: string): Promise<Lease[]> {
  return fetchLeasesForTenant(tenantUserId, ['active']);
}

export async function getAllLeasesForTenant(tenantUserId: string): Promise<Lease[]> {
  return fetchLeasesForTenant(tenantUserId);
}

export async function getLeasesForLandlord(
  landlordUserId: string,
  statusFilter?: LeaseStatus[]
): Promise<Lease[]> {
  return fetchLeasesForLandlord(landlordUserId, statusFilter);
}

export async function setLeaseStatus(
  leaseId: string,
  status: LeaseStatus,
  actorUserId: string
): Promise<void> {
  await updateLeaseStatus(leaseId, status);

  await logAuditEvent({
    actorUserId,
    source: 'leases.service',
    eventName: 'lease.status_changed',
    payload: { leaseId, status },
  });
}

export async function tryCreateLeaseFromApproval(bookingId: string): Promise<void> {
  const booking = await fetchBookingById(bookingId);
  if (!booking || booking.status !== 'approved') return;

  const supabase = await createClient();
  const { data: listing } = await supabase
    .from('listings')
    .select('price_cents')
    .eq('id', booking.listing_id)
    .single();

  const startDate =
    booking.move_in_date_requested ?? new Date().toISOString().split('T')[0];

  await insertLease({
    booking_id: bookingId,
    listing_id: booking.listing_id,
    tenant_user_id: booking.tenant_user_id,
    landlord_user_id: booking.landlord_user_id,
    lease_type: 'monthly',
    rental_period: 'monthly',
    start_date: startDate,
    monthly_rent_cents: listing?.price_cents ?? 0,
  });

  await logAuditEvent({
    actorUserId: booking.landlord_user_id,
    source: 'leases.service',
    eventName: 'lease.auto_created',
    payload: { bookingId, listingId: booking.listing_id },
  });
}

export type LeaseWithDetails = Lease & {
  tenant_name: string | null;
  landlord_name: string | null;
  listing_address: string | null;
  listing_unit_number: string | null;
};

export async function getLeaseWithDetails(leaseId: string): Promise<LeaseWithDetails | null> {
  const lease = await fetchLeaseById(leaseId);
  if (!lease) return null;

  const supabase = await createClient();
  const [tenantRes, landlordRes, listingRes] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', lease.tenant_user_id).single(),
    supabase.from('profiles').select('full_name').eq('id', lease.landlord_user_id).single(),
    supabase.from('listings').select('address, unit_number').eq('id', lease.listing_id).single(),
  ]);

  return {
    ...lease,
    tenant_name: tenantRes.data?.full_name ?? null,
    landlord_name: landlordRes.data?.full_name ?? null,
    listing_address: listingRes.data?.address ?? null,
    listing_unit_number: listingRes.data?.unit_number ?? null,
  };
}
