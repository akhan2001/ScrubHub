import { requireRole } from '@/server/guards/require-role';
import { DashboardSection } from '@/components/dashboard/dashboard-section';
import { NoticesPageClient } from '@/components/n9/NoticesPageClient';

export default async function LandlordNoticesPage() {
  await requireRole('landlord');

  return (
    <DashboardSection
      breadcrumb={[
        { label: 'Dashboard', href: '/dashboard/landlord' },
        { label: 'Notices' },
      ]}
      title="Termination notices"
      description="View and acknowledge N9 termination notices from your tenants."
    >
      <NoticesPageClient />
    </DashboardSection>
  );
}
