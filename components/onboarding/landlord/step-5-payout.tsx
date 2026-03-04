'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CreditCard } from 'lucide-react';

export function Step5Payout({ onNext }: { onNext: (data: any) => void }) {
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    // Simulate Stripe Connect
    setTimeout(() => {
      setLoading(false);
      onNext({ payoutConnected: true });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
        <p>ScrubHub collects rent on your behalf and deposits it to your account. Funds are deposited within 2 business days.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer hover:bg-muted/50" onClick={handleConnect}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-5 w-5" />
              Bank Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Connect via Stripe (ACH/Wire)</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:bg-muted/50" onClick={handleConnect}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="h-5 w-5" />
              Debit Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Instant payouts (1% fee)</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleConnect} disabled={loading}>
          {loading ? 'Connecting...' : 'Skip for now'}
        </Button>
      </div>
    </div>
  );
}
