import { requireRole } from '@/server/guards/require-role';
import { getOrganizationMembers, getPrimaryOrganizationForUser } from '@/server/services/organizations.service';

export default async function EnterpriseTeamPage() {
  const user = await requireRole('enterprise');
  const organization = await getPrimaryOrganizationForUser(user.id);

  if (!organization) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-foreground">Team access</h1>
        <p className="text-muted-foreground mt-2">No organization found. Create one first.</p>
      </div>
    );
  }

  const members = await getOrganizationMembers(organization.org_id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Team access</h1>
      {!members.length ? (
        <p className="text-muted-foreground">No members yet.</p>
      ) : (
        <ul className="space-y-2">
          {members.map((member) => (
            <li key={member.id} className="rounded-md border border-border p-3">
              <p className="text-sm text-muted-foreground">User ID: {member.user_id}</p>
              <p className="capitalize">Role: {member.role}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
