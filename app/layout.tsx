import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.scrubhub.ca"),
  title: {
    default: "ScrubHub",
    template: "%s | ScrubHub",
  },
  description:
    "Healthcare housing and staffing marketplace. Find housing near hospitals, book short-term rentals, and connect with healthcare employers.",
  keywords: ["healthcare housing", "travel nurse housing", "hospital accommodation", "scrubhub", "healthcare staffing"],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://www.scrubhub.ca",
    siteName: "ScrubHub",
    title: "ScrubHub",
    description:
      "Healthcare housing and staffing marketplace. Find housing near hospitals, book short-term rentals, and connect with healthcare employers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScrubHub",
    description:
      "Healthcare housing and staffing marketplace. Find housing near hospitals, book short-term rentals, and connect with healthcare employers.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen font-sans`}>
        {children}
        <Toaster position="bottom-right" closeButton />
      </body>
    </html>
  );
}
