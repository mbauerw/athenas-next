'use client';

import React from 'react';
import { FormulaPlayground } from '@/views/FormulaPlayground';
import { AppProvider } from '../../providers';
import { AppLayout } from '../../app-layout';

const FormulaPlaygroundPage: React.FC = () => {
  return (
    <AppLayout>
      <FormulaPlayground />
    </AppLayout>
  );
};

export default function FormulaPlaygroundRoute() {
  return (
    <AppProvider>
      <FormulaPlaygroundPage />
    </AppProvider>
  );
}
