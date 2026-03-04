'use client';

import { CheckCircle2, AlertCircle, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ProfileSectionStatus } from '@/types/profile';

interface ProfileCardProps {
  id: string;
  label: string;
  status: ProfileSectionStatus;
  fields: { label: string; value: string | null }[];
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

function StatusBadge({ status }: { status: ProfileSectionStatus }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0fdf4] px-2.5 py-1 text-xs font-medium text-[#16a34a]">
        <CheckCircle2 className="size-3.5" />
        Complete
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fefce8] px-2.5 py-1 text-xs font-medium text-[#ca8a04]">
      <AlertCircle className="size-3.5" />
      Incomplete
    </span>
  );
}

export function ProfileCard({
  id,
  label,
  status,
  fields,
  isEditing,
  onEdit,
  onCancel,
  children,
}: ProfileCardProps) {
  const isCompleted = status === 'completed';

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="text-base font-semibold">{label}</CardTitle>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          {isCompleted && !isEditing && (
            <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 gap-1.5 text-xs">
              <Pencil className="size-3.5" />
              Edit
            </Button>
          )}
          {!isCompleted && !isEditing && (
            <Button size="sm" onClick={onEdit} className="h-8 text-xs">
              Complete
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {children}
            <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
              <Button variant="outline" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fields
              .filter((f) => f.value)
              .map((field) => (
                <div key={field.label}>
                  <p className="text-xs font-medium text-[#94a3b8] uppercase tracking-wide">
                    {field.label}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-900">
                    {field.value}
                  </p>
                </div>
              ))}
            {fields.every((f) => !f.value) && (
              <p className="col-span-full text-sm text-muted-foreground">
                No data yet
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
