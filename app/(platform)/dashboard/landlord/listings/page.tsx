import { requireRole } from '@/server/guards/require-role';
import { getLandlordListingsWithDetails } from '@/server/services/listings.service';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ListingsTable } from '@/components/dashboard/listings-table';
import { DashboardSection } from '@/components/dashboard/dashboard-section';
import { NewListingModalControlled } from '@/components/landlord/new-listing-modal';
import { Plus } from 'lucide-react';

export default async function LandlordListingsPage() {
  const user = await requireRole('landlord');
  const listings = await getLandlordListingsWithDetails(user.id);

  return (
    <DashboardSection
      breadcrumb={[{ label: 'Dashboard', href: '/dashboard/landlord' }, { label: 'Listings' }]}
      title="Listings"
      description="Manage all properties, statuses, and incoming applications."
      action={
        <Button asChild size="sm">
          <Link href="/dashboard/landlord/listings?create=1">
            <Plus className="mr-1.5 size-3.5" />
            Create listing
          </Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Property pipeline</CardTitle>
          <CardDescription>Latest listings sorted by creation date.</CardDescription>
        </CardHeader>
        <CardContent>
          {listings.length ? (
            <ListingsTable listings={listings} />
          ) : (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm text-muted-foreground">No listings yet.</p>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/landlord/listings?create=1">Create your first listing</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <NewListingModalControlled />
    </DashboardSection>
  );
}
