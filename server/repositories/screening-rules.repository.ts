import { createClient } from '@/lib/supabase/server';
import type { ScreeningRule } from '@/types/database';

export async function fetchScreeningRuleByLandlord(
  landlordUserId: string
): Promise<ScreeningRule | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('screening_rules')
    .select('*')
    .eq('landlord_user_id', landlordUserId)
    .is('listing_id', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function fetchScreeningRuleByListing(
  listingId: string
): Promise<ScreeningRule | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('screening_rules')
    .select('*')
    .eq('listing_id', listingId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export async function fetchScreeningRuleForListing(
  listingId: string,
  landlordUserId: string
): Promise<ScreeningRule | null> {
  const perListing = await fetchScreeningRuleByListing(listingId);
  if (perListing) return perListing;
  return fetchScreeningRuleByLandlord(landlordUserId);
}

export async function upsertScreeningRule(input: {
  landlord_user_id: string;
  minimum_score: number;
  notes?: string | null;
  auto_approve: boolean;
  listing_id?: string | null;
  require_background_check?: boolean;
  require_employment_verification?: boolean;
  require_license_verification?: boolean;
  max_income_to_rent_ratio?: number | null;
  instant_book_enabled?: boolean;
}): Promise<void> {
  const supabase = await createClient();

  const row = {
    landlord_user_id: input.landlord_user_id,
    minimum_score: input.minimum_score,
    notes: input.notes ?? null,
    auto_approve: input.auto_approve,
    listing_id: input.listing_id ?? null,
    require_background_check: input.require_background_check ?? false,
    require_employment_verification: input.require_employment_verification ?? false,
    require_license_verification: input.require_license_verification ?? false,
    max_income_to_rent_ratio: input.max_income_to_rent_ratio ?? null,
    instant_book_enabled: input.instant_book_enabled ?? false,
  };

  if (input.listing_id) {
    const existing = await fetchScreeningRuleByListing(input.listing_id);
    if (existing) {
      const { error } = await supabase
        .from('screening_rules')
        .update(row)
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('screening_rules').insert(row);
      if (error) throw error;
    }
  } else {
    const { error } = await supabase.from('screening_rules').upsert(row, {
      onConflict: 'landlord_user_id',
    });
    if (error) throw error;
  }
}
