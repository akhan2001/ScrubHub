import { requireRole } from '@/server/guards/require-role';
import { getPrimaryOrganizationForUser } from '@/server/services/organizations.service';
import { CreateOrganizationForm } from '@/components/enterprise/create-organization-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function EnterpriseDashboardPage() {
  const user = await requireRole('enterprise');
  const organization = await getPrimaryOrganizationForUser(user.id);

  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-foreground">Enterprise dashboard</h1>
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
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/dashboard/enterprise/jobs">Manage job posts</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/enterprise/team">Manage team access</Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
