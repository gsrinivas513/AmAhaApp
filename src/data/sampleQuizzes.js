/**
 * Sample Quizzes for All 11 Quiz Types
 * Used for demonstration on /quiz page
 */

export const SAMPLE_QUIZZES = [
  // 1. MCQ (Multiple Choice Question)
  {
    id: "sample_mcq_001",
    title: "🎯 Basic MCQ Quiz",
    description: "Test your knowledge with multiple choice questions",
    category: "science",
    difficulty: "Easy",
    audience: "all",
    quizType: "MCQ",
    rating: 4.5,
    plays: 245,
    totalQuestions: 3,
    avgTime: "5 min",
    coverImage: "🎯",
    questions: [
      {
        id: "q1",
        sequence: 1,
        quizType: "MCQ",
        points: 10,
        question: {
          contentItems: [
            {
              id: "c1",
              type: "text",
              value: "What is the capital of France?",
              url: ""
            }
          ]
        },
        answer: {
          options: [
            { key: "A", text: "London", media: null },
            { key: "B", text: "Paris", media: null },
            { key: "C", text: "Berlin", media: null },
            { key: "D", text: "Madrid", media: null }
          ],
          correctOption: "B"
        },
        hint: "It's known as the City of Light",
        explanation: "Paris is the capital of France and one of the most visited cities in the world."
      }
    ]
  },

  // 2. MULTI_SELECT (Multiple Answer)
  {
    id: "sample_multi_select_001",
    title: "✓ Multiple Answer Quiz",
    description: "Select all correct answers from the options",
    category: "science",
    difficulty: "Medium",
    audience: "all",
    quizType: "MULTI_SELECT",
    rating: 4.2,
    plays: 189,
    totalQuestions: 2,
    avgTime: "6 min",
    coverImage: "✓",
    questions: [
      {
        id: "q1",
        sequence: 1,
        quizType: "MULTI_SELECT",
        points: 15,
        question: {
          contentItems: [
            {
              id: "c1",
              type: "text",
              value: "Which of these are planets in our solar system?",
              url: ""
            }
          ]
        },
        answer: {
          options: [
            { key: "A", text: "Mars", media: null },
            { key: "B", text: "Venus", media: null },
            { key: "C", text: "Moon", media: null },
            { key: "D", text: "Jupiter", media: null }
          ],
          correctOptions: ["A", "B", "D"],
          minCorrect: 1,
          maxIncorrect: 1
        },
        hint: "The Moon is not a planet",
        explanation: "Mars, Venus, and Jupiter are planets. The Moon is Earth's natural satellite."
      }
    ]
  },

  // 3. TRUE_FALSE
  {
    id: "sample_tf_001",
    title: "✓✗ True or False Quiz",
    description: "Quick true/false assessment questions",
    category: "history",
    difficulty: "Easy",
    audience: "all",
    quizType: "TRUE_FALSE",
    rating: 4.7,
    plays: 312,
    totalQuestions: 4,
    avgTime: "3 min",
    coverImage: "✓✗",
    questions: [
      {
        id: "q1",
        sequence: 1,
        quizType: "TRUE_FALSE",
        points: 5,
        question: {
          contentItems: [
            {
              id: "c1",
              type: "text",
              value: "The Great Wall of China is visible from space with the naked eye.",
              url: ""
            }
          ]
        },
        answer: {
          correctAnswer: false
        },
        hint: "This is actually a myth!",
        explanation: "The Great Wall of China is not visible from space with the naked eye. This is a common misconception."
      }
    ]
  },

  // 4. FILL_BLANK
  {
    id: "sample_fill_blank_001",
    title: "📝 Fill in the Blank",
    description: "Complete the sentences with correct words",
    category: "language",
    difficulty: "Medium",
    audience: "all",
    quizType: "FILL_BLANK",
    rating: 4.3,
    plays: 156,
    totalQuestions: 3,
    avgTime: "7 min",
    coverImage: "📝",
    questions: [
      {
        id: "q1",
        sequence: 1,
        quizType: "FILL_BLANK",
        points: 10,
        question: {
          contentItems: [
            {
              id: "c1",
              type: "text",
              value: "The capital of Germany is _______.",
              url: ""
            }
          ]
        },
        answer: {
          correctAnswers: ["Berlin", "berlin"],
          caseSensitive: false,
          fuzzyMatch: true
        },
        hint: "It's the largest city in Germany",
        explanation: "Berlin is the capital and largest city of Germany."
      }
    ]
  },

  // 5. MATCHING
  {
    id: "sample_matching_001",
    title: "🔗 Matching Pairs",
    description: "Match items from left column to right column",
    category: "science",
    difficulty: "Medium",
    audience: "all",
    quizType: "MATCHING",
    rating: 4.4,
    plays: 198,
    totalQuestions: 2,
    avgTime: "8 min",
    coverImage: "🔗",
    questions: [
      {
        id: "q1",
        sequence: 1,
        quizType: "MATCHING",
        points: 20,
        question: {
          contentItems: [
            {
              id: "c1",
              type: "text",
              value: "Match animals with their sounds:",
              url: ""
            }
          ]
        },
        answer: {
          leftItems: ["Cat", "Dog", "Cow", "Duck"],
          rightItems: ["Meow", "Bark", "Moo", "Quack"],
          pairs: [
            { left: "Cat", right: "Meow" },
            { left: "Dog", right: "Bark" },
            { left: "Cow", right: "Moo" },
            { left: "Duck", right: "Quack" }
          ]
        },
        hint: "Think about the sounds each animal makes",
        explanation: "Each animal has a unique sound: cats meow, dogs bark, cows moo, and ducks quack."
      }
    ]
  },

  // 6. ORDERING
  {
    id: "sample_ordering_001",
    title: "📊 Sequence Ordering",
    description: "Arrange items in the correct sequence",
    category: "history",
    difficulty: "Medium",
    audience: "all",
    quizType: "ORDERING",
    rating: 4.6,
    plays: 267,
    totalQuestions: 2,
    avgTime: "10 min",
    coverImage: "📊",
    questions: [
      {
        id: "q1",
        sequence: 1,
        quizType: "ORDERING",
        points: 15,
        question: {
          contentItems: [
            {
              id: "c1",
              type: "text",
              value: "Arrange these historical events in chronological order:",
              url: ""
            }
          ]
        },
        answer: {
          items: ["Renaissance", "Middle Ages", "Ancient Rome", "Modern Era"],
          correctSequence: [2, 1, 0, 3]
        },
        hint: "Start with Ancient Rome, which was the earliest",
        explanation: "The correct order is: Ancient Rome → Middle Ages → Renaissance → Modern Era"
      }
    ]
  },

  // 7. PUZZLE
  {
    id: "sample_puzzle_001",
    title: "🧩 Puzzle Assembly",
    description: "Assemble puzzle pieces in correct order",
    category: "science",
    difficulty: "Medium",
    audience: "all",
    quizType: "PUZZLE",
    rating: 4.5,
    plays: 223,
    totalQuestions: 2,
    avgTime: "12 min",
    coverImage: "🧩",
    questions: [
      {
        id: "q1",
        sequence: 1,
        quizType: "PUZZLE",
        points: 20,
        question: {
          contentItems: [
            {
              id: "c1",
              type: "text",
              value: "Arrange the life cycle stages of a butterfly in correct order:",
              url: ""
            }
          ]
        },
        answer: {
          pieces: ["Egg", "Larva", "Pupa", "Adult"],
          correctSequence: [0, 1, 2, 3]
        },
        hint: "The butterfly starts as an egg",
        explanation: "The butterfly life cycle: Egg → Larva (caterpillar) → Pupa (chrysalis) → Adult (butterfly)"
      }
    ]
  },

  // 8. DRAG_DROP
  {
    id: "sample_drag_drop_001",
    title: "🎯 Drag & Drop Categorization",
    description: "Drag items into their correct categories",
    category: "science",
    difficulty: "Hard",
    audience: "all",
    quizType: "DRAG_DROP",
    rating: 4.3,
    plays: 134,
    totalQuestions: 1,
    avgTime: "10 min",
    coverImage: "🎯",
    questions: [
      {
        id: "q1",
        sequence: 1,
        quizType: "DRAG_DROP",
        points: 25,
        question: {
          contentItems: [
            {
              id: "c1",
              type: "text",
              value: "Categorize these foods into Fruits, Vegetables, and Proteins:",
              url: ""
            }
          ]
        },
        answer: {
          categories: ["Fruits", "Vegetables", "Proteins"],
          availableItems: [
            { text: "Apple", category: "Fruits" },
            { text: "Carrot", category: "Vegetables" },
            { text: "Chicken", category: "Proteins" },
            { text: "Banana", category: "Fruits" },
            { text: "Broccoli", category: "Vegetables" },
            { text: "Fish", category: "Proteins" }
          ]
        },
        hint: "Think about whether items are fruits, vegetables, or sources of protein",
        explanation: "Fruits: Apple, Banana | Vegetables: Carrot, Broccoli | Proteins: Chicken, Fish"
      }
    ]
  },

  // 9. CODING
  {
    id: "sample_coding_001",
    title: "💻 Code Challenge",
    description: "Write code to pass the test cases",
    category: "technology",
    difficulty: "Hard",
    audience: "all",
    quizType: "CODING",
    rating: 4.2,
    plays: 89,
    totalQuestions: 1,
    avgTime: "15 min",
    coverImage: "💻",
    questions: [
      {
        id: "q1",
        sequence: 1,
        quizType: "CODING",
        points: 50,
        question: {
          contentItems: [
            {
              id: "c1",
              type: "text",
              value: "Write a function to calculate the factorial of a number",
              url: ""
            }
          ]
        },
        answer: {
          language: "javascript",
          template: "function factorial(n) {\n  // Write your solution here\n}",
          testCases: [
            { input: "5", output: "120" },
            { input: "4", output: "24" },
            { input: "3", output: "6" },
            { input: "1", output: "1" }
          ]
        },
        hint: "Factorial of n is n × (n-1) × (n-2) × ... × 1",
        explanation: "Factorial(5) = 5 × 4 × 3 × 2 × 1 = 120"
      }
    ]
  },

  // 10. IMAGE_BASED
  {
    id: "sample_image_001",
    title: "🖼️ Image Selection",
    description: "Click the correct region in the image",
    category: "geography",
    difficulty: "Medium",
    audience: "all",
    quizType: "IMAGE_BASED",
    rating: 4.4,
    plays: 201,
    totalQuestions: 1,
    avgTime: "6 min",
    coverImage: "🖼️",
    questions: [
      {
        id: "q1",
        sequence: 1,
        quizType: "IMAGE_BASED",
        points: 10,
        question: {
          contentItems: [
            {
              id: "c1",
              type: "text",
              value: "Click on the location of the Eiffel Tower in this world map:",
              url: ""
            },
            {
              id: "c2",
              type: "image",
              value: "",
              url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&h=600&fit=crop"
            }
          ]
        },
        answer: {
          type: "region",
          region: {
            shape: "rectangle",
            coordinates: { x: 350, y: 200, width: 100, height: 100 },
            tolerance: 20
          }
        },
        hint: "The Eiffel Tower is in Paris, France",
        explanation: "The Eiffel Tower is located in Paris, France in Western Europe."
      }
    ]
  },

  // 11. AUDIO_BASED
  {
    id: "sample_audio_001",
    title: "🎵 Audio Listening Quiz",
    description: "Listen to audio and answer the question",
    category: "language",
    difficulty: "Easy",
    audience: "all",
    quizType: "AUDIO_BASED",
    rating: 4.6,
    plays: 278,
    totalQuestions: 2,
    avgTime: "8 min",
    coverImage: "🎵",
    questions: [
      {
        id: "q1",
        sequence: 1,
        quizType: "AUDIO_BASED",
        points: 10,
        question: {
          contentItems: [
            {
              id: "c1",
              type: "text",
              value: "Listen to the audio and answer: What animal sound did you hear?",
              url: ""
            },
            {
              id: "c2",
              type: "audio",
              value: "",
              url: "https://assets.mixkit.co/active_storage/sfx/2325/2325-preview.mp3"
            }
          ]
        },
        answer: {
          options: [
            { key: "A", text: "Cat meowing", media: null },
            { key: "B", text: "Dog barking", media: null },
            { key: "C", text: "Bird chirping", media: null },
            { key: "D", text: "Cow mooing", media: null }
          ],
          correctOption: "B"
        },
        hint: "It's a common household pet sound",
        explanation: "A dog barking is a distinctive sound that's easy to recognize."
      }
    ]
  }
];

/**
 * Get all sample quizzes
 */
export const getSampleQuizzes = () => SAMPLE_QUIZZES;

/**
 * Get sample quiz by ID
 */
export const getSampleQuizById = (quizId) => {
  return SAMPLE_QUIZZES.find(quiz => quiz.id === quizId);
};

/**
 * Get sample quizzes by category
 */
export const getSampleQuizzesByCategory = (category) => {
  if (category === 'All') {
    return SAMPLE_QUIZZES;
  }
  return SAMPLE_QUIZZES.filter(quiz => quiz.category === category);
};

/**
 * Get sample quizzes by audience
 */
export const getSampleQuizzesByAudience = (audience) => {
  if (audience === 'all') {
    return SAMPLE_QUIZZES;
  }
  return SAMPLE_QUIZZES.filter(quiz => quiz.audience === audience);
};

/**
 * Filter sample quizzes by category and audience
 */
export const filterSampleQuizzes = (category, audience) => {
  let filtered = SAMPLE_QUIZZES;
  
  if (category !== 'All') {
    filtered = filtered.filter(quiz => quiz.category === category);
  }
  
  if (audience !== 'all') {
    filtered = filtered.filter(quiz => quiz.audience === audience);
  }
  
  return filtered;
};
