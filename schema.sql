-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.bookmarked_questions (
  bookmark_id integer NOT NULL DEFAULT nextval('bookmarked_questions_bookmark_id_seq'::regclass),
  user_id integer,
  question_id integer,
  notes text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT bookmarked_questions_pkey PRIMARY KEY (bookmark_id),
  CONSTRAINT bookmarked_questions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT bookmarked_questions_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(question_id)
);
CREATE TABLE public.practice_sessions (
  session_id integer NOT NULL DEFAULT nextval('practice_sessions_session_id_seq'::regclass),
  user_id integer,
  session_type character varying,
  target_category character varying,
  started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  completed_at timestamp without time zone,
  time_spent_seconds integer,
  is_completed boolean DEFAULT false,
  CONSTRAINT practice_sessions_pkey PRIMARY KEY (session_id),
  CONSTRAINT practice_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.questions (
  question_id integer NOT NULL DEFAULT nextval('questions_question_id_seq'::regclass),
  text text NOT NULL,
  options ARRAY NOT NULL,
  correct_index integer NOT NULL,
  explanation text NOT NULL,
  category character varying NOT NULL,
  difficulty character varying NOT NULL,
  topic character varying,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  is_active boolean DEFAULT true,
  CONSTRAINT questions_pkey PRIMARY KEY (question_id)
);
CREATE TABLE public.session_scores (
  score_id integer NOT NULL DEFAULT nextval('session_scores_score_id_seq'::regclass),
  session_id integer UNIQUE,
  user_id integer,
  category character varying,
  raw_score integer,
  percentage_score numeric,
  scaled_score integer,
  questions_attempted integer,
  questions_correct integer,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT session_scores_pkey PRIMARY KEY (score_id),
  CONSTRAINT session_scores_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.practice_sessions(session_id),
  CONSTRAINT session_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.user_answers (
  answer_id integer NOT NULL DEFAULT nextval('user_answers_answer_id_seq'::regclass),
  user_id integer,
  question_id integer,
  session_id integer,
  selected_index integer,
  is_correct boolean NOT NULL,
  time_spent_seconds integer,
  answered_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_answers_pkey PRIMARY KEY (answer_id),
  CONSTRAINT user_answers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT user_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(question_id),
  CONSTRAINT user_answers_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.practice_sessions(session_id)
);
CREATE TABLE public.user_progress (
  progress_id integer NOT NULL DEFAULT nextval('user_progress_progress_id_seq'::regclass),
  user_id integer,
  category character varying,
  topic character varying,
  difficulty character varying,
  total_questions_attempted integer DEFAULT 0,
  total_questions_correct integer DEFAULT 0,
  accuracy_percentage numeric,
  average_time_per_question integer,
  last_practiced timestamp without time zone,
  CONSTRAINT user_progress_pkey PRIMARY KEY (progress_id),
  CONSTRAINT user_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.users (
  user_id integer NOT NULL DEFAULT nextval('users_user_id_seq'::regclass),
  email character varying NOT NULL UNIQUE,
  username character varying NOT NULL UNIQUE,
  password_hash character varying NOT NULL,
  first_name character varying,
  last_name character varying,
  target_gre_date date,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  last_login timestamp without time zone,
  is_active boolean DEFAULT true,
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);