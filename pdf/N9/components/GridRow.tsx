import React from 'react';
import { View } from '@react-pdf/renderer';
import { styles } from '../styles';

interface GridRowProps {
  children: React.ReactNode;
}

export function GridRow({ children }: GridRowProps) {
  return <View style={styles.row}>{children}</View>;
}
