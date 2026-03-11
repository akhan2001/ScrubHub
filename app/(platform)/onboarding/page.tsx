import { redirect } from 'next/navigation';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import { resolveDashboardRoute } from '@/server/auth/resolve-dashboard-route';
import { RoleSelection } from '@/components/onboarding/role-selection';

type Props = { searchParams: Promise<{ change?: string }> };

export default async function OnboardingPage({ searchParams }: Props) {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const profile = await getProfile(user.id);
  if (!profile) redirect('/login');

  const params = await searchParams;
  const isChangingRole = params.change === '1';

  if (profile.has_selected_role && !isChangingRole) {
    redirect(resolveDashboardRoute(profile.role));
  }

  return <RoleSelection isChangingRole={isChangingRole} />;
}
