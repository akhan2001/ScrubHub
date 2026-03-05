'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/server/guards/require-role';
import { getActiveLeasesForTenant } from '@/server/services/leases.service';
import {
  getTerminationDateForLease,
  createN9Draft,
  signAndDeliverN9,
  acknowledgeN9,
  getN9NoticesForLandlord,
} from '@/server/services/n9.service';
import { fetchN9NoticesForLease } from '@/server/repositories/n9-notices.repository';
import type { N9Reason } from '@/types/database';

export async function getActiveLeasesAction() {
  const user = await requireRole('tenant');
  return getActiveLeasesForTenant(user.id);
}

export async function calculateTerminationDateAction(leaseId: string, reason: N9Reason) {
  await requireRole('tenant');
  return getTerminationDateForLease(leaseId, reason);
}

export async function createN9DraftAction(leaseId: string, reason: N9Reason) {
  const user = await requireRole('tenant');
  const result = await createN9Draft({
    leaseId,
    tenantUserId: user.id,
    reason,
  });
  revalidatePath('/dashboard/tenant/tenancy');
  return result;
}

export async function signN9Action(noticeId: string, signatureName: string) {
  const user = await requireRole('tenant');
  const hdrs = await headers();
  const ip =
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    hdrs.get('x-real-ip') ??
    'unknown';

  const result = await signAndDeliverN9({
    noticeId,
    tenantUserId: user.id,
    signatureName,
    signatureIp: ip,
  });
  revalidatePath('/dashboard/tenant/tenancy');
  revalidatePath('/dashboard/landlord');
  return result;
}

export async function acknowledgeN9Action(noticeId: string, notes?: string) {
  const user = await requireRole('landlord');
  await acknowledgeN9(({
    noticeId,
    landlordUserId: user.id,
    notes,
  }));
  revalidatePath('/dashboard/landlord');
  revalidatePath('/dashboard/tenant/tenancy');
}

export async function getLandlordN9NoticesAction() {
  const user = await requireRole('landlord');
  return getN9NoticesForLandlord(user.id);
}

export async function getN9NoticesForLeaseAction(leaseId: string) {
  await requireRole('tenant');
  return fetchN9NoticesForLease(leaseId);
}
