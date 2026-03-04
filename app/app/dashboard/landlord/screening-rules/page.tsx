import { requireRole } from '@/server/guards/require-role';
import { getScreeningRule } from '@/server/services/screening-rules.service';
import { ScreeningRulesForm } from '@/components/landlord/screening-rules-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSection } from '@/components/dashboard/dashboard-section';

export default async function ScreeningRulesPage() {
  const user = await requireRole('landlord');
  const rule = await getScreeningRule(user.id);

  return (
    <DashboardSection
      title="Screening rules"
      description="Configure automated screening logic applied during booking approvals."
    >
      <Card>
        <CardHeader>
          <CardTitle>Policy controls</CardTitle>
          <CardDescription>Set minimum score thresholds and optional auto-approve behavior.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScreeningRulesForm
            minimumScore={rule?.minimum_score ?? 50}
            notes={rule?.notes ?? ''}
            autoApprove={rule?.auto_approve ?? false}
          />
        </CardContent>
      </Card>
    </DashboardSection>
  );
}
