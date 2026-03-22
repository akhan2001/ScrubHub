'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Archive,
  BedDouble,
  Bath,
  Ruler,
  Edit,
  Eye,
  Globe,
  Trash2,
  ArrowUpFromLine,
  ArrowDownFromLine,
} from 'lucide-react';
import { publishListing, unpublishListing, archiveListing, deleteListing } from '@/actions/listings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ListingScreeningRules } from '@/components/landlord/listing-screening-rules';
import { ListingModal } from '@/components/listings/ListingModal';
import { toast } from 'sonner';
import { getUserFacingErrorMessage } from '@/lib/errors/user-facing-error';
import type { Listing, ScreeningRule } from '@/types/database';
import type { BookingWithTenantProfile } from '@/server/repositories/bookings.repository';

const STATUS_BADGE: Record<string, { variant: 'default' | 'secondary' | 'outline'; label: string }> = {
  draft: { variant: 'secondary', label: 'Draft' },
  published: { variant: 'default', label: 'Published' },
  archived: { variant: 'outline', label: 'Archived' },
};

interface ListingDetailViewProps {
  listing: Listing;
  bookings: BookingWithTenantProfile[];
  screeningRule: ScreeningRule | null;
}

export function ListingDetailView({
  listing,
  bookings,
  screeningRule,
}: ListingDetailViewProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const price = listing.price_cents != null
    ? `$${Math.round(listing.price_cents / 100).toLocaleString()}`
    : null;
  const deposit = listing.deposit_amount_cents != null
    ? `$${Math.round(listing.deposit_amount_cents / 100).toLocaleString()}`
    : null;
  const statusBadge = STATUS_BADGE[listing.status] ?? STATUS_BADGE.draft;
  const coverImage = listing.images?.[0];

  function handlePublish() {
    startTransition(async () => {
      try {
        await publishListing(listing.id);
        toast.success('Listing published');
      } catch (err) {
        toast.error(getUserFacingErrorMessage(err, "We couldn't publish this listing. Please try again."));
      }
    });
  }

  function handleUnpublish() {
    startTransition(async () => {
      try {
        await unpublishListing(listing.id);
        toast.success('Listing unpublished');
      } catch (err) {
        toast.error(getUserFacingErrorMessage(err, "We couldn't unpublish this listing. Please try again."));
      }
    });
  }

  function handleArchive() {
    startTransition(async () => {
      try {
        await archiveListing(listing.id);
        toast.success('Listing archived');
        router.push('/dashboard/landlord/listings');
      } catch (err) {
        toast.error(getUserFacingErrorMessage(err, "We couldn't archive this listing. Please try again."));
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteListing(listing.id);
        toast.success('Listing deleted');
        router.push('/dashboard/landlord/listings');
      } catch (err) {
        toast.error(getUserFacingErrorMessage(err, "We couldn't delete this listing. Please try again."));
      }
    });
  }

  return (
    <>
      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={statusBadge.variant} className="capitalize text-xs">
          {statusBadge.label}
        </Badge>
        <div className="flex-1" />
        <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
          <Eye className="mr-1.5 size-3.5" />
          Public view
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/landlord/listings/${listing.id}/edit`}>
            <Edit className="mr-1.5 size-3.5" />
            Edit
          </Link>
        </Button>
        {listing.status === 'draft' && (
          <Button size="sm" onClick={handlePublish} disabled={isPending}>
            <Globe className="mr-1.5 size-3.5" />
            Publish
          </Button>
        )}
        {listing.status === 'published' && (
          <Button variant="outline" size="sm" onClick={handleUnpublish} disabled={isPending}>
            <ArrowDownFromLine className="mr-1.5 size-3.5" />
            Unpublish
          </Button>
        )}
        {listing.status !== 'archived' && (
          <Button variant="outline" size="sm" onClick={() => setArchiveOpen(true)} disabled={isPending}>
            <Archive className="mr-1.5 size-3.5" />
            Archive
          </Button>
        )}
        <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setDeleteOpen(true)} disabled={isPending}>
          <Trash2 className="mr-1.5 size-3.5" />
          Delete
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="applications">
            Applications{bookings.length > 0 ? ` (${bookings.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="screening">Screening Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4 space-y-6">
          {/* Cover image */}
          {coverImage && (
            <div className="aspect-[16/7] overflow-hidden rounded-xl">
              <img src={coverImage} alt={listing.title} className="h-full w-full object-cover" />
            </div>
          )}

          {/* Key info grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {price && (
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground">Monthly Rent</p>
                  <p className="text-xl font-semibold text-foreground">{price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
                </CardContent>
              </Card>
            )}
            {deposit && (
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground">Deposit</p>
                  <p className="text-xl font-semibold text-foreground">{deposit}</p>
                </CardContent>
              </Card>
            )}
            <Card>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">Unit</p>
                <div className="flex items-center gap-3 text-foreground">
                  {listing.bedrooms != null && (
                    <span className="inline-flex items-center gap-1 text-sm">
                      <BedDouble className="size-3.5" /> {listing.bedrooms} bed
                    </span>
                  )}
                  {listing.bathrooms != null && (
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Bath className="size-3.5" /> {listing.bathrooms} bath
                    </span>
                  )}
                  {listing.square_footage != null && (
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Ruler className="size-3.5" /> {listing.square_footage} sqft
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">Available</p>
                <p className="text-sm font-medium text-foreground">
                  {listing.available_date
                    ? new Date(listing.available_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Not set'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Address & description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {listing.address && (
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm text-foreground">{listing.address}{listing.unit_number ? `, ${listing.unit_number}` : ''}</p>
                </div>
              )}
              {listing.description && (
                <div>
                  <p className="text-xs text-muted-foreground">Description</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{listing.description}</p>
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                {listing.is_furnished && <Badge variant="outline">Furnished</Badge>}
                {listing.are_pets_allowed && <Badge variant="outline">Pets OK</Badge>}
                {listing.lease_terms?.map((term) => (
                  <Badge key={term} variant="outline">{term}</Badge>
                ))}
                {(listing.amenities as string[] | null)?.map((amenity) => (
                  <Badge key={amenity} variant="secondary">{amenity}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photo gallery */}
          {listing.images && listing.images.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Photos ({listing.images.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                  {listing.images.map((url, i) => (
                    <div key={url} className="aspect-[4/3] overflow-hidden rounded-lg">
                      <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">No applications received yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2 pr-4 font-medium">Applicant</th>
                        <th className="pb-2 pr-4 font-medium">Move-in</th>
                        <th className="pb-2 pr-4 font-medium">Status</th>
                        <th className="pb-2 font-medium">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-b last:border-0">
                          <td className="py-2.5 pr-4">
                            <p className="font-medium text-foreground">{b.tenant_name ?? 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">{b.tenant_email}</p>
                          </td>
                          <td className="py-2.5 pr-4 text-foreground">
                            {b.move_in_date_requested
                              ? new Date(b.move_in_date_requested).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              : '—'}
                          </td>
                          <td className="py-2.5 pr-4">
                            <Badge variant={b.status === 'approved' ? 'default' : 'secondary'} className="capitalize text-xs">
                              {b.status}
                            </Badge>
                          </td>
                          <td className="py-2.5 text-muted-foreground">
                            {new Date(b.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screening" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <ListingScreeningRules listingId={listing.id} rules={screeningRule} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Public view modal */}
      <ListingModal
        listing={listing}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />

      {/* Confirm dialogs */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete listing"
        description="This will permanently delete this listing and all associated data. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={isPending}
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title="Archive listing"
        description="This listing will be removed from public view but can be restored later."
        confirmLabel="Archive"
        loading={isPending}
        onConfirm={handleArchive}
      />
    </>
  );
}
