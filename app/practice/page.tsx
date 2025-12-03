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
    console.log("In practice page")
    console.log("Current question: ", currentQuestion);
    console.log("Selected Cateogry: ", selectedCategory);
    console.log("Current question: ", selectedDifficulty);
    if (!currentQuestion && selectedCategory && selectedDifficulty) {
      console.log("actually fetching question")
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
