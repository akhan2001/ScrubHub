'use server';

import { requireVerifiedRole } from '@/server/guards/require-verified-role';
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
  status?: 'draft' | 'published' | 'closed';
}) {
  const parsed = jobPostSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message);
  }
  const user = await requireVerifiedRole('enterprise', { onFailure: 'throw' });
  await createJobPostForOrg({
    orgId: parsed.data.orgId,
    createdBy: user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    status: parsed.data.status,
  });
}
