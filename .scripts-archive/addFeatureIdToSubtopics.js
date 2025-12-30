// Script to add missing featureId to existing subtopics
// This ensures subtopics have the featureId field that the UI expects

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccountKey = require('./firebaseKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const db = admin.firestore();

async function addFeatureIdToSubtopics() {
  try {
    console.log('Fetching all subtopics...');
    const subtopicsRef = db.collection('subtopics');
    const snapshot = await subtopicsRef.get();

    let updated = 0;
    let skipped = 0;

    for (const doc of snapshot.docs) {
      const subtopic = doc.data();
      
      if (!subtopic.featureId) {
        // Get parent topic to find feature
        const topicRef = db.collection('topics').doc(subtopic.topicId);
        const topicDoc = await topicRef.get();
        const topic = topicDoc.data();

        if (topic?.categoryId) {
          // Get parent category to find feature
          const categoryRef = db.collection('categories').doc(topic.categoryId);
          const categoryDoc = await categoryRef.get();
          const category = categoryDoc.data();

          if (category?.featureId) {
            // Update subtopic with featureId from its category's feature
            await db.collection('subtopics').doc(doc.id).update({
              featureId: category.featureId
            });
            console.log(`✅ Updated ${subtopic.name}: featureId = ${category.featureId}`);
            updated++;
          } else {
            console.log(`⚠️  Skipped ${subtopic.name}: Parent category has no featureId`);
            skipped++;
          }
        } else {
          console.log(`⚠️  Skipped ${subtopic.name}: Topic has no categoryId`);
          skipped++;
        }
      } else {
        console.log(`⏭️  Skipped ${subtopic.name}: Already has featureId = ${subtopic.featureId}`);
        skipped++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`Total: ${updated + skipped}`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addFeatureIdToSubtopics();
