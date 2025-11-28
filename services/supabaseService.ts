import { createClient, User } from '@supabase/supabase-js';
import { Question, Category, Difficulty } from '../types';
import { SEED_QUESTIONS } from '../data/seedQuestions'; // Assuming this is where your seed data lives based on file list
// If using the other seed file, adjust import accordingly. 
import { supabase } from '@/lib/supabase'

// --- Auth Functions ---

export const signInWithGoogle = async () => {
  console.log("sign in with google")
  if (!supabase) return { error: 'Database connection not initialized' };
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
};

export const signUpWithEmail = async (email: string, password: string, meta: { username: string, first_name: string, last_name: string }) => {
  if (!supabase) return { data: null, error: { message: 'Database not initialized' } };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: meta
    }
  });

  if (data.user) {
    await syncAuthUser(data.user);
  }

  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!supabase) return { data: null, error: { message: 'Database not initialized' } };
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
  localStorage.removeItem('gre_user_id');
};

export const getSession = async () => {
  if (!supabase) return null;
  console.log("in getSession")

  try {
    const { data, error } = await supabase.auth.getSession();
    console.log("Response:", data, error)

    if (error) {
      console.error("Session error:", error)
      return null
    }

    console.log("leaving getSession")
    return data.session;
  } catch (err) {
    console.error("Caught error:", err)
    return null
  }
};

// --- User Sync ---

export const syncAuthUser = async (authUser: User): Promise<number | null> => {
  if (!supabase) return null;

  // 1. Check if user exists in custom table by email
  const { data: existing } = await supabase
    .from('users')
    .select('user_id')
    .eq('email', authUser.email)
    .single();

  if (existing) {
    localStorage.setItem('gre_user_id', existing.user_id.toString());
    return existing.user_id;
  }

  // 2. Create if not exists
  const meta = authUser.user_metadata || {};
  const baseUsername = meta.username || authUser.email?.split('@')[0] || 'scholar';
  const safeUsername = `${baseUsername.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now().toString().slice(-4)}`;

  const { data: created, error } = await supabase.from('users').insert({
    email: authUser.email,
    username: safeUsername,
    password_hash: 'supabase_managed',
    first_name: meta.first_name || meta.full_name?.split(' ')[0] || 'Scholar',
    last_name: meta.last_name || meta.full_name?.split(' ').slice(1).join(' ') || '',
    is_active: true
  }).select('user_id').single();

  if (error) {
    console.error("Error syncing user to custom table:", error);
    return null;
  }

  if (created) {
    localStorage.setItem('gre_user_id', created.user_id.toString());
    return created.user_id;
  }

  return null;
};

export const initializeUser = async (): Promise<number | null> => {
  if (!supabase) return null;

  const session = await getSession();
  if (session?.user) {
    return syncAuthUser(session.user);
  }

  const storedId = localStorage.getItem('gre_user_id');
  if (storedId) {
    const { data } = await supabase.from('users').select('user_id').eq('user_id', parseInt(storedId)).single();
    if (data) return data.user_id;
  }

  // Create new guest user
  const timestamp = Date.now();
  const guestEmail = `guest_${timestamp}@example.com`;
  const guestUser = `guest_${timestamp}`;

  const { data, error } = await supabase.from('users').insert({
    email: guestEmail,
    username: guestUser,
    password_hash: 'guest_access',
    first_name: 'Guest',
    last_name: 'Scholar',
    is_active: true
  }).select('user_id').single();

  if (data) {
    localStorage.setItem('gre_user_id', data.user_id.toString());
    return data.user_id;
  }
  return null;
};

// --- Tracking Functions ---

export const startSession = async (userId: number, category: Category): Promise<number | null> => {
  if (!supabase) return null;

  const { data, error } = await supabase.from('practice_sessions').insert({
    user_id: userId,
    session_type: 'practice',
    target_category: category, // Updated to match schema
    started_at: new Date().toISOString()
  }).select('session_id').single();

  return data?.session_id || null;
};

export const saveQuestionToDb = async (question: Question): Promise<number | null> => {
  if (!supabase){
    console.log("No supa from saveQuestionToDb")
    return null;

  } 

  // Check if exact text already exists to avoid dupe
  const { data: existing } = await supabase
    .from('questions')
    .select('question_id')
    .eq('question_id', question.question_id)
    .single();

  if (existing) return existing.question_id;

  const { data: newData, error: newError } = await supabase
    .from('questions')
    .select('question_id')
    .order('question_id', { ascending: false })
    .limit(1).single()

  const qId = newData.question_id + 1;

  // Insert into 'questions' table - SCHEMA UPDATE: direct array insertion
  const { data: qData, error } = await supabase.from('questions').insert({
    question_id: qId,
    text: question.text,
    options: question.options, // Array column
    correct_index: question.correct_index,
    explanation: question.explanation,
    category: question.category,
    difficulty: question.difficulty,
    topic: question.topic || 'General',
    is_active: true
  }).select('question_id').single();

  if (error) {
    console.error("Error saving question:", error);
    return null;
  }

  return qData ? qData.question_id : null;
};

export const saveUserAnswer = async (
  userId: number,
  sessionId: number | null,
  questionId: number,
  question: Question,
  selectedOptionIndex: number,
  timeSpentSeconds: number = 60
) => {
  if (!supabase) return;

  const isCorrect = selectedOptionIndex === question.correct_index;

  // Check if already answered in this session
  const { data: existingAnswer } = await supabase
    .from('user_answers')
    .select('answer_id')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .eq('session_id', sessionId)
    .single();

  if (existingAnswer) return;

  // Insert Answer - SCHEMA UPDATE: uses selected_index
  await supabase.from('user_answers').insert({
    user_id: userId,
    question_id: questionId,
    session_id: sessionId,
    selected_index: selectedOptionIndex,
    is_correct: isCorrect,
    time_spent_seconds: timeSpentSeconds,
    answered_at: new Date().toISOString()
  });

  // Update User Progress Stats
  // SCHEMA UPDATE: Uses category/topic strings instead of IDs
  const { data: prog } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('category', question.category)
    .eq('topic', question.topic)
    .single();

  if (prog) {
    const newTotal = (prog.total_questions_attempted || 0) + 1;
    const newCorrect = (prog.total_questions_correct || 0) + (isCorrect ? 1 : 0);
    await supabase.from('user_progress').update({
      total_questions_attempted: newTotal,
      total_questions_correct: newCorrect,
      accuracy_percentage: (newCorrect / newTotal) * 100,
      last_practiced: new Date().toISOString()
    }).eq('progress_id', prog.progress_id);
  } else {
    await supabase.from('user_progress').insert({
      user_id: userId,
      category: question.category,
      topic: question.topic,
      difficulty: question.difficulty, // Store current difficulty level for context
      total_questions_attempted: 1,
      total_questions_correct: isCorrect ? 1 : 0,
      accuracy_percentage: isCorrect ? 100 : 0,
      last_practiced: new Date().toISOString()
    });
  }
};

// --- DB Fetching Logic ---

export const getUnansweredQuestion = async (
  userId: number,
  category: Category,
  difficulty: Difficulty
): Promise<Question | null> => {
  if (!supabase) return null;

  // 1. Get IDs of questions the user has already answered
  const { data: answers } = await supabase
    .from('user_answers')
    .select('question_id')
    .eq('user_id', userId);

  const answeredIds = answers?.map(a => a.question_id) || [];

  // 2. Fetch a question from DB that matches criteria and is NOT in answered list
  // SCHEMA UPDATE: Query 'questions' directly
  let query = supabase
    .from('questions')
    .select('*')
    .eq('category', category)
    .eq('difficulty', difficulty)
    .eq('is_active', true);

  if (answeredIds.length > 0) {
    query = query.not('question_id', 'in', `(${answeredIds.join(',')})`);
  }

  const { data: candidates, error } = await query.limit(20);

  if (error) {
    console.error("Error fetching questions:", error);
    return null;
  }

  if (!candidates || candidates.length === 0) return null;

  // Randomize selection from the batch
  const randomQ = candidates[Math.floor(Math.random() * candidates.length)];

  // Map to app Question type
  return {
    question_id: randomQ.question_id,
    text: randomQ.text,
    options: randomQ.options, // Already an array in DB
    correct_index: randomQ.correct_index,
    explanation: randomQ.explanation || "No explanation available.",
    category: randomQ.category as Category,
    difficulty: randomQ.difficulty as Difficulty,
    topic: randomQ.topic || "General"
  };
};

export const seedDatabase = async () => {
  if (!supabase) return;

  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true });

  if (count !== null && count > 5) {
    console.log("Database already seeded.");
    return;
  }

  console.log("Seeding database with initial questions...");

  for (const q of SEED_QUESTIONS) {
    if (q.text && q.category && q.difficulty) {
      await saveQuestionToDb(q as Question);
    }
  }
  console.log("Seeding complete.");
};