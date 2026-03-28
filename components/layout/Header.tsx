import Link from 'next/link';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { Button } from '@/components/ui/button';
import { getAppLoginUrl, getAppSignupUrl } from '@/lib/app-url';
import { ScrubHubLogo } from '@/components/brand/scrubhub-logo';
export async function Header() {
  const user = await getAuthUser();

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-[var(--container-max)] items-center justify-between px-4 py-4">
        <Link href="/" className="block py-1">
          <ScrubHubLogo variant="light" className="h-8 w-auto max-w-[180px] object-contain object-left" />
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/facility-map">Listings</Link>
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
                <Link href={getAppLoginUrl()}>Login</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href={getAppSignupUrl()}>Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
