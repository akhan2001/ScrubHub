import { redirect } from 'next/navigation';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import type { Profile } from '@/types/database';

export type SessionUser = {
  id: string;
  email?: string;
  role: Profile['role'];
};

export async function getSessionUser(): Promise<SessionUser> {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const profile = await getProfile(user.id);
  if (!profile) redirect('/login');

  return {
    id: user.id,
    email: user.email ?? undefined,
    role: profile.role,
  };
}
