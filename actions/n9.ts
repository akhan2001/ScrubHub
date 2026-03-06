'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/server/guards/require-role';
import { getActiveLeasesForTenant, getLeaseWithDetails } from '@/server/services/leases.service';
import {
  getTerminationDateForLease,
  createN9Draft,
  signAndDeliverN9,
  acknowledgeN9,
  getN9NoticesForLandlord,
  getAllN9NoticesForLandlord,
} from '@/server/services/n9.service';
import { generateN9Pdf } from '@/lib/n9/generate-n9-pdf';
import { fetchN9NoticesForLease } from '@/server/repositories/n9-notices.repository';
import { insertSavedN9Form, fetchSavedN9FormsForTenant } from '@/server/repositories/saved-n9-forms.repository';
import { createClient } from '@/lib/supabase/server';
import type { N9Reason } from '@/types/database';

export interface N9FormFields {
  landlordName: string;
  tenantName: string;
  rentalAddress: string;
  phoneNumber: string;
  signatureFirstName: string;
  signatureLastName: string;
}

export async function getActiveLeasesAction() {
  const user = await requireRole('tenant');
  return getActiveLeasesForTenant(user.id);
}

export async function getLeaseDetailsAction(leaseId: string) {
  await requireRole('tenant');
  const details = await getLeaseWithDetails(leaseId);
  if (!details) throw new Error('Lease not found');
  return {
    landlordName: details.landlord_name ?? '',
    tenantName: details.tenant_name ?? '',
    rentalAddress: details.listing_address
      ? details.listing_unit_number
        ? `Unit ${details.listing_unit_number}, ${details.listing_address}`
        : details.listing_address
      : '',
  };
}

export async function calculateTerminationDateAction(leaseId: string, reason: N9Reason) {
  await requireRole('tenant');
  return getTerminationDateForLease(leaseId, reason);
}

export async function createN9DraftAction(leaseId: string, reason: N9Reason) {
  const user = await requireRole('tenant');
  const result = await createN9Draft({
    leaseId,
    tenantUserId: user.id,
    reason,
  });
  revalidatePath('/dashboard/tenant/tenancy');
  return result;
}

export async function signN9Action(noticeId: string, formFields: N9FormFields) {
  const user = await requireRole('tenant');
  const hdrs = await headers();
  const ip =
    hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    hdrs.get('x-real-ip') ??
    'unknown';

  const result = await signAndDeliverN9({
    noticeId,
    tenantUserId: user.id,
    signatureFirstName: formFields.signatureFirstName,
    signatureLastName: formFields.signatureLastName,
    signatureIp: ip,
    formOverrides: {
      landlordName: formFields.landlordName,
      tenantName: formFields.tenantName,
      rentalAddress: formFields.rentalAddress,
      phoneNumber: formFields.phoneNumber,
    },
  });
  revalidatePath('/dashboard/tenant/tenancy');
  revalidatePath('/dashboard/landlord');
  revalidatePath('/dashboard/landlord/notices');
  return result;
}

export async function acknowledgeN9Action(noticeId: string, notes?: string) {
  const user = await requireRole('landlord');
  await acknowledgeN9({
    noticeId,
    landlordUserId: user.id,
    notes,
  });
  revalidatePath('/dashboard/landlord');
  revalidatePath('/dashboard/landlord/notices');
  revalidatePath('/dashboard/tenant/tenancy');
}

export async function getLandlordN9NoticesAction() {
  const user = await requireRole('landlord');
  return getN9NoticesForLandlord(user.id);
}

export async function getAllLandlordN9NoticesAction() {
  const user = await requireRole('landlord');
  return getAllN9NoticesForLandlord(user.id);
}

export async function getN9NoticesForLeaseAction(leaseId: string) {
  await requireRole('tenant');
  return fetchN9NoticesForLease(leaseId);
}

export async function getSavedN9FormsAction() {
  const user = await requireRole('tenant');
  return fetchSavedN9FormsForTenant(user.id);
}

export async function generateStandaloneN9Action(formFields: N9FormFields & { terminationDate: string }) {
  const user = await requireRole('tenant');

  const now = new Date();
  const formatDdMmYyyy = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  const termParts = formFields.terminationDate.split('-');
  const termFormatted =
    termParts.length === 3
      ? `${termParts[2]}/${termParts[1]}/${termParts[0]}`
      : formFields.terminationDate;

  const pdfBytes = await generateN9Pdf({
    landlordName: formFields.landlordName,
    tenantName: formFields.tenantName,
    rentalAddress: formFields.rentalAddress,
    terminationDate: termFormatted,
    signatureFirstName: formFields.signatureFirstName,
    signatureLastName: formFields.signatureLastName,
    phoneNumber: formFields.phoneNumber,
    signatureDate: formatDdMmYyyy(now),
  });

  const supabase = await createClient();
  const fileId = crypto.randomUUID();
  const pdfPath = `standalone/${user.id}/${fileId}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from('n9-documents')
    .upload(pdfPath, pdfBytes, { contentType: 'application/pdf', upsert: true });

  if (uploadError) throw new Error(`Failed to upload PDF: ${uploadError.message}`);

  const { data: urlData } = await supabase.storage
    .from('n9-documents')
    .createSignedUrl(pdfPath, 60 * 60 * 24 * 365);

  const pdfUrl = urlData?.signedUrl ?? '';

  try {
    await insertSavedN9Form({
      tenant_user_id: user.id,
      landlord_name: formFields.landlordName,
      tenant_name: formFields.tenantName,
      rental_address: formFields.rentalAddress,
      termination_date: formFields.terminationDate,
      phone_number: formFields.phoneNumber || null,
      signature_first_name: formFields.signatureFirstName,
      signature_last_name: formFields.signatureLastName,
      pdf_url: pdfUrl,
    });
  } catch (dbError) {
    const msg = dbError instanceof Error ? dbError.message : (dbError as { message?: string })?.message ?? 'Database error';
    throw new Error(`Failed to save N9 form: ${msg}. Ensure migration 00012_saved_n9_forms has been applied.`);
  }

  revalidatePath('/dashboard/tenant/n9');

  const base64 = Buffer.from(pdfBytes).toString('base64');
  return { pdfBase64: base64 };
}
