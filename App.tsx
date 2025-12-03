import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Library, LogOut, UserCircle, AlertTriangle } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { Category, Difficulty, Question, UserProgress, UserProgressStats } from './types';
import { generateQuestion } from './services/geminiService';
import {
  initializeUser,
  startSession,
  saveQuestionToDb,
  saveUserAnswer,
  signOut,
  syncAuthUser,
  getUserProgressStats,
  seedDatabase,
  getSession
} from './services/supabaseService';
import { Button } from './components/Button';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { supabase } from '@/lib/supabase';
import { Dashboard } from './pages/Dashboard';
import { QuestionPage } from './pages/QuestionPage';
import { AuthPage } from './pages/AuthPage';

// --- Initial State ---
const initialProgress: UserProgress = {
  verbal: { easy: 0, medium: 0, hard: 0 },
  quant: { easy: 0, medium: 0, hard: 0 },
  correctAnswers: 0,
  totalAttempted: 0
};

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- State ---
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
          if (event === 'SIGNED_IN') navigate('/');
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
    navigate('/practice');
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
    navigate('/');
    setCurrentQuestion(null);
    setSessionId(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
            {location.pathname === '/practice' && (
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
              location.pathname !== '/auth' && (
                <Button variant="secondary" onClick={() => navigate('/auth')} className="px-4 py-2">
                  <UserCircle size={18} className="mr-2" /> Login / Register
                </Button>
              )
            )}
          </div>
        </div>
      </header>


      {/* --- Main Content --- */}
      <main className="flex-grow container mx-auto px-4 py-8 pb-0 relative">
        <Routes>
          <Route path="/" element={
            <Dashboard
              authUser={authUser}
              progress={progress}
              userStats={userStats}
              onStartPractice={startPractice}
            />
          } />
          <Route path="/practice" element={
            <QuestionPage
              loading={loading}
              error={error}
              currentQuestion={currentQuestion}
              selectedCategory={selectedCategory}
              selectedDifficulty={selectedDifficulty}
              onQuestionComplete={handleQuestionComplete}
              onRetry={() => selectedCategory && selectedDifficulty && fetchNewQuestion(selectedCategory, selectedDifficulty)}
            />
          } />
          <Route path="/auth" element={
            <AuthPage
              onSuccess={() => navigate('/')}
              onCancel={() => navigate('/')}
            />
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;