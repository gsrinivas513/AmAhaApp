// migrateImagesToCloudinary.js
// Run this script to migrate existing Firebase Storage images to Cloudinary

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');
const { getStorage, ref, getDownloadURL } = require('firebase/storage');
const fetch = require('node-fetch');
const FormData = require('form-data');

// Firebase config (update with your credentials)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Cloudinary config (update with your credentials)
const CLOUDINARY_CONFIG = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
  uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'YOUR_UPLOAD_PRESET',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Upload image URL to Cloudinary
async function uploadUrlToCloudinary(imageUrl, folder = 'amaha') {
  try {
    console.log(`Uploading: ${imageUrl}`);
    
    const formData = new FormData();
    formData.append('file', imageUrl);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', folder);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      url: result.secure_url,
      cloudinaryId: result.public_id,
    };
  } catch (error) {
    console.error(`Failed to upload ${imageUrl}:`, error.message);
    return null;
  }
}

// Migrate categories
async function migrateCategories() {
  console.log('\n📁 Migrating Categories...');
  
  const categoriesRef = collection(db, 'categories');
  const snapshot = await getDocs(categoriesRef);
  
  let migrated = 0;
  let skipped = 0;
  
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    
    // Skip if already has cloudinaryId or no imageUrl
    if (data.cloudinaryId || !data.imageUrl) {
      skipped++;
      continue;
    }
    
    // Upload to Cloudinary
    const result = await uploadUrlToCloudinary(data.imageUrl, 'categories');
    
    if (result) {
      // Update Firestore document
      await updateDoc(doc(db, 'categories', docSnap.id), {
        imageUrl: result.url,
        cloudinaryId: result.cloudinaryId,
        migratedAt: new Date().toISOString(),
      });
      
      console.log(`✓ Migrated: ${data.name || data.label}`);
      migrated++;
    } else {
      console.log(`✗ Failed: ${data.name || data.label}`);
    }
    
    // Rate limiting (avoid hitting Cloudinary limits)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n✅ Categories: ${migrated} migrated, ${skipped} skipped`);
}

// Migrate topics
async function migrateTopics() {
  console.log('\n📁 Migrating Topics...');
  
  const topicsRef = collection(db, 'topics');
  const snapshot = await getDocs(topicsRef);
  
  let migrated = 0;
  let skipped = 0;
  
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    
    if (data.cloudinaryId || !data.imageUrl) {
      skipped++;
      continue;
    }
    
    const result = await uploadUrlToCloudinary(data.imageUrl, 'topics');
    
    if (result) {
      await updateDoc(doc(db, 'topics', docSnap.id), {
        imageUrl: result.url,
        cloudinaryId: result.cloudinaryId,
        migratedAt: new Date().toISOString(),
      });
      
      console.log(`✓ Migrated: ${data.name || data.label}`);
      migrated++;
    } else {
      console.log(`✗ Failed: ${data.name || data.label}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n✅ Topics: ${migrated} migrated, ${skipped} skipped`);
}

// Migrate subtopics
async function migrateSubtopics() {
  console.log('\n📁 Migrating Subtopics...');
  
  const subtopicsRef = collection(db, 'subtopics');
  const snapshot = await getDocs(subtopicsRef);
  
  let migrated = 0;
  let skipped = 0;
  
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    
    if (data.cloudinaryId || !data.imageUrl) {
      skipped++;
      continue;
    }
    
    const result = await uploadUrlToCloudinary(data.imageUrl, 'subtopics');
    
    if (result) {
      await updateDoc(doc(db, 'subtopics', docSnap.id), {
        imageUrl: result.url,
        cloudinaryId: result.cloudinaryId,
        migratedAt: new Date().toISOString(),
      });
      
      console.log(`✓ Migrated: ${data.name || data.label}`);
      migrated++;
    } else {
      console.log(`✗ Failed: ${data.name || data.label}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n✅ Subtopics: ${migrated} migrated, ${skipped} skipped`);
}

// Main migration function
async function runMigration() {
  console.log('🚀 Starting Cloudinary Migration...\n');
  console.log(`Cloud Name: ${CLOUDINARY_CONFIG.cloudName}`);
  console.log(`Upload Preset: ${CLOUDINARY_CONFIG.uploadPreset}\n`);
  
  // Validate config
  if (CLOUDINARY_CONFIG.cloudName === 'YOUR_CLOUD_NAME') {
    console.error('❌ ERROR: Please update CLOUDINARY_CONFIG with your credentials');
    process.exit(1);
  }
  
  try {
    // Run migrations sequentially
    await migrateCategories();
    await migrateTopics();
    await migrateSubtopics();
    
    console.log('\n\n🎉 Migration Complete!');
    console.log('\nNext steps:');
    console.log('1. Verify images load correctly on homepage');
    console.log('2. Check Cloudinary dashboard for uploaded images');
    console.log('3. Optional: Delete old Firebase Storage images to save costs');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
