'use client';

import { cn } from '@/lib/utils';
import { AMENITY_OPTIONS } from '@/lib/validations/listing';

interface AmenityTagsProps {
  value: string[];
  onChange: (amenities: string[]) => void;
}

export function AmenityTags({ value, onChange }: AmenityTagsProps) {
  function toggle(amenity: string) {
    if (value.includes(amenity)) {
      onChange(value.filter((a) => a !== amenity));
    } else {
      onChange([...value, amenity]);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {AMENITY_OPTIONS.map((amenity) => {
        const selected = value.includes(amenity);
        return (
          <button
            key={amenity}
            type="button"
            onClick={() => toggle(amenity)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              selected
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground',
            )}
          >
            {amenity}
          </button>
        );
      })}
    </div>
  );
}
