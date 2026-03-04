import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Building2, Briefcase } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Welcome to ScrubHub</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose how you want to use the platform. Your account connects you to the entire ecosystem.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Worker Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Stethoscope className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle>Healthcare Professional</CardTitle>
            <CardDescription>
              For nurses, techs, and staff seeking housing or jobs.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-6">
            <Button asChild className="w-full">
              <Link href="/onboarding/worker">Get Started</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Landlord Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>Landlord</CardTitle>
            <CardDescription>
              For property owners listing units for healthcare workers.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-6">
            <Button asChild variant="outline" className="w-full">
              <Link href="/onboarding/landlord">List Property</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Enterprise Card */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>
              For hospitals and agencies managing housing at scale.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-6">
            <Button asChild variant="outline" className="w-full">
              <Link href="/onboarding/enterprise">Create Organization</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
