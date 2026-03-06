import React from 'react';
import { View, Text } from '@react-pdf/renderer';

export function FormHeader() {
  return (
    <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
      <Text>Tenant&apos;s Notice to End the Tenancy</Text>
      <Text>N9</Text>
      <Text>(Disponible en français)</Text>
    </View>
  );
}
