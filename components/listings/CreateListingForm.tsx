'use client';

import { useState } from 'react';
import { createListing } from '@/actions/listings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function CreateListingForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value || null,
      address: (form.elements.namedItem('address') as HTMLInputElement).value || null,
      price_cents: (() => {
        const raw = (form.elements.namedItem('price_cents') as HTMLInputElement).value;
        if (!raw) return null;
        const n = parseInt(raw, 10);
        return Number.isNaN(n) ? null : n;
      })(),
      status: (form.elements.namedItem('status') as HTMLSelectElement).value as 'draft' | 'published',
    };
    try {
      await createListing(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      {error && (
        <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" name="title" type="text" required placeholder="Stylish 2BR near hospital" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} placeholder="Furnished unit with parking..." />
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" name="address" type="text" placeholder="123 Main St, Toronto" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price_cents">Price (cents)</Label>
        <Input id="price_cents" name="price_cents" type="number" min={0} step={1} placeholder="180000" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating…' : 'Create listing'}
      </Button>
    </form>
  );
}
