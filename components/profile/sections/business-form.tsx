'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessSchema, type BusinessData } from '@/lib/validations/profile';
import { saveBusinessDetails } from '@/actions/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { LandlordProfile } from '@/types/database';

export function BusinessForm({
  landlordProfile,
  onSaved,
}: {
  landlordProfile: LandlordProfile | null;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BusinessData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      entityType: (landlordProfile?.entity_type as BusinessData['entityType']) ?? undefined,
      businessName: landlordProfile?.business_name ?? '',
      einNumber: landlordProfile?.ein_number ?? '',
      businessAddress: landlordProfile?.business_address ?? '',
    },
  });

  async function onSubmit(data: BusinessData) {
    try {
      await saveBusinessDetails(data);
      toast.success('Changes saved');
      onSaved();
    } catch {
      toast.error('Failed to save changes');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Entity Type</Label>
        <Select
          defaultValue={landlordProfile?.entity_type ?? undefined}
          onValueChange={(val) => setValue('entityType', val as BusinessData['entityType'], { shouldDirty: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {['Individual', 'LLC', 'Corporation', 'Partnership'].map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.entityType && <p className="text-sm text-destructive">{errors.entityType.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name</Label>
        <Input id="businessName" {...register('businessName')} />
        {errors.businessName && <p className="text-sm text-destructive">{errors.businessName.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="einNumber">EIN Number</Label>
          <Input id="einNumber" {...register('einNumber')} placeholder="XX-XXXXXXX" />
          {errors.einNumber && <p className="text-sm text-destructive">{errors.einNumber.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessAddress">Business Address</Label>
          <Input id="businessAddress" {...register('businessAddress')} />
          {errors.businessAddress && <p className="text-sm text-destructive">{errors.businessAddress.message}</p>}
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
