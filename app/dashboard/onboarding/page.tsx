import { getSessionUser } from '@/server/auth/get-session-user';
import { RoleForm } from './RoleForm';
import { ROLES } from '@/lib/constants';
import type { AppRole } from '@/types/database';

export default async function OnboardingPage() {
  const session = await getSessionUser();

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Choose your role</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        Select how you want to use ScrubHub. Landlords can create and manage listings.
      </p>
      <RoleForm currentRole={session.role as AppRole} roles={ROLES} />
    </div>
  );
}
