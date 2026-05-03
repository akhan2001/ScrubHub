'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';

type HospitalChip = { label: string; count: number | null };

const HOSPITAL_CHIPS: HospitalChip[] = [
  { label: 'All hospitals', count: null },
  { label: 'Toronto General', count: 42 },
  { label: 'Mt Sinai', count: 28 },
  { label: 'Trillium Health', count: 19 },
  { label: 'Sunnybrook', count: 23 },
];

const QUICK_FILTERS = ['≤ 10 min walk', '$2k–3k', 'Furnished', 'Pet OK'] as const;

type FacilityMapFilterRailProps = {
  /** Which view is active in the toggle. Defaults to 'map' on /facility-map. */
  activeView?: 'grid' | 'map';
  /** Where the Grid button links. */
  gridHref?: string;
  /** Where the Map button links. */
  mapHref?: string;
};

export function FacilityMapFilterRail({
  activeView = 'map',
  gridHref = '/listings',
  mapHref = '/facility-map',
}: FacilityMapFilterRailProps) {
  const [activeChip, setActiveChip] = useState<string>('All hospitals');
  const [activeQuick, setActiveQuick] = useState<Set<string>>(() => new Set());

  const toggleQuick = (label: string) => {
    setActiveQuick((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <div className="sticky top-[72px] z-30 border-y border-[#E5DFD2] bg-[#F7F4EE]/95 py-3.5 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-2.5 px-8">
        {HOSPITAL_CHIPS.map((c) => {
          const active = activeChip === c.label;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => setActiveChip(c.label)}
              className={`inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition ${
                active
                  ? 'border-[#0E1A2B] bg-[#0E1A2B] text-white'
                  : 'border-[#E5DFD2] bg-transparent text-[#3A4759] hover:border-[#0E1A2B] hover:text-[#0E1A2B]'
              }`}
            >
              {c.label}
              {c.count != null && (
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                    active ? 'bg-white/20 text-white' : 'bg-[#EFE9DD] text-[#6B7585]'
                  }`}
                >
                  {c.count}
                </span>
              )}
            </button>
          );
        })}

        <span className="mx-1 h-5 w-px bg-[#E5DFD2]" />

        {QUICK_FILTERS.map((label) => {
          const active = activeQuick.has(label);
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggleQuick(label)}
              className={`h-9 rounded-full border px-3.5 text-[13px] font-medium transition ${
                active
                  ? 'border-[#0E1A2B] bg-[#EFE9DD] text-[#0E1A2B]'
                  : 'border-[#E5DFD2] text-[#3A4759] hover:border-[#0E1A2B] hover:text-[#0E1A2B]'
              }`}
            >
              {label}
            </button>
          );
        })}

        <div className="ml-auto inline-flex rounded-full bg-[#EFE9DD] p-[3px]">
          {activeView === 'grid' ? (
            <button
              type="button"
              className="inline-flex h-[30px] items-center gap-1.5 rounded-full bg-white px-3.5 text-[12px] font-semibold text-[#0E1A2B] shadow-sm"
            >
              <LayoutGrid className="size-3.5" /> Grid
            </button>
          ) : (
            <Link
              href={gridHref}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold text-[#6B7585] transition hover:text-[#0E1A2B]"
            >
              <LayoutGrid className="size-3.5" /> Grid
            </Link>
          )}
          {activeView === 'map' ? (
            <button
              type="button"
              className="inline-flex h-[30px] items-center gap-1.5 rounded-full bg-white px-3.5 text-[12px] font-semibold text-[#0E1A2B] shadow-sm"
            >
              <MapIcon className="size-3.5" /> Map
            </button>
          ) : (
            <Link
              href={mapHref}
              className="inline-flex h-[30px] items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold text-[#6B7585] transition hover:text-[#0E1A2B]"
            >
              <MapIcon className="size-3.5" /> Map
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
