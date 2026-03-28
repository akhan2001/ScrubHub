'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { housingSchema, type HousingData } from '@/lib/validations/profile';
import { saveHousingPreferences } from '@/actions/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { WorkerProfile } from '@/types/database';

export function HousingForm({
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
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<HousingData>({
    resolver: zodResolver(housingSchema),
    defaultValues: {
      moveInDate: workerProfile?.move_in_date ?? '',
      leaseTerm: (workerProfile?.lease_term_preference as HousingData['leaseTerm']) ?? undefined,
      locationPreference: workerProfile?.location_preference ?? '',
      unitType: (workerProfile?.unit_type_preference as HousingData['unitType']) ?? undefined,
      furnished: (workerProfile?.furnished_preference as HousingData['furnished']) ?? undefined,
      budgetMin: workerProfile?.budget_min ?? 0,
      budgetMax: workerProfile?.budget_max ?? 0,
      hasPets: workerProfile?.has_pets ?? false,
      petDetails: workerProfile?.pet_details ?? '',
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form watch() is not memoizable
  const hasPets = watch('hasPets');

  async function onSubmit(data: HousingData) {
    try {
      await saveHousingPreferences(data);
      toast.success('Changes saved');
      onSaved();
    } catch {
      toast.error('Failed to save changes');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="moveInDate">Target Move-in Date</Label>
        <Input id="moveInDate" type="date" {...register('moveInDate')} />
        {errors.moveInDate && <p className="text-sm text-destructive">{errors.moveInDate.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Lease Term</Label>
          <Select
            defaultValue={workerProfile?.lease_term_preference ?? undefined}
            onValueChange={(val) => setValue('leaseTerm', val as HousingData['leaseTerm'], { shouldDirty: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              {['Short-term', 'Standard', 'Long-term', 'Flexible'].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.leaseTerm && <p className="text-sm text-destructive">{errors.leaseTerm.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="locationPreference">Preferred Location</Label>
          <Input id="locationPreference" {...register('locationPreference')} placeholder="City, Zip, or Hospital" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Unit Type</Label>
          <Select
            defaultValue={workerProfile?.unit_type_preference ?? undefined}
            onValueChange={(val) => setValue('unitType', val as HousingData['unitType'], { shouldDirty: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {['Studio', '1BR', '2BR', 'Shared', 'Flexible'].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.unitType && <p className="text-sm text-destructive">{errors.unitType.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>Furnished</Label>
          <Select
            defaultValue={workerProfile?.furnished_preference ?? undefined}
            onValueChange={(val) => setValue('furnished', val as HousingData['furnished'], { shouldDirty: true })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              {['Furnished', 'Unfurnished', 'No preference'].map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.furnished && <p className="text-sm text-destructive">{errors.furnished.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="budgetMin">Minimum monthly budget ($)</Label>
          <Input id="budgetMin" type="number" min={0} {...register('budgetMin', { valueAsNumber: true })} />
          {errors.budgetMin && <p className="text-sm text-destructive">{errors.budgetMin.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="budgetMax">Maximum monthly budget ($)</Label>
          <Input id="budgetMax" type="number" min={0} {...register('budgetMax', { valueAsNumber: true })} />
          {errors.budgetMax && <p className="text-sm text-destructive">{errors.budgetMax.message}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="hasPets"
          defaultChecked={workerProfile?.has_pets ?? false}
          onCheckedChange={(checked) => setValue('hasPets', checked as boolean, { shouldDirty: true })}
        />
        <Label htmlFor="hasPets">I have pets</Label>
      </div>

      {hasPets && (
        <div className="space-y-2">
          <Label htmlFor="petDetails">Pet Details</Label>
          <Input id="petDetails" {...register('petDetails')} placeholder="Type, weight, breed" />
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
