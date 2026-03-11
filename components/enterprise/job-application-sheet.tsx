'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getResumeSignedUrl } from '@/actions/job-applications';
import { FileText, ExternalLink, Loader2, Mail, Phone, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface JobApplicationForSheet {
  id: string;
  email: string;
  phone: string;
  job_title: string;
  job_post_id: string;
  status: string;
  created_at: string;
  cover_message: string | null;
}

interface JobApplicationSheetProps {
  application: JobApplicationForSheet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional: use a different resume fetcher (e.g. for tenant viewing own application) */
  getResumeUrl?: (applicationId: string) => Promise<string | null>;
}

function InfoRow({
  label,
  children,
  icon: Icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      {Icon && (
        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/60">
          <Icon className="size-3.5 text-muted-foreground" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  );
}

export function JobApplicationSheet({
  application,
  open,
  onOpenChange,
  getResumeUrl = getResumeSignedUrl,
}: JobApplicationSheetProps) {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  useEffect(() => {
    if (!open || !application) {
      setResumeUrl(null);
      return;
    }
    setResumeLoading(true);
    getResumeUrl(application.id)
      .then(setResumeUrl)
      .finally(() => setResumeLoading(false));
  }, [open, application?.id, getResumeUrl]);

  if (!application) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col overflow-hidden p-0 sm:max-w-md">
        <div className="border-b border-border bg-muted/30 px-6 py-5 pr-12">
          <SheetHeader className="space-y-1.5 text-left">
            <SheetTitle className="text-lg font-semibold tracking-tight">
              Application Details
            </SheetTitle>
            <SheetDescription className="text-sm font-medium text-foreground/80">
              {application.job_title}
            </SheetDescription>
          </SheetHeader>
          <Badge
            variant="secondary"
            className="mt-3 inline-flex capitalize tracking-wide"
          >
            {application.status}
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-1">
            <InfoRow label="Email" icon={Mail}>
              <a
                href={`mailto:${application.email}`}
                className="block truncate text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                {application.email}
              </a>
            </InfoRow>
            <InfoRow label="Phone" icon={Phone}>
              <a
                href={`tel:${application.phone}`}
                className="text-sm font-medium text-primary transition-colors hover:text-primary/80 hover:underline"
              >
                {application.phone}
              </a>
            </InfoRow>
            <InfoRow label="Applied" icon={Calendar}>
              <span className="text-sm text-foreground">
                {new Date(application.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </InfoRow>
          </div>

          <div className="mt-6">
            <h4 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Job posting
            </h4>
            <Link
              href={`/jobs/${application.job_post_id}`}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-primary/30 hover:bg-muted/50 hover:text-primary"
            >
              {application.job_title}
              <ExternalLink className="size-3.5 text-muted-foreground" />
            </Link>
          </div>

          <div className="mt-6">
            <h4 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Resume
            </h4>
            {resumeLoading ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading...
              </div>
            ) : resumeUrl ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-10 gap-2 font-medium"
              >
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <FileText className="size-4" />
                  View resume
                </a>
              </Button>
            ) : (
              <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                Resume unavailable
              </p>
            )}
          </div>

          {application.cover_message && (
            <div className="mt-6">
              <h4 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Cover message
              </h4>
              <div
                className={cn(
                  'rounded-lg border border-border/80 bg-muted/20 px-4 py-3.5',
                  'text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap'
                )}
              >
                {application.cover_message}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
