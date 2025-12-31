#!/usr/bin/env node

/**
 * Delete all quizzes from Firestore
 * Usage: node deleteAllQuizzes.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase
const serviceAccountPath = path.join(__dirname, 'amaha-service-key.json');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}

const db = admin.firestore();

async function deleteAllQuizzes() {
  try {
    console.log('🔥 Fetching all quizzes from /quizzes collection...\n');
    
    const quizzesRef = db.collection('quizzes');
    const snapshot = await quizzesRef.get();
    
    if (snapshot.empty) {
      console.log('✅ No quizzes found to delete');
      process.exit(0);
    }
    
    console.log(`📊 Found ${snapshot.docs.length} quizzes:\n`);
    
    const quizzes = [];
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      quizzes.push({
        id: doc.id,
        title: data.title || 'Untitled',
        difficulty: data.difficulty || 'Unknown',
        questions: data.questions?.length || data.totalQuestions || 0
      });
      console.log(`  • ${data.title || 'Untitled'} (${data.difficulty || 'Unknown'}, ${data.questions?.length || data.totalQuestions || 0} questions)`);
    });
    
    console.log(`\n⚠️  About to delete ${snapshot.docs.length} quizzes...\n`);
    
    let deleted = 0;
    for (const doc of snapshot.docs) {
      await quizzesRef.doc(doc.id).delete();
      deleted++;
      console.log(`✅ Deleted: ${doc.data().title || doc.id}`);
    }
    
    console.log(`\n🎉 Successfully deleted ${deleted} quizzes!`);
    console.log('📝 You can now add new quizzes through the Admin Dashboard at /admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting quizzes:', error);
    process.exit(1);
  }
}

deleteAllQuizzes();
