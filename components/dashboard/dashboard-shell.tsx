import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import type { AppRole } from '@/types/database';

type DashboardUser = {
  fullName: string | null;
  avatarUrl: string | null;
};

export function DashboardShell({
  role,
  user,
  children,
}: {
  role: AppRole;
  user: DashboardUser;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="md:grid md:min-h-screen md:grid-cols-[260px_1fr]">
        <div className="hidden sticky top-0 h-screen overflow-y-auto border-r border-border md:block">
          <DashboardSidebar role={role} />
        </div>
        <div className="flex min-w-0 flex-col">
          <DashboardHeader role={role} user={user} />
          <main className="flex-1 flex flex-col">{children}</main>
        </div>
      </div>
    </div>
  );
}
