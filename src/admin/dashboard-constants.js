// ===== BASE PUZZLE TEMPLATES (Reusable, Generic) =====
const BASE_PUZZLE_TEMPLATES = [
  {
    name: 'Find Pairs (Generic)',
    typeKey: 'findPairs',
    category: 'logic-puzzles',
    description: 'Generic pair-matching template. Replace pairs with any content (words, images, numbers).',
    schema: {
      pairs: [
        { left: 'A', right: 'a' },
        { left: 'B', right: 'b' },
      ],
      mediaSupport: true,
    },
  },
  {
    name: 'Lateral Thinking (Generic)',
    typeKey: 'lateralThinking',
    category: 'logic-puzzles',
    description: 'Prompt + solution template. Replace questions/answers freely.',
    schema: {
      questions: [
        { prompt: 'A riddle goes here...', answer: 'Solution' },
      ],
    },
  },
  {
    name: 'Ordering (Generic Items)',
    typeKey: 'ordering',
    category: 'logic-puzzles',
    description: 'Ordering template with free-form items. Replace items and order as needed.',
    schema: {
      items: ['Item 1', 'Item 2', 'Item 3'],
      correctOrder: [0, 1, 2],
    },
  },
  {
    name: 'Picture Shadow (Generic)',
    typeKey: 'pictureShadow',
    category: 'logic-puzzles',
    description: 'Match pictures to their shadows. Replace URLs.',
    schema: {
      imagePairs: [
        { imageUrl: 'https://example.com/image1.png', shadowUrl: 'https://example.com/shadow1.png' },
      ],
    },
  },
  {
    name: 'Picture Word Matching (Generic)',
    typeKey: 'pictureWordMatching',
    category: 'logic-puzzles',
    description: 'Match images to words. Replace URLs and labels.',
    schema: {
      pairs: [
        { imageUrl: 'https://example.com/apple.png', word: 'Apple' },
      ],
    },
  },
  {
    name: 'Spot Difference (Generic)',
    typeKey: 'spotDifference',
    category: 'logic-puzzles',
    description: 'Provide two images and mark difference points or a difference count.',
    schema: {
      baseImageUrl: 'https://example.com/base.png',
      alteredImageUrl: 'https://example.com/altered.png',
      differencePoints: [ { x: 10, y: 25 }, { x: 120, y: 88 } ],
      differenceCount: 5,
    },
  },
  {
    name: 'Sudoku Style (Generic)',
    typeKey: 'sudokuStyle',
    category: 'logic-puzzles',
    description: 'Grid-based number puzzle. Adjust size and presets.',
    schema: {
      gridSize: 9,
      presets: [ { r: 0, c: 0, value: 5 }, { r: 4, c: 4, value: 7 } ],
    },
  },
  {
    name: 'Sequence Completion (Generic)',
    typeKey: 'sequenceCompletion',
    category: 'pattern-puzzles',
    description: 'Fill the next element(s) in the sequence.',
    schema: {
      sequence: [1, 2, 3, null],
      solutions: [4],
    },
  },
  {
    name: 'Visual Patterns (Generic)',
    typeKey: 'visualPatterns',
    category: 'pattern-puzzles',
    description: 'Image-based pattern sequence. Replace image URLs.',
    schema: {
      images: [
        'https://example.com/pattern1.png',
        'https://example.com/pattern2.png',
        'https://example.com/pattern3.png',
        '',
      ],
      solutions: [ 'https://example.com/pattern4.png' ],
    },
  },
  {
    name: 'Jigsaw Puzzles (Generic)',
    typeKey: 'jigsaw',
    category: 'traditional-puzzles',
    description: 'Jigsaw with adjustable piece count.',
    schema: {
      imageUrl: 'https://example.com/jigsaw.png',
      pieces: 16,
    },
  },
  {
    name: 'Matching Pairs (Generic)',
    typeKey: 'matchingPairs',
    category: 'traditional-puzzles',
    description: 'Classic matching pairs. Replace labels or images.',
    schema: {
      pairs: [
        { left: 'Dog', right: '🐶' },
        { left: 'Cat', right: '🐱' },
      ],
    },
  },
  {
    name: 'Word Search (Generic)',
    typeKey: 'wordSearch',
    category: 'traditional-puzzles',
    description: 'Word search grid with word list.',
    schema: {
      gridRows: [
        'CATS',
        'DOGS',
        'BIRD',
        'FISH',
      ],
      words: ['CAT', 'DOG', 'BIRD', 'FISH'],
    },
  },
];

export { BASE_PUZZLE_TEMPLATES };
