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
import { JobApplicationSheet, type JobApplicationForSheet } from './job-application-sheet';
import { cn } from '@/lib/utils';

interface ApplicationsTableProps {
  applications: JobApplicationForSheet[];
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
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
            <TableHead>Applicant</TableHead>
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
              <TableCell>
                <div>
                  <p className="font-medium text-foreground">{app.email}</p>
                  <p className="text-xs text-muted-foreground">{app.phone}</p>
                </div>
              </TableCell>
              <TableCell onClick={(e) => e.stopPropagation()}>
                <Link
                  href={`/jobs/${app.job_post_id}`}
                  className="font-medium text-primary hover:underline"
                >
                  {app.job_title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
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
      />
    </>
  );
}
