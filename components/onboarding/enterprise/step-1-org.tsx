'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enterpriseOrgSchema } from '@/lib/validations/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';

type FormData = z.infer<typeof enterpriseOrgSchema>;

export function Step1Org({ onNext }: { onNext: (data: FormData) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(enterpriseOrgSchema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="organizationName">Organization Name</Label>
        <Input id="organizationName" {...register('organizationName')} />
        {errors.organizationName && <p className="text-sm text-destructive">{errors.organizationName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizationType">Organization Type</Label>
        <Select onValueChange={(val) => setValue('organizationType', val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {['Hospital System', 'Staffing Agency', 'Property Management Firm', 'Other'].map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.organizationType && <p className="text-sm text-destructive">{errors.organizationType.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="industryFocus">Industry Focus</Label>
        <Select onValueChange={(val) => setValue('industryFocus', val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select focus" />
          </SelectTrigger>
          <SelectContent>
            {['Healthcare', 'Mixed', 'Other'].map((focus) => (
              <SelectItem key={focus} value={focus}>{focus}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.industryFocus && <p className="text-sm text-destructive">{errors.industryFocus.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertiesManaged">Properties Managed</Label>
        <Select onValueChange={(val) => setValue('propertiesManaged', val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {['1-10', '11-50', '51-200', '200+'].map((range) => (
              <SelectItem key={range} value={range}>{range}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.propertiesManaged && <p className="text-sm text-destructive">{errors.propertiesManaged.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website (Optional)</Label>
        <Input id="website" {...register('website')} placeholder="https://" />
        {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="einNumber">EIN / Business Number</Label>
        <Input id="einNumber" {...register('einNumber')} />
        {errors.einNumber && <p className="text-sm text-destructive">{errors.einNumber.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="billingAddress">Billing Address</Label>
        <Input id="billingAddress" {...register('billingAddress')} />
        {errors.billingAddress && <p className="text-sm text-destructive">{errors.billingAddress.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
