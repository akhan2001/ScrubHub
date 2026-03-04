import {
  fetchProfileById,
  updateProfileRole as updateProfileRoleRepo,
  updateProfileVerificationState as updateProfileVerificationStateRepo,
  fetchUserOnboardingStatus as fetchUserOnboardingStatusRepo,
} from '@/server/repositories/profiles.repository';
import type { AppRole, Profile, VerificationState } from '@/types/database';

export async function getProfile(userId: string) {
  return fetchProfileById(userId);
}

export async function updateProfileRole(userId: string, role: AppRole): Promise<void> {
  await updateProfileRoleRepo(userId, role);
}

const TRANSITIONS: Record<VerificationState, VerificationState[]> = {
  pending: ['verified', 'rejected', 'suspended'],
  verified: ['suspended'],
  rejected: ['pending', 'verified'],
  suspended: ['pending', 'verified'],
};

export function canTransitionVerificationState(
  from: VerificationState,
  to: VerificationState
): boolean {
  return TRANSITIONS[from].includes(to);
}

export async function updateProfileVerificationState(
  userId: string,
  nextState: VerificationState,
  notes?: string
): Promise<void> {
  const profile = await fetchProfileById(userId);
  if (!profile) {
    throw new Error('Profile not found');
  }

  if (!canTransitionVerificationState(profile.verification_state, nextState)) {
    throw new Error(
      `Invalid verification transition: ${profile.verification_state} -> ${nextState}`
    );
  }

  await updateProfileVerificationStateRepo(userId, nextState, notes);
}

export function isVerifiedForRole(profile: Pick<Profile, 'role' | 'verification_state'>): boolean {
  if (profile.role === 'tenant') {
    return profile.verification_state === 'verified';
  }
  if (profile.role === 'landlord') {
    return profile.verification_state === 'verified';
  }
  return profile.verification_state === 'verified';
}

export async function getUserOnboardingStatus(userId: string) {
  return fetchUserOnboardingStatusRepo(userId);
}
