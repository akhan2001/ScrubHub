'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { createBooking } from '@/actions/bookings';

const applicationSchema = z.object({
  moveInDate: z.string().refine((v) => !isNaN(Date.parse(v)), 'Invalid date'),
  message: z.string().max(1000).optional(),
  consentAcknowledged: z.literal(true, { message: 'You must acknowledge the consent terms' }),
});

type ApplicationData = z.infer<typeof applicationSchema>;

interface ApplicationFormProps {
  listingId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function ApplicationForm({ listingId, onCancel, onSuccess }: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      moveInDate: '',
      message: '',
      consentAcknowledged: undefined as unknown as true,
    },
  });

  async function onSubmit(data: ApplicationData) {
    try {
      await createBooking({
        listingId,
        notes: data.message,
        moveInDateRequested: data.moveInDate,
        messageToLandlord: data.message,
      });
      toast.success('Application submitted successfully');
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit application');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-lg border border-border bg-card p-4">
      <h3 className="text-base font-semibold">Submit Application</h3>

      <div className="space-y-2">
        <Label htmlFor="moveInDate">Desired Move-in Date</Label>
        <Input id="moveInDate" type="date" {...register('moveInDate')} />
        {errors.moveInDate && (
          <p className="text-sm text-destructive">{errors.moveInDate.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message to Landlord (optional)</Label>
        <Textarea
          id="message"
          {...register('message')}
          rows={3}
          placeholder="Introduce yourself or ask questions about the property..."
        />
      </div>

      <label className="flex items-start gap-2 text-sm">
        <Checkbox
          {...register('consentAcknowledged')}
          onCheckedChange={(checked) => {
            const event = { target: { name: 'consentAcknowledged', value: checked } };
            register('consentAcknowledged').onChange(event as unknown as React.ChangeEvent);
          }}
          className="mt-0.5"
        />
        <span className="text-muted-foreground">
          I consent to screening checks (credit, background) as part of this application.
        </span>
      </label>
      {errors.consentAcknowledged && (
        <p className="text-sm text-destructive">{errors.consentAcknowledged.message}</p>
      )}

      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </div>
    </form>
  );
}
