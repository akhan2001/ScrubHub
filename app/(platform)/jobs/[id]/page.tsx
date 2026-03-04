import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getJobPostById } from '@/server/services/job-posts.service';
import { getPublishedListing } from '@/server/services/listings.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, DollarSign, Calendar, Building2, Home, ArrowLeft, BedDouble } from 'lucide-react';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJobPostById(id);
  if (!job || job.status !== 'published') notFound();

  const linkedListing = job.linked_listing_id
    ? await getPublishedListing(job.linked_listing_id)
    : null;

  const payRange =
    job.pay_range_min != null && job.pay_range_max != null
      ? `$${job.pay_range_min}–$${job.pay_range_max}/hr`
      : job.pay_range_min != null
        ? `From $${job.pay_range_min}/hr`
        : null;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <Link
        href="/jobs"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to Job Board
      </Link>

      <div className="space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold text-foreground">{job.title}</h1>
            {job.housing_included && (
              <Badge variant="secondary" className="gap-1">
                <Home className="size-3" /> Housing Included
              </Badge>
            )}
          </div>
          {job.facility_name && (
            <p className="mt-1 flex items-center gap-1 text-muted-foreground">
              <Building2 className="size-4" /> {job.facility_name}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
          {job.role_type && <Badge variant="outline">{job.role_type}</Badge>}
          {job.contract_type && <Badge variant="outline">{job.contract_type}</Badge>}
          {job.contract_length && <Badge variant="outline">{job.contract_length}</Badge>}
        </div>

        <Separator />

        <div className="prose prose-sm max-w-none">
          <h2 className="text-lg font-semibold text-foreground">Description</h2>
          <p className="whitespace-pre-wrap text-muted-foreground">{job.description}</p>
        </div>

        {linkedListing && (
          <>
            <Separator />
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Home className="size-5" /> Included Housing
              </h2>
              <Card>
                <CardContent className="flex items-center justify-between gap-4 pt-4">
                  <div>
                    <p className="font-medium text-foreground">{linkedListing.title}</p>
                    <p className="text-sm text-muted-foreground">{linkedListing.address}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
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
                    <Link href={`/listings/${linkedListing.id}`}>View Listing</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <Separator />

        <div className="flex items-center gap-3">
          {linkedListing ? (
            <Button asChild size="lg">
              <Link href={`/listings/${linkedListing.id}?apply=true`}>
                Apply for this Job
              </Link>
            </Button>
          ) : (
            <Button size="lg" disabled>
              Apply (Coming Soon)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
