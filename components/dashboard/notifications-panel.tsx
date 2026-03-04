'use client';

import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils';

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

const MOCK_TODAY: NotificationItem[] = [
  {
    id: '1',
    from: 'Booking request',
    action: 'New booking request for your listing.',
    context: 'Sunny 2BR — Downtown',
    time: '2 min ago',
    unread: true,
    initials: 'BR',
  },
  {
    id: '2',
    from: 'System',
    action: 'Screening rules updated successfully.',
    context: 'Approvals',
    time: '1 hour ago',
    unread: true,
    initials: 'S',
  },
  {
    id: '3',
    from: 'Application',
    action: 'Tenant completed verification.',
    context: 'Listing: Riverside Suite',
    time: '3 hours ago',
    unread: false,
    initials: 'A',
  },
];

const MOCK_THIS_WEEK: NotificationItem[] = [
  {
    id: '4',
    from: 'Booking',
    action: 'Payment received for approved stay.',
    context: 'May 12–19',
    time: 'Yesterday',
    unread: false,
    initials: 'B',
  },
  {
    id: '5',
    from: 'System',
    action: 'Your listing was published.',
    context: 'Garden View Unit',
    time: '2 days ago',
    unread: false,
    initials: 'S',
  },
];

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

export function NotificationsPanel() {
  const totalToday = MOCK_TODAY.length;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              You have{' '}
              <span className="font-semibold text-primary">
                {totalToday} notification{totalToday !== 1 ? 's' : ''}
              </span>{' '}
              today.
            </p>
          </div>
          <IconButton
            variant="subtle"
            className="size-8 shrink-0"
            aria-label="Filter or sort notifications"
          >
            <SlidersHorizontal className="size-4" />
          </IconButton>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Today
          </h3>
          <div className="space-y-0.5">
            {MOCK_TODAY.map((item) => (
              <NotificationRow key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="border-t border-border px-4 py-3">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            This week
          </h3>
          <div className="space-y-0.5">
            {MOCK_THIS_WEEK.map((item) => (
              <NotificationRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
