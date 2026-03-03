import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-4 text-foreground">
        ScrubHub
      </h1>
      <p className="text-muted-foreground mb-8">
        Find and manage rental listings.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/listings">Browse listings</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </div>
  );
}
