import React from 'react';
import { Page, View } from '@react-pdf/renderer';
import { styles } from './styles';
import { FormHeader } from './sections/Header';
import { LandlordTenantRow } from './sections/LandlordTenantRow';
import { RentalAddressSection } from './sections/AddressSection';
import { TerminationNotice } from './sections/TerminationNotice';
import { InfoSection } from './sections/InfoSection';
import { Footer } from './sections/Footer';
import type { N9FormData } from './types';

interface N9Page1Props extends N9FormData {}

export function N9Page1({ landlord, tenants, address, terminationDate }: N9Page1Props) {
  return (
    <Page size="A4" style={styles.page}>
      <FormHeader />

      <View style={{ marginBottom: 10 }}>
        <LandlordTenantRow landlord={landlord} tenant={tenants} />
      </View>

      <View style={{ marginBottom: 10 }}>
        <RentalAddressSection address={address} />
      </View>

      <View style={{ marginBottom: 10 }}>
        <TerminationNotice terminationDate={terminationDate} />
      </View>

      <InfoSection />

      <Footer page={1} totalPages={3} />
    </Page>
  );
}
