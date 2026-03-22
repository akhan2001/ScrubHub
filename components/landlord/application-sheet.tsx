'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
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
import { getUserFacingErrorMessage } from '@/lib/errors/user-facing-error';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, AlertTriangle, ExternalLink, Minus } from 'lucide-react';
import type { BookingWithTenantProfile } from '@/server/repositories/bookings.repository';

interface ApplicationSheetProps {
  booking: BookingWithTenantProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPhone(phone: string | null): string {
  if (!phone) return 'N/A';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Not specified';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function ScreeningBadge({ result, label }: { result: unknown; label: string }) {
  const r = result as { pass?: boolean; skipped?: boolean } | null;
  if (!r) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <AlertTriangle className="size-3 shrink-0" /> {label}: Not run
      </span>
    );
  }
  if (r.skipped) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Minus className="size-3 shrink-0" /> {label}: Skipped
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${r.pass ? 'text-green-700' : 'text-red-700'}`}>
      {r.pass ? <CheckCircle2 className="size-3 shrink-0" /> : <XCircle className="size-3 shrink-0" />}
      {label}: {r.pass ? 'Passed' : 'Failed'}
    </span>
  );
}

const STATUS_LABELS: Record<string, string> = {
  requested: 'Submitted',
  reviewing: 'Under review',
  approved: 'Approved',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  completed: 'Completed',
  withdrawn: 'Withdrawn',
};

export function ApplicationSheet({ booking, open, onOpenChange }: ApplicationSheetProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAction = useCallback(
    async (status: 'approved' | 'rejected') => {
      if (!booking) return;
      setLoading(true);
      try {
        await updateBookingStatus({ bookingId: booking.id, status });
        toast.success(`Application ${status}`);
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        toast.error(
          getUserFacingErrorMessage(err, "We couldn't update this application. Please try again.")
        );
      } finally {
        setLoading(false);
      }
    },
    [booking, onOpenChange, router]
  );

  if (!booking) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col overflow-hidden p-0 sm:max-w-lg">
        <SheetHeader className="shrink-0 border-b border-border px-4 py-4">
          <SheetTitle>Application Details</SheetTitle>
          <SheetDescription>
            {booking.listing_title ?? 'Unknown listing'}
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Applicant</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <span className="text-muted-foreground">Name</span>
                <span>{booking.tenant_name ?? 'N/A'}</span>
                <span className="text-muted-foreground">Email</span>
                <span className="truncate" title={booking.tenant_email ?? undefined}>
                  {booking.tenant_email ?? 'N/A'}
                </span>
                <span className="text-muted-foreground">Phone</span>
                <span>{formatPhone(booking.tenant_phone)}</span>
              </div>
            </section>

            <Separator />

            <section className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Application</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <span className="text-muted-foreground">Status</span>
                <span>
                  <Badge variant="secondary" className="capitalize">
                    {STATUS_LABELS[booking.status] ?? booking.status}
                  </Badge>
                </span>
                <span className="text-muted-foreground">Submitted</span>
                <span>{formatDate(booking.requested_at)}</span>
                <span className="text-muted-foreground">Desired Move-in</span>
                <span>{formatDate(booking.move_in_date_requested)}</span>
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

            <div className="flex flex-col gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/dashboard/landlord/listings/${booking.listing_id}`}>
                  <ExternalLink className="mr-2 size-4" />
                  View listing
                </Link>
              </Button>
            </div>

            {(booking.status === 'requested' || booking.status === 'reviewing') && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => handleAction('approved')}
                    className="flex-1"
                    disabled={loading}
                  >
                    {loading ? 'Updating…' : 'Approve'}
                  </Button>
                  <Button
                    onClick={() => handleAction('rejected')}
                    variant="destructive"
                    className="flex-1"
                    disabled={loading}
                  >
                    Reject
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
