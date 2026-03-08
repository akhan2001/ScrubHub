# Facility Map — How to Change the UI

A short guide for customizing the facility map components.

## Where to Edit What

| What you want to change | File to edit |
|-------------------------|--------------|
| **Facility marker colors** (hospital/clinic/urgent) | `hooks/use-facility-map.ts` — search for `col = isUrgent` and the `L.divIcon` blocks |
| **Facility popup content** | `hooks/use-facility-map.ts` — the `popup` template string inside the `facilities.forEach` loop |
| **Listing marker style** (price pill) | `hooks/use-facility-map.ts` — the second `useEffect` with `addListingMarkers`; edit the `icon` `html` and `popup` template |
| **Cluster colors/sizes** | `hooks/use-facility-map.ts` — `iconCreateFunction` inside `L.markerClusterGroup` |
| **Legend items** | `components/facility-map/FacilityMapLegend.tsx` — the arrays of `{ col, label }` |
| **Search bar** | `components/facility-map/FacilitySearch.tsx` — input, dropdown, and result styling |
| **CTA card** | `components/facility-map/FacilityMapCTA.tsx` |
| **Map height** | `app/(marketing)/facility-map/page.tsx` — the `min-h-[600px]` class on the map container |

## Quick Examples

**Change facility marker size:** In `use-facility-map.ts`, find `iconSize: [14, 14]` and `iconAnchor: [7, 7]` and adjust both (anchor = half of size).

**Change listing marker color:** In the `addListingMarkers` effect, edit the `html` style: e.g. `background:#22c55e` for green.

**Add a legend item:** In `FacilityMapLegend.tsx`, add `{ col: '#hex', label: 'Your label' }` to the first array.
