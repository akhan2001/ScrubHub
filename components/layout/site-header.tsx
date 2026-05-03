/* =============================================================
   components/layout/site-header.tsx — warm residential header
   Drop-in replacement. Keeps mobile menu, auth states, ScrubHubLogo.
   ============================================================= */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { getAppLoginUrl, getAppSignupUrl, getAppDashboardUrl } from '@/lib/app-url';
import type { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { ScrubHubLogo } from '@/components/brand/scrubhub-logo';

const NAV_LINKS = [
  { href: '/facility-map', label: 'Stays' },
  { href: '/staffing',     label: 'Staffing' },
  { href: '/plans',        label: 'Pricing' },
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
    <header className="sticky top-0 z-40 flex h-[72px] shrink-0 items-center border-b border-[#E5DFD2] bg-[#F7F4EE]/92 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 px-6 sm:px-8">
        <Link href="/" className="flex select-none shrink-0 items-center transition-opacity hover:opacity-90" aria-label="ScrubHub Home">
          <ScrubHubLogo variant="light" priority className="h-8 w-auto max-w-[180px] object-contain object-left" />
        </Link>

        <div className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-[14px] font-medium transition-colors',
                activeLabel === label ? 'text-[#0E1A2B]' : 'text-[#3A4759] hover:text-[#0E1A2B]'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 rounded-lg hover:bg-[#EFE9DD] text-[#3A4759]"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          {user ? (
            <>
              <Link href={getAppDashboardUrl()} className="hidden sm:inline-block text-[14px] font-medium text-[#3A4759] hover:text-[#0E1A2B] px-3 py-2 transition-colors">
                Dashboard
              </Link>
              <form action="/api/auth/signout" method="post">
                <button type="submit" className="rounded-full bg-[#0E1A2B] hover:bg-[#1a2a3f] text-white text-[14px] font-semibold px-5 h-10 transition">
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href={getAppLoginUrl()} className="text-[14px] font-medium text-[#3A4759] hover:text-[#0E1A2B] px-3 py-2 transition-colors">
                Sign in
              </Link>
              <Link href={getAppSignupUrl()} className="rounded-full bg-[#0E1A2B] hover:bg-[#1a2a3f] text-white text-[14px] font-semibold px-5 h-10 inline-flex items-center transition">
                List a unit
              </Link>
            </>
          )}
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E5DFD2] bg-[#F7F4EE] absolute top-full inset-x-0">
          <div className="mx-auto max-w-[1320px] px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-3 text-[15px] font-medium transition-colors border-b border-[#E5DFD2] last:border-0',
                  activeLabel === label ? 'text-[#0E1A2B]' : 'text-[#3A4759]'
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
