import type { Listing } from "@/types/database";

const BASE_LAT = 43.6532;
const BASE_LNG = -79.3832;

function hashText(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function toSpread(seed: number, maxOffset: number) {
  return ((seed % 1000) / 1000) * maxOffset * 2 - maxOffset;
}

export type ListingWithCoordinates = Pick<
  Listing,
  "id" | "title" | "description" | "address" | "price_cents" | "status" | "created_at"
> & {
  latitude: number;
  longitude: number;
};

export function withMockCoordinates(
  listings: Array<
    Pick<Listing, "id" | "title" | "description" | "address" | "price_cents" | "status" | "created_at">
  >
): ListingWithCoordinates[] {
  return listings.map((listing) => {
    const seed = hashText(`${listing.id}-${listing.address ?? listing.title}`);
    const latOffset = toSpread(seed, 0.11);
    const lngOffset = toSpread(Math.floor(seed / 13), 0.16);

    return {
      ...listing,
      latitude: Number((BASE_LAT + latOffset).toFixed(6)),
      longitude: Number((BASE_LNG + lngOffset).toFixed(6)),
    };
  });
}
