'use client';

import { useState, useEffect, useTransition } from 'react';
import { FileWarning, FileText, Loader2, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { Lease, N9Notice, SavedN9Form } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { N9Form } from '@/components/n9/N9Form';
import { N9Wizard } from '@/components/n9/N9Wizard';
import { getN9NoticesForLeaseAction, getLeaseDetailsAction } from '@/actions/n9';

interface N9FormPageClientProps {
  leases: Lease[];
  savedForms: SavedN9Form[];
}

export function N9FormPageClient({ leases, savedForms }: N9FormPageClientProps) {
  const [wizardLease, setWizardLease] = useState<Lease | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [standaloneMode, setStandaloneMode] = useState(false);

  const activeLeases = leases.filter((l) => l.status === 'active');
  const terminatingLeases = leases.filter((l) => l.status === 'terminating');

  function openWithLease(lease: Lease) {
    setWizardLease(lease);
    setStandaloneMode(false);
    setWizardOpen(true);
  }

  function openStandalone() {
    setWizardLease(null);
    setStandaloneMode(true);
    setWizardOpen(true);
  }

  function handleClose() {
    setWizardLease(null);
    setStandaloneMode(false);
    setWizardOpen(false);
  }

  return (
    <div className="space-y-6">
      {/* Info card */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <FileWarning className="size-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Ontario LTB Form N9</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tenant&apos;s Notice to End the Tenancy
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Use this form to formally notify your landlord that you intend to end your tenancy.
            Fill in your details and a signed PDF will be generated for you.
          </p>
          <div className="flex flex-wrap gap-2">
            {activeLeases.length === 1 && (
              <Button onClick={() => openWithLease(activeLeases[0])}>
                <FileText className="mr-2 size-4" />
                File N9 from lease
              </Button>
            )}
            <Button variant={activeLeases.length > 0 ? 'outline' : 'default'} onClick={openStandalone}>
              <FileText className="mr-2 size-4" />
              {activeLeases.length > 0 ? 'Fill N9 manually' : 'Create N9 Form'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Multiple active leases selector */}
      {activeLeases.length > 1 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Select a lease to file against</h2>
          {activeLeases.map((lease) => (
            <Card key={lease.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Lease {lease.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">
                    Started {new Date(lease.start_date).toLocaleDateString()} &middot;{' '}
                    ${(lease.monthly_rent_cents / 100).toFixed(2)}/mo
                  </p>
                </div>
                <Button size="sm" onClick={() => openWithLease(lease)}>
                  File N9
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Saved standalone N9 forms */}
      {savedForms.length > 0 && (
        <div className="space-y-3">
          <Separator />
          <h2 className="text-sm font-semibold">Saved N9 Forms</h2>
          {savedForms.map((form) => (
            <SavedFormCard key={form.id} form={form} />
          ))}
        </div>
      )}

      {/* Lease-based N9 notices */}
      {terminatingLeases.length > 0 && (
        <div className="space-y-3">
          <Separator />
          <h2 className="text-sm font-semibold">Submitted N9 Notices</h2>
          {terminatingLeases.map((lease) => (
            <N9NoticeRow key={lease.id} lease={lease} />
          ))}
        </div>
      )}

      <N9Wizard
        lease={wizardLease}
        open={wizardOpen}
        onOpenChange={(open) => { if (!open) handleClose(); }}
        standalone={standaloneMode}
      />
    </div>
  );
}

function SavedFormCard({ form }: { form: SavedN9Form }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const termDate = new Date(form.termination_date + 'T00:00:00').toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const createdDate = new Date(form.created_at).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const termDateDdMmYyyy = (() => {
    const d = new Date(form.termination_date + 'T00:00:00');
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  })();

  return (
    <>
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">
                N9 — {form.rental_address}
              </p>
              <p className="text-xs text-muted-foreground">
                To: {form.landlord_name} &middot; Created {createdDate}
              </p>
            </div>
            <Badge variant="secondary">Saved</Badge>
          </div>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Tenant</p>
              <p className="font-medium">{form.tenant_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Termination date</p>
              <p className="font-medium">{termDate}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
              <Eye className="mr-1.5 size-3.5" />
              Preview
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={form.pdf_url} target="_blank" rel="noopener noreferrer">
                <Download className="mr-1.5 size-3.5" />
                Download PDF
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[680px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>N9 Form Preview</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto p-4 pt-2">
            <N9Form
              landlordName={form.landlord_name}
              tenantName={form.tenant_name}
              rentalAddress={form.rental_address}
              terminationDate={termDateDdMmYyyy}
              phoneNumber={form.phone_number ?? ''}
              signatureFirstName={form.signature_first_name}
              signatureLastName={form.signature_last_name}
              showSignatureSection
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function N9NoticeRow({ lease }: { lease: Lease }) {
  const [notices, setNotices] = useState<N9Notice[]>([]);
  const [isPending, startTransition] = useTransition();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [leaseDetails, setLeaseDetails] = useState<{
    landlordName: string;
    tenantName: string;
    rentalAddress: string;
  } | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await getN9NoticesForLeaseAction(lease.id);
        setNotices(data);
      } catch {
        toast.error('Failed to load N9 notices');
      }
    });
  }, [lease.id]);

  async function handlePreviewOpen() {
    setPreviewOpen(true);
    if (!leaseDetails) {
      setDetailsLoading(true);
      try {
        const details = await getLeaseDetailsAction(lease.id);
        setLeaseDetails(details);
      } catch {
        toast.error('Failed to load form details');
      } finally {
        setDetailsLoading(false);
      }
    }
  }

  if (isPending) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          Loading...
        </CardContent>
      </Card>
    );
  }

  if (notices.length === 0) return null;

  const latest = notices[0];
  const termDate = new Date(latest.termination_date + 'T00:00:00').toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const termDateDdMmYyyy = (() => {
    const d = new Date(latest.termination_date + 'T00:00:00');
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  })();
  const sigParts = (latest.signature_name ?? '').trim().split(/\s+/);
  const sigFirst = sigParts[0] ?? '';
  const sigLast = sigParts.slice(1).join(' ') ?? '';

  const statusLabel: Record<N9Notice['status'], string> = {
    draft: 'Draft',
    signed: 'Signed',
    delivered: 'Delivered to landlord',
    acknowledged: 'Acknowledged',
    disputed: 'Disputed',
  };

  const statusVariant: Record<N9Notice['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
    draft: 'outline',
    signed: 'secondary',
    delivered: 'default',
    acknowledged: 'default',
    disputed: 'destructive',
  };

  return (
    <>
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Lease {lease.id.slice(0, 8)}</p>
              <p className="text-xs text-muted-foreground">Termination date: {termDate}</p>
            </div>
            <Badge variant={statusVariant[latest.status]}>{statusLabel[latest.status]}</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handlePreviewOpen} disabled={detailsLoading}>
              {detailsLoading ? (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              ) : (
                <Eye className="mr-1.5 size-3.5" />
              )}
              Preview
            </Button>
            {latest.pdf_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={latest.pdf_url} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-1.5 size-3.5" />
                  Download PDF
                </a>
              </Button>
            )}
          </div>

        {latest.landlord_acknowledged_at && (
          <p className="text-xs text-muted-foreground">
            Acknowledged by landlord on{' '}
            {new Date(latest.landlord_acknowledged_at).toLocaleDateString('en-CA', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
            {latest.landlord_notes ? ` — "${latest.landlord_notes}"` : ''}
          </p>
        )}
      </CardContent>
    </Card>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[680px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>N9 Form Preview</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto p-4 pt-2">
            {leaseDetails ? (
              <N9Form
                landlordName={leaseDetails.landlordName}
                tenantName={leaseDetails.tenantName}
                rentalAddress={leaseDetails.rentalAddress}
                terminationDate={termDateDdMmYyyy}
                phoneNumber=""
                signatureFirstName={sigFirst}
                signatureLastName={sigLast}
                showSignatureSection
              />
            ) : (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
