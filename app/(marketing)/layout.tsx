import type { Metadata } from "next";
import { SiteHeaderWrapper } from "@/components/layout/site-header-wrapper";
import { SiteFooter } from "@/components/layout/site-footer";
import {
  MARKETING_DEFAULT_DESCRIPTION,
  MARKETING_DEFAULT_TITLE,
  MARKETING_SITE_URL,
} from "@/lib/marketing-site";

export const metadata: Metadata = {
  metadataBase: new URL(MARKETING_SITE_URL),
  title: {
    default: MARKETING_DEFAULT_TITLE,
    template: "%s | ScrubHub",
  },
  description: MARKETING_DEFAULT_DESCRIPTION,
  keywords: [
    "ScrubHub",
    "travel nurse housing",
    "healthcare housing",
    "hospital housing",
    "401 Corridor",
    "Ontario healthcare jobs",
    "locum housing",
    "medical staffing",
    "short-term rental healthcare",
    "landlord listings healthcare",
  ],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: MARKETING_SITE_URL,
    siteName: "ScrubHub",
    title: MARKETING_DEFAULT_TITLE,
    description: MARKETING_DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: MARKETING_DEFAULT_TITLE,
    description: MARKETING_DEFAULT_DESCRIPTION,
  },
};

export default function WWWLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeaderWrapper />
      <div className="flex-1 flex flex-col">{children}</div>
      <SiteFooter />
    </>
  );
}
