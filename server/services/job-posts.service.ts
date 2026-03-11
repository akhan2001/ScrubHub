import {
  fetchJobPostsByOrg,
  fetchPublishedJobPosts,
  fetchJobPostById,
  insertJobPost,
  updateJobPost,
  deleteJobPost as deleteJobPostRepo,
  type InsertJobPostInput,
} from '@/server/repositories/job-posts.repository';

export async function getJobPostsForOrg(orgId: string) {
  return fetchJobPostsByOrg(orgId);
}

export async function getPublishedJobPosts() {
  return fetchPublishedJobPosts();
}

export async function getJobPostById(id: string) {
  return fetchJobPostById(id);
}

export async function createJobPostForOrg(
  input: Omit<InsertJobPostInput, 'org_id' | 'created_by'> & {
    orgId: string;
    createdBy: string;
  }
) {
  await insertJobPost({
    org_id: input.orgId,
    created_by: input.createdBy,
    title: input.title,
    description: input.description,
    status: input.status,
    facility_name: input.facility_name,
    location: input.location,
    latitude: input.latitude,
    longitude: input.longitude,
    role_type: input.role_type,
    contract_type: input.contract_type,
    contract_length: input.contract_length,
    pay_range_min: input.pay_range_min,
    pay_range_max: input.pay_range_max,
    start_date: input.start_date,
    housing_included: input.housing_included,
    linked_listing_id: input.linked_listing_id,
  });
}

export async function editJobPost(
  id: string,
  input: Partial<Omit<InsertJobPostInput, 'org_id' | 'created_by'>>
) {
  await updateJobPost(id, input);
}

export async function deleteJobPost(id: string) {
  await deleteJobPostRepo(id);
}
