import Link from 'next/link';
import { getPublishedJobPosts } from '@/server/services/job-posts.service';
import { StaffingJobsGrid } from '@/components/jobs/staffing-jobs-grid';
import { getAppLoginUrl, getAppSignupUrl } from '@/lib/app-url';

export default async function StaffingPage() {
  const jobs = await getPublishedJobPosts();

  return (
    <div
      className="flex-1"
      style={{
        background: '#f0f4fa',
        backgroundImage:
          'linear-gradient(rgba(0,31,63,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,31,63,0.04) 1px,transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    >
      <main className="mx-auto max-w-[88rem] w-full px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight mb-2">
            Open Staffing Positions
          </h1>
          <p className="text-[#4a5568] text-base">
            Locum, contract, and permanent positions across hospitals and clinics in the 401
            Corridor. Updated daily — apply directly through ScrubHub.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-[#d0d9e8] bg-white p-12 text-center shadow-sm">
            <p className="text-[#4a5568]">No open positions at the moment. Check back soon!</p>
          </div>
        ) : (
          <StaffingJobsGrid jobs={jobs} />
        )}

        <div className="mt-16 rounded-2xl border border-[#d0d9e8] bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-extrabold text-[#0F172A] mb-2">
            Need to post a position for your facility?
          </h2>
          <p className="text-[#4a5568] mb-6 max-w-md mx-auto">
            Create an institution account to post staffing needs and reach verified, credentialed
            healthcare professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={getAppSignupUrl()}
              className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-3.5 transition-all shadow-md"
            >
              Post a Role
            </Link>
            <Link
              href={getAppLoginUrl()}
              className="inline-flex items-center gap-2 rounded-xl border border-border text-muted-foreground font-semibold px-8 py-3.5 hover:border-primary/50 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
