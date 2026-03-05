'use client';

import { useEffect, useState, useTransition } from 'react';
import type { N9Notice } from '@/types/database';
import { N9LandlordCard } from '@/components/n9/N9LandlordCard';
import { getLandlordN9NoticesAction } from '@/actions/n9';

type EnrichedNotice = N9Notice & {
  lease_tenant_name: string | null;
  lease_address: string | null;
};

export function N9LandlordSection() {
  const [notices, setNotices] = useState<EnrichedNotice[]>([]);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getLandlordN9NoticesAction();
        setNotices(data);
      } catch {
        // Silently fail — section won't render
      }
    });
  }, []);

  if (notices.length === 0) return null;

  return <N9LandlordCard notices={notices} />;
}
