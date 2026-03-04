'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { landlordListingSchema } from '@/lib/validations/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';

type FormData = z.infer<typeof landlordListingSchema>;

const LEASE_TERMS = ['Short-term', 'Standard', 'Long-term'];

export function Step4Listing({ onNext }: { onNext: (data: FormData) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(landlordListingSchema),
    defaultValues: {
      leaseTerms: [],
      unitPhotos: ['https://placeholder.com/unit1.jpg'],
      furnished: false,
      petsAllowed: false,
    }
  });

  const selectedTerms = watch('leaseTerms') || [];

  const toggleTerm = (term: string) => {
    if (selectedTerms.includes(term)) {
      setValue('leaseTerms', selectedTerms.filter(t => t !== term));
    } else {
      setValue('leaseTerms', [...selectedTerms, term]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="unitNumber">Unit Number</Label>
          <Input id="unitNumber" {...register('unitNumber')} />
          {errors.unitNumber && <p className="text-sm text-destructive">{errors.unitNumber.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Listing Title</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" type="number" {...register('bedrooms', { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" type="number" {...register('bathrooms', { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="squareFootage">Sq Ft (Optional)</Label>
          <Input id="squareFootage" type="number" {...register('squareFootage', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyRent">Monthly Rent</Label>
          <Input id="monthlyRent" type="number" {...register('monthlyRent', { valueAsNumber: true })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="securityDeposit">Security Deposit</Label>
          <Input id="securityDeposit" type="number" {...register('securityDeposit', { valueAsNumber: true })} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="availableDate">Available Date</Label>
        <Input id="availableDate" type="date" {...register('availableDate')} />
        {errors.availableDate && <p className="text-sm text-destructive">{errors.availableDate.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Lease Terms</Label>
        <div className="flex gap-4">
          {LEASE_TERMS.map((term) => (
            <div key={term} className="flex items-center space-x-2">
              <Checkbox 
                id={`term-${term}`} 
                checked={selectedTerms.includes(term)}
                onCheckedChange={() => toggleTerm(term)}
              />
              <Label htmlFor={`term-${term}`}>{term}</Label>
            </div>
          ))}
        </div>
        {errors.leaseTerms && <p className="text-sm text-destructive">{errors.leaseTerms.message}</p>}
      </div>

      <div className="flex gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="furnished" onCheckedChange={(checked) => setValue('furnished', checked as boolean)} />
          <Label htmlFor="furnished">Furnished</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="petsAllowed" onCheckedChange={(checked) => setValue('petsAllowed', checked as boolean)} />
          <Label htmlFor="petsAllowed">Pets Allowed</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Unit Photos</Label>
        <div className="rounded-md border border-dashed p-8 text-center text-muted-foreground">
          Upload photos placeholder
        </div>
        <input type="hidden" {...register('unitPhotos')} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
