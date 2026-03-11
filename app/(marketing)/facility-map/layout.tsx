import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Listings | ScrubHub',
  description: '401 Corridor — Healthcare listings with hospitals, clinics, and healthcare spaces.',
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
