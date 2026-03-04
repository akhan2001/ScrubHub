'use client';

import { useState } from 'react';
import { createBookingPayment } from '@/actions/bookings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreatePaymentForm({ bookingId }: { bookingId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    const form = e.currentTarget;
    const amount = Number((form.elements.namedItem('amount_cents') as HTMLInputElement).value);
    try {
      const intent = await createBookingPayment({ bookingId, amountCents: amount });
      setResult(`Payment intent created: ${intent.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment intent');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2 rounded border border-border p-3">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {result && <p className="text-sm text-emerald-600">{result}</p>}
      <Label htmlFor={`amount-${bookingId}`}>Payment amount (cents)</Label>
      <Input id={`amount-${bookingId}`} name="amount_cents" type="number" min={1} defaultValue={10000} />
      <Button size="sm" type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create payment intent'}
      </Button>
    </form>
  );
}
