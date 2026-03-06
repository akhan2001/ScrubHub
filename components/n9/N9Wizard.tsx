'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, ArrowRight, Check, Download, Loader2 } from 'lucide-react';
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
import { N9Form } from '@/components/n9/N9Form';
import {
  getLeaseDetailsAction,
  calculateTerminationDateAction,
  createN9DraftAction,
  signN9Action,
  generateStandaloneN9Action,
} from '@/actions/n9';

type Step = 'reason' | 'details' | 'date' | 'review' | 'sign';

const LEASE_STEPS: Step[] = ['reason', 'details', 'date', 'review', 'sign'];
const STANDALONE_STEPS: Step[] = ['details', 'review', 'sign'];

const STEP_TITLES: Record<string, string> = {
  reason: 'Reason for termination',
  details: 'Enter your details',
  date: 'Termination date',
  review: 'Review your N9',
  sign: 'Sign and generate',
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
  standalone?: boolean;
}

export function N9Wizard({ lease, open, onOpenChange, standalone = false }: N9WizardProps) {
  const router = useRouter();
  const isStandalone = standalone || !lease;

  const steps = isStandalone ? STANDALONE_STEPS : LEASE_STEPS;

  const [step, setStep] = useState<Step>(steps[0]);
  const [reason, setReason] = useState<N9Reason | null>(null);

  const [landlordName, setLandlordName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [rentalAddress, setRentalAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [terminationDate, setTerminationDate] = useState('');
  const [explanation, setExplanation] = useState('');

  const [noticeId, setNoticeId] = useState('');
  const [signatureFirstName, setSignatureFirstName] = useState('');
  const [signatureLastName, setSignatureLastName] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);

  const [dateError, setDateError] = useState('');
  const [isPending, startTransition] = useTransition();
  const [detailsLoaded, setDetailsLoaded] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (isStandalone) {
      setDetailsLoaded(true);
      return;
    }
    if (!lease) return;
    setDetailsLoaded(false);
    startTransition(async () => {
      try {
        const details = await getLeaseDetailsAction(lease.id);
        setLandlordName(details.landlordName);
        setTenantName(details.tenantName);
        setRentalAddress(details.rentalAddress);
        setDetailsLoaded(true);
      } catch {
        toast.error('Failed to load lease details');
      }
    });
  }, [lease, open, isStandalone]);

  function reset() {
    setStep(steps[0]);
    setReason(null);
    setLandlordName('');
    setTenantName('');
    setRentalAddress('');
    setPhoneNumber('');
    setTerminationDate('');
    setExplanation('');
    setDateError('');
    setNoticeId('');
    setSignatureFirstName('');
    setSignatureLastName('');
    setConsentChecked(false);
    setDetailsLoaded(isStandalone);
    setGeneratedPdfUrl(null);
  }

  function handleClose() {
    if (generatedPdfUrl) URL.revokeObjectURL(generatedPdfUrl);
    reset();
    onOpenChange(false);
  }

  const stepIndex = steps.indexOf(step);

  function goBack() {
    if (stepIndex > 0) setStep(steps[stepIndex - 1]);
  }

  // --- Lease-based flow handlers ---

  function handleReasonNext() {
    if (!reason || !lease) return;
    if (lease.lease_type === 'fixed_term' && reason === 'moving_out') {
      setDateError(
        'You cannot use "Moving out" for a fixed-term lease. Select "End of fixed term" or "Mutual agreement" instead.'
      );
      return;
    }
    setDateError('');
    setStep('details');
  }

  function handleLeaseDetailsNext() {
    if (!landlordName.trim() || !tenantName.trim() || !rentalAddress.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (!reason || !lease) return;
    startTransition(async () => {
      try {
        const result = await calculateTerminationDateAction(lease.id, reason);
        if (!result.isValid) {
          setDateError(result.error ?? 'Cannot calculate termination date.');
          setStep('reason');
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

  function handleLeaseSign() {
    if (!signatureFirstName.trim() || !signatureLastName.trim() || !consentChecked || !noticeId) return;
    startTransition(async () => {
      try {
        await signN9Action(noticeId, {
          landlordName: landlordName.trim(),
          tenantName: tenantName.trim(),
          rentalAddress: rentalAddress.trim(),
          phoneNumber: phoneNumber.trim(),
          signatureFirstName: signatureFirstName.trim(),
          signatureLastName: signatureLastName.trim(),
        });
        toast.success('N9 notice signed and delivered to your landlord.');
        handleClose();
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to sign N9');
      }
    });
  }

  // --- Standalone flow handlers ---

  function handleStandaloneDetailsNext() {
    if (!landlordName.trim() || !tenantName.trim() || !rentalAddress.trim() || !terminationDate) {
      toast.error('Please fill in all required fields including termination date.');
      return;
    }
    setStep('review');
  }

  function handleStandaloneSign() {
    if (!signatureFirstName.trim() || !signatureLastName.trim() || !consentChecked) return;
    startTransition(async () => {
      try {
        const result = await generateStandaloneN9Action({
          landlordName: landlordName.trim(),
          tenantName: tenantName.trim(),
          rentalAddress: rentalAddress.trim(),
          phoneNumber: phoneNumber.trim(),
          signatureFirstName: signatureFirstName.trim(),
          signatureLastName: signatureLastName.trim(),
          terminationDate,
        });
        const bytes = Uint8Array.from(atob(result.pdfBase64), (c) => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setGeneratedPdfUrl(url);
        toast.success('N9 form generated. Download your PDF below.');
      } catch (err) {
        const msg = err instanceof Error ? err.message : (err as { message?: string })?.message ?? 'Failed to generate N9 PDF';
        toast.error(msg);
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{STEP_TITLES[step] ?? step}</SheetTitle>
          <SheetDescription>
            Step {stepIndex + 1} of {steps.length}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {/* Reason step (lease-based only) */}
          {step === 'reason' && !isStandalone && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Why are you ending your tenancy?
              </p>
              {REASON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setReason(opt.value); setDateError(''); }}
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

          {/* Details step */}
          {step === 'details' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {isStandalone
                  ? 'Fill in the details for your N9 form.'
                  : 'These fields are pre-filled from your lease. Edit any information if needed.'}
              </p>
              {!detailsLoaded && isPending ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="n9-landlord">Landlord&apos;s name</Label>
                    <Input
                      id="n9-landlord"
                      value={landlordName}
                      onChange={(e) => setLandlordName(e.target.value)}
                      placeholder="Landlord's full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="n9-tenant">Tenant name(s)</Label>
                    <Input
                      id="n9-tenant"
                      value={tenantName}
                      onChange={(e) => setTenantName(e.target.value)}
                      placeholder="Include all tenant names"
                    />
                    <p className="text-xs text-muted-foreground">
                      Include all tenant names on the lease, separated by commas.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="n9-address">Address of the rental unit</Label>
                    <Input
                      id="n9-address"
                      value={rentalAddress}
                      onChange={(e) => setRentalAddress(e.target.value)}
                      placeholder="Full address including unit number"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="n9-phone">Phone number</Label>
                    <Input
                      id="n9-phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="(___) ___-____"
                    />
                  </div>
                  {isStandalone && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <Label htmlFor="n9-term-date">Termination date</Label>
                        <Input
                          id="n9-term-date"
                          type="date"
                          value={terminationDate}
                          onChange={(e) => setTerminationDate(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          The last day of your tenancy. Must be at least 60 days from today
                          and fall on the last day of a rental period.
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* Date confirmation step (lease-based only) */}
          {step === 'date' && !isStandalone && (
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

          {/* Review step */}
          {step === 'review' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {isStandalone
                  ? 'Review the details below before signing.'
                  : 'Review the details below. Once you sign, this notice will be delivered to your landlord.'}
              </p>
              <div className="overflow-x-auto rounded-lg border">
                <N9Form
                  landlordName={landlordName}
                  tenantName={tenantName}
                  rentalAddress={rentalAddress}
                  terminationDate={
                    terminationDate
                      ? (() => {
                          const [y, m, d] = terminationDate.split('-');
                          return d && m && y ? `${d}/${m}/${y}` : terminationDate;
                        })()
                      : ''
                  }
                  phoneNumber={phoneNumber}
                  signatureFirstName={signatureFirstName}
                  signatureLastName={signatureLastName}
                  showSignatureSection
                />
              </div>
            </div>
          )}

          {/* Sign step */}
          {step === 'sign' && (
            <div className="space-y-4">
              {generatedPdfUrl ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center space-y-3">
                    <p className="text-sm font-medium text-green-800">
                      Your N9 form has been generated.
                    </p>
                    <Button asChild>
                      <a href={generatedPdfUrl} download="N9_Notice.pdf">
                        <Download className="mr-2 size-4" />
                        Download N9 PDF
                      </a>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Deliver this signed form to your landlord in person, by mail, or by email.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Enter your name to electronically sign this N9 notice.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="sigFirstName">First name</Label>
                      <Input
                        id="sigFirstName"
                        value={signatureFirstName}
                        onChange={(e) => setSignatureFirstName(e.target.value)}
                        placeholder="First name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sigLastName">Last name</Label>
                      <Input
                        id="sigLastName"
                        value={signatureLastName}
                        onChange={(e) => setSignatureLastName(e.target.value)}
                        placeholder="Last name"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="consent"
                      checked={consentChecked}
                      onCheckedChange={(v) => setConsentChecked(v === true)}
                    />
                    <Label htmlFor="consent" className="text-xs leading-relaxed text-muted-foreground">
                      I confirm that the information in this notice is accurate and I am submitting this
                      N9 in good faith.
                    </Label>
                  </div>
                </>
              )}
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
            {stepIndex === 0 ? 'Cancel' : (
              <>
                <ArrowLeft className="mr-1 size-3.5" />
                Back
              </>
            )}
          </Button>

          {/* Lease-based: reason step */}
          {step === 'reason' && !isStandalone && (
            <Button size="sm" onClick={handleReasonNext} disabled={!reason || isPending}>
              {isPending ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : null}
              Continue
              <ArrowRight className="ml-1 size-3.5" />
            </Button>
          )}

          {/* Details step */}
          {step === 'details' && (
            <Button
              size="sm"
              onClick={isStandalone ? handleStandaloneDetailsNext : handleLeaseDetailsNext}
              disabled={
                isPending ||
                !detailsLoaded ||
                !landlordName.trim() ||
                !tenantName.trim() ||
                !rentalAddress.trim() ||
                (isStandalone && !terminationDate)
              }
            >
              {isPending ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : null}
              Continue
              <ArrowRight className="ml-1 size-3.5" />
            </Button>
          )}

          {/* Lease-based: date confirmation step */}
          {step === 'date' && !isStandalone && (
            <Button size="sm" onClick={handleDateNext} disabled={isPending}>
              {isPending ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : null}
              Confirm date
              <ArrowRight className="ml-1 size-3.5" />
            </Button>
          )}

          {/* Review step */}
          {step === 'review' && (
            <Button size="sm" onClick={() => setStep('sign')}>
              Proceed to sign
              <ArrowRight className="ml-1 size-3.5" />
            </Button>
          )}

          {/* Sign step */}
          {step === 'sign' && !generatedPdfUrl && (
            <Button
              size="sm"
              onClick={isStandalone ? handleStandaloneSign : handleLeaseSign}
              disabled={
                !signatureFirstName.trim() ||
                !signatureLastName.trim() ||
                !consentChecked ||
                isPending ||
                (!isStandalone && !noticeId)
              }
            >
              {isPending ? (
                <Loader2 className="mr-1 size-3.5 animate-spin" />
              ) : (
                <Check className="mr-1 size-3.5" />
              )}
              {isStandalone ? 'Sign and generate PDF' : 'Sign and submit'}
            </Button>
          )}

          {step === 'sign' && generatedPdfUrl && (
            <Button size="sm" onClick={handleClose}>
              Done
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
