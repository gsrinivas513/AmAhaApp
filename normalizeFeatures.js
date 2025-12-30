const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = require('./serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function normalizeFeatures() {
  console.log('\n🔧 NORMALIZING ALL FEATURES\n');
  
  try {
    const snap = await db.collection('features').get();
    console.log(`Found ${snap.size} features to normalize\n`);
    
    let updates = 0;
    let deletes = 0;
    
    for (const doc of snap.docs) {
      const data = doc.data();
      const docId = doc.id;
      
      console.log(`Processing: ${docId}`);
      
      // Determine the correct feature ID (use 'id' field or derive from document ID)
      let correctId = data.id || data.featureName || data.name || docId;
      correctId = (correctId || "").toLowerCase().trim();
      
      // Build normalized feature object
      const normalized = {
        id: correctId,
        name: (data.name || "").toLowerCase().trim(),
        label: data.label || "",
        displayName: data.displayName || "",
        description: data.description || "",
        icon: data.icon || "",
        featureType: data.featureType || data.type || "",
        type: data.type || data.featureType || "",
        enabled: data.enabled !== false,
        isPublished: data.isPublished !== false,
        order: typeof data.order === 'number' ? data.order : 999,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Remove old fields that shouldn't exist
      const oldFields = ['status', 'featureName'];
      
      console.log(`  Old ID: ${docId}`);
      console.log(`  New ID: ${correctId}`);
      console.log(`  Name: ${normalized.name}`);
      console.log(`  Order: ${normalized.order}`);
      
      // If document ID is not correct, delete old and create new
      if (docId !== correctId) {
        console.log(`  ⚠️  Document ID mismatch - will delete and recreate\n`);
        
        // Create new document with correct ID
        await db.collection('features').doc(correctId).set(normalized, { merge: true });
        console.log(`  ✅ Created new document: ${correctId}`);
        
        // Delete old document if different
        if (docId !== correctId) {
          await db.collection('features').doc(docId).delete();
          console.log(`  ✅ Deleted old document: ${docId}`);
          deletes++;
        }
        updates++;
      } else {
        // Just update the document to normalize fields
        await db.collection('features').doc(correctId).set(normalized, { merge: true });
        console.log(`  ✅ Updated document: ${correctId}\n`);
        updates++;
      }
    }
    
    console.log(`\n✅ Normalization complete!`);
    console.log(`   - Updated/Created: ${updates} documents`);
    console.log(`   - Deleted: ${deletes} documents\n`);
    
    // Show final state
    console.log('\n📋 FINAL STATE:\n');
    const finalSnap = await db.collection('features').get();
    finalSnap.forEach(doc => {
      const data = doc.data();
      console.log(`ID: ${doc.id}`);
      console.log(`  id: ${data.id}`);
      console.log(`  name: ${data.name}`);
      console.log(`  label: ${data.label}`);
      console.log(`  order: ${data.order}`);
      console.log(`  isPublished: ${data.isPublished}\n`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

normalizeFeatures();
