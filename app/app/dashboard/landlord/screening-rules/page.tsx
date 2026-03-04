import { requireRole } from '@/server/guards/require-role';
import { getScreeningRule } from '@/server/services/screening-rules.service';
import { ScreeningRulesForm } from '@/components/landlord/screening-rules-form';

export default async function ScreeningRulesPage() {
  const user = await requireRole('landlord');
  const rule = await getScreeningRule(user.id);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-foreground">Screening rules</h1>
      <p className="text-muted-foreground">
        Configure booking screening logic used during approval decisions.
      </p>
      <ScreeningRulesForm
        minimumScore={rule?.minimum_score ?? 50}
        notes={rule?.notes ?? ''}
        autoApprove={rule?.auto_approve ?? false}
      />
    </div>
  );
}
