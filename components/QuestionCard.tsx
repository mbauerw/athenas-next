import React, { useState, useEffect } from 'react';
import { Question, Difficulty } from '../types';
import { Button } from './Button';
import { CheckCircle, XCircle, BookOpen, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

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
  }, [question.question_id, question.text]);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      onNext(selectedOption);
    }
  };

  const formatMathText = (text: string) => {
    if (!text) return "";
    let formatted = text.replace(/\b([a-zA-Z0-9]+)\^([a-zA-Z0-9\{\}]+)\b/g, "$$$1^$2$$");
    formatted = formatted.replace(
      /(\\(?:leq|geq|neq|approx|cdot|times|div|pm|mp|pi|theta|alpha|beta|gamma|delta|sigma|infty|sqrt|frac|sum|prod))/g,
      (match) => `$${match}$`
    );
    formatted = formatted.replace(/\$\$/g, "$");
    return formatted;
  };

  const getOptionStyles = (index: number) => {
    const base = "w-full p-4 text-left rounded-md border-2 transition-all relative mb-3 font-sans text-lg";
    
    if (!isSubmitted) {
      if (selectedOption === index) {
        return `${base} border-library-wood bg-library-wood/5`;
      }
      return `${base} border-library-paperDark hover:border-library-wood/40 bg-white`;
    }

    if (index === question.correct_index) {
      return `${base} border-green-600 bg-green-50 text-green-900 font-semibold`;
    }
    
    if (selectedOption === index && index !== question.correct_index) {
      return `${base} border-red-500 bg-red-50 text-red-900`;
    }

    return `${base} border-gray-200 opacity-60`;
  };

  const markdownPlugins = {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* --- ADDED STYLE BLOCK START --- */}
      {/* This forces KaTeX to use the same font size as the surrounding text (1em) */}
      <style>{`
        .katex { font-size: 1em !important; }
      `}</style>
      {/* --- ADDED STYLE BLOCK END --- */}

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

        <div className="mb-8 text-xl leading-relaxed font-serif text-library-ink">
          <ReactMarkdown 
            {...markdownPlugins}
            components={{
              p: ({node, ...props}) => <p {...props} className="mb-4 last:mb-0" />
            }}
          >
            {formatMathText(question.text)}
          </ReactMarkdown>
        </div>

        <div className="space-y-2 mb-8">
          {question.options.map((option, index) => (
            <button
              key={index}
              disabled={isSubmitted}
              onClick={() => setSelectedOption(index)}
              className={getOptionStyles(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 flex items-start text-left">
                  <span className="inline-block w-8 font-bold flex-shrink-0 mt-0.5">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <div className="flex-1">
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
                {isSubmitted && index === question.correct_index && (
                  <CheckCircle className="text-green-600 flex-shrink-0 ml-2" size={24} />
                )}
                {isSubmitted && selectedOption === index && index !== question.correct_index && (
                  <XCircle className="text-red-500 flex-shrink-0 ml-2" size={24} />
                )}
              </div>
            </button>
          ))}
        </div>

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