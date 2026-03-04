import { fetchJobPostsByOrg, insertJobPost } from '@/server/repositories/job-posts.repository';

export async function getJobPostsForOrg(orgId: string) {
  return fetchJobPostsByOrg(orgId);
}

export async function createJobPostForOrg(input: {
  orgId: string;
  createdBy: string;
  title: string;
  description: string;
  status?: 'draft' | 'published' | 'closed';
}) {
  await insertJobPost({
    org_id: input.orgId,
    created_by: input.createdBy,
    title: input.title,
    description: input.description,
    status: input.status,
  });
}
