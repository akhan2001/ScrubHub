import React from 'react';
import { N9Document } from '@/pdf/N9';
import type { N9DocumentProps } from '@/pdf/N9/N9Document';

export type { N9DocumentProps as N9FormPDFProps } from '@/pdf/N9/N9Document';

export function N9FormPDF(props: N9DocumentProps) {
  return <N9Document {...props} />;
}
