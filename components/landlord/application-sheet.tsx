'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { updateBookingStatus } from '@/actions/bookings';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { BookingWithTenantProfile } from '@/server/repositories/bookings.repository';

interface ApplicationSheetProps {
  booking: BookingWithTenantProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ScreeningBadge({ result, label }: { result: unknown; label: string }) {
  const r = result as { pass?: boolean } | null;
  if (!r) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <AlertTriangle className="size-3" /> {label}: Pending
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${r.pass ? 'text-green-700' : 'text-red-700'}`}>
      {r.pass ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
      {label}: {r.pass ? 'Passed' : 'Failed'}
    </span>
  );
}

export function ApplicationSheet({ booking, open, onOpenChange }: ApplicationSheetProps) {
  const router = useRouter();

  if (!booking) return null;

  async function handleAction(status: 'approved' | 'rejected') {
    try {
      await updateBookingStatus({ bookingId: booking!.id, status });
      toast.success(`Application ${status}`);
      onOpenChange(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update');
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Application Details</SheetTitle>
          <SheetDescription>
            {booking.listing_title ?? 'Unknown listing'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Applicant</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Name</span>
              <span>{booking.tenant_name ?? 'N/A'}</span>
              <span className="text-muted-foreground">Email</span>
              <span>{booking.tenant_email ?? 'N/A'}</span>
              <span className="text-muted-foreground">Phone</span>
              <span>{booking.tenant_phone ?? 'N/A'}</span>
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Application</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Status</span>
              <span>
                <Badge variant="secondary" className="capitalize">{booking.status}</Badge>
              </span>
              <span className="text-muted-foreground">Submitted</span>
              <span>{new Date(booking.requested_at).toLocaleDateString()}</span>
              <span className="text-muted-foreground">Desired Move-in</span>
              <span>{booking.move_in_date_requested ?? 'Not specified'}</span>
            </div>
            {booking.message_to_landlord && (
              <div className="mt-2">
                <p className="text-xs font-medium text-muted-foreground">Message</p>
                <p className="mt-1 rounded-md bg-muted p-3 text-sm">{booking.message_to_landlord}</p>
              </div>
            )}
          </section>

          <Separator />

          <section className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Screening Results</h4>
            <div className="flex flex-col gap-2">
              <ScreeningBadge result={booking.credit_check_result} label="Credit" />
              <ScreeningBadge result={booking.background_check_result} label="Background" />
              <ScreeningBadge result={booking.screening_result} label="Overall" />
            </div>
          </section>

          {(booking.status === 'requested' || booking.status === 'reviewing') && (
            <>
              <Separator />
              <div className="flex items-center gap-3">
                <Button onClick={() => handleAction('approved')} className="flex-1">
                  Approve
                </Button>
                <Button onClick={() => handleAction('rejected')} variant="destructive" className="flex-1">
                  Reject
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
