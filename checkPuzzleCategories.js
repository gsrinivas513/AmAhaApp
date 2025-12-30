const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkCategories() {
  console.log('\n=== CHECKING PUZZLE CATEGORIES ===\n');
  
  // Check all categories
  const categoriesSnap = await db.collection('categories').get();
  console.log(`Total categories in collection: ${categoriesSnap.size}`);
  
  categoriesSnap.forEach(doc => {
    const data = doc.data();
    console.log(`\nDoc ID: ${doc.id}`);
    console.log(`  featureId: ${data.featureId}`);
    console.log(`  featureType: ${data.featureType}`);
    console.log(`  uiMode: ${data.uiMode}`);
    console.log(`  type: ${data.type}`);
    console.log(`  name: ${data.name}`);
    console.log(`  label: ${data.label}`);
    console.log(`  isPublished: ${data.isPublished}`);
  });

  // Now specifically check for puzzle categories
  console.log('\n\n=== PUZZLE-RELATED CATEGORIES ===');
  const puzzleQuery = await db.collection('categories')
    .where('featureId', '==', 'puzzles')
    .get();
  console.log(`Categories with featureId='puzzles': ${puzzleQuery.size}`);
  
  const puzzleUiMode = await db.collection('categories')
    .where('uiMode', '==', 'puzzle')
    .get();
  console.log(`Categories with uiMode='puzzle': ${puzzleUiMode.size}`);

  process.exit(0);
}

checkCategories().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
