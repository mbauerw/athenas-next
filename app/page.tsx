'use client';

import React from 'react';
import { BookOpen, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category, Difficulty, MAX_QUESTIONS_PER_LEVEL } from '../types';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import ProgressStats from '../components/ProgressStats';
import { useAppContext } from './providers';
import { AppLayout } from './app-layout';
import Image from 'next/image';

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

export default function Home() {
  const { authUser, progress, userStats, startPractice } = useAppContext();

  return (
    <AppLayout>
      <div className="animate-fade-in relative">
        {/* --- Background Images --- */}
        <div className='absolute inset-0 pointer-events-none z-10'>
          <motion.div
            className="absolute top-[62%] left-10"
            {...floatingAnimationSlow}
          >
            <img
              src="/male-reader-left.png"
              alt="Library background"
              className="w-[380px] h-[350px] opacity-90 sepia-[.1]"
            />
          </motion.div>

          <motion.div
            className="absolute top-[65%] right-10"
            {...floatingAnimationGentle}
          >
            <img
              src="/female-reader-1.png"
              alt="Library background"
              className="w-[300px] h-[200px] opacity-100 sepia-[.1]"
            />
          </motion.div>
        </div>

        {/* Background athena image */}

        {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[130vh] pointer-events-none z-0">

          <div
            className="absolute inset-0 bg-cover bg-top bg-no-repeat"
            style={{
              backgroundImage: "url('/library-athena.png')",
              // Mask to fade bottom
              maskImage: 'radial-gradient(ellipse 70% 140% at 50% 0%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 140% at 50% 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 70%)',
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle max(35vw, 400px) at 50% 10%, rgb(2, 43, 209) 0%, rgba(37, 55, 223, 0.78) 70%, rgba(105, 88, 255, 0) 100%)'
            }}
          />
        </div> */}



        {/* --- Content --- */}
        <div className="relative z-10">

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
            className="text-center h-100 mb-10 mt-20 flex flex-col justify-start items-center py-0">
            <h3 className="text-6xl font-bold text-library-paper font-serif mb-2">Welcome To Athena's Library</h3>
            <p className="text-gray-300  text-xl text-wrap text-center">
              Home of the Premier Agentic GRE Tutor, "The Librarian"
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 md:grid-rows-2 grid-cols-1 place-items-center max-w-full h-[1100px] w-full px-4 md:px-0 mt-[200px] mb-20">
            {/* LEFT COLUMN ITEM */}
            <motion.div
              className="flex items-center justify-center h-[500px] min-h-[500px] w-[600px] min-w-[500px]"
              style={{
                borderRadius: '2rem',
                backdropFilter: 'blur(12px)',
              }}
              initial={{ opacity: 0, x: -150 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Image
                src="/chat-blurb.png"
                alt="Description of my image"
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </motion.div>

            <motion.div
              className='flex justify-center items-center'
              initial={{ opacity: 0, x: 150 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0 }}>
              <div>
                <p className='text-6xl  font-roboto'> A Tutor that is <br /> Always Available </p>
              </div>
            </motion.div>

            <div className='flex justify-center items-center'>
              <div>
                <p className='text-6xl  font-roboto text-wrap text-center'> Maximize your <br /> Potential </p>
              </div>
            </div>

            {/* RIGHT COLUMN ITEM */}
            <motion.div
              className="flex items-center justify-center h-[500px] min-h-[500px] w-[600px] min-w-[500px]"
              style={{
                borderRadius: '2rem',
                backdropFilter: 'blur(12px)',
              }}
              initial={{ opacity: 0, x: 150 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <Image
                src="/roadmap-blurb.png"
                alt="Description of my image"
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
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
                <Button onClick={() => startPractice(Category.VERBAL, Difficulty.EASY)} className="text-sm">
                  Practice Easy
                </Button>
                <Button onClick={() => startPractice(Category.VERBAL, Difficulty.MEDIUM)} className="text-sm">
                  Practice Medium
                </Button>
                <Button onClick={() => startPractice(Category.VERBAL, Difficulty.HARD)} className="text-sm">
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
                <Button onClick={() => { startPractice(Category.QUANT, Difficulty.EASY); console.log("Starting easy") }} className="text-sm">
                  Practice Easy
                </Button>
                <Button onClick={() => { startPractice(Category.QUANT, Difficulty.MEDIUM); console.log("Starting medium practice") }} className="text-sm">
                  Practice Medium
                </Button>
                <Button onClick={() => startPractice(Category.QUANT, Difficulty.HARD)} className="text-sm">
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
                <Button onClick={() => startPractice(Category.VERBAL, Difficulty.MEDIUM)} className="text-lg">
                  Start Test
                </Button>
                <div></div>
              </div>
            </div>

          </div>
        </div>
        <div>

        </div>
      </div>
    </AppLayout>
  );
}
