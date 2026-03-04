import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function KpiCard({
  title,
  value,
  trend,
}: {
  title: string;
  value: string;
  trend?: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        {trend ? <p className="text-xs text-muted-foreground">{trend}</p> : null}
      </CardContent>
    </Card>
  );
}
