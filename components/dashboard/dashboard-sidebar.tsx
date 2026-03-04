"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  CircleCheckBig,
  ClipboardList,
  Home,
  ReceiptText,
  Search,
  ShieldCheck,
  Users,
  UserRound,
} from 'lucide-react';
import type { AppRole } from '@/types/database';
import { cn } from '@/lib/utils';

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };
type NavSection = { label: string; items: NavItem[] };

const NAV_BY_ROLE: Record<AppRole, NavSection[]> = {
  tenant: [
    {
      label: 'Main',
      items: [
        { href: '/dashboard/tenant', label: 'Overview', icon: Home },
        { href: '/dashboard/listings', label: 'Search listings', icon: Search },
        { href: '/dashboard/tenant/bookings', label: 'My bookings', icon: ClipboardList },
      ],
    },
    {
      label: 'Account',
      items: [
        { href: '/dashboard/profile', label: 'Profile', icon: UserRound },
      ],
    },
  ],
  landlord: [
    {
      label: 'Main',
      items: [
        { href: '/dashboard/landlord', label: 'Overview', icon: Home },
        { href: '/dashboard/landlord/listings', label: 'Listings', icon: Building2 },
        { href: '/dashboard/landlord/approvals', label: 'Approvals', icon: CircleCheckBig },
        { href: '/dashboard/landlord/screening-rules', label: 'Screening rules', icon: ShieldCheck },
      ],
    },
    {
      label: 'Account',
      items: [
        { href: '/dashboard/profile', label: 'Profile', icon: UserRound },
      ],
    },
  ],
  enterprise: [
    {
      label: 'Main',
      items: [
        { href: '/dashboard/enterprise', label: 'Overview', icon: Home },
        { href: '/dashboard/enterprise/jobs', label: 'Job posts', icon: ReceiptText },
        { href: '/dashboard/enterprise/team', label: 'Team access', icon: Users },
      ],
    },
    {
      label: 'Account',
      items: [
        { href: '/dashboard/profile', label: 'Profile', icon: UserRound },
      ],
    },
  ],
};

/** Active only when pathname exactly matches the nav href (one highlight per page). */
function isActivePath(pathname: string, href: string) {
  return pathname === href;
}

export function DashboardSidebar({
  role,
  onNavigate,
  className,
}: {
  role: AppRole;
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname();
  const sections = NAV_BY_ROLE[role];
  return (
    <aside className={cn("h-full border-r border-border bg-card", className)}>
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link href="/dashboard" onClick={onNavigate} className="text-base font-semibold text-foreground">
          ScrubHub
        </Link>
      </div>
      <nav className="space-y-6 p-4">
        {sections.map((section) => (
          <div key={section.label} className="space-y-2">
            <p className="px-2 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {section.label}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
                      active
                        ? "bg-muted text-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
