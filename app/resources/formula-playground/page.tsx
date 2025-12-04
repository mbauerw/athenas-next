'use client';

import React from 'react';
import MathCalculators from '../../../components/MathCalculators';
import { AppLayout } from '../../app-layout';

export default function FormulaPlaygroundPage() {
  return (
    <AppLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className='flex items-center justify-center p-10 mb-4'>
          <h1 className='text-6xl text-center font-semibold'>
            Formula Playground
          </h1>
        </div>
        <MathCalculators />
      </div>
    </AppLayout>
  );
}
