'use client';

import React, { useEffect } from 'react';
import { QuestionPage } from '@/views/QuestionPage';
import { useAppContext } from '../providers';
import { AppLayout } from '../app-layout';

export default function Practice() {
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
    // Only fetch if we have settings but no question
    if (!currentQuestion && selectedCategory && selectedDifficulty && !loading) {
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
}