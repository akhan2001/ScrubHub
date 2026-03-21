/**
 * ListingMapPopup — HTML generators for Leaflet map popups and price pins.
 * Used in facility map and listing maps. Typed, real-estate focused.
 */

export type ListingStatusBadge =
  | 'instant_book'
  | 'verified'
  | 'available'
  | 'under_review';

export interface CreateListingPopupOptions {
  id: string;
  title: string;
  monthlyRent: number | null;
  beds?: number | null;
  baths?: number | null;
  sqft?: number | null;
  furnished?: boolean;
  status?: ListingStatusBadge;
  availableDate?: string | null;
  distanceToFacility?: number | null;
  facilityName?: string | null;
  photoUrl?: string | null;
  isVerifiedLandlord?: boolean;
  onViewListingId?: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatPriceCompact(cents: number | null): string {
  if (!cents) return 'N/A';
  const val = Math.round(cents / 100);
  if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
  return `$${val}`;
}

function formatPriceFull(cents: number | null): string {
  if (!cents) return 'Price on request';
  return `$${(cents / 100).toLocaleString()}`;
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

function formatDistance(km: number): string {
  if (km < 1) return `${(km * 1000).toFixed(0)} m`;
  return `${km.toFixed(1)} km`;
}

function statusBadgeHtml(status?: ListingStatusBadge): string {
  const badges: Record<ListingStatusBadge, { bg: string; color: string; text: string }> = {
    instant_book: { bg: '#EFF6FF', color: '#1D4ED8', text: 'Instant Book' },
    verified: { bg: '#F0FDF4', color: '#16a34a', text: 'Verified' },
    available: { bg: '#EFF6FF', color: '#1D4ED8', text: 'Available' },
    under_review: { bg: '#FEFCE8', color: '#ca8a04', text: 'Under Review' },
  };
  const b = status ? badges[status] : badges.available;
  return `<span style="display:inline-block;background:${b.bg};color:${b.color};border:1px solid ${b.color}40;border-radius:999px;padding:2px 8px;font-size:10px;font-weight:700;text-transform:uppercase;">${b.text}</span>`;
}

/**
 * Creates HTML for a Leaflet popup. Includes photo, beds/baths, status, distance, availability.
 */
export function createListingPopupHTML(options: CreateListingPopupOptions): string {
  const {
    id,
    title,
    monthlyRent,
    beds,
    baths,
    sqft,
    furnished,
    status = 'available',
    availableDate,
    distanceToFacility,
    facilityName,
    photoUrl,
    onViewListingId,
  } = options;

  const safeTitle = escapeHtml(title ?? 'Listing');
  const priceLabel = formatPriceFull(monthlyRent);
  const specs: string[] = [];
  if (beds != null) specs.push(`${beds} bed`);
  if (baths != null) specs.push(`${baths} bath`);
  if (sqft != null) specs.push(`${sqft} sqft`);
  if (furnished) specs.push('Furnished');
  const specsHtml = specs.length
    ? `<p style="margin:0 0 8px;font-size:11px;color:#6b7280;">${specs.join(' · ')}</p>`
    : '';

  const distanceHtml =
    distanceToFacility != null && facilityName
      ? `<p style="margin:0 0 8px;font-size:11px;color:#475569;display:flex;align-items:center;gap:4px;"><span style="font-size:10px;">📍</span> ${formatDistance(distanceToFacility)} to ${escapeHtml(facilityName)}</p>`
      : '';

  const availableHtml = availableDate
    ? `<p style="margin:0 0 8px;font-size:11px;color:#6b7280;">Available ${formatDate(availableDate)}</p>`
    : '';

  const photoHtml = photoUrl
    ? `<div style="width:100%;height:100px;border-radius:8px 8px 0 0;overflow:hidden;background:#f1f5f9;"><img src="${escapeHtml(photoUrl)}" alt="" style="width:100%;height:100%;object-fit:cover;" /></div>`
    : `<div style="width:100%;height:100px;border-radius:8px 8px 0 0;background:linear-gradient(135deg,#e2e8f0 0%,#cbd5e1 100%);display:flex;align-items:center;justify-content:center;"><span style="font-size:11px;color:#64748b;">No photo</span></div>`;

  const escapedId = String(id).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const onclick =
    onViewListingId != null
      ? `onclick="event.preventDefault();var fn=window.__facilityMapViewListing;if(fn)fn('${escapedId}');"`
      : '';

  return `
<div style="font-family:Inter,sans-serif;min-width:220px;max-width:280px;overflow:hidden;border-radius:12px;background:#fff;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
  ${photoHtml}
  <div style="padding:10px 12px;">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:6px;">
      <h4 style="margin:0;font-size:14px;font-weight:700;color:#0F172A;line-height:1.3;flex:1;">${safeTitle}</h4>
      ${statusBadgeHtml(status)}
    </div>
    <p style="margin:0 0 6px;font-size:15px;font-weight:700;color:#0F172A;">${priceLabel}<span style="font-size:12px;font-weight:500;color:#6b7280;">/mo</span></p>
    ${specsHtml}
    ${distanceHtml}
    ${availableHtml}
    <button type="button" ${onclick} style="
      display:block;width:100%;text-align:center;background:#2563eb;color:white;
      border-radius:8px;padding:8px 0;font-size:12px;font-weight:600;
      border:none;cursor:pointer;margin-top:10px;
    ">View Listing →</button>
  </div>
</div>`;
}

/**
 * Creates HTML for the map price pin (compact bubble on the map).
 * Status affects border/accent color; active/hovered adds scale.
 */
export function createPricePinHTML(
  monthlyRent: number | null,
  status?: ListingStatusBadge,
  options?: { active?: boolean; hovered?: boolean }
): string {
  const label = formatPriceCompact(monthlyRent);
  const isHighlight = options?.active || options?.hovered;
  const scale = isHighlight ? 'transform:scale(1.05);' : '';

  const statusColors: Record<ListingStatusBadge, { border: string; bg: string; color: string }> = {
    instant_book: { border: '#2563eb', bg: '#EFF6FF', color: '#1D4ED8' },
    verified: { border: '#16a34a', bg: '#F0FDF4', color: '#15803d' },
    available: { border: '#0f172a', bg: '#fff', color: '#0f172a' },
    under_review: { border: '#ca8a04', bg: '#FEFCE8', color: '#a16207' },
  };
  const c = status ? statusColors[status] : statusColors.available;

  const bg = isHighlight ? c.border : c.bg;
  const color = isHighlight ? '#fff' : c.color;
  const border = c.border;

  return `<div style="
    font-family:Inter,sans-serif;
    font-size:11px;font-weight:600;
    padding:4px 8px;
    border-radius:999px;
    border:2px solid ${border};
    background:${bg};
    color:${color};
    box-shadow:0 1px 4px rgba(0,0,0,0.2);
    white-space:nowrap;
    ${scale}
  ">${label}</div>`;
}
