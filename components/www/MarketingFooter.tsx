'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { getAppLoginUrl } from '@/lib/app-url';

export function MarketingFooter() {
  return (
    <footer className="bg-primary py-16 text-primary-foreground text-center sm:text-left">
      <div className="mx-auto max-w-[88rem] px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h3 className="font-sans text-2xl mb-2">ScrubHub</h3>
            <p className="text-primary-foreground/70 text-sm">The Premium Healthcare Space Network</p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm font-medium">
            <Link
              href="/facility-map"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Portfolios
            </Link>
            <Link
              href="/plans"
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href={getAppLoginUrl()}
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <p>© 2026 SCRUBHUB INC.</p>
        </div>
      </div>
    </footer>
  );
}
