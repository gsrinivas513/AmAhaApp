// Script to inspect and fix subtopics - ensure they have topicId and categoryId
// Run this to debug why subtopics are showing "Unknown Topic"

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccountKey = require('./firebaseKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const db = admin.firestore();

async function inspectSubtopics() {
  try {
    console.log('📋 Inspecting all subtopics...\n');
    
    const subtopicsRef = db.collection('subtopics');
    const snapshot = await subtopicsRef.get();

    console.log(`Found ${snapshot.docs.length} subtopics:\n`);
    
    for (const doc of snapshot.docs) {
      const sub = doc.data();
      console.log(`📄 ${sub.name || sub.label} (ID: ${doc.id})`);
      console.log(`   - topicId: ${sub.topicId || '❌ MISSING'}`);
      console.log(`   - categoryId: ${sub.categoryId || '❌ MISSING'}`);
      console.log(`   - featureId: ${sub.featureId || '❌ MISSING'}`);
      
      // If topicId exists, look up the topic
      if (sub.topicId) {
        const topicDoc = await db.collection('topics').doc(sub.topicId).get();
        if (topicDoc.exists) {
          const topic = topicDoc.data();
          console.log(`   - Topic: ${topic.label || topic.name} (${sub.topicId})`);
        } else {
          console.log(`   - Topic: NOT FOUND in database (${sub.topicId})`);
        }
      }
      console.log();
    }

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

inspectSubtopics();
