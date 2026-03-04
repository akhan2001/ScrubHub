'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check } from 'lucide-react';

export function Step6Billing({ onNext }: { onNext: (data: any) => void }) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    setLoading(true);
    // Simulate Stripe payment
    setTimeout(() => {
      setLoading(false);
      onNext({ plan: selectedPlan });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Starter Plan */}
        <Card 
          className={`cursor-pointer border-2 ${selectedPlan === 'starter' ? 'border-primary' : 'border-transparent'}`}
          onClick={() => handleSelectPlan('starter')}
        >
          <CardHeader>
            <CardTitle>Starter</CardTitle>
            <div className="text-2xl font-bold">$99<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Up to 10 units</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 2 team members</li>
            </ul>
          </CardContent>
        </Card>

        {/* Growth Plan */}
        <Card 
          className={`cursor-pointer border-2 ${selectedPlan === 'growth' ? 'border-primary' : 'border-transparent'}`}
          onClick={() => handleSelectPlan('growth')}
        >
          <CardHeader>
            <CardTitle>Growth</CardTitle>
            <div className="text-2xl font-bold">$299<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Up to 50 units</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 10 team members</li>
            </ul>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card 
          className={`cursor-pointer border-2 ${selectedPlan === 'enterprise' ? 'border-primary' : 'border-transparent'}`}
          onClick={() => handleSelectPlan('enterprise')}
        >
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <div className="text-2xl font-bold">Custom</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Unlimited units</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Custom integrations</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {selectedPlan && selectedPlan !== 'enterprise' && (
        <div className="rounded-md bg-muted p-4">
          <p className="text-sm font-semibold mb-2">Payment Method (Mocked)</p>
          <p className="text-sm text-muted-foreground">Stripe card input would appear here.</p>
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleContinue} disabled={loading || !selectedPlan}>
          {loading ? 'Processing...' : selectedPlan === 'enterprise' ? 'Contact Sales' : 'Subscribe'}
        </Button>
      </div>
    </div>
  );
}
