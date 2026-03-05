'use client';

import { useState } from 'react';
import { FileText, Home } from 'lucide-react';
import type { Lease } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { N9Wizard } from '@/components/n9/N9Wizard';
import { N9StatusCard } from '@/components/n9/N9StatusCard';

const STATUS_LABELS: Record<Lease['status'], string> = {
  active: 'Active',
  terminating: 'Terminating',
  terminated: 'Terminated',
  expired: 'Expired',
};

const STATUS_VARIANTS: Record<Lease['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  active: 'default',
  terminating: 'destructive',
  terminated: 'secondary',
  expired: 'outline',
};

export function TenancyPageClient({ leases }: { leases: Lease[] }) {
  const [wizardLease, setWizardLease] = useState<Lease | null>(null);

  if (leases.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <Home className="size-5 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">No active leases</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Once you have an approved booking with a lease, it will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {leases.map((lease) => (
        <Card key={lease.id}>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Lease {lease.id.slice(0, 8)}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Started {new Date(lease.start_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Badge variant={STATUS_VARIANTS[lease.status]}>
              {STATUS_LABELS[lease.status]}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Monthly rent</p>
                <p className="font-medium">${(lease.monthly_rent_cents / 100).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Lease type</p>
                <p className="font-medium capitalize">{lease.lease_type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Rental period</p>
                <p className="font-medium capitalize">{lease.rental_period}</p>
              </div>
            </div>
            {lease.end_date && (
              <div className="text-sm">
                <p className="text-muted-foreground">Lease ends</p>
                <p className="font-medium">{new Date(lease.end_date).toLocaleDateString()}</p>
              </div>
            )}

            {lease.status === 'active' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setWizardLease(lease)}
              >
                End my tenancy
              </Button>
            )}

            {lease.status === 'terminating' && (
              <N9StatusCard leaseId={lease.id} />
            )}
          </CardContent>
        </Card>
      ))}

      <N9Wizard
        lease={wizardLease}
        open={wizardLease !== null}
        onOpenChange={(open) => {
          if (!open) setWizardLease(null);
        }}
      />
    </div>
  );
}
