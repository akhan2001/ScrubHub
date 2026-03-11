'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  JobApplicationSheet,
  type JobApplicationForSheet,
} from '@/components/enterprise/job-application-sheet';
import { getResumeSignedUrlForTenant } from '@/actions/job-applications';
import { cn } from '@/lib/utils';

interface TenantJobApplicationsTableProps {
  applications: JobApplicationForSheet[];
}

export function TenantJobApplicationsTable({
  applications,
}: TenantJobApplicationsTableProps) {
  const [selected, setSelected] = useState<JobApplicationForSheet | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  function handleRowClick(app: JobApplicationForSheet) {
    setSelected(app);
    setSheetOpen(true);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow
              key={app.id}
              className={cn(
                'cursor-pointer transition-colors hover:bg-muted/70',
                selected?.id === app.id && 'bg-muted/50'
              )}
              onClick={() => handleRowClick(app)}
            >
              <TableCell className="font-medium">
                <span className="text-primary">{app.job_title}</span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    app.status === 'hired'
                      ? 'default'
                      : app.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'
                  }
                  className="capitalize"
                >
                  {app.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(app.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <JobApplicationSheet
        application={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        getResumeUrl={getResumeSignedUrlForTenant}
      />
    </>
  );
}
