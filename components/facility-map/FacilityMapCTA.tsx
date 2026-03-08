import Link from 'next/link';

export function FacilityMapCTA() {
  return (
    <div className="absolute top-4 right-4 z-[1000] rounded-xl border border-[#d0d9e8] bg-white/95 backdrop-blur-sm p-4 max-w-xs shadow-lg">
      <p className="font-bold text-foreground text-sm mb-1">
        Find Housing Near Your Hospital
      </p>
      <p className="text-xs text-[#6b7280] mb-3">
        Click any pin to view listings and availability. Sign up to book a space
        near your facility.
      </p>
      <Link
        href="/signup"
        className="block text-center rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold py-2.5 transition-all"
      >
        Sign Up to Book
      </Link>
    </div>
  );
}
