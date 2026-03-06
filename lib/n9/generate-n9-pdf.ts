import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { N9FormPDF } from '@/components/n9/N9FormPDF';

export interface N9PdfData {
  landlordName: string;
  tenantName: string;
  rentalAddress: string;
  terminationDate: string; // dd/mm/yyyy
  signatureFirstName: string;
  signatureLastName: string;
  phoneNumber: string;
  signatureDate: string; // dd/mm/yyyy
}

export async function generateN9Pdf(data: N9PdfData): Promise<Uint8Array> {
  const doc = React.createElement(N9FormPDF, {
    landlordName: data.landlordName,
    tenantName: data.tenantName,
    rentalAddress: data.rentalAddress,
    terminationDate: data.terminationDate,
    phoneNumber: data.phoneNumber,
    signatureFirstName: data.signatureFirstName,
    signatureLastName: data.signatureLastName,
    signatureDate: data.signatureDate,
  });
  const buffer = await renderToBuffer(doc as Parameters<typeof renderToBuffer>[0]);
  return new Uint8Array(buffer);
}
