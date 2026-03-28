import { getSessionUser } from '@/server/auth/get-session-user';
import { getProfile } from '@/server/services/profiles.service';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import {
  countInAppNotificationsForUser,
  fetchNotificationLogsForUser,
} from '@/server/repositories/notification-logs.repository';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  const profile = await getProfile(session.id);
  const [notificationLogs, notificationCount] = await Promise.all([
    fetchNotificationLogsForUser(session.id, 40, { channel: 'in_app' }),
    countInAppNotificationsForUser(session.id),
  ]);

  return (
    <DashboardShell
      role={session.role}
      user={{
        id: session.id,
        fullName: profile?.full_name ?? null,
        avatarUrl: profile?.avatar_url ?? null,
        email: session.email ?? null,
      }}
      notificationLogs={notificationLogs}
      notificationCount={notificationCount}
    >
      {children}
    </DashboardShell>
  );
}
