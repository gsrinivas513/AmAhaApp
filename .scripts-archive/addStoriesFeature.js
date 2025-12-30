/**
 * addStoriesFeature.js
 * 
 * Script to add the Stories feature to Firestore
 * This allows Stories to appear in navigation and on the home page
 * 
 * Run with: node addStoriesFeature.js
 */

const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Find Firebase service account key
const keyPaths = [
  path.join(__dirname, '../../amaha-web-firebase-key.json'),
  path.join(__dirname, '../../../amaha-web-firebase-key.json'),
];

let serviceAccountPath = null;
for (const path of keyPaths) {
  if (fs.existsSync(path)) {
    serviceAccountPath = path;
    break;
  }
}

if (!serviceAccountPath) {
  console.error('❌ Firebase service account key not found');
  console.log('Please ensure the Firebase service account JSON key exists');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function addStoriesFeature() {
  try {
    console.log('📖 Adding Stories feature to Firestore...\n');

    const storiesFeature = {
      id: 'stories',
      name: 'Stories',
      label: 'Stories',
      description: 'Interactive stories for learning and adventure',
      icon: '📖',
      featureType: 'story',
      type: 'story',
      enabled: true,
      status: 'enabled',
      isPublished: true,
      showInMenu: true,
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Set the feature (using stories as the document ID)
    await db.collection('features').doc('stories').set(storiesFeature);

    console.log('✅ Stories feature created successfully!\n');
    console.log('Feature details:');
    console.log(JSON.stringify(storiesFeature, null, 2));
    console.log('\n✅ Stories will now appear in:');
    console.log('  - Home page navigation');
    console.log('  - Top navigation bar');
    console.log('  - Mobile menu');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addStoriesFeature().then(() => {
  console.log('\n✅ Complete!');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
