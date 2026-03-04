'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { landlordBusinessSchema } from '@/lib/validations/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';

type FormData = z.infer<typeof landlordBusinessSchema>;

export function Step2Business({ onNext }: { onNext: (data: FormData) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(landlordBusinessSchema),
    defaultValues: {
      entityType: 'Individual',
      usesPropertyManagementSoftware: false,
    }
  });

  const entityType = watch('entityType');

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="entityType">Operating As</Label>
        <Select onValueChange={(val) => setValue('entityType', val as any)} defaultValue="Individual">
          <SelectTrigger>
            <SelectValue placeholder="Select entity type" />
          </SelectTrigger>
          <SelectContent>
            {['Individual', 'LLC', 'Corporation', 'Partnership'].map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.entityType && <p className="text-sm text-destructive">{errors.entityType.message}</p>}
      </div>

      {entityType !== 'Individual' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input id="businessName" {...register('businessName')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="einNumber">EIN / Business Number</Label>
            <Input id="einNumber" {...register('einNumber')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessAddress">Business Address</Label>
            <Input id="businessAddress" {...register('businessAddress')} />
          </div>
        </>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox id="usesPropertyManagementSoftware" onCheckedChange={(checked) => setValue('usesPropertyManagementSoftware', checked as boolean)} />
        <Label htmlFor="usesPropertyManagementSoftware">Do you use property management software?</Label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
