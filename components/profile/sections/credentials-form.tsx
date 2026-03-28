'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { credentialsSchema, type CredentialsData } from '@/lib/validations/profile';
import { saveCredentials } from '@/actions/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { WorkerProfile } from '@/types/database';

export function CredentialsForm({
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
  } = useForm<CredentialsData>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      healthcareRole: (workerProfile?.healthcare_role as CredentialsData['healthcareRole']) ?? undefined,
      licenseNumber: workerProfile?.license_number ?? '',
      licenseState: workerProfile?.license_state ?? '',
      licenseExpiry: workerProfile?.license_expiry ?? '',
      employmentStatus: (workerProfile?.employment_status as CredentialsData['employmentStatus']) ?? undefined,
      employerName: workerProfile?.employer_name ?? '',
      employerContact: workerProfile?.employer_contact ?? '',
    },
  });

  async function onSubmit(data: CredentialsData) {
    try {
      await saveCredentials(data);
      toast.success('Changes saved');
      onSaved();
    } catch {
      toast.error('Failed to save changes');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Healthcare Role</Label>
        <Select
          defaultValue={workerProfile?.healthcare_role ?? undefined}
          onValueChange={(val) => setValue('healthcareRole', val as CredentialsData['healthcareRole'], { shouldDirty: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {['RN', 'LPN', 'CNA', 'Medical Tech', 'Surgical Tech', 'Allied Health', 'Other'].map((role) => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.healthcareRole && <p className="text-sm text-destructive">{errors.healthcareRole.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">License Number</Label>
          <Input id="licenseNumber" {...register('licenseNumber')} />
          {errors.licenseNumber && <p className="text-sm text-destructive">{errors.licenseNumber.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="licenseState">Issuing State</Label>
          <Input id="licenseState" {...register('licenseState')} />
          {errors.licenseState && <p className="text-sm text-destructive">{errors.licenseState.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseExpiry">License Expiration</Label>
        <Input id="licenseExpiry" type="date" {...register('licenseExpiry')} />
        {errors.licenseExpiry && <p className="text-sm text-destructive">{errors.licenseExpiry.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Employment Status</Label>
        <Select
          defaultValue={workerProfile?.employment_status ?? undefined}
          onValueChange={(val) => setValue('employmentStatus', val as CredentialsData['employmentStatus'], { shouldDirty: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {['Employed', 'Travel Contract', 'Between Contracts', 'Student'].map((status) => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.employmentStatus && <p className="text-sm text-destructive">{errors.employmentStatus.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="employerName">Employer Name</Label>
          <Input id="employerName" {...register('employerName')} />
          {errors.employerName && <p className="text-sm text-destructive">{errors.employerName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="employerContact">Employer contact (verification)</Label>
          <Input
            id="employerContact"
            {...register('employerContact')}
            placeholder="Supervisor phone or work email"
            autoComplete="off"
          />
          <p className="text-xs text-muted-foreground">
            Use a contact your employer can verify — not a duplicate of the employer name above.
          </p>
          {errors.employerContact && <p className="text-sm text-destructive">{errors.employerContact.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
