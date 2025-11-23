import React, { useState, useEffect } from 'react';
import { Library, BookOpen, TrendingUp, GraduationCap, AlertTriangle, RefreshCw, LogOut, UserCircle } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { Category, Difficulty, Question, UserProgress, MAX_QUESTIONS_PER_LEVEL } from './types';
import { generateQuestion } from './services/geminiService';
import {
  initializeUser,
  startSession,
  saveQuestionToDb,
  saveUserAnswer,
  supabase,
  signOut,
  syncAuthUser,
  getUnansweredQuestion,
  seedDatabase
} from './services/supabaseService';
import { Button } from './components/Button';
import { ProgressBar } from './components/ProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { TutorChat } from './components/TutorChat';
import { AuthScreen } from './components/AuthScreen';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';

// --- Initial State ---
const initialProgress: UserProgress = {
  verbal: { easy: 0, medium: 0, hard: 0 },
  quant: { easy: 0, medium: 0, hard: 0 },
  correctAnswers: 0,
  totalAttempted: 0
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
          // Since we just logged in, go to dashboard
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

  // --- Handlers ---

  const startPractice = async (category: Category, difficulty: Difficulty) => {
    setSelectedCategory(category);
    setSelectedDifficulty(difficulty);

    if (userId && dbConnected) {
      const sid = await startSession(userId, category);
      setSessionId(sid);
    }

    setView('question');
    await fetchNewQuestion(category, difficulty);
  };

  const fetchNewQuestion = async (category: Category, difficulty: Difficulty) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try to fetch from DB first (The "Archive")
      if (userId && dbConnected) {
        const dbQuestion = await getUnansweredQuestion(userId, category, difficulty);
        if (dbQuestion) {
          console.log("Retrieved question from archives (DB)");
          setCurrentQuestion(dbQuestion);
          setLoading(false);
          return;
        }
      }

      // 2. If no DB question found, generate new one (The "Oracle")
      console.log("Generating new question via AI");
      const question = await generateQuestion(category, difficulty);

      // Persist Question so it becomes part of the archive
      if (userId && dbConnected) {
        const dbQId = await saveQuestionToDb(question);
        if (dbQId) {
          question.dbId = dbQId;
        }
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

    const isCorrect = selectedIndex === currentQuestion.correctIndex;

    // Update Local Progress
    setProgress(prev => {
      const newProgress = { ...prev };

      if (selectedCategory === Category.VERBAL) {
        const diffKey = selectedDifficulty.toLowerCase() as keyof typeof prev.verbal;
        if (newProgress.verbal[diffKey] < MAX_QUESTIONS_PER_LEVEL) {
          newProgress.verbal[diffKey]++;
        }
      } else {
        const diffKey = selectedDifficulty.toLowerCase() as keyof typeof prev.quant;
        if (newProgress.quant[diffKey] < MAX_QUESTIONS_PER_LEVEL) {
          newProgress.quant[diffKey]++;
        }
      }

      newProgress.totalAttempted++;
      if (isCorrect) newProgress.correctAnswers++;

      return newProgress;
    });

    // Save Answer to DB
    if (userId && dbConnected && currentQuestion.dbId) {
      await saveUserAnswer(userId, sessionId, currentQuestion.dbId, currentQuestion, selectedIndex);
    }

    // Fetch Next
    fetchNewQuestion(selectedCategory, selectedDifficulty);
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
      {/* --- Background Image for Homepage --- */}
      {/* <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        <img
          src="/book-background.png"
          alt="Library background"
          className="w-full h-full object-fill opacity-90 sepia-[.1]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-library-paper/10 via-library-paper/20 to-library-paper/10"></div>
      </div> */}
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
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        
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
          <div className="animate-fade-in">
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

            {/* Overall Stats */}
            <div className="max-w-5xl mx-auto mt-8 bg-library-wood text-library-paper p-6 rounded-lg shadow-md flex items-center justify-between">
              <div className="flex items-center gap-4">
                <GraduationCap size={40} />
                <div>
                  <h4 className="text-xl font-serif font-bold">Total Progress</h4>
                  <p className="text-library-paperDark/80">Questions Attempted: {progress.totalAttempted} / 300</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold font-serif">
                  {progress.totalAttempted > 0
                    ? Math.round((progress.correctAnswers / progress.totalAttempted) * 100)
                    : 0}%
                </div>
                <p className="text-sm opacity-80">Accuracy Rate</p>
              </div>
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
                {/* Tutor Chat Integration */}
                <TutorChat question={currentQuestion} />
              </>
            ) : null}
          </div>
        )}
      
      </main>
      <Footer />
    </div>
  );
};

export default App;