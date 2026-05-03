/* =============================================================
   app/(marketing)/staffing/jobs/[id]/page.tsx — warm redesign
   Same data fetches; restyles the chrome around them.
   ============================================================= */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getJobPostById } from '@/server/services/job-posts.service';
import { getPublishedListing } from '@/server/services/listings.service';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import { Button } from '@/components/ui/button';
import { JobApplyButton } from '@/components/jobs/job-apply-button';
import { Building2, Home, ArrowLeft, BedDouble, BadgeCheck } from 'lucide-react';
import { getAppListingUrl } from '@/lib/app-url';
import { MARKETING_SITE_URL } from '@/lib/marketing-site';

function metaDescriptionFromJob(description: string, title: string, location: string): string {
  const text = description.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const base = text.length > 0 ? text : `Apply for ${title} — ${location}.`;
  return base.length > 160 ? `${base.slice(0, 157)}…` : base;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getJobPostById(id);
  if (!job || job.status !== 'published') return { title: 'Job' };
  const location = job.facility_name || job.location || '401 Corridor';
  const description = metaDescriptionFromJob(job.description, job.title, location);
  const ogTitle = `${job.title} | ScrubHub`;
  return {
    title: job.title,
    description,
    openGraph: { url: `${MARKETING_SITE_URL}/staffing/jobs/${id}`, title: ogTitle, description },
    twitter:   { title: ogTitle, description },
  };
}

export default async function StaffingJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [job, user] = await Promise.all([getJobPostById(id), getAuthUser()]);
  if (!job || job.status !== 'published') notFound();

  const profile = user ? await getProfile(user.id) : null;
  const linkedListing = job.linked_listing_id
    ? await getPublishedListing(job.linked_listing_id)
    : null;

  const payRange =
    job.pay_range_min != null && job.pay_range_max != null
      ? `$${job.pay_range_min}–$${job.pay_range_max}/hr`
      : job.pay_range_min != null
        ? `From $${job.pay_range_min}/hr`
        : null;

  const applyUser = user && profile
    ? { id: user.id, email: user.email ?? undefined, phone: profile.phone_number ?? undefined, role: profile.role }
    : null;

  // Sidebar facts
  const facts: Array<[string, string | null]> = [
    ['Pay',      payRange],
    ['Type',     job.contract_type ?? null],
    ['Length',   job.contract_length ?? null],
    ['Role',     job.role_type ?? null],
    ['Start',    job.start_date ? new Date(job.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : null],
    ['Location', job.location ?? null],
  ];

  return (
    <div className="flex-1 bg-[#F7F4EE] text-[#0E1A2B]">
      <main className="mx-auto max-w-[1180px] w-full px-6 sm:px-8 py-12">
        <Link
          href="/staffing"
          className="mb-8 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585] hover:text-[#0E1A2B] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to open positions
        </Link>

        {/* Editorial header */}
        <header className="border-b border-[#E5DFD2] pb-10 mb-10">
          <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585] font-medium mb-4">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#B8472E]" />
              {job.contract_type ?? 'Open position'}
              {job.role_type && <span className="text-[#3A4759]">· {job.role_type}</span>}
            </span>
          </div>

          <h1
            className="m-0 font-medium tracking-[-0.04em] leading-[0.96] max-w-[20ch]"
            style={{ fontSize: 'clamp(40px, 5.6vw, 76px)' }}
          >
            {job.title}
          </h1>

          {job.facility_name && (
            <p className="mt-5 inline-flex items-center gap-2 text-[17px] text-[#3A4759] m-0">
              <Building2 className="size-4 text-[#6B7585]" />
              <span>{job.facility_name}</span>
              {job.location && <span className="text-[#6B7585]">· {job.location}</span>}
            </p>
          )}

          {job.housing_included && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#B8472E]/40 bg-[#B8472E]/8 px-3.5 py-1.5">
              <Home className="size-3.5 text-[#B8472E]" />
              <span className="font-mono text-[11px] tracking-[0.16em] uppercase font-semibold text-[#B8472E]">
                Housing included
              </span>
            </div>
          )}
        </header>

        {/* Two-column body */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-12">
          {/* Description */}
          <article className="min-w-0">
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585] font-medium mb-4">
              About the role
            </div>
            <div className="text-[16px] leading-[1.7] text-[#3A4759] whitespace-pre-wrap">
              {job.description}
            </div>

            {/* Linked housing */}
            {linkedListing && (
              <div className="mt-12 pt-10 border-t border-[#E5DFD2]">
                <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585] font-medium mb-4">
                  Included housing
                </div>
                <Link
                  href={getAppListingUrl(linkedListing.id)}
                  className="group flex items-center gap-5 rounded-2xl border border-[#E5DFD2] bg-white p-5 hover:border-[#0E1A2B] transition"
                >
                  <div
                    className="shrink-0 size-20 rounded-xl bg-[#EFE9DD] grid place-items-center"
                    style={{ background: 'repeating-linear-gradient(135deg,#F0EBDF 0 10px,#EFE9DD 10px 20px)' }}
                  >
                    <Home className="size-6 text-[#3A4759]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold tracking-[-0.01em] text-[16px] m-0 truncate">
                      {linkedListing.title}
                    </p>
                    <p className="text-[13px] text-[#6B7585] m-0 mt-1 truncate">{linkedListing.address}</p>
                    <div className="mt-2 flex items-center gap-3 font-mono text-[10px] tracking-[0.14em] uppercase text-[#6B7585]">
                      {linkedListing.bedrooms != null && (
                        <span className="inline-flex items-center gap-1.5">
                          <BedDouble className="size-3.5" /> {linkedListing.bedrooms} bed
                        </span>
                      )}
                      {linkedListing.price_cents != null && (
                        <span>${Math.round(linkedListing.price_cents / 100)}/mo</span>
                      )}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className="rounded-full border-[#E5DFD2]">
                    <span>View listing</span>
                  </Button>
                </Link>
              </div>
            )}
          </article>

          {/* Sticky apply card */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="rounded-3xl border border-[#E5DFD2] bg-white p-6 shadow-[0_2px_8px_rgba(14,26,43,0.04)]">
              {payRange && (
                <div className="pb-5 border-b border-[#E5DFD2] mb-5">
                  <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6B7585] mb-1.5">Compensation</div>
                  <div className="font-medium tracking-[-0.03em] text-[#0E1A2B] text-[34px] leading-none">{payRange}</div>
                </div>
              )}

              <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-4">
                {facts.filter(([, v]) => !!v).map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#6B7585] mb-1">{k}</dt>
                    <dd className="text-[14px] font-semibold text-[#0E1A2B] m-0">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 pt-5 border-t border-[#E5DFD2]">
                <JobApplyButton
                  jobId={job.id}
                  redirectTo={`/staffing/jobs/${job.id}`}
                  user={applyUser}
                  loginUrl="/login"
                />
              </div>

              <div className="mt-5 flex items-start gap-2 text-[12px] text-[#6B7585]">
                <BadgeCheck className="size-3.5 mt-0.5 shrink-0 text-[#0E1A2B]" />
                <span>Vetted facility · License check, e-sign, and deposit handled in one flow.</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
