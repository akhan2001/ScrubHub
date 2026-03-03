import Link from 'next/link';
import { getAuthUser } from '@/server/auth/get-auth-user';

export async function Header() {
  const user = await getAuthUser();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          ScrubHub
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/listings"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Listings
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Dashboard
              </Link>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
