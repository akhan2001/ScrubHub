import React from 'react';
import { Page, Text, View } from '@react-pdf/renderer';
import { styles } from './styles';

export interface N9Page3Props {
  signatureFirstName?: string;
  signatureLastName?: string;
  phoneNumber?: string;
  signatureDate?: string;
}

export function N9Page3({
  signatureFirstName = '',
  signatureLastName = '',
  phoneNumber = '',
  signatureDate = '',
}: N9Page3Props) {
  return (
    <Page size="A4" style={styles.page}>
      {/* Signature section */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Text style={styles.paragraphBold}>Signature</Text>
        <View style={[styles.checkboxGroup, { marginBottom: 0, marginLeft: 24 }]}>
          <View style={styles.checkboxItem}>
            <Text>☑</Text>
            <Text>Tenant</Text>
          </View>
          <View style={styles.checkboxItem}>
            <Text>☐</Text>
            <Text>Representative</Text>
          </View>
        </View>
      </View>

      <View style={styles.signatureRow}>
        <Text style={styles.signatureLabel}>First Name</Text>
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#000',
            minHeight: 20,
            padding: 4,
          }}
        >
          <Text>{signatureFirstName}</Text>
        </View>
      </View>
      <View style={styles.signatureRow}>
        <Text style={styles.signatureLabel}>Last Name</Text>
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#000',
            minHeight: 20,
            padding: 4,
          }}
        >
          <Text>{signatureLastName}</Text>
        </View>
      </View>
      <View style={styles.signatureRow}>
        <Text style={styles.signatureLabel}>Phone Number</Text>
        <View
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#000',
            minHeight: 20,
            padding: 4,
          }}
        >
          <Text>{phoneNumber || '—'}</Text>
        </View>
      </View>

      {/* Signature and Date side by side */}
      <View style={styles.sigDateRow}>
        <View style={styles.sigBox}>
          <Text style={[styles.signatureLabel, { marginBottom: 4 }]}>Signature</Text>
          <Text style={{ fontStyle: 'italic' }}>
            {signatureFirstName} {signatureLastName}
          </Text>
        </View>
        <View style={styles.dateBox}>
          <Text style={[styles.signatureLabel, { marginBottom: 4 }]}>Date (dd/mm/yyyy)</Text>
          <Text>{signatureDate}</Text>
        </View>
      </View>

      {/* Office Use Only */}
      <View style={{ marginTop: 32 }}>
        <Text style={styles.paragraphBold}>OFFICE USE ONLY:</Text>
        <View style={{ marginTop: 8 }}>
          <Text style={styles.label}>File Number</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#000',
              minHeight: 24,
              marginTop: 4,
              padding: 4,
              width: 200,
            }}
          />
        </View>
        <View style={{ marginTop: 12 }}>
          <Text style={styles.paragraphBold}>Delivery Method:</Text>
          <View style={styles.deliveryRow}>
            <View style={styles.checkboxItem}>
              <Text>☐</Text>
              <Text>In Person</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Text>☐</Text>
              <Text>Mail</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Text>☐</Text>
              <Text>Courier</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Text>☐</Text>
              <Text>Email</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Text>☐</Text>
              <Text>Efile</Text>
            </View>
            <View style={styles.checkboxItem}>
              <Text>☐</Text>
              <Text>Fax</Text>
            </View>
            <View style={[styles.checkboxItem, { marginLeft: 8 }]}>
              <Text>FL</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#000',
                  width: 24,
                  height: 16,
                  marginLeft: 4,
                }}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { justifyContent: 'flex-end', marginTop: 'auto' }]}>
        <Text>Page 3 of 3</Text>
      </View>
    </Page>
  );
}
