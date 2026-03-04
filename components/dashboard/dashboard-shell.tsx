import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { DashboardFooter } from '@/components/dashboard/dashboard-footer';
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
      <DashboardHeader role={role} />
      <div className="mx-auto flex w-full max-w-6xl flex-col lg:min-h-[calc(100vh-102px)] lg:flex-row">
        <DashboardSidebar role={role} />
        <main className="w-full flex-1 p-4 lg:p-6">{children}</main>
      </div>
      <DashboardFooter />
    </div>
  );
}
