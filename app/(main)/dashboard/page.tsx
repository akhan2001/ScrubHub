import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/server/auth/get-session-user';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await getSessionUser();

  if (session.role === 'landlord') {
    redirect('/dashboard/landlord');
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2 text-foreground">Dashboard</h1>
      <p className="text-muted-foreground mb-4">
        You are signed in as a <strong className="text-foreground">{session.role}</strong>. Tenant and enterprise features are coming soon.
      </p>
      <Button asChild>
        <Link href="/dashboard/onboarding">Change role (e.g. become a landlord)</Link>
      </Button>
    </div>
  );
}
