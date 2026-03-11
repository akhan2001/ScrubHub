import Link from 'next/link';
import { requireRole } from '@/server/guards/require-role';
import { getApplicationsForTenant } from '@/server/services/job-applications.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TenantJobApplicationsTable } from '@/components/tenant/tenant-job-applications-table';
import { DashboardSection } from '@/components/dashboard/dashboard-section';

export default async function TenantJobApplicationsPage() {
  const user = await requireRole('tenant');
  const applications = await getApplicationsForTenant(user.id);

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
        { label: 'Dashboard', href: '/dashboard/tenant/bookings' },
        { label: 'Job Applications' },
      ]}
      title="Job Applications"
      description="Track your submitted job applications and their status."
      action={
        <Button asChild size="sm" variant="outline">
          <Link href="/jobs">Browse jobs</Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Your applications</CardTitle>
          <CardDescription>
            Click a row to view application details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!applications.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">
                You haven&apos;t applied for any jobs yet.
              </p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/jobs">Browse available jobs</Link>
              </Button>
            </div>
          ) : (
            <TenantJobApplicationsTable applications={tableApplications} />
          )}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
