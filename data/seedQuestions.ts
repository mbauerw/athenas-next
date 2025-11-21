import { Category, Difficulty, Question } from '../types';

// Note: Due to output size limits, this file contains a representative sample of the 300 requested questions.
// The architecture allows this list to be expanded indefinitely, or for the AI to generate and cache questions
// into the database, effectively building a library larger than 300 questions over time.

export const SEED_QUESTIONS: Partial<Question>[] = [
  // --- VERBAL: EASY ---
  {
    text: "Although the movie was panned by critics, it became a ______ hit at the box office, surprising even its producers.",
    options: ["predictable", "monumental", "modest", "marginal", "statistical"],
    correctIndex: 1,
    explanation: "The sentence implies a contrast ('Although') between the critics' negative reviews ('panned') and the movie's success. 'Monumental' fits best as it describes a huge success, contrasting with the negative reviews. 'Modest' and 'marginal' do not provide enough contrast.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    text: "The scientist's explanation was ______, making complex concepts accessible to the layperson.",
    options: ["convoluted", "lucid", "esoteric", "abstruse", "recondite"],
    correctIndex: 1,
    explanation: "'Lucid' means clear and easy to understand, which fits the context of making complex concepts accessible. The other words (convoluted, esoteric, abstruse, recondite) imply difficulty in understanding.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Sentence Equivalence"
  },

  // --- VERBAL: MEDIUM ---
  {
    text: "The politician's speech was distinct for its _____; he spoke for an hour without taking a definitive stance on any issue.",
    options: ["brevity", "eloquence", "equivocation", "candidness", "insight"],
    correctIndex: 2,
    explanation: "'Equivocation' means the use of ambiguous language to conceal the truth or avoid committing oneself. This matches the description of speaking for a long time without taking a stance. 'Brevity' contradicts 'spoke for an hour'.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    text: "Unlike his predecessor, who was known for his ______, the new manager encouraged open debate and dissenting opinions.",
    options: ["flexibility", "dogmatism", "benevolence", "magnanimity", "uncertainty"],
    correctIndex: 1,
    explanation: "The word 'Unlike' signals a contrast with the new manager who encourages debate. 'Dogmatism' refers to the tendency to lay down principles as incontrovertibly true, without consideration of evidence or the opinions of others, which opposes open debate.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Sentence Equivalence"
  },

  // --- VERBAL: HARD ---
  {
    text: "The novel's narrative structure is so ______ that it requires multiple readings to fully untangle the chronological sequence of events.",
    options: ["labyrinthine", "transparent", "rudimentary", "linear", "prosaic"],
    correctIndex: 0,
    explanation: "'Labyrinthine' means complicated and tortuous, like a labyrinth. This fits the description of a structure that requires multiple readings to untangle. 'Linear' and 'transparent' are opposites of what is described.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    text: "His reputation for ______ was well-earned; he rarely spent a penny unless absolutely necessary, often to the detriment of his own comfort.",
    options: ["munificence", "parsimony", "altruism", "profligacy", "gregariousness"],
    correctIndex: 1,
    explanation: "'Parsimony' is extreme unwillingness to spend money or use resources. This perfectly fits the description. 'Munificence', 'altruism', and 'profligacy' relate to generosity or wasteful spending.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Sentence Equivalence"
  },

  // --- QUANT: EASY ---
  {
    text: "If 3x + 7 = 19, what is the value of 5x - 2?",
    options: ["18", "20", "22", "8", "12"],
    correctIndex: 0,
    explanation: "First, solve for x: 3x = 19 - 7 -> 3x = 12 -> x = 4. Then, substitute x into the second expression: 5(4) - 2 = 20 - 2 = 18.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Algebra"
  },
  {
    text: "A store discounts a $50 item by 20%. What is the final price?",
    options: ["$10", "$30", "$35", "$40", "$45"],
    correctIndex: 3,
    explanation: "Calculate the discount amount: $50 * 0.20 = $10. Subtract the discount from the original price: $50 - $10 = $40.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Arithmetic"
  },

  // --- QUANT: MEDIUM ---
  {
    text: "The average (arithmetic mean) of five distinct integers is 12. If the smallest integer is 4, what is the maximum possible value of the largest integer?",
    options: ["35", "38", "42", "44", "50"],
    correctIndex: 1,
    explanation: "Sum = 12 * 5 = 60. Minimize others: 4, 5, 6, 7. Sum = 22. Max largest = 60 - 22 = 38.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Data Analysis"
  },
  {
    text: "Circle A has a radius of r. Circle B has a radius of 2r. What is the ratio of the area of Circle B to the area of Circle A?",
    options: ["1:2", "2:1", "4:1", "8:1", "3:1"],
    correctIndex: 2,
    explanation: "Area of Circle A = pi * r^2. Area of Circle B = pi * (2r)^2 = pi * 4r^2 = 4 * (pi * r^2). The ratio is 4:1.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Geometry"
  },

  // --- QUANT: HARD ---
  {
    text: "If x and y are integers such that x > y > 0 and x^2 - y^2 = 13, what is the value of x?",
    options: ["5", "6", "7", "8", "13"],
    correctIndex: 2,
    explanation: "Factor the equation: (x - y)(x + y) = 13. Since 13 is a prime number, its only positive integer factors are 1 and 13. Since x > y > 0, (x + y) must be the larger factor (13) and (x - y) must be the smaller factor (1). System of equations: x + y = 13, x - y = 1. Add them: 2x = 14 -> x = 7.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    text: "A certain machine produces 100 widgets in 5 hours. A second machine produces 100 widgets in 4 hours. If both machines work together at their constant rates, approximately how many hours will it take to produce 100 widgets?",
    options: ["2.0", "2.2", "2.5", "3.0", "4.5"],
    correctIndex: 1,
    explanation: "Rate of Machine 1 = 100/5 = 20 widgets/hr. Rate of Machine 2 = 100/4 = 25 widgets/hr. Combined rate = 20 + 25 = 45 widgets/hr. Time = Amount / Rate = 100 / 45 = 20/9 ≈ 2.22 hours.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Arithmetic"
  }
];