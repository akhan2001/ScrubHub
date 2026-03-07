'use client';

import { useMemo, useState } from 'react';
import type { JobPost } from '@/types/database';

const FILTER_OPTIONS = [
  'All Positions',
  'Full-time',
  'Part-time',
  'Contract',
  'Travel',
  'Per Diem',
] as const;

export function useJobFilters(jobs: JobPost[]) {
  const [activeFilter, setFilter] = useState<string>('All Positions');

  const filteredJobs = useMemo(() => {
    if (activeFilter === 'All Positions') return jobs;
    return jobs.filter((job) => {
      const ct = job.contract_type?.toLowerCase();
      if (activeFilter.toLowerCase() === ct) return true;
      if (activeFilter === 'Full-time' && ct === 'full-time') return true;
      if (activeFilter === 'Part-time' && ct === 'part-time') return true;
      if (activeFilter === 'Contract' && ct === 'contract') return true;
      if (activeFilter === 'Travel' && ct === 'travel') return true;
      if (activeFilter === 'Per Diem' && ct === 'per diem') return true;
      return false;
    });
  }, [jobs, activeFilter]);

  return {
    filteredJobs,
    activeFilter,
    setFilter,
    filterOptions: FILTER_OPTIONS,
  };
}
