import { SiteHeaderWrapper } from '@/components/layout/site-header-wrapper';
import { SiteFooter } from '@/components/layout/site-footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeaderWrapper />
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      <SiteFooter />
    </>
  );
}
