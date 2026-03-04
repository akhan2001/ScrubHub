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
