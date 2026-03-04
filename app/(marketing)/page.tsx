import Link from 'next/link';
import { getPublishedListings } from '@/server/services/listings.service';
import { MapTipLanding } from '@/components/www/MapTipLanding';
import { Button } from '@/components/ui/button';
import { getAppDashboardUrl, getAppListingsUrl, getAppLoginUrl, getAppSignupUrl } from '@/lib/app-url';
import { Home, MapPin, Building2 } from 'lucide-react';
import { getAuthUser } from '@/server/auth/get-auth-user';
export default async function WWWLandingPage() {
  const user = await getAuthUser();
  const listings = await getPublishedListings();
  const displayListings = listings.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-[var(--container-max)] items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg text-foreground hover:text-primary transition-colors"
          >
            <Building2 className="size-6" />
            ScrubHub
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground border-b-2 border-primary pb-1"
            >
              Home
            </Link>
            <Link
              href={getAppListingsUrl()}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Properties
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={getAppDashboardUrl()}>Dashboard</Link>
                </Button>
                <form action="/api/auth/signout" method="post">
                  <Button size="sm" type="submit">Logout</Button>
                </form>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={getAppLoginUrl()}>Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={getAppSignupUrl()}>
                    Join Now <span className="ml-1">→</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero + Map - hero overlay on map with white gradient */}
        <section className="relative w-full border-b border-border/70 bg-card">
          <div className="relative w-full h-[100vh]">
            <MapTipLanding listings={displayListings} />
            {/* White gradient overlay - top 25% only */}
            <div
              className="absolute top-0 left-0 right-0 h-[34%] pointer-events-none z-[1]"
              style={{ background: 'white', opacity: 0.92 }}
              aria-hidden
            />
            {/* Hero content - top 25% section */}
            <div className="absolute top-0 left-0 right-0 h-[34%] flex flex-col items-center justify-center px-4 text-center z-[2] pointer-events-none">
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="size-2 rounded-full bg-white/85" />
                <span className="text-sm font-semibold text-black/95">Healthcare Housing Marketplace</span>
              </div>
              <h1 className="mx-auto mb-4 max-w-3xl text-3xl font-bold tracking-tight text-black md:text-4xl lg:text-5xl">
                Easily Find and Manage Rental Properties to Grow Your Portfolio
              </h1>
              <p className="mx-auto max-w-2xl text-base text-black/90 md:text-lg">
                Take control of your property management. From practitioner housing to clinical suites, ScrubHub connects landlords and healthcare professionals across the 401 Corridor.
              </p>
            </div>
          </div>
          {displayListings.length === 0 && (
            <div className="mx-auto max-w-[var(--container-max)] px-4 py-8 text-center">
              <p className="text-muted-foreground">
                No published listings yet. Sign up to create one.
              </p>
              <Button asChild className="mt-4">
                <Link href={getAppSignupUrl()}>Get Started</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Statistics Section */}
        <section className="border-b border-border bg-muted py-12">
          <div className="mx-auto max-w-[var(--container-max)] px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">500+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Properties Listed</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">1K+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Happy Landlords</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">2K+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Active Tenants</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-foreground">98%</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wider mt-1">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section id="about" className="mx-auto max-w-[var(--container-max)] px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-medium text-secondary mb-2">Reason to choose us</p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Discover the value behind smart property management
              </h2>
              <p className="text-muted-foreground mb-6">
                We research every listing to ensure quality and reliability. Our platform connects verified landlords with healthcare professionals seeking housing near clinical sites.
              </p>
              <Button asChild>
                <Link href={getAppListingsUrl()}>
                  Find the best for you <span className="ml-1">→</span>
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-[var(--card-radius)] border border-border bg-card p-6 shadow-[var(--card-shadow)]">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Home className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Smart Listings</h3>
                <p className="text-sm text-muted-foreground">
                  Browse curated properties tailored for healthcare professionals and practitioners.
                </p>
              </div>
              <div className="rounded-[var(--card-radius)] border border-border bg-card p-6 shadow-[var(--card-shadow)]">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <MapPin className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Location-First</h3>
                <p className="text-sm text-muted-foreground">
                  Properties near hospitals and clinical sites across the 401 Corridor.
                </p>
              </div>
              <div className="rounded-[var(--card-radius)] border border-border bg-card p-6 shadow-[var(--card-shadow)] sm:col-span-2">
                <div className="size-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <Building2 className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Trusted Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Landlords and tenants trust ScrubHub for secure, transparent property management.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-muted py-16">
          <div className="mx-auto max-w-[var(--container-max)] px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to list your property?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Join hundreds of landlords already using ScrubHub to connect with healthcare professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href={getAppSignupUrl()}>Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={getAppListingsUrl()}>Browse Listings</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-[var(--container-max)] flex-col items-center justify-between gap-4 px-4 md:flex-row">
          <p className="text-sm text-muted-foreground">© ScrubHub. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href={getAppListingsUrl()} className="text-sm text-muted-foreground hover:text-foreground">
              Properties
            </Link>
            {user ? (
              <Link href={getAppDashboardUrl()} className="text-sm text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href={getAppLoginUrl()} className="text-sm text-muted-foreground hover:text-foreground">
                  Login
                </Link>
                <Link href={getAppSignupUrl()} className="text-sm text-muted-foreground hover:text-foreground">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
