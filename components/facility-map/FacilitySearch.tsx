'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Facility } from '@/lib/map/facilities';

const MAX_RESULTS = 20;

interface FacilitySearchProps {
  facilities: Facility[];
  onSelect: (facility: Facility) => void;
  mapReady: boolean;
  disabled?: boolean;
}

export function FacilitySearch({
  facilities,
  onSelect,
  mapReady,
  disabled = false,
}: FacilitySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return facilities
      .filter((f) => f.name.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS);
  }, [facilities, searchQuery]);

  const handleSelect = useCallback(
    (facility: Facility) => {
      onSelect(facility);
      setSearchQuery('');
      setIsDropdownOpen(false);
      setHighlightedIndex(0);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isDropdownOpen || filtered.length === 0) {
        if (e.key === 'Escape') {
          setIsDropdownOpen(false);
          setSearchQuery('');
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          handleSelect(filtered[highlightedIndex]);
          break;
        case 'Escape':
          e.preventDefault();
          setIsDropdownOpen(false);
          setSearchQuery('');
          setHighlightedIndex(0);
          break;
      }
    },
    [filtered, highlightedIndex, isDropdownOpen, handleSelect]
  );

  useEffect(() => {
    setHighlightedIndex(0);
    setIsDropdownOpen(searchQuery.trim().length > 0);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDisabled = disabled || !mapReady;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search facilities by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchQuery.trim() && setIsDropdownOpen(true)}
          disabled={isDisabled}
          className="pl-9"
        />
      </div>

      {isDropdownOpen && searchQuery.trim() && (
        <div
          className="absolute left-0 top-full z-[600] mt-1 max-h-64 w-full overflow-auto rounded-lg border border-[#d0d9e8] bg-white shadow-lg"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              No facilities match your search
            </div>
          ) : (
            filtered.map((f, i) => (
              <button
                key={f.id}
                type="button"
                role="option"
                aria-selected={i === highlightedIndex}
                className={`flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors ${
                  i === highlightedIndex ? 'bg-primary/10' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleSelect(f)}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                <span className="font-medium text-foreground">{f.name}</span>
                <div className="flex flex-wrap gap-1.5">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      f.type === 'hospital'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {f.type === 'hospital' ? 'Hospital' : 'Clinic'}
                  </span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      f.status === 'urgent'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {f.status === 'urgent' ? 'Urgent' : 'Live'}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
