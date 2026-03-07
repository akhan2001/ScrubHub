import { getAuthUser } from '@/server/auth/get-auth-user';
import { SiteHeader } from './site-header';

export async function SiteHeaderWrapper() {
  const user = await getAuthUser();
  return <SiteHeader user={user} />;
}
