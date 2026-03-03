import { requireRole } from '@/server/guards/require-role';
import { getLandlordListingsCount } from '@/server/services/listings.service';
import Link from 'next/link';

export default async function LandlordDashboardPage() {
  const user = await requireRole('landlord');
  const count = await getLandlordListingsCount(user.id);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Landlord dashboard</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">
        You have <strong>{count}</strong> listing{count === 1 ? '' : 's'}.
      </p>
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard/landlord/listings"
          className="inline-block rounded border border-zinc-300 dark:border-zinc-600 px-4 py-2 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900"
        >
          My listings
        </Link>
        <Link
          href="/dashboard/landlord/listings/new"
          className="inline-block rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 font-medium hover:opacity-90"
        >
          Create listing
        </Link>
      </div>
    </div>
  );
}
