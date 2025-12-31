#!/usr/bin/env node

/**
 * Admin Enhancement Fields Migration
 * 
 * This script adds new admin enhancement fields to:
 * - features: status, visibility, featured
 * - categories: status, visibility, featured, showInHome
 * - topics: status, visibility, featured
 * - subtopics: status, visibility, featured
 * 
 * Run from terminal:
 * node scripts/migrateAdminEnhancementFields.js
 */

const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  writeBatch, 
  serverTimestamp,
  updateDoc,
  doc
} = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY",
  authDomain: "amahaapp.firebaseapp.com",
  projectId: "amahaapp",
  storageBucket: "amahaapp.firebasestorage.app",
  messagingSenderId: "972893258212",
  appId: "1:972893258212:web:1f9a54fa450805ab2647f1"
};

let app, db;

// Initialize Firebase
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log('✅ Firebase initialized');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  process.exit(1);
}

/**
 * Migrate Features Collection
 */
async function migrateFeatures() {
  console.log('\n🚀 Starting Features migration...');
  try {
    const featuresRef = collection(db, 'features');
    const snapshot = await getDocs(featuresRef);
    
    const batch = writeBatch(db);
    let updatedCount = 0;
    let skippedCount = 0;
    
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      
      // Only update if fields don't exist
      if (!data.status || !data.visibility) {
        batch.update(docSnap.ref, {
          status: data.status || 'published',
          visibility: data.visibility || 'public',
          featured: data.featured || false,
          updatedAt: new Date().toISOString(),
        });
        updatedCount++;
      } else {
        skippedCount++;
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Features: Updated ${updatedCount} documents, Skipped ${skippedCount}`);
    } else {
      console.log(`ℹ️  Features: All ${skippedCount} documents already have new fields`);
    }
    
    return { success: true, updatedCount, skippedCount, total: snapshot.size };
  } catch (error) {
    console.error('❌ Features migration failed:', error);
    throw error;
  }
}

/**
 * Migrate Categories Collection
 */
async function migrateCategories() {
  console.log('\n🚀 Starting Categories migration...');
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    const batch = writeBatch(db);
    let updatedCount = 0;
    let skippedCount = 0;
    
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      
      // Only update if fields don't exist
      if (!data.status || !data.visibility) {
        batch.update(docSnap.ref, {
          status: data.status || 'published',
          visibility: data.visibility || 'public',
          featured: data.featured || false,
          showInHome: data.showInHome !== false ? true : data.showInHome,
          updatedAt: new Date().toISOString(),
        });
        updatedCount++;
      } else {
        skippedCount++;
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Categories: Updated ${updatedCount} documents, Skipped ${skippedCount}`);
    } else {
      console.log(`ℹ️  Categories: All ${skippedCount} documents already have new fields`);
    }
    
    return { success: true, updatedCount, skippedCount, total: snapshot.size };
  } catch (error) {
    console.error('❌ Categories migration failed:', error);
    throw error;
  }
}

/**
 * Migrate Topics Collection
 */
async function migrateTopics() {
  console.log('\n🚀 Starting Topics migration...');
  try {
    const topicsRef = collection(db, 'topics');
    const snapshot = await getDocs(topicsRef);
    
    const batch = writeBatch(db);
    let updatedCount = 0;
    let skippedCount = 0;
    
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      
      // Only update if fields don't exist
      if (!data.status || !data.visibility) {
        batch.update(docSnap.ref, {
          status: data.status || 'published',
          visibility: data.visibility || 'public',
          featured: data.featured || false,
          updatedAt: new Date().toISOString(),
        });
        updatedCount++;
      } else {
        skippedCount++;
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Topics: Updated ${updatedCount} documents, Skipped ${skippedCount}`);
    } else {
      console.log(`ℹ️  Topics: All ${skippedCount} documents already have new fields`);
    }
    
    return { success: true, updatedCount, skippedCount, total: snapshot.size };
  } catch (error) {
    console.error('❌ Topics migration failed:', error);
    throw error;
  }
}

/**
 * Migrate Subtopics Collection
 */
async function migrateSubtopics() {
  console.log('\n🚀 Starting Subtopics migration...');
  try {
    const subtopicsRef = collection(db, 'subtopics');
    const snapshot = await getDocs(subtopicsRef);
    
    const batch = writeBatch(db);
    let updatedCount = 0;
    let skippedCount = 0;
    
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      
      // Only update if fields don't exist
      if (!data.status || !data.visibility) {
        batch.update(docSnap.ref, {
          status: data.status || 'published',
          visibility: data.visibility || 'public',
          featured: data.featured || false,
          updatedAt: new Date().toISOString(),
        });
        updatedCount++;
      } else {
        skippedCount++;
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Subtopics: Updated ${updatedCount} documents, Skipped ${skippedCount}`);
    } else {
      console.log(`ℹ️  Subtopics: All ${skippedCount} documents already have new fields`);
    }
    
    return { success: true, updatedCount, skippedCount, total: snapshot.size };
  } catch (error) {
    console.error('❌ Subtopics migration failed:', error);
    throw error;
  }
}

/**
 * Verify Migration
 */
async function verifyMigration() {
  console.log('\n📋 Verifying migration...');
  try {
    const collections = ['features', 'categories', 'topics', 'subtopics'];
    const results = {};
    
    for (const collName of collections) {
      const collRef = collection(db, collName);
      const snapshot = await getDocs(collRef);
      
      let withNewFields = 0;
      let withoutNewFields = 0;
      const sampleMissing = [];
      
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.status && data.visibility) {
          withNewFields++;
        } else {
          withoutNewFields++;
          if (sampleMissing.length < 3) {
            sampleMissing.push({
              id: docSnap.id,
              hasStatus: !!data.status,
              hasVisibility: !!data.visibility,
              hasFeatured: !!data.featured,
            });
          }
        }
      });
      
      results[collName] = {
        total: snapshot.size,
        withNewFields,
        withoutNewFields,
        complete: withoutNewFields === 0,
        sampleMissing,
      };
    }
    
    console.log('\n📊 Verification Results:');
    console.log('═'.repeat(60));
    
    let allComplete = true;
    Object.entries(results).forEach(([collName, result]) => {
      const status = result.complete ? '✅' : '⚠️ ';
      console.log(`${status} ${collName.toUpperCase()}`);
      console.log(`   Total: ${result.total} | With new fields: ${result.withNewFields} | Missing: ${result.withoutNewFields}`);
      
      if (result.sampleMissing.length > 0) {
        console.log(`   Sample documents missing fields:`);
        result.sampleMissing.forEach(doc => {
          console.log(`     - ${doc.id}: status=${doc.hasStatus}, visibility=${doc.hasVisibility}, featured=${doc.hasFeatured}`);
        });
        allComplete = false;
      }
    });
    
    console.log('═'.repeat(60));
    return allComplete;
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  }
}

/**
 * Main Migration Runner
 */
async function runMigration() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  Admin Enhancement Fields Database Migration          ║');
  console.log('║  Migration started at:', new Date().toLocaleString().padEnd(29) + '║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  try {
    const startTime = Date.now();
    
    const results = {
      features: await migrateFeatures(),
      categories: await migrateCategories(),
      topics: await migrateTopics(),
      subtopics: await migrateSubtopics(),
    };
    
    // Verify the migration
    const verified = await verifyMigration();
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║  Migration Summary                                     ║');
    console.log('╠════════════════════════════════════════════════════════╣');
    
    let totalUpdated = 0;
    Object.entries(results).forEach(([coll, result]) => {
      console.log(`║ ${coll.padEnd(15)} | Updated: ${result.updatedCount.toString().padStart(4)} | Total: ${result.total.toString().padStart(4)} ║`);
      totalUpdated += result.updatedCount;
    });
    
    console.log('╠════════════════════════════════════════════════════════╣');
    console.log(`║ Total Updated: ${totalUpdated.toString().padEnd(42)} ║`);
    console.log(`║ Duration: ${duration}s ${' '.repeat(45 - duration.length)} ║`);
    console.log(`║ Status: ${(verified ? '✅ ALL VERIFIED' : '⚠️  NEEDS REVIEW').padEnd(50)} ║`);
    console.log('╚════════════════════════════════════════════════════════╝');
    
    process.exit(verified ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.log('\n📚 Troubleshooting:');
    console.log('1. Check Firebase connection');
    console.log('2. Verify .env variables are set');
    console.log('3. Check Firestore permissions');
    console.log('4. Review error message above');
    process.exit(1);
  }
}

// Run migration
runMigration();
