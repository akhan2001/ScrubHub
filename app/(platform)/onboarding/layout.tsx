export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute -bottom-48 -left-48 h-[32rem] w-[32rem] rounded-full bg-primary/[0.03] blur-3xl" />
      </div>
      <div className="relative flex min-h-dvh flex-col items-center justify-center px-4 py-16">
        {children}
      </div>
    </div>
  );
}
