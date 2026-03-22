'use client';

import { unstable_rethrow } from 'next/navigation';
import { useState } from 'react';
import { createJobPost } from '@/actions/enterprise';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AddressAutocomplete } from '@/components/map/address-autocomplete';
import { toast } from 'sonner';
import { getUserFacingErrorMessage } from '@/lib/errors/user-facing-error';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types/database';

const ROLE_TYPES = ['Registered Nurse', 'Licensed Practical Nurse', 'Certified Nursing Assistant', 'Physician', 'Physical Therapist', 'Other'] as const;
const CONTRACT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Travel', 'Per Diem'] as const;

interface CreateJobPostFormProps {
  orgId: string;
  orgListings?: Pick<Listing, 'id' | 'title'>[];
  onSuccess?: () => void;
}

export function CreateJobPostForm({ orgId, orgListings = [], onSuccess }: CreateJobPostFormProps) {
  const [loading, setLoading] = useState(false);
  const [housingIncluded, setHousingIncluded] = useState(false);
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement)?.value;

    try {
      await createJobPost({
        orgId,
        title: get('title'),
        description: get('description'),
        status: get('status') as 'draft' | 'published',
        facilityName: get('facilityName') || undefined,
        location: location || undefined,
        latitude,
        longitude,
        roleType: get('roleType') || undefined,
        contractType: get('contractType') || undefined,
        contractLength: get('contractLength') || undefined,
        payRangeMin: get('payRangeMin') ? parseInt(get('payRangeMin')) : undefined,
        payRangeMax: get('payRangeMax') ? parseInt(get('payRangeMax')) : undefined,
        startDate: get('startDate') || undefined,
        housingIncluded,
        linkedListingId: housingIncluded ? get('linkedListingId') || undefined : undefined,
      });
      toast.success('Job post created');
      form.reset();
      setHousingIncluded(false);
      setLocation('');
      setLatitude(undefined);
      setLongitude(undefined);
      onSuccess?.();
    } catch (err) {
      unstable_rethrow(err);
      toast.error(getUserFacingErrorMessage(err, "We couldn't create this job post. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  const selectClass = cn(
    'flex h-[var(--input-height)] w-full rounded-[var(--input-radius)] border border-input bg-transparent px-3 py-1 text-sm shadow-xs',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none',
  );

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <section className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">Job Details</h3>
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input id="title" name="title" required placeholder="e.g. Travel RN — ICU" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="facilityName">Facility Name</Label>
            <Input id="facilityName" name="facilityName" placeholder="e.g. Memorial Hospital" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roleType">Role Type</Label>
            <select id="roleType" name="roleType" className={selectClass}>
              <option value="">Select...</option>
              {ROLE_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <AddressAutocomplete
            value={location}
            onSelect={(s) => {
              setLocation(s.address);
              setLatitude(s.latitude);
              setLongitude(s.longitude);
            }}
            placeholder="Facility address..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} required placeholder="Job duties, requirements, benefits..." />
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">Contract & Pay</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="contractType">Contract Type</Label>
            <select id="contractType" name="contractType" className={selectClass}>
              <option value="">Select...</option>
              {CONTRACT_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractLength">Contract Length</Label>
            <Input id="contractLength" name="contractLength" placeholder="e.g. 13 weeks" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" name="startDate" type="date" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="payRangeMin">Pay Range Min ($/hr)</Label>
            <Input id="payRangeMin" name="payRangeMin" type="number" min={0} placeholder="40" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payRangeMax">Pay Range Max ($/hr)</Label>
            <Input id="payRangeMax" name="payRangeMax" type="number" min={0} placeholder="65" />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h3 className="text-base font-semibold text-slate-900">Housing</h3>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={housingIncluded}
            onCheckedChange={(v) => setHousingIncluded(v === true)}
          />
          Housing included with this position
        </label>
        {housingIncluded && orgListings.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="linkedListingId">Linked Listing</Label>
            <select id="linkedListingId" name="linkedListingId" className={selectClass}>
              <option value="">Select a listing...</option>
              {orgListings.map((l) => (
                <option key={l.id} value={l.id}>{l.title}</option>
              ))}
            </select>
          </div>
        )}
      </section>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Post Status</Label>
          <select id="status" name="status" className={selectClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </section>

      <Button disabled={loading} type="submit">
        {loading ? 'Creating...' : 'Create Job Post'}
      </Button>
    </form>
  );
}
