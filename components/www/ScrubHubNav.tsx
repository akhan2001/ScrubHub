'use client';

import Link from 'next/link';
import { getAppLoginUrl, getAppSignupUrl, getAppDashboardUrl } from '@/lib/app-url';
import { ScrubHubLogo } from '@/components/brand/scrubhub-logo';
import type { User } from '@supabase/supabase-js';

const NAV_LINKS = [
  { href: '/facility-map', label: 'Listings' },
  { href: '/staffing', label: 'Staffing' },
  { href: '/plans', label: 'Membership Plans' },
] as const;

type ActivePage = (typeof NAV_LINKS)[number]['label'];

export function ScrubHubNav({
  activePage,
  user,
}: {
  activePage?: ActivePage;
  user?: User | null;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-[88rem] items-center justify-between px-6 py-4">
        <Link href="/" className="flex select-none shrink-0 items-center">
          <ScrubHubLogo variant="light" className="h-9 w-auto max-w-[200px] object-contain object-left" />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-semibold transition-colors duration-200 ${
                activePage === label
                  ? 'text-foreground border-b-2 border-primary pb-0.5'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href={getAppDashboardUrl()}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
              >
                Dashboard
              </Link>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold px-5 py-2.5 transition-all duration-200 shadow-md"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href={getAppLoginUrl()}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link
                href={getAppSignupUrl()}
                className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold px-5 py-2.5 transition-all duration-200 shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export function MiaFab() {
  return (
    <Link
      href={getAppSignupUrl()}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 shadow-lg hover:bg-primary/90 hover:scale-105 transition-all duration-300 border border-white/10"
      aria-label="Sign up"
    >
      <span className="font-semibold text-sm tracking-wide">Sign Up Free</span>
    </Link>
  );
}
