'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireVerifiedRole } from '@/server/guards/require-verified-role';
import { requireRole } from '@/server/guards/require-role';
import { requirePlan } from '@/server/guards/require-plan';
import {
  createListing as createListingService,
  updateListing as updateListingService,
  deleteListing as deleteListingService,
  archiveListing as archiveListingService,
  unpublishListing as unpublishListingService,
} from '@/server/services/listings.service';
import { createListingSchema, type CreateListingData } from '@/lib/validations/listing';
import { ValidationError } from '@/server/errors/app-error';

export async function createListing(formData: CreateListingData) {
  const parsed = createListingSchema.safeParse(formData);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Validation failed');
  }

  const d = parsed.data;
  const user = await requireRole('landlord');

  if (d.status === 'published') {
    await requireVerifiedRole('landlord', { onFailure: 'throw' });
    await requirePlan('starter', { action: 'publish_listing' });
  }

  await createListingService(user.id, {
    title: d.title,
    description: d.description ?? null,
    address: d.address,
    price_cents: Math.round(d.monthlyRent * 100),
    status: d.status,
    unit_number: d.unitNumber ?? null,
    bedrooms: d.bedrooms ?? null,
    bathrooms: d.bathrooms ?? null,
    square_footage: d.squareFootage ?? null,
    deposit_amount_cents: d.depositAmount ? Math.round(d.depositAmount * 100) : null,
    available_date: d.availableDate,
    lease_terms: d.leaseTerms,
    is_furnished: d.isFurnished,
    are_pets_allowed: d.arePetsAllowed,
    images: d.images,
    amenities: d.amenities,
    latitude: d.latitude ?? null,
    longitude: d.longitude ?? null,
  });

  redirect('/dashboard/landlord/listings');
}

export async function updateListing(listingId: string, formData: CreateListingData) {
  const parsed = createListingSchema.safeParse(formData);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues[0]?.message ?? 'Validation failed');
  }

  const d = parsed.data;
  const user = await requireRole('landlord');

  if (d.status === 'published') {
    await requireVerifiedRole('landlord', { onFailure: 'throw' });
  }

  await updateListingService(user.id, listingId, {
    title: d.title,
    description: d.description ?? null,
    address: d.address,
    price_cents: Math.round(d.monthlyRent * 100),
    status: d.status,
    unit_number: d.unitNumber ?? null,
    bedrooms: d.bedrooms ?? null,
    bathrooms: d.bathrooms ?? null,
    square_footage: d.squareFootage ?? null,
    deposit_amount_cents: d.depositAmount ? Math.round(d.depositAmount * 100) : null,
    available_date: d.availableDate,
    lease_terms: d.leaseTerms,
    is_furnished: d.isFurnished,
    are_pets_allowed: d.arePetsAllowed,
    images: d.images,
    amenities: d.amenities,
    latitude: d.latitude ?? null,
    longitude: d.longitude ?? null,
  });

  revalidatePath('/dashboard/landlord/listings');
}

export async function publishListing(listingId: string) {
  const user = await requireVerifiedRole('landlord', { onFailure: 'throw' });
  await requirePlan('starter', { action: 'publish_listing' });
  await updateListingService(user.id, listingId, { status: 'published' });
  revalidatePath('/dashboard/landlord/listings');
  revalidatePath(`/dashboard/landlord/listings/${listingId}`);
}

export async function unpublishListing(listingId: string) {
  const user = await requireRole('landlord');
  await unpublishListingService(user.id, listingId);
  revalidatePath('/dashboard/landlord/listings');
  revalidatePath(`/dashboard/landlord/listings/${listingId}`);
}

export async function archiveListing(listingId: string) {
  const user = await requireRole('landlord');
  await archiveListingService(user.id, listingId);
  revalidatePath('/dashboard/landlord/listings');
}

export async function deleteListing(listingId: string) {
  const user = await requireRole('landlord');
  await deleteListingService(user.id, listingId);
  revalidatePath('/dashboard/landlord/listings');
}
