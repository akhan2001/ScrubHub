'use server';

import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import { fetchWorkerProfile } from '@/server/repositories/profiles.repository';
import type { AppRole } from '@/types/database';
import type { ProfileCompleteness } from '@/components/listings/apply-button';

export type TenantApplicationContext =
  | { role: 'tenant'; profileCompleteness: ProfileCompleteness }
  | { role: Exclude<AppRole, 'tenant'> }
  | null;

/**
 * Returns the current user's application context for listing apply flow.
 * - null: unauthenticated (guest)
 * - { role: 'landlord' | 'enterprise' }: logged in but not a tenant
 * - { role: 'tenant', profileCompleteness }: tenant with profile completeness for ApplyButton
 */
export async function getTenantApplicationContext(): Promise<TenantApplicationContext> {
  const user = await getAuthUser();
  if (!user) return null;

  const profile = await getProfile(user.id);
  if (!profile) return null;

  if (profile.role !== 'tenant') {
    return { role: profile.role };
  }

  const workerProfile = await fetchWorkerProfile(user.id);

  const profileCompleteness: ProfileCompleteness = {
    hasPaymentMethod: true, // No payment method check yet; payment is at booking approval
    hasBackgroundConsent: workerProfile?.background_check_consent ?? false,
    hasIdDocument: !!(workerProfile?.id_document_url),
  };

  return {
    role: 'tenant',
    profileCompleteness,
  };
}
