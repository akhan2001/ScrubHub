'use client';

import { useState } from 'react';
import { upsertLandlordScreeningRules } from '@/actions/screening-rules';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

export function ScreeningRulesForm(props: {
  minimumScore: number;
  notes: string | null;
  autoApprove: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [checked, setChecked] = useState(props.autoApprove);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const form = e.currentTarget;
    const minimumScore = Number((form.elements.namedItem('minimum_score') as HTMLInputElement).value);
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;
    try {
      await upsertLandlordScreeningRules({
        minimumScore,
        notes,
        autoApprove: checked,
      });
      setSuccess('Screening rules saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save rules.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-md">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-emerald-600">{success}</p>}
      <div className="space-y-2">
        <Label htmlFor="minimum_score">Minimum score</Label>
        <Input
          id="minimum_score"
          name="minimum_score"
          type="number"
          min={0}
          max={100}
          defaultValue={props.minimumScore}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Rule notes</Label>
        <Textarea id="notes" name="notes" rows={3} defaultValue={props.notes ?? ''} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
        Auto approve if score threshold is met
      </label>
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save rules'}
      </Button>
    </form>
  );
}
