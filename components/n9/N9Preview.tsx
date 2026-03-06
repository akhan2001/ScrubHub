'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { N9FormPDF } from '@/components/n9/N9FormPDF';

interface N9PreviewProps {
  landlordName: string;
  tenantName: string;
  rentalAddress: string;
  terminationDate: string;
  phoneNumber: string;
  signatureFirstName: string;
  signatureLastName: string;
  signatureDate?: string;
}

function formatDdMmYyyy(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function normalizeTerminationDate(value: string): string {
  if (!value) return '';
  const parts = value.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return value;
}

export function N9Preview({
  landlordName,
  tenantName,
  rentalAddress,
  terminationDate,
  phoneNumber,
  signatureFirstName,
  signatureLastName,
  signatureDate,
}: N9PreviewProps) {
  const sigDate = signatureDate ?? formatDdMmYyyy(new Date());
  const termDateFormatted = normalizeTerminationDate(terminationDate);

  return (
    <PDFViewer width="100%" height="600px" className="rounded-lg border">
      <N9FormPDF
        landlordName={landlordName}
        tenantName={tenantName}
        rentalAddress={rentalAddress}
        terminationDate={termDateFormatted}
        phoneNumber={phoneNumber}
        signatureFirstName={signatureFirstName}
        signatureLastName={signatureLastName}
        signatureDate={sigDate}
      />
    </PDFViewer>
  );
}
