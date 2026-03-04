'use client';

import { useState } from 'react';
import { WizardShell } from '@/components/onboarding/wizard-shell';
import { Step1Identity } from './step-1-identity';
import { Step2Business } from './step-2-business';
import { Step3Property } from './step-3-property';
import { Step4Listing } from './step-4-listing';
import { Step5Payout } from './step-5-payout';
import { Step6Review } from './step-6-review';
import { saveLandlordStep, completeLandlordOnboarding } from '@/actions/onboarding';

export function LandlordOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const handleNext = async (data: any) => {
    try {
      await saveLandlordStep(currentStep, data);
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        await completeLandlordOnboarding();
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
      title="Landlord Onboarding"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={currentStep > 1 ? handleBack : undefined}
    >
      {currentStep === 1 && <Step1Identity onNext={handleNext} />}
      {currentStep === 2 && <Step2Business onNext={handleNext} />}
      {currentStep === 3 && <Step3Property onNext={handleNext} />}
      {currentStep === 4 && <Step4Listing onNext={handleNext} />}
      {currentStep === 5 && <Step5Payout onNext={handleNext} />}
      {currentStep === 6 && <Step6Review onNext={handleNext} />}
    </WizardShell>
  );
}
