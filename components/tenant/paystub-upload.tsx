'use client';

import { useRef, useState } from 'react';
import { CheckCircle2, FileText, Loader2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { uploadPayStub } from '@/lib/integrations/supabase-storage';
import { savePayStubPath } from '@/actions/profile';

type PayStubUploadProps = {
  /** Storage path of the pay stub currently on file, if any. */
  initialPath?: string | null;
  /** Called after a successful upload + save with the new storage path. */
  onUploaded?: (path: string) => void;
};

const ACCEPT = 'application/pdf,image/jpeg,image/png';

export function PayStubUpload({ initialPath, onUploaded }: PayStubUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [path, setPath] = useState<string | null>(initialPath ?? null);
  const [filename, setFilename] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const newPath = await uploadPayStub(file);
      await savePayStubPath(newPath);
      setPath(newPath);
      setFilename(file.name);
      onUploaded?.(newPath);
      toast.success('Pay stub uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    void handleFile(file);
    // Reset the input so re-selecting the same file still triggers onChange.
    e.target.value = '';
  }

  const hasFile = !!path;
  const display = filename ?? (path ? path.split('/').pop() : null);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Recent pay stub</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            PDF, JPG or PNG · 10 MB max. Used to verify employment income; visible only to you and
            the landlord on this application.
          </p>
        </div>
        {hasFile ? (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-800">
            <CheckCircle2 className="size-3.5" /> On file
          </span>
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={onChange}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant={hasFile ? 'outline' : 'default'}
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload className="size-3.5" />
              {hasFile ? 'Replace' : 'Upload pay stub'}
            </>
          )}
        </Button>

        {display ? (
          <span className="inline-flex max-w-[24ch] items-center gap-1.5 truncate rounded-md bg-muted/60 px-2 py-1 text-xs text-foreground">
            <FileText className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate">{display}</span>
            <button
              type="button"
              aria-label="Clear filename"
              className="ml-1 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setFilename(null);
              }}
            >
              <X className="size-3" />
            </button>
          </span>
        ) : null}
      </div>
    </div>
  );
}
