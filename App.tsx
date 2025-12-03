import React, { useState, useEffect } from 'react';
import { Library, BookOpen, TrendingUp, GraduationCap, AlertTriangle, RefreshCw, LogOut, UserCircle } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { motion, number } from 'framer-motion';
import { Category, Difficulty, Question, UserProgress, MAX_QUESTIONS_PER_LEVEL, UserProgressStats } from './types';
import { generateQuestion } from './services/geminiService';
import {
  initializeUser,
  startSession,
  saveQuestionToDb,
  saveUserAnswer,
  signOut,
  syncAuthUser,
  getUnansweredQuestion,
  getUserProgressStats,
  seedDatabase,
  getSession
} from './services/supabaseService';
import { Button } from './components/Button';
import { ProgressBar } from './components/ProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { TutorChat } from './components/TutorChat';
import { AuthScreen } from './components/AuthScreen';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { supabase } from '@/lib/supabase';
import { QuantQuiz } from './pages/QuantQuiz';
import ProgressStats from './components/ProgressStats';
import RightTriangleCalculator from './components/TriangeArea';
import MathCalculators from './components/TriangeArea';

// --- Initial State ---
const initialProgress: UserProgress = {
  verbal: { easy: 0, medium: 0, hard: 0 },
  quant: { easy: 0, medium: 0, hard: 0 },
  correctAnswers: 0,
  totalAttempted: 0
};

// --- Animation Variants ---
const floatingAnimation = {
  animate: {
    y: [0, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const floatingAnimationSlow = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: 0.5
    }
  }
};

const floatingAnimationGentle = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 12.5,
      repeat: Infinity,
      ease: "easeInOut" as const,
      delay: 1
    }
  }
};

const floatingAnimationDelayed = {
  animate: {
    y: [0, -3, 0],
    transition: {
      duration: 10.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1.5
    }
  }
};

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<'dashboard' | 'question' | 'auth'>('dashboard');
  const [progress, setProgress] = useState<UserProgress>(initialProgress);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  // DB / Auth State
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [dbConnected, setDbConnected] = useState(false);

  // Progress Totals
  const [userStats, setUserStats] = useState<UserProgressStats | null>(null);

  const [quantTotal, setQuantTotal] = useState<number | null>(null);
  const [verbalTotal, setVerbalTotal] = useState<number | null>(null);
  const [userTotal, setUserTotal] = useState<number | null>(null);
  const [overallTotal, setOverallTotal] = useState<number | null>(null);
  const [overallVerbalTotal, setOverallVerbal] = useState<number | null>(null);
  const [overallQuantTotal, setOverallQuantTotal] = useState<number | null>(null);


  // --- Effects ---
  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
    }

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
          console.log("Set User Id: ", dbId)
          if (event === 'SIGNED_IN') setView('dashboard');
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
  }, []);

  useEffect(() => {

    if (!userId) return;
    const getStats = async () => {
      const total = await getUserProgressStats(userId)
      setUserStats(total);
    }
    getStats();

  }, [userId, sessionId, authUser])

  // --- Handlers ---

  const startPractice = async (category: Category, difficulty: Difficulty) => {
    setSelectedCategory(category);
    setSelectedDifficulty(difficulty);

    console.log("Practice Started");

    if (userId && dbConnected) {
      console.log("userId && dbConnected start practice");
      const sid = await getSession();
      if (!sid) {
        console.log("No supaSession")
        const sid2 = await startSession(userId, category);
        setSessionId(sid2);
      }

    }

    console.log("Set to question but no question appearing")
    setView('question');
    await fetchNewQuestion(category, difficulty);
  };

  const fetchNewQuestion = async (category: Category, difficulty: Difficulty) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try to fetch from DB first (The "Archive")
      // if (userId && dbConnected) {
      //   const dbQuestion = await getUnansweredQuestion(userId, category, difficulty);
      //   if (dbQuestion) {
      //     console.log("Retrieved question from archives (DB)");
      //     setCurrentQuestion(dbQuestion);
      //     setLoading(false);
      //     return;
      //   }
      // }

      // 2. If no DB question found, generate new one (The "Oracle")
      console.log("Generating new question via AI");
      const question = await generateQuestion(category, difficulty);

      // Persist Question so it becomes part of the archive
      if (userId && dbConnected) {
        console.log("Saving question to DB")
        try {
          const dbQId = saveQuestionToDb(question);
          if (dbQId) {
            question.question_id = await dbQId;
          }
        } catch (error) {
          console.log('saving to db error: ', error);
        }

      console.log("Saved to DB")

      }

      setCurrentQuestion(question);
    } catch (err) {
      setError("The librarian could not retrieve a scroll from the archives. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionComplete = async (selectedIndex: number) => {
    if (!selectedCategory || !selectedDifficulty || !currentQuestion) return;

    if (loading) return;


    setLoading(true);

    // 3. Snapshot Data
    // Capture the current question details now, just in case state shifts weirdly
    const questionToSave = currentQuestion;
    const qId = questionToSave.question_id;
    const isCorrect = selectedIndex === questionToSave.correct_index;


    try {


      if (userId && dbConnected && qId) {
        console.log("Saving User Answer");
        await saveUserAnswer(userId, sessionId, qId, questionToSave, selectedIndex);
        const total = await getUserProgressStats(userId)
        setUserStats(total);
      }

      console.log("fetching new question from handleQuestionComplete");
      await fetchNewQuestion(selectedCategory, selectedDifficulty);

    } catch (err) {
      console.error("Error during question transition:", err);
      // Ensure we don't get stuck in loading state if an error occurs
      setLoading(false);
    }
  };

  const returnToDashboard = () => {
    setView('dashboard');
    setCurrentQuestion(null);
    setSessionId(null);
  };

  const handleSignOut = async () => {
    await signOut();
    setView('dashboard');
  };

  // --- Render Helpers ---

  if (apiKeyMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-library-paper p-4">
        <div className="max-w-md text-center p-8 border-2 border-library-wood rounded-lg bg-white shadow-xl">
          <AlertTriangle className="mx-auto text-amber-600 mb-4" size={48} />
          <h1 className="text-2xl font-serif font-bold text-library-wood mb-2">Missing Library Access Key</h1>
          <p className="text-library-ink mb-4">
            The Librarian requires an API Key to access the archives. Please ensure <code>process.env.API_KEY</code> is set in your environment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-library-paper flex flex-col font-sans text-library-ink relative">


      {/* --- Navigation / Header --- */}
      <header className="bg-library-wood text-white shadow-lg sticky top-0 z-50 border-b-4 border-library-gold relative">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={returnToDashboard}
          >
            <div className="bg-white p-2 rounded-full text-library-wood shadow-inner">
              <Library size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-wide leading-none">Athena's Library</h1>
              <p className="text-xs text-library-paperDark opacity-80 uppercase tracking-widest">GRE Prep Archives</p>
            </div>
          </div>
          <NavBar></NavBar>

          <div className="flex items-center gap-4">
            {view === 'question' && (
              <Button variant="outline" onClick={returnToDashboard} className="text-white border-white hover:bg-white/20 text-sm py-2 px-4 hidden md:block">
                Reading Room
              </Button>
            )}

            {authUser ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-xs opacity-80">Logged in as</p>
                  <p className="font-bold text-sm text-library-gold">{authUser.user_metadata.username || authUser.email?.split('@')[0]}</p>
                </div>
                <Button variant="secondary" onClick={handleSignOut} className="px-3 py-1 text-xs">
                  <LogOut size={14} className="mr-1" /> Sign Out
                </Button>
              </div>
            ) : (
              view !== 'auth' && (
                <Button variant="secondary" onClick={() => setView('auth')} className="px-4 py-2">
                  <UserCircle size={18} className="mr-2" /> Login / Register
                </Button>
              )
            )}
          </div>
        </div>
      </header>


      {/* --- Main Content --- */}
      <main className="flex-grow container mx-auto px-4 py-8 pb-0 relative">

        {view === 'auth' && (
          <div className="min-h-[60vh] flex items-center justify-center">
            <AuthScreen
              onSuccess={() => setView('dashboard')}
              onCancel={() => setView('dashboard')}
            />
          </div>
        )}

        {view === 'dashboard' && (
          // --- Dashboard View ---
          <div className="animate-fade-in relative">
            {/* --- Background Images --- */}
            <div className='absolute inset-0 pointer-events-none z-10'>
              <motion.div
                className="absolute top-1/4 -left-[12vw]"
                {...floatingAnimationSlow}
              >
                <img
                  src="/male-reader-left.png"
                  alt="Library background"
                  className="w-[380px] h-[350px] opacity-90 sepia-[.1]"
                />
              </motion.div>

              <motion.div
                className="absolute top-[33%] -right-[10%]"
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
              <div className="text-center mb-12 pt-8">
                <div className="inline-block bg-library-paper/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-library-wood/10">
                  <h2 className="text-4xl font-serif font-bold text-library-wood mb-4">
                    Welcome, {authUser ? (authUser.user_metadata.first_name || 'Scholar') : 'Guest Scholar'}.
                  </h2>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto font-medium">
                    The archives contain 300 adaptive questions.
                    {authUser ? " Your progress is being recorded in the university registry." : " Sign in to permanently save your progress across sessions."}
                  </p>
                </div>
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
                    <Button onClick={() => startPractice(Category.QUANT, Difficulty.EASY)} className="text-sm">
                      Practice Easy
                    </Button>
                    <Button onClick={() => startPractice(Category.QUANT, Difficulty.MEDIUM)} className="text-sm">
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
                        <h3 className="text-2xl font-serif font-bold text-center text-library-wood">55 Quantitative <br/> Reasoning</h3>
                      </div>
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="bg-amber-100 p-3 rounded-full text-amber-800">
                          <BookOpen size={32} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-center text-library-wood">55 Verbal <br/> Reasoning</h3>
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
              <MathCalculators />
            </div>
            <div>

            </div>
          </div>
        )}

        {view === 'question' && (
          // --- Question View ---
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
        )}

      </main>
      <Footer />

      {view === 'question' && currentQuestion && (
        <TutorChat question={currentQuestion} />
      )}
    </div>
  );
};

export default App;