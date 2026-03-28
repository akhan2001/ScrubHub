import Link from 'next/link';
import { ScrubHubLogo } from '@/components/brand/scrubhub-logo';

type AuthPanelProps = {
  mode: 'login' | 'signup';
  children: React.ReactNode;
};

const COPY = {
  login: {
    title: 'Welcome Back!',
    subtitle: 'Log in to manage your listings and connect with tenants.',
    backLink: '/',
  },
  signup: {
    title: 'Create an Account',
    subtitle: 'Sign up to list properties and grow your rental business.',
    backLink: '/',
  },
} as const;

export function AuthPanel({ mode, children }: AuthPanelProps) {
  const { title, subtitle, backLink } = COPY[mode];

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background lg:flex-row">
      {/* Left: Branding panel with background image */}
      <div
        className="relative hidden bg-slate-900 bg-cover bg-center bg-no-repeat p-12 lg:flex lg:w-[56%] lg:flex-col lg:justify-between"
        style={{ backgroundImage: "url('/images/scrubhub-signin-background-image.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-blue-900/60" aria-hidden />
        <div className="relative z-10 flex flex-1 flex-col justify-between">
          <div className="space-y-6">
            <Link href="/" className="inline-block" aria-label="ScrubHub Home">
              <ScrubHubLogo variant="dark" className="h-10 w-auto max-w-[220px] object-contain object-left" />
            </Link>
            <Link
              href={backLink}
              className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
            >
              ← Back to Website
            </Link>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
              Find Spaces. List Properties. Grow Your Business.
            </h2>
            <p className="text-slate-300 text-lg max-w-md">
              From practitioner housing to clinical suites, ScrubHub connects landlords and healthcare professionals across the 401 Corridor.
            </p>
          </div>
          <div className="text-slate-500 text-sm">
            © ScrubHub
          </div>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="flex flex-1 items-center justify-center bg-background p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {subtitle}
            </p>
          </div>
          <div className="rounded-[var(--card-radius)] border border-border bg-card p-6 shadow-[var(--card-shadow)] lg:p-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
