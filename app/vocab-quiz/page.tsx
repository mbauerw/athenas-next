'use client';

import React from 'react';
import { AppProvider } from '../providers';
import { AppLayout } from '../app-layout';

const VocabQuizPage: React.FC = () => {
  return (
    <AppLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className='flex items-center justify-center p-10 mb-4'>
          <h1 className='text-6xl text-center font-semibold'>
            Vocabulary Quiz
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Coming soon...</p>
      </div>
    </AppLayout>
  );
};

export default function VocabQuiz() {
  return (
    <AppProvider>
      <VocabQuizPage />
    </AppProvider>
  );
}
