import { requireRole } from '@/server/guards/require-role';
import { getLandlordListings } from '@/server/services/listings.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default async function LandlordListingsPage() {
  const user = await requireRole('landlord');
  const listings = await getLandlordListings(user.id);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">My listings</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/landlord/listings/new">Create listing</Link>
        </Button>
      </div>
      {!listings.length ? (
        <p className="text-muted-foreground">No listings yet.</p>
      ) : (
        <ul className="space-y-2">
          {listings.map((listing) => (
            <li
              key={listing.id}
              className="flex items-center gap-4 py-3 border-b border-border last:border-0"
            >
              <Link
                href={`/listings/${listing.id}`}
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                {listing.title}
              </Link>
              <Badge variant="secondary" className="capitalize ml-auto">
                {listing.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
