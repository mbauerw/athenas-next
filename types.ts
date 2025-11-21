export enum Category {
  VERBAL = 'Verbal Reasoning',
  QUANT = 'Quantitative Reasoning'
}

export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Question {
  id: string;
  dbId?: number; // ID from the postgres database
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: Category;
  difficulty: Difficulty;
  topic: string; // e.g., "Algebra", "Sentence Equivalence"
}

export interface UserProgress {
  verbal: {
    easy: number;
    medium: number;
    hard: number;
  };
  quant: {
    easy: number;
    medium: number;
    hard: number;
  };
  correctAnswers: number;
  totalAttempted: number;
}

export const MAX_QUESTIONS_PER_LEVEL = 50; // 50 * 3 levels * 2 categories = 300 questions