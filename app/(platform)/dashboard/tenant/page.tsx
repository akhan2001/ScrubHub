import { redirect } from 'next/navigation';

export default function TenantDashboardPage() {
  redirect('/dashboard/tenant/bookings');
}
