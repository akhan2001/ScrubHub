'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { EditJobPostForm } from '@/components/enterprise/edit-job-post-form';
import { deleteJobPost } from '@/actions/enterprise';
import type { JobPost } from '@/types/database';
import type { Listing } from '@/types/database';
import {
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  Home,
  Trash2,
  Pencil,
  Briefcase,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';

interface JobDetailSheetProps {
  job: JobPost | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgListings?: Pick<Listing, 'id' | 'title'>[];
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm first:pt-0 last:pb-0">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

export function JobDetailSheet({
  job,
  open,
  onOpenChange,
  orgListings = [],
}: JobDetailSheetProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!job) return null;

  const payRange =
    job.pay_range_min != null && job.pay_range_max != null
      ? `$${job.pay_range_min}–$${job.pay_range_max}/hr`
      : job.pay_range_min != null
        ? `From $${job.pay_range_min}/hr`
        : null;

  const hasOverview =
    job.facility_name || job.location || payRange || job.start_date || job.role_type || job.contract_type || job.contract_length;

  async function handleDelete() {
    if (!job) return;
    setIsDeleting(true);
    try {
      await deleteJobPost(job.id);
      toast.success('Job post deleted');
      setShowDeleteConfirm(false);
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error('Failed to delete job post');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleEditSuccess() {
    setIsEditing(false);
    router.refresh();
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="flex w-full flex-col overflow-hidden p-0 sm:max-w-lg">
          <SheetHeader className="shrink-0 border-b border-border px-6 py-5">
            <div className="flex flex-col gap-3 pr-8">
              <SheetTitle className="text-lg font-semibold leading-tight">{job.title}</SheetTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={job.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                  {job.status}
                </Badge>
                {job.housing_included && (
                  <Badge variant="outline" className="gap-1 font-normal">
                    <Home className="size-3.5" /> Housing included
                  </Badge>
                )}
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            {isEditing ? (
              <div className="p-6">
                <EditJobPostForm
                  job={job}
                  orgListings={orgListings}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setIsEditing(false)}
                />
              </div>
            ) : (
              <div className="space-y-6 p-6">
                {hasOverview && (
                  <Card className="border-border/80">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="size-4 text-muted-foreground" />
                        <h3 className="text-sm font-semibold text-foreground">Overview</h3>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-1 pt-0">
                      {job.facility_name && (
                        <InfoRow label="Facility" value={job.facility_name} />
                      )}
                      {job.location && (
                        <div className="flex justify-between gap-4 py-2 text-sm first:pt-0 last:pb-0">
                          <span className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
                            <MapPin className="size-3.5" /> Location
                          </span>
                          <span className="min-w-0 text-right font-medium text-foreground">{job.location}</span>
                        </div>
                      )}
                      {payRange && <InfoRow label="Pay range" value={payRange} />}
                      {job.start_date && (
                        <InfoRow label="Start date" value={new Date(job.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
                      )}
                      {(job.role_type || job.contract_type || job.contract_length) && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {job.role_type && <Badge variant="secondary" className="font-normal">{job.role_type}</Badge>}
                          {job.contract_type && <Badge variant="secondary" className="font-normal">{job.contract_type}</Badge>}
                          {job.contract_length && <Badge variant="secondary" className="font-normal">{job.contract_length}</Badge>}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Card className="border-border/80">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-muted-foreground" />
                      <h3 className="text-sm font-semibold text-foreground">Description</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                      {job.description || 'No description provided.'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {!isEditing && (
            <SheetFooter className="shrink-0 flex-row justify-end gap-2 border-t border-border px-6 py-4">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 size-3.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="mr-2 size-3.5" />
                Delete
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{job.title}&quot;. Applications for this job will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
