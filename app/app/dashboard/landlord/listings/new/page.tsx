import { requireRole } from '@/server/guards/require-role';
import { redirect } from 'next/navigation';

export default async function NewListingPage() {
  await requireRole('landlord');
  redirect('/dashboard/landlord/listings?create=1');
}
