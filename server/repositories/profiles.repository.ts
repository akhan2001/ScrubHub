import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

export async function fetchProfileById(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, created_at, updated_at')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfileRole(
  userId: string,
  role: Profile['role']
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) throw error;
}
