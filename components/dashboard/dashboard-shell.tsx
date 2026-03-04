import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import type { AppRole } from '@/types/database';

export function DashboardShell({
  role,
  children,
}: {
  role: AppRole;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="md:grid md:min-h-screen md:grid-cols-[260px_1fr]">
        <div className="hidden border-r border-border md:block">
          <DashboardSidebar role={role} />
        </div>
        <div className="flex min-w-0 flex-col">
          <DashboardHeader role={role} />
          <main className="flex-1 flex flex-col">{children}</main>
        </div>
      </div>
    </div>
  );
}
