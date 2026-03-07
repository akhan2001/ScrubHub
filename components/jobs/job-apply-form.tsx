'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FileText, Loader2 } from 'lucide-react';
import { useJobApply } from '@/hooks/use-job-apply';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  resumeFile: z.custom<FileList>((val) => val instanceof FileList && val.length > 0, 'Resume is required'),
  coverMessage: z.string().max(2000).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface JobApplyFormProps {
  jobId: string;
  defaultEmail?: string;
  defaultPhone?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function JobApplyForm({
  jobId,
  defaultEmail = '',
  defaultPhone = '',
  onSuccess,
  onCancel,
}: JobApplyFormProps) {
  const { apply, isSubmitting } = useJobApply(jobId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: defaultEmail,
      phone: defaultPhone,
      coverMessage: '',
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const file = data.resumeFile[0];
      await apply({
        email: data.email,
        phone: data.phone,
        resumeUrl: '',
        coverMessage: data.coverMessage,
        resumeFile: file,
      });
      toast.success('Application submitted successfully');
      onSuccess?.();
    } catch {
      toast.error('Failed to submit application. Please try again.');
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 rounded-lg border border-border bg-card p-4"
    >
      <h3 className="text-base font-semibold">Apply for this position</h3>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} placeholder="you@example.com" />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" {...register('phone')} placeholder="(555) 123-4567" />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="resume">Resume (PDF or Word)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            {...register('resumeFile')}
            className="file:mr-2 file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
          />
          <FileText className="size-4 text-muted-foreground shrink-0" />
        </div>
        {errors.resumeFile && (
          <p className="text-sm text-destructive">{errors.resumeFile.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverMessage">Cover message (optional)</Label>
        <Textarea
          id="coverMessage"
          {...register('coverMessage')}
          rows={3}
          placeholder="Introduce yourself or highlight relevant experience..."
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit application'
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
