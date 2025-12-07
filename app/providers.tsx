'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { Category, Difficulty, Question, UserProgress, UserProgressStats } from '@/types';
import {
  initializeUser,
  startSession,
  saveQuestionToDb,
  saveUserAnswer,
  signOut,
  syncAuthUser,
  getUserProgressStats,
  seedDatabase,
  getCurrentUser
} from '@/services/supabaseService';
import { supabase } from '@/lib/supabase';

// --- Helper for Array Comparison ---
const arraysEqual = (a: number[], b: number[]) => {
  if (a.length !== b.length) return false;
  // Sort to ensure order doesn't matter (e.g. [0,1] vs [1,0])
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((val, index) => val === sortedB[index]);
};

// --- Initial State ---
const initialProgress: UserProgress = {
  verbal: { easy: 0, medium: 0, hard: 0 },
  quant: { easy: 0, medium: 0, hard: 0 },
  correctAnswers: 0,
  totalAttempted: 0
};

interface AppContextType {
  progress: UserProgress;
  selectedCategory: Category | null;
  selectedDifficulty: Difficulty | null;
  currentQuestion: Question | null;
  loading: boolean;
  error: string | null;
  authUser: User | null;
  userId: number | null;
  sessionId: number | null;
  dbConnected: boolean;
  userStats: UserProgressStats | null;
  startPractice: (category: Category, difficulty: Difficulty) => Promise<void>;
  handleQuestionComplete: (selectedIndices: number[]) => Promise<void>; // CHANGED: accepts number[]
  fetchNewQuestion: (category: Category, difficulty: Difficulty) => Promise<void>;
  returnToDashboard: () => void;
  handleSignOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  // --- State ---
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // DB / Auth State
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [dbConnected, setDbConnected] = useState(false);

  // Progress Totals
  const [userStats, setUserStats] = useState<UserProgressStats | null>(null);

  // --- Effects ---
  useEffect(() => {
    const initDb = async () => {
      if (!supabase) return;
      setDbConnected(true);

      // 0. Seed Database with initial content
      await seedDatabase();

      // 1. Listener for Auth State (Login/Logout/Refresh)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setAuthUser(session.user);
          const dbId = await syncAuthUser(session.user);
          setUserId(dbId);
          console.log("Set User Id: ", dbId);
          if (event === 'SIGNED_IN') router.push('/');
        } else {
          setAuthUser(null);
          // Fallback to guest
          const guestId = await initializeUser();
          setUserId(guestId);
        }
      });

      // 2. Initial Load
      const id = await initializeUser();
      setUserId(id);

      return () => {
        subscription.unsubscribe();
      };
    };

    initDb();
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    const getStats = async () => {
      const total = await getUserProgressStats(userId);
      setUserStats(total);
    };
    getStats();
  }, [userId, sessionId, authUser]);

  // --- Handlers ---

  const startPractice = async (category: Category, difficulty: Difficulty) => {
    setSelectedCategory(category);
    setSelectedDifficulty(difficulty);

    console.log("Practice Started");

    if (userId && dbConnected) {
      console.log("userId && dbConnected start practice");
      const sid = await getCurrentUser();
      if (!sid) {
        console.log("No supaSession");
        const sid2 = await startSession(userId, category);
        setSessionId(sid2);
      }
    }

    console.log("Set to question but no question appearing");
    router.push('/practice');
  };

  const fetchNewQuestion = async (category: Category, difficulty: Difficulty) => {
    setLoading(true);
    setError(null);
    try {
      // Import dynamically to avoid issues with process.env on server
      const { generateQuestion } = await import('@/services/geminiService');

      console.log("Generating new question via AI");
      const question = await generateQuestion(category, difficulty);

      // Persist Question so it becomes part of the archive
      if (userId && dbConnected) {
        console.log("Saving question to DB");
        try {
          const dbQId = await saveQuestionToDb(question);
          if (dbQId) {
            question.question_id = dbQId;
          }
        } catch (error) {
          console.log('saving to db error: ', error);
        }

        console.log("Saved to DB");
      }

      setCurrentQuestion(question);
    } catch (err) {
      setError("The librarian could not retrieve a scroll from the archives. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionComplete = async (selectedIndices: number[]) => { // CHANGED: now array
    if (!selectedCategory || !selectedDifficulty || !currentQuestion) return;

    if (loading) return;

    setLoading(true);

    // 3. Snapshot Data
    const questionToSave = currentQuestion;
    const qId = questionToSave.question_id;
    
    // CHANGED: Use arraysEqual helper
    const isCorrect = arraysEqual(selectedIndices, questionToSave.correct_index);

    try {
      if (userId && dbConnected && qId) {
        console.log("Saving User Answer");
        await saveUserAnswer(userId, sessionId, qId, questionToSave, selectedIndices);
        const total = await getUserProgressStats(userId);
        setUserStats(total);
      }

      console.log("fetching new question from handleQuestionComplete");
      await fetchNewQuestion(selectedCategory, selectedDifficulty);
    } catch (err) {
      console.error("Error during question transition:", err);
      setLoading(false);
    }
  };

  const returnToDashboard = () => {
    router.push('/');
    setCurrentQuestion(null);
    setSessionId(null);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const value: AppContextType = {
    progress,
    selectedCategory,
    selectedDifficulty,
    currentQuestion,
    loading,
    error,
    authUser,
    userId,
    sessionId,
    dbConnected,
    userStats,
    startPractice,
    handleQuestionComplete,
    fetchNewQuestion,
    returnToDashboard,
    handleSignOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};