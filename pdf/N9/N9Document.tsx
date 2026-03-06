import React from 'react';
import { Document } from '@react-pdf/renderer';
import { N9Page1 } from './N9Page1';
import { N9Page2 } from './N9Page2';
import { N9Page3 } from './N9Page3';

export interface N9DocumentProps {
  landlordName?: string;
  tenantName?: string;
  rentalAddress?: string;
  terminationDate?: string;
  phoneNumber?: string;
  signatureFirstName?: string;
  signatureLastName?: string;
  signatureDate?: string;
}

export function N9Document({
  landlordName = '',
  tenantName = '',
  rentalAddress = '',
  terminationDate = '',
  phoneNumber = '',
  signatureFirstName = '',
  signatureLastName = '',
  signatureDate = '',
}: N9DocumentProps) {
  return (
    <Document>
      <N9Page1
        landlord={landlordName}
        tenants={tenantName}
        address={rentalAddress}
        terminationDate={terminationDate}
      />

      <N9Page2 />

      <N9Page3
        signatureFirstName={signatureFirstName}
        signatureLastName={signatureLastName}
        phoneNumber={phoneNumber}
        signatureDate={signatureDate}
      />
    </Document>
  );
}
