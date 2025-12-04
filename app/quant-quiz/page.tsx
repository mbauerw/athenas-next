'use client';

import React, { useState, useEffect } from 'react';
import { SEED_QUESTIONS } from '@/data/seedQuestions';
import { AppProvider } from '../providers';
import { AppLayout } from '../app-layout';

const QuantQuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<string[]>();

  const filterQuant = () => {
    for (let question in SEED_QUESTIONS) {
      console.log(question);
    }
  };

  useEffect(() => {
    filterQuant();
  }, []);

  return (
    <AppLayout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className='flex items-center justify-center p-10 mb-4'>
          <h1 className='text-6xl text-center font-semibold'>
            Quantitative Quiz
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Coming soon...</p>
      </div>
    </AppLayout>
  );
};

export default function QuantQuiz() {
  return (
    <AppProvider>
      <QuantQuizPage />
    </AppProvider>
  );
}
