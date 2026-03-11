import Link from 'next/link';
import { requireRole } from '@/server/guards/require-role';
import { getTenantBookingsWithListing } from '@/server/services/bookings.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TenantBookingsTable } from '@/components/tenant/tenant-bookings-table';
import { DashboardSection } from '@/components/dashboard/dashboard-section';
import { MapPin, Search } from 'lucide-react';

export default async function TenantBookingsPage() {
  const user = await requireRole('tenant');
  const bookings = await getTenantBookingsWithListing(user.id);

  return (
    <DashboardSection
      breadcrumb={[
        { label: 'Dashboard', href: '/dashboard/tenant/bookings' },
        { label: 'Booking Applications' },
      ]}
      title="Booking Applications"
      description="Track your housing applications and see their status."
      action={
        <Button asChild size="sm">
          <Link href="/facility-map">Browse Listings</Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Your applications</CardTitle>
          <CardDescription>
            Click any row to view details, status, and next steps.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!bookings.length ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 py-16 px-6 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                <MapPin className="size-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No applications yet
              </h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Browse healthcare listings near you and apply for your next place. 
                Your applications will appear here so you can track their status.
              </p>
              <Button asChild className="mt-6">
                <Link href="/facility-map">
                  <Search className="mr-2 size-4" />
                  Find listings
                </Link>
              </Button>
            </div>
          ) : (
            <TenantBookingsTable bookings={bookings} />
          )}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
