import { createClient } from '@/lib/supabase/server';
import type { JobApplication } from '@/types/database';

export interface InsertJobApplicationInput {
  job_post_id: string;
  user_id: string;
  email: string;
  phone: string;
  resume_url: string;
  cover_message?: string | null;
}

export async function insertJobApplication(
  input: InsertJobApplicationInput
): Promise<JobApplication> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_applications')
    .insert({
      job_post_id: input.job_post_id,
      user_id: input.user_id,
      email: input.email,
      phone: input.phone,
      resume_url: input.resume_url,
      cover_message: input.cover_message ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchApplicationsByJobId(
  jobPostId: string
): Promise<JobApplication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('job_post_id', jobPostId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchApplicationById(
  id: string
): Promise<(JobApplication & { job_posts: { title: string; org_id: string } | null }) | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_applications')
    .select('*, job_posts(title, org_id)')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as (JobApplication & { job_posts: { title: string; org_id: string } | null }) | null;
}

export async function fetchApplicationByJobAndUser(
  jobPostId: string,
  userId: string
): Promise<JobApplication | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_applications')
    .select('*')
    .eq('job_post_id', jobPostId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export type JobApplicationWithJob = JobApplication & { job_posts: { title: string } | null };

export async function fetchApplicationsByOrgId(
  orgId: string
): Promise<JobApplicationWithJob[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_applications')
    .select('*, job_posts!inner(title, org_id)')
    .eq('job_posts.org_id', orgId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as JobApplicationWithJob[];
}

export async function fetchApplicationsByUserId(
  userId: string
): Promise<JobApplicationWithJob[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_applications')
    .select('*, job_posts(title)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as JobApplicationWithJob[];
}
