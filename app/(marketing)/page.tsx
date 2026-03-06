import { getAuthUser } from '@/server/auth/get-auth-user';
import { LandingClient } from './LandingClient';

export default async function WWWLandingPage() {
  const user = await getAuthUser();

  return <LandingClient user={user} />;
}
