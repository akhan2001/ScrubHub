import { redirect } from 'next/navigation';
import { getSessionUser } from '@/server/auth/get-session-user';
import { resolveDashboardRoute } from '@/server/auth/resolve-dashboard-route';
import { getUserOnboardingStatus } from '@/server/services/profiles.service';

export default async function DashboardPage() {
  const session = await getSessionUser();
  const status = await getUserOnboardingStatus(session.id);

  if (session.role === 'tenant') {
    if (!status.worker.exists) {
      // New user, hasn't started -> Selection Screen
      redirect('/onboarding');
    } else if (!status.worker.complete) {
      // Started but incomplete -> Worker Wizard
      redirect('/onboarding/worker');
    }
  }

  if (session.role === 'landlord') {
    if (!status.landlord.complete) {
      // Incomplete (started or not) -> Landlord Wizard
      redirect('/onboarding/landlord');
    }
  }

  if (session.role === 'enterprise') {
    if (!status.enterprise.complete) {
      // Incomplete -> Enterprise Wizard
      redirect('/onboarding/enterprise');
    }
  }

  redirect(resolveDashboardRoute(session.role));
}
