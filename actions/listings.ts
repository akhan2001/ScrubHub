'use server';

import { redirect } from 'next/navigation';
import { requireVerifiedRole } from '@/server/guards/require-verified-role';
import { createListing as createListingService } from '@/server/services/listings.service';
import { z } from 'zod';
import { ValidationError } from '@/server/errors/app-error';

export type CreateListingInput = {
  title: string;
  description?: string | null;
  address?: string | null;
  price_cents?: number | null;
  status?: 'draft' | 'published';
};

const createListingSchema = z.object({
  title: z.string().min(3).max(180),
  description: z.string().max(4000).nullable().optional(),
  address: z.string().max(300).nullable().optional(),
  price_cents: z.number().int().nonnegative().nullable().optional(),
  status: z.enum(['draft', 'published']).optional(),
});

export async function createListing(formData: CreateListingInput) {
  const parsed = createListingSchema.safeParse(formData);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.message);
  }
  const user = await requireVerifiedRole('landlord', { onFailure: 'throw' });
  await createListingService(user.id, parsed.data);
  redirect('/dashboard/landlord/listings');
}
