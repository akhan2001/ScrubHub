import { createClient } from '@/lib/supabase/server';
import type { Lease, LeaseStatus } from '@/types/database';

export async function insertLease(input: {
  booking_id?: string | null;
  listing_id: string;
  tenant_user_id: string;
  landlord_user_id: string;
  lease_type: Lease['lease_type'];
  rental_period: Lease['rental_period'];
  start_date: string;
  end_date?: string | null;
  monthly_rent_cents: number;
}): Promise<Pick<Lease, 'id'>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leases')
    .insert({
      booking_id: input.booking_id ?? null,
      listing_id: input.listing_id,
      tenant_user_id: input.tenant_user_id,
      landlord_user_id: input.landlord_user_id,
      lease_type: input.lease_type,
      rental_period: input.rental_period,
      start_date: input.start_date,
      end_date: input.end_date ?? null,
      monthly_rent_cents: input.monthly_rent_cents,
      status: 'active',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

export async function fetchLeaseById(leaseId: string): Promise<Lease | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('leases')
    .select('*')
    .eq('id', leaseId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function fetchLeasesForTenant(
  tenantUserId: string,
  statusFilter?: LeaseStatus[]
): Promise<Lease[]> {
  const supabase = await createClient();
  let query = supabase
    .from('leases')
    .select('*')
    .eq('tenant_user_id', tenantUserId)
    .order('created_at', { ascending: false });

  if (statusFilter?.length) {
    query = query.in('status', statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchLeasesForLandlord(
  landlordUserId: string,
  statusFilter?: LeaseStatus[]
): Promise<Lease[]> {
  const supabase = await createClient();
  let query = supabase
    .from('leases')
    .select('*')
    .eq('landlord_user_id', landlordUserId)
    .order('created_at', { ascending: false });

  if (statusFilter?.length) {
    query = query.in('status', statusFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function updateLeaseStatus(
  leaseId: string,
  status: LeaseStatus
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('leases')
    .update({ status })
    .eq('id', leaseId);

  if (error) throw error;
}
