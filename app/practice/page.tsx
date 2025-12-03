'use client';

import React, { useEffect } from 'react';
import { QuestionPage } from '@/views/QuestionPage';
import { AppProvider, useAppContext } from '../providers';
import { AppLayout } from '../app-layout';

const PracticePage: React.FC = () => {
  const {
    loading,
    error,
    currentQuestion,
    selectedCategory,
    selectedDifficulty,
    handleQuestionComplete,
    fetchNewQuestion,
  } = useAppContext();

  useEffect(() => {
    // If we land on this page and there's no current question, fetch one
    if (!currentQuestion && !loading && selectedCategory && selectedDifficulty) {
      fetchNewQuestion(selectedCategory, selectedDifficulty);
    }
  }, [currentQuestion, loading, selectedCategory, selectedDifficulty, fetchNewQuestion]);

  return (
    <AppLayout>
      <QuestionPage
        loading={loading}
        error={error}
        currentQuestion={currentQuestion}
        selectedCategory={selectedCategory}
        selectedDifficulty={selectedDifficulty}
        onQuestionComplete={handleQuestionComplete}
        onRetry={() => selectedCategory && selectedDifficulty && fetchNewQuestion(selectedCategory, selectedDifficulty)}
      />
    </AppLayout>
  );
};

export default function Practice() {
  return (
    <AppProvider>
      <PracticePage />
    </AppProvider>
  );
}
