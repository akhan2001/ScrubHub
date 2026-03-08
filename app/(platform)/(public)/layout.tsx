import { SiteHeaderWrapper } from "@/components/layout/site-header-wrapper";
import { SiteFooter } from "@/components/layout/site-footer";

export default function PublicPlatformLayout({
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
