/* =============================================================
   app/(marketing)/staffing/page.tsx — warm residential redesign
   ============================================================= */
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRight, Stethoscope } from 'lucide-react';
import { getPublishedJobPosts } from '@/server/services/job-posts.service';
import { MARKETING_SITE_URL } from '@/lib/marketing-site';
import { StaffingJobsGrid } from '@/components/jobs/staffing-jobs-grid';
import { getAppLoginUrl, getAppSignupUrl } from '@/lib/app-url';

export const metadata: Metadata = {
  title: 'Staffing & jobs',
  description:
    'Open locum, contract, and permanent roles at hospitals and clinics along the 401 Corridor. Apply through ScrubHub.',
  openGraph: {
    url: `${MARKETING_SITE_URL}/staffing`,
    title: 'Staffing & jobs | ScrubHub',
    description:
      'Healthcare jobs across Ontario—browse open positions and apply in one place.',
  },
  twitter: {
    title: 'Staffing & jobs | ScrubHub',
    description:
      'Healthcare jobs across Ontario—browse open positions and apply in one place.',
  },
};

export default async function StaffingPage() {
  const jobs = await getPublishedJobPosts();

  return (
    <div className="flex-1 bg-[#F7F4EE] text-[#0E1A2B]">
      {/* Editorial masthead */}
      <section className="border-b border-[#E5DFD2] bg-[#EFE9DD]">
        <div className="mx-auto max-w-[1320px] px-8 pt-16 pb-12">
          <div className="flex items-center gap-2 mb-5 font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585]">
            <span className="size-1.5 rounded-full bg-[#B8472E]" />
            Open positions · Updated daily
          </div>
          <div className="grid lg:grid-cols-[1.6fr_1fr] gap-10 items-end">
            <h1 className="m-0 font-medium tracking-[-0.04em] leading-[0.96]" style={{ fontSize: 'clamp(44px, 6.4vw, 88px)' }}>
              Roles that match<br />
              <span className="italic font-normal text-primary" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                your scrubs.
              </span>
            </h1>
            <p className="text-lg leading-[1.5] text-[#3A4759] m-0 max-w-[520px] lg:justify-self-end">
              Locum, contract, and permanent positions across hospitals and clinics in the 401 Corridor —
              pre-screened by hospital, region, and specialty.
            </p>
          </div>

          {/* Stat bar */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-[#E5DFD2]">
            {[
              [String(jobs.length || '—'), 'Open today'],
              ['47',                         'Hospitals hiring'],
              ['$58/hr',                     'Median locum rate'],
              ['11 days',                    'Avg. time to placement'],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-medium tracking-[-0.04em] text-[#0E1A2B] text-[42px] leading-none">{n}</div>
                <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585] font-medium mt-2">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs grid */}
      <main className="mx-auto max-w-[1320px] px-8 py-16">
        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-[#E5DFD2] bg-white p-16 text-center">
            <div className="inline-grid place-items-center size-12 rounded-full bg-[#EFE9DD] mb-4">
              <Stethoscope className="size-5 text-[#3A4759]" />
            </div>
            <h2 className="text-xl font-semibold m-0 mb-2 tracking-[-0.01em]">Nothing open this rotation.</h2>
            <p className="text-[#6B7585] m-0">New positions land daily — check back soon, or join the locum waitlist.</p>
          </div>
        ) : (
          <StaffingJobsGrid jobs={jobs} />
        )}
      </main>

      {/* Hospital CTA */}
      <section className="border-t border-[#E5DFD2] bg-[#EFE9DD]">
        <div className="mx-auto max-w-[1320px] px-8 py-20">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-center">
            <div>
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585] font-medium mb-4">
                For hospitals &amp; clinics
              </div>
              <h2 className="m-0 font-medium tracking-[-0.04em] leading-[0.96]" style={{ fontSize: 'clamp(34px, 4.4vw, 56px)' }}>
                Post a position.<br />
                <span className="italic font-normal text-[#B8472E]" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
                  Cover the shift by Sunday.
                </span>
              </h2>
              <p className="text-[17px] leading-[1.55] text-[#3A4759] mt-4 max-w-[540px]">
                Reach verified, credentialed practitioners across Ontario. We handle license checks,
                scheduling, and housing — you handle patient care.
              </p>
              <div className="flex gap-3 mt-7 flex-wrap">
                <Link href={getAppSignupUrl()} className="inline-flex items-center gap-2 h-13 px-7 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition" style={{ height: 52 }}>
                  Post a role <ArrowRight className="size-4" />
                </Link>
                <Link href={getAppLoginUrl()} className="inline-flex items-center h-13 px-7 rounded-full border border-[#0E1A2B]/20 text-[#0E1A2B] font-semibold hover:border-[#0E1A2B] transition" style={{ height: 52 }}>
                  Sign in
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              {[
                ['1,247',  'Practitioners on roster'],
                ['96%',    'Credentialed within 48h'],
                ['8–13 wk','Typical contract length'],
                ['PIPEDA', 'Canadian-soil data'],
              ].map(([n, l]) => (
                <div key={l} className="rounded-2xl border border-[#E5DFD2] bg-white px-5 py-5">
                  <div className="font-medium tracking-[-0.03em] text-[28px] text-[#0E1A2B] leading-tight">{n}</div>
                  <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6B7585] mt-1.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
