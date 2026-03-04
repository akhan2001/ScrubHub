import { redirect } from 'next/navigation';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import type { AppRole } from '@/types/database';
import { ForbiddenError, UnauthorizedError } from '@/server/errors/app-error';

export async function requireVerifiedRole(
  role: AppRole,
  options?: {
    onFailure?: 'redirect' | 'throw';
  }
) {
  const onFailure = options?.onFailure ?? 'redirect';
  const fail = (path: string, error: Error): never => {
    if (onFailure === 'throw') {
      throw error;
    }
    redirect(path);
    // Ensure TS knows this function never returns
    throw error;
  };

  const user = await getAuthUser();
  if (!user) return fail('/login', new UnauthorizedError('Sign in required'));

  const profile = await getProfile(user.id);
  if (!profile) return fail('/login', new UnauthorizedError('Profile not found for current user'));

  if (profile.role !== role) return fail('/dashboard', new ForbiddenError(`Requires role: ${role}`));
  if (profile.verification_state !== 'verified') {
    return fail('/onboarding', new ForbiddenError('Complete verification before continuing'));
  }

  return {
    id: user.id,
    email: user.email ?? undefined,
    role: profile.role,
    verification_state: profile.verification_state,
  };
}
