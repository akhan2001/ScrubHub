'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/server/guards/require-role';
import { requireVerifiedRole } from '@/server/guards/require-verified-role';
import { requirePlan } from '@/server/guards/require-plan';
import { jobPostSchema, organizationSchema } from '@/lib/validation/schemas';
import { ValidationError } from '@/server/errors/app-error';
import { createOrganizationForUser } from '@/server/services/organizations.service';
import { createJobPostForOrg } from '@/server/services/job-posts.service';

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
  await requirePlan('starter', { action: 'post_job' });
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
}
