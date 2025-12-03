import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { Category, Difficulty, Question } from '../types';
import { Button } from '../components/Button';
import { QuestionCard } from '../components/QuestionCard';
import { TutorChat } from '../components/TutorChat';

interface QuestionPageProps {
  loading: boolean;
  error: string | null;
  currentQuestion: Question | null;
  selectedCategory: Category | null;
  selectedDifficulty: Difficulty | null;
  onQuestionComplete: (selectedIndex: number) => void;
  onRetry: () => void;
}

export const QuestionPage: React.FC<QuestionPageProps> = ({
  loading,
  error,
  currentQuestion,
  selectedCategory,
  selectedDifficulty,
  onQuestionComplete,
  onRetry
}) => {
  return (
    <>
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
            <Button onClick={onRetry}>
              Try Again
            </Button>
          </div>
        ) : currentQuestion ? (
          <>
            <QuestionCard
              question={currentQuestion}
              onNext={onQuestionComplete}
            />
          </>
        ) : null}
      </div>

      {currentQuestion && (
        <TutorChat question={currentQuestion} />
      )}
    </>
  );
};
