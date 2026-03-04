import { createClient } from '@/lib/supabase/server';
import type { OrganizationRole } from '@/types/database';

export async function fetchPrimaryOrganizationForUser(userId: string): Promise<{
  org_id: string;
  role: OrganizationRole;
  name: string;
} | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('org_memberships')
    .select('org_id, role, organizations(name)')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  const organizationRow = Array.isArray(data.organizations)
    ? (data.organizations[0] as { name?: string } | undefined)
    : (data.organizations as { name?: string } | null);
  return {
    org_id: data.org_id,
    role: data.role,
    name: organizationRow?.name ?? 'Organization',
  };
}

export async function insertOrganization(input: {
  owner_user_id: string;
  name: string;
  domain?: string | null;
}): Promise<{ id: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('organizations')
    .insert({
      owner_user_id: input.owner_user_id,
      name: input.name,
      domain: input.domain ?? null,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data;
}

export async function insertOrgMembership(input: {
  org_id: string;
  user_id: string;
  role: OrganizationRole;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('org_memberships').insert(input);
  if (error) throw error;
}

export async function fetchOrgMemberships(orgId: string): Promise<
  {
    id: string;
    user_id: string;
    role: OrganizationRole;
    created_at: string;
  }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('org_memberships')
    .select('id, user_id, role, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
