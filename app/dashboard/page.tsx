import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/server/auth/get-session-user';

export default async function DashboardPage() {
  const session = await getSessionUser();

  if (session.role === 'landlord') {
    redirect('/dashboard/landlord');
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Dashboard</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-4">
        You are signed in as a <strong>{session.role}</strong>. Tenant and enterprise features are coming soon.
      </p>
      <Link
        href="/dashboard/onboarding"
        className="inline-block rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium"
      >
        Change role (e.g. become a landlord)
      </Link>
    </div>
  );
}
