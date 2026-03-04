'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workerRentalHistorySchema } from '@/lib/validations/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';

type FormData = z.infer<typeof workerRentalHistorySchema>;

export function Step4Rental({ onNext }: { onNext: (data: FormData) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(workerRentalHistorySchema),
    defaultValues: {
      evictionHistory: false,
      brokenLeaseHistory: false,
    }
  });

  const evictionHistory = watch('evictionHistory');
  const brokenLeaseHistory = watch('brokenLeaseHistory');

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentAddress">Current Address</Label>
        <Input id="currentAddress" {...register('currentAddress')} />
        {errors.currentAddress && <p className="text-sm text-destructive">{errors.currentAddress.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentLandlord">Current Landlord (Name + Contact)</Label>
        <Input id="currentLandlord" {...register('currentLandlord')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousAddress">Previous Address (if {'<'} 2 years)</Label>
        <Input id="previousAddress" {...register('previousAddress')} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousLandlord">Previous Landlord (Name + Contact)</Label>
        <Input id="previousLandlord" {...register('previousLandlord')} />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="evictionHistory" onCheckedChange={(checked) => setValue('evictionHistory', checked as boolean)} />
        <Label htmlFor="evictionHistory">Have you ever been evicted?</Label>
      </div>

      {evictionHistory && (
        <div className="space-y-2">
          <Label htmlFor="evictionDetails">Explanation</Label>
          <Input id="evictionDetails" {...register('evictionDetails')} />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox id="brokenLeaseHistory" onCheckedChange={(checked) => setValue('brokenLeaseHistory', checked as boolean)} />
        <Label htmlFor="brokenLeaseHistory">Have you ever broken a lease?</Label>
      </div>

      {brokenLeaseHistory && (
        <div className="space-y-2">
          <Label htmlFor="brokenLeaseDetails">Explanation</Label>
          <Input id="brokenLeaseDetails" {...register('brokenLeaseDetails')} />
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
