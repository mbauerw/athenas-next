'use client';

import React, { useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '../../components/Button';
import { QuestionCard } from '../../components/QuestionCard';
import { TutorChat } from '../../components/TutorChat';
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
      <div className="h-full flex flex-col justify-center items-center pb-20">
        {loading ? (
          <div className="text-center animate-pulse">
            <div className="inline-block p-6 rounded-full bg-white shadow-xl border-4 border-library-wood mb-6">
              <RefreshCw className="animate-spin text-library-wood" size={48} />
            </div>
            <h3 className="text-2xl font-serif text-library-wood font-bold mb-2">Consulting the Archives...</h3>
            <p className="text-gray-600">The Librarian is retrieving your {selectedDifficulty?.toLowerCase()} {selectedCategory?.toLowerCase()} question.</p>
          </div>
        ) : error ? (
          <div className="text-center max-w-lg bg-white p-8 rounded-lg shadow-xl border border-red-200">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-xl font-serif text-red-800 font-bold mb-2">Archive Retrieval Error</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => selectedCategory && selectedDifficulty && fetchNewQuestion(selectedCategory, selectedDifficulty)}>
              Try Again
            </Button>
          </div>
        ) : currentQuestion ? (
          <>
            <QuestionCard
              question={currentQuestion}
              onNext={handleQuestionComplete}
            />
          </>
        ) : null}
      </div>

      {currentQuestion && (
        <TutorChat question={currentQuestion} />
      )}
    </AppLayout>
  );
}
