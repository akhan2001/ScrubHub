import React from 'react';
import { View } from '@react-pdf/renderer';
import { styles } from '../styles';

interface BoxSectionProps {
  children: React.ReactNode;
}

export function BoxSection({ children }: BoxSectionProps) {
  return (
    <View style={[styles.border, styles.cell]}>
      {children}
    </View>
  );
}
