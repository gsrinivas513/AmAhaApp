const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.join(__dirname, '../firebase-key.json');
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const db = admin.firestore();

async function checkFeatures() {
  console.log('🔍 Checking Features in Firestore...\n');
  
  try {
    const snap = await db.collection('features').get();
    console.log(`Total features found: ${snap.size}\n`);
    
    snap.docs.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`  featureId: ${data.featureId || 'MISSING'}`);
      console.log(`  featureType: ${data.featureType || 'MISSING'}`);
      console.log(`  type: ${data.type || 'MISSING'}`);
      console.log(`  name: ${data.name || data.label || 'MISSING'}`);
      console.log(`  icon: ${data.icon || 'MISSING'}`);
      console.log(`  isPublished: ${data.isPublished || 'MISSING'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

checkFeatures();
