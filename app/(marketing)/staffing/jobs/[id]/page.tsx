import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getJobPostById } from '@/server/services/job-posts.service';
import { getPublishedListing } from '@/server/services/listings.service';
import { getAuthUser } from '@/server/auth/get-auth-user';
import { getProfile } from '@/server/services/profiles.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { JobApplyButton } from '@/components/jobs/job-apply-button';
import { MapPin, DollarSign, Calendar, Building2, Home, ArrowLeft, BedDouble } from 'lucide-react';
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
  if (!job || job.status !== 'published') {
    return { title: 'Job' };
  }
  const location = job.facility_name || job.location || '401 Corridor';
  const description = metaDescriptionFromJob(job.description, job.title, location);
  const ogTitle = `${job.title} | ScrubHub`;
  return {
    title: job.title,
    description,
    openGraph: {
      url: `${MARKETING_SITE_URL}/staffing/jobs/${id}`,
      title: ogTitle,
      description,
    },
    twitter: {
      title: ogTitle,
      description,
    },
  };
}

export default async function StaffingJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [job, user] = await Promise.all([
    getJobPostById(id),
    getAuthUser(),
  ]);

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
    ? {
        id: user.id,
        email: user.email ?? undefined,
        phone: profile.phone_number ?? undefined,
        role: profile.role,
      }
    : null;

  return (
    <div
      className="flex-1"
      style={{
        background: '#f0f4fa',
        backgroundImage:
          'linear-gradient(rgba(0,31,63,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,31,63,0.04) 1px,transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <main className="mx-auto max-w-3xl w-full px-6 py-10">
        <Link
          href="/staffing"
          className="mb-4 inline-flex items-center gap-1 text-sm text-[#4a5568] hover:text-[#0F172A]"
        >
          <ArrowLeft className="size-3.5" />
          Back to Open Positions
        </Link>

        <div className="rounded-2xl border border-[#d0d9e8] bg-white p-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold text-[#0F172A]">{job.title}</h1>
                {job.housing_included && (
                  <Badge className="gap-1 bg-primary/10 text-primary border-primary/30">
                    <Home className="size-3" /> Housing Included
                  </Badge>
                )}
              </div>
              {job.facility_name && (
                <p className="mt-1 flex items-center gap-1 text-[#4a5568]">
                  <Building2 className="size-4" /> {job.facility_name}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-[#4a5568]">
              {job.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" /> {job.location}
                </span>
              )}
              {payRange && (
                <span className="inline-flex items-center gap-1">
                  <DollarSign className="size-3.5" /> {payRange}
                </span>
              )}
              {job.start_date && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3.5" /> Starts {new Date(job.start_date).toLocaleDateString()}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {job.role_type && (
                <Badge variant="outline" className="border-[#d0d9e8]">
                  {job.role_type}
                </Badge>
              )}
              {job.contract_type && (
                <Badge variant="outline" className="border-[#d0d9e8]">
                  {job.contract_type}
                </Badge>
              )}
              {job.contract_length && (
                <Badge variant="outline" className="border-[#d0d9e8]">
                  {job.contract_length}
                </Badge>
              )}
            </div>

            <Separator className="border-[#eef2f7]" />

            <div>
              <h2 className="text-lg font-semibold text-[#0F172A] mb-2">Description</h2>
              <p className="whitespace-pre-wrap text-[#4a5568]">{job.description}</p>
            </div>

            {linkedListing && (
              <>
                <Separator className="border-[#eef2f7]" />
                <div className="space-y-3">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-[#0F172A]">
                    <Home className="size-5" /> Included Housing
                  </h2>
                  <Card className="border-[#d0d9e8]">
                    <CardContent className="flex items-center justify-between gap-4 pt-4">
                      <div>
                        <p className="font-medium text-[#0F172A]">{linkedListing.title}</p>
                        <p className="text-sm text-[#4a5568]">{linkedListing.address}</p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-[#4a5568]">
                          {linkedListing.bedrooms != null && (
                            <span className="flex items-center gap-1">
                              <BedDouble className="size-3" /> {linkedListing.bedrooms} bed
                            </span>
                          )}
                          {linkedListing.price_cents != null && (
                            <span>${Math.round(linkedListing.price_cents / 100)}/mo</span>
                          )}
                        </div>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link href={getAppListingUrl(linkedListing.id)}>View Listing</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            <Separator className="border-[#eef2f7]" />

            <div>
              <JobApplyButton
                jobId={job.id}
                redirectTo={`/staffing/jobs/${job.id}`}
                user={applyUser}
                loginUrl="/login"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
