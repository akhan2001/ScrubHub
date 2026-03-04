import { requireRole } from '@/server/guards/require-role';
import { getOrganizationMembers, getPrimaryOrganizationForUser } from '@/server/services/organizations.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DashboardSection } from '@/components/dashboard/dashboard-section';

export default async function EnterpriseTeamPage() {
  const user = await requireRole('enterprise');
  const organization = await getPrimaryOrganizationForUser(user.id);

  if (!organization) {
    return (
      <DashboardSection
        breadcrumb={[{ label: 'Dashboard', href: '/dashboard/enterprise' }, { label: 'Team access' }]}
        title="Team access"
        description="No organization found. Create one first."
      >
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Organization is required before managing team access.</p>
          </CardContent>
        </Card>
      </DashboardSection>
    );
  }

  const members = await getOrganizationMembers(organization.org_id);

  return (
    <DashboardSection
      breadcrumb={[{ label: 'Dashboard', href: '/dashboard/enterprise' }, { label: 'Team access' }]}
      title="Team access"
      description="Manage organization members and role assignments."
    >
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>Current users with access to this organization.</CardDescription>
        </CardHeader>
        <CardContent>
          {!members.length ? (
            <p className="text-sm text-muted-foreground">No members yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="flex items-center gap-2 font-medium">
                      <Avatar className="size-7">
                        <AvatarFallback>{member.user_id.slice(0, 1).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {member.user_id.slice(0, 10)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">{member.role}</Badge>
                    </TableCell>
                    <TableCell>{new Date(member.created_at).toLocaleDateString()}</TableCell>
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
