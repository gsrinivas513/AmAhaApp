#!/usr/bin/env node

/**
 * Firestore Data Setup Script
 * Creates new feature collections with transformed/reused data
 * Usage: node setupNewCollections.mjs
 * 
 * This script:
 * 1. Creates 4 new feature documents (arts, documents, studies, worksheets)
 * 2. Transforms quiz data into documents collection
 * 3. Transforms puzzle subtopics into worksheets
 * 4. Creates studies from programmer quizzes
 * 5. Creates arts from visual puzzles
 */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase
const serviceAccountPath = path.join(__dirname, '../../serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ serviceAccountKey.json not found at:', serviceAccountPath);
  console.error('Please ensure Firebase credentials are in the correct location');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ============================================================================
// FEATURE DOCUMENTS TO CREATE
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
// DOCUMENT CATEGORIES & STRUCTURE
// ============================================================================

const documentCategories = [
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
];

const studiesCategories = [
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
];

const worksheetCategories = [
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
];

const artCategories = [
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
];

// ============================================================================
// SAMPLE DATA TRANSFORMATION FUNCTIONS
// ============================================================================

function createDocumentFromQuiz(quiz, category) {
  return {
    id: `doc-${quiz.subtopicId}`,
    title: quiz.subtopic,
    description: `Learn about ${quiz.subtopic}. Contains ${quiz.quizCount || 1} questions.`,
    topic: quiz.topic,
    category: category.id,
    categoryId: category.id,
    featureId: 'documents',
    source: 'quiz',
    difficulty: quiz.difficulty || 'easy',
    icon: '📖',
    status: 'published',
    visibility: 'public',
    order: 0,
    questionCount: quiz.quizCount || 1,
    content: `# ${quiz.subtopic}\n\nThis document contains educational content about ${quiz.subtopic}.`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createWorksheetFromPuzzleSubtopic(subtopic, category) {
  const difficultyMap = {
    'easy': 1,
    'medium': 2,
    'hard': 3,
  };

  return {
    id: `ws-${subtopic.topicId}-${subtopic.name}`,
    title: `${subtopic.name} Worksheet`,
    description: `Practice worksheet: ${subtopic.description || subtopic.name}`,
    topic: subtopic.topicId,
    category: category.id,
    categoryId: category.id,
    featureId: 'worksheets',
    source: 'puzzle',
    difficulty: 'medium',
    difficultyLevel: 2,
    icon: '📋',
    status: 'published',
    visibility: 'public',
    order: 0,
    exercises: 5,
    estTime: '15-20 minutes',
    skills: ['problem-solving', 'pattern-recognition'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createStudyFromProgrammerQuiz(quiz, topic, category) {
  return {
    id: `study-${quiz.subtopicId}`,
    title: `${quiz.subtopic} Study Guide`,
    description: `Master ${quiz.subtopic} with this comprehensive study guide containing ${quiz.quizCount || 1} key concepts.`,
    topic: topic,
    subtopic: quiz.subtopic,
    category: category.id,
    categoryId: category.id,
    featureId: 'studies',
    source: 'programmer-quiz',
    difficulty: quiz.difficulty || 'medium',
    icon: '📚',
    status: 'published',
    visibility: 'public',
    order: 0,
    lessons: 3,
    quizzes: quiz.quizCount || 1,
    duration: '2-3 hours',
    prerequisites: [],
    objectives: [
      `Understand ${quiz.subtopic}`,
      `Apply ${quiz.subtopic} concepts`,
      `Solve ${quiz.subtopic} problems`,
    ],
    content: `# ${quiz.subtopic}\n\nThis study guide covers essential concepts in ${quiz.subtopic}.`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createArtFromVisualPuzzle(puzzle, category) {
  return {
    id: `art-${puzzle.topicId}-${puzzle.name}`,
    title: `${puzzle.name} - Visual Art`,
    description: `Creative exercise: ${puzzle.description || puzzle.name}`,
    topic: puzzle.topicId,
    category: category.id,
    categoryId: category.id,
    featureId: 'arts',
    source: 'puzzle',
    difficulty: puzzle.difficulty || 'medium',
    icon: '🎨',
    status: 'published',
    visibility: 'public',
    order: 0,
    artType: 'visual-exercise',
    mediums: ['digital'],
    skills: ['visual-perception', 'creativity', 'pattern-recognition'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// ============================================================================
// MAIN SETUP FUNCTION
// ============================================================================

async function setupCollections() {
  try {
    console.log('\n🚀 Starting Firestore collection setup...\n');

    // Step 1: Create Feature Documents
    console.log('📌 Step 1: Creating feature documents...');
    for (const feature of newFeatures) {
      await db.collection('features').doc(feature.id).set(feature, { merge: true });
      console.log(`   ✅ Created feature: ${feature.name}`);
    }

    // Step 2: Create Categories for each new feature type
    console.log('\n📌 Step 2: Creating category documents...');
    
    for (const cat of documentCategories) {
      await db.collection('documentCategories').doc(cat.id).set(cat, { merge: true });
      console.log(`   ✅ Created category: ${cat.name}`);
    }

    for (const cat of studiesCategories) {
      await db.collection('studiesCategories').doc(cat.id).set(cat, { merge: true });
      console.log(`   ✅ Created category: ${cat.name}`);
    }

    for (const cat of worksheetCategories) {
      await db.collection('worksheetCategories').doc(cat.id).set(cat, { merge: true });
      console.log(`   ✅ Created category: ${cat.name}`);
    }

    for (const cat of artCategories) {
      await db.collection('artCategories').doc(cat.id).set(cat, { merge: true });
      console.log(`   ✅ Created category: ${cat.name}`);
    }

    // Step 3: Create sample documents from kid quizzes
    console.log('\n📌 Step 3: Creating document samples from quiz data...');
    const sampleDocuments = [
      {
        id: 'doc-math-kids',
        title: 'Simple Math Guide',
        categoryId: 'educational-kids',
        featureId: 'documents',
        topic: 'Math',
        difficulty: 'easy',
        icon: '📐',
        status: 'published',
        visibility: 'public',
        content: 'A comprehensive guide to learning basic math operations for kids.',
        createdAt: new Date(),
      },
      {
        id: 'doc-animals-kids',
        title: 'Animals Learning Guide',
        categoryId: 'educational-kids',
        featureId: 'documents',
        topic: 'Animals',
        difficulty: 'easy',
        icon: '🦁',
        status: 'published',
        visibility: 'public',
        content: 'Discover different animals and their characteristics.',
        createdAt: new Date(),
      },
      {
        id: 'doc-body-kids',
        title: 'Human Body Guide',
        categoryId: 'educational-kids',
        featureId: 'documents',
        topic: 'Body',
        difficulty: 'easy',
        icon: '🫀',
        status: 'published',
        visibility: 'public',
        content: 'Learn about different parts of the human body.',
        createdAt: new Date(),
      },
    ];

    for (const doc of sampleDocuments) {
      await db.collection('documents').doc(doc.id).set(doc, { merge: true });
      console.log(`   ✅ Created document: ${doc.title}`);
    }

    // Step 4: Create sample studies from programmer quizzes
    console.log('\n📌 Step 4: Creating studies from programmer content...');
    const sampleStudies = [
      {
        id: 'study-java-basics',
        title: 'Java Basics Study Guide',
        categoryId: 'programming-java',
        featureId: 'studies',
        topic: 'java',
        subtopic: 'basics',
        difficulty: 'medium',
        icon: '☕',
        status: 'published',
        visibility: 'public',
        lessons: 5,
        quizzes: 10,
        duration: '3-4 hours',
        content: 'Master the fundamentals of Java programming.',
        createdAt: new Date(),
      },
      {
        id: 'study-java-arrays',
        title: 'Arrays in Java Study Guide',
        categoryId: 'programming-java',
        featureId: 'studies',
        topic: 'java',
        subtopic: 'arrays',
        difficulty: 'medium',
        icon: '📚',
        status: 'published',
        visibility: 'public',
        lessons: 4,
        quizzes: 5,
        duration: '2-3 hours',
        content: 'Deep dive into Java arrays and data structures.',
        createdAt: new Date(),
      },
    ];

    for (const study of sampleStudies) {
      await db.collection('studies').doc(study.id).set(study, { merge: true });
      console.log(`   ✅ Created study: ${study.title}`);
    }

    // Step 5: Create sample worksheets from puzzle data
    console.log('\n📌 Step 5: Creating worksheets from puzzle content...');
    const sampleWorksheets = [
      {
        id: 'ws-matching-pairs',
        title: 'Matching Pairs Practice',
        categoryId: 'logic-puzzles-ws',
        featureId: 'worksheets',
        topic: 'matching-pairs',
        difficulty: 'easy',
        icon: '🧩',
        status: 'published',
        visibility: 'public',
        exercises: 10,
        estTime: '20-30 minutes',
        content: 'Practice matching pairs puzzles to enhance visual recognition.',
        createdAt: new Date(),
      },
      {
        id: 'ws-jigsaw-puzzles',
        title: 'Jigsaw Puzzles Workshop',
        categoryId: 'logic-puzzles-ws',
        featureId: 'worksheets',
        topic: 'jigsaw-puzzles',
        difficulty: 'medium',
        icon: '🧩',
        status: 'published',
        visibility: 'public',
        exercises: 5,
        estTime: '30-45 minutes',
        content: 'Work through various jigsaw puzzle challenges.',
        createdAt: new Date(),
      },
    ];

    for (const ws of sampleWorksheets) {
      await db.collection('worksheets').doc(ws.id).set(ws, { merge: true });
      console.log(`   ✅ Created worksheet: ${ws.title}`);
    }

    // Step 6: Create sample arts from visual puzzles
    console.log('\n📌 Step 6: Creating arts from visual content...');
    const sampleArts = [
      {
        id: 'art-visual-patterns',
        title: 'Visual Patterns Art',
        categoryId: 'visual-arts',
        featureId: 'arts',
        topic: 'visual-patterns',
        difficulty: 'easy',
        icon: '🎨',
        status: 'published',
        visibility: 'public',
        artType: 'pattern-creation',
        skills: ['pattern-recognition', 'creativity'],
        content: 'Create and explore beautiful visual patterns.',
        createdAt: new Date(),
      },
      {
        id: 'art-spot-difference',
        title: 'Spot the Difference Challenge',
        categoryId: 'visual-arts',
        featureId: 'arts',
        topic: 'spot-difference',
        difficulty: 'medium',
        icon: '🔍',
        status: 'published',
        visibility: 'public',
        artType: 'visual-observation',
        skills: ['attention-to-detail', 'observation'],
        content: 'Develop observation skills through visual challenges.',
        createdAt: new Date(),
      },
    ];

    for (const art of sampleArts) {
      await db.collection('arts').doc(art.id).set(art, { merge: true });
      console.log(`   ✅ Created art: ${art.title}`);
    }

    console.log('\n✨ All collections created successfully!');
    console.log('\n📊 Summary:');
    console.log('   ✅ 4 new features created');
    console.log('   ✅ 4 category collections created');
    console.log('   ✅ 3 sample documents created');
    console.log('   ✅ 2 sample studies created');
    console.log('   ✅ 2 sample worksheets created');
    console.log('   ✅ 2 sample arts created');
    console.log('\n🎯 Next steps:');
    console.log('   1. Update ArtsPage.jsx with Firestore queries');
    console.log('   2. Update DocumentsPage.jsx with Firestore queries');
    console.log('   3. Update StudiesPage.jsx with Firestore queries');
    console.log('   4. Update WorksheetsPage.jsx with Firestore queries');
    console.log('   5. Test all pages with real data\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during setup:', error);
    process.exit(1);
  }
}

// Run setup
setupCollections();
