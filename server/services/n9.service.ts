import {
  insertN9Notice,
  fetchN9NoticeById,
  fetchN9NoticesForLease,
  updateN9NoticeSignature,
  updateN9NoticeStatus,
  acknowledgeN9Notice as acknowledgeN9NoticeRepo,
  fetchN9NoticesForLandlord,
  fetchAllN9NoticesForLandlord,
} from '@/server/repositories/n9-notices.repository';
import { fetchLeaseById, updateLeaseStatus } from '@/server/repositories/leases.repository';
import { insertNotificationLog } from '@/server/repositories/notification-logs.repository';
import { logAuditEvent } from '@/server/services/audit.service';
import { getLeaseWithDetails } from '@/server/services/leases.service';
import { calculateTerminationDate } from '@/lib/n9/termination-date';
import { generateN9Pdf } from '@/lib/n9/generate-n9-pdf';
import { createClient } from '@/lib/supabase/server';
import type { N9Reason } from '@/types/database';

const N9_BUCKET = 'n9-documents';

export async function getTerminationDateForLease(leaseId: string, reason: N9Reason) {
  const lease = await fetchLeaseById(leaseId);
  if (!lease) throw new Error('Lease not found');
  if (lease.status !== 'active') throw new Error('Lease is not active');

  return calculateTerminationDate({
    leaseStartDate: lease.start_date,
    rentalPeriod: lease.rental_period,
    leaseType: lease.lease_type,
    leaseEndDate: lease.end_date,
  });
}

export async function createN9Draft(input: {
  leaseId: string;
  tenantUserId: string;
  reason: N9Reason;
}) {
  const lease = await fetchLeaseById(input.leaseId);
  if (!lease) throw new Error('Lease not found');
  if (lease.status !== 'active') throw new Error('Lease is not active');
  if (lease.tenant_user_id !== input.tenantUserId) {
    throw new Error('You are not the tenant on this lease');
  }

  const existing = await fetchN9NoticesForLease(input.leaseId);
  const pendingNotice = existing.find((n) => n.status === 'draft' || n.status === 'signed');
  if (pendingNotice) {
    throw new Error('An N9 notice already exists for this lease. Complete or cancel it first.');
  }

  const dateResult = calculateTerminationDate({
    leaseStartDate: lease.start_date,
    rentalPeriod: lease.rental_period,
    leaseType: lease.lease_type,
    leaseEndDate: lease.end_date,
  });

  if (!dateResult.isValid) {
    throw new Error(dateResult.error ?? 'Cannot calculate termination date');
  }

  const notice = await insertN9Notice({
    lease_id: input.leaseId,
    tenant_user_id: input.tenantUserId,
    reason: input.reason,
    termination_date: dateResult.terminationDate.toISOString().split('T')[0],
  });

  await logAuditEvent({
    actorUserId: input.tenantUserId,
    source: 'n9.service',
    eventName: 'n9.draft_created',
    payload: { noticeId: notice.id, leaseId: input.leaseId, reason: input.reason },
  });

  return {
    noticeId: notice.id,
    terminationDate: dateResult.terminationDate.toISOString().split('T')[0],
    explanation: dateResult.explanation,
  };
}

export async function signAndDeliverN9(input: {
  noticeId: string;
  tenantUserId: string;
  signatureFirstName: string;
  signatureLastName: string;
  signatureIp: string;
  formOverrides?: {
    landlordName?: string;
    tenantName?: string;
    rentalAddress?: string;
    phoneNumber?: string;
  };
}) {
  const notice = await fetchN9NoticeById(input.noticeId);
  if (!notice) throw new Error('N9 notice not found');
  if (notice.tenant_user_id !== input.tenantUserId) {
    throw new Error('You are not the tenant on this notice');
  }
  if (notice.status !== 'draft') {
    throw new Error('This notice has already been signed');
  }

  const leaseDetails = await getLeaseWithDetails(notice.lease_id);
  if (!leaseDetails) throw new Error('Lease not found');

  const signatureDate = new Date().toISOString();
  const termDate = new Date(notice.termination_date + 'T00:00:00');
  const signDate = new Date(signatureDate);

  const formatDdMmYyyy = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  const fullAddress = leaseDetails.listing_unit_number
    ? `Unit ${leaseDetails.listing_unit_number}, ${leaseDetails.listing_address ?? 'Address not available'}`
    : (leaseDetails.listing_address ?? 'Address not available');

  const pdfBytes = await generateN9Pdf({
    landlordName: input.formOverrides?.landlordName || leaseDetails.landlord_name || 'Unknown Landlord',
    tenantName: input.formOverrides?.tenantName || leaseDetails.tenant_name || 'Unknown Tenant',
    rentalAddress: input.formOverrides?.rentalAddress || fullAddress,
    terminationDate: formatDdMmYyyy(termDate),
    signatureFirstName: input.signatureFirstName,
    signatureLastName: input.signatureLastName,
    phoneNumber: input.formOverrides?.phoneNumber ?? '',
    signatureDate: formatDdMmYyyy(signDate),
  });

  const supabase = await createClient();
  const pdfPath = `${notice.lease_id}/${notice.id}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from(N9_BUCKET)
    .upload(pdfPath, pdfBytes, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (uploadError) throw new Error(`Failed to upload N9 PDF: ${uploadError.message}`);

  const { data: urlData } = await supabase.storage
    .from(N9_BUCKET)
    .createSignedUrl(pdfPath, 60 * 60 * 24 * 365); // 1 year

  const pdfUrl = urlData?.signedUrl ?? '';

  const fullSignatureName = `${input.signatureFirstName} ${input.signatureLastName}`;
  const formattedTermDate = termDate.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  await updateN9NoticeSignature(input.noticeId, {
    signature_name: fullSignatureName,
    signature_date: signatureDate,
    signature_ip: input.signatureIp,
    pdf_url: pdfUrl,
    status: 'delivered',
  });

  await updateLeaseStatus(notice.lease_id, 'terminating');

  await insertNotificationLog({
    user_id: leaseDetails.landlord_user_id,
    event_type: 'n9_notice_received',
    title: 'N9 Notice Received',
    body: `${input.formOverrides?.tenantName || leaseDetails.tenant_name || 'Your tenant'} has submitted an N9 notice to terminate their tenancy on ${formattedTermDate}.`,
    metadata: {
      noticeId: input.noticeId,
      leaseId: notice.lease_id,
      terminationDate: notice.termination_date,
    },
  });

  await logAuditEvent({
    actorUserId: input.tenantUserId,
    source: 'n9.service',
    eventName: 'n9.signed_and_delivered',
    payload: {
      noticeId: input.noticeId,
      leaseId: notice.lease_id,
      terminationDate: notice.termination_date,
    },
  });

  return { pdfUrl };
}

export async function acknowledgeN9(input: {
  noticeId: string;
  landlordUserId: string;
  notes?: string;
}) {
  const notice = await fetchN9NoticeById(input.noticeId);
  if (!notice) throw new Error('N9 notice not found');

  const lease = await fetchLeaseById(notice.lease_id);
  if (!lease) throw new Error('Lease not found');
  if (lease.landlord_user_id !== input.landlordUserId) {
    throw new Error('You are not the landlord on this lease');
  }

  if (notice.status !== 'delivered' && notice.status !== 'signed') {
    throw new Error('This notice is not pending acknowledgement');
  }

  await acknowledgeN9NoticeRepo(input.noticeId, input.notes);

  await insertNotificationLog({
    user_id: notice.tenant_user_id,
    event_type: 'n9_notice_acknowledged',
    title: 'N9 Notice Acknowledged',
    body: 'Your landlord has acknowledged your N9 termination notice.',
    metadata: { noticeId: input.noticeId, leaseId: notice.lease_id },
  });

  await logAuditEvent({
    actorUserId: input.landlordUserId,
    source: 'n9.service',
    eventName: 'n9.acknowledged',
    payload: { noticeId: input.noticeId, leaseId: notice.lease_id },
  });
}

export async function getN9NoticesForLandlord(landlordUserId: string) {
  return fetchN9NoticesForLandlord(landlordUserId);
}

export async function getAllN9NoticesForLandlord(landlordUserId: string) {
  return fetchAllN9NoticesForLandlord(landlordUserId);
}

export async function getN9NoticeWithLease(noticeId: string) {
  const notice = await fetchN9NoticeById(noticeId);
  if (!notice) return null;

  const leaseDetails = await getLeaseWithDetails(notice.lease_id);
  return { notice, lease: leaseDetails };
}
