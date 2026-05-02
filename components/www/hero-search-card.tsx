'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, Briefcase, Building2, Home, Search } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type HeroSearchTab = 'stay' | 'suite' | 'staff';

export type HeroSearchField = {
  key: string;
  label: string;
  value: string;
};

export type HeroSearchPayload = {
  tab: HeroSearchTab;
  fields: HeroSearchField[];
  quickFilters: string[];
};

const DEFAULT_QUICK_FILTERS = [
  'Furnished',
  'Pet friendly',
  'Walk to hospital',
  '≤ $3,000/mo',
  'Parking incl.',
  '13-week stays',
] as const;

const TAB_CONFIG: Array<{
  id: HeroSearchTab;
  label: string;
  sub: string;
  Icon: LucideIcon;
}> = [
  { id: 'stay', label: 'Stay', sub: 'Furnished housing for travel & locum staff', Icon: Home },
  { id: 'suite', label: 'Suite', sub: 'Clinical suites by the day or week', Icon: Building2 },
  { id: 'staff', label: 'Staff', sub: 'Locum, contract & permanent roles', Icon: Briefcase },
];

const FIELDS_BY_TAB: Record<HeroSearchTab, HeroSearchField[]> = {
  stay: [
    { key: 'where', label: 'Where', value: 'Toronto · Downtown Core' },
    { key: 'move_in', label: 'Move in', value: 'May 14, 2026' },
    { key: 'length', label: 'Length', value: '12 weeks' },
    { key: 'hospital', label: 'Hospital', value: 'Toronto General' },
  ],
  suite: [
    { key: 'where', label: 'Where', value: 'GTA · Any' },
    { key: 'date', label: 'Date', value: 'Tomorrow' },
    { key: 'duration', label: 'Duration', value: 'Half-day' },
    { key: 'specialty', label: 'Specialty', value: 'Family Med · Exam' },
  ],
  staff: [
    { key: 'role', label: 'Role', value: 'Registered Nurse' },
    { key: 'region', label: 'Region', value: 'Greater Toronto' },
    { key: 'type', label: 'Type', value: 'Locum · 8–12 weeks' },
    { key: 'start', label: 'Start', value: 'Within 2 weeks' },
  ],
};

function QuickFilterChip({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition',
        selected
          ? 'border-[#0E1A2B] bg-[#F0EBDF] text-[#0E1A2B]'
          : 'border-[#E5DFD2] bg-transparent text-[#3A4759] hover:border-[#0E1A2B] hover:text-[#0E1A2B]'
      )}
    >
      {children}
    </button>
  );
}

export type HeroSearchCardProps = {
  className?: string;
  moreFiltersHref?: string;
  quickFilterLabels?: readonly string[];
  defaultTab?: HeroSearchTab;
  onSearch?: (payload: HeroSearchPayload) => void;
  onFieldClick?: (tab: HeroSearchTab, fieldKey: string) => void;
};

export function HeroSearchCard({
  className,
  moreFiltersHref = '/facility-map',
  quickFilterLabels = DEFAULT_QUICK_FILTERS,
  defaultTab = 'stay',
  onSearch,
  onFieldClick,
}: HeroSearchCardProps) {
  const router = useRouter();
  const [tab, setTab] = useState<HeroSearchTab>(defaultTab);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(() => new Set());

  const fields = FIELDS_BY_TAB[tab];

  const toggleFilter = (label: string) => {
    setSelectedFilters((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  function runSearch() {
    const payload: HeroSearchPayload = {
      tab,
      fields: [...fields],
      quickFilters: Array.from(selectedFilters),
    };
    if (onSearch) {
      onSearch(payload);
      return;
    }
    const params = new URLSearchParams();
    params.set('intent', tab);
    for (const f of fields) {
      params.set(f.key, f.value);
    }
    if (payload.quickFilters.length > 0) {
      params.set('filters', payload.quickFilters.join(','));
    }
    router.push(`/facility-map?${params.toString()}`);
  }

  return (
    <div
      className={cn(
        'relative mx-auto -mt-11 max-w-[1100px] rounded-3xl border border-[#E5DFD2] bg-[#F7F4EE] p-3.5 shadow-[0_30px_80px_rgba(14,26,43,0.14),0_4px_12px_rgba(14,26,43,0.06)]',
        className
      )}
    >
      <div className="mb-3 flex items-center gap-1.5 px-1.5">
        {TAB_CONFIG.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition',
              tab === t.id
                ? 'bg-white text-[#0E1A2B] shadow-[0_6px_18px_rgba(14,26,43,0.08),0_1px_2px_rgba(14,26,43,0.04)]'
                : 'bg-transparent text-[#6B7585] hover:text-[#0E1A2B]'
            )}
          >
            <t.Icon className="size-4" aria-hidden />
            <span>{t.label}</span>
          </button>
        ))}
        <div className="flex-1" />
        <span className="pr-2.5 font-mono text-[11px] tracking-[0.12em] text-[#6B7585] uppercase">
          {TAB_CONFIG.find((t) => t.id === tab)?.sub}
        </span>
      </div>

      <div className="flex items-stretch overflow-hidden rounded-2xl border border-[#E5DFD2] bg-white">
        {fields.map((f, i, a) => (
          <button
            key={f.key}
            type="button"
            onClick={() => onFieldClick?.(tab, f.key)}
            className={cn(
              'flex flex-1 cursor-pointer flex-col px-4 py-2.5 text-left transition hover:bg-[#F0EBDF]',
              i < a.length - 1 ? 'border-r border-[#E5DFD2]' : ''
            )}
          >
            <span className="mb-0.5 font-mono text-[10px] font-medium tracking-[0.16em] text-[#6B7585] uppercase">
              {f.label}
            </span>
            <span className="text-[15px] font-medium text-[#0E1A2B]">{f.value}</span>
          </button>
        ))}
        <div className="flex items-center p-2">
          <button
            type="button"
            onClick={runSearch}
            className="inline-flex h-[60px] items-center justify-center gap-2 rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Search className="size-[18px]" aria-hidden />
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-1.5 pt-3.5 pb-1">
        {quickFilterLabels.map((label) => (
          <QuickFilterChip
            key={label}
            selected={selectedFilters.has(label)}
            onClick={() => toggleFilter(label)}
          >
            {label}
          </QuickFilterChip>
        ))}
        <span className="flex-1" />
        <Link
          href={moreFiltersHref}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[13px] font-semibold text-[#0E1A2B] transition-all hover:gap-2"
        >
          More filters <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
