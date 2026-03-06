import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';

interface LabelValueFieldProps {
  label: string;
  value: string;
}

export function LabelValueField({ label, value }: LabelValueFieldProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueBox}>
        <Text>{value}</Text>
      </View>
    </View>
  );
}
