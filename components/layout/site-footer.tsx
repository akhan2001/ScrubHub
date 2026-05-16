/* =============================================================
   components/layout/site-footer.tsx — warm residential footer
   ============================================================= */
'use client';

import Link from 'next/link';
import { getAppLoginUrl } from '@/lib/app-url';
import { ScrubHubLogo } from '@/components/brand/scrubhub-logo';

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-auto border-t border-[#E5DFD2] bg-[#F7F4EE]">
      <div className="mx-auto max-w-[1320px] px-6 sm:px-8 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)] mb-12">
          <div>
            <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
              <ScrubHubLogo variant="light" className="h-8 w-auto max-w-[180px] object-contain object-left" />
            </Link>
            <p className="mt-4 text-[14px] leading-[1.6] text-[#6B7585] m-0 max-w-[300px]">
              Furnished housing, clinical suites and locum staffing along Ontario, Canada.
            </p>
          </div>

          {[
            ['Stay',    [['Browse listings', '/facility-map']]],
            ['Staff',   [['Open roles', '/staffing']]],
            ['Company', [['Pricing', '/plans'], ['Privacy', '/privacy'], ['Terms', '/terms']]],
          ].map(([h, items]) => (
            <div key={h as string}>
              <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#6B7585] mb-4 font-medium">{h as string}</div>
              <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
                {(items as [string, string][]).map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-[14px] text-[#3A4759] hover:text-[#0E1A2B] transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-[#E5DFD2] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#6B7585]">
          <p className="m-0">© {new Date().getFullYear()} SCRUBHUB INC. · Ontario, Canada</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="hover:text-[#0E1A2B] transition-colors">Privacy</Link>
            <Link href="/terms"   className="hover:text-[#0E1A2B] transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
