import { createClient } from '@/lib/supabase/server';
import type { ScreeningRule } from '@/types/database';

export async function fetchScreeningRuleByLandlord(
  landlordUserId: string
): Promise<ScreeningRule | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('screening_rules')
    .select('id, landlord_user_id, minimum_score, notes, auto_approve, created_at, updated_at')
    .eq('landlord_user_id', landlordUserId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function upsertScreeningRule(input: {
  landlord_user_id: string;
  minimum_score: number;
  notes?: string | null;
  auto_approve: boolean;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('screening_rules').upsert(
    {
      landlord_user_id: input.landlord_user_id,
      minimum_score: input.minimum_score,
      notes: input.notes ?? null,
      auto_approve: input.auto_approve,
    },
    { onConflict: 'landlord_user_id' }
  );

  if (error) throw error;
}
