'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Archive,
  Edit,
  Eye,
  Globe,
  MoreHorizontal,
  Trash2,
  ArrowDownFromLine,
} from 'lucide-react';
import { publishListing, unpublishListing, archiveListing, deleteListing } from '@/actions/listings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { getUserFacingErrorMessage } from '@/lib/errors/user-facing-error';
import type { Listing } from '@/types/database';

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  draft: 'secondary',
  published: 'default',
  archived: 'outline',
};

export function ListingsTable({ listings }: { listings: Listing[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);

  function handlePublish(id: string) {
    startTransition(async () => {
      try {
        await publishListing(id);
        toast.success('Listing published');
      } catch (err) {
        toast.error(getUserFacingErrorMessage(err, "We couldn't publish this listing. Please try again."));
      }
    });
  }

  function handleUnpublish(id: string) {
    startTransition(async () => {
      try {
        await unpublishListing(id);
        toast.success('Listing unpublished');
      } catch (err) {
        toast.error(getUserFacingErrorMessage(err, "We couldn't unpublish this listing. Please try again."));
      }
    });
  }

  function confirmArchive() {
    if (!archiveTarget) return;
    startTransition(async () => {
      try {
        await archiveListing(archiveTarget);
        toast.success('Listing archived');
        setArchiveTarget(null);
      } catch (err) {
        toast.error(getUserFacingErrorMessage(err, "We couldn't archive this listing. Please try again."));
      }
    });
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteListing(deleteTarget);
        toast.success('Listing deleted');
        setDeleteTarget(null);
      } catch (err) {
        toast.error(getUserFacingErrorMessage(err, "We couldn't delete this listing. Please try again."));
      }
    });
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Rent</TableHead>
            <TableHead className="hidden md:table-cell">Available</TableHead>
            <TableHead className="hidden lg:table-cell">Created</TableHead>
            <TableHead className="w-10 text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => {
            const rent = listing.price_cents != null
              ? `$${Math.round(listing.price_cents / 100).toLocaleString()}`
              : '—';

            return (
              <TableRow
                key={listing.id}
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/landlord/listings/${listing.id}`)}
              >
                <TableCell>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{listing.title}</p>
                    {listing.address && (
                      <p className="truncate text-xs text-muted-foreground">{listing.address}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[listing.status] ?? 'secondary'} className="capitalize text-xs">
                    {listing.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-foreground">
                  {rent}<span className="text-muted-foreground">/mo</span>
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">
                  {listing.available_date
                    ? new Date(listing.available_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'}
                </TableCell>
                <TableCell className="hidden lg:table-cell text-muted-foreground">
                  {new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm" aria-label="Open listing actions">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/landlord/listings/${listing.id}`}>
                          <Eye className="mr-2 size-3.5" /> View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/landlord/listings/${listing.id}/edit`}>
                          <Edit className="mr-2 size-3.5" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {listing.status === 'draft' && (
                        <DropdownMenuItem onSelect={() => handlePublish(listing.id)} disabled={isPending}>
                          <Globe className="mr-2 size-3.5" /> Publish
                        </DropdownMenuItem>
                      )}
                      {listing.status === 'published' && (
                        <DropdownMenuItem onSelect={() => handleUnpublish(listing.id)} disabled={isPending}>
                          <ArrowDownFromLine className="mr-2 size-3.5" /> Unpublish
                        </DropdownMenuItem>
                      )}
                      {listing.status !== 'archived' && (
                        <DropdownMenuItem onSelect={() => setArchiveTarget(listing.id)} disabled={isPending}>
                          <Archive className="mr-2 size-3.5" /> Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => setDeleteTarget(listing.id)}
                        disabled={isPending}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 size-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete listing"
        description="This will permanently delete this listing. This action cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        loading={isPending}
        onConfirm={confirmDelete}
      />
      <ConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(open) => !open && setArchiveTarget(null)}
        title="Archive listing"
        description="This listing will be removed from public view but can be restored later."
        confirmLabel="Archive"
        loading={isPending}
        onConfirm={confirmArchive}
      />
    </>
  );
}
