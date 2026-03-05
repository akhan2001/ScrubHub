import { requireRole } from '@/server/guards/require-role';
import { getAllLeasesForTenant } from '@/server/services/leases.service';
import { DashboardSection } from '@/components/dashboard/dashboard-section';
import { TenancyPageClient } from '@/components/n9/TenancyPageClient';

export default async function TenantTenancyPage() {
  const user = await requireRole('tenant');
  const leases = await getAllLeasesForTenant(user.id);

  return (
    <DashboardSection
      breadcrumb={[
        { label: 'Dashboard', href: '/dashboard/tenant' },
        { label: 'My tenancy' },
      ]}
      title="My tenancy"
      description="View your active leases and manage your tenancy."
    >
      <TenancyPageClient leases={leases} />
    </DashboardSection>
  );
}
