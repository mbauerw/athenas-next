import React from 'react';
import { BookOpen, TrendingUp } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { Category, Difficulty, UserProgress, MAX_QUESTIONS_PER_LEVEL, UserProgressStats } from '../types';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import ProgressStats from '../components/ProgressStats';
import MathCalculators from '../components/MathCalculators';
import Link from 'next/link';

interface DashboardProps {
  authUser: User | null;
  progress: UserProgress;
  userStats: UserProgressStats | null;
  onStartPractice: (category: Category, difficulty: Difficulty) => void;
}

const floatingAnimationSlow = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 15,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: 0.5
    }
  }
};

const floatingAnimationGentle = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 12.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: 1
    }
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ authUser, progress, userStats, onStartPractice }) => {
  return (
    <div className="animate-fade-in relative">
      {/* --- Background Images --- */}
      <div
        className='absolute inset-0 pointer-events-none z-10'
      // style={{ backgroundImage: "url('/library-classic.jpeg')" }}
      >


        <motion.div
          className="absolute top-2/5 -left-[12vw]"
          {...floatingAnimationSlow}
        >
          <img
            src="/male-reader-left.png"
            alt="Library background"
            className="w-[380px] h-[350px] opacity-90 sepia-[.1]"
          />
        </motion.div>

        <motion.div
          className="absolute top-[46%] -right-[10%]"
          {...floatingAnimationGentle}
        >
          <img
            src="/female-reader-1.png"
            alt="Library background"
            className="w-[300px] h-[200px] opacity-100 sepia-[.1]"
          />
        </motion.div>
      </div>


      {/* --- Content --- */}
      <div className="relative z-10">
        {/* <div className="text-center mb-12 pt-8">
          <div className="inline-block bg-library-paper/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-library-wood/10">
            <h2 className="text-4xl font-serif font-bold text-library-wood mb-4">
              Welcome, {authUser ? (authUser.user_metadata.first_name || 'Scholar') : 'Guest Scholar'}.
            </h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
              The archives contain 300 adaptive questions.
              {authUser ? " Your progress is being recorded in the university registry." : " Sign in to permanently save your progress across sessions."}
            </p>
          </div>
        </div> */}

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{
            once: false,
            amount: .5
          }}
          transition={{
            duration: 1.5,
            delay: 0,
            ease: [0.25, 0.4, 0.25, 1]
          }}
          className="text-center h-50 mb-20 mt-20 flex flex-col justify-start items-center">
          <h3 className="text-6xl font-bold text-library-paper font-serif mb-2">Welcome To Athena's Library</h3>
          <p className="text-gray-300  text-xl text-wrap text-center">
            Home of the Premier Agentic GRE Tutor, "The Librarian"
          </p>
        </motion.div>

        <div>
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{
                once: false,
                amount: .5
              }}
              transition={{
                duration: 1.5,
                delay: 0,
                ease: [0.25, 0.4, 0.25, 1]
              }}
              className="text-center h-50 mb-[400px] mt-20 flex flex-col justify-start items-start">
              <h3 className="text-6xl font-bold text-library-paper font-serif mb-2">Welcome To Athena's Library</h3>
              <p className="text-gray-300  text-xl text-wrap text-center">
                Home of the Premier Agentic GRE Tutor, "The Librarian"
              </p>
            </motion.div>

          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          

          {/* Verbal Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-8 border-amber-700">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-amber-100 p-3 rounded-full text-amber-800">
                <BookOpen size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-library-wood">Verbal Reasoning</h3>
            </div>

            <div className="space-y-4 mb-8">
              <ProgressBar
                label="Easy Collection"
                current={progress.verbal.easy}
                max={MAX_QUESTIONS_PER_LEVEL}
                colorClass="bg-green-600"
              />
              <ProgressBar
                label="Medium Collection"
                current={progress.verbal.medium}
                max={MAX_QUESTIONS_PER_LEVEL}
                colorClass="bg-yellow-600"
              />
              <ProgressBar
                label="Hard Collection"
                current={progress.verbal.hard}
                max={MAX_QUESTIONS_PER_LEVEL}
                colorClass="bg-red-700"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button onClick={() => onStartPractice(Category.VERBAL, Difficulty.EASY)} className="text-sm">
                Practice Easy
              </Button>
              <Button onClick={() => onStartPractice(Category.VERBAL, Difficulty.MEDIUM)} className="text-sm">
                Practice Medium
              </Button>
              <Button onClick={() => onStartPractice(Category.VERBAL, Difficulty.HARD)} className="text-sm">
                Practice Hard
              </Button>
            </div>
          </div>

          {/* Quant Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-8 border-library-green">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-green-100 p-3 rounded-full text-green-800">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-library-wood">Quantitative Reasoning</h3>
            </div>

            <div className="space-y-4 mb-8">
              <ProgressBar
                label="Easy Collection"
                current={progress.quant.easy}
                max={MAX_QUESTIONS_PER_LEVEL}
                colorClass="bg-green-600"
              />
              <ProgressBar
                label="Medium Collection"
                current={progress.quant.medium}
                max={MAX_QUESTIONS_PER_LEVEL}
                colorClass="bg-yellow-600"
              />
              <ProgressBar
                label="Hard Collection"
                current={progress.quant.hard}
                max={MAX_QUESTIONS_PER_LEVEL}
                colorClass="bg-red-700"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button onClick={() => onStartPractice(Category.QUANT, Difficulty.EASY)} className="text-sm">
                Practice Easy
              </Button>
              <Button onClick={() => onStartPractice(Category.QUANT, Difficulty.MEDIUM)} className="text-sm">
                Practice Medium
              </Button>
              <Button onClick={() => onStartPractice(Category.QUANT, Difficulty.HARD)} className="text-sm">
                Practice Hard
              </Button>
            </div>
          </div>

        </div>

        <ProgressStats userStats={userStats} />

        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-5xl mx-auto p-20 mt-20">

          {/* Full Test Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg border-t-8 border-amber-700">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-amber-100 p-3 rounded-full text-amber-800">
                <BookOpen size={32} />
              </div>
              <h3 className="text-4xl font-serif font-bold text-library-wood">Take the Full Test</h3>
            </div>

            <div className="space-y-4 mb-8">
              <div className="grid md:grid-cols-2 grid-cols-1">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="bg-amber-100 p-3 rounded-full text-amber-800">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-center text-library-wood">55 Quantitative <br /> Reasoning</h3>
                </div>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="bg-amber-100 p-3 rounded-full text-amber-800">
                    <BookOpen size={32} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-center text-library-wood">55 Verbal <br /> Reasoning</h3>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div></div>
              <Button onClick={() => onStartPractice(Category.VERBAL, Difficulty.MEDIUM)} className="text-lg">
                Start Test
              </Button>
              <div></div>
            </div>
          </div>

        </div>
        {/* <MathCalculators /> */}
      </div>
      <div>

      </div>
    </div>
  );
};
