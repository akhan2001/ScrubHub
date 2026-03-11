'use client';

import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Calendar,
  MessageSquare,
  ExternalLink,
  Home,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import type { BookingStatus } from '@/types/database';
import { cn } from '@/lib/utils';

export interface BookingForSheet {
  id: string;
  listing_id: string;
  status: BookingStatus;
  requested_at: string;
  move_in_date_requested: string | null;
  message_to_landlord: string | null;
  listing_title: string | null;
  listing_address: string | null;
  listing_price_cents: number | null;
}

interface BookingDetailSheetProps {
  booking: BookingForSheet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function InfoRow({
  label,
  children,
  icon: Icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      {Icon && (
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/60">
          <Icon className="size-3.5 text-muted-foreground" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function formatPrice(cents: number | null) {
  if (!cents) return 'Price on request';
  return `$${Math.round(cents / 100).toLocaleString()}/mo`;
}

function getStatusConfig(status: BookingStatus) {
  const configs: Record<
    BookingStatus,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ComponentType<{ className?: string }>; nextStep: string }
  > = {
    requested: {
      label: 'Submitted',
      variant: 'secondary',
      icon: Clock,
      nextStep: 'Your application has been sent. The landlord will review it shortly.',
    },
    reviewing: {
      label: 'Under review',
      variant: 'secondary',
      icon: AlertCircle,
      nextStep: 'The landlord is reviewing your application. You\'ll be notified when a decision is made.',
    },
    approved: {
      label: 'Approved',
      variant: 'default',
      icon: CheckCircle2,
      nextStep: 'Congratulations! Check your Tenancy page for lease details and next steps.',
    },
    rejected: {
      label: 'Not approved',
      variant: 'destructive',
      icon: XCircle,
      nextStep: 'This application wasn\'t approved. Browse other listings to find your next place.',
    },
    cancelled: {
      label: 'Cancelled',
      variant: 'outline',
      icon: XCircle,
      nextStep: 'This booking was cancelled. You can apply for other listings anytime.',
    },
    completed: {
      label: 'Completed',
      variant: 'default',
      icon: CheckCircle2,
      nextStep: 'This tenancy has been completed. Thank you for using ScrubHub.',
    },
    withdrawn: {
      label: 'Withdrawn',
      variant: 'outline',
      icon: XCircle,
      nextStep: 'You withdrew this application. Browse listings to apply for a new place.',
    },
  };
  return configs[status] ?? configs.requested;
}

export function BookingDetailSheet({
  booking,
  open,
  onOpenChange,
}: BookingDetailSheetProps) {
  if (!booking) return null;

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col overflow-hidden p-0 sm:max-w-md">
        <SheetHeader className="shrink-0 border-b border-border px-4 py-4">
          <SheetTitle className="text-lg">
            {booking.listing_title ?? 'Property'}
          </SheetTitle>
          <SheetDescription>
            Booking application details
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {/* Status */}
          <div className="mb-6 rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <StatusIcon className="size-4 text-muted-foreground" />
              <Badge variant={statusConfig.variant} className="capitalize">
                {statusConfig.label}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {statusConfig.nextStep}
            </p>
          </div>

          {/* Property details */}
          <div className="space-y-1">
            <InfoRow label="Property" icon={Home}>
              <p className="font-medium text-foreground">
                {booking.listing_title ?? 'Untitled listing'}
              </p>
              {booking.listing_address && (
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-3.5 shrink-0" />
                  {booking.listing_address}
                </p>
              )}
            </InfoRow>

            {booking.listing_price_cents != null && (
              <InfoRow label="Monthly rent" icon={DollarSign}>
                <p className="font-semibold text-foreground">
                  {formatPrice(booking.listing_price_cents)}
                </p>
              </InfoRow>
            )}

            <InfoRow label="Applied" icon={Calendar}>
              <p className="text-sm">
                {new Date(booking.requested_at).toLocaleDateString(undefined, {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </InfoRow>

            {booking.move_in_date_requested && (
              <InfoRow label="Requested move-in" icon={Calendar}>
                <p className="text-sm">
                  {new Date(booking.move_in_date_requested).toLocaleDateString()}
                </p>
              </InfoRow>
            )}

            {booking.message_to_landlord && (
              <InfoRow label="Message to landlord" icon={MessageSquare}>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {booking.message_to_landlord}
                </p>
              </InfoRow>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-2">
            <Button asChild variant="default" className="w-full">
              <Link href={`/facility-map?listing=${booking.listing_id}`}>
                <ExternalLink className="mr-2 size-4" />
                View listing
              </Link>
            </Button>
            {booking.status === 'approved' && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/tenant/tenancy">
                  <Home className="mr-2 size-4" />
                  Go to Tenancy
                </Link>
              </Button>
            )}
            {(booking.status === 'rejected' || booking.status === 'cancelled' || booking.status === 'withdrawn') && (
              <Button asChild variant="outline" className="w-full">
                <Link href="/facility-map">Browse more listings</Link>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
