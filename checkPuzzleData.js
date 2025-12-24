// Quick check script - run in browser console or Node
const admin = require('firebase-admin');
const serviceAccount = require('./firebaseAdminKey.json');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

async function checkData() {
  console.log("🔍 Checking Puzzle Data...\n");
  
  // Check features
  const featuresSnap = await db.collection('features').get();
  console.log("📦 FEATURES:");
  featuresSnap.forEach(doc => {
    const data = doc.data();
    if (data.featureType === 'puzzle') {
      console.log(`  ✅ ${doc.id}: ${data.featureName} (${data.featureType})`);
    }
  });
  
  // Check categories
  const categoriesSnap = await db.collection('categories').get();
  console.log("\n📁 CATEGORIES:");
  let puzzleCats = 0;
  categoriesSnap.forEach(doc => {
    const data = doc.data();
    if (data.featureType === 'puzzle' || data.categoryName?.includes('Puzzle')) {
      console.log(`  ✅ ${doc.id}: ${data.categoryName} (${data.featureType || 'N/A'})`);
      puzzleCats++;
    }
  });
  
  // Check topics
  const topicsSnap = await db.collection('topics').get();
  console.log("\n🎯 TOPICS:");
  let puzzleTopics = 0;
  topicsSnap.forEach(doc => {
    const data = doc.data();
    if (data.categoryName?.includes('Puzzle')) {
      console.log(`  ✅ ${doc.id}: ${data.topicName} (${data.categoryName})`);
      puzzleTopics++;
    }
  });
  
  console.log("\n📊 SUMMARY:");
  console.log(`  Puzzle Categories: ${puzzleCats}`);
  console.log(`  Puzzle Topics: ${puzzleTopics}`);
  
  process.exit(0);
}

checkData().catch(console.error);
