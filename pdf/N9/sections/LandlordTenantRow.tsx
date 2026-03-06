import React from 'react';
import { GridRow } from '../components/GridRow';
import { GridCell } from '../components/GridCell';
import { LabelValueField } from '../components/LabelValueField';

interface LandlordTenantRowProps {
  landlord: string;
  tenant: string;
}

export function LandlordTenantRow({ landlord, tenant }: LandlordTenantRowProps) {
  return (
    <GridRow>
      <GridCell width="50%">
        <LabelValueField label="To: (Landlord's name)" value={landlord} />
      </GridCell>
      <GridCell width="50%" last>
        <LabelValueField
          label="From: (Tenant's name) include all tenant names"
          value={tenant}
        />
      </GridCell>
    </GridRow>
  );
}
