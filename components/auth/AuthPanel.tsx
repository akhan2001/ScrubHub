'use client';

/* =============================================================
   components/auth/AuthPanel.tsx — warm residential redesign
   Drop-in replacement. Keeps the same props (mode, children) so
   LoginForm / SignupForm slot in unchanged.
   ============================================================= */
import Link from 'next/link';

/** Gray and white concrete house — https://unsplash.com/photos/2keCPb73aQY (Dillon Kydd) */
const AUTH_HERO_IMAGE_SRC =
  'https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=2200&q=85&auto=format&fit=crop';

type AuthPanelProps = {
  mode: 'login' | 'signup';
  children: React.ReactNode;
};

const COPY = {
  login: {
    eyebrow: 'Member access',
    subtitle:
      'Sign in to manage stays, listings, and locum roles along the 401 Corridor — same tools as on the homepage.',
  },
  signup: {
    eyebrow: 'Create an account',
    subtitle: 'Sign up to list furnished housing or apply for credentialed roles.',
  },
} as const;

export function AuthPanel({ mode, children }: AuthPanelProps) {
  const { eyebrow, subtitle } = COPY[mode];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#F7F4EE] lg:flex-row">
      {/* ------------------------------------------------------------------ */}
      {/* Left: editorial cover                                              */}
      {/* ------------------------------------------------------------------ */}
      <aside className="relative hidden min-h-0 overflow-hidden lg:flex lg:w-[54%] flex-col">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary to-[#0d4a9e]"
          aria-hidden
        />
        <img
          src={AUTH_HERO_IMAGE_SRC}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-0 flex-1 flex-col justify-end p-12 text-white">
          <h2
            className="m-0 max-w-[16ch] font-medium tracking-[-0.04em] leading-[1.05]"
            style={{ fontSize: 'clamp(36px, 4.2vw, 56px)' }}
          >
            Find your next post.
            <br />
            <span className="font-normal italic text-white/95" style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}>
              Back to work
            </span>
          </h2>
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Right: form column                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto bg-[#F7F4EE] px-6 py-10 lg:p-12">
        <div className="w-full max-w-[440px]">
          <div className="mb-8">
            <div className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#6B7585]">
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#1E5BBE]" />
                {eyebrow}
              </span>
            </div>
            <h1
              className="m-0 font-medium tracking-[-0.04em] leading-[0.96] text-[#0E1A2B]"
              style={{ fontSize: 'clamp(34px, 4vw, 48px)' }}
            >
              {mode === 'login' ? (
                <>
                  Sign in
                  <span
                    className="ml-2 font-normal italic text-[#1E5BBE]"
                    style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                  >
                    to continue
                  </span>
                </>
              ) : (
                <>
                  Sign up
                  <span
                    className="ml-2 font-normal italic text-[#1E5BBE]"
                    style={{ fontFamily: '"Instrument Serif", Georgia, serif' }}
                  >
                    .
                  </span>
                </>
              )}
            </h1>
            <p className="mt-3 text-[15px] leading-[1.55] text-[#3A4759] m-0">
              {subtitle}
            </p>
          </div>

          {/* Form card — paper white, hairline border */}
          <div className="rounded-[28px] border border-[#E5DFD2] bg-white p-6 shadow-[0_30px_80px_rgba(14,26,43,0.08),0_4px_12px_rgba(14,26,43,0.04)] lg:p-7">
            {children}
          </div>

          {/* Footer line: opposite-mode link */}
          <p className="mt-6 text-center text-[13px] text-[#6B7585]">
            {mode === 'login' ? (
              <>
                New to ScrubHub?{' '}
                <Link href="/signup" className="font-semibold text-[#0E1A2B] transition-colors underline-offset-4 hover:text-primary hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already a member?{' '}
                <Link href="/login" className="font-semibold text-[#0E1A2B] transition-colors underline-offset-4 hover:text-primary hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
