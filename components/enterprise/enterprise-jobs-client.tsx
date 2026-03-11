'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreateJobPostForm } from '@/components/enterprise/create-job-post-form';
import { JobDetailSheet } from '@/components/enterprise/job-detail-sheet';
import type { JobPost } from '@/types/database';
import type { Listing } from '@/types/database';
import { Plus } from 'lucide-react';

interface EnterpriseJobsClientProps {
  jobs: JobPost[];
  orgId: string;
  orgListings?: Pick<Listing, 'id' | 'title'>[];
}

export function EnterpriseJobsClient({
  jobs,
  orgId,
  orgListings = [],
}: EnterpriseJobsClientProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPost | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleRowClick(job: JobPost) {
    setSelectedJob(job);
    setSheetOpen(true);
  }

  function handleCreateSuccess() {
    setCreateOpen(false);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Current posts</CardTitle>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 size-4" />
                Create job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create job post</DialogTitle>
              </DialogHeader>
              <CreateJobPostForm
                orgId={orgId}
                orgListings={orgListings}
                onSuccess={handleCreateSuccess}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {!jobs.length ? (
            <p className="text-sm text-muted-foreground">No job posts yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(job)}
                  >
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>
                      <Badge variant={job.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(job.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <JobDetailSheet
        job={selectedJob}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        orgListings={orgListings}
      />
    </>
  );
}
