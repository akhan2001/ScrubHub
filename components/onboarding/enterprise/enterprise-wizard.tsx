'use client';

import { useState } from 'react';
import { WizardShell } from '@/components/onboarding/wizard-shell';
import { Step1Org } from './step-1-org';
import { Step2Admin } from './step-2-admin';
import { Step3Team } from './step-3-team';
import { Step4Portfolio } from './step-4-portfolio';
import { Step5JobBoard } from './step-5-job-board';
import { Step6Billing } from './step-6-billing';
import { Step7Review } from './step-7-review';
import { saveEnterpriseStep, completeEnterpriseOnboarding } from '@/actions/onboarding';

export function EnterpriseOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const handleNext = async (data: any) => {
    try {
      await saveEnterpriseStep(currentStep, data);
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        await completeEnterpriseOnboarding();
      }
    } catch (error) {
      console.error('Failed to save step:', error);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <WizardShell
      title="Enterprise Onboarding"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={currentStep > 1 ? handleBack : undefined}
    >
      {currentStep === 1 && <Step1Org onNext={handleNext} />}
      {currentStep === 2 && <Step2Admin onNext={handleNext} />}
      {currentStep === 3 && <Step3Team onNext={handleNext} />}
      {currentStep === 4 && <Step4Portfolio onNext={handleNext} />}
      {currentStep === 5 && <Step5JobBoard onNext={handleNext} />}
      {currentStep === 6 && <Step6Billing onNext={handleNext} />}
      {currentStep === 7 && <Step7Review onNext={handleNext} />}
    </WizardShell>
  );
}
