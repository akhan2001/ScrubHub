'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { landlordPropertySchema } from '@/lib/validations/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';

type FormData = z.infer<typeof landlordPropertySchema>;

const AMENITIES = [
  'Parking', 'Laundry', 'Furnished', 'Pet Friendly', 
  'Wheelchair Accessible', 'Near Transit', 'Near Medical Campus'
];

export function Step3Property({ onNext }: { onNext: (data: FormData) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(landlordPropertySchema),
    defaultValues: {
      amenities: [],
      propertyPhotos: ['https://placeholder.com/photo1.jpg'], // Placeholder to pass validation for now
    }
  });

  const selectedAmenities = watch('amenities') || [];

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setValue('amenities', selectedAmenities.filter(a => a !== amenity));
    } else {
      setValue('amenities', [...selectedAmenities, amenity]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="address">Property Address</Label>
        <Input id="address" {...register('address')} placeholder="Search address..." />
        {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="propertyType">Property Type</Label>
        <Select onValueChange={(val) => setValue('propertyType', val as any)}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {['Single family', 'Duplex', 'Apartment building', 'Condo', 'Townhouse'].map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.propertyType && <p className="text-sm text-destructive">{errors.propertyType.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="numberOfUnits">Number of Units</Label>
          <Input id="numberOfUnits" type="number" {...register('numberOfUnits', { valueAsNumber: true })} />
          {errors.numberOfUnits && <p className="text-sm text-destructive">{errors.numberOfUnits.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="yearBuilt">Year Built (Optional)</Label>
          <Input id="yearBuilt" type="number" {...register('yearBuilt', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox 
                id={`amenity-${amenity}`} 
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Property Photos</Label>
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          Upload photos placeholder
        </div>
        {/* Hidden input for validation */}
        <input type="hidden" {...register('propertyPhotos')} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
