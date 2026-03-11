'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/server/guards/require-role';
import { requireVerifiedRole } from '@/server/guards/require-verified-role';
import { jobPostSchema, updateJobPostSchema, organizationSchema } from '@/lib/validation/schemas';
import { ValidationError } from '@/server/errors/app-error';
import { createOrganizationForUser } from '@/server/services/organizations.service';
import {
  createJobPostForOrg,
  editJobPost as editJobPostService,
  deleteJobPost as deleteJobPostService,
} from '@/server/services/job-posts.service';

export async function createOrganization(input: { name: string; domain?: string }) {
  const parsed = organizationSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message);
  }
  const user = await requireVerifiedRole('enterprise', { onFailure: 'throw' });
  return createOrganizationForUser({
    userId: user.id,
    name: parsed.data.name,
    domain: parsed.data.domain,
  });
}

export async function createJobPost(input: {
  orgId: string;
  title: string;
  description: string;
  status?: 'draft' | 'published' | 'closed' | 'filled';
  facilityName?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  roleType?: string;
  contractType?: string;
  contractLength?: string;
  payRangeMin?: number;
  payRangeMax?: number;
  startDate?: string;
  housingIncluded?: boolean;
  linkedListingId?: string;
}) {
  const parsed = jobPostSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message);
  }
  const user = await requireRole('enterprise');
  await createJobPostForOrg({
    orgId: parsed.data.orgId,
    createdBy: user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    status: parsed.data.status,
    facility_name: parsed.data.facilityName ?? null,
    location: parsed.data.location ?? null,
    latitude: parsed.data.latitude ?? null,
    longitude: parsed.data.longitude ?? null,
    role_type: parsed.data.roleType ?? null,
    contract_type: parsed.data.contractType ?? null,
    contract_length: parsed.data.contractLength ?? null,
    pay_range_min: parsed.data.payRangeMin ?? null,
    pay_range_max: parsed.data.payRangeMax ?? null,
    start_date: parsed.data.startDate ?? null,
    housing_included: parsed.data.housingIncluded ?? false,
    linked_listing_id: parsed.data.linkedListingId ?? null,
  });

  revalidatePath('/dashboard/enterprise');
  revalidatePath('/dashboard/enterprise/jobs');
}

export async function updateJobPost(
  id: string,
  input: {
    title?: string;
    description?: string;
    status?: 'draft' | 'published' | 'closed' | 'filled';
    facilityName?: string;
    location?: string;
    latitude?: number;
    longitude?: number;
    roleType?: string;
    contractType?: string;
    contractLength?: string;
    payRangeMin?: number;
    payRangeMax?: number;
    startDate?: string;
    housingIncluded?: boolean;
    linkedListingId?: string;
  }
) {
  const parsed = updateJobPostSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message);
  }
  await requireRole('enterprise');
  const data = parsed.data;
  const payload: Record<string, unknown> = {};
  if (data.title != null) payload.title = data.title;
  if (data.description != null) payload.description = data.description;
  if (data.status != null) payload.status = data.status;
  if (data.facilityName != null) payload.facility_name = data.facilityName;
  if (data.location != null) payload.location = data.location;
  if (data.latitude != null) payload.latitude = data.latitude;
  if (data.longitude != null) payload.longitude = data.longitude;
  if (data.roleType != null) payload.role_type = data.roleType;
  if (data.contractType != null) payload.contract_type = data.contractType;
  if (data.contractLength != null) payload.contract_length = data.contractLength;
  if (data.payRangeMin != null) payload.pay_range_min = data.payRangeMin;
  if (data.payRangeMax != null) payload.pay_range_max = data.payRangeMax;
  if (data.startDate != null) payload.start_date = data.startDate;
  if (data.housingIncluded != null) payload.housing_included = data.housingIncluded;
  if (data.housingIncluded === false) payload.linked_listing_id = null;
  else if (data.linkedListingId != null) payload.linked_listing_id = data.linkedListingId;
  await editJobPostService(id, payload as Parameters<typeof editJobPostService>[1]);

  revalidatePath('/dashboard/enterprise');
  revalidatePath('/dashboard/enterprise/jobs');
}

export async function deleteJobPost(id: string) {
  await requireRole('enterprise');
  await deleteJobPostService(id);
  revalidatePath('/dashboard/enterprise');
  revalidatePath('/dashboard/enterprise/jobs');
}
