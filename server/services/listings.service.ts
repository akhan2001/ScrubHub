import {
  fetchListingsByUser,
  countListingsByUser,
  fetchPublishedListings,
  fetchPublishedListingById,
  insertListing as insertListingRepo,
  type InsertListingInput,
} from '@/server/repositories/listings.repository';

export async function getLandlordListings(userId: string) {
  return fetchListingsByUser(userId);
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

export async function createListing(
  userId: string,
  input: Omit<InsertListingInput, 'user_id'>
): Promise<void> {
  await insertListingRepo({ ...input, user_id: userId });
}
