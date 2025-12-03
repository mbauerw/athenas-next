import React from 'react';
import { AuthScreen } from '../components/AuthScreen';
import MathCalculators from '@/components/MathCalculators';

interface FormulaPlaygroundProps {
  
}

export const FormulaPlayground: React.FC<FormulaPlaygroundProps> = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className='flex items-center justify-center p-10 mb-4'>
        <h1 className='text-6xl text-center font-semibold'>
          Formula Playground
        </h1>

      </div>
      <MathCalculators />
    </div>
  );
};