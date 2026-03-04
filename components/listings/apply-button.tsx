'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApplicationForm } from '@/components/listings/application-form';

export interface ProfileCompleteness {
  hasPaymentMethod: boolean;
  hasBackgroundConsent: boolean;
  hasIdDocument: boolean;
}

interface ApplyButtonProps {
  listingId: string;
  completeness: ProfileCompleteness;
}

export function ApplyButton({ listingId, completeness }: ApplyButtonProps) {
  const [showForm, setShowForm] = useState(false);

  const missingItems: { label: string; met: boolean }[] = [
    { label: 'Payment method', met: completeness.hasPaymentMethod },
    { label: 'Background check consent', met: completeness.hasBackgroundConsent },
    { label: 'ID verification', met: completeness.hasIdDocument },
  ];

  const allMet = missingItems.every((i) => i.met);

  if (showForm && allMet) {
    return (
      <ApplicationForm
        listingId={listingId}
        onCancel={() => setShowForm(false)}
        onSuccess={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={() => allMet && setShowForm(true)}
        disabled={!allMet}
        className="w-full"
        size="lg"
      >
        Apply for this listing
      </Button>

      {!allMet && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
          <p className="text-sm font-medium text-amber-800">
            Complete your profile to apply
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
                  {item.met ? item.label : `Add ${item.label.toLowerCase()} to apply`}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/dashboard/profile"
            className="inline-block text-xs font-medium text-primary hover:underline"
          >
            Go to Profile
          </Link>
        </div>
      )}
    </div>
  );
}
