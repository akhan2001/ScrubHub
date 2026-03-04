'use client';

import { useState } from 'react';
import { createOrganization } from '@/actions/enterprise';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateOrganizationForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const domain = (form.elements.namedItem('domain') as HTMLInputElement).value;
    try {
      await createOrganization({ name, domain });
      setSuccess('Organization created.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create organization');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-md rounded-md border border-border p-3">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}
      <div className="space-y-2">
        <Label htmlFor="name">Organization name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="domain">Domain (optional)</Label>
        <Input id="domain" name="domain" placeholder="company.com" />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create organization'}
      </Button>
    </form>
  );
}
