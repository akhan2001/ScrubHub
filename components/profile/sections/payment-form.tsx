'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSchema, type PaymentData } from '@/lib/validations/profile';
import { savePaymentMethod } from '@/actions/profile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CreditCard } from 'lucide-react';
import type { WorkerProfile } from '@/types/database';

export function PaymentForm({
  workerProfile,
  onSaved,
}: {
  workerProfile: WorkerProfile | null;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
  });

  async function onSubmit(data: PaymentData) {
    try {
      await savePaymentMethod(data);
      toast.success('Changes saved');
      onSaved();
    } catch {
      toast.error('Failed to save changes');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4">
        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CreditCard className="size-4 shrink-0" />
            <span>Stripe card vault is not wired yet. Saving stores only the last four digits on your profile.</span>
          </div>
          {workerProfile?.payment_method_last4 ? (
            <p className="pl-6 text-xs text-foreground">
              Card on file: <span className="font-mono">•••• {workerProfile.payment_method_last4}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input id="cardNumber" {...register('cardNumber')} placeholder="4242 4242 4242 4242" />
        {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Expiry Date</Label>
          <Input id="expiryDate" {...register('expiryDate')} placeholder="MM/YY" />
          {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input id="cvc" {...register('cvc')} placeholder="123" maxLength={4} />
          {errors.cvc && <p className="text-sm text-destructive">{errors.cvc.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
