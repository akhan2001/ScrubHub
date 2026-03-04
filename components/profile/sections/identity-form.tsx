'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { identitySchema, type IdentityData } from '@/lib/validations/profile';
import { saveIdentityVerification } from '@/actions/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import type { WorkerProfile } from '@/types/database';

export function IdentityForm({
  workerProfile,
  onSaved,
}: {
  workerProfile: WorkerProfile | null;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<IdentityData>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      idDocumentUrl: workerProfile?.id_document_url ?? '',
      ssnLast4: workerProfile?.ssn_last_4 ?? '',
      backgroundCheckConsent: workerProfile?.background_check_consent ?? false,
    },
  });

  async function onSubmit(data: IdentityData) {
    try {
      await saveIdentityVerification(data);
      toast.success('Changes saved');
      onSaved();
    } catch {
      toast.error('Failed to save changes');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="idDocumentUrl">Government ID Document</Label>
        <Input id="idDocumentUrl" {...register('idDocumentUrl')} placeholder="Upload URL or document path" />
        {errors.idDocumentUrl && <p className="text-sm text-destructive">{errors.idDocumentUrl.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ssnLast4">SSN (Last 4 Digits)</Label>
        <Input id="ssnLast4" {...register('ssnLast4')} maxLength={4} placeholder="1234" />
        {errors.ssnLast4 && <p className="text-sm text-destructive">{errors.ssnLast4.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="backgroundCheckConsent"
          defaultChecked={workerProfile?.background_check_consent ?? false}
          onCheckedChange={(checked) => setValue('backgroundCheckConsent', checked === true, { shouldDirty: true })}
        />
        <Label htmlFor="backgroundCheckConsent" className="text-sm">
          I consent to a background check as part of the verification process
        </Label>
      </div>
      {errors.backgroundCheckConsent && (
        <p className="text-sm text-destructive">{errors.backgroundCheckConsent.message}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
