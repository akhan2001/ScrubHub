'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Lease, N9Reason } from '@/types/database';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { N9Preview } from '@/components/n9/N9Preview';
import {
  calculateTerminationDateAction,
  createN9DraftAction,
  signN9Action,
} from '@/actions/n9';

type Step = 'reason' | 'date' | 'review' | 'sign';

const STEPS: Step[] = ['reason', 'date', 'review', 'sign'];
const STEP_TITLES: Record<Step, string> = {
  reason: 'Reason for termination',
  date: 'Termination date',
  review: 'Review your N9',
  sign: 'Sign and submit',
};

const REASON_OPTIONS: { value: N9Reason; label: string; description: string }[] = [
  {
    value: 'moving_out',
    label: 'Moving out',
    description: 'You are ending a month-to-month or periodic tenancy.',
  },
  {
    value: 'end_of_term',
    label: 'End of fixed term',
    description: 'Your fixed-term lease is ending and you do not wish to renew.',
  },
  {
    value: 'mutual_agreement',
    label: 'Mutual agreement',
    description: 'You and your landlord have agreed to end the tenancy.',
  },
];

interface N9WizardProps {
  lease: Lease | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function N9Wizard({ lease, open, onOpenChange }: N9WizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('reason');
  const [reason, setReason] = useState<N9Reason | null>(null);
  const [terminationDate, setTerminationDate] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [dateError, setDateError] = useState<string>('');
  const [noticeId, setNoticeId] = useState<string>('');
  const [signatureName, setSignatureName] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isPending, startTransition] = useTransition();

  function reset() {
    setStep('reason');
    setReason(null);
    setTerminationDate('');
    setExplanation('');
    setDateError('');
    setNoticeId('');
    setSignatureName('');
    setConsentChecked(false);
  }

  function handleClose() {
    reset();
    onOpenChange(false);
  }

  const stepIndex = STEPS.indexOf(step);

  function goBack() {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1]);
  }

  function handleReasonNext() {
    if (!reason || !lease) return;

    if (lease.lease_type === 'fixed_term' && reason === 'moving_out') {
      setDateError(
        'You cannot use "Moving out" for a fixed-term lease. Select "End of fixed term" ' +
          'or "Mutual agreement" instead.'
      );
      return;
    }
    setDateError('');

    startTransition(async () => {
      try {
        const result = await calculateTerminationDateAction(lease.id, reason);
        if (!result.isValid) {
          setDateError(result.error ?? 'Cannot calculate termination date.');
          return;
        }
        setTerminationDate(result.terminationDate.toString().split('T')[0]);
        setExplanation(result.explanation);
        setStep('date');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to calculate termination date');
      }
    });
  }

  function handleDateNext() {
    if (!lease || !reason) return;

    startTransition(async () => {
      try {
        const result = await createN9DraftAction(lease.id, reason);
        setNoticeId(result.noticeId);
        setStep('review');
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to create N9 draft');
      }
    });
  }

  function handleSign() {
    if (!signatureName.trim() || !consentChecked || !noticeId) return;

    startTransition(async () => {
      try {
        await signN9Action(noticeId, signatureName.trim());
        toast.success('N9 notice signed and delivered to your landlord.');
        handleClose();
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to sign N9');
      }
    });
  }

  if (!lease) return null;

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{STEP_TITLES[step]}</SheetTitle>
          <SheetDescription>
            Step {stepIndex + 1} of {STEPS.length}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {/* Step 1: Reason */}
          {step === 'reason' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Why are you ending your tenancy?
              </p>
              {REASON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setReason(opt.value);
                    setDateError('');
                  }}
                  className={`w-full rounded-lg border p-4 text-left transition-colors ${
                    reason === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
                </button>
              ))}

              {dateError && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  <p className="text-sm text-amber-800">{dateError}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Date confirmation */}
          {step === 'date' && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Termination date
                </p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {new Date(terminationDate + 'T00:00:00').toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{explanation}</p>
              <Separator />
              <p className="text-xs text-muted-foreground">
                This date has been calculated according to the Ontario Residential Tenancies Act.
                If you disagree or need an earlier date, contact your landlord to discuss a mutual
                agreement.
              </p>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 'review' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review the details below. Once you sign, this notice will be delivered to your landlord.
              </p>
              <N9Preview
                lease={lease}
                reason={reason!}
                terminationDate={terminationDate}
              />
            </div>
          )}

          {/* Step 4: Sign */}
          {step === 'sign' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Type your full legal name below to electronically sign this N9 notice.
              </p>
              <div className="space-y-2">
                <Label htmlFor="signatureName">Full legal name</Label>
                <Input
                  id="signatureName"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Enter your full name as it appears on your lease"
                />
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="consent"
                  checked={consentChecked}
                  onCheckedChange={(v) => setConsentChecked(v === true)}
                />
                <Label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground">
                  I confirm that the information in this notice is accurate and I am submitting this
                  N9 in good faith. I understand this will formally notify my landlord of my intent to
                  terminate the tenancy.
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="flex items-center justify-between border-t p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={stepIndex === 0 ? handleClose : goBack}
            disabled={isPending}
          >
            {stepIndex === 0 ? (
              'Cancel'
            ) : (
              <>
                <ArrowLeft className="mr-1 size-3.5" />
                Back
              </>
            )}
          </Button>

          {step === 'reason' && (
            <Button size="sm" onClick={handleReasonNext} disabled={!reason || isPending}>
              {isPending ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : null}
              Continue
              <ArrowRight className="ml-1 size-3.5" />
            </Button>
          )}

          {step === 'date' && (
            <Button size="sm" onClick={handleDateNext} disabled={isPending}>
              {isPending ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : null}
              Confirm date
              <ArrowRight className="ml-1 size-3.5" />
            </Button>
          )}

          {step === 'review' && (
            <Button size="sm" onClick={() => setStep('sign')}>
              Proceed to sign
              <ArrowRight className="ml-1 size-3.5" />
            </Button>
          )}

          {step === 'sign' && (
            <Button
              size="sm"
              onClick={handleSign}
              disabled={!signatureName.trim() || !consentChecked || isPending}
            >
              {isPending ? (
                <Loader2 className="mr-1 size-3.5 animate-spin" />
              ) : (
                <Check className="mr-1 size-3.5" />
              )}
              Sign and submit
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
