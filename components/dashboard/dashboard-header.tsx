import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { AppRole } from '@/types/database';

const ROLE_LABELS: Record<AppRole, string> = {
  tenant: 'Tenant',
  landlord: 'Landlord',
  enterprise: 'Enterprise',
};

export function DashboardHeader({ role }: { role: AppRole }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-3">
        <Link href="/dashboard" className="font-semibold text-foreground">
          ScrubHub
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs rounded-md bg-muted px-2 py-1 text-muted-foreground">
            {ROLE_LABELS[role]}
          </span>
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
