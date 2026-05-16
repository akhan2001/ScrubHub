'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bath,
  Bed,
  CheckCircle2,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Square,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createBooking } from '@/actions/bookings';
import { PayStubUpload } from '@/components/tenant/paystub-upload';
import type { Profile, WorkerProfile } from '@/types/database';

const applicationSchema = z.object({
  // Listing-specific
  moveInDate: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date'),
  message: z.string().max(1000).optional(),
  consentAcknowledged: z.literal(true, {
    message: 'You must acknowledge the screening consent',
  }),
  // Prefilled from worker profile, editable here
  fullName: z.string().min(1, 'Required'),
  email: z.string().email('Enter a valid email'),
  phoneNumber: z.string().optional(),
  healthcareRole: z.string().optional(),
  employmentStatus: z.string().optional(),
  employerName: z.string().optional(),
  currentAddress: z.string().optional(),
  budgetMin: z.string().optional(),
  budgetMax: z.string().optional(),
  hasPets: z.boolean().optional(),
  petDetails: z.string().optional(),
  accessibilityNeeds: z.string().optional(),
});

type ApplicationData = z.infer<typeof applicationSchema>;

type Listing = {
  id: string;
  title: string | null;
  address: string | null;
  price_cents: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  square_footage: number | null;
  images: string[] | null;
};

type ApplicationPageProps = {
  listing: Listing;
  profile: Profile;
  workerProfile: WorkerProfile | null;
  /** True if the tenant still needs to upload ID / consent to background check. */
  profileGate: {
    hasBackgroundConsent: boolean;
    hasIdDocument: boolean;
  };
};

const EQUIFAX_URL =
  'https://www.consumer.equifax.ca/personal/products/credit-score-and-report/';

const fmtPrice = (cents: number | null) =>
  cents != null ? `$${Math.round(cents / 100).toLocaleString()}` : '—';

export function ApplicationPage({
  listing,
  profile,
  workerProfile,
  profileGate,
}: ApplicationPageProps) {
  const router = useRouter();
  const cover = listing.images?.[0];
  const gateMet = profileGate.hasBackgroundConsent && profileGate.hasIdDocument;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      moveInDate: workerProfile?.move_in_date ?? '',
      message: '',
      consentAcknowledged: undefined as unknown as true,
      fullName: profile.full_name ?? '',
      email: profile.email ?? '',
      phoneNumber: profile.phone_number ?? '',
      healthcareRole: workerProfile?.healthcare_role ?? '',
      employmentStatus: workerProfile?.employment_status ?? '',
      employerName: workerProfile?.employer_name ?? '',
      currentAddress: workerProfile?.current_address ?? '',
      budgetMin: workerProfile?.budget_min != null ? String(workerProfile.budget_min) : '',
      budgetMax: workerProfile?.budget_max != null ? String(workerProfile.budget_max) : '',
      hasPets: workerProfile?.has_pets ?? false,
      petDetails: workerProfile?.pet_details ?? '',
      accessibilityNeeds: workerProfile?.accessibility_needs ?? '',
    },
  });

  async function onSubmit(data: ApplicationData) {
    try {
      await createBooking({
        listingId: listing.id,
        notes: data.message,
        moveInDateRequested: data.moveInDate,
        messageToLandlord: data.message,
      });
      toast.success('Application submitted');
      router.push('/dashboard/bookings');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit application');
    }
  }

  return (
    <div className="mx-auto max-w-[1080px] px-6 py-8">
      <Link
        href="/dashboard/listings"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to listings
      </Link>

      <header className="mb-8">
        <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          Tenant application
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Apply for {listing.title ?? 'this stay'}
        </h1>
        <p className="mt-2 max-w-[58ch] text-sm text-muted-foreground md:text-base">
          We&rsquo;ve prefilled what we have on file. Edit anything that&rsquo;s changed, upload a
          recent pay stub, and submit when you&rsquo;re ready.
        </p>
      </header>

      {/* Listing summary card */}
      <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[180px_1fr] md:p-5">
        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted">
          {cover ? (
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
              No photo
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{listing.title ?? 'Listing'}</h2>
            {listing.address ? (
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                {listing.address}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              {listing.bedrooms != null && (
                <span className="inline-flex items-center gap-1">
                  <Bed className="size-3.5" />
                  {listing.bedrooms} bed
                </span>
              )}
              {listing.bathrooms != null && (
                <span className="inline-flex items-center gap-1">
                  <Bath className="size-3.5" />
                  {listing.bathrooms} bath
                </span>
              )}
              {listing.square_footage != null && (
                <span className="inline-flex items-center gap-1">
                  <Square className="size-3.5" />
                  {listing.square_footage} sqft
                </span>
              )}
            </div>
          </div>
          <p className="text-xl font-semibold tracking-tight text-foreground">
            {fmtPrice(listing.price_cents)}
            <span className="text-sm font-normal text-muted-foreground">/mo</span>
          </p>
        </div>
      </div>

      {/* Profile gate */}
      {!gateMet ? (
        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-amber-900">
                Complete your profile to submit this application
              </p>
              <ul className="space-y-1 text-xs">
                {[
                  { label: 'Government ID uploaded', met: profileGate.hasIdDocument },
                  {
                    label: 'Background check consent',
                    met: profileGate.hasBackgroundConsent,
                  },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2">
                    {item.met ? (
                      <CheckCircle2 className="size-3.5 text-green-600" />
                    ) : (
                      <AlertTriangle className="size-3.5 text-amber-600" />
                    )}
                    <span className={item.met ? 'text-green-900' : 'text-amber-900'}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 underline-offset-2 hover:underline"
              >
                Go to profile
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal info */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">Your information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.fullName?.message}>
              <Input {...register('fullName')} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <Input type="email" {...register('email')} />
            </Field>
            <Field label="Phone" error={errors.phoneNumber?.message}>
              <Input type="tel" {...register('phoneNumber')} />
            </Field>
            <Field label="Healthcare role" error={errors.healthcareRole?.message}>
              <Input placeholder="e.g. RN, Locum MD" {...register('healthcareRole')} />
            </Field>
            <Field label="Employment status" error={errors.employmentStatus?.message}>
              <Input {...register('employmentStatus')} />
            </Field>
            <Field label="Employer" error={errors.employerName?.message}>
              <Input {...register('employerName')} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Current address" error={errors.currentAddress?.message}>
                <Input {...register('currentAddress')} />
              </Field>
            </div>
          </div>
        </section>

        {/* Housing preferences */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">Housing details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Desired move-in date" error={errors.moveInDate?.message}>
              <Input type="date" {...register('moveInDate')} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Budget min ($)" error={errors.budgetMin?.message}>
                <Input type="number" min={0} {...register('budgetMin')} />
              </Field>
              <Field label="Budget max ($)" error={errors.budgetMax?.message}>
                <Input type="number" min={0} {...register('budgetMax')} />
              </Field>
            </div>
          </div>
          <Field label="Accessibility needs" error={errors.accessibilityNeeds?.message}>
            <Textarea rows={2} {...register('accessibilityNeeds')} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('hasPets')} className="size-4 rounded border-border" />
              <span>I have pet(s)</span>
            </label>
            <Field label="Pet details (if any)" error={errors.petDetails?.message}>
              <Input placeholder="Species, breed, weight" {...register('petDetails')} />
            </Field>
          </div>
        </section>

        {/* Verification */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-foreground">Verification</h2>

          <PayStubUpload initialPath={workerProfile?.pay_stub_url ?? null} />

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ShieldCheck className="size-4 text-[#1E5BBE]" />
                  Credit check
                </p>
                <p className="mt-1 max-w-[56ch] text-xs text-muted-foreground">
                  Strengthen your application by attaching a recent credit report. Equifax provides
                  Canadian residents with a free credit score and full report.
                </p>
              </div>
              <a
                href={EQUIFAX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-[#0E1A2B] px-4 text-sm font-semibold text-[#0E1A2B] transition hover:bg-[#0E1A2B] hover:text-white"
              >
                Open Equifax
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
        </section>

        {/* Message + consent */}
        <section className="space-y-4">
          <Field label="Message to landlord (optional)" error={errors.message?.message}>
            <Textarea
              rows={4}
              placeholder="Introduce yourself or ask questions about the property…"
              {...register('message')}
            />
          </Field>

          <label className="flex items-start gap-2 text-sm">
            <Checkbox
              {...register('consentAcknowledged')}
              onCheckedChange={(checked) => {
                const event = { target: { name: 'consentAcknowledged', value: checked } };
                register('consentAcknowledged').onChange(event as unknown as React.ChangeEvent);
              }}
              className="mt-0.5"
            />
            <span className="text-muted-foreground">
              I consent to credit and background screening as part of this application, and confirm
              the information above is accurate.
            </span>
          </label>
          {errors.consentAcknowledged?.message ? (
            <p className="text-sm text-destructive">{errors.consentAcknowledged.message}</p>
          ) : null}
        </section>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !gateMet} size="lg">
            {isSubmitting ? 'Submitting…' : 'Submit application'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
