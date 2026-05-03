import type { Metadata } from 'next';
import { MARKETING_SITE_URL } from '@/lib/marketing-site';

export const metadata: Metadata = {
  title: 'Listings & facility map',
  description:
    'Furnished housing within walking distance of every hospital along the Ontario 401 Corridor.',
  openGraph: {
    url: `${MARKETING_SITE_URL}/facility-map`,
    title: 'Listings & facility map | ScrubHub',
    description: 'Find verified housing within walking distance of Ontario hospitals.',
  },
};

export default function FacilityMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col bg-[#F7F4EE] text-[#0E1A2B]">{children}</div>
  );
}
