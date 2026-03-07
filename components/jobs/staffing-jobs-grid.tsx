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
      <div className="flex flex-wrap gap-2 mb-8">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm font-semibold border transition-all duration-150 ${
              activeFilter === f
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-white text-muted-foreground border-border hover:border-primary/50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} variant="compact" />
        ))}
      </div>
    </>
  );
}
