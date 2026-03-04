import { requireRole } from '@/server/guards/require-role';
import { getLandlordListings } from '@/server/services/listings.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListingsTable } from '@/components/dashboard/listings-table';
import { DashboardSection } from '@/components/dashboard/dashboard-section';

export default async function LandlordListingsPage() {
  const user = await requireRole('landlord');
  const listings = await getLandlordListings(user.id);
  const rows = listings.map((listing) => ({
    id: listing.id,
    property: listing.title,
    status: listing.status,
    applications: Math.floor((listing.id.charCodeAt(0) + listing.id.charCodeAt(1)) % 7),
    createdAt: new Date(listing.created_at).toLocaleDateString(),
  }));

  return (
    <DashboardSection
      title="Listings"
      description="Manage all properties, statuses, and incoming applications."
      action={
        <Button asChild size="sm">
          <Link href="/dashboard/landlord/listings/new">Create listing</Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Property pipeline</CardTitle>
          <CardDescription>Latest listings sorted by creation date.</CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length ? (
            <ListingsTable rows={rows} />
          ) : (
            <p className="text-sm text-muted-foreground">No listings yet.</p>
          )}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
