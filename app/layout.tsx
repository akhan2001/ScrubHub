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
  manifest: "/images/logo/site.webmanifest",
  themeColor: "#2563eb",
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
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen font-sans`}>
        {children}
        <Toaster position="bottom-right" closeButton />
      </body>
    </html>
  );
}
