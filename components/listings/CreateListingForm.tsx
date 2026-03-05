'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createListingSchema, LEASE_TERM_OPTIONS, type CreateListingData } from '@/lib/validations/listing';
import { createListing, updateListing } from '@/actions/listings';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AddressAutocomplete } from '@/components/map/address-autocomplete';
import { PhotoUpload } from '@/components/listings/photo-upload';
import { AmenityTags } from '@/components/listings/amenity-tags';
import { toast } from 'sonner';
import type { Listing } from '@/types/database';

interface ListingFormProps {
  initialData?: Listing;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ListingForm({ initialData, onSuccess, onCancel }: ListingFormProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateListingData>({
    resolver: zodResolver(createListingSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description ?? '',
          address: initialData.address ?? '',
          latitude: initialData.latitude ?? undefined,
          longitude: initialData.longitude ?? undefined,
          unitNumber: initialData.unit_number ?? '',
          bedrooms: initialData.bedrooms ?? undefined,
          bathrooms: initialData.bathrooms ?? undefined,
          squareFootage: initialData.square_footage ?? undefined,
          monthlyRent: initialData.price_cents != null ? initialData.price_cents / 100 : (undefined as unknown as number),
          depositAmount: initialData.deposit_amount_cents != null ? initialData.deposit_amount_cents / 100 : undefined,
          leaseTerms: initialData.lease_terms ?? [],
          isFurnished: initialData.is_furnished,
          arePetsAllowed: initialData.are_pets_allowed,
          amenities: (initialData.amenities as string[]) ?? [],
          images: initialData.images ?? [],
          availableDate: initialData.available_date ?? '',
          status: initialData.status === 'archived' ? 'draft' : initialData.status,
        }
      : {
          title: '',
          description: '',
          address: '',
          unitNumber: '',
          bedrooms: undefined,
          bathrooms: undefined,
          squareFootage: undefined,
          monthlyRent: undefined as unknown as number,
          depositAmount: undefined,
          leaseTerms: [],
          isFurnished: false,
          arePetsAllowed: false,
          amenities: [],
          images: [],
          availableDate: '',
          status: 'draft',
        },
  });

  const leaseTerms = watch('leaseTerms');

  async function onSubmit(data: CreateListingData) {
    try {
      if (isEditing) {
        await updateListing(initialData.id, data);
        toast.success('Changes saved');
        onSuccess?.();
      } else {
        await createListing(data);
        toast.success('Listing created');
        onSuccess?.();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Failed to ${isEditing ? 'update' : 'create'} listing`);
    }
  }

  function toggleLeaseTerm(term: string) {
    const current = leaseTerms ?? [];
    const next = current.includes(term)
      ? current.filter((t) => t !== term)
      : [...current, term];
    setValue('leaseTerms', next, { shouldValidate: true });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* --- Location --- */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Location</h3>
        <div className="space-y-2">
          <Label>Address</Label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <AddressAutocomplete
                value={field.value}
                onSelect={(s) => {
                  setValue('address', s.address, { shouldValidate: true });
                  setValue('latitude', s.latitude);
                  setValue('longitude', s.longitude);
                }}
              />
            )}
          />
          {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="unitNumber">Unit Number</Label>
          <Input id="unitNumber" {...register('unitNumber')} placeholder="e.g. Apt 4B" />
        </div>
      </section>

      <Separator />

      {/* --- Property Details --- */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Property Details</h3>
        <div className="space-y-2">
          <Label htmlFor="title">Listing Title</Label>
          <Input id="title" {...register('title')} placeholder="Stylish 2BR near hospital" />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} rows={4} placeholder="Describe the property..." />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input id="bedrooms" type="number" min={0} step={1} {...register('bedrooms', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input id="bathrooms" type="number" min={0} step={0.5} {...register('bathrooms', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="squareFootage">Square Footage</Label>
            <Input id="squareFootage" type="number" min={0} {...register('squareFootage', { valueAsNumber: true })} />
          </div>
        </div>
      </section>

      <Separator />

      {/* --- Pricing --- */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Pricing</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="monthlyRent">Monthly Rent ($)</Label>
            <Input id="monthlyRent" type="number" min={0} {...register('monthlyRent', { valueAsNumber: true })} placeholder="1800" />
            {errors.monthlyRent && <p className="text-sm text-destructive">{errors.monthlyRent.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="depositAmount">Security Deposit ($)</Label>
            <Input id="depositAmount" type="number" min={0} {...register('depositAmount', { valueAsNumber: true })} placeholder="1800" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Lease Terms</Label>
          <div className="flex flex-wrap gap-2">
            {LEASE_TERM_OPTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => toggleLeaseTerm(term)}
                className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                  leaseTerms?.includes(term)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                {term}
              </button>
            ))}
          </div>
          {errors.leaseTerms && <p className="text-sm text-destructive">{errors.leaseTerms.message}</p>}
        </div>
      </section>

      <Separator />

      {/* --- Features --- */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Features</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <label className="flex items-center gap-2 text-sm">
            <Controller
              name="isFurnished"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            Furnished
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Controller
              name="arePetsAllowed"
              control={control}
              render={({ field }) => (
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            Pets Allowed
          </label>
        </div>
        <div className="space-y-2">
          <Label>Amenities</Label>
          <Controller
            name="amenities"
            control={control}
            render={({ field }) => (
              <AmenityTags value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </section>

      <Separator />

      {/* --- Photos --- */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Photos</h3>
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <PhotoUpload value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.images && <p className="text-sm text-destructive">{errors.images.message}</p>}
      </section>

      <Separator />

      {/* --- Availability --- */}
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-foreground">Availability</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="availableDate">Available Date</Label>
            <Input id="availableDate" type="date" {...register('availableDate')} />
            {errors.availableDate && <p className="text-sm text-destructive">{errors.availableDate.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Listing Status</Label>
            <select
              id="status"
              {...register('status')}
              className="flex h-[var(--input-height)] w-full rounded-[var(--input-radius)] border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditing ? 'Saving...' : 'Creating...'
            : isEditing ? 'Save Changes' : 'Create Listing'}
        </Button>
      </div>
    </form>
  );
}

/** @deprecated Use ListingForm instead */
export const CreateListingForm = ListingForm;
