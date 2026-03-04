import Link from 'next/link';
import type { AppRole } from '@/types/database';

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
  const items = NAV_BY_ROLE[role];

  return (
    <aside className="w-full border-b border-border bg-card px-4 py-3 lg:w-64 lg:border-b-0 lg:border-r">
      <nav className="flex flex-wrap gap-2 lg:flex-col">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
