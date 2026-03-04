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

export async function insertJobPost(input: {
  org_id: string;
  created_by: string;
  title: string;
  description: string;
  status?: JobStatus;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from('job_posts').insert({
    org_id: input.org_id,
    created_by: input.created_by,
    title: input.title,
    description: input.description,
    status: input.status ?? 'draft',
  });

  if (error) throw error;
}
