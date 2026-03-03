import { requireRole } from '@/server/guards/require-role';
import { getLandlordListingsCount } from '@/server/services/listings.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function LandlordDashboardPage() {
  const user = await requireRole('landlord');
  const count = await getLandlordListingsCount(user.id);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4 text-foreground">Landlord dashboard</h1>
      <p className="text-muted-foreground mb-6">
        You have <strong className="text-foreground">{count}</strong> listing{count === 1 ? '' : 's'}.
      </p>
      <div className="flex flex-col gap-2">
        <Button variant="outline" asChild>
          <Link href="/dashboard/landlord/listings">My listings</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/landlord/listings/new">Create listing</Link>
        </Button>
      </div>
    </div>
  );
}
