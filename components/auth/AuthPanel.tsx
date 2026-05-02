/* =============================================================
   components/auth/AuthPanel.tsx — warm residential redesign
   Drop-in replacement. Keeps the same props (mode, children) so
   LoginForm / SignupForm slot in unchanged.
   ============================================================= */
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ScrubHubLogo } from '@/components/brand/scrubhub-logo';

type AuthPanelProps = {
  mode: 'login' | 'signup';
  children: React.ReactNode;
};

const COPY = {
  login: {
    eyebrow: 'Welcome back',
    headline: ['Pick up where', 'you left off.'],
    subtitle: 'Log in to manage your listings, contracts, and shifts.',
  },
  signup: {
    eyebrow: 'Create an account',
    headline: ['Find your next post.', 'Move in by Sunday.'],
    subtitle: 'Sign up to list furnished housing or apply for credentialed roles.',
  },
} as const;

const QUOTES = {
  login: {
    line: '“Walked to my first shift in seven minutes.”',
    by: 'Priya N. — RN, Locum, 12-week placement',
  },
  signup: {
    line: '“Booked the unit, signed the lease, moved in the same night.”',
    by: 'Marcus T. — Anesthesia Resident, PGY-3',
  },
} as const;

export function AuthPanel({ mode, children }: AuthPanelProps) {
  const { eyebrow, headline, subtitle } = COPY[mode];
  const quote = QUOTES[mode];

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-[#F7F4EE] lg:flex-row">
      {/* ------------------------------------------------------------------ */}
      {/* Left: editorial cover                                              */}
      {/* ------------------------------------------------------------------ */}
      <aside
        className="relative hidden lg:flex lg:w-[54%] flex-col justify-between p-12 text-white"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(14,26,43,0) 0%, rgba(14,26,43,0.55) 100%), url('/images/scrubhub-signin-background-image.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Top: logo + back */}
        <div className="relative z-10 flex items-start justify-between">
          <Link href="/" className="inline-block" aria-label="ScrubHub Home">
            <ScrubHubLogo variant="dark" className="h-9 w-auto max-w-[200px] object-contain object-left" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em] uppercase text-white/75 hover:text-white transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to site
          </Link>
        </div>

        {/* Editorial caption — top-left of plate */}
        <div className="relative z-10 mt-12 mb-auto pt-12">
          <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/70 mb-4">
            <span className="inline-flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[#B8472E]" />
              Fig. 03 — Member entry
            </span>
          </div>
          <h2
            className="m-0 font-medium tracking-[-0.04em] leading-[0.96] max-w-[14ch]"
            style={{ fontSize: 'clamp(40px, 4.4vw, 64px)' }}
          >
            {headline[0]}
            <br />
            <span
              className="italic font-normal text-[#F0DAB1]"
              style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
            >
              {headline[1]}
            </span>
          </h2>
        </div>

        {/* Pull quote — bottom */}
        <div className="relative z-10 max-w-[460px]">
          <p
            className="m-0 italic leading-[1.25] text-2xl text-white"
            style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
          >
            {quote.line}
          </p>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mt-3 text-white/70">
            {quote.by}
          </p>
        </div>

        {/* Footer rule */}
        <div className="relative z-10 mt-10 pt-6 border-t border-white/15 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-white/55">
          <span>© ScrubHub Inc.</span>
          <span>Toronto · 401 Corridor</span>
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Right: form column                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 items-center justify-center bg-[#F7F4EE] p-6 lg:p-12">
        <div className="w-full max-w-[440px]">
          {/* Mobile-only logo */}
          <Link href="/" className="lg:hidden inline-block mb-8" aria-label="ScrubHub Home">
            <ScrubHubLogo variant="light" className="h-8 w-auto max-w-[180px] object-contain object-left" />
          </Link>

          <div className="mb-8">
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#6B7585] font-medium mb-3">
              {eyebrow}
            </div>
            <h1
              className="m-0 font-medium tracking-[-0.04em] leading-[0.96] text-[#0E1A2B]"
              style={{ fontSize: 'clamp(34px, 4vw, 48px)' }}
            >
              {mode === 'login' ? 'Sign in' : 'Sign up'}
              <span
                className="italic font-normal text-primary ml-2"
                style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
              >
                .
              </span>
            </h1>
            <p className="mt-3 text-[15px] leading-[1.55] text-[#3A4759] m-0">
              {subtitle}
            </p>
          </div>

          {/* Form card — paper white, hairline border */}
          <div className="rounded-2xl border border-[#E5DFD2] bg-white p-6 lg:p-7 shadow-[0_2px_8px_rgba(14,26,43,0.04)]">
            {children}
          </div>

          {/* Footer line: opposite-mode link */}
          <p className="mt-6 text-center text-[13px] text-[#6B7585]">
            {mode === 'login' ? (
              <>
                New to ScrubHub?{' '}
                <Link href="/signup" className="font-semibold text-[#0E1A2B] hover:text-primary transition-colors underline-offset-4 hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already a member?{' '}
                <Link href="/login" className="font-semibold text-[#0E1A2B] hover:text-primary transition-colors underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>

          <div className="mt-8 pt-6 border-t border-[#E5DFD2] flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase text-[#6B7585]">
            <span>PIPEDA · Canadian-soil data</span>
            <Link href="/privacy" className="hover:text-[#0E1A2B] transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
