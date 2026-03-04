import { redirect } from 'next/navigation';
import { getSessionUser } from '@/server/auth/get-session-user';
import { resolveDashboardRoute } from '@/server/auth/resolve-dashboard-route';

export default async function DashboardPage() {
  const session = await getSessionUser();
  redirect(resolveDashboardRoute(session.role));
}
