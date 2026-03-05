import { redirect } from 'next/navigation';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import { resolveDashboardRoute } from '@/server/auth/resolve-dashboard-route';
import { RoleSelection } from '@/components/onboarding/role-selection';

export default async function OnboardingPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const profile = await getProfile(user.id);
  if (!profile) redirect('/login');

  if (profile.has_selected_role) {
    redirect(resolveDashboardRoute(profile.role));
  }

  return <RoleSelection />;
}
