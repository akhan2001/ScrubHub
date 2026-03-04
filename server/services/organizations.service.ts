import {
  fetchOrgMemberships,
  fetchPrimaryOrganizationForUser,
  insertOrgMembership,
  insertOrganization,
} from '@/server/repositories/organizations.repository';
import { logAuditEvent } from '@/server/services/audit.service';

export async function getPrimaryOrganizationForUser(userId: string) {
  return fetchPrimaryOrganizationForUser(userId);
}

export async function createOrganizationForUser(input: {
  userId: string;
  name: string;
  domain?: string;
}) {
  const org = await insertOrganization({
    owner_user_id: input.userId,
    name: input.name,
    domain: input.domain,
  });
  await insertOrgMembership({
    org_id: org.id,
    user_id: input.userId,
    role: 'admin',
  });
  await logAuditEvent({
    actorUserId: input.userId,
    source: 'organizations.service',
    eventName: 'organization.created',
    payload: { organizationId: org.id, name: input.name },
  });
  return org;
}

export async function getOrganizationMembers(orgId: string) {
  return fetchOrgMemberships(orgId);
}
