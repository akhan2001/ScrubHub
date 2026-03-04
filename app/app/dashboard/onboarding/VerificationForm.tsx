'use client';

import { useState } from 'react';
import { submitRoleVerification } from '@/actions/verification';
import { Button } from '@/components/ui/button';

export function VerificationForm({ currentState }: { currentState: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onVerify() {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      await submitRoleVerification();
      setMessage('Verification submitted and marked as verified for MVP.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit verification');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 space-y-2 rounded-md border border-border p-4">
      <p className="text-sm text-muted-foreground">
        Current verification state: <strong className="text-foreground capitalize">{currentState}</strong>
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      <Button type="button" disabled={loading} onClick={onVerify}>
        {loading ? 'Submitting...' : 'Submit verification'}
      </Button>
    </div>
  );
}
