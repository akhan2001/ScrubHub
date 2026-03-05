'use client';

import { useEffect, useState, useTransition } from 'react';
import { FileCheck, Clock, CheckCircle2, Loader2, Download } from 'lucide-react';
import type { N9Notice } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getN9NoticesForLeaseAction } from '@/actions/n9';

const STATUS_CONFIG: Record<
  N9Notice['status'],
  { icon: typeof FileCheck; label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  draft: { icon: Clock, label: 'Draft', variant: 'outline' },
  signed: { icon: FileCheck, label: 'Signed', variant: 'default' },
  delivered: { icon: Clock, label: 'Awaiting acknowledgement', variant: 'secondary' },
  acknowledged: { icon: CheckCircle2, label: 'Acknowledged', variant: 'default' },
  disputed: { icon: Clock, label: 'Disputed', variant: 'destructive' },
};

export function N9StatusCard({ leaseId }: { leaseId: string }) {
  const [notices, setNotices] = useState<N9Notice[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getN9NoticesForLeaseAction(leaseId);
        setNotices(data);
      } catch {
        // Silently handle — card simply won't render notices
      }
    });
  }, [leaseId]);

  if (isPending) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Loading notice status...
      </div>
    );
  }

  if (notices.length === 0) return null;

  const latest = notices[0];
  const config = STATUS_CONFIG[latest.status];
  const Icon = config.icon;

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">N9 Termination Notice</span>
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>
      <div className="text-sm text-muted-foreground">
        Termination date:{' '}
        <span className="font-medium text-foreground">
          {new Date(latest.termination_date + 'T00:00:00').toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>
      {latest.pdf_url && (
        <Button variant="outline" size="sm" asChild>
          <a href={latest.pdf_url} target="_blank" rel="noopener noreferrer">
            <Download className="mr-1.5 size-3.5" />
            Download PDF
          </a>
        </Button>
      )}
      {latest.landlord_acknowledged_at && (
        <p className="text-xs text-muted-foreground">
          Acknowledged by landlord on{' '}
          {new Date(latest.landlord_acknowledged_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
