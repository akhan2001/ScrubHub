'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workerBackgroundSchema } from '@/lib/validations/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';

type FormData = z.infer<typeof workerBackgroundSchema>;

export function Step5Background({ onNext }: { onNext: (data: FormData) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(workerBackgroundSchema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="rounded-md bg-muted p-4 text-sm">
        <h3 className="font-semibold mb-2">Background Check Disclosure</h3>
        <p className="mb-2">
          We use a third-party provider to verify your identity and check for criminal history, evictions, and credit standing.
        </p>
        <p>
          This check is required to proceed with lease signing on ScrubHub.
        </p>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox id="consent" onCheckedChange={(checked) => setValue('consent', checked as true)} />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="consent">
            I consent to a background check and agree to the terms of service.
          </Label>
          {errors.consent && <p className="text-sm text-destructive">{errors.consent.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="idDocumentUrl">Government-Issued ID (Front + Back)</Label>
        <Input id="idDocumentUrl" type="text" {...register('idDocumentUrl')} placeholder="Upload URL placeholder" />
        {errors.idDocumentUrl && <p className="text-sm text-destructive">{errors.idDocumentUrl.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ssnLast4">SSN / SIN (Last 4 Digits)</Label>
        <Input id="ssnLast4" maxLength={4} {...register('ssnLast4')} placeholder="1234" />
        {errors.ssnLast4 && <p className="text-sm text-destructive">{errors.ssnLast4.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Initiate Check' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
