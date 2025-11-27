import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { Button } from './Button';
import { CheckCircle, XCircle, BookOpen, ArrowRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onNext: (selectedIndex: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [question.id, question.dbId]);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      onNext(selectedOption);
    }
  };

  const getOptionStyles = (index: number) => {
    const base = "w-full p-4 text-left rounded-md border-2 transition-all relative mb-3 font-sans text-lg";
    
    if (!isSubmitted) {
      if (selectedOption === index) {
        return `${base} border-library-wood bg-library-wood/5`;
      }
      return `${base} border-library-paperDark hover:border-library-wood/40 bg-white`;
    }

    // Submitted state
    if (index === question.correct_index) {
      return `${base} border-green-600 bg-green-50 text-green-900 font-semibold`;
    }
    
    if (selectedOption === index && index !== question.correct_index) {
      return `${base} border-red-500 bg-red-50 text-red-900`;
    }

    return `${base} border-gray-200 opacity-60`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg border border-library-paperDark relative overflow-hidden">
        {/* Decoration: Top gold bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-library-gold"></div>

        {/* Header Info */}
        <div className="flex justify-between items-center mb-6 text-sm text-library-woodLight uppercase tracking-widest font-bold">
          <span className="flex items-center gap-2">
            <BookOpen size={16} />
            {question.category}
          </span>
          <span className={`px-3 py-1 rounded-full border ${
            question.difficulty === 'Hard' ? 'border-red-300 text-red-800 bg-red-50' :
            question.difficulty === 'Medium' ? 'border-yellow-300 text-yellow-800 bg-yellow-50' :
            'border-green-300 text-green-800 bg-green-50'
          }`}>
            {question.difficulty} Level
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-8">
          <p className="text-xl leading-relaxed font-serif text-library-ink">
            {question.text}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(index)}
              className={getOptionStyles(index)}
            >
              <div className="flex items-center justify-between">
                <span>
                  <span className="inline-block w-6 font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </span>
                {isSubmitted && index === question.correct_index && (
                  <CheckCircle className="text-green-600" size={24} />
                )}
                {isSubmitted && selectedOption === index && index !== question.correct_index && (
                  <XCircle className="text-red-500" size={24} />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Actions area */}
        <div className="border-t border-library-paperDark pt-6 flex justify-end">
          {!isSubmitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={selectedOption === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} variant="secondary">
              Next Question <ArrowRight size={18} />
            </Button>
          )}
        </div>

        {/* Explanation Reveal */}
        {isSubmitted && (
          <div className="mt-8 bg-library-paperDark p-6 rounded border border-library-wood/10 animate-fade-in">
            <h4 className="text-library-wood font-serif font-bold text-lg mb-2 flex items-center gap-2">
              <BookOpen size={20} />
              Librarian's Explanation
            </h4>
            <p className="text-library-ink leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};