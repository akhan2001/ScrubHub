import { requireRole } from '@/server/guards/require-role';
import { getLandlordBookingsWithProfiles } from '@/server/services/bookings.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSection } from '@/components/dashboard/dashboard-section';
import { ApprovalsTable } from '@/components/landlord/approvals-table';

export default async function LandlordApprovalsPage() {
  const user = await requireRole('landlord');
  const bookings = await getLandlordBookingsWithProfiles(user.id);

  return (
    <DashboardSection
      breadcrumb={[{ label: 'Dashboard', href: '/dashboard/landlord' }, { label: 'Approvals' }]}
      title="Applications"
      description="Review tenant applications, screening results, and make decisions."
    >
      <Card>
        <CardHeader>
          <CardTitle>Application Pipeline</CardTitle>
          <CardDescription>All applications requiring your attention.</CardDescription>
        </CardHeader>
        <CardContent>
          {!bookings.length ? (
            <p className="text-sm text-muted-foreground">No applications yet.</p>
          ) : (
            <ApprovalsTable bookings={bookings} />
          )}
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
