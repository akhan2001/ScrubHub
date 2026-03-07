import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { SiteHeaderWrapper } from "@/components/layout/site-header-wrapper";
import { SiteFooter } from "@/components/layout/site-footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScrubHub",
  description: "ScrubHub MVP marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased flex flex-col min-h-screen font-sans`}>
        <SiteHeaderWrapper />
        <div className="flex-1 flex flex-col">{children}</div>
        <SiteFooter />
        <Toaster position="bottom-right" closeButton />
      </body>
    </html>
  );
}
