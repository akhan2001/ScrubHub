import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface WizardShellProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
}

export function WizardShell({
  title,
  currentStep,
  totalSteps,
  children,
  onBack,
  showBack = true,
}: WizardShellProps) {
  const progress = Math.round(((currentStep) / totalSteps) * 100);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{progress}% completed</span>
        </div>
        <Progress value={progress} className="h-2" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        {children}
      </div>

      <div className="mt-6 flex justify-between">
        {showBack && (
          <Button variant="outline" onClick={onBack} disabled={!onBack}>
            Back
          </Button>
        )}
        {/* Next/Submit buttons are usually inside the form to trigger validation */}
      </div>
    </div>
  );
}
