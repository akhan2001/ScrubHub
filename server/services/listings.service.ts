import {
  fetchListingsByUser,
  countListingsByUser,
  fetchPublishedListings,
  fetchPublishedListingById,
  fetchListingOwnerById,
  fetchListingById,
  insertListing as insertListingRepo,
  updateListingById,
  deleteListingById,
  fetchPublishedListingsInBounds as fetchInBoundsRepo,
  fetchListingsByUserWithDetails,
  type InsertListingInput,
  type MapBoundsFilter,
} from '@/server/repositories/listings.repository';

export async function getLandlordListings(userId: string) {
  return fetchListingsByUser(userId);
}

export async function getLandlordListingsWithDetails(userId: string) {
  return fetchListingsByUserWithDetails(userId);
}

export async function getLandlordListingsCount(userId: string): Promise<number> {
  return countListingsByUser(userId);
}

export async function getPublishedListings() {
  return fetchPublishedListings();
}

export async function getPublishedListing(id: string) {
  return fetchPublishedListingById(id);
}

export async function getListingOwnerById(id: string) {
  return fetchListingOwnerById(id);
}

export async function createListing(
  userId: string,
  input: Omit<InsertListingInput, 'user_id'>
): Promise<void> {
  await insertListingRepo({ ...input, user_id: userId });
}

export async function updateListing(
  userId: string,
  listingId: string,
  input: Partial<Omit<InsertListingInput, 'user_id'>>
): Promise<void> {
  await updateListingById(listingId, userId, input);
}

export async function getPublishedListingsInBounds(filters: MapBoundsFilter) {
  return fetchInBoundsRepo(filters);
}

export async function getListingById(id: string) {
  return fetchListingById(id);
}

export async function deleteListing(userId: string, listingId: string): Promise<void> {
  await deleteListingById(listingId, userId);
}

export async function archiveListing(userId: string, listingId: string): Promise<void> {
  await updateListingById(listingId, userId, { status: 'archived' });
}

export async function unpublishListing(userId: string, listingId: string): Promise<void> {
  await updateListingById(listingId, userId, { status: 'draft' });
}
