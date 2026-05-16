'use client';

import Link from 'next/link';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ProfileCompleteness {
  /** Reserved for future payment-method requirement; kept for callers that still pass it. */
  hasPaymentMethod?: boolean;
  hasBackgroundConsent: boolean;
  hasIdDocument: boolean;
}

interface ApplyButtonProps {
  listingId: string;
  completeness: ProfileCompleteness;
}

/**
 * Apply CTA shown on a listing card / facility-map detail. The actual form lives at
 * /listings/[listingId]/apply (marketing) — this is just the entry point + profile-readiness hint.
 */
export function ApplyButton({ listingId, completeness }: ApplyButtonProps) {
  const missingItems = [
    { label: 'Background check consent', met: completeness.hasBackgroundConsent },
    { label: 'ID verification', met: completeness.hasIdDocument },
  ];
  const allMet = missingItems.every((i) => i.met);

  return (
    <div className="space-y-3">
      <Button asChild className="w-full" size="lg">
        <Link href={`/listings/${listingId}/apply`}>Apply for this listing</Link>
      </Button>

      {!allMet && (
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <p className="text-sm font-medium text-amber-800">
            You can start the application — finish these on the next page or in your profile:
          </p>
          <ul className="space-y-1">
            {missingItems.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-xs">
                {item.met ? (
                  <CheckCircle2 className="size-3.5 text-green-600" />
                ) : (
                  <AlertTriangle className="size-3.5 text-amber-600" />
                )}
                <span className={item.met ? 'text-green-800' : 'text-amber-800'}>
                  {item.met ? item.label : `Add ${item.label.toLowerCase()}`}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/profile"
            className="inline-block text-xs font-medium text-primary hover:underline"
          >
            Go to profile
          </Link>
        </div>
      )}
    </div>
  );
}
