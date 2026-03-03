import { getSessionUser } from '@/server/auth/get-session-user';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="font-semibold">
            Dashboard
          </Link>
          <div className="flex gap-4">
            {session.role === 'landlord' && (
              <>
                <Link href="/dashboard/landlord" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                  Landlord
                </Link>
                <Link href="/dashboard/landlord/listings" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                  My listings
                </Link>
                <Link href="/dashboard/landlord/listings/new" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                  Create listing
                </Link>
              </>
            )}
            {session.role !== 'landlord' && (
              <Link href="/dashboard/onboarding" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
                Set role
              </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">{children}</main>
    </div>
  );
}
