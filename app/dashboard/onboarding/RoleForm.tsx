'use client';

import { useState } from 'react';
import { updateProfileRole } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import type { AppRole } from '@/types/database';

export function RoleForm({
  currentRole,
  roles,
}: {
  currentRole: AppRole;
  roles: AppRole[];
}) {
  const [role, setRole] = useState<AppRole>(currentRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await updateProfileRole(role);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 p-2 rounded">
          {error}
        </p>
      )}
      <div>
        <label className="block text-sm font-medium mb-2">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as AppRole)}
          className="w-full rounded border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-900 dark:text-zinc-100"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Saving…' : 'Save role'}
      </button>
    </form>
  );
}
