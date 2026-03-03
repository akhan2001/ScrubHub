'use client';

import { useState } from 'react';
import { createListing } from '@/actions/listings';

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
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-2 rounded">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          className="w-full rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div>
        <label htmlFor="price_cents" className="block text-sm font-medium mb-1">
          Price (cents)
        </label>
        <input
          id="price_cents"
          name="price_cents"
          type="number"
          min={0}
          step={1}
          className="w-full rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium mb-1">
          Status
        </label>
        <select
          id="status"
          name="status"
          className="w-full rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Creating…' : 'Create listing'}
      </button>
    </form>
  );
}
