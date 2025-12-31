/**
 * Firestore Collection Setup Script
 * Creates 4 new feature collections with transformed/reused data
 * 
 * Usage:
 * Option 1: Node.js (requires .env setup)
 *   node setupFirestoreCollections.js
 * 
 * Option 2: Firebase Console / Browser Dev Tools
 *   Copy and paste into Firebase Console or browser console
 *   (Already authenticated via your admin panel)
 * 
 * This script:
 * 1. Creates 4 new feature documents (arts, documents, studies, worksheets)
 * 2. Creates category collections for each new type
 * 3. Creates sample documents from reused data
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  writeBatch 
} = require('firebase/firestore');

// ============================================================================
// Firebase Config (uses environment variables)
// ============================================================================

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================================
// NEW FEATURE DOCUMENTS
// ============================================================================

const newFeatures = [
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
];

// ============================================================================
// SAMPLE CATEGORIES
// ============================================================================

const sampleCategories = {
  documentCategories: [
    {
      id: 'educational-kids',
      name: 'Kids Learning',
      label: 'Kids Learning',
      featureId: 'documents',
      icon: '👶',
      description: 'Fun and educational documents for children',
      color: '#10b981',
      status: 'published',
      visibility: 'public',
      order: 1,
    },
  ],
  studiesCategories: [
    {
      id: 'programming-java',
      name: 'Java Programming',
      label: 'Java Programming',
      featureId: 'studies',
      icon: '☕',
      description: 'Complete Java programming study materials',
      color: '#f59e0b',
      status: 'published',
      visibility: 'public',
      order: 1,
    },
  ],
  worksheetCategories: [
    {
      id: 'logic-puzzles-ws',
      name: 'Logic Puzzles',
      label: 'Logic Puzzles',
      featureId: 'worksheets',
      icon: '🧩',
      description: 'Logic puzzle worksheets for problem-solving',
      color: '#8b5cf6',
      status: 'published',
      visibility: 'public',
      order: 1,
    },
  ],
  artCategories: [
    {
      id: 'visual-arts',
      name: 'Visual Arts',
      label: 'Visual Arts & Design',
      featureId: 'arts',
      icon: '🎨',
      description: 'Visual exercises, patterns, and design challenges',
      color: '#ec4899',
      status: 'published',
      visibility: 'public',
      order: 1,
    },
  ],
};

// ============================================================================
// SAMPLE DATA FOR NEW COLLECTIONS
// ============================================================================

const sampleDocuments = [
  {
    id: 'doc-math-kids',
    title: 'Simple Math Guide',
    description: 'Learn basic math operations including addition and subtraction',
    categoryId: 'educational-kids',
    featureId: 'documents',
    topic: 'Math',
    difficulty: 'easy',
    icon: '📐',
    status: 'published',
    visibility: 'public',
    order: 1,
    content: 'A comprehensive guide to learning basic math operations for kids.',
    keywords: ['math', 'addition', 'subtraction', 'numbers'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'doc-animals-kids',
    title: 'Animals Learning Guide',
    description: 'Discover different animals and their sounds and characteristics',
    categoryId: 'educational-kids',
    featureId: 'documents',
    topic: 'Animals',
    difficulty: 'easy',
    icon: '🦁',
    status: 'published',
    visibility: 'public',
    order: 2,
    content: 'Discover different animals and their characteristics.',
    keywords: ['animals', 'sounds', 'wildlife'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'doc-body-kids',
    title: 'Human Body Guide',
    description: 'Learn about different parts of the human body and their functions',
    categoryId: 'educational-kids',
    featureId: 'documents',
    topic: 'Body',
    difficulty: 'easy',
    icon: '🫀',
    status: 'published',
    visibility: 'public',
    order: 3,
    content: 'Learn about different parts of the human body.',
    keywords: ['body', 'anatomy', 'human'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'doc-food-kids',
    title: 'Fruits & Vegetables Guide',
    description: 'Explore different fruits and vegetables and their benefits',
    categoryId: 'educational-kids',
    featureId: 'documents',
    topic: 'Food',
    difficulty: 'easy',
    icon: '🥗',
    status: 'published',
    visibility: 'public',
    order: 4,
    content: 'Learn about different fruits and vegetables.',
    keywords: ['food', 'fruits', 'vegetables'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sampleStudies = [
  {
    id: 'study-java-basics',
    title: 'Java Basics Study Guide',
    description: 'Master the fundamentals of Java programming',
    categoryId: 'programming-java',
    featureId: 'studies',
    topic: 'java',
    subtopic: 'basics',
    difficulty: 'medium',
    icon: '☕',
    status: 'published',
    visibility: 'public',
    order: 1,
    lessons: 5,
    quizzes: 10,
    duration: '3-4 hours',
    objectives: [
      'Understand Java syntax',
      'Learn data types',
      'Master control flow',
      'Write simple programs',
    ],
    keywords: ['java', 'programming', 'basics'],
    content: 'Master the fundamentals of Java programming.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'study-java-arrays',
    title: 'Arrays in Java Study Guide',
    description: 'Deep dive into Java arrays and data structures',
    categoryId: 'programming-java',
    featureId: 'studies',
    topic: 'java',
    subtopic: 'arrays',
    difficulty: 'medium',
    icon: '📚',
    status: 'published',
    visibility: 'public',
    order: 2,
    lessons: 4,
    quizzes: 5,
    duration: '2-3 hours',
    objectives: [
      'Understand array concepts',
      'Work with multi-dimensional arrays',
      'Use array methods',
    ],
    keywords: ['java', 'arrays', 'data-structures'],
    content: 'Deep dive into Java arrays and data structures.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'study-java-strings',
    title: 'String Handling in Java',
    description: 'Complete guide to working with strings in Java',
    categoryId: 'programming-java',
    featureId: 'studies',
    topic: 'java',
    subtopic: 'strings',
    difficulty: 'medium',
    icon: '📝',
    status: 'published',
    visibility: 'public',
    order: 3,
    lessons: 4,
    quizzes: 5,
    duration: '2-3 hours',
    objectives: [
      'Work with String class',
      'Manipulate strings',
      'Understand immutability',
    ],
    keywords: ['java', 'strings', 'text'],
    content: 'Complete guide to working with strings in Java.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sampleWorksheets = [
  {
    id: 'ws-matching-pairs',
    title: 'Matching Pairs Practice',
    description: 'Enhance your visual recognition with matching pair exercises',
    categoryId: 'logic-puzzles-ws',
    featureId: 'worksheets',
    topic: 'matching-pairs',
    difficulty: 'easy',
    icon: '🧩',
    status: 'published',
    visibility: 'public',
    order: 1,
    exercises: 10,
    estTime: '20-30 minutes',
    skills: ['visual-recognition', 'memory'],
    keywords: ['matching', 'puzzle', 'visual'],
    content: 'Practice matching pairs puzzles to enhance visual recognition.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ws-jigsaw-puzzles',
    title: 'Jigsaw Puzzles Workshop',
    description: 'Work through various jigsaw puzzle challenges at different difficulty levels',
    categoryId: 'logic-puzzles-ws',
    featureId: 'worksheets',
    topic: 'jigsaw-puzzles',
    difficulty: 'medium',
    icon: '🧩',
    status: 'published',
    visibility: 'public',
    order: 2,
    exercises: 5,
    estTime: '30-45 minutes',
    skills: ['spatial-reasoning', 'problem-solving'],
    keywords: ['jigsaw', 'puzzle', 'spatial'],
    content: 'Work through various jigsaw puzzle challenges.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ws-word-search',
    title: 'Word Search Challenge',
    description: 'Find hidden words in letter grids with varying difficulty',
    categoryId: 'logic-puzzles-ws',
    featureId: 'worksheets',
    topic: 'word-search',
    difficulty: 'easy',
    icon: '🔤',
    status: 'published',
    visibility: 'public',
    order: 3,
    exercises: 8,
    estTime: '25-35 minutes',
    skills: ['vocabulary', 'attention-to-detail'],
    keywords: ['word-search', 'puzzle', 'vocabulary'],
    content: 'Find hidden words in letter grids.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'ws-sudoku',
    title: 'Sudoku Practice Sheets',
    description: 'Develop logic and reasoning skills with Sudoku puzzles',
    categoryId: 'logic-puzzles-ws',
    featureId: 'worksheets',
    topic: 'sudoku-style',
    difficulty: 'medium',
    icon: '🔢',
    status: 'published',
    visibility: 'public',
    order: 4,
    exercises: 6,
    estTime: '40-60 minutes',
    skills: ['logic', 'reasoning', 'numbers'],
    keywords: ['sudoku', 'logic', 'numbers'],
    content: 'Develop logic and reasoning skills with Sudoku puzzles.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sampleArts = [
  {
    id: 'art-visual-patterns',
    title: 'Visual Patterns Art',
    description: 'Create and explore beautiful visual patterns',
    categoryId: 'visual-arts',
    featureId: 'arts',
    topic: 'visual-patterns',
    difficulty: 'easy',
    icon: '🎨',
    status: 'published',
    visibility: 'public',
    order: 1,
    artType: 'pattern-creation',
    skills: ['pattern-recognition', 'creativity', 'visual-thinking'],
    keywords: ['patterns', 'visual', 'art'],
    content: 'Create and explore beautiful visual patterns.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'art-spot-difference',
    title: 'Spot the Difference Challenge',
    description: 'Develop observation skills through visual challenges',
    categoryId: 'visual-arts',
    featureId: 'arts',
    topic: 'spot-difference',
    difficulty: 'medium',
    icon: '🔍',
    status: 'published',
    visibility: 'public',
    order: 2,
    artType: 'visual-observation',
    skills: ['attention-to-detail', 'observation', 'perception'],
    keywords: ['spot-difference', 'visual', 'art'],
    content: 'Develop observation skills through visual challenges.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'art-color-sequences',
    title: 'Color Sequence Art',
    description: 'Explore color theory and sequences in artistic design',
    categoryId: 'visual-arts',
    featureId: 'arts',
    topic: 'color-patterns',
    difficulty: 'easy',
    icon: '🌈',
    status: 'published',
    visibility: 'public',
    order: 3,
    artType: 'color-design',
    skills: ['color-theory', 'creativity', 'design'],
    keywords: ['color', 'patterns', 'art'],
    content: 'Explore color theory and sequences in artistic design.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'art-shape-puzzles',
    title: 'Shape & Form Art',
    description: 'Master shapes and forms through artistic exercises',
    categoryId: 'visual-arts',
    featureId: 'arts',
    topic: 'shape-patterns',
    difficulty: 'medium',
    icon: '🟢',
    status: 'published',
    visibility: 'public',
    order: 4,
    artType: 'shape-design',
    skills: ['geometric-thinking', 'creativity', 'composition'],
    keywords: ['shapes', 'forms', 'art'],
    content: 'Master shapes and forms through artistic exercises.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// ============================================================================
// MAIN SETUP FUNCTION
// ============================================================================

async function setupCollections() {
  try {
    console.log('\n🚀 Starting Firestore collection setup...\n');

    const batch = writeBatch(db);
    let operationCount = 0;

    // Step 1: Create Feature Documents
    console.log('📌 Step 1: Creating feature documents...');
    for (const feature of newFeatures) {
      const featureRef = doc(db, 'features', feature.id);
      batch.set(featureRef, feature, { merge: true });
      operationCount++;
      console.log(`   ✅ Queued: ${feature.name}`);
    }

    // Step 2: Create Categories for each new feature type
    console.log('\n📌 Step 2: Creating category collections...');
    
    // Document Categories
    for (const cat of sampleCategories.documentCategories) {
      const catRef = doc(db, 'documentCategories', cat.id);
      batch.set(catRef, cat, { merge: true });
      operationCount++;
      console.log(`   ✅ Queued: ${cat.name} (documents)`);
    }

    // Studies Categories
    for (const cat of sampleCategories.studiesCategories) {
      const catRef = doc(db, 'studiesCategories', cat.id);
      batch.set(catRef, cat, { merge: true });
      operationCount++;
      console.log(`   ✅ Queued: ${cat.name} (studies)`);
    }

    // Worksheet Categories
    for (const cat of sampleCategories.worksheetCategories) {
      const catRef = doc(db, 'worksheetCategories', cat.id);
      batch.set(catRef, cat, { merge: true });
      operationCount++;
      console.log(`   ✅ Queued: ${cat.name} (worksheets)`);
    }

    // Art Categories
    for (const cat of sampleCategories.artCategories) {
      const catRef = doc(db, 'artCategories', cat.id);
      batch.set(catRef, cat, { merge: true });
      operationCount++;
      console.log(`   ✅ Queued: ${cat.name} (arts)`);
    }

    // Step 3: Create sample documents
    console.log('\n📌 Step 3: Creating sample documents...');
    for (const doc_item of sampleDocuments) {
      const docRef = doc(db, 'documents', doc_item.id);
      batch.set(docRef, doc_item);
      operationCount++;
      console.log(`   ✅ Queued: ${doc_item.title}`);
    }

    // Step 4: Create sample studies
    console.log('\n📌 Step 4: Creating sample studies...');
    for (const study of sampleStudies) {
      const studyRef = doc(db, 'studies', study.id);
      batch.set(studyRef, study);
      operationCount++;
      console.log(`   ✅ Queued: ${study.title}`);
    }

    // Step 5: Create sample worksheets
    console.log('\n📌 Step 5: Creating sample worksheets...');
    for (const ws of sampleWorksheets) {
      const wsRef = doc(db, 'worksheets', ws.id);
      batch.set(wsRef, ws);
      operationCount++;
      console.log(`   ✅ Queued: ${ws.title}`);
    }

    // Step 6: Create sample arts
    console.log('\n📌 Step 6: Creating sample arts...');
    for (const art of sampleArts) {
      const artRef = doc(db, 'arts', art.id);
      batch.set(artRef, art);
      operationCount++;
      console.log(`   ✅ Queued: ${art.title}`);
    }

    // Commit all operations
    console.log(`\n⏳ Committing ${operationCount} operations to Firestore...`);
    await batch.commit();

    console.log('\n✨ All collections created successfully!');
    console.log('\n📊 Summary:');
    console.log('   ✅ 4 new features created');
    console.log('   ✅ 4 category collections created');
    console.log('   ✅ 4 sample documents created');
    console.log('   ✅ 3 sample studies created');
    console.log('   ✅ 4 sample worksheets created');
    console.log('   ✅ 4 sample arts created');
    console.log('\n🎯 Next steps:');
    console.log('   1. Update ArtsPage.jsx with Firestore queries');
    console.log('   2. Update DocumentsPage.jsx with Firestore queries');
    console.log('   3. Update StudiesPage.jsx with Firestore queries');
    console.log('   4. Update WorksheetsPage.jsx with Firestore queries');
    console.log('   5. Test all pages with real data\n');

    return true;
  } catch (error) {
    console.error('\n❌ Error during setup:', error);
    throw error;
  }
}

// Export for use in both Node.js and browser contexts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { setupCollections };
  
  // Run if executed directly in Node.js
  if (require.main === module) {
    setupCollections()
      .then(() => process.exit(0))
      .catch(err => {
        console.error(err);
        process.exit(1);
      });
  }
}
