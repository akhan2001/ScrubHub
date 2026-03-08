"use client";

import type { Listing } from "@/types/database";
import { CombinedListingsMap } from "@/components/map/CombinedListingsMap";

type ListingsMarketplaceProps = {
  listings: Pick<
    Listing,
    | "id"
    | "title"
    | "description"
    | "address"
    | "price_cents"
    | "status"
    | "created_at"
    | "latitude"
    | "longitude"
    | "bedrooms"
    | "bathrooms"
    | "square_footage"
    | "is_furnished"
    | "are_pets_allowed"
    | "images"
    | "lease_terms"
  >[];
};

export function ListingsMarketplace({ listings }: ListingsMarketplaceProps) {
  return <CombinedListingsMap listings={listings} variant="full" showFilters />;
}
