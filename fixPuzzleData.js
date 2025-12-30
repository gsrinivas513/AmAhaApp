// Direct fix script using Firebase Admin with environment-based initialization
const admin = require('firebase-admin');

// Initialize with environment variables (from Firebase project)
admin.initializeApp();

const db = admin.firestore();

async function fixPuzzleData() {
  try {
    console.log('🔧 Fixing puzzle subtopic data...\n');

    // 1. Fix Animals subtopic - add featureId
    console.log('1️⃣  Fixing Animals subtopic...');
    const animalsSnap = await db.collection('subtopics').where('name', '==', 'Animals').get();
    if (!animalsSnap.empty) {
      const animalDoc = animalsSnap.docs[0];
      const animalData = animalDoc.data();
      
      const updates = {};
      if (!animalData.featureId) {
        updates.featureId = 'puzzles';
      }
      
      if (Object.keys(updates).length > 0) {
        await db.collection('subtopics').doc(animalDoc.id).update(updates);
        console.log('   ✅ Added featureId: puzzles');
      } else {
        console.log('   ⏭️  Already has featureId');
      }
    } else {
      console.log('   ❌ Animals subtopic not found');
    }

    // 2. Fix find-pairs topic - add featureId
    console.log('\n2️⃣  Fixing find-pairs topic...');
    const topicDoc = await db.collection('topics').doc('find-pairs').get();
    if (topicDoc.exists) {
      const topicData = topicDoc.data();
      
      if (!topicData.featureId) {
        await topicDoc.ref.update({ featureId: 'puzzles' });
        console.log('   ✅ Added featureId: puzzles to find-pairs topic');
      } else {
        console.log(`   ℹ️  Already has featureId: ${topicData.featureId}`);
      }
    } else {
      console.log('   ❌ find-pairs topic not found');
    }

    // 3. Also fix Colors and Objects subtopics if they exist
    console.log('\n3️⃣  Fixing Colors subtopic...');
    const colorsSnap = await db.collection('subtopics').where('name', '==', 'Colors').get();
    if (!colorsSnap.empty) {
      const colorDoc = colorsSnap.docs[0];
      const colorData = colorDoc.data();
      
      if (!colorData.featureId) {
        await db.collection('subtopics').doc(colorDoc.id).update({ featureId: 'puzzles' });
        console.log('   ✅ Added featureId: puzzles');
      } else {
        console.log('   ⏭️  Already has featureId');
      }
    } else {
      console.log('   ❌ Colors subtopic not found');
    }

    console.log('\n4️⃣  Fixing Objects subtopic...');
    const objectsSnap = await db.collection('subtopics').where('name', '==', 'Objects').get();
    if (!objectsSnap.empty) {
      const objectDoc = objectsSnap.docs[0];
      const objectData = objectDoc.data();
      
      if (!objectData.featureId) {
        await db.collection('subtopics').doc(objectDoc.id).update({ featureId: 'puzzles' });
        console.log('   ✅ Added featureId: puzzles');
      } else {
        console.log('   ⏭️  Already has featureId');
      }
    } else {
      console.log('   ❌ Objects subtopic not found');
    }

    console.log('\n✅ Puzzle data fixed!');
    console.log('\n📋 Changes made:');
    console.log('   - Added featureId: "puzzles" to puzzle subtopics');
    console.log('   - Added featureId: "puzzles" to find-pairs topic');
    console.log('\n🔄 Refresh the admin page to see the changes.');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixPuzzleData();
