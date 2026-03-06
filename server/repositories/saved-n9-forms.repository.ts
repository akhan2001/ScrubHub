import { createClient } from '@/lib/supabase/server';
import type { SavedN9Form } from '@/types/database';

export async function insertSavedN9Form(input: {
  tenant_user_id: string;
  landlord_name: string;
  tenant_name: string;
  rental_address: string;
  termination_date: string;
  phone_number: string | null;
  signature_first_name: string;
  signature_last_name: string;
  pdf_url: string;
}): Promise<Pick<SavedN9Form, 'id'>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('saved_n9_forms')
    .insert(input)
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

export async function fetchSavedN9FormsForTenant(tenantUserId: string): Promise<SavedN9Form[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('saved_n9_forms')
    .select('*')
    .eq('tenant_user_id', tenantUserId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function deleteSavedN9Form(formId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('saved_n9_forms')
    .delete()
    .eq('id', formId);

  if (error) throw error;
}
