'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { getAppLoginUrl, getAppSignupUrl, getAppDashboardUrl } from '@/lib/app-url';
import type { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/housing', label: 'Practitioner Housing' },
  { href: '/staffing', label: 'Staffing' },
  { href: '/facility-map', label: 'Facility Map' },
  { href: '/plans', label: 'Membership Plans' },
  { href: '/listings', label: 'Listings' },
] as const;

type NavLabel = (typeof NAV_LINKS)[number]['label'];

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

function getActiveLabel(pathname: string): NavLabel | undefined {
  for (const { href, label } of NAV_LINKS) {
    if (isActivePath(pathname, href)) return label;
  }
  if (pathname.startsWith('/jobs')) return 'Staffing';
  return undefined;
}

export function SiteHeader({ user }: { user?: User | null }) {
  const pathname = usePathname();
  const activeLabel = getActiveLabel(pathname);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center border-b border-border/60 bg-white/95 backdrop-blur-md shadow-sm">
      <nav className="mx-auto flex w-full max-w-[88rem] items-center justify-between gap-4 px-4 py-0 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 select-none shrink-0 group"
          aria-label="ScrubHub Home"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none" className="text-primary-foreground">
              <path d="M14 6v16M10 10h8M10 18h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="14" cy="14" r="2" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xl font-extrabold text-foreground tracking-tight">ScrubHub</span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200',
                activeLabel === label
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted/60 text-muted-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          {user ? (
            <>
              <Link
                href={getAppDashboardUrl()}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-muted/60 transition-colors hidden sm:inline-block"
              >
                Dashboard
              </Link>
              <form action="/api/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold px-5 py-2.5 transition-all duration-200 shadow-sm hover:shadow"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href={getAppLoginUrl()}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground px-4 py-2 rounded-lg hover:bg-muted/60 transition-colors"
              >
                Log In
              </Link>
              <Link
                href={getAppSignupUrl()}
                className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold px-5 py-2.5 transition-all duration-200 shadow-sm hover:shadow"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border/60 bg-white">
          <div className="mx-auto max-w-[88rem] px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-semibold transition-colors',
                  activeLabel === label
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
