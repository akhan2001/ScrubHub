import Link from 'next/link';
import { MapPin, DollarSign, Calendar, Building2, Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { JobPost } from '@/types/database';
import { getStaffingJobUrl } from '@/lib/app-url';

interface JobCardProps {
  job: JobPost;
  variant?: 'compact' | 'full';
  href?: string;
}

export function JobCard({ job, variant = 'full', href }: JobCardProps) {
  const detailHref = href ?? getStaffingJobUrl(job.id);
  const payRange =
    job.pay_range_min != null && job.pay_range_max != null
      ? `$${job.pay_range_min}–$${job.pay_range_max}/hr`
      : job.pay_range_min != null
        ? `From $${job.pay_range_min}/hr`
        : null;

  if (variant === 'compact') {
    return (
      <Link
        href={detailHref}
        className={`block rounded-2xl border bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,31,63,0.06)] hover:shadow-[0_8px_24px_rgba(29,111,216,0.13)] hover:-translate-y-1 transition-all duration-200 border-[#d0d9e8]`}
      >
        <div className="px-4 py-3 border-b bg-[#f8fafd] border-[#eef2f7]">
          <div className="flex items-center justify-between">
            {job.contract_type && (
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/30">
                {job.contract_type}
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-[#0F172A] text-sm mb-1">{job.title}</h3>
          {job.facility_name && (
            <p className="flex items-start gap-1 mb-1 text-xs text-[#6b7280]">
              <Building2 className="size-3 mt-0.5 shrink-0" />
              {job.facility_name}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5 mb-3 text-xs text-[#6b7280]">
            {job.location && <span>{job.location}</span>}
            {job.start_date && (
              <span>· Starts {new Date(job.start_date).toLocaleDateString()}</span>
            )}
          </div>
          {(job.role_type || job.contract_length) && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.role_type && (
                <span className="rounded-full border border-[#d0d9e8] bg-[#f8fafd] px-2 py-0.5 text-[0.65rem] text-[#374151] font-medium">
                  {job.role_type}
                </span>
              )}
              {job.contract_length && (
                <span className="rounded-full border border-[#d0d9e8] bg-[#f8fafd] px-2 py-0.5 text-[0.65rem] text-[#374151] font-medium">
                  {job.contract_length}
                </span>
              )}
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              {payRange && (
                <>
                  <p className="text-lg font-extrabold text-primary leading-none">{payRange}</p>
                  <p className="text-[0.65rem] text-[#6b7280] mt-0.5">Hourly</p>
                </>
              )}
            </div>
            <span className="inline-flex items-center rounded-lg bg-primary hover:bg-primary/90 px-4 py-2 text-xs font-bold text-primary-foreground transition-all">
              View & Apply
            </span>
          </div>
        </div>
      </Link>
    );
  }

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
            <Link href={detailHref}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
