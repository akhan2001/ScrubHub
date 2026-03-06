import React from 'react';
import { View } from '@react-pdf/renderer';

interface GridCellProps {
  width: string | number;
  children: React.ReactNode;
  last?: boolean;
}

export function GridCell({ width, children, last }: GridCellProps) {
  return (
    <View
      style={{
        width,
        borderRightWidth: last ? 0 : 1,
        borderRightColor: '#000',
        padding: 6,
      }}
    >
      {children}
    </View>
  );
}
