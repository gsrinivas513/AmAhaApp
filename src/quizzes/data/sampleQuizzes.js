/**
 * Sample Quizzes - Demonstrating All Quiz Types
 * Using the UNIVERSAL TEMPLATE (single schema, only quizType changes)
 */

export const SAMPLE_QUIZZES = {
  // ============================================
  // QUIZ 1: MCQ Quiz
  // ============================================
  mcq_basic_math: {
    id: "mcq_001",
    title: "Basic Mathematics",
    description: "Test your fundamental math skills",
    category: "Mathematics",
    level: "Beginner",
    quizType: "MCQ",
    metadata: {
      timeLimit: 1800,
      totalPoints: 100,
      totalQuestions: 5,
      passingScore: 60,
      shuffle: true,
      attempts: 3,
      partialScoring: false,
      showExplanation: true,
      difficulty: "easy",
    },
    questions: [
      {
        id: "q_001",
        sequence: 1,
        points: 20,
        quizType: "MCQ",
        contentType: "text",
        question: {
          text: "What is 15 + 27?",
          media: [],
        },
        answer: {
          correctOption: "C",
          options: [
            { key: "A", text: "38" },
            { key: "B", text: "40" },
            { key: "C", text: "42" },
            { key: "D", text: "45" },
          ],
          evaluationType: "exact",
        },
        hint: "Add the tens place and ones place separately",
        explanation:
          "15 + 27 = 15 + 20 + 7 = 35 + 7 = 42. Break it down into smaller numbers.",
      },
      {
        id: "q_002",
        sequence: 2,
        points: 20,
        quizType: "MCQ",
        contentType: "text",
        question: {
          text: "What is 8 × 6?",
          media: [],
        },
        answer: {
          correctOption: "A",
          options: [
            { key: "A", text: "48" },
            { key: "B", text: "46" },
            { key: "C", text: "50" },
            { key: "D", text: "52" },
          ],
          evaluationType: "exact",
        },
        hint: "8 sixes...",
        explanation: "8 × 6 = 48. You can verify: 6 + 6 + 6 + 6 + 6 + 6 + 6 + 6 = 48",
      },
    ],
  },

  // ============================================
  // QUIZ 2: Multi-Select Quiz
  // ============================================
  multi_select_science: {
    id: "ms_001",
    title: "Properties of Water",
    description: "Select all properties that apply to water",
    category: "Science",
    level: "Intermediate",
    quizType: "MULTI_SELECT",
    metadata: {
      timeLimit: 1200,
      totalPoints: 100,
      totalQuestions: 3,
      passingScore: 70,
      shuffle: true,
      attempts: 2,
      partialScoring: true,
      showExplanation: true,
    },
    questions: [
      {
        id: "ms_q_001",
        sequence: 1,
        points: 20,
        quizType: "MULTI_SELECT",
        question: {
          text: "Which of these are properties of water? (Select all that apply)",
          media: [],
        },
        answer: {
          correctOptions: ["A", "B", "D"],
          minCorrect: 2,
          maxIncorrect: 1,
          options: [
            { key: "A", text: "Transparent" },
            { key: "B", text: "Essential for life" },
            { key: "C", text: "Magnetic" },
            { key: "D", text: "Density increases when frozen" },
          ],
          evaluationType: "partial",
        },
        explanation:
          "Water is transparent, essential for life, and has an unusual property where ice (frozen water) is less dense than liquid water, making it float.",
      },
    ],
  },

  // ============================================
  // QUIZ 3: True/False Quiz
  // ============================================
  true_false_geography: {
    id: "tf_001",
    title: "Geography Facts",
    description: "Answer true or false to geography statements",
    category: "Geography",
    level: "Beginner",
    quizType: "TRUE_FALSE",
    metadata: {
      timeLimit: 600,
      totalPoints: 50,
      totalQuestions: 5,
      passingScore: 60,
      shuffle: false,
      attempts: 1,
      partialScoring: false,
      showExplanation: true,
    },
    questions: [
      {
        id: "tf_q_001",
        sequence: 1,
        points: 10,
        quizType: "TRUE_FALSE",
        question: {
          text: "The Sahara is the largest desert in the world.",
          media: [],
        },
        answer: {
          correctAnswer: false,
          evaluationType: "exact",
        },
        explanation:
          "The Antarctic is actually the largest desert in the world, followed by the Arctic. The Sahara is the largest hot desert.",
      },
      {
        id: "tf_q_002",
        sequence: 2,
        points: 10,
        quizType: "TRUE_FALSE",
        question: {
          text: "Mount Everest is the tallest mountain on Earth.",
          media: [],
        },
        answer: {
          correctAnswer: true,
          evaluationType: "exact",
        },
        explanation: "Mount Everest, at 29,032 feet (8,849 meters), is the tallest mountain.",
      },
    ],
  },

  // ============================================
  // QUIZ 4: Fill in the Blank Quiz
  // ============================================
  fill_blank_language: {
    id: "fb_001",
    title: "English Spelling & Grammar",
    description: "Fill in the correct words",
    category: "Language",
    level: "Intermediate",
    quizType: "FILL_BLANK",
    metadata: {
      timeLimit: 1500,
      totalPoints: 100,
      totalQuestions: 4,
      passingScore: 75,
      shuffle: false,
      attempts: 2,
      partialScoring: true,
      showExplanation: true,
    },
    questions: [
      {
        id: "fb_q_001",
        sequence: 1,
        points: 25,
        quizType: "FILL_BLANK",
        question: {
          text: "The capital of France is __________",
          media: [],
        },
        answer: {
          correctAnswers: ["Paris", "paris", "PARIS"],
          caseSensitive: false,
          fuzzyMatch: true,
          fuzzyThreshold: 0.85,
          evaluationType: "fuzzy",
        },
        hint: "It's known as the City of Light",
        explanation: "Paris is the capital and largest city of France.",
      },
      {
        id: "fb_q_002",
        sequence: 2,
        points: 25,
        quizType: "FILL_BLANK",
        question: {
          text: "The past tense of 'go' is __________",
          media: [],
        },
        answer: {
          correctAnswers: ["went", "Went"],
          caseSensitive: false,
          fuzzyMatch: true,
          fuzzyThreshold: 0.9,
          evaluationType: "fuzzy",
        },
        hint: "It's an irregular verb",
        explanation: "'Go' is an irregular verb. Its past tense is 'went', not 'goed'.",
      },
    ],
  },

  // ============================================
  // QUIZ 5: Matching Quiz
  // ============================================
  matching_vocabulary: {
    id: "match_001",
    title: "English Vocabulary - Synonyms",
    description: "Match words with their synonyms",
    category: "Language",
    level: "Intermediate",
    quizType: "MATCHING",
    metadata: {
      timeLimit: 900,
      totalPoints: 100,
      totalQuestions: 1,
      passingScore: 80,
      shuffle: true,
      attempts: 2,
      partialScoring: false,
      showExplanation: false,
    },
    questions: [
      {
        id: "match_q_001",
        sequence: 1,
        points: 100,
        quizType: "MATCHING",
        question: {
          text: "Match each word with its synonym",
          media: [],
        },
        answer: {
          pairs: [
            { left: "w_1", right: "s_1" },
            { left: "w_2", right: "s_2" },
            { left: "w_3", right: "s_3" },
            { left: "w_4", right: "s_4" },
          ],
          leftItems: [
            { id: "w_1", text: "Happy" },
            { id: "w_2", text: "Big" },
            { id: "w_3", text: "Fast" },
            { id: "w_4", text: "Beautiful" },
          ],
          rightItems: [
            { id: "s_1", text: "Joyful" },
            { id: "s_2", text: "Large" },
            { id: "s_3", text: "Quick" },
            { id: "s_4", text: "Gorgeous" },
          ],
          evaluationType: "exact",
        },
      },
    ],
  },

  // ============================================
  // QUIZ 6: Ordering Quiz
  // ============================================
  ordering_process: {
    id: "order_001",
    title: "Steps of the Scientific Method",
    description: "Arrange the steps in correct order",
    category: "Science",
    level: "Intermediate",
    quizType: "ORDERING",
    metadata: {
      timeLimit: 900,
      totalPoints: 100,
      totalQuestions: 1,
      passingScore: 100,
      shuffle: true,
      attempts: 1,
      partialScoring: false,
      showExplanation: true,
    },
    questions: [
      {
        id: "order_q_001",
        sequence: 1,
        points: 100,
        quizType: "ORDERING",
        question: {
          text: "Arrange these steps in the correct order of the scientific method",
          media: [],
        },
        answer: {
          correctSequence: ["step_1", "step_2", "step_3", "step_4", "step_5"],
          items: [
            { id: "step_1", text: "1. Ask a Question" },
            { id: "step_2", text: "2. Do Background Research" },
            { id: "step_3", text: "3. Form a Hypothesis" },
            { id: "step_4", text: "4. Conduct Experiment" },
            { id: "step_5", text: "5. Analyze Results & Draw Conclusions" },
          ],
          evaluationType: "sequence",
        },
        explanation:
          "The scientific method starts with a question, followed by research, forming a hypothesis, testing it, and finally analyzing the results.",
      },
    ],
  },

  // ============================================
  // QUIZ 7: Drag & Drop Quiz
  // ============================================
  drag_drop_biology: {
    id: "dd_001",
    title: "Cell Organelle Functions",
    description: "Categorize cell organelles by their functions",
    category: "Biology",
    level: "Intermediate",
    quizType: "DRAG_DROP",
    metadata: {
      timeLimit: 1200,
      totalPoints: 100,
      totalQuestions: 1,
      passingScore: 80,
      shuffle: false,
      attempts: 2,
      partialScoring: false,
      showExplanation: true,
    },
    questions: [
      {
        id: "dd_q_001",
        sequence: 1,
        points: 100,
        quizType: "DRAG_DROP",
        question: {
          text: "Drag each organelle into its correct function category",
          media: [],
        },
        answer: {
          categories: [
            {
              id: "cat_1",
              label: "Energy Production",
              items: ["org_1", "org_2"],
            },
            {
              id: "cat_2",
              label: "Protein Synthesis",
              items: ["org_3", "org_4"],
            },
            {
              id: "cat_3",
              label: "Waste Processing",
              items: ["org_5"],
            },
          ],
          availableItems: [
            { id: "org_1", text: "Mitochondria" },
            { id: "org_2", text: "Chloroplast" },
            { id: "org_3", text: "Ribosome" },
            { id: "org_4", text: "Rough ER" },
            { id: "org_5", text: "Lysosome" },
          ],
          evaluationType: "exact",
        },
        explanation:
          "Mitochondria and chloroplasts produce energy. Ribosomes and rough ER synthesize proteins. Lysosomes break down waste.",
      },
    ],
  },

  // ============================================
  // QUIZ 8: Image-Based Quiz
  // ============================================
  image_based_anatomy: {
    id: "img_001",
    title: "Identify Parts of the Brain",
    description: "Click on the correct part of the brain",
    category: "Biology",
    level: "Intermediate",
    quizType: "IMAGE_BASED",
    metadata: {
      timeLimit: 600,
      totalPoints: 50,
      totalQuestions: 1,
      passingScore: 100,
      shuffle: false,
      attempts: 2,
      partialScoring: false,
      showExplanation: true,
    },
    questions: [
      {
        id: "img_q_001",
        sequence: 1,
        points: 50,
        quizType: "IMAGE_BASED",
        question: {
          text: "Click on the Cerebellum (the smaller brain part at the bottom back)",
          media: [
            {
              type: "image",
              url: "https://via.placeholder.com/500x400?text=Brain+Diagram",
              alt: "Brain diagram",
            },
          ],
        },
        answer: {
          type: "region",
          region: {
            shape: "rectangle",
            coordinates: {
              x: 200,
              y: 300,
              width: 100,
              height: 80,
            },
            tolerance: 15,
          },
          evaluationType: "coordinate_match",
        },
        explanation:
          "The cerebellum is located at the back bottom of the brain and is responsible for coordination and balance.",
      },
    ],
  },

  // ============================================
  // QUIZ 9: Puzzle Quiz
  // ============================================
  puzzle_story: {
    id: "puzz_001",
    title: "Story Sequence",
    description: "Arrange the story parts in correct order",
    category: "Literature",
    level: "Beginner",
    quizType: "PUZZLE",
    metadata: {
      timeLimit: 1200,
      totalPoints: 100,
      totalQuestions: 1,
      passingScore: 100,
      shuffle: true,
      attempts: 2,
      partialScoring: false,
      showExplanation: false,
    },
    questions: [
      {
        id: "puzz_q_001",
        sequence: 1,
        points: 100,
        quizType: "PUZZLE",
        question: {
          text: "Arrange the story parts in the correct order",
          media: [],
        },
        answer: {
          pieces: [
            { id: "p_1", text: "Once upon a time, there was a young girl named Alice." },
            {
              id: "p_2",
              text: "She fell down a rabbit hole and found herself in a magical land.",
            },
            {
              id: "p_3",
              text: "Alice met many strange creatures including the Queen of Hearts.",
            },
            { id: "p_4", text: "After many adventures, she woke up and realized it was all a dream." },
          ],
          correctSequence: ["p_1", "p_2", "p_3", "p_4"],
          evaluationType: "sequence",
        },
      },
    ],
  },

  // ============================================
  // QUIZ 10: Coding Quiz
  // ============================================
  coding_challenge: {
    id: "code_001",
    title: "JavaScript Function Writing",
    description: "Write a function to solve the problem",
    category: "Programming",
    level: "Beginner",
    quizType: "CODING",
    metadata: {
      timeLimit: 1800,
      totalPoints: 100,
      totalQuestions: 2,
      passingScore: 70,
      shuffle: false,
      attempts: 3,
      partialScoring: true,
      showExplanation: true,
    },
    questions: [
      {
        id: "code_q_001",
        sequence: 1,
        points: 50,
        quizType: "CODING",
        question: {
          text: "Write a function that returns the sum of two numbers",
          media: [],
        },
        answer: {
          language: "javascript",
          template: "function add(a, b) {\n  // Write your code here\n}",
          testCases: [
            { input: { a: 2, b: 3 }, expectedOutput: 5, points: 25 },
            { input: { a: 10, b: 20 }, expectedOutput: 30, points: 25 },
          ],
          evaluationType: "test_cases",
        },
        explanation: "Use the + operator to add the two parameters and return the result.",
      },
      {
        id: "code_q_002",
        sequence: 2,
        points: 50,
        quizType: "CODING",
        question: {
          text: "Write a function that checks if a number is even",
          media: [],
        },
        answer: {
          language: "javascript",
          template:
            "function isEven(num) {\n  // Write your code here\n}",
          testCases: [
            { input: { num: 4 }, expectedOutput: true, points: 25 },
            { input: { num: 5 }, expectedOutput: false, points: 25 },
          ],
          evaluationType: "test_cases",
        },
        explanation: "Use the modulo operator (%). If num % 2 === 0, the number is even.",
      },
    ],
  },

  // ============================================
  // QUIZ 11: Audio-Based Quiz
  // ============================================
  audio_based_language: {
    id: "audio_001",
    title: "English Listening Comprehension",
    description: "Listen and answer questions",
    category: "Language",
    level: "Intermediate",
    quizType: "AUDIO_BASED",
    metadata: {
      timeLimit: 900,
      totalPoints: 100,
      totalQuestions: 2,
      passingScore: 70,
      shuffle: false,
      attempts: 1,
      partialScoring: false,
      showExplanation: true,
    },
    questions: [
      {
        id: "audio_q_001",
        sequence: 1,
        points: 50,
        quizType: "AUDIO_BASED",
        question: {
          text: "Listen to the audio and answer the question: What is the main topic?",
          media: [
            {
              type: "audio",
              url: "https://via.placeholder.com/audio.mp3",
              duration: 120,
            },
          ],
        },
        answer: {
          correctOption: "A",
          options: [
            { key: "A", text: "Climate change impact" },
            { key: "B", text: "Weather patterns" },
            { key: "C", text: "Animal migration" },
          ],
          evaluationType: "exact",
        },
        explanation: "The audio discusses the impacts of climate change on ocean ecosystems.",
      },
    ],
  },
};

/**
 * Helper function to get all quiz types examples
 */
export const getAllQuizExamples = () => {
  return Object.values(SAMPLE_QUIZZES);
};

/**
 * Get quiz by ID
 */
export const getQuizById = (quizId) => {
  return SAMPLE_QUIZZES[quizId];
};

/**
 * Get quizzes by type
 */
export const getQuizzesByType = (quizType) => {
  return Object.values(SAMPLE_QUIZZES).filter((q) => q.quizType === quizType);
};

/**
 * Get quizzes by category
 */
export const getQuizzesByCategory = (category) => {
  return Object.values(SAMPLE_QUIZZES).filter((q) => q.category === category);
};
