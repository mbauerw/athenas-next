export enum Category {
  VERBAL = 'VERBAL',
  QUANT = 'QUANT'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export interface Question {
  question_id: number;
  text: string;
  options: string[];
  correct_index: number;
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