// Dashboard setup data and initialization configurations
// Extracted from ModernAdminDashboard.jsx

export const SETUP_DATA = {
  features: [
    {
      id: 'arts',
      name: 'Arts',
      label: 'Arts & Creative',
      icon: '🎨',
      type: 'arts',
      featureId: 'arts',
      description: 'Explore creative and artistic content including visual exercises, patterns, and design challenges',
      status: 'published',
      visibility: 'public',
      enabled: true,
      order: 5,
      showInMenu: true,
    },
    {
      id: 'documents',
      name: 'Documents',
      label: 'Educational Documents',
      icon: '📄',
      type: 'documents',
      featureId: 'documents',
      description: 'Learn through educational documents, reading materials, and reference guides',
      status: 'published',
      visibility: 'public',
      enabled: true,
      order: 6,
      showInMenu: true,
    },
    {
      id: 'studies',
      name: 'Studies',
      label: 'Study Guides',
      icon: '📚',
      type: 'studies',
      featureId: 'studies',
      description: 'Comprehensive study guides and learning paths for programming and technical topics',
      status: 'published',
      visibility: 'public',
      enabled: true,
      order: 7,
      showInMenu: true,
    },
    {
      id: 'worksheets',
      name: 'Worksheets',
      label: 'Practice Worksheets',
      icon: '📋',
      type: 'worksheets',
      featureId: 'worksheets',
      description: 'Interactive worksheets for hands-on practice and skill development',
      status: 'published',
      visibility: 'public',
      enabled: true,
      order: 8,
      showInMenu: true,
    },
  ],
  categories: [
    { collection: 'documentCategories', data: { id: 'educational-kids', name: 'Kids Learning', label: 'Kids Learning', featureId: 'documents', icon: '👶', description: 'Fun and educational documents for children', color: '#10b981', status: 'published', visibility: 'public', order: 1 } },
    { collection: 'studiesCategories', data: { id: 'programming-java', name: 'Java Programming', label: 'Java Programming', featureId: 'studies', icon: '☕', description: 'Complete Java programming study materials', color: '#f59e0b', status: 'published', visibility: 'public', order: 1 } },
    { collection: 'worksheetCategories', data: { id: 'logic-puzzles-ws', name: 'Logic Puzzles', label: 'Logic Puzzles', featureId: 'worksheets', icon: '🧩', description: 'Logic puzzle worksheets for problem-solving', color: '#8b5cf6', status: 'published', visibility: 'public', order: 1 } },
    { collection: 'artCategories', data: { id: 'visual-arts', name: 'Visual Arts', label: 'Visual Arts & Design', featureId: 'arts', icon: '🎨', description: 'Visual exercises, patterns, and design challenges', color: '#ec4899', status: 'published', visibility: 'public', order: 1 } },
  ],
  documents: [
    { id: 'doc-math-kids', title: 'Simple Math Guide', description: 'Learn basic math operations', categoryId: 'educational-kids', featureId: 'documents', topic: 'Math', difficulty: 'easy', icon: '📐', status: 'published', visibility: 'public', order: 1 },
    { id: 'doc-animals-kids', title: 'Animals Learning Guide', description: 'Discover different animals', categoryId: 'educational-kids', featureId: 'documents', topic: 'Animals', difficulty: 'easy', icon: '🦁', status: 'published', visibility: 'public', order: 2 },
    { id: 'doc-body-kids', title: 'Human Body Guide', description: 'Learn body parts and functions', categoryId: 'educational-kids', featureId: 'documents', topic: 'Body', difficulty: 'easy', icon: '🫀', status: 'published', visibility: 'public', order: 3 },
    { id: 'doc-food-kids', title: 'Fruits & Vegetables Guide', description: 'Explore food groups', categoryId: 'educational-kids', featureId: 'documents', topic: 'Food', difficulty: 'easy', icon: '🥗', status: 'published', visibility: 'public', order: 4 },
  ],
  studies: [
    { id: 'study-java-basics', title: 'Java Basics Study Guide', description: 'Master Java fundamentals', categoryId: 'programming-java', featureId: 'studies', topic: 'java', subtopic: 'basics', difficulty: 'medium', icon: '☕', status: 'published', visibility: 'public', order: 1, lessons: 5, quizzes: 10 },
    { id: 'study-java-arrays', title: 'Arrays in Java Study Guide', description: 'Deep dive into arrays', categoryId: 'programming-java', featureId: 'studies', topic: 'java', subtopic: 'arrays', difficulty: 'medium', icon: '📚', status: 'published', visibility: 'public', order: 2, lessons: 4, quizzes: 5 },
    { id: 'study-java-strings', title: 'String Handling in Java', description: 'Complete string guide', categoryId: 'programming-java', featureId: 'studies', topic: 'java', subtopic: 'strings', difficulty: 'medium', icon: '📝', status: 'published', visibility: 'public', order: 3, lessons: 4, quizzes: 5 },
  ],
  worksheets: [
    { id: 'ws-matching-pairs', title: 'Matching Pairs Practice', description: 'Visual recognition exercises', categoryId: 'logic-puzzles-ws', featureId: 'worksheets', topic: 'matching-pairs', difficulty: 'easy', icon: '🧩', status: 'published', visibility: 'public', order: 1, exercises: 10 },
    { id: 'ws-jigsaw-puzzles', title: 'Jigsaw Puzzles Workshop', description: 'Jigsaw puzzle challenges', categoryId: 'logic-puzzles-ws', featureId: 'worksheets', topic: 'jigsaw-puzzles', difficulty: 'medium', icon: '🧩', status: 'published', visibility: 'public', order: 2, exercises: 5 },
    { id: 'ws-word-search', title: 'Word Search Challenge', description: 'Find hidden words', categoryId: 'logic-puzzles-ws', featureId: 'worksheets', topic: 'word-search', difficulty: 'easy', icon: '🔤', status: 'published', visibility: 'public', order: 3, exercises: 8 },
    { id: 'ws-sudoku', title: 'Sudoku Practice Sheets', description: 'Logic puzzles', categoryId: 'logic-puzzles-ws', featureId: 'worksheets', topic: 'sudoku-style', difficulty: 'medium', icon: '🔢', status: 'published', visibility: 'public', order: 4, exercises: 6 },
  ],
  arts: [
    { id: 'art-visual-patterns', title: 'Visual Patterns Art', description: 'Create visual patterns', categoryId: 'visual-arts', featureId: 'arts', topic: 'visual-patterns', difficulty: 'easy', icon: '🎨', status: 'published', visibility: 'public', order: 1 },
    { id: 'art-spot-difference', title: 'Spot the Difference Challenge', description: 'Observation skills', categoryId: 'visual-arts', featureId: 'arts', topic: 'spot-difference', difficulty: 'medium', icon: '🔍', status: 'published', visibility: 'public', order: 2 },
    { id: 'art-color-sequences', title: 'Color Sequence Art', description: 'Color theory', categoryId: 'visual-arts', featureId: 'arts', topic: 'color-patterns', difficulty: 'easy', icon: '🌈', status: 'published', visibility: 'public', order: 3 },
    { id: 'art-shape-puzzles', title: 'Shape & Form Art', description: 'Shapes and forms', categoryId: 'visual-arts', featureId: 'arts', topic: 'shape-patterns', difficulty: 'medium', icon: '🟢', status: 'published', visibility: 'public', order: 4 },
  ],
};

export const ADMIN_TABS = [
  // Dashboard
  { id: 'overview', label: '📊 Overview', icon: '📊', group: 'Dashboard' },
  
  // Content Management
  { id: 'quizzes', label: '❓ Manage Quizzes', icon: '❓', group: 'Content Management' },
  { id: 'puzzles', label: '🧩 Manage Puzzles', icon: '🧩', group: 'Content Management' },
  { id: 'stories', label: '📖 Manage Stories', icon: '📖', group: 'Content Management' },
  { id: 'arts', label: '🎨 Manage Arts', icon: '🎨', group: 'Content Management' },
  { id: 'documents', label: '📄 Manage Documents', icon: '📄', group: 'Content Management' },
  { id: 'studies', label: '📚 Manage Studies', icon: '📚', group: 'Content Management' },
  { id: 'worksheets', label: '📋 Manage Worksheets', icon: '📋', group: 'Content Management' },
  
  // Administration
  { id: 'features', label: '✨ Features & Categories', icon: '✨', group: 'Administration' },
  { id: 'users', label: '👥 Users & Analytics', icon: '👥', group: 'Administration' },
  { id: 'settings', label: '⚙️ Settings', icon: '⚙️', group: 'Administration' },
];

export const DASHBOARD_STATS = (quizzes, puzzles, stories) => [
  { label: 'Total Quizzes', value: (48 + quizzes.length).toString(), icon: '❓', color: '#4ECDC4', change: '+5 this week' },
  { label: 'Total Puzzles', value: (156 + puzzles.length).toString(), icon: '🧩', color: '#FFE66D', change: '+12 this week' },
  { label: 'Total Stories', value: (32 + stories.length).toString(), icon: '📖', color: '#FF85A2', change: '+3 this week' },
  { label: 'Total Arts', value: '24', icon: '🎨', color: '#EC4899', change: '+2 this week' },
  { label: 'Total Documents', value: '18', icon: '📄', color: '#3B82F6', change: '+4 this week' },
  { label: 'Total Studies', value: '42', icon: '📚', color: '#10B981', change: '+6 this week' },
  { label: 'Total Worksheets', value: '56', icon: '📋', color: '#F59E0B', change: '+8 this week' },
  { label: 'Active Users', value: '1,234', icon: '👥', color: '#95E1D3', change: '+89 today' },
];

export const RECENT_ACTIVITIES = [
  { type: 'quiz', action: 'Added', title: 'Biology Basics Quiz', user: 'Admin User', time: '2 hours ago' },
  { type: 'puzzle', action: 'Updated', title: 'Jigsaw Challenge', user: 'Admin User', time: '4 hours ago' },
  { type: 'story', action: 'Published', title: 'The Lost Kingdom', user: 'Admin User', time: '1 day ago' },
  { type: 'art', action: 'Added', title: 'Digital Painting Guide', user: 'Admin User', time: '6 hours ago' },
  { type: 'document', action: 'Updated', title: 'Biology Textbook', user: 'Admin User', time: '5 hours ago' },
  { type: 'study', action: 'Published', title: 'Physics Study Guide', user: 'Admin User', time: '12 hours ago' },
  { type: 'worksheet', action: 'Added', title: 'Math Worksheet Pack', user: 'Admin User', time: '3 hours ago' },
  { type: 'user', action: 'Registered', title: 'New User: John Doe', user: 'System', time: '3 hours ago' },
];
