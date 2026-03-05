'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { FileWarning, Download, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { N9Notice } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { acknowledgeN9Action } from '@/actions/n9';

type EnrichedNotice = N9Notice & {
  lease_tenant_name: string | null;
  lease_address: string | null;
};

export function N9LandlordCard({ notices }: { notices: EnrichedNotice[] }) {
  if (notices.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10">
          <FileWarning className="size-4 text-destructive" />
        </div>
        <div>
          <CardTitle className="text-base">Termination Notices</CardTitle>
          <p className="text-sm text-muted-foreground">
            {notices.length} pending N9 {notices.length === 1 ? 'notice' : 'notices'}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {notices.map((notice) => (
          <NoticeRow key={notice.id} notice={notice} />
        ))}
      </CardContent>
    </Card>
  );
}

function NoticeRow({ notice }: { notice: EnrichedNotice }) {
  const router = useRouter();
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();

  const isActionable = notice.status === 'delivered' || notice.status === 'signed';
  const formattedDate = new Date(notice.termination_date + 'T00:00:00').toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  function handleAcknowledge() {
    startTransition(async () => {
      try {
        await acknowledgeN9Action(notice.id, notes.trim() || undefined);
        toast.success('N9 notice acknowledged.');
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to acknowledge');
      }
    });
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">
            {notice.lease_tenant_name ?? 'Tenant'}
          </p>
          <p className="text-xs text-muted-foreground">
            {notice.lease_address ?? 'Address not available'}
          </p>
        </div>
        <Badge variant={isActionable ? 'destructive' : 'secondary'}>
          {isActionable ? 'Pending' : notice.status}
        </Badge>
      </div>

      <div className="flex items-baseline gap-4 text-sm">
        <span className="text-muted-foreground">Termination date:</span>
        <span className="font-medium">{formattedDate}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {notice.pdf_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={notice.pdf_url} target="_blank" rel="noopener noreferrer">
              <Download className="mr-1.5 size-3.5" />
              View PDF
            </a>
          </Button>
        )}

        {isActionable && !showNotes && (
          <Button size="sm" onClick={() => setShowNotes(true)}>
            Acknowledge
          </Button>
        )}
      </div>

      {showNotes && isActionable && (
        <div className="space-y-2 pt-1">
          <Textarea
            placeholder="Optional notes (visible to tenant)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAcknowledge} disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-1 size-3.5 animate-spin" />
              ) : (
                <Check className="mr-1 size-3.5" />
              )}
              Confirm acknowledgement
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotes(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
