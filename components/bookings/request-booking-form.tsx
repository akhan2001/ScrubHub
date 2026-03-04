'use client';

import { useState } from 'react';
import { createBooking } from '@/actions/bookings';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function RequestBookingForm({ listingId }: { listingId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const form = e.currentTarget;
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;
    try {
      await createBooking({ listingId, notes });
      setMessage('Booking request submitted.');
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit booking request.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-md border border-border p-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      <div className="space-y-2">
        <Label htmlFor="notes">Request notes</Label>
        <Textarea id="notes" name="notes" rows={3} placeholder="Preferred dates, details..." />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Request booking'}
      </Button>
    </form>
  );
}
