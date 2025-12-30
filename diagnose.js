// Quick diagnostic script to see what's actually in the database
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function diagnose() {
  try {
    console.log('=== DIAGNOSTIC REPORT ===\n');

    // 1. Check the "find-pairs" topic
    console.log('📚 Looking for "find-pairs" topic...');
    const topicDoc = await db.collection('topics').doc('find-pairs').get();
    if (topicDoc.exists) {
      const topic = topicDoc.data();
      console.log('✅ FOUND:');
      console.log(`   - featureId: ${topic.featureId || '❌ MISSING'}`);
      console.log(`   - name: ${topic.name}`);
      console.log(`   - categoryId: ${topic.categoryId}`);
      console.log(`   - _collectionName: ${topic._collectionName || 'N/A'}\n`);
    } else {
      console.log('❌ NOT FOUND\n');
    }

    // 2. Check Animals subtopic
    console.log('📖 Looking for Animals subtopic...');
    const subtopicsSnap = await db.collection('subtopics').where('name', '==', 'Animals').get();
    if (!subtopicsSnap.empty) {
      const animals = subtopicsSnap.docs[0].data();
      console.log('✅ FOUND:');
      console.log(`   - featureId: ${animals.featureId || '❌ MISSING'}`);
      console.log(`   - topicId: ${animals.topicId}`);
      console.log(`   - categoryId: ${animals.categoryId}`);
      console.log(`   - _collectionName: ${animals._collectionName || 'N/A'}\n`);
    } else {
      console.log('❌ NOT FOUND\n');
    }

    // 3. Check Colors subtopic
    console.log('📄 Looking for Colors subtopic...');
    const colorsSnap = await db.collection('subtopics').where('name', '==', 'Colors').get();
    if (!colorsSnap.empty) {
      const colors = colorsSnap.docs[0].data();
      console.log('✅ FOUND:');
      console.log(`   - featureId: ${colors.featureId || '❌ MISSING'}`);
      console.log(`   - topicId: ${colors.topicId}`);
      console.log(`   - categoryId: ${colors.categoryId}\n`);
    } else {
      console.log('❌ NOT FOUND\n');
    }

    // 4. Check Objects subtopic
    console.log('📄 Looking for Objects subtopic...');
    const objectsSnap = await db.collection('subtopics').where('name', '==', 'Objects').get();
    if (!objectsSnap.empty) {
      const objects = objectsSnap.docs[0].data();
      console.log('✅ FOUND:');
      console.log(`   - featureId: ${objects.featureId || '❌ MISSING'}`);
      console.log(`   - topicId: ${objects.topicId}`);
      console.log(`   - categoryId: ${objects.categoryId}\n`);
    } else {
      console.log('❌ NOT FOUND\n');
    }

    // 5. List all topics with featureId puzzle or find-pairs related
    console.log('🔍 All topics in database:');
    const allTopicsSnap = await db.collection('topics').get();
    allTopicsSnap.forEach(doc => {
      const t = doc.data();
      console.log(`   - ${t.name} (${doc.id}): featureId=${t.featureId || 'undefined'}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

diagnose();
