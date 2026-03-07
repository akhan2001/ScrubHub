'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { getAppLoginUrl } from '@/lib/app-url';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-slate-50/80">
      <div className="mx-auto max-w-[88rem] px-4 py-12 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <Link href="/" className="text-xl font-extrabold text-foreground tracking-tight hover:text-primary transition-colors">
              ScrubHub
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              The Premium Healthcare Space Network
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            <Link
              href="/housing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Housing
            </Link>
            <Link
              href="/staffing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Staffing
            </Link>
            <Link
              href="/plans"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href={getAppLoginUrl()}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Lock className="size-3.5" aria-hidden />
            <span>PIPEDA & PHIPA COMPLIANT</span>
          </div>
          <p>© {new Date().getFullYear()} SCRUBHUB INC.</p>
        </div>
      </div>
    </footer>
  );
}
