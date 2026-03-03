'use server';

import { redirect } from 'next/navigation';
import { requireRole } from '@/server/guards/require-role';
import { createListing as createListingService } from '@/server/services/listings.service';

export type CreateListingInput = {
  title: string;
  description?: string | null;
  address?: string | null;
  price_cents?: number | null;
  status?: 'draft' | 'published';
};

export async function createListing(formData: CreateListingInput) {
  const user = await requireRole('landlord');
  await createListingService(user.id, formData);
  redirect('/dashboard/landlord/listings');
}
