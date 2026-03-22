'use client';

import { useState } from 'react';
import { upsertLandlordScreeningRules } from '@/actions/screening-rules';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { getUserFacingErrorMessage } from '@/lib/errors/user-facing-error';
import type { ScreeningRule } from '@/types/database';

interface ListingScreeningRulesProps {
  listingId: string;
  rules: ScreeningRule | null;
}

export function ListingScreeningRules({ listingId, rules }: ListingScreeningRulesProps) {
  const [loading, setLoading] = useState(false);
  const [autoApprove, setAutoApprove] = useState(rules?.auto_approve ?? false);
  const [instantBook, setInstantBook] = useState(rules?.instant_book_enabled ?? false);
  const [requireBg, setRequireBg] = useState(rules?.require_background_check ?? false);
  const [requireEmp, setRequireEmp] = useState(rules?.require_employment_verification ?? false);
  const [requireLic, setRequireLic] = useState(rules?.require_license_verification ?? false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const minimumScore = Number(
      (form.elements.namedItem('minimum_score') as HTMLInputElement).value
    );
    const notes = (form.elements.namedItem('notes') as HTMLTextAreaElement).value;
    const maxRatio = (form.elements.namedItem('max_ratio') as HTMLInputElement).value;

    try {
      await upsertLandlordScreeningRules({
        listingId,
        minimumScore,
        notes: notes || undefined,
        autoApprove,
        requireBackgroundCheck: requireBg,
        requireEmploymentVerification: requireEmp,
        requireLicenseVerification: requireLic,
        maxIncomeToRentRatio: maxRatio ? parseFloat(maxRatio) : undefined,
        instantBookEnabled: instantBook,
      });
      toast.success('Screening rules saved');
    } catch (err) {
      toast.error(getUserFacingErrorMessage(err, "We couldn't save screening rules. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-sm font-semibold">Screening Rules</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="minimum_score">Minimum Credit Score</Label>
          <Input
            id="minimum_score"
            name="minimum_score"
            type="number"
            min={0}
            max={850}
            placeholder="e.g. 650 (typically 300–850)"
            defaultValue={rules?.minimum_score ?? 650}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_ratio">Income-to-rent guideline (optional)</Label>
          <Input
            id="max_ratio"
            name="max_ratio"
            type="number"
            step={0.1}
            min={0}
            placeholder="e.g. 3.0"
            defaultValue={rules?.max_income_to_rent_ratio ?? ''}
          />
          <p className="text-xs text-muted-foreground">
            Rough guideline only. Actual affordability depends on tenant debt and other expenses.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Rule Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={2}
          defaultValue={rules?.notes ?? ''}
          placeholder="Internal notes about screening criteria..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Required Checks</Label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={requireBg} onCheckedChange={(v) => setRequireBg(v === true)} />
            Require background check
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={requireEmp} onCheckedChange={(v) => setRequireEmp(v === true)} />
            Require employment verification
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={requireLic} onCheckedChange={(v) => setRequireLic(v === true)} />
            Require license verification
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Automation</Label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={autoApprove} onCheckedChange={(v) => setAutoApprove(v === true)} />
            Auto-approve when all checks pass
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={instantBook} onCheckedChange={(v) => setInstantBook(v === true)} />
            Enable instant book
          </label>
        </div>
      </div>

      <Button type="submit" disabled={loading} size="sm">
        {loading ? 'Saving...' : 'Save Rules'}
      </Button>
    </form>
  );
}
