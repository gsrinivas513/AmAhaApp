// Script to fix subtopics by adding missing topicId, categoryId, and featureId
// This assumes subtopics should be mapped to their parent category's feature

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccountKey = require('./firebaseKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const db = admin.firestore();

async function fixSubtopics() {
  try {
    console.log('🔧 Fixing subtopics...\n');
    
    const subtopicsRef = db.collection('subtopics');
    const snapshot = await subtopicsRef.get();

    const fixed = [];
    const skipped = [];
    
    for (const doc of snapshot.docs) {
      const sub = doc.data();
      const updates = {};
      let needsUpdate = false;

      // If missing topicId, try to find a suitable topic
      if (!sub.topicId && sub.categoryId) {
        // Get the category to understand which feature this belongs to
        const catDoc = await db.collection('categories').doc(sub.categoryId).get();
        if (catDoc.exists) {
          const cat = catDoc.data();
          // Find a topic in this category that has the same featureId
          const topicsSnap = await db.collection('topics')
            .where('categoryId', '==', sub.categoryId)
            .limit(1)
            .get();
          
          if (!topicsSnap.empty) {
            const firstTopic = topicsSnap.docs[0];
            updates.topicId = firstTopic.id;
            needsUpdate = true;
            console.log(`✅ ${sub.name}: Assigned topicId = ${firstTopic.id}`);
          } else {
            console.log(`⚠️  ${sub.name}: No topics found for categoryId ${sub.categoryId}`);
          }
        } else {
          console.log(`⚠️  ${sub.name}: Category ${sub.categoryId} not found`);
        }
      } else if (!sub.topicId && !sub.categoryId) {
        console.log(`⚠️  ${sub.name}: Missing both topicId and categoryId`);
      }

      // If missing featureId, try to get from category
      if (!sub.featureId && sub.categoryId) {
        const catDoc = await db.collection('categories').doc(sub.categoryId).get();
        if (catDoc.exists) {
          const cat = catDoc.data();
          if (cat.featureId) {
            updates.featureId = cat.featureId;
            needsUpdate = true;
            console.log(`✅ ${sub.name}: Assigned featureId = ${cat.featureId}`);
          }
        }
      } else if (!sub.featureId && sub.featureId !== "puzzles") {
        // If it looks like a puzzle subtopic (has image, no questions), mark it as puzzles
        // This is a heuristic - adjust based on your data
      }

      // Apply updates
      if (needsUpdate) {
        await db.collection('subtopics').doc(doc.id).update(updates);
        fixed.push(sub.name);
      } else if (sub.topicId && sub.featureId) {
        skipped.push(sub.name);
      } else {
        skipped.push(sub.name + ' (incomplete)');
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Fixed: ${fixed.length}`);
    if (fixed.length > 0) console.log(`   ${fixed.join(', ')}`);
    console.log(`⏭️  Already OK: ${skipped.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixSubtopics();
