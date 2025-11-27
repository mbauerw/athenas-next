import { createClient, User } from '@supabase/supabase-js';
import { Question, Category, Difficulty } from '../types';
import { SEED_QUESTIONS } from '../data/seedQuestions';
import { supabase } from '@/lib/supabase'



// --- Auth Functions ---

export const signInWithGoogle = async () => {
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

  // If auto-confirm is on, we can try to sync immediately, otherwise sync happens on login
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
  if (!supabase){
    console.log("No Session from get Session")
    return null;
  } 
  console.log("Get Session Data: ")
  const { data } = await supabase.auth.getSession();
  console.log("Get Session Data: ", data)
  return data.session;
};

// --- User Sync ---

// Syncs the Supabase Auth User (UUID) with the custom 'users' table (Integer ID)
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
  // Generate a fallback username if not provided
  const baseUsername = meta.username || authUser.email?.split('@')[0] || 'scholar';
  const safeUsername = `${baseUsername.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now().toString().slice(-4)}`;

  const { data: created, error } = await supabase.from('users').insert({
    email: authUser.email,
    username: safeUsername,
    password_hash: 'supabase_managed', // Placeholder as Supabase Auth handles real security
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

  // 1. Check if there is an active Supabase Auth session first
  const session = await getSession();
  if (session?.user) {
    return syncAuthUser(session.user);
  }

  // 2. Fallback to Guest Logic
  const storedId = localStorage.getItem('gre_user_id');
  if (storedId) {
    // validate it exists in DB
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

// --- Reference Data Helpers ---

const getOrCreateInfo = async (table: string, nameField: string, nameValue: string, idField: string): Promise<number | null> => {
  if (!supabase) return null;

  const { data: existing } = await supabase
    .from(table)
    .select(idField)
    .eq(nameField, nameValue)
    .single();

  if (existing) return (existing as any)[idField] as number;

  const { data: created } = await supabase
    .from(table)
    .insert({ [nameField]: nameValue })
    .select(idField)
    .single();

  return created ? ((created as any)[idField] as number) : null;
};

const getSectionId = async (category: Category) => {
  return getOrCreateInfo('sections', 'section_name', category, 'section_id');
};

const getTopicId = async (topicName: string, sectionId: number) => {
  if (!supabase) return null;
  
  console.log("Getting Topic ID")

  const { data: existing } = await supabase
    .from('topics')
    .select('topic_id')
    .eq('topic_name', topicName)
    .single();

  if (existing) return existing.topic_id;

  const { data: created } = await supabase
    .from('topics')
    .insert({ topic_name: topicName, section_id: sectionId })
    .select('topic_id')
    .single();
    
  return created ? created.topic_id : null;
};

const getQuestionTypeId = async (typeName: string = 'Multiple Choice') => {
  return getOrCreateInfo('question_types', 'type_name', typeName, 'question_type_id');
};

const mapDifficultyToLevel = (diff: Difficulty): number => {
  switch (diff) {
    case Difficulty.EASY: return 1;
    case Difficulty.MEDIUM: return 3;
    case Difficulty.HARD: return 5;
    default: return 3;
  }
};

// --- Tracking Functions ---

export const startSession = async (userId: number, category: Category): Promise<number | null> => {
  if (!supabase) return null;
  
  const sectionId = await getSectionId(category);

  console.log("Session started");
  
  const { data, error } = await supabase.from('practice_sessions').insert({
    user_id: userId,
    session_type: 'practice',
    section_id: sectionId,
    started_at: new Date().toISOString()
  }).select('session_id').single();

  return data?.session_id || null;
};

export const saveQuestionToDb = async (question: Question): Promise<number | null> => {
  if (!supabase) return null;

  const sectionId = await getSectionId(question.category);
  if (!sectionId) return null;

  const topicId = question.topic;
  const typeId = await getQuestionTypeId('Multiple Choice');

  const diffLevel = mapDifficultyToLevel(question.difficulty);

  // Check if exact text already exists to avoid dupe from seed
  const { data: existing } = await supabase
    .from('questions')
    .select('question_id')
    .eq('question_text', question.text)
    .single();
    
  if (existing) return existing.question_id;

  const { data: qData } = await supabase.from('questions').insert({
    section_id: sectionId,
    topic_id: topicId,
    question_type_id: typeId,
    question_text: question.text,
    difficulty_level: diffLevel,
    explanation: question.explanation,
    is_active: true
  }).select('question_id').single();

  if (!qData) return null;

  const questionId = qData.question_id;

  const optionsToInsert = question.options.map((opt, idx) => ({
    question_id: questionId,
    choice_text: opt,
    is_correct: idx === question.correct_index,
    choice_order: idx + 1
  }));

  await supabase.from('answer_choices').insert(optionsToInsert);

  return questionId;
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

  console.log("Trying to save user Answer")

  const { data: choices } = await supabase
    .from('answer_choices')
    .select('choice_id, choice_order')
    .eq('question_id', questionId)
    .order('choice_order');

  if (!choices || choices.length === 0) return;

  // Assuming choice_order matches array index + 1
  const selectedChoice = choices[selectedOptionIndex];
  if (!selectedChoice) return;

  const isCorrect = selectedOptionIndex === question.correct_index;

  // Check if already answered in this session (optional, but good for integrity)
  const { data: existingAnswer } = await supabase
    .from('user_answers')
    .select('answer_id')
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .eq('session_id', sessionId) // Remove session_id check if we want global uniqueness
    .single();

  if (existingAnswer) return; 

  await supabase.from('user_answers').insert({
    user_id: userId,
    question_id: questionId,
    session_id: sessionId,
    selected_choice_id: selectedChoice.choice_id,
    is_correct: isCorrect,
    time_spent_seconds: timeSpentSeconds,
    answered_at: new Date().toISOString()
  });
  
  // Update User Progress Stats
  const sectionId = await getSectionId(question.category);
  const topicId = question.topic;

  const { data: prog } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('section_id', sectionId)
    .eq('topic_id', topicId)
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
      section_id: sectionId,
      topic_id: topicId,
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

  const sectionId = await getSectionId(category);
  const diffLevel = mapDifficultyToLevel(difficulty);

  // 1. Get IDs of questions the user has already answered
  const { data: answers } = await supabase
    .from('user_answers')
    .select('question_id')
    .eq('user_id', userId);
  
  const answeredIds = answers?.map(a => a.question_id) || [];

  // 2. Fetch a question from DB that matches criteria and is NOT in answered list
  let query = supabase
    .from('questions')
    .select(`
      question_id, 
      question_text, 
      difficulty_level, 
      explanation,
      topics (topic_name)
    `)
    .eq('section_id', sectionId)
    .eq('difficulty_level', diffLevel)
    .eq('is_active', true);

  if (answeredIds.length > 0) {
    // Supabase JS filter for "not in"
    query = query.not('question_id', 'in', `(${answeredIds.join(',')})`);
  }

  // Randomize selection (simple way: random limit or order)
  // Since we can't do ORDER BY RANDOM() easily in standard client without RPC,
  // we'll fetch a few and pick one.
  const { data: candidates } = await query.limit(20);

  if (!candidates || candidates.length === 0) return null;

  const randomQ = candidates[Math.floor(Math.random() * candidates.length)];

  // 3. Fetch options for this question
  const { data: options } = await supabase
    .from('answer_choices')
    .select('*')
    .eq('question_id', randomQ.question_id)
    .order('choice_order');

  if (!options || options.length === 0) return null;

  // Map to app Question type
  return {
    question_id: randomQ.question_id.toString(),
    text: randomQ.question_text,
    options: options.map(o => o.choice_text),
    correct_index: options.findIndex(o => o.is_correct),
    explanation: randomQ.explanation || "No explanation available.",
    category: category,
    difficulty: difficulty,
    topic: (randomQ.topics as any)?.topic_name || "General"
  };
};

export const seedDatabase = async () => {
  if (!supabase) return;
  
  // Simple check: if we have fewer than 5 questions, run seed
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