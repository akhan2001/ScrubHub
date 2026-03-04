'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export function Step6Review({ onNext }: { onNext: (data: any) => void }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    onNext({});
  };

  return (
    <div className="space-y-6">
      <div className="rounded-md bg-green-50 p-4 text-sm text-green-700 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5" />
        <p>Your landlord profile is ready to submit.</p>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Identity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">ID uploaded. Verification pending.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Business</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Operating details provided.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">First Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Property and unit details saved as draft.</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Profile'}
        </Button>
      </div>
    </div>
  );
}
