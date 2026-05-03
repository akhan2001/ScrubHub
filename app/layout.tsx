import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0E1A2B",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.scrubhub.ca"),
  manifest: "/images/logo/site.webmanifest",
  icons: {
    icon: [{ url: "/images/logo/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/images/logo/favicon.svg",
    apple: "/images/logo/favicon.svg",
  },
  title: {
    default: "ScrubHub",
    template: "%s | ScrubHub",
  },
  description:
    "Healthcare housing and staffing for clinicians, landlords, and employers across Ontario’s 401 Corridor.",
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
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
        />
      </head>
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen font-sans`}>
        {children}
        <Toaster position="bottom-right" closeButton />
      </body>
    </html>
  );
}
