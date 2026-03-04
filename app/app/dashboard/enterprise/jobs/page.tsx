import { requireRole } from '@/server/guards/require-role';
import { getPrimaryOrganizationForUser } from '@/server/services/organizations.service';
import { getJobPostsForOrg } from '@/server/services/job-posts.service';
import { CreateJobPostForm } from '@/components/enterprise/create-job-post-form';

export default async function EnterpriseJobsPage() {
  const user = await requireRole('enterprise');
  const organization = await getPrimaryOrganizationForUser(user.id);

  if (!organization) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-foreground">Job posts</h1>
        <p className="text-muted-foreground mt-2">Create an organization first from the enterprise dashboard.</p>
      </div>
    );
  }

  const jobs = await getJobPostsForOrg(organization.org_id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Job posts</h1>
      <CreateJobPostForm orgId={organization.org_id} />
      {!jobs.length ? (
        <p className="text-muted-foreground">No job posts yet.</p>
      ) : (
        <ul className="space-y-2">
          {jobs.map((job) => (
            <li key={job.id} className="rounded-md border border-border p-3">
              <p className="font-medium">{job.title}</p>
              <p className="text-sm text-muted-foreground capitalize">{job.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
