'use client';

import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import type { AppRole, NotificationLog } from '@/types/database';

function getMetadataTitleBody(log: NotificationLog): { title: string; body: string } {
  const meta = log.metadata && typeof log.metadata === 'object' ? log.metadata : {};
  const title =
    typeof meta.title === 'string' ? meta.title : log.template_key.replace(/_/g, ' ');
  const body = typeof meta.body === 'string' ? meta.body : '';
  return { title, body };
}

function resolveNotificationHref(templateKey: string, role: AppRole): string | undefined {
  switch (templateKey) {
    case 'booking_requested':
      return role === 'landlord' ? '/dashboard/landlord/approvals' : undefined;
    case 'booking_submitted':
      return role === 'tenant' ? '/dashboard/tenant/bookings' : undefined;
    case 'application_needs_review':
      return role === 'landlord' ? '/dashboard/landlord/approvals' : undefined;
    case 'application_auto_approved':
      if (role === 'tenant') return '/dashboard/tenant/bookings';
      if (role === 'landlord') return '/dashboard/landlord/approvals';
      return undefined;
    case 'booking_status_approved':
    case 'booking_status_rejected':
    case 'booking_status_cancelled':
      return role === 'tenant' ? '/dashboard/tenant/bookings' : undefined;
    case 'booking_status_withdrawn':
      return role === 'landlord' ? '/dashboard/landlord/approvals' : undefined;
    case 'job_application_submitted':
      return role === 'enterprise' ? '/dashboard/enterprise/applications' : undefined;
    case 'n9_notice_received':
      return role === 'landlord' ? '/dashboard/landlord/notices' : undefined;
    case 'n9_notice_acknowledged':
      return role === 'tenant' ? '/dashboard/tenant/n9' : undefined;
    default:
      if (role === 'tenant') return '/dashboard/tenant/bookings';
      if (role === 'landlord') return '/dashboard/landlord/approvals';
      if (role === 'enterprise') return '/dashboard/enterprise';
      return '/dashboard';
  }
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const sec = Math.floor((now - then) / 1000);
  if (sec < 45) return 'Just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return 'Yesterday';
  if (day < 7) return `${day} days ago`;
  return new Date(iso).toLocaleDateString();
}

function startOfLocalDay(d: Date): number {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.getTime();
}

function partitionByRecency(logs: NotificationLog[]) {
  const todayStart = startOfLocalDay(new Date());
  const weekAgo = todayStart - 7 * 24 * 60 * 60 * 1000;
  const today: NotificationLog[] = [];
  const thisWeek: NotificationLog[] = [];
  const older: NotificationLog[] = [];
  for (const log of logs) {
    const t = new Date(log.created_at).getTime();
    if (t >= todayStart) today.push(log);
    else if (t >= weekAgo) thisWeek.push(log);
    else older.push(log);
  }
  return { today, thisWeek, older };
}

type RowProps = {
  log: NotificationLog;
  role: AppRole;
};

function NotificationRow({ log, role }: RowProps) {
  const { title, body } = getMetadataTitleBody(log);
  const href = resolveNotificationHref(log.template_key, role);
  const initials = title.slice(0, 2).toUpperCase();

  return (
    <div className="flex gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/60">
      <div className="relative shrink-0">
        <Avatar className="h-10 w-10 border-2 border-background">
          <AvatarFallback className="text-xs font-medium text-muted-foreground">{initials}</AvatarFallback>
        </Avatar>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">
          {href ? (
            <Link href={href} className="font-medium text-primary hover:underline">
              {title}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{title}</span>
          )}{' '}
          {body}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(log.created_at)}</p>
      </div>
    </div>
  );
}

function Section({
  heading,
  logs,
  role,
}: {
  heading: string;
  logs: NotificationLog[];
  role: AppRole;
}) {
  if (logs.length === 0) return null;
  return (
    <div className="px-4 py-3">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{heading}</h3>
      <div className="space-y-0.5">
        {logs.map((log) => (
          <NotificationRow key={log.id} log={log} role={role} />
        ))}
      </div>
    </div>
  );
}

export function NotificationsPanel({
  role,
  notificationLogs,
}: {
  role: AppRole;
  notificationLogs: NotificationLog[];
}) {
  const { today, thisWeek, older } = partitionByRecency(notificationLogs);
  const totalToday = today.length;
  const hasAny = notificationLogs.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {hasAny ? (
                <>
                  You have{' '}
                  <span className="font-semibold text-primary">
                    {totalToday} notification{totalToday !== 1 ? 's' : ''}
                  </span>{' '}
                  today.
                </>
              ) : (
                'No notifications yet.'
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
        {!hasAny ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">
            When something needs your attention, it will show up here.
          </p>
        ) : (
          <>
            <Section heading="Today" logs={today} role={role} />
            <div className="border-t border-border">
              <Section heading="This week" logs={thisWeek} role={role} />
            </div>
            {older.length > 0 ? (
              <div className="border-t border-border">
                <Section heading="Earlier" logs={older} role={role} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
