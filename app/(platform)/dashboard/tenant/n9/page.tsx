import { requireRole } from '@/server/guards/require-role';
import { getAllLeasesForTenant } from '@/server/services/leases.service';
import { fetchSavedN9FormsForTenant } from '@/server/repositories/saved-n9-forms.repository';
import { DashboardSection } from '@/components/dashboard/dashboard-section';
import { N9FormPageClient } from '@/components/n9/N9FormPageClient';

export default async function TenantN9Page() {
  const user = await requireRole('tenant');
  const leases = await getAllLeasesForTenant(user.id);

  let savedForms: Awaited<ReturnType<typeof fetchSavedN9FormsForTenant>> = [];
  try {
    savedForms = await fetchSavedN9FormsForTenant(user.id);
  } catch {
    // Table may not exist if migration 00012 has not been applied
  }

  return (
    <DashboardSection
      breadcrumb={[
        { label: 'Dashboard', href: '/dashboard/tenant' },
        { label: 'N9 Form' },
      ]}
      title="N9 Form"
      description="File a Tenant's Notice to End the Tenancy (Ontario LTB Form N9)."
    >
      <N9FormPageClient leases={leases} savedForms={savedForms} />
    </DashboardSection>
  );
}
