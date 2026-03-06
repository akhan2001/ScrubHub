import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { styles } from './styles';
import { TwoColumnSection } from './components/TwoColumnSection';

export function N9Page2() {
  return (
    <Page size="A4" style={styles.page}>
      <TwoColumnSection heading="When a tenant can give 10 days' notice">
        <Text style={styles.paragraph}>
          The termination date set out in this notice can be 10 days (or more) after the tenant gives
          this notice to the landlord if the landlord has given the tenant either an N12 Notice to
          End your Tenancy or an N13 Notice to End your Tenancy. The termination date does not have
          to be the last day of a rental period.
        </Text>
      </TwoColumnSection>

      <TwoColumnSection heading="Ending the tenancy when the landlord refused to allow the tenant to assign the rental unit">
        <Text style={styles.paragraph}>
          The tenant can use this notice to end the tenancy if the tenant asked the landlord for
          permission to assign the rental unit to someone else, and the landlord refused. The
          termination date must be:
        </Text>
        <Text style={styles.paragraph}>
          • at least 28 days after the tenant gives the notice to the landlord if the tenancy is
          daily or weekly,
        </Text>
        <Text style={styles.paragraph}>
          • at least 30 days after the tenant gives the notice to landlord if the tenancy is
          anything other than daily or weekly.
        </Text>
        <Text style={styles.paragraph}>
          The termination date does not have to be the last day of a rental period or the last day
          of a fixed term.
        </Text>
      </TwoColumnSection>

      <TwoColumnSection heading="Ending the tenancy in a care home">
        <Text style={styles.paragraph}>
          If the tenant lives in a care home, the termination date in this notice can be 30 days (or
          more) after the tenant gives the notice to the landlord. The termination date does not have
          to be the end of a rental period or the last day of a fixed term.
        </Text>
        <Text style={styles.paragraph}>
          If a tenant who lives in a care home gives this notice to the landlord, they can also give
          the landlord a 10-day notice for the landlord to stop providing care services and meals.
          If the tenant gives the landlord the 10-day notice, the tenant is not required to pay for
          care services and meals after the end of the 10-day period.
        </Text>
      </TwoColumnSection>

      <TwoColumnSection heading="Tenants can't be required to sign this notice">
        <Text style={styles.paragraph}>
          A landlord cannot require the tenant to sign an N9 Tenant&apos;s Notice to End the Tenancy
          as a condition of agreeing to rent a unit. A tenant does not have to move out based on
          this notice if the landlord required the tenant to sign it when the tenant agreed to rent
          the unit.
        </Text>
        <Text style={styles.paragraph}>Exceptions: A landlord can require a tenant to sign an N9 Tenant&apos;s Notice to End the Tenancy as a condition of agreeing to rent a rental unit in the following two situations:</Text>
        <Text style={styles.paragraph}>
          • The tenant is a student living in accommodation provided by a post-secondary institution
          or by a landlord who has an agreement with the post-secondary school to provide the
          accommodation.
        </Text>
        <Text style={styles.paragraph}>
          • The tenant is occupying a rental unit in a care home for the purposes of receiving
          rehabilitative or therapeutic services, and
        </Text>
        <Text style={[styles.paragraph, { marginLeft: 12 }]}>
          • the tenant agreed to occupy the rental unit for not more than 4 years,
        </Text>
        <Text style={[styles.paragraph, { marginLeft: 12 }]}>
          • the tenancy agreement set out that the tenant can be evicted when the objectives of
          providing the care services have been met or will not be met, and
        </Text>
        <Text style={[styles.paragraph, { marginLeft: 12 }]}>
          • the rental unit is provided to the tenant under an agreement between the landlord and a
          service manager under the Housing Services Act, 2011.
        </Text>
      </TwoColumnSection>

      <TwoColumnSection heading="The tenant must move out by the termination date">
        <Text style={styles.paragraph}>
          The tenant must move out and remove all their personal possessions from the rental unit
          by the termination date set out on page 1. If the tenant moves out by the termination date
          set out above, but leaves behind personal possessions, the tenant will no longer have any
          rights to those possessions and the landlord will be allowed to dispose of them.
        </Text>
      </TwoColumnSection>

      <TwoColumnSection heading="How to get more information">
        <Text style={styles.paragraph}>
          For more information about this notice or your rights, you can contact the Landlord and
          Tenant Board. You can reach the Board by phone at 416-645-8080 or 1-888-332-3234. You can
          visit the Board&apos;s website at tribunalsontario.ca/ltb.
        </Text>
      </TwoColumnSection>

      <View style={[styles.footer, { justifyContent: 'flex-end' }]}>
        <Text>Page 2 of 3</Text>
      </View>
    </Page>
  );
}
