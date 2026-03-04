import { redirect } from 'next/navigation';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import type { AppRole } from '@/types/database';

export type UserWithAnyRole = {
  id: string;
  email?: string;
  role: AppRole;
};

export async function requireAnyRole(roles: AppRole[]): Promise<UserWithAnyRole> {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const profile = await getProfile(user.id);
  if (!profile) redirect('/login');

  if (!roles.includes(profile.role)) {
    redirect('/dashboard');
  }

  return {
    id: user.id,
    email: user.email ?? undefined,
    role: profile.role,
  };
}
