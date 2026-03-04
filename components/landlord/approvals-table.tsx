'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ApplicationSheet } from '@/components/landlord/application-sheet';
import { BookingApprovalActions } from '@/components/landlord/booking-approval-actions';
import type { BookingWithTenantProfile } from '@/server/repositories/bookings.repository';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

function statusVariant(status: string) {
  switch (status) {
    case 'approved':
      return 'default';
    case 'rejected':
      return 'destructive';
    default:
      return 'secondary';
  }
}

function ScreeningIcon({ result }: { result: unknown }) {
  const r = result as { pass?: boolean } | null;
  if (!r) return <Clock className="size-3.5 text-muted-foreground" />;
  return r.pass
    ? <CheckCircle2 className="size-3.5 text-green-600" />
    : <XCircle className="size-3.5 text-red-600" />;
}

interface ApprovalsTableProps {
  bookings: BookingWithTenantProfile[];
}

export function ApprovalsTable({ bookings }: ApprovalsTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingWithTenantProfile | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function openSheet(booking: BookingWithTenantProfile) {
    setSelectedBooking(booking);
    setSheetOpen(true);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tenant</TableHead>
            <TableHead>Listing</TableHead>
            <TableHead>Move-in</TableHead>
            <TableHead>Screening</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id} className="cursor-pointer" onClick={() => openSheet(b)}>
              <TableCell className="font-medium">
                {b.tenant_name ?? b.tenant_user_id.slice(0, 8)}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {b.listing_title ?? b.listing_id.slice(0, 8)}
              </TableCell>
              <TableCell className="text-sm">
                {b.move_in_date_requested ?? '—'}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1.5">
                  <ScreeningIcon result={b.credit_check_result} />
                  <ScreeningIcon result={b.background_check_result} />
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(b.status)} className="capitalize">
                  {b.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(b.requested_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                {(b.status === 'requested' || b.status === 'reviewing') ? (
                  <BookingApprovalActions bookingId={b.id} />
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => openSheet(b)}>
                    View
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ApplicationSheet
        booking={selectedBooking}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
