import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { BoxSection } from '../components/BoxSection';
import { styles } from '../styles';

interface TerminationNoticeProps {
  terminationDate: string;
}

export function TerminationNotice({ terminationDate }: TerminationNoticeProps) {
  return (
    <BoxSection>
      <Text>
        I am giving this notice because I want to move out of the rental unit.
      </Text>

      <Text style={{ marginTop: 6 }}>
        The last day of my tenancy will be:
      </Text>

      <View style={[styles.valueBox, { width: 120 }]}>
        <Text>{terminationDate || 'dd/mm/yyyy'}</Text>
      </View>

      <Text>This is the termination date.</Text>

      <Text style={{ marginTop: 6 }}>
        I will move out of the rental unit on or before the termination date.
      </Text>
    </BoxSection>
  );
}
