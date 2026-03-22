import { getSessionUser } from '@/server/auth/get-session-user';
import { getProfile } from '@/server/services/profiles.service';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  const profile = await getProfile(session.id);

  return (
    <DashboardShell
      role={session.role}
      user={{
        id: session.id,
        fullName: profile?.full_name ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        email: session.email ?? null,
      }}
    >
      {children}
    </DashboardShell>
  );
}
