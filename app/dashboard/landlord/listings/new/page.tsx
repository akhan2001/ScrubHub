import { requireRole } from '@/server/guards/require-role';
import Link from 'next/link';
import { CreateListingForm } from '@/components/listings/CreateListingForm';

export default async function NewListingPage() {
  await requireRole('landlord');

  return (
    <div>
      <Link
        href="/dashboard/landlord/listings"
        className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline mb-4 inline-block"
      >
        ← Back to my listings
      </Link>
      <h1 className="text-xl font-semibold mb-6">Create listing</h1>
      <CreateListingForm />
    </div>
  );
}
