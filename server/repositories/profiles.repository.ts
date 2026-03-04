import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

export async function fetchProfileById(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, verification_state, verification_notes, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfileRole(
  userId: string,
  role: Profile['role']
): Promise<void> {
  const verificationState = role === 'tenant' ? 'verified' : 'pending';
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ role, verification_state: verificationState })
    .eq('id', userId);

  if (error) throw error;
}

export async function updateProfileVerificationState(
  userId: string,
  verification_state: Profile['verification_state'],
  verification_notes?: string | null
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ verification_state, verification_notes: verification_notes ?? null })
    .eq('id', userId);

  if (error) throw error;
}

export async function fetchUserOnboardingStatus(userId: string): Promise<{
  worker: { exists: boolean; complete: boolean };
  landlord: { exists: boolean; complete: boolean };
  enterprise: { exists: boolean; complete: boolean };
}> {
  const supabase = await createClient();

  const [workerRes, landlordRes, orgRes, memberRes, profileRes, listingRes] = await Promise.all([
    supabase.from('worker_profiles').select('background_check_consent').eq('id', userId).maybeSingle(),
    supabase.from('landlord_profiles').select('id').eq('id', userId).maybeSingle(),
    supabase.from('organizations').select('id').eq('owner_user_id', userId).maybeSingle(),
    supabase.from('org_memberships').select('id').eq('user_id', userId).maybeSingle(),
    supabase.from('profiles').select('job_title').eq('id', userId).single(),
    supabase.from('listings').select('id', { count: 'exact', head: true }).eq('user_id', userId)
  ]);

  const hasWorkerProfile = !!workerRes.data;
  const isWorkerComplete = hasWorkerProfile && workerRes.data?.background_check_consent === true;

  const hasLandlordProfile = !!landlordRes.data;
  const hasListings = (listingRes.count ?? 0) > 0;
  const isLandlordComplete = hasLandlordProfile && hasListings;

  const hasOrgOwnership = !!orgRes.data;
  const hasOrgMembership = !!memberRes.data;
  const hasJobTitle = !!profileRes.data?.job_title;
  
  // For enterprise, if they are owner, they need job_title. If member, assume complete (invited).
  const isEnterpriseComplete = (hasOrgOwnership && hasJobTitle) || hasOrgMembership;

  return {
    worker: { exists: hasWorkerProfile, complete: isWorkerComplete },
    landlord: { exists: hasLandlordProfile, complete: isLandlordComplete },
    enterprise: { exists: hasOrgOwnership || hasOrgMembership, complete: isEnterpriseComplete }
  };
}
