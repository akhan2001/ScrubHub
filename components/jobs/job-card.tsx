/* =============================================================
   components/jobs/job-card.tsx — warm residential variant
   Keep the existing 'full' variant. Replace the 'compact' block
   with the body below so the staffing grid matches the new look.
   ============================================================= */
import Link from 'next/link';
import { MapPin, DollarSign, Calendar, Building2, Home, ArrowUpRight } from 'lucide-react';
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
        className="group flex flex-col rounded-2xl border border-[#E5DFD2] bg-white overflow-hidden transition hover:border-[#0E1A2B] hover:-translate-y-1"
      >
        {/* Top tag rail */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#F0EBDF]">
          <div className="flex flex-wrap gap-1.5">
            {job.contract_type && (
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase font-semibold rounded-full bg-[#EFE9DD] text-[#0E1A2B] px-2.5 py-1">
                {job.contract_type}
              </span>
            )}
            {job.housing_included && (
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase font-semibold rounded-full border border-[#B8472E]/40 text-[#B8472E] px-2.5 py-1">
                Housing incl.
              </span>
            )}
          </div>
          <ArrowUpRight className="size-4 text-[#6B7585] transition group-hover:text-[#0E1A2B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        <div className="px-5 py-4 flex flex-col gap-3 flex-1">
          <div>
            <h3 className="font-semibold tracking-[-0.01em] text-[16px] text-[#0E1A2B] m-0 leading-tight">{job.title}</h3>
            {job.facility_name && (
              <p className="flex items-center gap-1.5 mt-1.5 text-[13px] text-[#6B7585] m-0">
                <Building2 className="size-3.5" /> {job.facility_name}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {job.role_type && (
              <span className="rounded-full border border-[#E5DFD2] bg-[#F7F4EE] px-2.5 py-0.5 text-[11px] text-[#3A4759] font-medium">
                {job.role_type}
              </span>
            )}
            {job.contract_length && (
              <span className="rounded-full border border-[#E5DFD2] bg-[#F7F4EE] px-2.5 py-0.5 text-[11px] text-[#3A4759] font-medium">
                {job.contract_length}
              </span>
            )}
            {job.location && (
              <span className="rounded-full border border-[#E5DFD2] bg-[#F7F4EE] px-2.5 py-0.5 text-[11px] text-[#3A4759] font-medium">
                {job.location}
              </span>
            )}
          </div>

          <div className="mt-auto pt-3 border-t border-[#F0EBDF] flex items-end justify-between">
            <div>
              {payRange ? (
                <>
                  <p className="font-medium tracking-[-0.02em] text-[20px] text-[#0E1A2B] leading-none m-0">{payRange}</p>
                  <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#6B7585] mt-1.5 m-0">Hourly</p>
                </>
              ) : (
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#6B7585] m-0">Rate on apply</p>
              )}
            </div>
            {job.start_date && (
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#6B7585] text-right">
                Starts<br />
                <span className="text-[#0E1A2B]">{new Date(job.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  /* full variant unchanged from existing repo — kept so detail pages still render */
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
            {job.contract_type && <Badge variant="outline">{job.contract_type}</Badge>}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {job.location && <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {job.location}</span>}
          {payRange && <span className="inline-flex items-center gap-1"><DollarSign className="size-3" /> {payRange}</span>}
          {job.start_date && <span className="inline-flex items-center gap-1"><Calendar className="size-3" /> Starts {new Date(job.start_date).toLocaleDateString()}</span>}
          {job.contract_length && <span>{job.contract_length}</span>}
        </div>

        {job.description && <p className="line-clamp-2 text-sm text-muted-foreground">{job.description}</p>}

        <div className="flex items-center justify-end pt-1">
          <Button asChild size="sm">
            <Link href={detailHref}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
