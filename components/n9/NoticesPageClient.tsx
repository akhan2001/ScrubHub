'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Download,
  Check,
  Loader2,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { toast } from 'sonner';
import { getUserFacingErrorMessage } from '@/lib/errors/user-facing-error';
import type { N9Notice, N9Status } from '@/types/database';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getAllLandlordN9NoticesAction, acknowledgeN9Action } from '@/actions/n9';

type EnrichedNotice = N9Notice & {
  lease_tenant_name: string | null;
  lease_address: string | null;
};

const STATUS_CONFIG: Record<
  N9Status,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }
> = {
  draft: { label: 'Draft', variant: 'outline', icon: Clock },
  signed: { label: 'Signed', variant: 'secondary', icon: FileText },
  delivered: { label: 'Pending', variant: 'destructive', icon: AlertTriangle },
  acknowledged: { label: 'Acknowledged', variant: 'default', icon: CheckCircle2 },
  disputed: { label: 'Disputed', variant: 'destructive', icon: AlertTriangle },
};

export function NoticesPageClient() {
  const [notices, setNotices] = useState<EnrichedNotice[]>([]);
  const [isLoading, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getAllLandlordN9NoticesAction();
        setNotices(data);
      } catch {
        toast.error('Failed to load notices');
      }
    });
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (notices.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <FileText className="size-5 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">No termination notices</p>
          <p className="mt-1 text-sm text-muted-foreground">
            When a tenant submits an N9 notice, it will appear here for you to review and acknowledge.
          </p>
        </CardContent>
      </Card>
    );
  }

  const pending = notices.filter((n) => n.status === 'delivered' || n.status === 'signed');
  const resolved = notices.filter((n) => n.status === 'acknowledged' || n.status === 'disputed');

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">
            Pending acknowledgement ({pending.length})
          </h2>
          {pending.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      )}

      {resolved.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            History ({resolved.length})
          </h2>
          {resolved.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      )}
    </div>
  );
}

function NoticeCard({ notice }: { notice: EnrichedNotice }) {
  const router = useRouter();
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [isPending, startTransition] = useTransition();

  const isActionable = notice.status === 'delivered' || notice.status === 'signed';
  const config = STATUS_CONFIG[notice.status];
  const Icon = config.icon;

  const formattedTermDate = new Date(notice.termination_date + 'T00:00:00').toLocaleDateString(
    'en-CA',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const formattedCreated = new Date(notice.created_at).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  function handleAcknowledge() {
    startTransition(async () => {
      try {
        await acknowledgeN9Action(notice.id, notes.trim() || undefined);
        toast.success('N9 notice acknowledged.');
        router.refresh();
      } catch (err) {
        toast.error(
          getUserFacingErrorMessage(err, "We couldn't acknowledge this notice. Please try again.")
        );
      }
    });
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium">{notice.lease_tenant_name ?? 'Tenant'}</p>
              <p className="text-xs text-muted-foreground">
                {notice.lease_address ?? 'Address not available'}
              </p>
            </div>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>

        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Termination date</p>
            <p className="font-medium">{formattedTermDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Reason</p>
            <p className="font-medium capitalize">{notice.reason.replace(/_/g, ' ')}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Submitted</p>
            <p className="font-medium">{formattedCreated}</p>
          </div>
        </div>

        {notice.landlord_acknowledged_at && (
          <p className="text-xs text-muted-foreground">
            Acknowledged on{' '}
            {new Date(notice.landlord_acknowledged_at).toLocaleDateString('en-CA', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
            {notice.landlord_notes ? ` — "${notice.landlord_notes}"` : ''}
          </p>
        )}

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
      </CardContent>
    </Card>
  );
}
