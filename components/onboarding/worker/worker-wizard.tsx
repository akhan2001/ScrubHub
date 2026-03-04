'use client';

import { useState } from 'react';
import { WizardShell } from '@/components/onboarding/wizard-shell';
import { Step1Personal } from './step-1-personal';
import { Step2Credentials } from './step-2-credentials';
import { Step3Housing } from './step-3-housing';
import { Step4Rental } from './step-4-rental';
import { Step5Background } from './step-5-background';
import { Step6Payment } from './step-6-payment';
import { Step7Review } from './step-7-review';
import { saveWorkerStep, completeWorkerOnboarding } from '@/actions/onboarding';

export function WorkerOnboardingWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  const handleNext = async (data: any) => {
    try {
      await saveWorkerStep(currentStep, data);
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        await completeWorkerOnboarding();
      }
    } catch (error) {
      console.error('Failed to save step:', error);
      // In a real app, show a toast error here
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <WizardShell
      title="Worker Onboarding"
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={currentStep > 1 ? handleBack : undefined}
    >
      {currentStep === 1 && <Step1Personal onNext={handleNext} />}
      {currentStep === 2 && <Step2Credentials onNext={handleNext} />}
      {currentStep === 3 && <Step3Housing onNext={handleNext} />}
      {currentStep === 4 && <Step4Rental onNext={handleNext} />}
      {currentStep === 5 && <Step5Background onNext={handleNext} />}
      {currentStep === 6 && <Step6Payment onNext={handleNext} />}
      {currentStep === 7 && <Step7Review onNext={handleNext} />}
    </WizardShell>
  );
}
