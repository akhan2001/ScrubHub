import { redirect } from 'next/navigation';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/facility-map?listing=${id}`);
}
