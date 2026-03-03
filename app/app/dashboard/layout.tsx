import { getSessionUser } from '@/server/auth/get-session-user';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <nav className="border-b border-border bg-card px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard" className="font-semibold">
              Dashboard
            </Link>
          </Button>
          <div className="flex gap-2">
            {session.role === 'landlord' && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/landlord">Landlord</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/landlord/listings">My listings</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href="/dashboard/landlord/listings/new">Create listing</Link>
                </Button>
              </>
            )}
            {session.role !== 'landlord' && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/onboarding">Set role</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 p-4 max-w-4xl mx-auto w-full">{children}</main>
    </div>
  );
}
