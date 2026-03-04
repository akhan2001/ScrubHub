'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workerCredentialsSchema } from '@/lib/validations/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';

type FormData = z.infer<typeof workerCredentialsSchema>;

export function Step2Credentials({ onNext }: { onNext: (data: FormData) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(workerCredentialsSchema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="healthcareRole">Healthcare Role</Label>
        <Select onValueChange={(val) => setValue('healthcareRole', val as any)}>
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

      <div className="grid grid-cols-2 gap-4">
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
        <Label htmlFor="licenseExpirationDate">Expiration Date</Label>
        <Input id="licenseExpirationDate" type="date" {...register('licenseExpirationDate')} />
        {errors.licenseExpirationDate && <p className="text-sm text-destructive">{errors.licenseExpirationDate.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseDocumentUrl">License Document</Label>
        <Input id="licenseDocumentUrl" type="text" {...register('licenseDocumentUrl')} placeholder="Upload URL placeholder" />
        {errors.licenseDocumentUrl && <p className="text-sm text-destructive">{errors.licenseDocumentUrl.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="employmentStatus">Employment Status</Label>
        <Select onValueChange={(val) => setValue('employmentStatus', val as any)}>
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

      <div className="space-y-2">
        <Label htmlFor="employerName">Employer Name</Label>
        <Input id="employerName" {...register('employerName')} />
        {errors.employerName && <p className="text-sm text-destructive">{errors.employerName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="employerContact">Employer Contact</Label>
        <Input id="employerContact" {...register('employerContact')} placeholder="Name + Phone/Email" />
        {errors.employerContact && <p className="text-sm text-destructive">{errors.employerContact.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
