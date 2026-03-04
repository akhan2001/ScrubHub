import Link from 'next/link';
import { cn } from '@/lib/utils';

/** White header (breadcrumb → title → description) + full-width content body with bg-content. */
export function DashboardSection({
  title,
  description,
  breadcrumb,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  /** e.g. [{ label: 'Dashboard', href: '/dashboard' }, { label: 'Listings' }]. Last item = current page (no href). */
  breadcrumb?: { label: string; href?: string }[];
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('flex flex-col', className)}>
      <div className="border-b border-border bg-card px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto flex w-full max-w-[var(--container-max)] items-start justify-between gap-4">
          <div className="min-w-0 space-y-3">
            {breadcrumb && breadcrumb.length > 0 ? (
              <nav aria-label="Breadcrumb" className="text-sm">
                <ol className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
                  {breadcrumb.map((item, i) => (
                    <li key={i} className="inline-flex items-center gap-1.5">
                      {i > 0 ? (
                        <span aria-hidden className="select-none text-muted-foreground/80">
                          &gt;
                        </span>
                      ) : null}
                      {item.href ? (
                        <Link
                          href={item.href}
                          className="font-semibold text-primary transition-colors hover:underline"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">{item.label}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="max-w-3xl text-base text-muted-foreground md:text-lg">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </div>
      <div className="min-h-[40vh] flex-1 bg-content px-4 py-6 md:px-8">
        <div className="mx-auto w-full max-w-[var(--container-max)] space-y-6">{children}</div>
      </div>
    </section>
  );
}
