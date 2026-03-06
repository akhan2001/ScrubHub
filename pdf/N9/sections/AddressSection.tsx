import React from 'react';
import { BoxSection } from '../components/BoxSection';
import { LabelValueField } from '../components/LabelValueField';

interface RentalAddressSectionProps {
  address: string;
}

export function RentalAddressSection({ address }: RentalAddressSectionProps) {
  return (
    <BoxSection>
      <LabelValueField label="Address of the Rental Unit:" value={address} />
    </BoxSection>
  );
}
