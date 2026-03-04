import Link from 'next/link';
import { MapPin, DollarSign, Calendar, Building2, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { JobPost } from '@/types/database';

interface JobCardProps {
  job: JobPost;
}

export function JobCard({ job }: JobCardProps) {
  const payRange =
    job.pay_range_min != null && job.pay_range_max != null
      ? `$${job.pay_range_min}–$${job.pay_range_max}/hr`
      : job.pay_range_min != null
        ? `From $${job.pay_range_min}/hr`
        : null;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="space-y-3 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
            {job.facility_name && (
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="size-3.5" /> {job.facility_name}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1.5">
            {job.housing_included && (
              <Badge variant="secondary" className="gap-1">
                <Home className="size-3" /> Housing
              </Badge>
            )}
            {job.contract_type && (
              <Badge variant="outline">{job.contract_type}</Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {job.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3" /> {job.location}
            </span>
          )}
          {payRange && (
            <span className="inline-flex items-center gap-1">
              <DollarSign className="size-3" /> {payRange}
            </span>
          )}
          {job.start_date && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" /> Starts {new Date(job.start_date).toLocaleDateString()}
            </span>
          )}
          {job.contract_length && (
            <span>{job.contract_length}</span>
          )}
        </div>

        {job.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
        )}

        <div className="flex items-center justify-end pt-1">
          <Button asChild size="sm">
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
