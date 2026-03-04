'use server';

import { requireAuth } from '@/server/guards/require-auth';
import { getProfile, updateProfileVerificationState } from '@/server/services/profiles.service';

export async function submitRoleVerification() {
  const user = await requireAuth();
  const profile = await getProfile(user.id);
  if (!profile) {
    throw new Error('Profile not found');
  }

  if (profile.verification_state === 'verified') return;
  await updateProfileVerificationState(user.id, 'verified', 'Self-attested MVP verification');
}
