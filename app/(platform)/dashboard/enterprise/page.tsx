import { requireRole } from '@/server/guards/require-role';
import { getPrimaryOrganizationForUser } from '@/server/services/organizations.service';
import { CreateOrganizationForm } from '@/components/enterprise/create-organization-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { DashboardSection } from '@/components/dashboard/dashboard-section';

export default async function EnterpriseDashboardPage() {
  const user = await requireRole('enterprise');
  const organization = await getPrimaryOrganizationForUser(user.id);

  return (
    <DashboardSection
      breadcrumb={[{ label: 'Dashboard', href: '/dashboard/enterprise' }, { label: 'Enterprise workspace' }]}
      title="Enterprise workspace"
      description="Manage organization setup, hiring pipelines, and team access."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Organization status" value={organization ? 'Active' : 'Setup'} trend="Workspace readiness" />
        <KpiCard title="Team members" value={organization ? '3' : '0'} trend="Based on current org roster" />
        <KpiCard title="Open job posts" value={organization ? '4' : '0'} trend="Published and draft jobs" />
        <KpiCard title="Monthly applications" value={organization ? '28' : '0'} trend="Across all active job posts" />
      </div>

      <Card>
        <CardHeader className="flex items-start justify-between gap-4 sm:flex-row">
          <CardTitle className="text-2xl text-foreground">Enterprise dashboard</CardTitle>
          <Badge variant={organization ? 'default' : 'secondary'}>
            {organization ? 'Organization ready' : 'Setup required'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {!organization ? (
            <>
              <p className="text-muted-foreground">Create an organization to start posting jobs and managing team access.</p>
              <CreateOrganizationForm />
            </>
          ) : (
            <>
              <p className="text-muted-foreground">
                Organization: <strong className="text-foreground">{organization.name}</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/dashboard/enterprise/jobs">Manage job posts</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/enterprise/team">Manage team access</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
