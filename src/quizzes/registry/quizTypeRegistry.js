/**
 * Quiz Type Registry & Plugin System
 * Controls all quiz types and their behaviors
 */

export const QUIZ_TYPES = {
  MCQ: "MCQ",
  MULTI_SELECT: "MULTI_SELECT",
  TRUE_FALSE: "TRUE_FALSE",
  FILL_BLANK: "FILL_BLANK",
  MATCHING: "MATCHING",
  ORDERING: "ORDERING",
  DRAG_DROP: "DRAG_DROP",
  CODING: "CODING",
  IMAGE_BASED: "IMAGE_BASED",
  PUZZLE: "PUZZLE",
  AUDIO_BASED: "AUDIO_BASED",
};

/**
 * Quiz Type Plugin Definition
 * Each quiz type is a plugin with specific behaviors
 */
export const QUIZ_TYPE_PLUGINS = {
  [QUIZ_TYPES.MCQ]: {
    id: "MCQ",
    label: "Multiple Choice",
    description: "Single correct answer from multiple options",
    category: "basic",
    complexity: "simple",
    inputType: "single_select",
    evaluationType: "exact",
    supportsMedia: true,
    defaultPoints: 10,
    template: {
      answer: {
        correctOption: "",
        options: [
          { key: "A", text: "", media: null },
          { key: "B", text: "", media: null },
          { key: "C", text: "", media: null },
          { key: "D", text: "", media: null },
        ],
        evaluationType: "exact",
      },
    },
  },

  [QUIZ_TYPES.MULTI_SELECT]: {
    id: "MULTI_SELECT",
    label: "Multiple Answer",
    description: "Multiple correct answers possible",
    category: "intermediate",
    complexity: "medium",
    inputType: "multi_select",
    evaluationType: "partial",
    supportsMedia: true,
    defaultPoints: 15,
    template: {
      answer: {
        correctOptions: [],
        minCorrect: 1,
        maxIncorrect: 1,
        options: [
          { key: "A", text: "", media: null },
          { key: "B", text: "", media: null },
          { key: "C", text: "", media: null },
          { key: "D", text: "", media: null },
        ],
        evaluationType: "partial",
      },
    },
  },

  [QUIZ_TYPES.TRUE_FALSE]: {
    id: "TRUE_FALSE",
    label: "True/False",
    description: "Binary true or false answer",
    category: "basic",
    complexity: "simple",
    inputType: "boolean",
    evaluationType: "exact",
    supportsMedia: true,
    defaultPoints: 5,
    template: {
      answer: {
        correctAnswer: true,
        evaluationType: "exact",
      },
    },
  },

  [QUIZ_TYPES.FILL_BLANK]: {
    id: "FILL_BLANK",
    label: "Fill in the Blank",
    description: "User types the correct answer",
    category: "intermediate",
    complexity: "medium",
    inputType: "text_input",
    evaluationType: "fuzzy",
    supportsMedia: true,
    defaultPoints: 10,
    template: {
      answer: {
        correctAnswers: [],
        caseSensitive: false,
        fuzzyMatch: true,
        fuzzyThreshold: 0.85,
        evaluationType: "fuzzy",
      },
    },
  },

  [QUIZ_TYPES.MATCHING]: {
    id: "MATCHING",
    label: "Matching Pairs",
    description: "Match items from two columns",
    category: "intermediate",
    complexity: "medium",
    inputType: "pair_matching",
    evaluationType: "exact",
    supportsMedia: true,
    defaultPoints: 20,
    template: {
      answer: {
        pairs: [],
        leftItems: [],
        rightItems: [],
        evaluationType: "exact",
      },
    },
  },

  [QUIZ_TYPES.ORDERING]: {
    id: "ORDERING",
    label: "Sequence Ordering",
    description: "Arrange items in correct order",
    category: "intermediate",
    complexity: "medium",
    inputType: "drag_reorder",
    evaluationType: "sequence",
    supportsMedia: true,
    defaultPoints: 15,
    template: {
      answer: {
        correctSequence: [],
        items: [],
        evaluationType: "sequence",
      },
    },
  },

  [QUIZ_TYPES.DRAG_DROP]: {
    id: "DRAG_DROP",
    label: "Drag & Drop",
    description: "Drag items into categories",
    category: "advanced",
    complexity: "complex",
    inputType: "drag_categorize",
    evaluationType: "exact",
    supportsMedia: true,
    defaultPoints: 25,
    template: {
      answer: {
        categories: [],
        availableItems: [],
        evaluationType: "exact",
      },
    },
  },

  [QUIZ_TYPES.CODING]: {
    id: "CODING",
    label: "Code Challenge",
    description: "Write code against test cases",
    category: "advanced",
    complexity: "complex",
    inputType: "code_editor",
    evaluationType: "test_cases",
    supportsMedia: false,
    defaultPoints: 50,
    template: {
      answer: {
        language: "javascript",
        template: "",
        testCases: [],
        evaluationType: "test_cases",
      },
    },
  },

  [QUIZ_TYPES.IMAGE_BASED]: {
    id: "IMAGE_BASED",
    label: "Image Selection",
    description: "Click or mark regions in image",
    category: "advanced",
    complexity: "complex",
    inputType: "image_click",
    evaluationType: "coordinate_match",
    supportsMedia: true,
    defaultPoints: 10,
    template: {
      answer: {
        type: "region",
        region: {
          shape: "rectangle",
          coordinates: { x: 0, y: 0, width: 100, height: 100 },
          tolerance: 10,
        },
        evaluationType: "coordinate_match",
      },
    },
  },

  [QUIZ_TYPES.PUZZLE]: {
    id: "PUZZLE",
    label: "Puzzle Assembly",
    description: "Arrange puzzle pieces in order",
    category: "advanced",
    complexity: "complex",
    inputType: "drag_reorder",
    evaluationType: "sequence",
    supportsMedia: true,
    defaultPoints: 20,
    template: {
      answer: {
        pieces: [],
        correctSequence: [],
        evaluationType: "sequence",
      },
    },
  },

  [QUIZ_TYPES.AUDIO_BASED]: {
    id: "AUDIO_BASED",
    label: "Audio Listening",
    description: "Listen to audio and answer",
    category: "intermediate",
    complexity: "medium",
    inputType: "single_select",
    evaluationType: "exact",
    supportsMedia: true,
    defaultPoints: 10,
    template: {
      answer: {
        correctOption: "",
        options: [
          { key: "A", text: "" },
          { key: "B", text: "" },
          { key: "C", text: "" },
        ],
        evaluationType: "exact",
      },
    },
  },
};

/**
 * Get plugin for a quiz type
 */
export const getQuizPlugin = (quizType) => {
  return QUIZ_TYPE_PLUGINS[quizType] || null;
};

/**
 * Get all quiz types
 */
export const getAllQuizTypes = () => {
  return Object.values(QUIZ_TYPES);
};

/**
 * Get quiz types by category
 */
export const getQuizTypesByCategory = (category) => {
  return Object.values(QUIZ_TYPE_PLUGINS).filter((p) => p.category === category);
};

/**
 * Validate quiz type exists
 */
export const isValidQuizType = (quizType) => {
  return Object.values(QUIZ_TYPES).includes(quizType);
};

/**
 * Get input component type for quiz type
 */
export const getInputComponentType = (quizType) => {
  const plugin = getQuizPlugin(quizType);
  return plugin ? plugin.inputType : null;
};

/**
 * Get evaluation strategy for quiz type
 */
export const getEvaluationStrategy = (quizType) => {
  const plugin = getQuizPlugin(quizType);
  return plugin ? plugin.evaluationType : null;
};

/**
 * Register new quiz type (for extensibility)
 */
export const registerQuizType = (typeKey, plugin) => {
  if (QUIZ_TYPES[typeKey]) {
    console.warn(`Quiz type ${typeKey} already exists`);
    return false;
  }
  QUIZ_TYPES[typeKey] = typeKey;
  QUIZ_TYPE_PLUGINS[typeKey] = plugin;
  return true;
};

/**
 * Quiz Type Metadata Helper
 */
export const getQuizTypeMetadata = (quizType) => {
  const plugin = getQuizPlugin(quizType);
  if (!plugin) return null;

  return {
    id: plugin.id,
    label: plugin.label,
    description: plugin.description,
    complexity: plugin.complexity,
    supportedInputs: {
      text: true,
      image: plugin.supportsMedia,
      video: plugin.supportsMedia,
      audio: plugin.supportsMedia,
    },
    defaultPoints: plugin.defaultPoints,
    allowsMedia: plugin.supportsMedia,
    minOptions: plugin.inputType === "single_select" ? 2 : undefined,
  };
};
