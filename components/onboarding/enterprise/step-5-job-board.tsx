'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { enterpriseJobPostSchema } from '@/lib/validations/onboarding';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { z } from 'zod';

type FormData = z.infer<typeof enterpriseJobPostSchema>;

export function Step5JobBoard({ onNext }: { onNext: (data: FormData | null) => void }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(enterpriseJobPostSchema),
    defaultValues: {
      housingIncluded: false,
    }
  });

  const housingIncluded = watch('housingIncluded');

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <div className="rounded-md bg-muted p-4 text-sm mb-4">
        <p>Post your first healthcare position. You can also skip this and post from the dashboard.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Position Title</Label>
        <Input id="title" {...register('title')} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="facilityName">Facility Name</Label>
          <Input id="facilityName" {...register('facilityName')} />
          {errors.facilityName && <p className="text-sm text-destructive">{errors.facilityName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register('location')} />
          {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="roleType">Role Type</Label>
          <Select onValueChange={(val) => setValue('roleType', val as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {['RN', 'LPN', 'CNA', 'Tech', 'Allied Health', 'Other'].map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.roleType && <p className="text-sm text-destructive">{errors.roleType.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contractType">Contract Type</Label>
          <Select onValueChange={(val) => setValue('contractType', val as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select contract" />
            </SelectTrigger>
            <SelectContent>
              {['Full-time', 'Part-time', 'Travel Contract', 'Per Diem'].map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.contractType && <p className="text-sm text-destructive">{errors.contractType.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contractLength">Contract Length (Optional)</Label>
          <Input id="contractLength" {...register('contractLength')} placeholder="e.g. 13 weeks" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payRange">Pay Range (Optional)</Label>
          <Input id="payRange" {...register('payRange')} placeholder="$2000-3000/wk" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input id="startDate" type="date" {...register('startDate')} />
        {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="housingIncluded" onCheckedChange={(checked) => setValue('housingIncluded', checked as boolean)} />
        <Label htmlFor="housingIncluded">Housing included?</Label>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost" onClick={() => onNext(null)}>
          Skip
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Post Job'}
        </Button>
      </div>
    </form>
  );
}
