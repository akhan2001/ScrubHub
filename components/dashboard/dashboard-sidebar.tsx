"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AppRole } from '@/types/database';
import { cn } from '@/lib/utils';

type NavItem = { href: string; label: string };

const NAV_BY_ROLE: Record<AppRole, NavItem[]> = {
  tenant: [
    { href: '/dashboard/tenant', label: 'Overview' },
    { href: '/listings', label: 'Search listings' },
    { href: '/dashboard/tenant/bookings', label: 'Bookings' },
    { href: '/dashboard/tenant/profile', label: 'Profile' },
  ],
  landlord: [
    { href: '/dashboard/landlord', label: 'Overview' },
    { href: '/dashboard/landlord/listings', label: 'My listings' },
    { href: '/dashboard/landlord/listings/new', label: 'Create listing' },
    { href: '/dashboard/landlord/screening-rules', label: 'Screening rules' },
    { href: '/dashboard/landlord/approvals', label: 'Approvals' },
  ],
  enterprise: [
    { href: '/dashboard/enterprise', label: 'Overview' },
    { href: '/dashboard/enterprise/jobs', label: 'Job posts' },
    { href: '/dashboard/enterprise/team', label: 'Team access' },
  ],
};

export function DashboardSidebar({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <aside className="w-full border-b border-border bg-card px-4 py-3 lg:w-72 lg:border-r lg:border-b-0 lg:p-5">
      <nav className="flex flex-wrap gap-2 lg:flex-col">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md border px-3 py-2 text-sm transition-colors",
                active
                  ? "border-primary/35 bg-primary/12 font-semibold text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
