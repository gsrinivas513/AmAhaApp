# 🔄 Firebase Schema Migration Guide

## Overview

This document provides scripts and instructions for migrating your Firebase Firestore database to support the new admin features (publish/unpublish, coming soon status, etc.).

---

## ⚠️ IMPORTANT: Backup First!

Before running any migration scripts:

1. **Export Firestore data** (Console → Settings → Manage all collections)
2. **Create a backup collection** (e.g., `quizzes_backup`)
3. **Test in a staging environment** first
4. **Have a rollback plan** ready

---

## 📋 Migration Steps

### Step 1: Add Status Fields to Quizzes

```javascript
// scripts/migrateQuizzes.js
// Run this in Firebase Cloud Functions or directly in browser console

import { db } from './firebase/firebaseConfig';
import { 
  collection, 
  getDocs, 
  writeBatch, 
  serverTimestamp 
} from 'firebase/firestore';

async function migrateQuizzesCollection() {
  console.log('🚀 Starting Quizzes migration...');
  
  try {
    const quizzesRef = collection(db, 'quizzes');
    const snapshot = await getDocs(quizzesRef);
    
    const batch = writeBatch(db);
    let updatedCount = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Only update if fields don't exist
      if (!data.visibility || !data.publishedDate) {
        batch.update(doc.ref, {
          // Status field (assume all existing quizzes are published)
          status: data.status || 'published',
          
          // Visibility field
          visibility: data.visibility || 'public',
          
          // Publication tracking
          isPublished: data.isPublished !== false,
          publishedDate: data.publishedDate || serverTimestamp(),
          scheduledPublishDate: null,
          
          // Metadata
          createdDate: data.createdDate || serverTimestamp(),
          lastModifiedDate: serverTimestamp(),
          
          // Review workflow
          reviewRequired: false,
          approvedBy: null,
          approvalDate: null,
          
          // Analytics
          metadata: {
            views: data.views || 0,
            attempts: data.attempts || 0,
            completions: data.completions || 0,
            avgScore: data.avgScore || 0,
            rating: data.rating || 0
          }
        });
        
        updatedCount++;
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully updated ${updatedCount} quizzes`);
    } else {
      console.log('ℹ️ No quizzes needed updating (already have new fields)');
    }
    
    return { success: true, updatedCount };
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

export { migrateQuizzesCollection };
```

### Step 2: Add Status Fields to Puzzles

```javascript
// scripts/migratePuzzles.js

async function migratePuzzlesCollection() {
  console.log('🚀 Starting Puzzles migration...');
  
  try {
    const puzzlesRef = collection(db, 'puzzles');
    const snapshot = await getDocs(puzzlesRef);
    
    const batch = writeBatch(db);
    let updatedCount = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      if (!data.visibility || !data.publishedDate) {
        batch.update(doc.ref, {
          status: data.status || 'published',
          visibility: data.visibility || 'public',
          isPublished: data.isPublished !== false,
          publishedDate: data.publishedDate || serverTimestamp(),
          scheduledPublishDate: null,
          createdDate: data.createdDate || serverTimestamp(),
          lastModifiedDate: serverTimestamp(),
          reviewRequired: false,
          approvedBy: null,
          approvalDate: null,
          metadata: {
            views: data.views || 0,
            attempts: data.attempts || 0,
            completions: data.completions || 0,
            avgScore: data.avgScore || 0,
            rating: data.rating || 0
          }
        });
        
        updatedCount++;
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully updated ${updatedCount} puzzles`);
    }
    
    return { success: true, updatedCount };
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

export { migratePuzzlesCollection };
```

### Step 3: Add Status Fields to Stories

```javascript
// scripts/migrateStories.js

async function migrateStoriesCollection() {
  console.log('🚀 Starting Stories migration...');
  
  try {
    const storiesRef = collection(db, 'stories');
    const snapshot = await getDocs(storiesRef);
    
    const batch = writeBatch(db);
    let updatedCount = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      if (!data.visibility || !data.publishedDate) {
        batch.update(doc.ref, {
          status: data.status || (data.published ? 'published' : 'draft'),
          visibility: data.visibility || 'public',
          isPublished: data.published !== false,
          publishedDate: data.publishedDate || serverTimestamp(),
          scheduledPublishDate: null,
          createdDate: data.createdDate || serverTimestamp(),
          lastModifiedDate: serverTimestamp(),
          reviewRequired: false,
          approvedBy: null,
          approvalDate: null,
          metadata: {
            views: data.views || 0,
            reads: data.reads || 0,
            completions: data.completions || 0,
            rating: data.rating || 0
          }
        });
        
        updatedCount++;
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully updated ${updatedCount} stories`);
    }
    
    return { success: true, updatedCount };
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

export { migrateStoriesCollection };
```

### Step 4: Add Status Fields to Categories

```javascript
// scripts/migrateCategories.js

async function migrateCategoriesCollection() {
  console.log('🚀 Starting Categories migration...');
  
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    const batch = writeBatch(db);
    let updatedCount = 0;
    
    snapshot.forEach((doc, index) => {
      const data = doc.data();
      
      if (!data.visibility || !data.displayOrder) {
        batch.update(doc.ref, {
          // Visibility
          visibility: data.visibility || 'public',
          isPublished: data.isPublished !== false,
          
          // Display
          displayOrder: data.displayOrder || index,
          showInHome: data.showInHome !== false,
          featured: data.featured || false,
          
          // Metadata
          totalItems: data.quizCount || data.puzzleCount || 0,
          createdDate: data.createdDate || serverTimestamp(),
          lastModifiedDate: serverTimestamp(),
          
          // Analytics
          metadata: {
            totalItems: data.quizCount || data.puzzleCount || 0,
            completedItems: 0,
            popularity: data.rating || 0,
            views: 0,
            engagementRate: 0
          }
        });
        
        updatedCount++;
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully updated ${updatedCount} categories`);
    }
    
    return { success: true, updatedCount };
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

export { migrateCategoriesCollection };
```

### Step 5: Add Status Fields to Topics

```javascript
// scripts/migrateTopics.js

async function migrateTopicsCollection() {
  console.log('🚀 Starting Topics migration...');
  
  try {
    const topicsRef = collection(db, 'topics');
    const snapshot = await getDocs(topicsRef);
    
    const batch = writeBatch(db);
    let updatedCount = 0;
    
    snapshot.forEach((doc, index) => {
      const data = doc.data();
      
      if (!data.visibility || !data.displayOrder) {
        batch.update(doc.ref, {
          visibility: data.visibility || 'public',
          isPublished: data.isPublished !== false,
          displayOrder: data.displayOrder || index,
          createdDate: data.createdDate || serverTimestamp(),
          lastModifiedDate: serverTimestamp()
        });
        
        updatedCount++;
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully updated ${updatedCount} topics`);
    }
    
    return { success: true, updatedCount };
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

export { migrateTopicsCollection };
```

### Step 6: Add Status Fields to Subtopics

```javascript
// scripts/migrateSubtopics.js

async function migrateSubtopicsCollection() {
  console.log('🚀 Starting Subtopics migration...');
  
  try {
    const subtopicsRef = collection(db, 'subtopics');
    const snapshot = await getDocs(subtopicsRef);
    
    const batch = writeBatch(db);
    let updatedCount = 0;
    
    snapshot.forEach((doc, index) => {
      const data = doc.data();
      
      if (!data.visibility || !data.displayOrder) {
        batch.update(doc.ref, {
          visibility: data.visibility || 'public',
          isPublished: data.isPublished !== false,
          displayOrder: data.displayOrder || index,
          createdDate: data.createdDate || serverTimestamp(),
          lastModifiedDate: serverTimestamp()
        });
        
        updatedCount++;
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully updated ${updatedCount} subtopics`);
    }
    
    return { success: true, updatedCount };
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

export { migrateSubtopicsCollection };
```

---

## 🔨 Master Migration Script

```javascript
// scripts/runAllMigrations.js
// Run this to execute all migrations in sequence

import { migrateQuizzesCollection } from './migrateQuizzes';
import { migratePuzzlesCollection } from './migratePuzzles';
import { migrateStoriesCollection } from './migrateStories';
import { migrateCategoriesCollection } from './migrateCategories';
import { migrateTopicsCollection } from './migrateTopics';
import { migrateSubtopicsCollection } from './migrateSubtopics';

async function runAllMigrations() {
  console.log('🚀 Starting comprehensive Firebase migration...');
  console.log('⏱️ This may take several minutes depending on data size');
  console.log('');
  
  const startTime = Date.now();
  const results = [];
  
  try {
    // Run migrations in sequence (not parallel to avoid conflicts)
    console.log('Step 1/6: Migrating quizzes...');
    const quizzesResult = await migrateQuizzesCollection();
    results.push({ collection: 'quizzes', ...quizzesResult });
    
    console.log('Step 2/6: Migrating puzzles...');
    const puzzlesResult = await migratePuzzlesCollection();
    results.push({ collection: 'puzzles', ...puzzlesResult });
    
    console.log('Step 3/6: Migrating stories...');
    const storiesResult = await migrateStoriesCollection();
    results.push({ collection: 'stories', ...storiesResult });
    
    console.log('Step 4/6: Migrating categories...');
    const categoriesResult = await migrateCategoriesCollection();
    results.push({ collection: 'categories', ...categoriesResult });
    
    console.log('Step 5/6: Migrating topics...');
    const topicsResult = await migrateTopicsCollection();
    results.push({ collection: 'topics', ...topicsResult });
    
    console.log('Step 6/6: Migrating subtopics...');
    const subtopicsResult = await migrateSubtopicsCollection();
    results.push({ collection: 'subtopics', ...subtopicsResult });
    
    const duration = Date.now() - startTime;
    
    console.log('');
    console.log('✅ MIGRATION COMPLETE!');
    console.log(`⏱️ Duration: ${(duration / 1000).toFixed(2)} seconds`);
    console.log('');
    console.log('📊 Summary:');
    
    let totalUpdated = 0;
    results.forEach(result => {
      console.log(`  ${result.collection}: ${result.updatedCount} documents updated`);
      totalUpdated += result.updatedCount;
    });
    
    console.log(`\nTotal documents updated: ${totalUpdated}`);
    console.log('');
    console.log('✨ Database is ready for new admin features!');
    
    return { success: true, results, totalUpdated };
  } catch (error) {
    console.error('❌ MIGRATION FAILED:', error);
    console.error('');
    console.error('Please check your backup and rollback if needed.');
    throw error;
  }
}

export { runAllMigrations };
```

---

## 🚀 How to Run Migrations

### Method 1: In Browser Console (Development Only)

```javascript
// 1. Open browser DevTools (F12)
// 2. Go to Console tab
// 3. Paste and run:

import { runAllMigrations } from '/scripts/runAllMigrations.js';
await runAllMigrations();
```

### Method 2: Firebase Cloud Function (Recommended for Production)

```javascript
// functions/src/migrations/runMigrations.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.runMigrations = functions.https.onRequest(async (req, res) => {
  // Verify admin access
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const startTime = Date.now();
    
    // Run all migrations
    await migrateQuizzes();
    await migratePuzzles();
    await migrateStories();
    await migrateCategories();
    await migrateTopics();
    await migrateSubtopics();
    
    const duration = Date.now() - startTime;
    
    return res.json({
      success: true,
      message: 'All migrations completed successfully',
      duration: `${(duration / 1000).toFixed(2)}s`
    });
  } catch (error) {
    console.error('Migration error:', error);
    return res.status(500).json({
      error: 'Migration failed',
      message: error.message
    });
  }
});

async function migrateQuizzes() {
  const snapshot = await db.collection('quizzes').get();
  const batch = db.batch();
  
  snapshot.forEach(doc => {
    if (!doc.data().visibility) {
      batch.update(doc.ref, {
        status: 'published',
        visibility: 'public',
        isPublished: true,
        publishedDate: admin.firestore.FieldValue.serverTimestamp(),
        lastModifiedDate: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });
  
  await batch.commit();
}

// Similar functions for other collections...
```

---

## 🔍 Verification Script

After running migrations, verify they were successful:

```javascript
// scripts/verifyMigrations.js

async function verifyMigrations() {
  console.log('🔍 Verifying migrations...');
  console.log('');
  
  const collections = ['quizzes', 'puzzles', 'stories', 'categories', 'topics', 'subtopics'];
  
  for (const collectionName of collections) {
    const snapshot = await getDocs(collection(db, collectionName));
    let updated = 0;
    let missing = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.visibility && data.status !== undefined) {
        updated++;
      } else {
        missing++;
      }
    });
    
    console.log(`${collectionName}:`);
    console.log(`  ✅ Updated: ${updated}`);
    if (missing > 0) {
      console.log(`  ⚠️  Missing fields: ${missing}`);
    }
    console.log('');
  }
}

export { verifyMigrations };
```

---

## ⚠️ Rollback Plan

If something goes wrong:

### Option 1: Use Firestore Backup

```
Firebase Console → Firestore → Backups
→ Choose the backup from before migration
→ Restore
```

### Option 2: Manual Rollback Script

```javascript
// scripts/rollback.js

async function rollback() {
  console.log('⚠️ Starting rollback...');
  
  const collections = ['quizzes', 'puzzles', 'stories', 'categories', 'topics', 'subtopics'];
  
  for (const collectionName of collections) {
    // Delete new fields from all documents
    const snapshot = await getDocs(collection(db, collectionName));
    const batch = writeBatch(db);
    
    snapshot.forEach(doc => {
      batch.update(doc.ref, {
        visibility: deleteField(),
        status: deleteField(),
        publishedDate: deleteField(),
        lastModifiedDate: deleteField()
        // etc.
      });
    });
    
    await batch.commit();
    console.log(`✅ Rolled back ${collectionName}`);
  }
  
  console.log('✅ Rollback complete');
}

export { rollback };
```

---

## 📋 Migration Checklist

- [ ] Create Firestore backup
- [ ] Test migration in staging environment
- [ ] Review migration scripts
- [ ] Plan maintenance window (if needed)
- [ ] Run migration script
- [ ] Verify migrations completed
- [ ] Check Firestore for new fields
- [ ] Test admin panel with new features
- [ ] Monitor application for errors
- [ ] Document completion in changelog

---

**Status**: Migration Guide v1.0
**Risk Level**: Low (additive only, no destructive changes)
**Rollback Risk**: Low (can restore from backup)
**Estimated Duration**: 5-15 minutes (depending on data size)

