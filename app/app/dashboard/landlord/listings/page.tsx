import { requireRole } from '@/server/guards/require-role';
import { getLandlordListings } from '@/server/services/listings.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function LandlordListingsPage() {
  const user = await requireRole('landlord');
  const listings = await getLandlordListings(user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">My listings</h1>
        <Button asChild size="sm">
          <Link href="/dashboard/landlord/listings/new">Create listing</Link>
        </Button>
      </div>
      {!listings.length ? (
        <p className="rounded-[var(--card-radius)] border border-border bg-card p-5 text-muted-foreground">No listings yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.map((listing) => (
              <TableRow key={listing.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/listings/${listing.id}`}
                    className="text-foreground transition-colors hover:text-primary"
                  >
                    {listing.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={listing.status === 'published' ? 'success' : 'secondary'} className="capitalize">
                    {listing.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/listings/${listing.id}`}>Open</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
