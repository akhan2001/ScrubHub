'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';
import { getDashboardNotificationsAction } from '@/actions/notifications';

export type NotificationItem = {
  id: string;
  from: string;
  fromHref?: string;
  action: string;
  context?: string;
  time: string;
  unread?: boolean;
  initials?: string;
};

type LogRow = {
  id: string;
  created_at: string;
  template_key: string;
  metadata: unknown;
};

function parseMetadata(meta: unknown): { title?: string; body?: string } {
  if (meta && typeof meta === 'object' && !Array.isArray(meta)) {
    const o = meta as Record<string, unknown>;
    return {
      title: typeof o.title === 'string' ? o.title : undefined,
      body: typeof o.body === 'string' ? o.body : undefined,
    };
  }
  return {};
}

function startOfLocalDayMs(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hr ago`;
  if (diffSec < 172800) return 'Yesterday';
  const days = Math.floor(diffSec / 86400);
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function logRowToItem(row: LogRow): NotificationItem {
  const { title, body } = parseMetadata(row.metadata);
  const headline = title ?? row.template_key.replace(/_/g, ' ');
  const detail = body ?? '';
  const initials = headline
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return {
    id: row.id,
    from: headline,
    action: detail,
    time: formatRelativeTime(row.created_at),
    unread: false,
    initials: initials || 'N',
  };
}

function NotificationRow({ item }: { item: NotificationItem }) {
  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60',
        item.unread && 'bg-primary/5'
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10 border-2 border-background">
          <AvatarFallback className="text-xs font-medium text-muted-foreground">
            {item.initials ?? item.from.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {item.unread ? (
          <span
            className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-destructive"
            aria-hidden
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">
          {item.fromHref ? (
            <Link href={item.fromHref} className="font-medium text-primary hover:underline">
              {item.from}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.from}</span>
          )}{' '}
          {item.action}
        </p>
        {item.context ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{item.context}</p>
        ) : null}
        <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
      </div>
    </div>
  );
}

export function NotificationsPanel({ userId }: { userId: string }) {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = (await getDashboardNotificationsAction()) as LogRow[];
      setRows(data);
    } catch {
      setError('Could not load notifications.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, userId]);

  const grouped = useMemo(() => {
    const todayStart = startOfLocalDayMs(new Date());
    const todayList: NotificationItem[] = [];
    const earlierList: NotificationItem[] = [];
    for (const row of rows) {
      const item = logRowToItem(row);
      const day = startOfLocalDayMs(new Date(row.created_at));
      if (day === todayStart) todayList.push(item);
      else earlierList.push(item);
    }
    return { todayList, earlierList };
  }, [rows]);

  const totalToday = grouped.todayList.length;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {loading ? (
                'Loading…'
              ) : error ? (
                <span className="text-destructive">{error}</span>
              ) : (
                <>
                  You have{' '}
                  <span className="font-semibold text-primary">
                    {totalToday} notification{totalToday !== 1 ? 's' : ''}
                  </span>{' '}
                  today.
                </>
              )}
            </p>
          </div>
          <IconButton
            variant="subtle"
            className="size-8 shrink-0"
            aria-label="Filter or sort notifications"
            disabled
          >
            <SlidersHorizontal className="size-4" />
          </IconButton>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">Loading notifications…</p>
        ) : rows.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">No notifications yet.</p>
        ) : (
          <>
            <div className="px-4 py-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Today
              </h3>
              <div className="space-y-0.5">
                {grouped.todayList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nothing new today.</p>
                ) : (
                  grouped.todayList.map((item) => <NotificationRow key={item.id} item={item} />)
                )}
              </div>
            </div>
            {grouped.earlierList.length > 0 ? (
              <div className="border-t border-border px-4 py-3">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Earlier
                </h3>
                <div className="space-y-0.5">
                  {grouped.earlierList.map((item) => (
                    <NotificationRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
