import { getSessionUser } from '@/server/auth/get-session-user';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  return <DashboardShell role={session.role}>{children}</DashboardShell>;
}
