import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type ActivityItem = {
  id: string;
  title: string;
  meta: string;
  tone?: 'default' | 'warning' | 'success';
};

export function ActivityFeed({ items, title = 'Activity' }: { items: ActivityItem[]; title?: string }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!items.length ? (
          <p className="text-sm text-muted-foreground">No recent events.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-3 rounded-md border border-border p-3">
                <span
                  className={cn(
                    'mt-1 inline-flex size-2 rounded-full bg-muted-foreground',
                    item.tone === 'warning' && 'bg-amber-500',
                    item.tone === 'success' && 'bg-emerald-500'
                  )}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.meta}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
