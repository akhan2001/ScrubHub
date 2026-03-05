import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConfirmSuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="flex max-w-sm flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckCircle2 className="size-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">Email verified</h1>
          <p className="text-muted-foreground">
            Your email has been confirmed. You can sign in to your account.
          </p>
        </div>
        <Button asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
