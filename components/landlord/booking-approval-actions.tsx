'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateBookingStatus } from '@/actions/bookings';
import { Button } from '@/components/ui/button';

export function BookingApprovalActions({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(status: 'approved' | 'rejected') {
    setLoading(true);
    setError(null);
    try {
      await updateBookingStatus({ bookingId, status });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update booking status');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button size="sm" disabled={loading} onClick={() => update('approved')}>
        Approve
      </Button>
      <Button size="sm" variant="outline" disabled={loading} onClick={() => update('rejected')}>
        Reject
      </Button>
    </div>
  );
}
