import { requireRole } from '@/server/guards/require-role';
import { getPrimaryOrganizationForUser } from '@/server/services/organizations.service';
import { getJobPostsForOrg } from '@/server/services/job-posts.service';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardSection } from '@/components/dashboard/dashboard-section';
import { EnterpriseJobsClient } from '@/components/enterprise/enterprise-jobs-client';

export default async function EnterpriseJobsPage() {
  const user = await requireRole('enterprise');
  const organization = await getPrimaryOrganizationForUser(user.id);

  if (!organization) {
    return (
      <DashboardSection
        breadcrumb={[{ label: 'Dashboard', href: '/dashboard/enterprise' }, { label: 'Job posts' }]}
        title="Job posts"
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

  const jobs = await getJobPostsForOrg(organization.org_id);

  return (
    <DashboardSection
      breadcrumb={[{ label: 'Dashboard', href: '/dashboard/enterprise' }, { label: 'Job posts' }]}
      title="Job posts"
      description="Create and manage hiring posts for your organization."
    >
      <EnterpriseJobsClient jobs={jobs} orgId={organization.org_id} />
    </DashboardSection>
  );
}
