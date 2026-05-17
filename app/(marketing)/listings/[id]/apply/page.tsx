import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import { fetchWorkerProfile } from '@/server/repositories/profiles.repository';
import { getPublishedListing } from '@/server/services/listings.service';
import { ApplicationPage } from '@/components/tenant/application-page';
import { Button } from '@/components/ui/button';

type ApplyRouteProps = {
  params: Promise<{ id: string }>;
};

/**
 * Public-shell tenant application page. Lives under (marketing) so tenants
 * never leave the discovery surface to apply. The form itself is gated:
 *   - signed-out → CTA to sign in (returnTo back to this page)
 *   - non-tenant → message to switch accounts
 *   - tenant     → prefilled form
 */
export default async function MarketingApplyRoute({ params }: ApplyRouteProps) {
  const { id: listingId } = await params;

  const listing = await getPublishedListing(listingId);
  if (!listing) notFound();

  const user = await getAuthUser();

  // Logged-out shell
  if (!user) {
    const returnTo = `/listings/${listingId}/apply`;
    return (
      <Shell title={listing.title ?? 'Apply for this stay'}>
        <h2 className="text-lg font-semibold text-foreground">Sign in to apply</h2>
        <p className="mt-2 max-w-[52ch] text-sm text-muted-foreground">
          You&rsquo;ll need a tenant account to submit an application. We&rsquo;ll bring you right
          back here after you sign in.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="lg">
            <Link href={`/login?redirectTo=${encodeURIComponent(returnTo)}`}>Sign in</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/signup?redirectTo=${encodeURIComponent(returnTo)}`}>Create account</Link>
          </Button>
        </div>
      </Shell>
    );
  }

  const profile = await getProfile(user.id);
  if (!profile) {
    return (
      <Shell title={listing.title ?? 'Apply for this stay'}>
        <p className="text-sm text-muted-foreground">
          We couldn&rsquo;t load your profile. Please refresh, or sign out and back in.
        </p>
      </Shell>
    );
  }

  // Non-tenant accounts can't apply
  if (profile.role !== 'tenant') {
    return (
      <Shell title={listing.title ?? 'Apply for this stay'}>
        <h2 className="text-lg font-semibold text-foreground">Tenant account required</h2>
        <p className="mt-2 max-w-[52ch] text-sm text-muted-foreground">
          You&rsquo;re signed in as a {profile.role}. Switch to a tenant account to apply.
        </p>
        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </Shell>
    );
  }

  const workerProfile = await fetchWorkerProfile(user.id);

  return (
    <ApplicationPage
      listing={{
        id: listing.id,
        title: listing.title,
        address: listing.address,
        price_cents: listing.price_cents,
        bedrooms: listing.bedrooms ?? null,
        bathrooms: listing.bathrooms ?? null,
        square_footage: listing.square_footage ?? null,
        images: listing.images ?? null,
      }}
      profile={profile}
      workerProfile={workerProfile}
      profileGate={{
        hasBackgroundConsent: workerProfile?.background_check_consent ?? false,
        hasIdDocument: !!workerProfile?.id_document_url,
      }}
    />
  );
}

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[720px] px-6 py-12">
      <Link
        href="/listings"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to listings
      </Link>
      <p className="font-mono text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
        Tenant application
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        Apply for {title}
      </h1>
      <div className="mt-6 rounded-2xl border border-border bg-card p-6">{children}</div>
    </div>
  );
}
