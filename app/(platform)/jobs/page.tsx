import { getPublishedJobPosts } from '@/server/services/job-posts.service';
import { JobCard } from '@/components/jobs/job-card';
import { Briefcase } from 'lucide-react';

export const metadata = {
  title: 'Job Board — ScrubHub',
  description: 'Healthcare job opportunities with optional housing.',
};

export default async function JobsPage() {
  const jobs = await getPublishedJobPosts();

  return (
    <div className="mx-auto w-full max-w-[var(--container-max)] px-4 py-8">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
          <Briefcase className="size-6" />
          Job Board
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Healthcare positions with optional housing — find your next assignment.
        </p>
      </div>

      {jobs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No published job posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} href={`/jobs/${job.id}`} />
          ))}
        </div>
      )}
    </div>
  );
}
