import { getSessionUser } from '@/server/auth/get-session-user';
import { getProfile } from '@/server/services/profiles.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DashboardSection } from '@/components/dashboard/dashboard-section';

export default async function TenantProfilePage() {
  const session = await getSessionUser();
  const profile = await getProfile(session.id);

  return (
    <DashboardSection
      breadcrumb={[
        { label: 'Dashboard', href: '/dashboard/tenant/bookings' },
        { label: 'Profile' },
      ]}
      title="Tenant profile"
      description="Manage identity and verification details."
    >
      <Card>
        <CardHeader className="flex items-start justify-between gap-3 sm:flex-row">
          <div>
            <CardTitle>Account details</CardTitle>
            <CardDescription>Profile and verification status used across bookings.</CardDescription>
          </div>
          <Badge variant={profile?.verification_state === 'verified' ? 'default' : 'secondary'} className="capitalize">
            {profile?.verification_state ?? 'pending'}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-md border border-border bg-muted/50 p-3 text-sm">
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium text-foreground">{profile?.email ?? 'Unknown'}</p>
          </div>
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
