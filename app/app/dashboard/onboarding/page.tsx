import { getSessionUser } from '@/server/auth/get-session-user';
import { RoleForm } from './RoleForm';
import { ROLES } from '@/lib/constants';
import type { AppRole } from '@/types/database';
import { getProfile } from '@/server/services/profiles.service';
import { VerificationForm } from './VerificationForm';

export default async function OnboardingPage() {
  const session = await getSessionUser();
  const profile = await getProfile(session.id);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2 text-foreground">Choose your role</h1>
      <p className="text-muted-foreground mb-6">
        Select how you want to use ScrubHub. Landlords can create and manage listings.
      </p>
      <RoleForm currentRole={session.role as AppRole} roles={ROLES} />
      <VerificationForm currentState={profile?.verification_state ?? 'pending'} />
    </div>
  );
}
