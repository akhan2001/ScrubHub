'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workerHousingSchema } from '@/lib/validations/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';

type FormData = z.infer<typeof workerHousingSchema>;

export function Step3Housing({ onNext }: { onNext: (data: FormData) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(workerHousingSchema),
    defaultValues: {
      hasPets: false,
    }
  });

  const hasPets = watch('hasPets');

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="moveInDate">Target Move-in Date</Label>
        <Input id="moveInDate" type="date" {...register('moveInDate')} />
        {errors.moveInDate && <p className="text-sm text-destructive">{errors.moveInDate.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="leaseTerm">Lease Term Preference</Label>
        <Select onValueChange={(val) => setValue('leaseTerm', val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select term" />
          </SelectTrigger>
          <SelectContent>
            {['Short-term', 'Standard', 'Long-term', 'Flexible'].map((term) => (
              <SelectItem key={term} value={term}>{term}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.leaseTerm && <p className="text-sm text-destructive">{errors.leaseTerm.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="locationPreference">Preferred Location</Label>
        <Input id="locationPreference" {...register('locationPreference')} placeholder="City, Zip, or Hospital" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unitType">Unit Type Preference</Label>
        <Select onValueChange={(val) => setValue('unitType', val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {['Studio', '1BR', '2BR', 'Shared', 'Flexible'].map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.unitType && <p className="text-sm text-destructive">{errors.unitType.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="furnished">Furnished Preference</Label>
        <Select onValueChange={(val) => setValue('furnished', val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select preference" />
          </SelectTrigger>
          <SelectContent>
            {['Furnished', 'Unfurnished', 'No preference'].map((opt) => (
              <SelectItem key={opt} value={opt}>{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.furnished && <p className="text-sm text-destructive">{errors.furnished.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budgetMin">Min Budget</Label>
          <Input id="budgetMin" type="number" {...register('budgetMin', { valueAsNumber: true })} />
          {errors.budgetMin && <p className="text-sm text-destructive">{errors.budgetMin.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="budgetMax">Max Budget</Label>
          <Input id="budgetMax" type="number" {...register('budgetMax', { valueAsNumber: true })} />
          {errors.budgetMax && <p className="text-sm text-destructive">{errors.budgetMax.message}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="hasPets" onCheckedChange={(checked) => setValue('hasPets', checked as boolean)} />
        <Label htmlFor="hasPets">Do you have pets?</Label>
      </div>

      {hasPets && (
        <div className="space-y-2">
          <Label htmlFor="petDetails">Pet Details</Label>
          <Input id="petDetails" {...register('petDetails')} placeholder="Type, weight, breed" />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="accessibilityNeeds">Accessibility Needs (Optional)</Label>
        <Input id="accessibilityNeeds" {...register('accessibilityNeeds')} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
