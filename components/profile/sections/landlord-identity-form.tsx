'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { landlordIdentitySchema, type LandlordIdentityData } from '@/lib/validations/profile';
import { saveLandlordIdentity } from '@/actions/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { LandlordProfile } from '@/types/database';

export function LandlordIdentityForm({
  landlordProfile,
  onSaved,
}: {
  landlordProfile: LandlordProfile | null;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<LandlordIdentityData>({
    resolver: zodResolver(landlordIdentitySchema),
    defaultValues: {
      identityDocumentUrl: landlordProfile?.identity_document_url ?? '',
    },
  });

  async function onSubmit(data: LandlordIdentityData) {
    try {
      await saveLandlordIdentity(data);
      toast.success('Changes saved');
      onSaved();
    } catch {
      toast.error('Failed to save changes');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identityDocumentUrl">Identity Document</Label>
        <Input id="identityDocumentUrl" {...register('identityDocumentUrl')} placeholder="Upload URL or document path" />
        {errors.identityDocumentUrl && <p className="text-sm text-destructive">{errors.identityDocumentUrl.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
