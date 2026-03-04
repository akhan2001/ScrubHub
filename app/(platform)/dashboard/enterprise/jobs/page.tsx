import { requireRole } from '@/server/guards/require-role';
import { getPrimaryOrganizationForUser } from '@/server/services/organizations.service';
import { getJobPostsForOrg } from '@/server/services/job-posts.service';
import { CreateJobPostForm } from '@/components/enterprise/create-job-post-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DashboardSection } from '@/components/dashboard/dashboard-section';

export default async function EnterpriseJobsPage() {
  const user = await requireRole('enterprise');
  const organization = await getPrimaryOrganizationForUser(user.id);

  if (!organization) {
    return (
      <DashboardSection title="Job posts" description="Create an organization first from the enterprise dashboard.">
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
    <DashboardSection title="Job posts" description="Create and manage hiring posts for your organization.">
      <Card>
        <CardHeader>
          <CardTitle>Create job post</CardTitle>
          <CardDescription>New entries become visible in your recruiting pipeline.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateJobPostForm orgId={organization.org_id} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Current posts</CardTitle>
        </CardHeader>
        <CardContent>
          {!jobs.length ? (
            <p className="text-sm text-muted-foreground">No job posts yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>
                      <Badge variant={job.status === 'published' ? 'success' : 'secondary'} className="capitalize">
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
