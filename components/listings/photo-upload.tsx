'use client';

import { useCallback, useRef, useState } from 'react';
import { ImagePlus, GripVertical, X, Loader2 } from 'lucide-react';
import { uploadListingPhoto } from '@/lib/integrations/supabase-storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function PhotoUpload({ value, onChange, max = 20 }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const remaining = max - value.length;
      if (remaining <= 0) return;

      const batch = Array.from(files).slice(0, remaining);
      setUploading(true);
      try {
        const urls = await Promise.all(batch.map((f) => uploadListingPhoto(f)));
        onChange([...value, ...urls]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        toast.error(message);
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, max],
  );

  function handleRemove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleDrop(index: number) {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...value];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    onChange(next);
    setDragIndex(null);
    setDragOverIndex(null);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, i) => (
          <div
            key={url}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={(e) => handleDragOver(e, i)}
            onDrop={() => handleDrop(i)}
            onDragEnd={() => {
              setDragIndex(null);
              setDragOverIndex(null);
            }}
            className={cn(
              'group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted',
              dragOverIndex === i && 'ring-2 ring-primary',
            )}
          >
            <img
              src={url}
              alt={`Photo ${i + 1}`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-start justify-between bg-black/0 p-1.5 opacity-0 transition-opacity group-hover:bg-black/20 group-hover:opacity-100">
              <GripVertical className="size-4 cursor-grab text-white drop-shadow" />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <X className="size-3.5" />
              </button>
            </div>
            {i === 0 && (
              <span className="absolute bottom-1.5 left-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                Cover
              </span>
            )}
          </div>
        ))}

        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="size-6 animate-spin" />
            ) : (
              <ImagePlus className="size-6" />
            )}
            <span className="text-xs font-medium">
              {uploading ? 'Uploading...' : 'Add photos'}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-muted-foreground">
        {value.length} / {max} photos. Drag to reorder. First photo is the cover image.
      </p>
    </div>
  );
}
