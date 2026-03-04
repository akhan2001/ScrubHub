'use client';

import { Bell, Menu, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { AppRole } from '@/types/database';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { IconButton } from '@/components/ui/icon-button';

const ROLE_LABELS: Record<AppRole, string> = {
  tenant: 'Tenant',
  landlord: 'Landlord',
  enterprise: 'Enterprise',
};

export function DashboardHeader({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const pageTitle = pathname.split('/').at(-1)?.replace('-', ' ') ?? 'overview';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <IconButton className="md:hidden" aria-label="Open navigation">
              <Menu className="size-4" />
            </IconButton>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <DashboardSidebar role={role} />
          </SheetContent>
        </Sheet>
        <div>
          <p className="text-sm font-semibold text-foreground">{ROLE_LABELS[role]} Workspace</p>
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
      <div className="flex items-center gap-2">
        <div className="relative hidden lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-9 w-64 pl-9" placeholder="Search listings, users, bookings..." />
        </div>
        <IconButton variant="subtle" aria-label="Notifications">
          <Bell className="size-4" />
        </IconButton>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" className="inline-flex items-center rounded-full">
              <Avatar>
                <AvatarFallback>{ROLE_LABELS[role].charAt(0)}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>{ROLE_LABELS[role]} account</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/onboarding">Settings</Link>
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
