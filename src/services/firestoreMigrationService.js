/**
 * Firestore Structure Migration Service
 * Handles migration from flat structure to user-centric nested structure
 * Implements dual-read strategy for backward compatibility
 * 
 * @module services/firestoreMigrationService
 */

import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  writeBatch,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Migration Configuration
 * Defines which collections should be nested and their mapping
 */
const MIGRATION_CONFIG = {
  quizProgress: {
    oldPath: 'user_quiz_progress',
    newPath: (userId) => `users/${userId}/quiz_progress`,
    nesting: true,
    allowDualRead: true,
  },
  puzzleProgress: {
    oldPath: 'user_puzzle_progress',
    newPath: (userId) => `users/${userId}/puzzle_progress`,
    nesting: true,
    allowDualRead: true,
  },
  storyProgress: {
    oldPath: 'user_story_progress',
    newPath: (userId) => `users/${userId}/story_progress`,
    nesting: true,
    allowDualRead: true,
  },
  achievements: {
    oldPath: 'user_achievements',
    newPath: (userId) => `users/${userId}/achievements`,
    nesting: true,
    allowDualRead: true,
  },
  monetization: {
    oldPath: 'user_monetization',
    newPath: (userId) => `users/${userId}/monetization`,
    nesting: true,
    allowDualRead: true,
  },
  profile: {
    oldPath: 'user_profiles',
    newPath: (userId) => `users/${userId}`,
    nesting: true,
    allowDualRead: false, // Merge into users document
  },
};

/**
 * Dual-read wrapper: tries new location first, falls back to old location
 * @param {string} userId - User ID
 * @param {string} configKey - Migration config key
 * @param {string} docId - Document ID to read
 * @returns {Promise<*>} Document data or null
 */
export async function dualRead(userId, configKey, docId) {
  const config = MIGRATION_CONFIG[configKey];
  if (!config) {
    throw new Error(`Unknown migration config: ${configKey}`);
  }

  try {
    // Try new location first
    const newPath = config.newPath(userId);
    const newDocRef = doc(db, newPath, docId);
    const newSnap = await getDoc(newDocRef);

    if (newSnap.exists()) {
      return { data: newSnap.data(), source: 'new', id: newSnap.id };
    }
  } catch (e) {
    console.warn(`[Migration] Error reading from new location: ${e.message}`);
  }

  // Fall back to old location if allowed
  if (config.allowDualRead) {
    try {
      const oldPath = config.oldPath;
      const compositeId = `${userId}_${docId}`;
      const oldDocRef = doc(db, oldPath, compositeId);
      const oldSnap = await getDoc(oldDocRef);

      if (oldSnap.exists()) {
        return { data: oldSnap.data(), source: 'old', id: oldSnap.id };
      }
    } catch (e) {
      console.warn(`[Migration] Error reading from old location: ${e.message}`);
    }
  }

  return null;
}

/**
 * Dual-read for collections (queries)
 * @param {string} userId - User ID
 * @param {string} configKey - Migration config key
 * @returns {Promise<Array>} Array of documents
 */
export async function dualReadCollection(userId, configKey) {
  const config = MIGRATION_CONFIG[configKey];
  if (!config) {
    throw new Error(`Unknown migration config: ${configKey}`);
  }

  const results = new Map();

  // Try new location first
  try {
    const newPath = config.newPath(userId);
    const collectionRef = collection(db, newPath);
    const snapshot = await getDocs(collectionRef);

    snapshot.docs.forEach(doc => {
      results.set(doc.id, { data: doc.data(), source: 'new', id: doc.id });
    });

    if (results.size > 0) {
      return Array.from(results.values());
    }
  } catch (e) {
    console.warn(`[Migration] Error reading collection from new location: ${e.message}`);
  }

  // Fall back to old location if allowed
  if (config.allowDualRead) {
    try {
      const oldPath = config.oldPath;
      const collectionRef = collection(db, oldPath);
      const q = query(collectionRef, where('userId', '==', userId));
      const snapshot = await getDocs(q);

      snapshot.docs.forEach(doc => {
        if (!results.has(doc.id)) {
          results.set(doc.id, { data: doc.data(), source: 'old', id: doc.id });
        }
      });
    } catch (e) {
      console.warn(`[Migration] Error reading collection from old location: ${e.message}`);
    }
  }

  return Array.from(results.values());
}

/**
 * Migrate single user's data to new nested structure
 * @param {string} userId - User ID to migrate
 * @param {Array<string>} configKeys - Which collections to migrate
 * @returns {Promise<object>} Migration result
 */
export async function migrateUserData(userId, configKeys = Object.keys(MIGRATION_CONFIG)) {
  const batch = writeBatch(db);
  let migratedCount = 0;
  const errors = [];

  for (const configKey of configKeys) {
    const config = MIGRATION_CONFIG[configKey];

    try {
      const oldPath = config.oldPath;
      const collectionRef = collection(db, oldPath);

      // Get all documents for this user
      let q = query(collectionRef, where('userId', '==', userId));
      if (configKey === 'profile') {
        // Special case: profile is direct lookup
        q = query(collectionRef); // Get all profiles
      }

      const snapshot = await getDocs(q);

      for (const doc of snapshot.docs) {
        const docId = configKey === 'profile' 
          ? userId 
          : doc.id.replace(`${userId}_`, '');
        
        const newPath = config.newPath(userId);
        const newDocRef = doc(db, newPath, docId);

        batch.set(newDocRef, doc.data());
        migratedCount++;
      }
    } catch (e) {
      errors.push({
        configKey,
        error: e.message
      });
      console.warn(`[Migration] Error migrating ${configKey}: ${e.message}`);
    }
  }

  try {
    await batch.commit();
  } catch (e) {
    return {
      success: false,
      userId,
      migratedCount,
      errors: [...errors, { batch: e.message }]
    };
  }

  return {
    success: true,
    userId,
    migratedCount,
    errors
  };
}

/**
 * Get migration status for user
 * @param {string} userId - User ID
 * @returns {Promise<object>} Migration status
 */
export async function getMigrationStatus(userId) {
  const status = {
    userId,
    collections: {},
    fullyMigrated: true,
  };

  for (const [key, config] of Object.entries(MIGRATION_CONFIG)) {
    const newPath = config.newPath(userId);
    const oldPath = config.oldPath;

    try {
      // Check new location
      const newCollectionRef = collection(db, newPath);
      const newSnapshot = await getDocs(newCollectionRef);
      const newCount = newSnapshot.size;

      // Check old location
      let oldCount = 0;
      if (config.allowDualRead) {
        const oldCollectionRef = collection(db, oldPath);
        const q = query(oldCollectionRef, where('userId', '==', userId));
        const oldSnapshot = await getDocs(q);
        oldCount = oldSnapshot.size;
      }

      status.collections[key] = {
        newLocation: newCount,
        oldLocation: oldCount,
        migrated: newCount > 0 && oldCount === 0,
        inProgress: newCount > 0 && oldCount > 0,
      };

      if (!status.collections[key].migrated) {
        status.fullyMigrated = false;
      }
    } catch (e) {
      status.collections[key] = {
        error: e.message
      };
    }
  }

  return status;
}

/**
 * Verify migration integrity (compare old vs new data)
 * @param {string} userId - User ID
 * @param {string} configKey - Collection to verify
 * @returns {Promise<object>} Verification results
 */
export async function verifyMigration(userId, configKey) {
  const config = MIGRATION_CONFIG[configKey];
  if (!config) {
    throw new Error(`Unknown migration config: ${configKey}`);
  }

  const results = {
    configKey,
    userId,
    passed: true,
    issues: []
  };

  try {
    // Get data from both locations
    const newPath = config.newPath(userId);
    const oldPath = config.oldPath;

    const newSnapshot = await getDocs(collection(db, newPath));
    const oldSnapshot = await getDocs(
      query(collection(db, oldPath), where('userId', '==', userId))
    );

    const newIds = new Set(newSnapshot.docs.map(d => d.id));
    const oldIds = new Set(oldSnapshot.docs.map(d => {
      const id = d.id.replace(`${userId}_`, '');
      return id;
    }));

    // Check for missing documents
    oldIds.forEach(id => {
      if (!newIds.has(id)) {
        results.issues.push({
          type: 'missing_in_new',
          id,
          message: `Document ${id} not migrated to new location`
        });
        results.passed = false;
      }
    });

    // Check for extra documents
    newIds.forEach(id => {
      if (!oldIds.has(id)) {
        results.issues.push({
          type: 'extra_in_new',
          id,
          message: `Extra document ${id} in new location`
        });
      }
    });
  } catch (e) {
    results.issues.push({
      type: 'verification_error',
      error: e.message
    });
    results.passed = false;
  }

  return results;
}

/**
 * Archive old collection (backup before deletion)
 * @param {string} collectionPath - Path to archive
 * @returns {Promise<object>} Archive result
 */
export async function archiveCollection(collectionPath) {
  const timestamp = new Date().toISOString();
  const archiveId = `${collectionPath}_backup_${timestamp}`;

  try {
    const collectionRef = collection(db, collectionPath);
    const snapshot = await getDocs(collectionRef);

    const archiveRef = doc(db, 'archived_collections', archiveId);
    const docs = snapshot.docs.map(d => ({
      id: d.id,
      data: d.data()
    }));

    await setDoc(archiveRef, {
      originalPath: collectionPath,
      documentCount: docs.length,
      archivedAt: new Date(),
      documents: docs
    });

    return {
      success: true,
      archiveId,
      documentCount: docs.length
    };
  } catch (e) {
    return {
      success: false,
      collectionPath,
      error: e.message
    };
  }
}

/**
 * Get migration recommendations for user
 * @param {string} userId - User ID
 * @returns {Promise<object>} Recommendations
 */
export async function getMigrationRecommendations(userId) {
  const status = await getMigrationStatus(userId);
  const recommendations = {
    userId,
    highPriority: [],
    medium: [],
    low: [],
    isReadyForMigration: true
  };

  for (const [key, info] of Object.entries(status.collections)) {
    if (info.error) {
      recommendations.highPriority.push({
        collection: key,
        issue: info.error,
        action: 'Investigate and resolve error'
      });
      recommendations.isReadyForMigration = false;
    } else if (!info.migrated && info.oldLocation > 0) {
      recommendations.medium.push({
        collection: key,
        count: info.oldLocation,
        action: `Migrate ${info.oldLocation} documents`
      });
    }
  }

  return recommendations;
}

export default {
  dualRead,
  dualReadCollection,
  migrateUserData,
  getMigrationStatus,
  verifyMigration,
  archiveCollection,
  getMigrationRecommendations,
  MIGRATION_CONFIG
};
