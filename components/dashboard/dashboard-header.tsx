import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { AppRole } from '@/types/database';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const ROLE_LABELS: Record<AppRole, string> = {
  tenant: 'Tenant',
  landlord: 'Landlord',
  enterprise: 'Enterprise',
};

export function DashboardHeader({ role }: { role: AppRole }) {
  return (
    <header className="border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[var(--container-max)] items-center justify-between gap-2 px-4 py-3">
        <Link href="/dashboard" className="font-semibold text-foreground">
          ScrubHub
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs rounded-md bg-muted px-2 py-1 text-muted-foreground">
                  {ROLE_LABELS[role]}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Current workspace role
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <form action="/api/auth/signout" method="post">
            <Button type="submit" variant="ghost" size="sm">
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
