'use client';

import React, { useState, useEffect } from 'react';
import { SEED_QUESTIONS } from '@/data/seedQuestions';
import { AppLayout } from '../app-layout';

export default function QuantQuizPage() {
  const [questions, setQuestions] = useState<string[]>();

  const filterQuant = () => {
    for (let question in SEED_QUESTIONS) {
      console.log(question);
    }
  }

  useEffect(() => {
    filterQuant();
  }, [])

  return (
    <AppLayout>
      <div>
        {/* Quant Quiz content */}
      </div>
    </AppLayout>
  );
}
