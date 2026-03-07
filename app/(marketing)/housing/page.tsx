/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { CheckCircle, Zap, X } from 'lucide-react';

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const NEARBY_FACILITIES = [
  { name: 'Toronto General Hospital', lat: 43.6596, lng: -79.3877, type: 'Hospital' },
  { name: 'Mount Sinai Hospital', lat: 43.6575, lng: -79.3900, type: 'Hospital' },
  { name: 'Toronto Western Hospital', lat: 43.6533, lng: -79.4148, type: 'Hospital' },
  { name: 'Humber River Hospital', lat: 43.7461, lng: -79.5370, type: 'Hospital' },
  { name: 'Sunnybrook Health Sciences', lat: 43.7192, lng: -79.3785, type: 'Hospital' },
  { name: "St. Michael's Hospital", lat: 43.653, lng: -79.3777, type: 'Hospital' },
  { name: "St. Joseph's Health Centre", lat: 43.6453, lng: -79.4589, type: 'Hospital' },
  { name: 'Trillium Health — Credit Valley', lat: 43.5813, lng: -79.7299, type: 'Hospital' },
  { name: 'Brampton Civic Hospital', lat: 43.7315, lng: -79.7624, type: 'Hospital' },
  { name: 'Southlake Regional Medical', lat: 44.0564, lng: -79.4674, type: 'Hospital' },
  { name: 'Grand River Hospital', lat: 43.4553, lng: -80.4897, type: 'Hospital' },
  { name: "St. Mary's General Hospital", lat: 43.4495, lng: -80.495, type: 'Hospital' },
  { name: 'Waterloo Regional Hospital', lat: 43.4643, lng: -80.5204, type: 'Hospital' },
  { name: 'Guelph General Hospital', lat: 43.5461, lng: -80.2513, type: 'Hospital' },
  { name: 'Cambridge Memorial Hospital', lat: 43.3729, lng: -80.3132, type: 'Hospital' },
  { name: 'Bathurst & Clark Medical', lat: 43.7982, lng: -79.443, type: 'Clinic' },
  { name: 'Yonge & Sheppard Medical Centre', lat: 43.7615, lng: -79.4105, type: 'Clinic' },
  { name: 'Rouge Valley Centenary', lat: 43.7834, lng: -79.1919, type: 'Hospital' },
  { name: 'North York General Hospital', lat: 43.7611, lng: -79.4105, type: 'Hospital' },
  { name: 'Mackenzie Health Richmond Hill', lat: 43.8701, lng: -79.4396, type: 'Hospital' },
];

const DEMO_LISTINGS = [
  {
    id: 1,
    badge: 'VERIFIED',
    lat: 43.6533,
    lng: -79.41,
    title: '2BR — Toronto Western Proximity',
    address: '145 Dovercourt Rd, Toronto, ON',
    proximity: '0.3km to Toronto Western',
    tags: ['2BR', '1BA', 'Furnished', 'Transit'],
    price: '$2,150/mo',
    img: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
  },
  {
    id: 2,
    badge: 'INSTANT',
    lat: 43.6575,
    lng: -79.39,
    title: 'Furnished 1BR — Toronto Downtown Medical',
    address: '200 University Ave, Toronto, ON',
    proximity: '0.3km to Toronto Western',
    tags: ['1BR', '1BA', 'Furnished', 'Transit', 'Concierge'],
    price: '$2,800/mo',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
  },
  {
    id: 3,
    badge: 'VERIFIED',
    lat: 43.7315,
    lng: -79.76,
    title: '2BR — Brampton Civic Hospital Area',
    address: '22 Knightsbridge Rd, Brampton, ON',
    proximity: '0.5km to Brampton Civic',
    tags: ['2BR', '1BA', 'Furnished', 'Parking'],
    price: '$2,100/mo',
    img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
  },
  {
    id: 4,
    badge: 'VERIFIED',
    lat: 43.5813,
    lng: -79.725,
    title: '3BR — Mississauga Hospital Corridor',
    address: '1400 Hurontario St, Mississauga, ON',
    proximity: '0.8km to Trillium',
    tags: ['3BR', '2BA', 'Garage', 'Furnished', 'Utilities'],
    price: '$2,600/mo',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
  },
  {
    id: 5,
    badge: 'VERIFIED',
    lat: 43.4553,
    lng: -80.4897,
    title: '1BR — Kitchener Grand River Proximity',
    address: '55 Duke St W, Kitchener, ON',
    proximity: '0.6km to Grand River Hospital',
    tags: ['1BR', '1BA', 'Furnished', 'Laundry'],
    price: '$1,450/mo',
    img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
  },
  {
    id: 6,
    badge: 'INSTANT',
    lat: 43.4643,
    lng: -80.5204,
    title: '2BR — Waterloo University Corridor',
    address: '18 Allen St E, Waterloo, ON',
    proximity: '1.1km to Waterloo Regional',
    tags: ['2BR', '1BA', 'Parking', 'Pets OK'],
    price: '$1,750/mo',
    img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80',
  },
  {
    id: 7,
    badge: 'VERIFIED',
    lat: 43.5461,
    lng: -80.2513,
    title: '2BR — Guelph General Proximity',
    address: '89 Gordon St, Guelph, ON',
    proximity: '0.6km to Guelph General',
    tags: ['2BR', '1BA', 'Parking', 'Laundry'],
    price: '$2,050/mo',
    img: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600&q=80',
  },
  {
    id: 8,
    badge: 'VERIFIED',
    lat: 44.0564,
    lng: -79.4618,
    title: '3BR — Newmarket Southlake District',
    address: '472 Davis Dr, Newmarket, ON',
    proximity: '0.4km to Southlake Regional',
    tags: ['3BR', '2BA', 'Garage', 'Backyard'],
    price: '$2,400/mo',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  },
];

const FILTERS = ['All Units', 'Instant Book', 'Furnished', 'Parking Included', '1BR', '2BR', '3BR+'];

type Listing = (typeof DEMO_LISTINGS)[0];

function ListingMapModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const mapElRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const nearby = NEARBY_FACILITIES.map((f) => ({
    ...f,
    dist: haversineKm(listing.lat, listing.lng, f.lat, f.lng),
  }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, 8);

  useEffect(() => {
    let destroyed = false;

    const initMap = () => {
      if (destroyed) return;
      if (!mapElRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (_) {}
        mapInstanceRef.current = null;
      }
      if ((mapElRef.current as any)._leaflet_id) {
        delete (mapElRef.current as any)._leaflet_id;
      }

      const map = L.map(mapElRef.current, { center: [listing.lat, listing.lng], zoom: 13 });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      const houseIcon = L.divIcon({
        html: `<div style="background:#2563eb;color:white;border:3px solid white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.25);">🏠</div>`,
        className: '',
        iconAnchor: [18, 18],
      });
      L.marker([listing.lat, listing.lng], { icon: houseIcon })
        .addTo(map)
        .bindPopup(`<strong>${listing.title}</strong><br>${listing.price}`)
        .openPopup();

      const facilityColor = (type: string) => (type === 'Hospital' ? '#2563eb' : '#475569');
      nearby.forEach((f, i) => {
        const numIcon = L.divIcon({
          html: `<div style="background:${facilityColor(f.type)};color:white;border:2px solid white;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,0.2);">${i + 1}</div>`,
          className: '',
          iconAnchor: [14, 14],
        });
        L.marker([f.lat, f.lng], { icon: numIcon })
          .addTo(map)
          .bindPopup(`<strong>${f.name}</strong><br>${f.type} · ${f.dist.toFixed(1)} km away`);
        L.polyline(
          [
            [listing.lat, listing.lng],
            [f.lat, f.lng],
          ],
          { color: facilityColor(f.type), weight: 1.5, opacity: 0.5, dashArray: '6,4' }
        ).addTo(map);
      });

      const allCoords: [number, number][] = [
        [listing.lat, listing.lng],
        ...nearby.map((f) => [f.lat, f.lng] as [number, number]),
      ];
      map.fitBounds(allCoords, { padding: [40, 40] });
    };

    const raf = requestAnimationFrame(() => {
      if ((window as any).L) {
        initMap();
      } else {
        if (!document.querySelector('link[href*="leaflet@1.9.4"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }
        if (!document.querySelector('script[src*="leaflet@1.9.4"]')) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = initMap;
          document.head.appendChild(script);
        } else {
          const poll = setInterval(() => {
            if ((window as any).L) {
              clearInterval(poll);
              initMap();
            }
          }, 50);
        }
      }
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (_) {}
        mapInstanceRef.current = null;
      }
    };
  }, [listing]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between p-5 border-b border-[#eeeeee]">
          <div>
            <h2 className="font-bold text-[#0F172A] text-lg">{listing.title}</h2>
            <p className="text-sm text-[#6b7280] mt-0.5">{listing.address}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-[#f0f4fa] transition-colors ml-4 shrink-0"
          >
            <X className="size-5 text-[#6b7280]" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden" style={{ minHeight: 400 }}>
          <div ref={mapElRef} className="flex-1" />

          <div className="w-64 shrink-0 border-l border-[#eeeeee] flex flex-col overflow-y-auto bg-[#f8fafd]">
            <div className="p-4 border-b border-[#eeeeee] bg-white">
              <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Nearby Practices</p>
              <p className="text-xs text-[#6b7280] mt-0.5">Sorted by distance</p>
            </div>
            {nearby.map((f, i) => (
              <div
                key={f.name}
                className="flex items-start gap-3 px-4 py-3 border-b border-[#eeeeee] hover:bg-white transition-colors"
              >
                <span
                  className={`shrink-0 flex size-6 items-center justify-center rounded-full text-white text-xs font-bold mt-0.5 ${f.type === 'Hospital' ? 'bg-primary' : 'bg-slate-600'}`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-xs font-semibold text-[#0F172A] leading-snug">{f.name}</p>
                  <p className="text-xs text-[#6b7280] mt-0.5">
                    {f.type} · <span className="text-primary font-semibold">{f.dist.toFixed(1)} km</span>
                  </p>
                </div>
              </div>
            ))}
            <div className="p-4 mt-auto">
              <Link
                href="/signup"
                className="block text-center rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold py-3 transition-all"
              >
                Book This Unit
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingCard({ l, onMapClick }: { l: Listing; onMapClick: (l: Listing) => void }) {
  return (
    <div className="rounded-2xl border border-[#d0d9e8] bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,31,63,0.06)] hover:shadow-[0_8px_24px_rgba(29,111,216,0.13)] hover:-translate-y-1 transition-all duration-200">
      <div className="relative h-44 overflow-hidden">
        <img src={l.img} alt={l.title} className="w-full h-full object-cover" />
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${l.badge === 'VERIFIED' ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}
        >
          {l.badge === 'VERIFIED' ? <CheckCircle className="size-3" /> : <Zap className="size-3" />}
          {l.badge}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-[#0F172A] text-sm leading-snug mb-1">{l.title}</h3>
        <p className="text-xs text-[#6b7280] mb-1">{l.address}</p>
        <p className="text-xs font-semibold text-primary mb-3">{l.proximity}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {l.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-[#d0d9e8] bg-[#f8fafd] px-2.5 py-0.5 text-xs text-[#374151] font-medium"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-extrabold text-[#0F172A]">{l.price}</span>
          <div className="flex gap-2">
            <button
              onClick={() => onMapClick(l)}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-white hover:bg-primary/5 hover:border-primary/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-all"
            >
              Map
            </button>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-lg bg-primary hover:bg-primary/90 px-4 py-1.5 text-xs font-bold text-primary-foreground transition-all"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HousingPage() {
  const [activeFilter, setActiveFilter] = useState('All Units');
  const [mapListing, setMapListing] = useState<Listing | null>(null);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: '#f0f4fa',
        backgroundImage:
          'linear-gradient(rgba(0,31,63,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,31,63,0.04) 1px,transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <main className="flex-1 mx-auto max-w-[88rem] w-full px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">401 Corridor</p>
          <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2">Practitioner Housing</h1>
          <p className="text-[#4a5568] text-base">
            Verified residences close to hospitals and clinics. Book online, anytime — 24/7. All units are
            practitioner-verified and within clinical proximity.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition-all duration-150 ${
                activeFilter === f
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-white text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_LISTINGS.map((l) => (
            <ListingCard key={l.id} l={l} onMapClick={setMapListing} />
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-[#d0d9e8] bg-white p-10 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-[#0F172A] mb-2">Don&apos;t see what you need?</p>
          <p className="text-[#4a5568] mb-6 max-w-md mx-auto">
            Create a free account and let MIA match you to verified listings near your hospital or clinic.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3.5 transition-all shadow-md"
          >
            Sign Up Free
          </Link>
        </div>
      </main>

      {mapListing && <ListingMapModal listing={mapListing} onClose={() => setMapListing(null)} />}
    </div>
  );
}
