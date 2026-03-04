'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orgInfoSchema, type OrgInfoData } from '@/lib/validations/profile';
import { saveOrgInfo } from '@/actions/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Organization } from '@/types/database';

export function OrgForm({
  organization,
  onSaved,
}: {
  organization: Organization | null;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<OrgInfoData>({
    resolver: zodResolver(orgInfoSchema),
    defaultValues: {
      name: organization?.name ?? '',
      domain: organization?.domain ?? '',
    },
  });

  async function onSubmit(data: OrgInfoData) {
    try {
      await saveOrgInfo(data);
      toast.success('Changes saved');
      onSaved();
    } catch {
      toast.error('Failed to save changes');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="orgName">Organization Name</Label>
        <Input id="orgName" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="orgDomain">Domain</Label>
        <Input id="orgDomain" {...register('domain')} placeholder="example.com" />
        {errors.domain && <p className="text-sm text-destructive">{errors.domain.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
