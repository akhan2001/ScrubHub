import Link from 'next/link';
import { getSessionUser } from '@/server/auth/get-session-user';
import { getProfile } from '@/server/services/profiles.service';
import { Button } from '@/components/ui/button';

export default async function TenantProfilePage() {
  const session = await getSessionUser();
  const profile = await getProfile(session.id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Tenant profile</h1>
      <p className="text-muted-foreground">Email: {profile?.email ?? 'Unknown'}</p>
      <p className="text-muted-foreground">
        Verification state:{' '}
        <strong className="text-foreground capitalize">{profile?.verification_state ?? 'pending'}</strong>
      </p>
      <Button variant="outline" asChild>
        <Link href="/dashboard/onboarding">Update role or verification details</Link>
      </Button>
    </div>
  );
}
