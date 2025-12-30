/**
 * updateNumbersPuzzle.mjs
 * Updates the Numbers ordering puzzle to support ranges 1-50 with 10 cards each
 * 
 * Usage: node updateNumbersPuzzle.mjs
 */

import admin from 'firebase-admin';
import serviceAccount from '../firebase-service-account.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updateNumbersPuzzle() {
  try {
    console.log('🔍 Finding Numbers ordering puzzle...');
    
    // Find the Numbers ordering puzzle
    const puzzlesSnap = await db.collection('puzzles')
      .where('subtopicId', '==', 'ordering-numbers')
      .where('type', '==', 'ordering')
      .get();
    
    if (puzzlesSnap.empty) {
      console.log('❌ No Numbers ordering puzzle found');
      return;
    }
    
    const puzzleDoc = puzzlesSnap.docs[0];
    const puzzleId = puzzleDoc.id;
    console.log(`✅ Found puzzle: ${puzzleId}`);
    
    // Generate items for numbers 1-50
    const items = [];
    for (let i = 1; i <= 50; i++) {
      items.push({
        id: `num-${i}`,
        label: `${i}`,
        number: i,
        image: `https://via.placeholder.com/80/0000FF/ffffff?text=${i}`,
        order: i,
      });
    }
    
    // Create range config
    const numberRanges = [
      { label: "1-10", min: 1, max: 10 },
      { label: "11-20", min: 11, max: 20 },
      { label: "21-30", min: 21, max: 30 },
      { label: "31-40", min: 31, max: 40 },
      { label: "41-50", min: 41, max: 50 }
    ];
    
    const correctOrder = Array.from({ length: 50 }, (_, i) => i + 1);
    
    // Update the puzzle
    await db.collection('puzzles').doc(puzzleId).update({
      title: 'Number Sequence 1-50',
      description: 'Arrange numbers in correct order - choose a range from 1-10, 11-20, 21-30, 31-40, or 41-50',
      'data.maxRange': 50,
      'data.numberRanges': numberRanges,
      'data.items': items,
      'data.correctOrder': correctOrder,
      updatedAt: new Date(),
    });
    
    console.log(`✅ Successfully updated puzzle ${puzzleId}`);
    console.log(`   - Added 50 number items`);
    console.log(`   - Added 5 number ranges (1-10, 11-20, 21-30, 31-40, 41-50)`);
    console.log(`   - Updated title and description`);
    
  } catch (error) {
    console.error('❌ Error updating puzzle:', error);
    process.exit(1);
  } finally {
    admin.app().delete();
  }
}

updateNumbersPuzzle();
