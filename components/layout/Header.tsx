import Link from 'next/link';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { Button } from '@/components/ui/button';

export async function Header() {
  const user = await getAuthUser();

  return (
    <header className="border-b border-border bg-card">
      <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-foreground hover:text-primary transition-colors">
          ScrubHub
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/listings">Listings</Link>
          </Button>
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <form action="/api/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
