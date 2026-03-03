import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-4">ScrubHub</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-8">
        Find and manage rental listings.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/listings"
          className="rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 font-medium hover:opacity-90"
        >
          Browse listings
        </Link>
        <Link
          href="/login"
          className="rounded border border-zinc-300 dark:border-zinc-600 px-5 py-2.5 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
