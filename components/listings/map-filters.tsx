'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LEASE_TERM_OPTIONS } from '@/lib/validations/listing';
import { SlidersHorizontal, X } from 'lucide-react';

export interface MapFilterValues {
  minPrice?: number;
  maxPrice?: number;
  leaseTerms?: string[];
  isFurnished?: boolean;
  arePetsAllowed?: boolean;
  verifiedLandlord?: boolean;
  instantBook?: boolean;
}

interface MapFiltersProps {
  value: MapFilterValues;
  onChange: (filters: MapFilterValues) => void;
}

export function MapFilters({ value, onChange }: MapFiltersProps) {
  const [open, setOpen] = useState(false);

  const activeCount = [
    value.minPrice != null,
    value.maxPrice != null,
    (value.leaseTerms?.length ?? 0) > 0,
    value.isFurnished,
    value.arePetsAllowed,
    value.verifiedLandlord,
    value.instantBook,
  ].filter(Boolean).length;

  function update(patch: Partial<MapFilterValues>) {
    onChange({ ...value, ...patch });
  }

  function clearAll() {
    onChange({});
  }

  function toggleLease(term: string) {
    const cur = value.leaseTerms ?? [];
    const next = cur.includes(term)
      ? cur.filter((t) => t !== term)
      : [...cur, term];
    update({ leaseTerms: next.length > 0 ? next : undefined });
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-2"
      >
        <SlidersHorizontal className="size-3.5" />
        Filters
        {activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {activeCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-lg border border-border bg-card p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold">Filters</h4>
            <button type="button" onClick={() => setOpen(false)}>
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Price Range ($/mo)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={value.minPrice ?? ''}
                  onChange={(e) =>
                    update({ minPrice: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                  className="h-8 text-sm"
                />
                <span className="text-muted-foreground">—</span>
                <Input
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={value.maxPrice ?? ''}
                  onChange={(e) =>
                    update({ maxPrice: e.target.value ? parseInt(e.target.value) : undefined })
                  }
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Lease Term</Label>
              <div className="flex flex-wrap gap-1.5">
                {LEASE_TERM_OPTIONS.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => toggleLease(term)}
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                      value.leaseTerms?.includes(term)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Features</Label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox
                    checked={!!value.isFurnished}
                    onCheckedChange={(c) => update({ isFurnished: c === true ? true : undefined })}
                  />
                  Furnished
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox
                    checked={!!value.arePetsAllowed}
                    onCheckedChange={(c) => update({ arePetsAllowed: c === true ? true : undefined })}
                  />
                  Pet Friendly
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox
                    checked={!!value.verifiedLandlord}
                    onCheckedChange={(c) => update({ verifiedLandlord: c === true ? true : undefined })}
                  />
                  Verified Landlord
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <Checkbox
                    checked={!!value.instantBook}
                    onCheckedChange={(c) => update({ instantBook: c === true ? true : undefined })}
                  />
                  Instant Book
                </label>
              </div>
            </div>

            {activeCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="w-full text-xs">
                Clear all filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
