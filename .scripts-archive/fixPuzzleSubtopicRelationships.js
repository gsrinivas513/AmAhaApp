// Comprehensive script to fix puzzle subtopic relationships
// For Puzzles feature: Feature.Puzzles → Category → Topic → Subtopic

const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccountKey = require('./firebaseKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const db = admin.firestore();

async function fixPuzzleSubtopics() {
  try {
    console.log('🔧 Fixing puzzle subtopic relationships...\n');
    
    // First, get or create the Puzzles feature
    let puzzlesFeatureId = null;
    const featuresSnap = await db.collection('features').where('id', '==', 'puzzles').get();
    if (!featuresSnap.empty) {
      puzzlesFeatureId = featuresSnap.docs[0].id;
      console.log(`✅ Found Puzzles feature: ${puzzlesFeatureId}`);
    } else {
      // For safety, we won't auto-create features
      console.log(`❌ Could not find Puzzles feature. Please ensure it exists.`);
      process.exit(1);
    }

    // Get or create a default category for puzzles
    let defaultCategoryId = null;
    const categoriesSnap = await db.collection('categories')
      .where('name', '==', 'Puzzles')
      .where('featureId', '==', 'puzzles')
      .get();
    
    if (!categoriesSnap.empty) {
      defaultCategoryId = categoriesSnap.docs[0].id;
      console.log(`✅ Found Puzzles category: ${defaultCategoryId}`);
    } else {
      // Create default category
      const catRef = await db.collection('categories').add({
        name: 'Puzzles',
        label: 'Puzzles',
        icon: '🧩',
        featureId: 'puzzles',
        isPublished: true,
        createdAt: new Date().toISOString(),
      });
      defaultCategoryId = catRef.id;
      console.log(`✅ Created default Puzzles category: ${defaultCategoryId}`);
    }

    // Get or create a default topic for puzzles
    let defaultTopicId = null;
    const topicsSnap = await db.collection('topics')
      .where('name', '==', 'Memory Games')
      .where('categoryId', '==', defaultCategoryId)
      .get();
    
    if (!topicsSnap.empty) {
      defaultTopicId = topicsSnap.docs[0].id;
      console.log(`✅ Found Memory Games topic: ${defaultTopicId}`);
    } else {
      // Create default topic
      const topicRef = await db.collection('topics').add({
        name: 'Memory Games',
        label: 'Memory Games',
        icon: '🎮',
        categoryId: defaultCategoryId,
        featureId: 'puzzles',
        isPublished: true,
        createdAt: new Date().toISOString(),
      });
      defaultTopicId = topicRef.id;
      console.log(`✅ Created default Memory Games topic: ${defaultTopicId}`);
    }

    // Now find all subtopics with featureId = 'puzzles' that need fixing
    const allSubtopicsSnap = await db.collection('subtopics').get();
    
    let fixed = 0;
    let checked = 0;

    for (const doc of allSubtopicsSnap.docs) {
      const sub = doc.data();
      
      if (sub.featureId === 'puzzles') {
        checked++;
        const updates = {};

        if (!sub.topicId || sub.topicId === '') {
          updates.topicId = defaultTopicId;
          console.log(`✅ ${sub.name}: Set topicId to ${defaultTopicId}`);
        }

        if (!sub.categoryId || sub.categoryId === '') {
          updates.categoryId = defaultCategoryId;
          console.log(`✅ ${sub.name}: Set categoryId to ${defaultCategoryId}`);
        }

        if (Object.keys(updates).length > 0) {
          await db.collection('subtopics').doc(doc.id).update(updates);
          fixed++;
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`Checked: ${checked} puzzle subtopics`);
    console.log(`Fixed: ${fixed} subtopics`);
    console.log(`\n✅ Puzzle subtopic relationships fixed!`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixPuzzleSubtopics();
