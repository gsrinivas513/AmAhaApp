#!/usr/bin/env node

import admin from 'firebase-admin';
import fs from 'fs';

// Initialize Firebase Admin
const serviceAccountPath = process.env.FIREBASE_KEY_PATH || './src/firebase/serviceAccountKey.json';

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Firebase service account key not found at:', serviceAccountPath);
  console.error('Make sure FIREBASE_KEY_PATH is set or place serviceAccountKey.json in src/firebase/');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-project.firebaseio.com'
});

const db = admin.firestore();

async function fixPuzzleTypes() {
  try {
    console.log('🔍 Searching for puzzles with type: "puzzle"...');
    
    // Query all puzzles with type "puzzle"
    const snapshot = await db.collection('puzzles').where('type', '==', 'puzzle').get();
    
    console.log(`Found ${snapshot.docs.length} puzzles with type: "puzzle"`);
    
    if (snapshot.docs.length === 0) {
      console.log('✅ No puzzles to fix!');
      process.exit(0);
    }
    
    // Update each one
    let updated = 0;
    for (const puzzleDoc of snapshot.docs) {
      const puzzleData = puzzleDoc.data();
      console.log(`Updating: ${puzzleDoc.id} (${puzzleData.title})`);
      
      await db.collection('puzzles').doc(puzzleDoc.id).update({
        type: 'find-pair'
      });
      
      updated++;
      console.log(`✅ Updated: ${puzzleDoc.id}`);
    }
    
    console.log(`\n✅ Successfully updated ${updated} puzzle(s)!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixPuzzleTypes();
