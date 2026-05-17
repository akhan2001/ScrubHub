import { getAuthUser } from "@/server/auth/get-auth-user";
import { getNewestPublishedListings } from "@/server/services/listings.service";
import { LandingClient } from "./LandingClient";

export default async function WWWLandingPage() {
  const [user, featuredListings] = await Promise.all([
    getAuthUser(),
    getNewestPublishedListings(6),
  ]);

  return <LandingClient user={user} featuredListings={featuredListings} />;
}
