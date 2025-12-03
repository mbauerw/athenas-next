'use client';

import React from 'react';
import { FormulaPlayground } from '@/views/FormulaPlayground';
import { AppLayout } from '../../app-layout';

export default function FormulaPlaygroundRoute() {
  return (
    <AppLayout>
      <FormulaPlayground />
    </AppLayout>
  );
}