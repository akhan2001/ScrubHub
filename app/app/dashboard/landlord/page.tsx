import { requireRole } from '@/server/guards/require-role';
import { getLandlordListingsCount } from '@/server/services/listings.service';
import { getProfile } from '@/server/services/profiles.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function LandlordDashboardPage() {
  const user = await requireRole('landlord');
  const profile = await getProfile(user.id);
  const count = await getLandlordListingsCount(user.id);

  return (
    <section className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Landlord dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You have <strong className="text-foreground">{count}</strong> listing{count === 1 ? '' : 's'}.
          </p>
        </CardContent>
      </Card>
      {profile?.verification_state !== 'verified' && (
        <Alert tone="warning">
          <AlertTitle>Verification required</AlertTitle>
          <AlertDescription>
            Your landlord verification is <strong>{profile?.verification_state}</strong>. Listing creation and approvals are restricted until you are verified.
          </AlertDescription>
        </Alert>
      )}
      <div className="flex flex-col gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard/landlord/listings">My listings</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/landlord/listings/new">Create listing</Link>
        </Button>
      </div>
    </section>
  );
}
