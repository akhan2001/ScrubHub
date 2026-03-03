import { redirect } from 'next/navigation';
import { getAuthUser } from '@/server/auth/get-auth-user';

export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) redirect('/login');
  return user;
}
