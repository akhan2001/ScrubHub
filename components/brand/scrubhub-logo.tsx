import Image from 'next/image';

type ScrubHubLogoProps = {
  /** Kept for call-site clarity; all variants use the transparent PNG. */
  variant?: 'light' | 'dark';
  className?: string;
  priority?: boolean;
};

const LOGO_SRC = '/images/scrubhub-logo-transparent.png';

/**
 * Brand wordmark + icon (asset includes “SCRUB HUB” text — do not add a second title next to it).
 */
export function ScrubHubLogo({ className, priority }: ScrubHubLogoProps) {
  return (
    <Image
      src={LOGO_SRC}
      alt="ScrubHub"
      width={200}
      height={56}
      priority={priority}
      className={className ?? 'h-8 w-auto object-contain object-left'}
    />
  );
}
