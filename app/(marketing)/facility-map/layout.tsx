import type { Metadata } from 'next';
import { MARKETING_SITE_URL } from '@/lib/marketing-site';

export const metadata: Metadata = {
  title: 'Listings & map',
  description:
    'Browse healthcare-friendly housing near hospitals and clinics on an interactive 401 Corridor map. Filter by location, price, and availability.',
  openGraph: {
    url: `${MARKETING_SITE_URL}/facility-map`,
    title: 'Listings & map | ScrubHub',
    description:
      'Browse healthcare-friendly housing near hospitals and clinics on an interactive 401 Corridor map.',
  },
  twitter: {
    title: 'Listings & map | ScrubHub',
    description:
      'Browse healthcare-friendly housing near hospitals and clinics on an interactive 401 Corridor map.',
  },
};

export default function FacilityMapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Preload Leaflet CSS to reduce grey flash before map loads */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
        crossOrigin=""
      />
      {children}
    </>
  );
}
