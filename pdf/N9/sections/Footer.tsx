import React from 'react';
import { View, Text } from '@react-pdf/renderer';

interface FooterProps {
  page?: number;
  totalPages?: number;
}

export function Footer({ page = 1, totalPages = 3 }: FooterProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        fontSize: 8,
        color: '#666',
      }}
    >
      <Text>v. 01/04/2022</Text>
      <Text>Page {page} of {totalPages}</Text>
    </View>
  );
}
