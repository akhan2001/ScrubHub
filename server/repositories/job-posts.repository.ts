import { createClient } from '@/lib/supabase/server';
import type { JobPost, JobStatus } from '@/types/database';

export async function fetchJobPostsByOrg(
  orgId: string
): Promise<Pick<JobPost, 'id' | 'title' | 'status' | 'created_at'>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_posts')
    .select('id, title, status, created_at')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchPublishedJobPosts(): Promise<JobPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchJobPostById(id: string): Promise<JobPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}

export interface InsertJobPostInput {
  org_id: string;
  created_by: string;
  title: string;
  description: string;
  status?: JobStatus;
  facility_name?: string | null;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  role_type?: string | null;
  contract_type?: string | null;
  contract_length?: string | null;
  pay_range_min?: number | null;
  pay_range_max?: number | null;
  start_date?: string | null;
  housing_included?: boolean;
  linked_listing_id?: string | null;
}

export async function insertJobPost(input: InsertJobPostInput): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('job_posts').insert({
    org_id: input.org_id,
    created_by: input.created_by,
    title: input.title,
    description: input.description,
    status: input.status ?? 'draft',
    facility_name: input.facility_name ?? null,
    location: input.location ?? null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    role_type: input.role_type ?? null,
    contract_type: input.contract_type ?? null,
    contract_length: input.contract_length ?? null,
    pay_range_min: input.pay_range_min ?? null,
    pay_range_max: input.pay_range_max ?? null,
    start_date: input.start_date ?? null,
    housing_included: input.housing_included ?? false,
    linked_listing_id: input.linked_listing_id ?? null,
  });

  if (error) throw error;
}

export async function updateJobPost(
  id: string,
  fields: Partial<Omit<InsertJobPostInput, 'org_id' | 'created_by'>>
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('job_posts')
    .update(fields)
    .eq('id', id);

  if (error) throw error;
}
