import { requireRole } from '@/server/guards/require-role';
import Link from 'next/link';
import { CreateListingForm } from '@/components/listings/CreateListingForm';
import { Button } from '@/components/ui/button';

export default async function NewListingPage() {
  await requireRole('landlord');

  return (
    <div>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/landlord/listings" className="mb-4 inline-block">
          ← Back to my listings
        </Link>
      </Button>
      <h1 className="text-xl font-semibold mb-6 text-foreground">Create listing</h1>
      <CreateListingForm />
    </div>
  );
}
