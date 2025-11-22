import pg from 'pg';
const { Client } = pg;

// Mocking Enums if you paste the array exactly as is:
const Category = { VERBAL: 'VERBAL', QUANT: 'QUANT' };
const Difficulty = { EASY: 'EASY', MEDIUM: 'MEDIUM', HARD: 'HARD' }; 

const SEED_QUESTIONS = [
  // ==========================================
  // MANUALLY DEFINED QUESTIONS (FROM PROMPT)
  // ==========================================

  // --- VERBAL: EASY ---
  {
    id: "verbal-easy-manual-1",
    text: "Although the movie was panned by critics, it became a ______ hit at the box office, surprising even its producers.",
    options: ["predictable", "monumental", "modest", "marginal", "statistical"],
    correctIndex: 1,
    explanation: "The sentence implies a contrast ('Although') between the critics' negative reviews ('panned') and the movie's success. 'Monumental' fits best as it describes a huge success, contrasting with the negative reviews. 'Modest' and 'marginal' do not provide enough contrast.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Text Completion"
  },
  {
    id: "verbal-easy-manual-2",
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
    id: "verbal-medium-manual-1",
    text: "The politician's speech was distinct for its _____; he spoke for an hour without taking a definitive stance on any issue.",
    options: ["brevity", "eloquence", "equivocation", "candidness", "insight"],
    correctIndex: 2,
    explanation: "'Equivocation' means the use of ambiguous language to conceal the truth or avoid committing oneself. This matches the description of speaking for a long time without taking a stance. 'Brevity' contradicts 'spoke for an hour'.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Text Completion"
  },
  {
    id: "verbal-medium-manual-2",
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
    id: "verbal-hard-manual-1",
    text: "The novel's narrative structure is so ______ that it requires multiple readings to fully untangle the chronological sequence of events.",
    options: ["labyrinthine", "transparent", "rudimentary", "linear", "prosaic"],
    correctIndex: 0,
    explanation: "'Labyrinthine' means complicated and tortuous, like a labyrinth. This fits the description of a structure that requires multiple readings to untangle. 'Linear' and 'transparent' are opposites of what is described.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Text Completion"
  },
  {
    id: "verbal-hard-manual-2",
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
    id: "quant-easy-manual-1",
    text: "If 3x + 7 = 19, what is the value of 5x - 2?",
    options: ["18", "20", "22", "8", "12"],
    correctIndex: 0,
    explanation: "First, solve for x: 3x = 19 - 7 -> 3x = 12 -> x = 4. Then, substitute x into the second expression: 5(4) - 2 = 20 - 2 = 18.",
    category: Category.QUANT,
    difficulty: Difficulty.EASY,
    topic: "Algebra"
  },
  {
    id: "quant-easy-manual-2",
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
    id: "quant-medium-manual-1",
    text: "The average (arithmetic mean) of five distinct integers is 12. If the smallest integer is 4, what is the maximum possible value of the largest integer?",
    options: ["35", "38", "42", "44", "50"],
    correctIndex: 1,
    explanation: "Sum = 12 * 5 = 60. Minimize others: 4, 5, 6, 7. Sum = 22. Max largest = 60 - 22 = 38.",
    category: Category.QUANT,
    difficulty: Difficulty.MEDIUM,
    topic: "Data Analysis"
  },
  {
    id: "quant-medium-manual-2",
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
    id: "quant-hard-manual-1",
    text: "If x and y are integers such that x > y > 0 and x^2 - y^2 = 13, what is the value of x?",
    options: ["5", "6", "7", "8", "13"],
    correctIndex: 2,
    explanation: "Factor the equation: (x - y)(x + y) = 13. Since 13 is a prime number, its only positive integer factors are 1 and 13. Since x > y > 0, (x + y) must be the larger factor (13) and (x - y) must be the smaller factor (1). System of equations: x + y = 13, x - y = 1. Add them: 2x = 14 -> x = 7.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Algebra"
  },
  {
    id: "quant-hard-manual-2",
    text: "A certain machine produces 100 widgets in 5 hours. A second machine produces 100 widgets in 4 hours. If both machines work together at their constant rates, approximately how many hours will it take to produce 100 widgets?",
    options: ["2.0", "2.2", "2.5", "3.0", "4.5"],
    correctIndex: 1,
    explanation: "Rate of Machine 1 = 100/5 = 20 widgets/hr. Rate of Machine 2 = 100/4 = 25 widgets/hr. Combined rate = 20 + 25 = 45 widgets/hr. Time = Amount / Rate = 100 / 45 = 20/9 ≈ 2.22 hours.",
    category: Category.QUANT,
    difficulty: Difficulty.HARD,
    topic: "Arithmetic"
  },

  // ==========================================
  // CONVERTED VOCABULARY QUESTIONS (EASY)
  // ==========================================
  {
    id: "verbal-easy-concise",
    text: "Select the option that most nearly means \"concise\" in the context of scholarly writing or analytical reading.",
    options: ["brief", "lengthy", "confused", "circular"],
    correctIndex: 0,
    explanation: "\"concise\" means brief and to the point. The choice \"brief\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-ambivalent",
    text: "Select the option that most nearly means \"ambivalent\" in the context of scholarly writing or analytical reading.",
    options: ["uncertain", "eager", "fearful", "indifferent"],
    correctIndex: 0,
    explanation: "\"ambivalent\" means having mixed feelings. The choice \"uncertain\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-bolster",
    text: "Select the option that most nearly means \"bolster\" in the context of scholarly writing or analytical reading.",
    options: ["support", "dismiss", "reject", "delay"],
    correctIndex: 0,
    explanation: "\"bolster\" means support or strengthen. The choice \"support\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-candid",
    text: "Select the option that most nearly means \"candid\" in the context of scholarly writing or analytical reading.",
    options: ["honest", "cautious", "evasive", "secretive"],
    correctIndex: 0,
    explanation: "\"candid\" means frank and honest. The choice \"honest\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-lucid",
    text: "Select the option that most nearly means \"lucid\" in the context of scholarly writing or analytical reading.",
    options: ["clear", "obscure", "tedious", "boastful"],
    correctIndex: 0,
    explanation: "\"lucid\" means clear and easy to understand. The choice \"clear\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-meticulous",
    text: "Select the option that most nearly means \"meticulous\" in the context of scholarly writing or analytical reading.",
    options: ["careful", "hasty", "indifferent", "reckless"],
    correctIndex: 0,
    explanation: "\"meticulous\" means showing great attention to detail. The choice \"careful\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-prudent",
    text: "Select the option that most nearly means \"prudent\" in the context of scholarly writing or analytical reading.",
    options: ["careful", "rash", "boastful", "stubborn"],
    correctIndex: 0,
    explanation: "\"prudent\" means acting with care and thought for the future. The choice \"careful\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-plausible",
    text: "Select the option that most nearly means \"plausible\" in the context of scholarly writing or analytical reading.",
    options: ["credible", "impossible", "naive", "obvious"],
    correctIndex: 0,
    explanation: "\"plausible\" means seeming reasonable. The choice \"credible\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-scrutinize",
    text: "Select the option that most nearly means \"scrutinize\" in the context of scholarly writing or analytical reading.",
    options: ["inspect", "ignore", "celebrate", "condemn"],
    correctIndex: 0,
    explanation: "\"scrutinize\" means examine closely. The choice \"inspect\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-transform",
    text: "Select the option that most nearly means \"transform\" in the context of scholarly writing or analytical reading.",
    options: ["change", "stabilize", "measure", "imitate"],
    correctIndex: 0,
    explanation: "\"transform\" means change markedly. The choice \"change\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-vivid",
    text: "Select the option that most nearly means \"vivid\" in the context of scholarly writing or analytical reading.",
    options: ["graphic", "dull", "flat", "quiet"],
    correctIndex: 0,
    explanation: "\"vivid\" means producing powerful feelings or clear images. The choice \"graphic\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-robust",
    text: "Select the option that most nearly means \"robust\" in the context of scholarly writing or analytical reading.",
    options: ["strong", "fragile", "temporary", "decorative"],
    correctIndex: 0,
    explanation: "\"robust\" means strong and healthy. The choice \"strong\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-coherent",
    text: "Select the option that most nearly means \"coherent\" in the context of scholarly writing or analytical reading.",
    options: ["logical", "unrelated", "fragmented", "casual"],
    correctIndex: 0,
    explanation: "\"coherent\" means logical and consistent. The choice \"logical\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-novel",
    text: "Select the option that most nearly means \"novel\" in the context of scholarly writing or analytical reading.",
    options: ["original", "predictable", "ancient", "familiar"],
    correctIndex: 0,
    explanation: "\"novel\" means new or unusual. The choice \"original\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-elicit",
    text: "Select the option that most nearly means \"elicit\" in the context of scholarly writing or analytical reading.",
    options: ["evoke", "silence", "replace", "dismiss"],
    correctIndex: 0,
    explanation: "\"elicit\" means draw out a response. The choice \"evoke\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-adept",
    text: "Select the option that most nearly means \"adept\" in the context of scholarly writing or analytical reading.",
    options: ["skilled", "clumsy", "aloof", "timid"],
    correctIndex: 0,
    explanation: "\"adept\" means skilled or proficient. The choice \"skilled\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-banal",
    text: "Select the option that most nearly means \"banal\" in the context of scholarly writing or analytical reading.",
    options: ["trite", "vivid", "rare", "heroic"],
    correctIndex: 0,
    explanation: "\"banal\" means so lacking in originality as to be obvious. The choice \"trite\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-coincide",
    text: "Select the option that most nearly means \"coincide\" in the context of scholarly writing or analytical reading.",
    options: ["align", "interfere", "divide", "delay"],
    correctIndex: 0,
    explanation: "\"coincide\" means occur at the same time. The choice \"align\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-digress",
    text: "Select the option that most nearly means \"digress\" in the context of scholarly writing or analytical reading.",
    options: ["wander", "summarize", "conclude", "argue"],
    correctIndex: 0,
    explanation: "\"digress\" means leave the main subject. The choice \"wander\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-eclectic",
    text: "Select the option that most nearly means \"eclectic\" in the context of scholarly writing or analytical reading.",
    options: ["varied", "narrow", "isolated", "uniform"],
    correctIndex: 0,
    explanation: "\"eclectic\" means deriving ideas from various sources. The choice \"varied\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-facilitate",
    text: "Select the option that most nearly means \"facilitate\" in the context of scholarly writing or analytical reading.",
    options: ["ease", "hinder", "question", "delay"],
    correctIndex: 0,
    explanation: "\"facilitate\" means make easier. The choice \"ease\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-gratify",
    text: "Select the option that most nearly means \"gratify\" in the context of scholarly writing or analytical reading.",
    options: ["please", "upset", "confuse", "delay"],
    correctIndex: 0,
    explanation: "\"gratify\" means give pleasure to. The choice \"please\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-heritage",
    text: "Select the option that most nearly means \"heritage\" in the context of scholarly writing or analytical reading.",
    options: ["legacy", "expense", "tool", "pattern"],
    correctIndex: 0,
    explanation: "\"heritage\" means something inherited. The choice \"legacy\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-impartial",
    text: "Select the option that most nearly means \"impartial\" in the context of scholarly writing or analytical reading.",
    options: ["neutral", "biased", "hasty", "passive"],
    correctIndex: 0,
    explanation: "\"impartial\" means treating all rivals equally. The choice \"neutral\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-jubilant",
    text: "Select the option that most nearly means \"jubilant\" in the context of scholarly writing or analytical reading.",
    options: ["joyful", "anxious", "confused", "sour"],
    correctIndex: 0,
    explanation: "\"jubilant\" means feeling great joy. The choice \"joyful\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-kinetic",
    text: "Select the option that most nearly means \"kinetic\" in the context of scholarly writing or analytical reading.",
    options: ["moving", "static", "silent", "fragile"],
    correctIndex: 0,
    explanation: "\"kinetic\" means relating to motion. The choice \"moving\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-lament",
    text: "Select the option that most nearly means \"lament\" in the context of scholarly writing or analytical reading.",
    options: ["mourn", "celebrate", "ignore", "anticipate"],
    correctIndex: 0,
    explanation: "\"lament\" means mourn. The choice \"mourn\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-mediate",
    text: "Select the option that most nearly means \"mediate\" in the context of scholarly writing or analytical reading.",
    options: ["arbitrate", "compete", "delay", "depart"],
    correctIndex: 0,
    explanation: "\"mediate\" means intervene to resolve. The choice \"arbitrate\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-notorious",
    text: "Select the option that most nearly means \"notorious\" in the context of scholarly writing or analytical reading.",
    options: ["infamous", "obscure", "beloved", "unknown"],
    correctIndex: 0,
    explanation: "\"notorious\" means famous for something bad. The choice \"infamous\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-obscure",
    text: "Select the option that most nearly means \"obscure\" in the context of scholarly writing or analytical reading.",
    options: ["unclear", "celebrated", "obvious", "lucid"],
    correctIndex: 0,
    explanation: "\"obscure\" means not well known or unclear. The choice \"unclear\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-pragmatic",
    text: "Select the option that most nearly means \"pragmatic\" in the context of scholarly writing or analytical reading.",
    options: ["practical", "idealistic", "careless", "impractical"],
    correctIndex: 0,
    explanation: "\"pragmatic\" means practical. The choice \"practical\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-quaint",
    text: "Select the option that most nearly means \"quaint\" in the context of scholarly writing or analytical reading.",
    options: ["charming", "modern", "bleak", "hostile"],
    correctIndex: 0,
    explanation: "\"quaint\" means attractively unusual. The choice \"charming\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-revere",
    text: "Select the option that most nearly means \"revere\" in the context of scholarly writing or analytical reading.",
    options: ["honor", "ridicule", "imitate", "neglect"],
    correctIndex: 0,
    explanation: "\"revere\" means feel deep respect for. The choice \"honor\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-serene",
    text: "Select the option that most nearly means \"serene\" in the context of scholarly writing or analytical reading.",
    options: ["calm", "stormy", "noisy", "hasty"],
    correctIndex: 0,
    explanation: "\"serene\" means calm and peaceful. The choice \"calm\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-tenacious",
    text: "Select the option that most nearly means \"tenacious\" in the context of scholarly writing or analytical reading.",
    options: ["persistent", "wavering", "fragile", "casual"],
    correctIndex: 0,
    explanation: "\"tenacious\" means persistent. The choice \"persistent\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-underscore",
    text: "Select the option that most nearly means \"underscore\" in the context of scholarly writing or analytical reading.",
    options: ["emphasize", "ignore", "erase", "replace"],
    correctIndex: 0,
    explanation: "\"underscore\" means emphasize. The choice \"emphasize\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-venerate",
    text: "Select the option that most nearly means \"venerate\" in the context of scholarly writing or analytical reading.",
    options: ["admire", "dismiss", "attack", "forget"],
    correctIndex: 0,
    explanation: "\"venerate\" means regard with great respect. The choice \"admire\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-wary",
    text: "Select the option that most nearly means \"wary\" in the context of scholarly writing or analytical reading.",
    options: ["cautious", "reckless", "eager", "trusting"],
    correctIndex: 0,
    explanation: "\"wary\" means cautious. The choice \"cautious\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-yield",
    text: "Select the option that most nearly means \"yield\" in the context of scholarly writing or analytical reading.",
    options: ["produce", "resist", "hoard", "limit"],
    correctIndex: 0,
    explanation: "\"yield\" means produce or provide. The choice \"produce\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-zealous",
    text: "Select the option that most nearly means \"zealous\" in the context of scholarly writing or analytical reading.",
    options: ["enthusiastic", "apathetic", "tired", "neutral"],
    correctIndex: 0,
    explanation: "\"zealous\" means filled with zeal. The choice \"enthusiastic\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-allude",
    text: "Select the option that most nearly means \"allude\" in the context of scholarly writing or analytical reading.",
    options: ["hint", "state", "ignore", "delay"],
    correctIndex: 0,
    explanation: "\"allude\" means refer indirectly. The choice \"hint\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-brevity",
    text: "Select the option that most nearly means \"brevity\" in the context of scholarly writing or analytical reading.",
    options: ["shortness", "length", "complexity", "ambiguity"],
    correctIndex: 0,
    explanation: "\"brevity\" means concise and exact use of words. The choice \"shortness\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-catalyst",
    text: "Select the option that most nearly means \"catalyst\" in the context of scholarly writing or analytical reading.",
    options: ["spark", "barrier", "record", "summary"],
    correctIndex: 0,
    explanation: "\"catalyst\" means something that speeds change. The choice \"spark\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-deference",
    text: "Select the option that most nearly means \"deference\" in the context of scholarly writing or analytical reading.",
    options: ["respect", "defiance", "conflict", "delay"],
    correctIndex: 0,
    explanation: "\"deference\" means humble submission. The choice \"respect\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-elaborate",
    text: "Select the option that most nearly means \"elaborate\" in the context of scholarly writing or analytical reading.",
    options: ["detailed", "simple", "hasty", "shallow"],
    correctIndex: 0,
    explanation: "\"elaborate\" means involving many details. The choice \"detailed\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-foster",
    text: "Select the option that most nearly means \"foster\" in the context of scholarly writing or analytical reading.",
    options: ["encourage", "hinder", "delay", "confuse"],
    correctIndex: 0,
    explanation: "\"foster\" means encourage. The choice \"encourage\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-genuine",
    text: "Select the option that most nearly means \"genuine\" in the context of scholarly writing or analytical reading.",
    options: ["authentic", "false", "awkward", "quiet"],
    correctIndex: 0,
    explanation: "\"genuine\" means authentic. The choice \"authentic\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-harbinger",
    text: "Select the option that most nearly means \"harbinger\" in the context of scholarly writing or analytical reading.",
    options: ["omen", "result", "critic", "neighbor"],
    correctIndex: 0,
    explanation: "\"harbinger\" means a forerunner. The choice \"omen\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-illustrious",
    text: "Select the option that most nearly means \"illustrious\" in the context of scholarly writing or analytical reading.",
    options: ["distinguished", "unknown", "novice", "ordinary"],
    correctIndex: 0,
    explanation: "\"illustrious\" means well known and respected. The choice \"distinguished\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-judicious",
    text: "Select the option that most nearly means \"judicious\" in the context of scholarly writing or analytical reading.",
    options: ["wise", "careless", "strict", "noisy"],
    correctIndex: 0,
    explanation: "\"judicious\" means having good judgment. The choice \"wise\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },
  {
    id: "verbal-easy-lucid-2",
    text: "Select the option that most nearly means \"lucid\" in the context of scholarly writing or analytical reading.",
    options: ["clear", "opaque", "messy", "hidden"],
    correctIndex: 0,
    explanation: "\"lucid\" means clear. The choice \"clear\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.EASY,
    topic: "Vocabulary"
  },

  // ==========================================
  // CONVERTED VOCABULARY QUESTIONS (MEDIUM)
  // ==========================================
  {
    id: "verbal-medium-anomaly",
    text: "Select the option that most nearly means \"anomaly\" in the context of scholarly writing or analytical reading.",
    options: ["irregularity", "pattern", "routine", "symbol"],
    correctIndex: 0,
    explanation: "\"anomaly\" means something that deviates from what is standard. The choice \"irregularity\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-capricious",
    text: "Select the option that most nearly means \"capricious\" in the context of scholarly writing or analytical reading.",
    options: ["unpredictable", "steadfast", "obvious", "ordinary"],
    correctIndex: 0,
    explanation: "\"capricious\" means given to sudden changes. The choice \"unpredictable\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-deleterious",
    text: "Select the option that most nearly means \"deleterious\" in the context of scholarly writing or analytical reading.",
    options: ["harmful", "beneficial", "minor", "neutral"],
    correctIndex: 0,
    explanation: "\"deleterious\" means causing harm. The choice \"harmful\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-enigma",
    text: "Select the option that most nearly means \"enigma\" in the context of scholarly writing or analytical reading.",
    options: ["mystery", "certainty", "answer", "outline"],
    correctIndex: 0,
    explanation: "\"enigma\" means a puzzle. The choice \"mystery\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-fortuitous",
    text: "Select the option that most nearly means \"fortuitous\" in the context of scholarly writing or analytical reading.",
    options: ["accidental", "planned", "delayed", "obvious"],
    correctIndex: 0,
    explanation: "\"fortuitous\" means happening by chance. The choice \"accidental\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-gregarious",
    text: "Select the option that most nearly means \"gregarious\" in the context of scholarly writing or analytical reading.",
    options: ["sociable", "shy", "hostile", "private"],
    correctIndex: 0,
    explanation: "\"gregarious\" means sociable. The choice \"sociable\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-hackneyed",
    text: "Select the option that most nearly means \"hackneyed\" in the context of scholarly writing or analytical reading.",
    options: ["trite", "fresh", "ambitious", "precise"],
    correctIndex: 0,
    explanation: "\"hackneyed\" means lacking significance through overuse. The choice \"trite\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-incongruous",
    text: "Select the option that most nearly means \"incongruous\" in the context of scholarly writing or analytical reading.",
    options: ["out of place", "fitting", "predicted", "central"],
    correctIndex: 0,
    explanation: "\"incongruous\" means not in harmony. The choice \"out of place\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-laconic",
    text: "Select the option that most nearly means \"laconic\" in the context of scholarly writing or analytical reading.",
    options: ["brief", "verbose", "puzzled", "ornate"],
    correctIndex: 0,
    explanation: "\"laconic\" means using few words. The choice \"brief\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-magnanimous",
    text: "Select the option that most nearly means \"magnanimous\" in the context of scholarly writing or analytical reading.",
    options: ["generous", "stingy", "skeptical", "formal"],
    correctIndex: 0,
    explanation: "\"magnanimous\" means very generous. The choice \"generous\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-nebulous",
    text: "Select the option that most nearly means \"nebulous\" in the context of scholarly writing or analytical reading.",
    options: ["unclear", "precise", "bright", "obvious"],
    correctIndex: 0,
    explanation: "\"nebulous\" means vague. The choice \"unclear\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-obstinate",
    text: "Select the option that most nearly means \"obstinate\" in the context of scholarly writing or analytical reading.",
    options: ["stubborn", "agreeable", "flexible", "yielding"],
    correctIndex: 0,
    explanation: "\"obstinate\" means stubborn. The choice \"stubborn\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-panacea",
    text: "Select the option that most nearly means \"panacea\" in the context of scholarly writing or analytical reading.",
    options: ["cure-all", "symptom", "obstacle", "detail"],
    correctIndex: 0,
    explanation: "\"panacea\" means solution for all problems. The choice \"cure-all\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-quandary",
    text: "Select the option that most nearly means \"quandary\" in the context of scholarly writing or analytical reading.",
    options: ["dilemma", "victory", "celebration", "habit"],
    correctIndex: 0,
    explanation: "\"quandary\" means state of uncertainty. The choice \"dilemma\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-recalcitrant",
    text: "Select the option that most nearly means \"recalcitrant\" in the context of scholarly writing or analytical reading.",
    options: ["defiant", "obedient", "curious", "patient"],
    correctIndex: 0,
    explanation: "\"recalcitrant\" means resisting authority. The choice \"defiant\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-sagacious",
    text: "Select the option that most nearly means \"sagacious\" in the context of scholarly writing or analytical reading.",
    options: ["wise", "foolish", "quiet", "angry"],
    correctIndex: 0,
    explanation: "\"sagacious\" means wise. The choice \"wise\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-tacit",
    text: "Select the option that most nearly means \"tacit\" in the context of scholarly writing or analytical reading.",
    options: ["unspoken", "loud", "written", "dramatic"],
    correctIndex: 0,
    explanation: "\"tacit\" means understood without being said. The choice \"unspoken\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-ubiquitous",
    text: "Select the option that most nearly means \"ubiquitous\" in the context of scholarly writing or analytical reading.",
    options: ["widespread", "rare", "hidden", "solitary"],
    correctIndex: 0,
    explanation: "\"ubiquitous\" means present everywhere. The choice \"widespread\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-vacillate",
    text: "Select the option that most nearly means \"vacillate\" in the context of scholarly writing or analytical reading.",
    options: ["waver", "decide", "accelerate", "justify"],
    correctIndex: 0,
    explanation: "\"vacillate\" means waver. The choice \"waver\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-winnow",
    text: "Select the option that most nearly means \"winnow\" in the context of scholarly writing or analytical reading.",
    options: ["filter", "gather", "ignore", "expand"],
    correctIndex: 0,
    explanation: "\"winnow\" means separate useful from not. The choice \"filter\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-yoke",
    text: "Select the option that most nearly means \"yoke\" in the context of scholarly writing or analytical reading.",
    options: ["link", "separate", "polish", "observe"],
    correctIndex: 0,
    explanation: "\"yoke\" means join together. The choice \"link\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-zenith",
    text: "Select the option that most nearly means \"zenith\" in the context of scholarly writing or analytical reading.",
    options: ["peak", "base", "decline", "shadow"],
    correctIndex: 0,
    explanation: "\"zenith\" means highest point. The choice \"peak\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-apathy",
    text: "Select the option that most nearly means \"apathy\" in the context of scholarly writing or analytical reading.",
    options: ["indifference", "passion", "pride", "hope"],
    correctIndex: 0,
    explanation: "\"apathy\" means lack of interest. The choice \"indifference\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-bombastic",
    text: "Select the option that most nearly means \"bombastic\" in the context of scholarly writing or analytical reading.",
    options: ["pretentious", "modest", "quiet", "gentle"],
    correctIndex: 0,
    explanation: "\"bombastic\" means pompous. The choice \"pretentious\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-censure",
    text: "Select the option that most nearly means \"censure\" in the context of scholarly writing or analytical reading.",
    options: ["criticize", "praise", "ignore", "clarify"],
    correctIndex: 0,
    explanation: "\"censure\" means express severe disapproval. The choice \"criticize\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-delineate",
    text: "Select the option that most nearly means \"delineate\" in the context of scholarly writing or analytical reading.",
    options: ["outline", "blur", "ignore", "dismiss"],
    correctIndex: 0,
    explanation: "\"delineate\" means describe precisely. The choice \"outline\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-efficacy",
    text: "Select the option that most nearly means \"efficacy\" in the context of scholarly writing or analytical reading.",
    options: ["effectiveness", "delay", "simplicity", "appearance"],
    correctIndex: 0,
    explanation: "\"efficacy\" means ability to produce result. The choice \"effectiveness\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-fastidious",
    text: "Select the option that most nearly means \"fastidious\" in the context of scholarly writing or analytical reading.",
    options: ["meticulous", "casual", "carefree", "hurried"],
    correctIndex: 0,
    explanation: "\"fastidious\" means very attentive to detail. The choice \"meticulous\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-guile",
    text: "Select the option that most nearly means \"guile\" in the context of scholarly writing or analytical reading.",
    options: ["cunning", "honesty", "confusion", "gravity"],
    correctIndex: 0,
    explanation: "\"guile\" means sly intelligence. The choice \"cunning\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-hedonism",
    text: "Select the option that most nearly means \"hedonism\" in the context of scholarly writing or analytical reading.",
    options: ["self-indulgence", "austerity", "labor", "routine"],
    correctIndex: 0,
    explanation: "\"hedonism\" means pursuit of pleasure. The choice \"self-indulgence\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-impetuous",
    text: "Select the option that most nearly means \"impetuous\" in the context of scholarly writing or analytical reading.",
    options: ["rash", "cautious", "patient", "careful"],
    correctIndex: 0,
    explanation: "\"impetuous\" means acting quickly without thought. The choice \"rash\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-jettison",
    text: "Select the option that most nearly means \"jettison\" in the context of scholarly writing or analytical reading.",
    options: ["discard", "hoard", "study", "repeat"],
    correctIndex: 0,
    explanation: "\"jettison\" means to throw off. The choice \"discard\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-kinship",
    text: "Select the option that most nearly means \"kinship\" in the context of scholarly writing or analytical reading.",
    options: ["affinity", "distance", "hostility", "doubt"],
    correctIndex: 0,
    explanation: "\"kinship\" means relatedness. The choice \"affinity\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-languid",
    text: "Select the option that most nearly means \"languid\" in the context of scholarly writing or analytical reading.",
    options: ["sluggish", "energetic", "keen", "alert"],
    correctIndex: 0,
    explanation: "\"languid\" means displaying disinclination for effort. The choice \"sluggish\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-munificent",
    text: "Select the option that most nearly means \"munificent\" in the context of scholarly writing or analytical reading.",
    options: ["lavish", "stingy", "nervous", "uncertain"],
    correctIndex: 0,
    explanation: "\"munificent\" means more generous than necessary. The choice \"lavish\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-neophyte",
    text: "Select the option that most nearly means \"neophyte\" in the context of scholarly writing or analytical reading.",
    options: ["novice", "expert", "critic", "sponsor"],
    correctIndex: 0,
    explanation: "\"neophyte\" means a beginner. The choice \"novice\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-obviate",
    text: "Select the option that most nearly means \"obviate\" in the context of scholarly writing or analytical reading.",
    options: ["prevent", "invite", "delay", "allow"],
    correctIndex: 0,
    explanation: "\"obviate\" means remove a need. The choice \"prevent\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-paragon",
    text: "Select the option that most nearly means \"paragon\" in the context of scholarly writing or analytical reading.",
    options: ["ideal", "contrast", "warning", "approximation"],
    correctIndex: 0,
    explanation: "\"paragon\" means model of excellence. The choice \"ideal\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-quell",
    text: "Select the option that most nearly means \"quell\" in the context of scholarly writing or analytical reading.",
    options: ["suppress", "encourage", "consider", "delay"],
    correctIndex: 0,
    explanation: "\"quell\" means put an end to. The choice \"suppress\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-rescind",
    text: "Select the option that most nearly means \"rescind\" in the context of scholarly writing or analytical reading.",
    options: ["revoke", "approve", "ignore", "revise"],
    correctIndex: 0,
    explanation: "\"rescind\" means revoke. The choice \"revoke\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-sanction",
    text: "Select the option that most nearly means \"sanction\" in the context of scholarly writing or analytical reading.",
    options: ["approval", "penalty", "question", "delay"],
    correctIndex: 0,
    explanation: "\"sanction\" means official permission. The choice \"approval\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-trenchant",
    text: "Select the option that most nearly means \"trenchant\" in the context of scholarly writing or analytical reading.",
    options: ["sharp", "vague", "gentle", "slow"],
    correctIndex: 0,
    explanation: "\"trenchant\" means vigorous or incisive. The choice \"sharp\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-unwitting",
    text: "Select the option that most nearly means \"unwitting\" in the context of scholarly writing or analytical reading.",
    options: ["unintentional", "planned", "agreed", "cited"],
    correctIndex: 0,
    explanation: "\"unwitting\" means not aware. The choice \"unintentional\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-veracity",
    text: "Select the option that most nearly means \"veracity\" in the context of scholarly writing or analytical reading.",
    options: ["truthfulness", "doubt", "illusion", "metaphor"],
    correctIndex: 0,
    explanation: "\"veracity\" means conformity to facts. The choice \"truthfulness\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-wane",
    text: "Select the option that most nearly means \"wane\" in the context of scholarly writing or analytical reading.",
    options: ["diminish", "grow", "burst", "linger"],
    correctIndex: 0,
    explanation: "\"wane\" means decrease in power. The choice \"diminish\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-xenial",
    text: "Select the option that most nearly means \"xenial\" in the context of scholarly writing or analytical reading.",
    options: ["hospitable", "rude", "silent", "aloof"],
    correctIndex: 0,
    explanation: "\"xenial\" means hospitable. The choice \"hospitable\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-yearn",
    text: "Select the option that most nearly means \"yearn\" in the context of scholarly writing or analytical reading.",
    options: ["long", "refuse", "ignore", "compete"],
    correctIndex: 0,
    explanation: "\"yearn\" means long for. The choice \"long\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },
  {
    id: "verbal-medium-zealot",
    text: "Select the option that most nearly means \"zealot\" in the context of scholarly writing or analytical reading.",
    options: ["fanatic", "moderate", "critic", "novice"],
    correctIndex: 0,
    explanation: "\"zealot\" means fanatical supporter. The choice \"fanatic\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.MEDIUM,
    topic: "Vocabulary"
  },

  // ==========================================
  // CONVERTED VOCABULARY QUESTIONS (HARD)
  // ==========================================
  {
    id: "verbal-hard-abstruse",
    text: "Select the option that most nearly means \"abstruse\" in the context of scholarly writing or analytical reading.",
    options: ["esoteric", "obvious", "trivial", "playful"],
    correctIndex: 0,
    explanation: "\"abstruse\" means difficult to understand. The choice \"esoteric\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-apocryphal",
    text: "Select the option that most nearly means \"apocryphal\" in the context of scholarly writing or analytical reading.",
    options: ["questionable", "verified", "ancient", "transparent"],
    correctIndex: 0,
    explanation: "\"apocryphal\" means of doubtful authenticity. The choice \"questionable\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-calumny",
    text: "Select the option that most nearly means \"calumny\" in the context of scholarly writing or analytical reading.",
    options: ["slander", "praise", "summary", "gift"],
    correctIndex: 0,
    explanation: "\"calumny\" means slander. The choice \"slander\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-desultory",
    text: "Select the option that most nearly means \"desultory\" in the context of scholarly writing or analytical reading.",
    options: ["rambling", "orderly", "elegant", "urgent"],
    correctIndex: 0,
    explanation: "\"desultory\" means lacking plan. The choice \"rambling\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-excoriate",
    text: "Select the option that most nearly means \"excoriate\" in the context of scholarly writing or analytical reading.",
    options: ["denounce", "console", "commend", "revise"],
    correctIndex: 0,
    explanation: "\"excoriate\" means criticize severely. The choice \"denounce\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-intransigent",
    text: "Select the option that most nearly means \"intransigent\" in the context of scholarly writing or analytical reading.",
    options: ["unyielding", "flexible", "diplomatic", "curious"],
    correctIndex: 0,
    explanation: "\"intransigent\" means unwilling to change views. The choice \"unyielding\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-limpid",
    text: "Select the option that most nearly means \"limpid\" in the context of scholarly writing or analytical reading.",
    options: ["transparent", "murky", "dense", "crooked"],
    correctIndex: 0,
    explanation: "\"limpid\" means clear and simple. The choice \"transparent\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-mendacious",
    text: "Select the option that most nearly means \"mendacious\" in the context of scholarly writing or analytical reading.",
    options: ["dishonest", "truthful", "careful", "tired"],
    correctIndex: 0,
    explanation: "\"mendacious\" means lying. The choice \"dishonest\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-obdurate",
    text: "Select the option that most nearly means \"obdurate\" in the context of scholarly writing or analytical reading.",
    options: ["unyielding", "conciliatory", "diplomatic", "eager"],
    correctIndex: 0,
    explanation: "\"obdurate\" means stubbornly refusing. The choice \"unyielding\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-perfidy",
    text: "Select the option that most nearly means \"perfidy\" in the context of scholarly writing or analytical reading.",
    options: ["treachery", "loyalty", "piety", "brevity"],
    correctIndex: 0,
    explanation: "\"perfidy\" means treachery. The choice \"treachery\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-recondite",
    text: "Select the option that most nearly means \"recondite\" in the context of scholarly writing or analytical reading.",
    options: ["obscure", "familiar", "celebrated", "open"],
    correctIndex: 0,
    explanation: "\"recondite\" means little known. The choice \"obscure\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-sagacity",
    text: "Select the option that most nearly means \"sagacity\" in the context of scholarly writing or analytical reading.",
    options: ["wisdom", "apathy", "anger", "doubt"],
    correctIndex: 0,
    explanation: "\"sagacity\" means keen mental discernment. The choice \"wisdom\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-trenchant",
    text: "Select the option that most nearly means \"trenchant\" in the context of scholarly writing or analytical reading.",
    options: ["incisive", "blunt", "circuitous", "casual"],
    correctIndex: 0,
    explanation: "\"trenchant\" means forceful and clear-cut. The choice \"incisive\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-pellucid",
    text: "Select the option that most nearly means \"pellucid\" in the context of scholarly writing or analytical reading.",
    options: ["clear", "opaque", "labored", "arcane"],
    correctIndex: 0,
    explanation: "\"pellucid\" means easily understood. The choice \"clear\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-sententious",
    text: "Select the option that most nearly means \"sententious\" in the context of scholarly writing or analytical reading.",
    options: ["pompous", "generous", "flexible", "comic"],
    correctIndex: 0,
    explanation: "\"sententious\" means self-righteous moralizing. The choice \"pompous\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-truculent",
    text: "Select the option that most nearly means \"truculent\" in the context of scholarly writing or analytical reading.",
    options: ["combative", "agreeable", "uncertain", "formal"],
    correctIndex: 0,
    explanation: "\"truculent\" means eager to argue. The choice \"combative\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-vicissitude",
    text: "Select the option that most nearly means \"vicissitude\" in the context of scholarly writing or analytical reading.",
    options: ["fluctuation", "certainty", "origin", "unity"],
    correctIndex: 0,
    explanation: "\"vicissitude\" means a change of circumstances. The choice \"fluctuation\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-abstemious",
    text: "Select the option that most nearly means \"abstemious\" in the context of scholarly writing or analytical reading.",
    options: ["restrained", "lavish", "hungry", "noisy"],
    correctIndex: 0,
    explanation: "\"abstemious\" means not self-indulgent. The choice \"restrained\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-contumacious",
    text: "Select the option that most nearly means \"contumacious\" in the context of scholarly writing or analytical reading.",
    options: ["rebellious", "obedient", "tired", "measured"],
    correctIndex: 0,
    explanation: "\"contumacious\" means rebellious. The choice \"rebellious\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-dilatory",
    text: "Select the option that most nearly means \"dilatory\" in the context of scholarly writing or analytical reading.",
    options: ["tardy", "swift", "keen", "ready"],
    correctIndex: 0,
    explanation: "\"dilatory\" means slow to act. The choice \"tardy\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-effrontery",
    text: "Select the option that most nearly means \"effrontery\" in the context of scholarly writing or analytical reading.",
    options: ["audacity", "humility", "pity", "regret"],
    correctIndex: 0,
    explanation: "\"effrontery\" means insolent behavior. The choice \"audacity\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-garrulous",
    text: "Select the option that most nearly means \"garrulous\" in the context of scholarly writing or analytical reading.",
    options: ["chatty", "quiet", "stern", "brief"],
    correctIndex: 0,
    explanation: "\"garrulous\" means excessively talkative. The choice \"chatty\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-impecunious",
    text: "Select the option that most nearly means \"impecunious\" in the context of scholarly writing or analytical reading.",
    options: ["poor", "wealthy", "generous", "careless"],
    correctIndex: 0,
    explanation: "\"impecunious\" means having little money. The choice \"poor\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-jejune",
    text: "Select the option that most nearly means \"jejune\" in the context of scholarly writing or analytical reading.",
    options: ["immature", "erudite", "seasoned", "daring"],
    correctIndex: 0,
    explanation: "\"jejune\" means naive or simplistic. The choice \"immature\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-lachrymose",
    text: "Select the option that most nearly means \"lachrymose\" in the context of scholarly writing or analytical reading.",
    options: ["tearful", "cheerful", "energetic", "boastful"],
    correctIndex: 0,
    explanation: "\"lachrymose\" means tearful. The choice \"tearful\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-mollify",
    text: "Select the option that most nearly means \"mollify\" in the context of scholarly writing or analytical reading.",
    options: ["pacify", "aggravate", "ignore", "divide"],
    correctIndex: 0,
    explanation: "\"mollify\" means soothe. The choice \"pacify\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-nadir",
    text: "Select the option that most nearly means \"nadir\" in the context of scholarly writing or analytical reading.",
    options: ["bottom", "apex", "plateau", "margin"],
    correctIndex: 0,
    explanation: "\"nadir\" means lowest point. The choice \"bottom\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-obstreperous",
    text: "Select the option that most nearly means \"obstreperous\" in the context of scholarly writing or analytical reading.",
    options: ["unruly", "calm", "formal", "restrained"],
    correctIndex: 0,
    explanation: "\"obstreperous\" means noisy and difficult to control. The choice \"unruly\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-parsimonious",
    text: "Select the option that most nearly means \"parsimonious\" in the context of scholarly writing or analytical reading.",
    options: ["stingy", "generous", "honest", "wide"],
    correctIndex: 0,
    explanation: "\"parsimonious\" means unwilling to spend. The choice \"stingy\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-quixotic",
    text: "Select the option that most nearly means \"quixotic\" in the context of scholarly writing or analytical reading.",
    options: ["impractical", "methodical", "efficient", "reserved"],
    correctIndex: 0,
    explanation: "\"quixotic\" means exceedingly idealistic. The choice \"impractical\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-refractory",
    text: "Select the option that most nearly means \"refractory\" in the context of scholarly writing or analytical reading.",
    options: ["unruly", "obedient", "light", "precise"],
    correctIndex: 0,
    explanation: "\"refractory\" means stubborn or unmanageable. The choice \"unruly\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-soporific",
    text: "Select the option that most nearly means \"soporific\" in the context of scholarly writing or analytical reading.",
    options: ["sleep-inducing", "exciting", "alarming", "bleak"],
    correctIndex: 0,
    explanation: "\"soporific\" means tending to induce sleep. The choice \"sleep-inducing\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-turgid",
    text: "Select the option that most nearly means \"turgid\" in the context of scholarly writing or analytical reading.",
    options: ["overblown", "plain", "tiny", "weak"],
    correctIndex: 0,
    explanation: "\"turgid\" means tediously pompous. The choice \"overblown\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-umbrage",
    text: "Select the option that most nearly means \"umbrage\" in the context of scholarly writing or analytical reading.",
    options: ["offense", "pardon", "ease", "delight"],
    correctIndex: 0,
    explanation: "\"umbrage\" means offense. The choice \"offense\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-vacillating",
    text: "Select the option that most nearly means \"vacillating\" in the context of scholarly writing or analytical reading.",
    options: ["wavering", "certain", "stable", "quiet"],
    correctIndex: 0,
    explanation: "\"vacillating\" means alternating between opinions. The choice \"wavering\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-wizened",
    text: "Select the option that most nearly means \"wizened\" in the context of scholarly writing or analytical reading.",
    options: ["shriveled", "youthful", "gleaming", "buoyant"],
    correctIndex: 0,
    explanation: "\"wizened\" means wrinkled with age. The choice \"shriveled\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-abrogate",
    text: "Select the option that most nearly means \"abrogate\" in the context of scholarly writing or analytical reading.",
    options: ["revoke", "approve", "draft", "endorse"],
    correctIndex: 0,
    explanation: "\"abrogate\" means repeal. The choice \"revoke\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-cogent",
    text: "Select the option that most nearly means \"cogent\" in the context of scholarly writing or analytical reading.",
    options: ["persuasive", "weak", "wandering", "dubious"],
    correctIndex: 0,
    explanation: "\"cogent\" means clear and convincing. The choice \"persuasive\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-demur",
    text: "Select the option that most nearly means \"demur\" in the context of scholarly writing or analytical reading.",
    options: ["object", "agree", "delay", "draft"],
    correctIndex: 0,
    explanation: "\"demur\" means raise doubts. The choice \"object\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-equanimity",
    text: "Select the option that most nearly means \"equanimity\" in the context of scholarly writing or analytical reading.",
    options: ["composure", "panic", "gloom", "speed"],
    correctIndex: 0,
    explanation: "\"equanimity\" means calmness. The choice \"composure\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-fastidious",
    text: "Select the option that most nearly means \"fastidious\" in the context of scholarly writing or analytical reading.",
    options: ["meticulous", "careless", "mild", "rash"],
    correctIndex: 0,
    explanation: "\"fastidious\" means very attentive to accuracy. The choice \"meticulous\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-grandiloquent",
    text: "Select the option that most nearly means \"grandiloquent\" in the context of scholarly writing or analytical reading.",
    options: ["pretentious", "plain", "concise", "dull"],
    correctIndex: 0,
    explanation: "\"grandiloquent\" means pompous in language. The choice \"pretentious\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-implacable",
    text: "Select the option that most nearly means \"implacable\" in the context of scholarly writing or analytical reading.",
    options: ["unyielding", "gentle", "forgetful", "pliant"],
    correctIndex: 0,
    explanation: "\"implacable\" means unable to be appeased. The choice \"unyielding\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-luminous",
    text: "Select the option that most nearly means \"luminous\" in the context of scholarly writing or analytical reading.",
    options: ["radiant", "dim", "opaque", "hollow"],
    correctIndex: 0,
    explanation: "\"luminous\" means full of light. The choice \"radiant\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-moribund",
    text: "Select the option that most nearly means \"moribund\" in the context of scholarly writing or analytical reading.",
    options: ["dying", "growing", "energetic", "nascent"],
    correctIndex: 0,
    explanation: "\"moribund\" means at the point of death. The choice \"dying\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-nebulous",
    text: "Select the option that most nearly means \"nebulous\" in the context of scholarly writing or analytical reading.",
    options: ["vague", "definite", "bright", "linear"],
    correctIndex: 0,
    explanation: "\"nebulous\" means unclear. The choice \"vague\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-obsequious",
    text: "Select the option that most nearly means \"obsequious\" in the context of scholarly writing or analytical reading.",
    options: ["subservient", "assertive", "careless", "honest"],
    correctIndex: 0,
    explanation: "\"obsequious\" means obedient to excess. The choice \"subservient\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-parsimony-2",
    text: "Select the option that most nearly means \"parsimony\" in the context of scholarly writing or analytical reading.",
    options: ["stinginess", "liberality", "precision", "boast"],
    correctIndex: 0,
    explanation: "\"parsimony\" means extreme unwillingness to spend. The choice \"stinginess\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-reprobate",
    text: "Select the option that most nearly means \"reprobate\" in the context of scholarly writing or analytical reading.",
    options: ["rogue", "saint", "novice", "ally"],
    correctIndex: 0,
    explanation: "\"reprobate\" means unprincipled person. The choice \"rogue\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-sedulous",
    text: "Select the option that most nearly means \"sedulous\" in the context of scholarly writing or analytical reading.",
    options: ["diligent", "lazy", "reluctant", "carefree"],
    correctIndex: 0,
    explanation: "\"sedulous\" means showing dedication. The choice \"diligent\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-torpor",
    text: "Select the option that most nearly means \"torpor\" in the context of scholarly writing or analytical reading.",
    options: ["lethargy", "vigor", "humor", "clarity"],
    correctIndex: 0,
    explanation: "\"torpor\" means state of inactivity. The choice \"lethargy\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
  },
  {
    id: "verbal-hard-vex",
    text: "Select the option that most nearly means \"vex\" in the context of scholarly writing or analytical reading.",
    options: ["annoy", "delight", "calm", "praise"],
    correctIndex: 0,
    explanation: "\"vex\" means annoy. The choice \"annoy\" aligns with that meaning, while the other options point in different directions.",
    category: Category.VERBAL,
    difficulty: Difficulty.HARD,
    topic: "Vocabulary"
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
        INSERT INTO questions (id, text, options, correct_index, explanation, category, difficulty, topic)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO NOTHING;
      `;

      const values = [
        q.id,
        q.text,
        q.options, // Node-pg handles the array conversion automatically
        q.correctIndex,
        q.explanation,
        q.category, // Ensure this is a string
        q.difficulty, // Ensure this is a string
        q.topic
      ];

      await client.query(query, values);
      console.log(`Inserted: ${q.id}`);
    }

    console.log('Seeding complete!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.end();
  }
}

seed();