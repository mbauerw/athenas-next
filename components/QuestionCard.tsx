import React, { useState, useEffect } from 'react';
import { Question, Difficulty } from '../types';
import { Button } from './Button';
import { CheckCircle, XCircle, BookOpen, ArrowRight, Square, CheckSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface QuestionCardProps {
  question: Question;
  onNext: (selectedIndices: number[]) => void; // CHANGED: Now accepts array
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onNext }) => {
  // CHANGED: State is now an array of numbers
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    setSelectedIndices([]);
    setIsSubmitted(false);
  }, [question.question_id, question.text]);

  const toggleOption = (index: number) => {
    if (isSubmitted) return;

    // UX IMPROVEMENT: 
    // Although the DB allows arrays, if the answer key only has 1 item, 
    // it acts like a Radio button (selecting new one clears others).
    // If answer key > 1, it acts like a Checkbox (accumulates).
    const isMultiSelectQuestion = question.correct_index.length > 1;

    setSelectedIndices(prev => {
      if (isMultiSelectQuestion) {
        // Checkbox behavior
        if (prev.includes(index)) {
          return prev.filter(i => i !== index);
        } else {
          return [...prev, index];
        }
      } else {
        // Radio behavior (auto-deselect others)
        // If clicking the same one, allow deselect, otherwise replace
        return prev.includes(index) ? [] : [index];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedIndices.length === 0) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (selectedIndices.length > 0) {
      onNext(selectedIndices);
    }
  };

  // ... (formatMathText function remains exactly the same) ...
  const formatMathText = (text: string) => {
    if (!text) return "";
    const placeholders: string[] = [];
    let formatted = text;
    formatted = formatted.replace(/\\frac\s*\{[^{}]*\}\s*\{[^{}]*\}/g, (m) => {
      placeholders.push(`$${m}$`);
      return `___MATH_${placeholders.length - 1}___`;
    });
    formatted = formatted.replace(/\\sqrt\s*\{[^{}]*\}/g, (m) => {
      placeholders.push(`$${m}$`);
      return `___MATH_${placeholders.length - 1}___`;
    });
    formatted = formatted.replace(/\b([a-zA-Z0-9]+)\^([a-zA-Z0-9\{\}]+)\b/g, "$$$1^$2$$");
    formatted = formatted.replace(
      /(\\(?:leq|geq|neq|approx|cdot|times|div|pm|mp|pi|theta|alpha|beta|gamma|delta|sigma|infty|sum|prod))/g,
      (match) => `$${match}$`
    );
    placeholders.forEach((ph, i) => {
      formatted = formatted.replace(`___MATH_${i}___`, ph);
    });
    formatted = formatted.replace(/\$\$/g, "$");
    return formatted;
  };

  const getOptionStyles = (index: number) => {
    const base = "w-full p-4 text-left rounded-md border-2 transition-all relative mb-3 font-sans text-lg";
    
    // Check if this specific index is selected by user
    const isSelected = selectedIndices.includes(index);
    // Check if this specific index is actually correct (based on array)
    const isActuallyCorrect = question.correct_index.includes(index);

    if (!isSubmitted) {
      if (isSelected) {
        return `${base} border-library-wood bg-library-wood/5`;
      }
      return `${base} border-library-paperDark hover:border-library-wood/40 bg-white`;
    }

    // POST-SUBMISSION STYLES
    if (isActuallyCorrect) {
      // It was correct, highlight GREEN
      return `${base} border-green-600 bg-green-50 text-green-900 font-semibold`;
    }
    
    if (isSelected && !isActuallyCorrect) {
      // User picked it, but it was wrong -> RED
      return `${base} border-red-500 bg-red-50 text-red-900`;
    }

    return `${base} border-gray-200 opacity-60`;
  };

  const markdownPlugins = {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  };

  // Determine if we should show checkboxes or radio-style circles visually
  const isMultiSelect = question.correct_index.length > 1;

  return (
    <div className="max-w-3xl mx-auto">
      <style>{`
        .katex { font-size: 1em !important; }
      `}</style>

      <div className="bg-white p-8 rounded-lg shadow-lg border border-library-paperDark relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-library-gold"></div>

        <div className="flex justify-between items-center mb-6 text-sm text-library-woodLight uppercase tracking-widest font-bold">
          <span className="flex items-center gap-2">
            <BookOpen size={16} />
            {question.category}
          </span>
          <span className={`px-3 py-1 rounded-full border ${
            question.difficulty === Difficulty.HARD ? 'border-red-300 text-red-800 bg-red-50' :
            question.difficulty === Difficulty.MEDIUM ? 'border-yellow-300 text-yellow-800 bg-yellow-50' :
            'border-green-300 text-green-800 bg-green-50'
          }`}>
            {question.difficulty} Level
          </span>
        </div>

        {/* Question Text */}
        <div className="mb-8 text-xl leading-relaxed font-serif text-library-ink">
          <ReactMarkdown 
            {...markdownPlugins}
            components={{
              p: ({node, ...props}) => <p {...props} className="mb-4 last:mb-0" />
            }}
          >
            {formatMathText(question.text)}
          </ReactMarkdown>
          {isMultiSelect && (
             <p className="text-sm text-gray-500 italic mt-2">(Select all that apply)</p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2 mb-8">
          {question.options.map((option, index) => {
             const isSelected = selectedIndices.includes(index);
             const isCorrect = question.correct_index.includes(index);

             return (
              <button
                key={index}
                disabled={isSubmitted}
                onClick={() => toggleOption(index)}
                className={getOptionStyles(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-start text-left">
                    {/* Render Box or Letter */}
                    <span className="inline-flex items-center justify-center w-8 h-8 mr-3 flex-shrink-0">
                        {isMultiSelect ? (
                            isSelected ? <CheckSquare size={24} /> : <Square size={24} className="text-gray-400" />
                        ) : (
                            <span className="font-bold">{String.fromCharCode(65 + index)}.</span>
                        )}
                    </span>

                    <div className="flex-1 pt-1">
                      <ReactMarkdown 
                        {...markdownPlugins}
                        components={{
                          p: ({node, ...props}) => <div {...props} className="inline-block" />
                        }}
                      >
                        {formatMathText(option)}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {/* Result Icons */}
                  {isSubmitted && isCorrect && (
                    <CheckCircle className="text-green-600 flex-shrink-0 ml-2" size={24} />
                  )}
                  {isSubmitted && isSelected && !isCorrect && (
                    <XCircle className="text-red-500 flex-shrink-0 ml-2" size={24} />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer / Buttons */}
        <div className="border-t border-library-paperDark pt-6 flex justify-end">
          {!isSubmitted ? (
            <Button 
              onClick={handleSubmit} 
              disabled={selectedIndices.length === 0}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} variant="secondary">
              Next Question <ArrowRight size={18} />
            </Button>
          )}
        </div>

        {/* Explanation */}
        {isSubmitted && (
          <div className="mt-8 bg-library-paperDark p-6 rounded border border-library-wood/10 animate-fade-in">
            <h4 className="text-library-wood font-serif font-bold text-lg mb-2 flex items-center gap-2">
              <BookOpen size={20} />
              Librarian's Explanation
            </h4>
            <div className="text-library-ink leading-relaxed">
              <ReactMarkdown 
                {...markdownPlugins}
                components={{
                  p: ({node, ...props}) => <p {...props} className="mb-2 last:mb-0" />
                }}
              >
                {formatMathText(question.explanation)}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};