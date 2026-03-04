import { requireRole } from '@/server/guards/require-role';
import { getLandlordListingsCount } from '@/server/services/listings.service';
import { getProfile } from '@/server/services/profiles.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function LandlordDashboardPage() {
  const user = await requireRole('landlord');
  const profile = await getProfile(user.id);
  const count = await getLandlordListingsCount(user.id);

  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-semibold mb-3 text-foreground">Landlord dashboard</h1>
      <p className="text-muted-foreground mb-6">
        You have <strong className="text-foreground">{count}</strong> listing{count === 1 ? '' : 's'}.
      </p>
      {profile?.verification_state !== 'verified' && (
        <p className="mb-6 rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-800">
          Your landlord verification is <strong>{profile?.verification_state}</strong>. Listing creation and
          approvals are restricted until you are verified.
        </p>
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
