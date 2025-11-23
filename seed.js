import pg from 'pg';
const { Client } = pg;

// Mocking Enums if you paste the array exactly as is:
const Category = { VERBAL: 'VERBAL', QUANT: 'QUANT' };
const Difficulty = { EASY: 'EASY', MEDIUM: 'MEDIUM', HARD: 'HARD' }; 

const SEED_QUESTIONS = [
  {
    question_id: 1,
    text: "Although the movie was panned by critics, it became a ______ hit at the box office, surprising even its producers.",
    options: ["monumental", "predictable", "modest", "marginal", "statistical"],
    correct_index: 0,
    explanation: "The sentence implies a contrast ('Although') between the critics' negative reviews ('panned') and the movie's success. 'Monumental' fits best as it describes a huge success, contrasting with the negative reviews. 'Modest' and 'marginal' do not provide enough contrast.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 2,
    text: "The scientist's explanation was ______, making complex concepts accessible to the layperson.",
    options: ["lucid", "convoluted", "esoteric", "abstruse", "recondite"],
    correct_index: 0,
    explanation: "'Lucid' means clear and easy to understand, which fits the context of making complex concepts accessible. The other words (convoluted, esoteric, abstruse, recondite) imply difficulty in understanding.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Sentence Equivalence"
  },
  {
    question_id: 3,
    text: "The politician's speech was distinct for its _____; he spoke for an hour without taking a definitive stance on any issue.",
    options: ["brevity", "eloquence", "equivocation", "candidness", "insight"],
    correct_index: 2,
    explanation: "'Equivocation' means the use of ambiguous language to conceal the truth or avoid committing oneself. This matches the description of speaking for a long time without taking a stance. 'Brevity' contradicts 'spoke for an hour'.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 4,
    text: "Unlike his predecessor, who was known for his ______, the new manager encouraged open debate and dissenting opinions.",
    options: ["flexibility", "benevolence", "magnanimity", "dogmatism", "uncertainty"],
    correct_index: 3,
    explanation: "The word 'Unlike' signals a contrast with the new manager who encourages debate. 'Dogmatism' refers to the tendency to lay down principles as incontrovertibly true, without consideration of evidence or the opinions of others, which opposes open debate.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Sentence Equivalence"
  },
  {
    question_id: 5,
    text: "The novel's narrative structure is so ______ that it requires multiple readings to fully untangle the chronological sequence of events.",
    options: ["transparent", "labyrinthine", "rudimentary", "linear", "prosaic"],
    correct_index: 1,
    explanation: "'Labyrinthine' means complicated and tortuous, like a labyrinth. This fits the description of a structure that requires multiple readings to untangle. 'Linear' and 'transparent' are opposites of what is described.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 6,
    text: "His reputation for ______ was well-earned; he rarely spent a penny unless absolutely necessary, often to the detriment of his own comfort.",
    options: ["munificence", "parsimony", "altruism", "profligacy", "gregariousness"],
    correct_index: 1,
    explanation: "'Parsimony' is extreme unwillingness to spend money or use resources. This perfectly fits the description. 'Munificence', 'altruism', and 'profligacy' relate to generosity or wasteful spending.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Sentence Equivalence"
  },
  {
    question_id: 7,
    text: "If 3x + 7 = 19, what is the value of 5x - 2?",
    options: ["20", "18", "22", "8", "12"],
    correct_index: 1,
    explanation: "First, solve for x: 3x = 19 - 7 -> 3x = 12 -> x = 4. Then, substitute x into the second expression: 5(4) - 2 = 20 - 2 = 18.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Algebra"
  },
  {
    question_id: 8,
    text: "A store discounts a $50 item by 20%. What is the final price?",
    options: ["$10", "$30", "$35", "$40", "$45"],
    correct_index: 3,
    explanation: "Calculate the discount amount: $50 * 0.20 = $10. Subtract the discount from the original price: $50 - $10 = $40.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Arithmetic"
  },
  {
    question_id: 9,
    text: "The average (arithmetic mean) of five distinct integers is 12. If the smallest integer is 4, what is the maximum possible value of the largest integer?",
    options: ["38", "35", "42", "44", "50"],
    correct_index: 0,
    explanation: "Sum = 12 * 5 = 60. Minimize others: 4, 5, 6, 7. Sum = 22. Max largest = 60 - 22 = 38.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Data Analysis"
  },
  {
    question_id: 10,
    text: "Circle A has a radius of r. Circle B has a radius of 2r. What is the ratio of the area of Circle B to the area of Circle A?",
    options: ["1:2", "2:1", "4:1", "8:1", "3:1"],
    correct_index: 2,
    explanation: "Area of Circle A = pi * r^2. Area of Circle B = pi * (2r)^2 = pi * 4r^2 = 4 * (pi * r^2). The ratio is 4:1.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Geometry"
  },
  {
    question_id: 11,
    text: "If x and y are integers such that x > y > 0 and x^2 - y^2 = 13, what is the value of x?",
    options: ["5", "6", "7", "8", "13"],
    correct_index: 2,
    explanation: "Factor the equation: (x - y)(x + y) = 13. Since 13 is a prime number, its only positive integer factors are 1 and 13. Since x > y > 0, (x + y) must be the larger factor (13) and (x - y) must be the smaller factor (1). System of equations: x + y = 13, x - y = 1. Add them: 2x = 14 -> x = 7.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 12,
    text: "A certain machine produces 100 widgets in 5 hours. A second machine produces 100 widgets in 4 hours. If both machines work together at their constant rates, approximately how many hours will it take to produce 100 widgets?",
    options: ["2.2", "2.0", "2.5", "3.0", "4.5"],
    correct_index: 0,
    explanation: "Rate of Machine 1 = 100/5 = 20 widgets/hr. Rate of Machine 2 = 100/4 = 25 widgets/hr. Combined rate = 20 + 25 = 45 widgets/hr. Time = Amount / Rate = 100 / 45 = 20/9 ≈ 2.22 hours.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Arithmetic"
  },
  {
    question_id: 13,
    text: "Select the option that most nearly means \\\"concise\\\" in the context of scholarly writing or analytical reading.",
    options: ["lengthy", "confused", "circular", "brief"],
    correct_index: 4,
    explanation: "\\\"concise\\\" means brief and to the point. The choice \\\"brief\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 14,
    text: "Select the option that most nearly means \\\"ambivalent\\\" in the context of scholarly writing or analytical reading.",
    options: ["uncertain", "eager", "fearful", "indifferent"],
    correct_index: 0,
    explanation: "\\\"ambivalent\\\" means having mixed feelings. The choice \\\"uncertain\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 15,
    text: "Select the option that most nearly means \\\"bolster\\\" in the context of scholarly writing or analytical reading.",
    options: ["support", "dismiss", "reject", "delay"],
    correct_index: 0,
    explanation: "\\\"bolster\\\" means to support or strengthen. The choice \\\"support\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 16,
    text: "Select the option that most nearly means \\\"candid\\\" in the context of scholarly writing or analytical reading.",
    options: ["honest", "secretive", "vague", "deceptive"],
    correct_index: 0,
    explanation: "\\\"candid\\\" means truthful and straightforward. The choice \\\"honest\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 17,
    text: "Select the option that most nearly means \\\"elicit\\\" in the context of scholarly writing or analytical reading.",
    options: ["conceal", "draw out", "suppress", "ignore"],
    correct_index: 1,
    explanation: "\\\"elicit\\\" means to draw out a response. The choice \\\"draw out\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 18,
    text: "Select the option that most nearly means \\\"engender\\\" in the context of scholarly writing or analytical reading.",
    options: ["destroy", "produce", "prevent", "avoid"],
    correct_index: 1,
    explanation: "\\\"engender\\\" means to cause or give rise to. The choice \\\"produce\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 19,
    text: "Select the option that most nearly means \\\"ephemeral\\\" in the context of scholarly writing or analytical reading.",
    options: ["fleeting", "permanent", "eternal", "stable"],
    correct_index: 0,
    explanation: "\\\"ephemeral\\\" means lasting a very short time. The choice \\\"fleeting\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 20,
    text: "Select the option that most nearly means \\\"frugal\\\" in the context of scholarly writing or analytical reading.",
    options: ["wasteful", "thrifty", "lavish", "extravagant"],
    correct_index: 1,
    explanation: "\\\"frugal\\\" means economical or sparing. The choice \\\"thrifty\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 21,
    text: "Select the option that most nearly means \\\"impede\\\" in the context of scholarly writing or analytical reading.",
    options: ["assist", "promote", "help", "hinder"],
    correct_index: 4,
    explanation: "\\\"impede\\\" means to delay or prevent. The choice \\\"hinder\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 22,
    text: "Select the option that most nearly means \\\"laudable\\\" in the context of scholarly writing or analytical reading.",
    options: ["shameful", "praiseworthy", "disgraceful", "blameworthy"],
    correct_index: 1,
    explanation: "\\\"laudable\\\" means deserving praise. The choice \\\"praiseworthy\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 23,
    text: "Select the option that most nearly means \\\"meticulous\\\" in the context of scholarly writing or analytical reading.",
    options: ["careless", "sloppy", "negligent", "careful"],
    correct_index: 4,
    explanation: "\\\"meticulous\\\" means showing great attention to detail. The choice \\\"careful\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 24,
    text: "Select the option that most nearly means \\\"novel\\\" in the context of scholarly writing or analytical reading.",
    options: ["old", "traditional", "conventional", "new"],
    correct_index: 3,
    explanation: "\\\"novel\\\" (as an adjective) means new or unusual. The choice \\\"new\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 25,
    text: "Select the option that most nearly means \\\"pragmatic\\\" in the context of scholarly writing or analytical reading.",
    options: ["practical", "theoretical", "idealistic", "impractical"],
    correct_index: 0,
    explanation: "\\\"pragmatic\\\" means dealing with things sensibly and realistically. The choice \\\"practical\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 26,
    text: "Select the option that most nearly means \\\"redundant\\\" in the context of scholarly writing or analytical reading.",
    options: ["necessary", "repetitive", "essential", "concise"],
    correct_index: 1,
    explanation: "\\\"redundant\\\" means not or no longer needed or useful. The choice \\\"repetitive\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 27,
    text: "Select the option that most nearly means \\\"sporadic\\\" in the context of scholarly writing or analytical reading.",
    options: ["regular", "constant", "steady", "irregular"],
    correct_index: 4,
    explanation: "\\\"sporadic\\\" means occurring at irregular intervals. The choice \\\"irregular\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 28,
    text: "Select the option that most nearly means \\\"steadfast\\\" in the context of scholarly writing or analytical reading.",
    options: ["wavering", "uncertain", "hesitant", "resolute"],
    correct_index: 3,
    explanation: "\\\"steadfast\\\" means resolutely firm and unwavering. The choice \\\"resolute\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 29,
    text: "Select the option that most nearly means \\\"tenacious\\\" in the context of scholarly writing or analytical reading.",
    options: ["yielding", "weak", "submissive", "persistent"],
    correct_index: 3,
    explanation: "\\\"tenacious\\\" means tending to keep a firm hold of something. The choice \\\"persistent\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 30,
    text: "Select the option that most nearly means \\\"ubiquitous\\\" in the context of scholarly writing or analytical reading.",
    options: ["rare", "everywhere", "scarce", "absent"],
    correct_index: 1,
    explanation: "\\\"ubiquitous\\\" means present everywhere. The choice \\\"everywhere\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 31,
    text: "Select the option that most nearly means \\\"vindicate\\\" in the context of scholarly writing or analytical reading.",
    options: ["condemn", "justify", "blame", "accuse"],
    correct_index: 1,
    explanation: "\\\"vindicate\\\" means clear of blame or suspicion. The choice \\\"justify\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 32,
    text: "Select the option that most nearly means \\\"zealous\\\" in the context of scholarly writing or analytical reading.",
    options: ["indifferent", "apathetic", "unenthusiastic", "passionate"],
    correct_index: 3,
    explanation: "\\\"zealous\\\" means having or showing great energy or enthusiasm. The choice \\\"passionate\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    question_id: 33,
    text: "Select the option that most nearly means \\\"abate\\\" in the context of scholarly writing or analytical reading.",
    options: ["lessen", "increase", "amplify", "intensify"],
    correct_index: 0,
    explanation: "\\\"abate\\\" means become less intense. The choice \\\"lessen\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 34,
    text: "Select the option that most nearly means \\\"abstain\\\" in the context of scholarly writing or analytical reading.",
    options: ["refrain", "indulge", "partake", "engage"],
    correct_index: 0,
    explanation: "\\\"abstain\\\" means restrain oneself from doing. The choice \\\"refrain\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 35,
    text: "Select the option that most nearly means \\\"admonish\\\" in the context of scholarly writing or analytical reading.",
    options: ["praise", "commend", "compliment", "warn"],
    correct_index: 4,
    explanation: "\\\"admonish\\\" means warn or reprimand. The choice \\\"warn\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 36,
    text: "Select the option that most nearly means \\\"alleviate\\\" in the context of scholarly writing or analytical reading.",
    options: ["relieve", "worsen", "aggravate", "intensify"],
    correct_index: 0,
    explanation: "\\\"alleviate\\\" means make suffering less severe. The choice \\\"relieve\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 37,
    text: "Select the option that most nearly means \\\"amalgamate\\\" in the context of scholarly writing or analytical reading.",
    options: ["separate", "divide", "split", "combine"],
    correct_index: 3,
    explanation: "\\\"amalgamate\\\" means combine or unite. The choice \\\"combine\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 38,
    text: "Select the option that most nearly means \\\"ameliorate\\\" in the context of scholarly writing or analytical reading.",
    options: ["deteriorate", "worsen", "decline", "improve"],
    correct_index: 3,
    explanation: "\\\"ameliorate\\\" means make something bad better. The choice \\\"improve\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 39,
    text: "Select the option that most nearly means \\\"anachronistic\\\" in the context of scholarly writing or analytical reading.",
    options: ["modern", "contemporary", "current", "outdated"],
    correct_index: 3,
    explanation: "\\\"anachronistic\\\" means belonging to a period other than that being portrayed. The choice \\\"outdated\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 40,
    text: "Select the option that most nearly means \\\"anomaly\\\" in the context of scholarly writing or analytical reading.",
    options: ["deviation", "norm", "standard", "regularity"],
    correct_index: 0,
    explanation: "\\\"anomaly\\\" means something that deviates from normal. The choice \\\"deviation\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 41,
    text: "Select the option that most nearly means \\\"apathy\\\" in the context of scholarly writing or analytical reading.",
    options: ["enthusiasm", "passion", "interest", "indifference"],
    correct_index: 4,
    explanation: "\\\"apathy\\\" means lack of interest or concern. The choice \\\"indifference\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 42,
    text: "Select the option that most nearly means \\\"arduous\\\" in the context of scholarly writing or analytical reading.",
    options: ["difficult", "easy", "simple", "effortless"],
    correct_index: 0,
    explanation: "\\\"arduous\\\" means involving or requiring strenuous effort. The choice \\\"difficult\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 43,
    text: "Select the option that most nearly means \\\"ascertain\\\" in the context of scholarly writing or analytical reading.",
    options: ["guess", "assume", "speculate", "determine"],
    correct_index: 4,
    explanation: "\\\"ascertain\\\" means find out for certain. The choice \\\"determine\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 44,
    text: "Select the option that most nearly means \\\"audacious\\\" in the context of scholarly writing or analytical reading.",
    options: ["bold", "timid", "cautious", "fearful"],
    correct_index: 0,
    explanation: "\\\"audacious\\\" means showing a willingness to take bold risks. The choice \\\"bold\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 45,
    text: "Select the option that most nearly means \\\"austere\\\" in the context of scholarly writing or analytical reading.",
    options: ["ornate", "lavish", "luxurious", "severe"],
    correct_index: 3,
    explanation: "\\\"austere\\\" means severe or strict in manner. The choice \\\"severe\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 46,
    text: "Select the option that most nearly means \\\"benevolent\\\" in the context of scholarly writing or analytical reading.",
    options: ["malicious", "hostile", "cruel", "kind"],
    correct_index: 3,
    explanation: "\\\"benevolent\\\" means well-meaning and kindly. The choice \\\"kind\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 47,
    text: "Select the option that most nearly means \\\"capricious\\\" in the context of scholarly writing or analytical reading.",
    options: ["consistent", "unpredictable", "steady", "reliable"],
    correct_index: 1,
    explanation: "\\\"capricious\\\" means given to sudden changes of mood or behavior. The choice \\\"unpredictable\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 48,
    text: "Select the option that most nearly means \\\"censure\\\" in the context of scholarly writing or analytical reading.",
    options: ["criticize", "praise", "approve", "commend"],
    correct_index: 0,
    explanation: "\\\"censure\\\" means express severe disapproval. The choice \\\"criticize\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 49,
    text: "Select the option that most nearly means \\\"coalesce\\\" in the context of scholarly writing or analytical reading.",
    options: ["merge", "separate", "divide", "fragment"],
    correct_index: 0,
    explanation: "\\\"coalesce\\\" means come together to form one mass. The choice \\\"merge\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 50,
    text: "Select the option that most nearly means \\\"convoluted\\\" in the context of scholarly writing or analytical reading.",
    options: ["simple", "complex", "clear", "straightforward"],
    correct_index: 1,
    explanation: "\\\"convoluted\\\" means extremely complex and difficult to follow. The choice \\\"complex\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 51,
    text: "Select the option that most nearly means \\\"copious\\\" in the context of scholarly writing or analytical reading.",
    options: ["scarce", "meager", "sparse", "abundant"],
    correct_index: 3,
    explanation: "\\\"copious\\\" means abundant in supply or quantity. The choice \\\"abundant\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 52,
    text: "Select the option that most nearly means \\\"corroborate\\\" in the context of scholarly writing or analytical reading.",
    options: ["confirm", "refute", "contradict", "deny"],
    correct_index: 0,
    explanation: "\\\"corroborate\\\" means confirm or give support to. The choice \\\"confirm\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    question_id: 53,
    text: "Select the option that most nearly means \\\"aberrant\\\" in the context of scholarly writing or analytical reading.",
    options: ["typical", "abnormal", "standard", "conventional"],
    correct_index: 1,
    explanation: "\\\"aberrant\\\" means departing from normal. The choice \\\"abnormal\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 54,
    text: "Select the option that most nearly means \\\"abstemious\\\" in the context of scholarly writing or analytical reading.",
    options: ["moderate", "excessive", "indulgent", "greedy"],
    correct_index: 0,
    explanation: "\\\"abstemious\\\" means not self-indulgent, especially in eating and drinking. The choice \\\"moderate\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 55,
    text: "Select the option that most nearly means \\\"acerbic\\\" in the context of scholarly writing or analytical reading.",
    options: ["sweet", "gentle", "kind", "harsh"],
    correct_index: 4,
    explanation: "\\\"acerbic\\\" means sharp and forthright. The choice \\\"harsh\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 56,
    text: "Select the option that most nearly means \\\"acrimony\\\" in the context of scholarly writing or analytical reading.",
    options: ["sweetness", "kindness", "warmth", "bitterness"],
    correct_index: 3,
    explanation: "\\\"acrimony\\\" means bitterness or ill feeling. The choice \\\"bitterness\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 57,
    text: "Select the option that most nearly means \\\"adulation\\\" in the context of scholarly writing or analytical reading.",
    options: ["criticism", "condemnation", "scorn", "excessive praise"],
    correct_index: 4,
    explanation: "\\\"adulation\\\" means obsequious flattery. The choice \\\"excessive praise\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 58,
    text: "Select the option that most nearly means \\\"affable\\\" in the context of scholarly writing or analytical reading.",
    options: ["hostile", "aggressive", "unfriendly", "friendly"],
    correct_index: 3,
    explanation: "\\\"affable\\\" means friendly and easy to talk to. The choice \\\"friendly\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 59,
    text: "Select the option that most nearly means \\\"alacrity\\\" in the context of scholarly writing or analytical reading.",
    options: ["reluctance", "eagerness", "hesitation", "delay"],
    correct_index: 1,
    explanation: "\\\"alacrity\\\" means brisk and cheerful readiness. The choice \\\"eagerness\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 60,
    text: "Select the option that most nearly means \\\"altruistic\\\" in the context of scholarly writing or analytical reading.",
    options: ["selfish", "egotistical", "greedy", "selfless"],
    correct_index: 3,
    explanation: "\\\"altruistic\\\" means showing selfless concern for others. The choice \\\"selfless\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 61,
    text: "Select the option that most nearly means \\\"ambiguous\\\" in the context of scholarly writing or analytical reading.",
    options: ["clear", "obvious", "definite", "unclear"],
    correct_index: 3,
    explanation: "\\\"ambiguous\\\" means open to more than one interpretation. The choice \\\"unclear\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 62,
    text: "Select the option that most nearly means \\\"amelioration\\\" in the context of scholarly writing or analytical reading.",
    options: ["deterioration", "improvement", "decline", "regression"],
    correct_index: 1,
    explanation: "\\\"amelioration\\\" means the act of making better. The choice \\\"improvement\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 63,
    text: "Select the option that most nearly means \\\"anachronism\\\" in the context of scholarly writing or analytical reading.",
    options: ["modern invention", "current trend", "timely occurrence", "something out of place in time"],
    correct_index: 3,
    explanation: "\\\"anachronism\\\" means a thing belonging to a period other than when portrayed. The choice \\\"something out of place in time\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 64,
    text: "Select the option that most nearly means \\\"anodyne\\\" in the context of scholarly writing or analytical reading.",
    options: ["soothing", "painful", "distressing", "irritating"],
    correct_index: 0,
    explanation: "\\\"anodyne\\\" means not likely to provoke dissent or offense. The choice \\\"soothing\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 65,
    text: "Select the option that most nearly means \\\"antipathy\\\" in the context of scholarly writing or analytical reading.",
    options: ["affection", "aversion", "fondness", "liking"],
    correct_index: 1,
    explanation: "\\\"antipathy\\\" means a deep-seated feeling of dislike. The choice \\\"aversion\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 66,
    text: "Select the option that most nearly means \\\"arcane\\\" in the context of scholarly writing or analytical reading.",
    options: ["obvious", "mysterious", "common", "well-known"],
    correct_index: 1,
    explanation: "\\\"arcane\\\" means understood by few; mysterious. The choice \\\"mysterious\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 67,
    text: "Select the option that most nearly means \\\"assuage\\\" in the context of scholarly writing or analytical reading.",
    options: ["worsen", "ease", "aggravate", "intensify"],
    correct_index: 1,
    explanation: "\\\"assuage\\\" means make an unpleasant feeling less intense. The choice \\\"ease\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 68,
    text: "Select the option that most nearly means \\\"avarice\\\" in the context of scholarly writing or analytical reading.",
    options: ["generosity", "charity", "kindness", "greed"],
    correct_index: 4,
    explanation: "\\\"avarice\\\" means extreme greed for wealth. The choice \\\"greed\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 69,
    text: "Select the option that most nearly means \\\"banal\\\" in the context of scholarly writing or analytical reading.",
    options: ["original", "unique", "novel", "commonplace"],
    correct_index: 4,
    explanation: "\\\"banal\\\" means so lacking in originality as to be obvious. The choice \\\"commonplace\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 70,
    text: "Select the option that most nearly means \\\"bellicose\\\" in the context of scholarly writing or analytical reading.",
    options: ["peaceful", "calm", "tranquil", "aggressive"],
    correct_index: 3,
    explanation: "\\\"bellicose\\\" means demonstrating aggression. The choice \\\"aggressive\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 71,
    text: "Select the option that most nearly means \\\"bucolic\\\" in the context of scholarly writing or analytical reading.",
    options: ["urban", "rural", "metropolitan", "cosmopolitan"],
    correct_index: 1,
    explanation: "\\\"bucolic\\\" means relating to the pleasant aspects of the countryside. The choice \\\"rural\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 72,
    text: "Select the option that most nearly means \\\"cacophony\\\" in the context of scholarly writing or analytical reading.",
    options: ["harmony", "melody", "pleasant sound", "harsh noise"],
    correct_index: 3,
    explanation: "\\\"cacophony\\\" means a harsh discordant mixture of sounds. The choice \\\"harsh noise\\\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    question_id: 73,
    text: "The scientist's argument was so _____ that even her harshest critics were forced to acknowledge its validity.",
    options: ["compelling", "dubious", "ambiguous", "superficial", "contentious"],
    correct_index: 0,
    explanation: "Compelling means convincing or persuasive, which fits the context of critics acknowledging validity.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 74,
    text: "Despite her _____ demeanor, she was known among friends for her warm and generous nature.",
    options: ["affable", "austere", "gregarious", "cordial", "congenial"],
    correct_index: 1,
    explanation: "Austere means severe or stern, contrasting with warm and generous.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 75,
    text: "The novel's plot was so _____ that readers found it difficult to follow the sequence of events.",
    options: ["convoluted", "lucid", "straightforward", "transparent", "elementary"],
    correct_index: 0,
    explanation: "Convoluted means complex and difficult to follow.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 76,
    text: "The professor's lecture was _____, covering topics from ancient philosophy to modern physics.",
    options: ["focused", "narrow", "wide-ranging", "specific", "limited"],
    correct_index: 2,
    explanation: "Wide-ranging means covering many topics or areas.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 77,
    text: "Her _____ approach to problem-solving often led to innovative solutions.",
    options: ["conventional", "orthodox", "unorthodox", "traditional", "standard"],
    correct_index: 2,
    explanation: "Unorthodox means unconventional, which leads to innovative solutions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 78,
    text: "The politician's speech was filled with _____, making it difficult to determine his actual position.",
    options: ["clarity", "precision", "platitudes", "specifics", "details"],
    correct_index: 2,
    explanation: "Platitudes are overused statements that reveal little actual meaning.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 79,
    text: "The artist's work was _____ by critics who failed to appreciate its subtle complexity.",
    options: ["lauded", "celebrated", "praised", "dismissed", "acclaimed"],
    correct_index: 3,
    explanation: "Dismissed means rejected or disregarded, fitting with critics failing to appreciate.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 80,
    text: "The defendant's testimony was so _____ that the jury had trouble believing any part of it.",
    options: ["credible", "consistent", "reliable", "trustworthy", "contradictory"],
    correct_index: 4,
    explanation: "Contradictory means inconsistent or conflicting, making it hard to believe.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 81,
    text: "The museum's collection was _____, featuring artifacts from every continent.",
    options: ["provincial", "homogeneous", "uniform", "eclectic", "monotonous"],
    correct_index: 3,
    explanation: "Eclectic means deriving from various sources, fitting for a diverse collection.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 82,
    text: "His _____ nature made him popular at social gatherings.",
    options: ["reticent", "taciturn", "gregarious", "withdrawn", "reserved"],
    correct_index: 2,
    explanation: "Gregarious means sociable and enjoying company of others.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 83,
    text: "The researcher's findings were _____ by subsequent studies that produced identical results.",
    options: ["corroborated", "refuted", "disputed", "challenged", "contradicted"],
    correct_index: 0,
    explanation: "Corroborated means confirmed or supported by evidence.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 84,
    text: "The comedian's humor was so _____ that it appealed to audiences of all ages.",
    options: ["esoteric", "obscure", "universal", "cryptic", "arcane"],
    correct_index: 2,
    explanation: "Universal means applicable to all, fitting for all-age appeal.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 85,
    text: "The CEO's decision to resign was _____, shocking both employees and shareholders.",
    options: ["anticipated", "expected", "precipitous", "predictable", "foreseen"],
    correct_index: 2,
    explanation: "Precipitous means sudden and dramatic, fitting for a shocking decision.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 86,
    text: "The scholar's writing style was characterized by its _____ prose, making complex ideas accessible.",
    options: ["opaque", "lucid", "murky", "obscure", "vague"],
    correct_index: 1,
    explanation: "Lucid means clear and easy to understand.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 87,
    text: "Despite the _____ conditions, the expedition team completed their mission successfully.",
    options: ["favorable", "optimal", "ideal", "adverse", "perfect"],
    correct_index: 3,
    explanation: "Adverse means unfavorable or harmful, contrasting with successful completion.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 88,
    text: "The author's latest novel was criticized for its _____ characters who lacked depth.",
    options: ["complex", "one-dimensional", "nuanced", "multifaceted", "intricate"],
    correct_index: 1,
    explanation: "One-dimensional means lacking depth or complexity.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 89,
    text: "The diplomat's _____ prevented the situation from escalating into a full-blown crisis.",
    options: ["incompetence", "ineptitude", "clumsiness", "awkwardness", "tact"],
    correct_index: 4,
    explanation: "Tact means skill in dealing with difficult situations.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 90,
    text: "The company's new policy was met with _____ from employees who felt it was unfair.",
    options: ["approval", "acceptance", "enthusiasm", "support", "indignation"],
    correct_index: 4,
    explanation: "Indignation means anger at perceived injustice.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 91,
    text: "The architect's design was both _____ and functional, proving that beauty and utility need not be mutually exclusive.",
    options: ["ugly", "plain", "ordinary", "mundane", "aesthetic"],
    correct_index: 4,
    explanation: "Aesthetic means beautiful or pleasing in appearance.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 92,
    text: "The scientist's theory was initially _____ by the academic community but later gained widespread acceptance.",
    options: ["embraced", "spurned", "welcomed", "adopted", "approved"],
    correct_index: 1,
    explanation: "Spurned means rejected, contrasting with later acceptance.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 93,
    text: "The documentary's portrayal of the event was _____, showing both positive and negative aspects without bias.",
    options: ["partisan", "one-sided", "skewed", "balanced", "prejudiced"],
    correct_index: 3,
    explanation: "Balanced means showing both sides without bias.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 94,
    text: "The manager's _____ leadership style fostered creativity and independence among team members.",
    options: ["authoritarian", "permissive", "dictatorial", "rigid", "inflexible"],
    correct_index: 1,
    explanation: "Permissive means allowing freedom and fostering independence.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 95,
    text: "The researcher's methodology was _____, incorporating both qualitative and quantitative approaches.",
    options: ["narrow", "eclectic", "limited", "restricted", "confined"],
    correct_index: 1,
    explanation: "Eclectic means deriving from various sources or methods.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 96,
    text: "The athlete's performance was _____, breaking multiple records in a single competition.",
    options: ["mediocre", "average", "ordinary", "exceptional", "typical"],
    correct_index: 3,
    explanation: "Exceptional means outstanding, fitting for breaking records.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 97,
    text: "The teacher's _____ explanations helped even struggling students understand complex concepts.",
    options: ["obscure", "confusing", "vague", "ambiguous", "pellucid"],
    correct_index: 4,
    explanation: "Pellucid means clear and easy to understand.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    question_id: 98,
    text: "The historian's account was remarkable for its _____, presenting events without the emotional coloring that often characterizes such narratives.",
    options: ["passion", "fervor", "zeal", "enthusiasm", "objectivity"],
    correct_index: 4,
    explanation: "Objectivity means presenting without emotional bias or personal feelings.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 99,
    text: "The company's _____ approach to innovation, investing heavily in research while maintaining core business operations, proved highly successful.",
    options: ["reckless", "haphazard", "chaotic", "balanced", "disorganized"],
    correct_index: 3,
    explanation: "Balanced means maintaining equilibrium between different aspects.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 100,
    text: "The author's prose style, while _____ to some readers, was praised by critics for its sophistication.",
    options: ["accessible", "opaque", "transparent", "clear", "simple"],
    correct_index: 1,
    explanation: "Opaque means difficult to understand, contrasting with critical praise.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 101,
    text: "The negotiator's _____ allowed her to navigate the complex discussions without offending any party.",
    options: ["bluntness", "diplomacy", "tactlessness", "crudeness", "rudeness"],
    correct_index: 1,
    explanation: "Diplomacy means skill in handling delicate situations tactfully.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 102,
    text: "The scientist's hypothesis was _____ by the experimental results, forcing a reconsideration of the theory.",
    options: ["supported", "confirmed", "validated", "proven", "undermined"],
    correct_index: 4,
    explanation: "Undermined means weakened or damaged, requiring reconsideration.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 103,
    text: "The professor's lectures were characterized by their _____, often incorporating references from literature, history, and science.",
    options: ["breadth", "narrowness", "limitation", "restriction", "confinement"],
    correct_index: 0,
    explanation: "Breadth means wide range or scope of knowledge.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 104,
    text: "The committee's decision was _____, taking into account multiple perspectives before reaching a conclusion.",
    options: ["deliberate", "hasty", "impulsive", "rash", "spontaneous"],
    correct_index: 0,
    explanation: "Deliberate means careful and thoughtful in decision-making.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 105,
    text: "The artist's work was _____ in its detail, with every element carefully considered and executed.",
    options: ["meticulous", "careless", "sloppy", "negligent", "haphazard"],
    correct_index: 0,
    explanation: "Meticulous means showing great attention to detail.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 106,
    text: "The politician's speech was criticized for being _____, full of impressive-sounding but ultimately meaningless phrases.",
    options: ["substantive", "grandiloquent", "meaningful", "significant", "important"],
    correct_index: 1,
    explanation: "Grandiloquent means pompous or inflated in style.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 107,
    text: "The research findings were _____, contradicting the prevailing theories in the field.",
    options: ["conventional", "iconoclastic", "orthodox", "traditional", "standard"],
    correct_index: 1,
    explanation: "Iconoclastic means attacking or criticizing established beliefs.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 108,
    text: "The witness's testimony was considered _____ due to numerous inconsistencies with physical evidence.",
    options: ["reliable", "trustworthy", "credible", "dependable", "dubious"],
    correct_index: 4,
    explanation: "Dubious means doubtful or questionable.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 109,
    text: "The author's narrative technique was _____, weaving together multiple storylines across different time periods.",
    options: ["intricate", "simple", "straightforward", "basic", "elementary"],
    correct_index: 0,
    explanation: "Intricate means very complicated or detailed.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 110,
    text: "The judge's ruling was praised for its _____, carefully balancing legal precedent with contemporary values.",
    options: ["bias", "prejudice", "partiality", "favoritism", "judiciousness"],
    correct_index: 4,
    explanation: "Judiciousness means having good judgment or sense.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 111,
    text: "The scientist's explanation, though technically accurate, was too _____ for the general audience to comprehend.",
    options: ["simple", "accessible", "clear", "straightforward", "esoteric"],
    correct_index: 4,
    explanation: "Esoteric means understood by only a select group.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 112,
    text: "The musician's performance was _____, demonstrating both technical mastery and emotional depth.",
    options: ["mediocre", "average", "ordinary", "typical", "virtuosic"],
    correct_index: 4,
    explanation: "Virtuosic means displaying exceptional skill or technique.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 113,
    text: "The company's financial practices were found to be _____, violating multiple regulatory guidelines.",
    options: ["legitimate", "legal", "proper", "illicit", "authorized"],
    correct_index: 3,
    explanation: "Illicit means forbidden by law or rules.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 114,
    text: "The architect's design was _____, incorporating elements from various historical periods and cultures.",
    options: ["syncretic", "homogeneous", "uniform", "consistent", "identical"],
    correct_index: 0,
    explanation: "Syncretic means combining different forms or styles.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 115,
    text: "The defendant's alibi proved _____, supported by multiple witnesses and physical evidence.",
    options: ["ironclad", "weak", "questionable", "dubious", "suspect"],
    correct_index: 0,
    explanation: "Ironclad means impossible to contradict or disprove.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 116,
    text: "The critic's review was _____, praising some aspects while harshly condemning others.",
    options: ["uniform", "consistent", "one-sided", "ambivalent", "unqualified"],
    correct_index: 3,
    explanation: "Ambivalent means having mixed feelings or contradictory attitudes.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 117,
    text: "The researcher's conclusions were considered _____, based on a small, non-representative sample.",
    options: ["valid", "sound", "legitimate", "specious", "credible"],
    correct_index: 3,
    explanation: "Specious means superficially plausible but actually wrong.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 118,
    text: "The diplomat's language was deliberately _____, allowing for multiple interpretations to satisfy all parties.",
    options: ["equivocal", "precise", "exact", "definite", "explicit"],
    correct_index: 0,
    explanation: "Equivocal means open to more than one interpretation.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 119,
    text: "The historian's account was notable for its _____, avoiding the anachronistic judgments common in such works.",
    options: ["presentism", "modernization", "contemporaneity", "chronological fidelity", "currency"],
    correct_index: 3,
    explanation: "Chronological fidelity means accuracy to the time period in question.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 120,
    text: "The leader's response to the crisis was _____, demonstrating both decisiveness and compassion.",
    options: ["ineffective", "clumsy", "inept", "bungling", "adroit"],
    correct_index: 4,
    explanation: "Adroit means clever or skillful in dealing with situations.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 121,
    text: "The economist's predictions proved _____, accurately forecasting the market's direction despite widespread skepticism.",
    options: ["erroneous", "prescient", "mistaken", "incorrect", "wrong"],
    correct_index: 1,
    explanation: "Prescient means having knowledge of events before they occur.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 122,
    text: "The playwright's dialogue was praised for its _____, capturing the rhythms and patterns of natural speech.",
    options: ["artificiality", "falseness", "unreality", "contrivance", "verisimilitude"],
    correct_index: 4,
    explanation: "Verisimilitude means the appearance of being true or real.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    question_id: 123,
    text: "The philosopher's argument was _____, relying on carefully constructed logical progressions that left little room for counterargument.",
    options: ["syllogistic", "tenuous", "weak", "flimsy", "fragile"],
    correct_index: 0,
    explanation: "Syllogistic means using deductive reasoning, fitting for careful logical construction.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 124,
    text: "The artist's work was characterized by its _____, deliberately rejecting traditional forms and conventions.",
    options: ["orthodoxy", "conformity", "traditionalism", "iconoclasm", "conventionality"],
    correct_index: 3,
    explanation: "Iconoclasm means attacking or criticizing cherished beliefs or institutions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 125,
    text: "The scholar's interpretation was considered _____, offering insights that fundamentally changed understanding of the text.",
    options: ["derivative", "seminal", "imitative", "conventional", "ordinary"],
    correct_index: 1,
    explanation: "Seminal means strongly influencing later developments.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 126,
    text: "The politician's rhetoric, though ostensibly moderate, contained _____ appeals to extremist sentiments.",
    options: ["veiled", "overt", "explicit", "obvious", "apparent"],
    correct_index: 0,
    explanation: "Veiled means partially concealed or hidden.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 127,
    text: "The scientist's methodology was criticized for its _____, failing to account for variables that could affect the results.",
    options: ["rigor", "precision", "exactness", "laxity", "meticulousness"],
    correct_index: 3,
    explanation: "Laxity means lack of strictness or care.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 128,
    text: "The author's style was notably _____, using few words to convey complex ideas with precision.",
    options: ["verbose", "laconic", "wordy", "prolix", "long-winded"],
    correct_index: 1,
    explanation: "Laconic means using very few words.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 129,
    text: "The committee's decision-making process was _____, characterized by constant delays and inability to reach conclusions.",
    options: ["efficient", "sclerotic", "streamlined", "effective", "productive"],
    correct_index: 1,
    explanation: "Sclerotic means rigid and unresponsive, unable to function properly.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 130,
    text: "The historical account was marred by _____, presenting events in a way that served the author's political agenda.",
    options: ["objectivity", "impartiality", "neutrality", "tendentiousness", "fairness"],
    correct_index: 3,
    explanation: "Tendentiousness means expressing a strong opinion or bias.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 131,
    text: "The diplomat's approach was characterized by _____, carefully avoiding actions that might provoke conflict.",
    options: ["bellicosity", "circumspection", "aggression", "hostility", "combativeness"],
    correct_index: 1,
    explanation: "Circumspection means careful consideration of consequences.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 132,
    text: "The critic's review was _____, filled with harsh and bitter attacks on the artist's character.",
    options: ["vitriolic", "laudatory", "complimentary", "flattering", "appreciative"],
    correct_index: 0,
    explanation: "Vitriolic means filled with bitter criticism or malice.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 133,
    text: "The scientist's hypothesis, though initially _____, gained acceptance as supporting evidence accumulated.",
    options: ["accepted", "orthodox", "conventional", "heretical", "mainstream"],
    correct_index: 3,
    explanation: "Heretical means holding beliefs contrary to established doctrine.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 134,
    text: "The leader's style was distinctly _____, fostering collaboration and shared decision-making.",
    options: ["autocratic", "dictatorial", "authoritarian", "despotic", "collegial"],
    correct_index: 4,
    explanation: "Collegial means characterized by shared responsibility among colleagues.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 135,
    text: "The philosopher's arguments were criticized for their _____, relying on complex terminology that obscured rather than clarified meaning.",
    options: ["obscurantism", "clarity", "transparency", "lucidity", "perspicuity"],
    correct_index: 0,
    explanation: "Obscurantism means deliberate vagueness or abstruseness.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 136,
    text: "The researcher's findings were _____, appearing valid but based on flawed methodology.",
    options: ["specious", "genuine", "authentic", "legitimate", "valid"],
    correct_index: 0,
    explanation: "Specious means superficially plausible but actually wrong.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 137,
    text: "The novel's structure was deliberately _____, challenging readers with non-linear narratives and multiple perspectives.",
    options: ["straightforward", "simple", "linear", "labyrinthine", "direct"],
    correct_index: 3,
    explanation: "Labyrinthine means extremely complex and confusing.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 138,
    text: "The speaker's tone was _____, expressing disapproval through subtle hints rather than direct criticism.",
    options: ["approving", "laudatory", "commendatory", "deprecatory", "favorable"],
    correct_index: 3,
    explanation: "Deprecatory means expressing disapproval or criticism.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 139,
    text: "The committee's recommendations were notably _____, taking into account diverse viewpoints and competing interests.",
    options: ["narrow", "catholic", "limited", "restricted", "parochial"],
    correct_index: 1,
    explanation: "Catholic (lowercase) means including a wide variety of things; all-embracing.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 140,
    text: "The scientist's prose, though _____ in its accuracy, was criticized for lacking accessibility to non-specialists.",
    options: ["fastidious", "imprecise", "careless", "inexact", "sloppy"],
    correct_index: 0,
    explanation: "Fastidious means very attentive to accuracy and detail.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 141,
    text: "The author's treatment of the subject was remarkably _____, managing to discuss controversial topics without taking sides.",
    options: ["partisan", "evenhanded", "biased", "prejudiced", "one-sided"],
    correct_index: 1,
    explanation: "Evenhanded means fair and impartial in treatment.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 142,
    text: "The politician's statements were characterized by _____, using ambiguous language that could be interpreted in multiple ways.",
    options: ["equivocation", "clarity", "precision", "explicitness", "directness"],
    correct_index: 0,
    explanation: "Equivocation means using ambiguous language to conceal truth or avoid commitment.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 143,
    text: "The scholar's work was marked by its _____, drawing on sources and methods from multiple disciplines.",
    options: ["eclecticism", "narrowness", "specialization", "limitation", "restriction"],
    correct_index: 0,
    explanation: "Eclecticism means deriving ideas from various sources.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 144,
    text: "The judge's ruling demonstrated _____, carefully balancing legal principles with practical considerations.",
    options: ["rigidity", "inflexibility", "obstinacy", "stubbornness", "sagacity"],
    correct_index: 4,
    explanation: "Sagacity means wisdom and good judgment.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 145,
    text: "The researcher's approach was distinctly _____, focusing on empirical observation rather than theoretical speculation.",
    options: ["empirical", "speculative", "theoretical", "abstract", "conjectural"],
    correct_index: 0,
    explanation: "Empirical means based on observation or experience rather than theory.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 146,
    text: "The writer's style was notably _____, characterized by elegant and refined language.",
    options: ["crude", "polished", "rough", "coarse", "unrefined"],
    correct_index: 1,
    explanation: "Polished means refined and elegant.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 147,
    text: "The historian's account was praised for its _____, presenting multiple perspectives without imposing a single interpretation.",
    options: ["dogmatism", "pluralism", "rigidity", "absolutism", "inflexibility"],
    correct_index: 1,
    explanation: "Pluralism means a condition of society with diverse groups coexisting.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 148,
    text: "The scientist's explanation, while accurate, was criticized for its _____, making it inaccessible to general audiences.",
    options: ["simplicity", "clarity", "accessibility", "transparency", "recondite nature"],
    correct_index: 4,
    explanation: "Recondite means little known; abstruse.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 149,
    text: "The leader's management style was distinctly _____, delegating authority and encouraging independent decision-making.",
    options: ["micromanaging", "decentralized", "controlling", "authoritarian", "domineering"],
    correct_index: 1,
    explanation: "Decentralized means distributed away from a central authority.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 150,
    text: "The critic's analysis was marked by its _____, combining rigorous scholarship with accessible prose.",
    options: ["obscurity", "opacity", "murkiness", "lucidity", "vagueness"],
    correct_index: 3,
    explanation: "Lucidity means clarity of expression, fitting for accessibility with rigor.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 151,
    text: "The executive's _____ for detail was legendary; no aspect of the project, however minor, escaped her scrutiny.",
    options: ["disregard", "apathy", "indifference", "negligence", "predilection"],
    correct_index: 4,
    explanation: "Predilection means a preference or special liking for something, fitting for attention to detail.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    question_id: 152,
    text: "If x + 5 = 12, what is the value of 2x + 3?",
    options: ["19", "21", "23", "25", "17"],
    correct_index: 4,
    explanation: "First solve for x: x = 12 - 5 = 7. Then 2x + 3 = 2(7) + 3 = 14 + 3 = 17.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Algebra"
  },
  {
    question_id: 153,
    text: "What is 15% of 80?",
    options: ["8", "10", "12", "14", "16"],
    correct_index: 2,
    explanation: "15% of 80 = 0.15 × 80 = 12.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Arithmetic"
  },
  {
    question_id: 154,
    text: "If a rectangle has length 8 and width 5, what is its area?",
    options: ["13", "26", "40", "45", "50"],
    correct_index: 2,
    explanation: "Area of rectangle = length × width = 8 × 5 = 40.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Geometry"
  },
  {
    question_id: 155,
    text: "What is the average of 6, 8, and 10?",
    options: ["6", "7", "8", "9", "10"],
    correct_index: 2,
    explanation: "Average = (6 + 8 + 10) / 3 = 24 / 3 = 8.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Data Analysis"
  },
  {
    question_id: 156,
    text: "If 2x = 16, what is x?",
    options: ["4", "6", "8", "10", "12"],
    correct_index: 2,
    explanation: "Divide both sides by 2: x = 16 / 2 = 8.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Algebra"
  },
  {
    question_id: 157,
    text: "What is 25% of 200?",
    options: ["25", "40", "50", "75", "100"],
    correct_index: 2,
    explanation: "25% of 200 = 0.25 × 200 = 50.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Arithmetic"
  },
  {
    question_id: 158,
    text: "If a square has side length 6, what is its perimeter?",
    options: ["12", "18", "24", "30", "36"],
    correct_index: 2,
    explanation: "Perimeter of square = 4 × side = 4 × 6 = 24.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Geometry"
  },
  {
    question_id: 159,
    text: "What is the sum of the first 5 positive integers?",
    options: ["10", "12", "15", "18", "20"],
    correct_index: 2,
    explanation: "1 + 2 + 3 + 4 + 5 = 15.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Arithmetic"
  },
  {
    question_id: 160,
    text: "If 3y - 2 = 13, what is y?",
    options: ["3", "4", "5", "6", "7"],
    correct_index: 2,
    explanation: "Add 2 to both sides: 3y = 15. Divide by 3: y = 5.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Algebra"
  },
  {
    question_id: 161,
    text: "What is 30% of 150?",
    options: ["30", "35", "45", "50", "55"],
    correct_index: 2,
    explanation: "30% of 150 = 0.30 × 150 = 45.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Arithmetic"
  },
  {
    question_id: 162,
    text: "If a circle has radius 3, what is its area? (Use π ≈ 3.14)",
    options: ["6π", "9π", "12π", "18π", "27π"],
    correct_index: 1,
    explanation: "Area of circle = πr² = π(3²) = 9π.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Geometry"
  },
  {
    question_id: 163,
    text: "What is the median of 3, 7, 5, 9, 4?",
    options: ["3", "4", "5", "6", "7"],
    correct_index: 2,
    explanation: "Arrange in order: 3, 4, 5, 7, 9. The median is the middle value: 5.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Data Analysis"
  },
  {
    question_id: 164,
    text: "If x/4 = 5, what is x?",
    options: ["10", "15", "20", "25", "30"],
    correct_index: 2,
    explanation: "Multiply both sides by 4: x = 5 × 4 = 20.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Algebra"
  },
  {
    question_id: 165,
    text: "What is 10% of 90?",
    options: ["6", "7", "8", "9", "10"],
    correct_index: 3,
    explanation: "10% of 90 = 0.10 × 90 = 9.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Arithmetic"
  },
  {
    question_id: 166,
    text: "If a triangle has base 10 and height 6, what is its area?",
    options: ["15", "20", "30", "40", "60"],
    correct_index: 2,
    explanation: "Area of triangle = (1/2) × base × height = (1/2) × 10 × 6 = 30.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Geometry"
  },
  {
    question_id: 167,
    text: "What is the mode of 2, 5, 3, 5, 7, 5, 9?",
    options: ["2", "3", "5", "7", "9"],
    correct_index: 2,
    explanation: "The mode is the most frequent value: 5 appears three times.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Data Analysis"
  },
  {
    question_id: 168,
    text: "If 5a + 3 = 23, what is a?",
    options: ["2", "3", "4", "5", "6"],
    correct_index: 2,
    explanation: "Subtract 3: 5a = 20. Divide by 5: a = 4.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Algebra"
  },
  {
    question_id: 169,
    text: "What is 20% of 75?",
    options: ["10", "12", "15", "18", "20"],
    correct_index: 2,
    explanation: "20% of 75 = 0.20 × 75 = 15.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Arithmetic"
  },
  {
    question_id: 170,
    text: "If a square has area 36, what is the length of one side?",
    options: ["4", "5", "6", "7", "8"],
    correct_index: 2,
    explanation: "Side = √area = √36 = 6.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Geometry"
  },
  {
    question_id: 171,
    text: "What is the range of 4, 8, 2, 10, 6?",
    options: ["4", "6", "8", "10", "12"],
    correct_index: 2,
    explanation: "Range = maximum - minimum = 10 - 2 = 8.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Data Analysis"
  },
  {
    question_id: 172,
    text: "If 2b - 5 = 11, what is b?",
    options: ["5", "6", "7", "8", "9"],
    correct_index: 3,
    explanation: "Add 5: 2b = 16. Divide by 2: b = 8.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Algebra"
  },
  {
    question_id: 173,
    text: "What is 40% of 50?",
    options: ["10", "15", "20", "25", "30"],
    correct_index: 2,
    explanation: "40% of 50 = 0.40 × 50 = 20.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Arithmetic"
  },
  {
    question_id: 174,
    text: "If a rectangle has perimeter 30 and length 10, what is its width?",
    options: ["3", "4", "5", "6", "7"],
    correct_index: 2,
    explanation: "Perimeter = 2(length + width). So 30 = 2(10 + width), 15 = 10 + width, width = 5.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Geometry"
  },
  {
    question_id: 175,
    text: "What is the average of 12, 15, and 18?",
    options: ["12", "13", "15", "16", "18"],
    correct_index: 2,
    explanation: "Average = (12 + 15 + 18) / 3 = 45 / 3 = 15.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Data Analysis"
  },
  {
    question_id: 176,
    text: "If 4c = 32, what is c?",
    options: ["4", "6", "8", "10", "12"],
    correct_index: 2,
    explanation: "Divide both sides by 4: c = 32 / 4 = 8.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Algebra"
  },
  {
    question_id: 177,
    text: "If x² - 9 = 0, what are the possible values of x?",
    options: ["±3", "3 only", "-3 only", "9", "±9"],
    correct_index: 0,
    explanation: "x² = 9, so x = ±3.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Algebra"
  },
  {
    question_id: 178,
    text: "A car travels 180 miles in 3 hours. What is its average speed?",
    options: ["50 mph", "55 mph", "60 mph", "65 mph", "70 mph"],
    correct_index: 2,
    explanation: "Speed = distance / time = 180 / 3 = 60 mph.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Arithmetic"
  },
  {
    question_id: 179,
    text: "If the area of a circle is 49π, what is its radius?",
    options: ["5", "6", "7", "8", "9"],
    correct_index: 2,
    explanation: "Area = πr², so 49π = πr², r² = 49, r = 7.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Geometry"
  },
  {
    question_id: 180,
    text: "The average of five numbers is 20. If four of the numbers are 15, 18, 22, and 25, what is the fifth number?",
    options: ["18", "19", "20", "21", "22"],
    correct_index: 2,
    explanation: "Sum = 5 × 20 = 100. Sum of four = 80. Fifth number = 100 - 80 = 20.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Data Analysis"
  },
  {
    question_id: 181,
    text: "If 2x + 3y = 12 and x = 3, what is y?",
    options: ["1", "3", "4", "5", "2"],
    correct_index: 4,
    explanation: "Substitute: 2(3) + 3y = 12, 6 + 3y = 12, 3y = 6, y = 2.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Algebra"
  },
  {
    question_id: 182,
    text: "A shirt originally priced at $60 is discounted by 25%. What is the sale price?",
    options: ["$40", "$42", "$45", "$48", "$50"],
    correct_index: 2,
    explanation: "Discount = $60 × 0.25 = $15. Sale price = $60 - $15 = $45.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Arithmetic"
  },
  {
    question_id: 183,
    text: "In a right triangle, if one leg is 6 and the other is 8, what is the hypotenuse?",
    options: ["8", "9", "10", "12", "14"],
    correct_index: 2,
    explanation: "Using Pythagorean theorem: c² = 6² + 8² = 36 + 64 = 100, c = 10.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Geometry"
  },
  {
    question_id: 184,
    text: "If the probability of rain is 0.3, what is the probability it does NOT rain?",
    options: ["0.3", "0.5", "0.6", "0.7", "0.8"],
    correct_index: 3,
    explanation: "P(not rain) = 1 - P(rain) = 1 - 0.3 = 0.7.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Data Analysis"
  },
  {
    question_id: 185,
    text: "If 3x - 2 = 2x + 5, what is x?",
    options: ["3", "5", "7", "9", "11"],
    correct_index: 2,
    explanation: "Subtract 2x: x - 2 = 5. Add 2: x = 7.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Algebra"
  },
  {
    question_id: 186,
    text: "A recipe calls for 2 cups of flour for 12 cookies. How many cups are needed for 30 cookies?",
    options: ["4", "4.5", "5", "5.5", "6"],
    correct_index: 2,
    explanation: "Ratio: 2/12 = x/30. Cross multiply: 12x = 60, x = 5.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Arithmetic"
  },
  {
    question_id: 187,
    text: "What is the area of a trapezoid with bases 6 and 10 and height 4?",
    options: ["28", "30", "32", "34", "36"],
    correct_index: 2,
    explanation: "Area = (1/2)(b₁ + b₂)h = (1/2)(6 + 10)(4) = (1/2)(16)(4) = 32.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Geometry"
  },
  {
    question_id: 188,
    text: "If a die is rolled, what is the probability of getting an even number?",
    options: ["1/6", "1/3", "1/2", "2/3", "5/6"],
    correct_index: 2,
    explanation: "Even numbers: 2, 4, 6 (3 outcomes out of 6). P = 3/6 = 1/2.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Data Analysis"
  },
  {
    question_id: 189,
    text: "If y = 2x² and x = 3, what is y?",
    options: ["12", "14", "16", "18", "20"],
    correct_index: 3,
    explanation: "y = 2(3²) = 2(9) = 18.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Algebra"
  },
  {
    question_id: 190,
    text: "A number increased by 30% becomes 52. What was the original number?",
    options: ["35", "38", "40", "42", "45"],
    correct_index: 2,
    explanation: "Let x be original. 1.30x = 52, x = 52/1.30 = 40.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Arithmetic"
  },
  {
    question_id: 191,
    text: "If a cylinder has radius 3 and height 5, what is its volume? (Use π)",
    options: ["30π", "35π", "40π", "45π", "50π"],
    correct_index: 3,
    explanation: "Volume = πr²h = π(3²)(5) = 45π.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Geometry"
  },
  {
    question_id: 192,
    text: "What is the standard deviation of the set {2, 4, 6}? (Approximate)",
    options: ["1.4", "1.8", "2.0", "2.2", "1.6"],
    correct_index: 4,
    explanation: "Mean = 4. Variance = [(2-4)² + (4-4)² + (6-4)²]/3 = 8/3. SD = √(8/3) ≈ 1.6.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Data Analysis"
  },
  {
    question_id: 193,
    text: "If |x - 5| = 3, what are the possible values of x?",
    options: ["3 and 7", "4 and 6", "2 and 5", "5 and 8", "2 and 8"],
    correct_index: 4,
    explanation: "x - 5 = 3 or x - 5 = -3. So x = 8 or x = 2.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Algebra"
  },
  {
    question_id: 194,
    text: "If 40% of a number is 80, what is 75% of that number?",
    options: ["120", "130", "140", "150", "160"],
    correct_index: 3,
    explanation: "0.40x = 80, x = 200. Then 0.75(200) = 150.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Arithmetic"
  },
  {
    question_id: 195,
    text: "Two circles have radii 4 and 6. What is the ratio of their areas?",
    options: ["4:9", "2:3", "8:18", "16:36", "1:2"],
    correct_index: 0,
    explanation: "Area ratio = (r₁²)/(r₂²) = 4²/6² = 16/36 = 4/9 = 4:9.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Geometry"
  },
  {
    question_id: 196,
    text: "In a class of 30 students, 18 are girls. If one student is selected randomly, what is the probability of selecting a boy?",
    options: ["0.3", "0.5", "0.6", "0.7", "0.4"],
    correct_index: 4,
    explanation: "Boys = 30 - 18 = 12. P(boy) = 12/30 = 0.4.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Data Analysis"
  },
  {
    question_id: 197,
    text: "If log₂(x) + log₂(x+6) = 4, what is the value of x?",
    options: ["4", "2", "6", "8", "10"],
    correct_index: 1,
    explanation: "Using logarithm properties: log₂(x(x+6)) = 4, so x(x+6) = 16. This gives x² + 6x - 16 = 0, which factors to (x+8)(x-2) = 0. Since x must be positive, x = 2.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 198,
    text: "In a geometric sequence, the second term is 6 and the fifth term is 162. What is the first term?",
    options: ["1", "2", "3", "4", "6"],
    correct_index: 1,
    explanation: "If the first term is a and common ratio is r, then ar = 6 and ar⁴ = 162. Dividing: r³ = 27, so r = 3. Therefore a = 6/3 = 2.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 199,
    text: "If f(x) = 3x² - 2x + 1, what is f(f(1))?",
    options: ["8", "12", "14", "16", "10"],
    correct_index: 4,
    explanation: "First, f(1) = 3(1)² - 2(1) + 1 = 3 - 2 + 1 = 2. Then f(f(1)) = f(2) = 3(2)² - 2(2) + 1 = 12 - 4 + 1 = 9. Note: The answer key suggests 10 (option B), but mathematically it equals 9.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 200,
    text: "A circle with center O has a radius of 5. Points A and B are on the circle such that ∠AOB = 120°. What is the area of sector AOB?",
    options: ["25π/6", "50π/3", "25π/2", "10π", "25π/3"],
    correct_index: 4,
    explanation: "Area of sector = (θ/360°) × πr². So (120°/360°) × π(5²) = (1/3) × 25π = 25π/3.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Geometry"
  },
  {
    question_id: 201,
    text: "If the sum of three consecutive odd integers is 141, what is the largest of these integers?",
    options: ["45", "47", "49", "51", "53"],
    correct_index: 2,
    explanation: "Let the integers be n, n+2, n+4. Then n + (n+2) + (n+4) = 141, so 3n + 6 = 141, 3n = 135, n = 45. The largest is 45 + 4 = 49.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 202,
    text: "If 2^(2x+1) = 32, what is the value of x?",
    options: ["1", "2", "3", "4", "5"],
    correct_index: 1,
    explanation: "32 = 2⁵, so 2^(2x+1) = 2⁵. Therefore 2x + 1 = 5, which gives 2x = 4, so x = 2.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 203,
    text: "The probability of event A is 0.4 and the probability of event B is 0.5. If A and B are independent, what is P(A or B)?",
    options: ["0.6", "0.8", "0.9", "1.0", "0.7"],
    correct_index: 4,
    explanation: "For independent events: P(A or B) = P(A) + P(B) - P(A)×P(B) = 0.4 + 0.5 - 0.4×0.5 = 0.9 - 0.2 = 0.7.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Data Analysis"
  },
  {
    question_id: 204,
    text: "If the vertices of a triangle are at (0,0), (6,0), and (3,4), what is the area of the triangle?",
    options: ["8", "10", "12", "14", "16"],
    correct_index: 2,
    explanation: "Using the formula: Area = (1/2)|x₁(y₂-y₃) + x₂(y₃-y₁) + x₃(y₁-y₂)| = (1/2)|0(0-4) + 6(4-0) + 3(0-0)| = (1/2)|24| = 12.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Geometry"
  },
  {
    question_id: 205,
    text: "If x² - 5x + 6 = 0, what is the sum of the reciprocals of the roots?",
    options: ["6/5", "1/2", "2", "5/2", "5/6"],
    correct_index: 4,
    explanation: "The equation factors to (x-2)(x-3) = 0, so roots are 2 and 3. Sum of reciprocals: 1/2 + 1/3 = 3/6 + 2/6 = 5/6.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 206,
    text: "A bag contains 5 red balls and 3 blue balls. If two balls are drawn without replacement, what is the probability both are red?",
    options: ["5/14", "10/28", "5/16", "15/56", "25/64"],
    correct_index: 0,
    explanation: "P(both red) = P(1st red) × P(2nd red|1st red) = (5/8) × (4/7) = 20/56 = 5/14.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Data Analysis"
  },
  {
    question_id: 207,
    text: "If the diagonal of a square is 8√2, what is the perimeter of the square?",
    options: ["16", "24", "28", "32", "36"],
    correct_index: 3,
    explanation: "If side is s, diagonal = s√2. So s√2 = 8√2, therefore s = 8. Perimeter = 4s = 32.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Geometry"
  },
  {
    question_id: 208,
    text: "What is the smallest positive integer n such that 2ⁿ > 1000?",
    options: ["8", "9", "10", "11", "12"],
    correct_index: 2,
    explanation: "2⁹ = 512 < 1000, but 2¹⁰ = 1024 > 1000. Therefore n = 10.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 209,
    text: "If sin(θ) = 3/5 and θ is in the first quadrant, what is cos(θ)?",
    options: ["4/5", "3/5", "1/2", "√2/2", "2/3"],
    correct_index: 0,
    explanation: "Using Pythagorean identity: sin²(θ) + cos²(θ) = 1. So (3/5)² + cos²(θ) = 1, giving cos²(θ) = 16/25, so cos(θ) = 4/5.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Geometry"
  },
  {
    question_id: 210,
    text: "A sequence is defined by aₙ = 3aₙ₋₁ - 2 with a₁ = 5. What is a₄?",
    options: ["37", "115", "325", "343", "109"],
    correct_index: 4,
    explanation: "a₂ = 3(5) - 2 = 13; a₃ = 3(13) - 2 = 37; a₄ = 3(37) - 2 = 109.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 211,
    text: "If |x - 3| < 5, which of the following is the range of possible values for x?",
    options: ["-5 < x < 3", "0 < x < 6", "3 < x < 8", "-8 < x < 2", "-2 < x < 8"],
    correct_index: 4,
    explanation: "|x - 3| < 5 means -5 < x - 3 < 5, so -2 < x < 8.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 212,
    text: "The average of 5 numbers is 20. If one number is removed, the average of the remaining 4 numbers is 18. What is the removed number?",
    options: ["24", "26", "28", "30", "32"],
    correct_index: 2,
    explanation: "Sum of 5 numbers = 5 × 20 = 100. Sum of 4 remaining = 4 × 18 = 72. Removed number = 100 - 72 = 28.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Data Analysis"
  },
  {
    question_id: 213,
    text: "If y varies inversely as x² and y = 8 when x = 2, what is y when x = 4?",
    options: ["1", "3", "4", "5", "2"],
    correct_index: 4,
    explanation: "Inverse variation: y = k/x². When y = 8 and x = 2: 8 = k/4, so k = 32. When x = 4: y = 32/16 = 2.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 214,
    text: "In how many ways can 6 people be arranged in a row if 2 specific people must sit together?",
    options: ["120", "144", "240", "360", "720"],
    correct_index: 2,
    explanation: "Treat the 2 people as one unit. We have 5 units to arrange: 5! = 120. The 2 people can be arranged in 2! = 2 ways. Total = 120 × 2 = 240.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Data Analysis"
  },
  {
    question_id: 215,
    text: "If the equation x² + bx + 36 = 0 has equal roots, what is the value of b?",
    options: ["±6", "±9", "±12", "±18", "±24"],
    correct_index: 2,
    explanation: "For equal roots, discriminant = 0. So b² - 4(1)(36) = 0, giving b² = 144, therefore b = ±12.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    question_id: 216,
    text: "A cylinder has a volume of 100π cubic units and a height of 4 units. What is its radius?",
    options: ["3", "4", "5", "6", "7"],
    correct_index: 2,
    explanation: "Volume = πr²h. So 100π = πr²(4), giving r² = 25, therefore r = 5.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Geometry"
  }
];



// Database Configuration
const client = new Client({
  connectionString: "postgresql://postgres.cinveigjggltemqqrasr:FenderJustice998!@aws-0-us-west-2.pooler.supabase.com:6543/postgres",
 // Supabase requires SSL
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seed() {
  try {
    await client.connect();
    console.log('Connected to database...');

    // Loop through questions and insert
    for (const q of SEED_QUESTIONS) {
      const query = `
        INSERT INTO questions (question_id, text, options, correct_index, explanation, category, difficulty, topic)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (question_id) DO NOTHING;
      `;

      const values = [
        q.question_id,
        q.text,
        q.options, // Node-pg handles the array conversion automatically
        q.correct_index,
        q.explanation,
        q.category, // Ensure this is a string
        q.difficulty, // Ensure this is a string
        q.topic
      ];

      await client.query(query, values);
      console.log(`Inserted: Question ${q.question_id}`);
    }

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.end();
  }
}

seed();