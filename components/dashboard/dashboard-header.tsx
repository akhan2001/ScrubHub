'use client';

import { useState, useTransition } from 'react';
import { Bell, Check, Menu, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { AppRole } from '@/types/database';
import { updateProfileRole } from '@/actions/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { NotificationsPanel } from '@/components/dashboard/notifications-panel';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';

const ROLE_LABELS: Record<AppRole, string> = {
  tenant: 'Healthcare Professional',
  landlord: 'Property Owner',
  enterprise: 'Enterprise',
};

const ROLE_SHORT: Record<AppRole, string> = {
  tenant: 'Tenant',
  landlord: 'Landlord',
  enterprise: 'Enterprise',
};

const ALL_ROLES: AppRole[] = ['tenant', 'landlord', 'enterprise'];

function getInitials(fullName: string | null, role: AppRole): string {
  if (fullName?.trim()) {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  }
  return ROLE_LABELS[role].charAt(0);
}

type DashboardHeaderUser = {
  fullName: string | null;
  avatarUrl: string | null;
};

export function DashboardHeader({
  role,
  user,
}: {
  role: AppRole;
  user: DashboardHeaderUser;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = pathname.split('/').at(-1)?.replace(/-/g, ' ') ?? 'overview';
  const initials = getInitials(user.fullName, role);
  const [isSwitching, startTransition] = useTransition();
  const otherRoles = ALL_ROLES.filter((r) => r !== role);

  function handleSwitchRole(newRole: AppRole) {
    if (isSwitching) return;
    startTransition(async () => {
      await updateProfileRole(newRole);
      router.push('/dashboard');
      router.refresh();
    });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-8">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <IconButton className="md:hidden" aria-label="Open navigation">
              <Menu className="size-4" />
            </IconButton>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <DashboardSidebar role={role} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground'
            )}
            aria-hidden
          >
            S
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {ROLE_SHORT[role]} Workspace
            </p>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="capitalize">{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <span className="text-muted-foreground">Dashboard</span>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <IconButton variant="subtle" aria-label="Notifications">
              <Bell className="size-4" />
            </IconButton>
          </SheetTrigger>
          <SheetContent side="right" className="w-full flex flex-col p-0 sm:max-w-md">
            <SheetTitle className="sr-only">Notifications</SheetTitle>
            <NotificationsPanel />
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Account menu"
            >
              <Avatar className="size-8">
                <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName ?? undefined} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-left text-sm font-medium text-foreground sm:inline">
                {user.fullName ?? ROLE_LABELS[role]}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Active Role
            </DropdownMenuLabel>
            <DropdownMenuItem disabled className="font-medium">
              <Check className="mr-2 size-3.5" />
              {ROLE_LABELS[role]}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Switch Role
            </DropdownMenuLabel>
            {otherRoles.map((r) => (
              <DropdownMenuItem
                key={r}
                disabled={isSwitching}
                onSelect={() => handleSwitchRole(r)}
              >
                <Plus className="mr-2 size-3.5" />
                {ROLE_LABELS[r]}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action="/api/auth/signout" method="post" className="w-full">
                <button type="submit" className="w-full text-left">Logout</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
