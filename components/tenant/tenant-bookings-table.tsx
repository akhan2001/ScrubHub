'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  BookingDetailSheet,
  type BookingForSheet,
} from '@/components/tenant/booking-detail-sheet';
import { cn } from '@/lib/utils';

function formatPrice(cents: number | null) {
  if (!cents) return '—';
  return `$${Math.round(cents / 100).toLocaleString()}/mo`;
}

const STATUS_LABELS: Record<string, string> = {
  requested: 'Submitted',
  reviewing: 'Under review',
  approved: 'Approved',
  rejected: 'Not approved',
  cancelled: 'Cancelled',
  completed: 'Completed',
  withdrawn: 'Withdrawn',
};

interface TenantBookingsTableProps {
  bookings: BookingForSheet[];
}

export function TenantBookingsTable({ bookings }: TenantBookingsTableProps) {
  const [selected, setSelected] = useState<BookingForSheet | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleRowClick(booking: BookingForSheet) {
    setSelected(booking);
    setSheetOpen(true);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead className="w-[6rem]">Status</TableHead>
              <TableHead className="hidden sm:table-cell">Price</TableHead>
              <TableHead className="w-[6rem]">Applied</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow
                key={booking.id}
                className={cn(
                  'cursor-pointer transition-colors hover:bg-muted/70',
                  selected?.id === booking.id && 'bg-muted/50'
                )}
                onClick={() => handleRowClick(booking)}
              >
                <TableCell>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {booking.listing_title ?? 'Untitled listing'}
                    </p>
                    {booking.listing_address && (
                      <p className="text-xs text-muted-foreground truncate">
                        {booking.listing_address}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      booking.status === 'approved'
                        ? 'default'
                        : booking.status === 'rejected' ||
                            booking.status === 'cancelled' ||
                            booking.status === 'withdrawn'
                          ? 'destructive'
                          : 'secondary'
                    }
                    className="capitalize"
                  >
                    {STATUS_LABELS[booking.status] ?? booking.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {formatPrice(booking.listing_price_cents)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(booking.requested_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <BookingDetailSheet
        booking={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
