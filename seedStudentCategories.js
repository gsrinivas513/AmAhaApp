#!/usr/bin/env node
/**
 * Seed script to create categories and import student questions
 * Run with: node seedStudentCategories.js
 */

const fs = require('fs');
const path = require('path');

// Firebase imports
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  addDoc, 
  query, 
  where,
  writeBatch,
  doc
} = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDvFqV7SXc6I9Rn_-9bN8kLm2pOqRsT3uU",
  authDomain: "amaha-app-f2a78.firebaseapp.com",
  projectId: "amaha-app-f2a78",
  storageBucket: "amaha-app-f2a78.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Category info (for customization)
const CATEGORY_INFO = {
  geography: { label: 'Geography', icon: '🌍', color: '#0284c7', description: 'Explore world capitals and landmarks' },
  science: { label: 'Science', icon: '🧪', color: '#10b981', description: 'Test your knowledge of science' },
  math: { label: 'Math', icon: '🔢', color: '#f59e0b', description: 'Challenge your math skills' },
  literature: { label: 'Literature', icon: '📚', color: '#8b5cf6', description: 'Classic authors and books' },
  history: { label: 'History', icon: '🏛️', color: '#ef4444', description: 'Learn from the past' },
};

async function main() {
  try {
    console.log('🚀 Starting seed process...\n');

    // Step 1: Get or create Quiz feature
    console.log('📌 Step 1: Getting Quiz feature...');
    const featSnap = await getDocs(query(collection(db, 'features'), where('name', '==', 'quiz')));
    let quizFeatureId;

    if (featSnap.empty) {
      console.log('  ❌ Quiz feature not found. Creating it...');
      const feat = await addDoc(collection(db, 'features'), {
        name: 'quiz',
        label: 'Quiz',
        icon: '🎯',
        enabled: true,
        featureType: 'quiz',
        createdAt: new Date().toISOString(),
      });
      quizFeatureId = feat.id;
      console.log(`  ✅ Created Quiz feature: ${quizFeatureId}`);
    } else {
      quizFeatureId = featSnap.docs[0].id;
      console.log(`  ✅ Found Quiz feature: ${quizFeatureId}`);
    }

    // Step 2: Parse CSV and extract unique categories
    console.log('\n📋 Step 2: Parsing CSV file...');
    const csvPath = path.join(__dirname, 'src/questions/students_questions.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Parse CSV
    const uniqueCategories = new Set();
    const questions = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Simple CSV parser (handles quoted fields)
      const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
      
      if (parts.length >= 9) {
        const [id, question, optionA, optionB, optionC, optionD, correctAnswer, category, difficulty] = parts;
        uniqueCategories.add(category);
        
        // Construct options string with semicolon separator
        const options = `${optionA};${optionB};${optionC};${optionD}`;
        
        questions.push({
          question,
          category,
          options,
          correctAnswer,
          difficulty,
          source: 'students_questions'
        });
      }
    }

    console.log(`  ✅ Found ${questions.length} questions`);
    console.log(`  ✅ Found ${uniqueCategories.size} unique categories: ${Array.from(uniqueCategories).join(', ')}`);

    // Step 3: Create categories
    console.log('\n🏷️  Step 3: Creating categories...');
    const categoryMap = {}; // map of category name -> categoryId

    for (const catName of uniqueCategories) {
      // Check if category already exists
      const existing = await getDocs(
        query(collection(db, 'categories'), where('name', '==', catName), where('featureId', '==', quizFeatureId))
      );

      if (!existing.empty) {
        categoryMap[catName] = existing.docs[0].id;
        console.log(`  ✅ Category "${catName}" already exists`);
        continue;
      }

      // Create new category
      const info = CATEGORY_INFO[catName] || { label: catName.charAt(0).toUpperCase() + catName.slice(1), icon: '📚', color: '#0284c7', description: '' };
      
      const catDoc = await addDoc(collection(db, 'categories'), {
        name: catName,
        label: info.label,
        icon: info.icon,
        color: info.color,
        description: info.description,
        featureId: quizFeatureId,
        quizCount: 0,
        isPublished: true,
        defaultUiMode: 'playful',
        createdAt: new Date().toISOString(),
      });

      categoryMap[catName] = catDoc.id;
      console.log(`  ✅ Created category "${catName}" with ID: ${catDoc.id}`);
    }

    // Step 4: Import questions in batches
    console.log('\n💾 Step 4: Importing questions...');
    const batch = writeBatch(db);
    let batchCount = 0;
    let importedCount = 0;

    for (const q of questions) {
      const docRef = doc(collection(db, 'questions'));
      batch.set(docRef, {
        question: q.question,
        category: q.category,
        options: q.options.split(';').map(o => o.trim()),
        correctAnswer: q.correctAnswer,
        difficulty: q.difficulty,
        createdAt: new Date().toISOString(),
      });

      batchCount++;
      importedCount++;

      // Commit batch every 500 docs
      if (batchCount === 500) {
        await batch.commit();
        console.log(`  ✅ Imported ${importedCount} questions (batch committed)`);
        batchCount = 0;
      }
    }

    // Commit remaining batch
    if (batchCount > 0) {
      await batch.commit();
    }

    console.log(`  ✅ Total questions imported: ${importedCount}`);

    // Step 5: Update category quiz counts
    console.log('\n📊 Step 5: Updating category counts...');
    for (const [catName, catId] of Object.entries(categoryMap)) {
      const catQuestions = questions.filter(q => q.category === catName);
      const count = catQuestions.length;
      
      const catRef = doc(db, 'categories', catId);
      batch.update(catRef, { quizCount: count });
      
      console.log(`  ✅ ${catName}: ${count} questions`);
    }

    await batch.commit();

    console.log('\n✨ Seed process completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Quiz Feature: 1`);
    console.log(`   - Categories: ${uniqueCategories.size}`);
    console.log(`   - Questions: ${importedCount}`);
    console.log('\n✅ You can now go to /admin/features and see all categories!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  }
}

main();
