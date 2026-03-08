'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Facility } from '@/lib/map/facilities';
import type { ListingWithCoordinates } from '@/lib/map/mock-coordinates';

const MAX_RESULTS = 20;

type SearchResult =
  | { type: 'facility'; data: Facility }
  | { type: 'listing'; data: ListingWithCoordinates };

function formatPrice(cents: number | null) {
  if (!cents) return 'N/A';
  return `$${Math.round(cents / 100)}`;
}

interface FacilitySearchProps {
  facilities: Facility[];
  listings: ListingWithCoordinates[];
  onSelect: (facility: Facility) => void;
  onSelectListing?: (listing: ListingWithCoordinates) => void;
  mapReady: boolean;
  disabled?: boolean;
}

export function FacilitySearch({
  facilities,
  listings,
  onSelect,
  onSelectListing,
  mapReady,
  disabled = false,
}: FacilitySearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo<SearchResult[]>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const facilityMatches: SearchResult[] = facilities
      .filter((f) => f.name.toLowerCase().includes(q))
      .map((f) => ({ type: 'facility' as const, data: f }));

    const listingMatches: SearchResult[] = listings
      .filter(
        (l) =>
          (l.title?.toLowerCase().includes(q) ?? false) ||
          (l.address?.toLowerCase().includes(q) ?? false)
      )
      .map((l) => ({ type: 'listing' as const, data: l }));

    return [...facilityMatches, ...listingMatches].slice(0, MAX_RESULTS);
  }, [facilities, listings, searchQuery]);

  const handleSelect = useCallback(
    (item: SearchResult) => {
      if (item.type === 'facility') {
        onSelect(item.data);
      } else if (item.type === 'listing' && onSelectListing) {
        onSelectListing(item.data);
      }
      setSearchQuery('');
      setIsDropdownOpen(false);
      setHighlightedIndex(0);
    },
    [onSelect, onSelectListing]
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
          placeholder="Search facilities and listings..."
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
              No facilities or listings match your search
            </div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.type === 'facility' ? `f-${item.data.id}` : `l-${item.data.id}`}
                type="button"
                role="option"
                aria-selected={i === highlightedIndex}
                className={`flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors ${
                  i === highlightedIndex ? 'bg-primary/10' : 'hover:bg-muted/50'
                }`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                {item.type === 'facility' ? (
                  <>
                    <span className="font-medium text-foreground">{item.data.name}</span>
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.data.type === 'hospital'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.data.type === 'hospital' ? 'Hospital' : 'Clinic'}
                      </span>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          item.data.status === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {item.data.status === 'urgent' ? 'Urgent' : 'Live'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="font-medium text-foreground">
                      {item.data.title ?? 'Listing'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.data.address && (
                        <span className="text-xs text-muted-foreground truncate max-w-full">
                          {item.data.address}
                        </span>
                      )}
                      <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-medium">
                        {formatPrice(item.data.price_cents)}/mo
                      </span>
                    </div>
                  </>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
