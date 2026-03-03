import Link from 'next/link';

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
    <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
      {/* Left: Branding panel with background image */}
      <div
        className="hidden lg:flex lg:w-[55%] bg-slate-900 p-12 flex-col justify-between bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/scrubhub-signin-background-image.png')" }}
      >
        <div className="absolute inset-0 bg-slate-900/70" aria-hidden />
        <div className="relative z-10 flex flex-1 flex-col justify-between">
          <div>
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
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {title}
            </h1>
            <p className="text-muted-foreground mt-2">
              {subtitle}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
