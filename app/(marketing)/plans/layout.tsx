import type { Metadata } from 'next';
import { MARKETING_SITE_URL } from '@/lib/marketing-site';

export const metadata: Metadata = {
  title: 'Plans & pricing',
  description:
    'ScrubHub membership plans for tenants, landlords, and enterprise—listings, bookings, staffing tools, and concierge support built for healthcare.',
  openGraph: {
    url: `${MARKETING_SITE_URL}/plans`,
    title: 'Plans & pricing | ScrubHub',
    description:
      'Compare plans for housing, listings, and staffing across the 401 Corridor.',
  },
  twitter: {
    title: 'Plans & pricing | ScrubHub',
    description:
      'Compare plans for housing, listings, and staffing across the 401 Corridor.',
  },
};

export default function PlansLayout({ children }: { children: React.ReactNode }) {
  return children;
}
