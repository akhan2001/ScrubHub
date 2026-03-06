import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { BoxSection } from '../components/BoxSection';

export function InfoSection() {
  return (
    <BoxSection>
      <Text style={{ fontWeight: 'bold' }}>
        Important Information from the Landlord and Tenant Board
      </Text>

      <Text style={{ marginTop: 6, fontWeight: 'bold' }}>The termination date</Text>
      <Text style={{ marginTop: 4 }}>
        For most types of tenancies (including monthly tenancies) the termination date must be at
        least 60 days after the tenant gives the landlord this notice. Also, the termination date
        must be the last day of the rental period. For example, if the tenant pays on the first day
        of each month, the termination date must be the last day of the month. If the tenancy is for
        a fixed term (for example, a lease for one year), the termination date cannot be earlier
        than the last date of the fixed term.
      </Text>

      <Text style={{ marginTop: 6, fontWeight: 'bold' }}>Exceptions:</Text>
      <Text style={{ marginTop: 4 }}>
        • The termination date must be at least 28 days after the tenant gives the landlord this
        notice if the tenancy is daily or weekly (the tenant pays rent daily or weekly). Also, the
        termination date must be the last day of the rental period. For example, if the tenant pays
        rent weekly each Monday, the termination date must be a Sunday. If the tenancy is for a
        fixed term, the termination date cannot be earlier than the last date of the fixed term.
      </Text>
      <Text style={{ marginTop: 4 }}>
        • The termination date can be earlier than the last day of a fixed term tenancy (but still
        must be the last day of a rental period) if the tenant is giving this notice because: the
        tenancy agreement was entered into on or after April 30, 2018; the landlord was required to
        use the Residential Tenancy Agreement (Standard Form of Lease) form but did not; the tenant
        demanded in writing that the landlord give them this form, and either more than 21 days have
        passed since the tenant made their demand, and the landlord has not provided the form, or
        the landlord provided the form less than 30 days ago but it was not signed by the tenant.
      </Text>
      <Text style={{ marginTop: 4 }}>
        • A special rule allows less than 60 days&apos; notice in situations where the tenant would
        normally be required to give 60 days notice (for example, monthly tenancies). The tenant can
        give notice for the end of February no later than January 1st and can give notice for the
        end of March no later than February 1st.
      </Text>

      <Text style={{ marginTop: 6, fontWeight: 'bold' }}>
        The landlord can apply to end the tenancy
      </Text>
      <Text style={{ marginTop: 4 }}>
        The landlord can apply to the Board for an order to end the tenancy and evict the tenant as
        soon as the tenant gives the landlord this notice. However, if the Board issues an order
        ending the tenancy, the order will not require the tenant to move out any earlier than the
        termination date the tenant included in this notice.
      </Text>
    </BoxSection>
  );
}
