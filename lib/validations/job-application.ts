import { z } from 'zod';

export const jobApplicationSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  resumeUrl: z.string().min(1, 'Resume is required'),
  coverMessage: z.string().max(2000).optional(),
});

export type JobApplicationData = z.infer<typeof jobApplicationSchema>;
