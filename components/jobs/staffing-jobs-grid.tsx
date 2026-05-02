/* =============================================================
   components/jobs/staffing-jobs-grid.tsx — warm filter chips
   ============================================================= */
'use client';

import { JobCard } from '@/components/jobs/job-card';
import { useJobFilters } from '@/hooks/use-job-filters';
import type { JobPost } from '@/types/database';

interface StaffingJobsGridProps {
  jobs: JobPost[];
}

export function StaffingJobsGrid({ jobs }: StaffingJobsGridProps) {
  const { filteredJobs, activeFilter, setFilter, filterOptions } = useJobFilters(jobs);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold border transition ${
                activeFilter === f
                  ? 'bg-[#0E1A2B] text-white border-[#0E1A2B]'
                  : 'bg-white text-[#3A4759] border-[#E5DFD2] hover:border-[#0E1A2B] hover:text-[#0E1A2B]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585]">
          {filteredJobs.length} of {jobs.length} positions
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} variant="compact" />
        ))}
      </div>
    </>
  );
}
