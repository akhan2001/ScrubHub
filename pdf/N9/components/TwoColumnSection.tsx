import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { styles } from '../styles';

interface TwoColumnSectionProps {
  heading: string;
  children: React.ReactNode;
}

export function TwoColumnSection({ heading, children }: TwoColumnSectionProps) {
  return (
    <View style={styles.twoColRow}>
      <View style={styles.twoColHeading}>
        <Text style={{ fontWeight: 'bold', fontSize: 9 }}>{heading}</Text>
      </View>
      <View style={styles.twoColContent}>{children}</View>
    </View>
  );
}
