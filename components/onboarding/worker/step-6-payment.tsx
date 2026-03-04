'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

export function Step6Payment({ onNext }: { onNext: (data: any) => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Stripe delay
    setTimeout(() => {
      setLoading(false);
      onNext({ paymentMethodId: 'pm_mock_12345' });
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
        <p>
          Payment method is used for application deposits and monthly rent once a lease is signed.
          <strong> No charges until a lease is signed.</strong>
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Card Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="cardNumber" className="pl-9" placeholder="0000 0000 0000 0000" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">Billing ZIP</Label>
            <Input id="zip" placeholder="12345" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Save Payment Method'}
        </Button>
      </div>
    </form>
  );
}
