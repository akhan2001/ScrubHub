import { createClient } from '@/lib/supabase/server';
import type { N9Notice, N9Reason, N9Status } from '@/types/database';

export async function insertN9Notice(input: {
  lease_id: string;
  tenant_user_id: string;
  reason: N9Reason;
  termination_date: string;
}): Promise<Pick<N9Notice, 'id'>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('n9_notices')
    .insert({
      lease_id: input.lease_id,
      tenant_user_id: input.tenant_user_id,
      reason: input.reason,
      termination_date: input.termination_date,
      status: 'draft',
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

export async function fetchN9NoticeById(noticeId: string): Promise<N9Notice | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('n9_notices')
    .select('*')
    .eq('id', noticeId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function fetchN9NoticesForLease(leaseId: string): Promise<N9Notice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('n9_notices')
    .select('*')
    .eq('lease_id', leaseId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchN9NoticesForLandlord(landlordUserId: string): Promise<
  (N9Notice & { lease_tenant_name: string | null; lease_address: string | null })[]
> {
  const supabase = await createClient();

  const { data: leases, error: leasesErr } = await supabase
    .from('leases')
    .select('id, listing_id, tenant_user_id')
    .eq('landlord_user_id', landlordUserId)
    .in('status', ['active', 'terminating']);

  if (leasesErr) throw leasesErr;
  if (!leases?.length) return [];

  const leaseIds = leases.map((l) => l.id);
  const { data: notices, error: noticesErr } = await supabase
    .from('n9_notices')
    .select('*')
    .in('lease_id', leaseIds)
    .in('status', ['signed', 'delivered'])
    .order('created_at', { ascending: false });

  if (noticesErr) throw noticesErr;
  if (!notices?.length) return [];

  const tenantIds = [...new Set(leases.map((l) => l.tenant_user_id))];
  const listingIds = [...new Set(leases.map((l) => l.listing_id))];

  const [profilesRes, listingsRes] = await Promise.all([
    supabase.from('profiles').select('id, full_name').in('id', tenantIds),
    supabase.from('listings').select('id, address').in('id', listingIds),
  ]);

  const profileMap = new Map(
    (profilesRes.data ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name])
  );
  const listingMap = new Map(
    (listingsRes.data ?? []).map((l: { id: string; address: string | null }) => [l.id, l.address])
  );
  const leaseMap = new Map(leases.map((l) => [l.id, l]));

  return notices.map((n) => {
    const lease = leaseMap.get(n.lease_id);
    return {
      ...n,
      lease_tenant_name: lease ? (profileMap.get(lease.tenant_user_id) ?? null) : null,
      lease_address: lease ? (listingMap.get(lease.listing_id) ?? null) : null,
    };
  });
}

export async function fetchAllN9NoticesForLandlord(landlordUserId: string): Promise<
  (N9Notice & { lease_tenant_name: string | null; lease_address: string | null })[]
> {
  const supabase = await createClient();

  const { data: leases, error: leasesErr } = await supabase
    .from('leases')
    .select('id, listing_id, tenant_user_id')
    .eq('landlord_user_id', landlordUserId);

  if (leasesErr) throw leasesErr;
  if (!leases?.length) return [];

  const leaseIds = leases.map((l) => l.id);
  const { data: notices, error: noticesErr } = await supabase
    .from('n9_notices')
    .select('*')
    .in('lease_id', leaseIds)
    .order('created_at', { ascending: false });

  if (noticesErr) throw noticesErr;
  if (!notices?.length) return [];

  const tenantIds = [...new Set(leases.map((l) => l.tenant_user_id))];
  const listingIds = [...new Set(leases.map((l) => l.listing_id))];

  const [profilesRes, listingsRes] = await Promise.all([
    supabase.from('profiles').select('id, full_name').in('id', tenantIds),
    supabase.from('listings').select('id, address').in('id', listingIds),
  ]);

  const profileMap = new Map(
    (profilesRes.data ?? []).map((p: { id: string; full_name: string | null }) => [p.id, p.full_name])
  );
  const listingMap = new Map(
    (listingsRes.data ?? []).map((l: { id: string; address: string | null }) => [l.id, l.address])
  );
  const leaseMap = new Map(leases.map((l) => [l.id, l]));

  return notices.map((n) => {
    const lease = leaseMap.get(n.lease_id);
    return {
      ...n,
      lease_tenant_name: lease ? (profileMap.get(lease.tenant_user_id) ?? null) : null,
      lease_address: lease ? (listingMap.get(lease.listing_id) ?? null) : null,
    };
  });
}

export async function updateN9NoticeSignature(
  noticeId: string,
  input: {
    signature_name: string;
    signature_date: string;
    signature_ip: string;
    pdf_url: string;
    status: N9Status;
  }
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('n9_notices')
    .update(input)
    .eq('id', noticeId);

  if (error) throw error;
}

export async function updateN9NoticeStatus(
  noticeId: string,
  status: N9Status
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('n9_notices')
    .update({ status })
    .eq('id', noticeId);

  if (error) throw error;
}

export async function acknowledgeN9Notice(
  noticeId: string,
  notes?: string
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('n9_notices')
    .update({
      status: 'acknowledged' as N9Status,
      landlord_acknowledged_at: new Date().toISOString(),
      landlord_notes: notes ?? null,
    })
    .eq('id', noticeId);

  if (error) throw error;
}
