import { requireRole } from '@/server/guards/require-role';
import { getPrimaryOrganizationForUser } from '@/server/services/organizations.service';
import { getApplicationsForOrg } from '@/server/services/job-applications.service';
import { Card, CardContent } from '@/components/ui/card';
import { ApplicationsTable } from '@/components/enterprise/applications-table';
import { DashboardSection } from '@/components/dashboard/dashboard-section';

export default async function EnterpriseApplicationsPage() {
  const user = await requireRole('enterprise');
  const organization = await getPrimaryOrganizationForUser(user.id);

  if (!organization) {
    return (
      <DashboardSection
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard/enterprise' },
          { label: 'Applications' },
        ]}
        title="Applications"
        description="Create an organization first from the enterprise dashboard."
      >
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">No organization found yet.</p>
          </CardContent>
        </Card>
      </DashboardSection>
    );
  }

  const applications = await getApplicationsForOrg(organization.org_id);

  const tableApplications = applications.map((app) => ({
    id: app.id,
    email: app.email,
    phone: app.phone,
    job_title: app.job_title,
    job_post_id: app.job_post_id,
    status: app.status,
    created_at: app.created_at,
    cover_message: app.cover_message,
  }));

  return (
    <DashboardSection
      breadcrumb={[
        { label: 'Dashboard', href: '/dashboard/enterprise' },
        { label: 'Applications' },
      ]}
      title="Applications"
      description="Job applications submitted to your organization's job posts."
    >
      <Card>
        <CardContent className="pt-6">
          {!applications.length ? (
            <p className="text-sm text-muted-foreground">No applications yet.</p>
          ) : (
            <ApplicationsTable applications={tableApplications} />
          )}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
