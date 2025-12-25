/**
 * Firestore Configuration & Initialization Script
 * Run this once to setup all required collections and indexes
 */

import { db } from '../firebase/config'; // Your Firebase config
import {
  collection,
  doc,
  setDoc,
  writeBatch,
  query,
  where,
  getDocs
} from 'firebase/firestore';

/**
 * Initialize all required Firestore collections
 * Run once during deployment
 */
export async function initializeFirestore() {
  console.log('🚀 Initializing Firestore collections...');

  try {
    await createCollections();
    await createIndexes();
    await initializeAdminUser();
    console.log('✅ Firestore initialization complete!');
    return true;
  } catch (error) {
    console.error('❌ Firestore initialization failed:', error);
    return false;
  }
}

/**
 * Create all required collections
 */
async function createCollections() {
  console.log('📁 Creating collections...');

  const collections = [
    { name: 'reports', data: { type: 'daily', created: new Date() } },
    { name: 'friendships', data: { participantIds: [], status: 'active' } },
    { name: 'challenges', data: { status: 'pending', type: 'quiz' } },
    { name: 'user_cosmetics', data: { ownedCosmetics: {}, created: new Date() } },
    { name: 'limited_events', data: { active: true, created: new Date() } },
    { name: 'user_recommendations', data: { style: 'visual', created: new Date() } }
  ];

  for (const { name, data } of collections) {
    try {
      const collectionRef = collection(db, name);
      const docRef = doc(collectionRef, '_init');
      await setDoc(docRef, {
        ...data,
        _type: 'init',
        _timestamp: new Date()
      });
      console.log(`  ✓ Created collection: ${name}`);
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.error(`  ✗ Error creating ${name}:`, error);
      } else {
        console.log(`  ✓ Collection ${name} already exists`);
      }
    }
  }
}

/**
 * Create Firestore indexes (these are also created automatically by Firebase)
 */
async function createIndexes() {
  console.log('🔍 Setting up indexes...');
  console.log('  Note: Firestore will auto-create indexes when needed');
  console.log('  Or create manually in Firebase Console:');

  const indexes = [
    {
      collection: 'reports',
      fields: ['date (Asc)', 'type (Asc)'],
      type: 'Compound'
    },
    {
      collection: 'friendships',
      fields: ['userId (Asc)', 'status (Asc)'],
      type: 'Compound'
    },
    {
      collection: 'challenges',
      fields: ['from (Asc)', 'status (Asc)'],
      type: 'Compound'
    },
    {
      collection: 'limited_events',
      fields: ['active (Asc)', 'endDate (Desc)'],
      type: 'Compound'
    }
  ];

  indexes.forEach(({ collection, fields, type }) => {
    console.log(`  - ${collection}: ${fields.join(', ')} [${type}]`);
  });
}

/**
 * Initialize admin user (run once)
 */
async function initializeAdminUser() {
  console.log('👤 Initializing admin user...');
  
  // This assumes you have an admin user ID - replace with actual value
  const adminUserId = 'admin-user-id'; // Replace with actual admin UID

  try {
    const adminDocRef = doc(db, 'users', adminUserId);
    await setDoc(adminDocRef, {
      email: 'admin@amaha.com',
      displayName: 'Admin',
      role: 'admin',
      createdAt: new Date(),
      level: 99,
      totalXP: 1000000,
      friends: [],
      prestigeXP: 500000,
      prestigeLevel: 5
    }, { merge: true });

    console.log(`  ✓ Admin user initialized`);
  } catch (error) {
    console.error('  ✗ Error initializing admin:', error);
  }
}

/**
 * Initialize sample data for testing
 */
export async function initializeSampleData() {
  console.log('🎯 Creating sample data...');

  try {
    await createSampleUsers();
    await createSampleChallenges();
    await createSampleCosmetics();
    await createSampleLimitedEvents();
    console.log('✅ Sample data created!');
    return true;
  } catch (error) {
    console.error('❌ Sample data creation failed:', error);
    return false;
  }
}

/**
 * Create sample users
 */
async function createSampleUsers() {
  console.log('  Creating sample users...');

  const sampleUsers = [
    {
      id: 'user1',
      displayName: 'Alice',
      email: 'alice@example.com',
      totalXP: 5000,
      level: 8,
      friends: ['user2', 'user3'],
      prestigeXP: 10000,
      prestigeLevel: 2
    },
    {
      id: 'user2',
      displayName: 'Bob',
      email: 'bob@example.com',
      totalXP: 3500,
      level: 6,
      friends: ['user1'],
      prestigeXP: 5000,
      prestigeLevel: 1
    },
    {
      id: 'user3',
      displayName: 'Charlie',
      email: 'charlie@example.com',
      totalXP: 7200,
      level: 10,
      friends: ['user1'],
      prestigeXP: 15000,
      prestigeLevel: 2
    }
  ];

  const batch = writeBatch(db);

  sampleUsers.forEach(user => {
    const userRef = doc(db, 'users', user.id);
    batch.set(userRef, {
      ...user,
      createdAt: new Date(),
      ownedCosmetics: {
        'dark': true,
        'light': false
      }
    }, { merge: true });
  });

  await batch.commit();
  console.log(`    ✓ Created ${sampleUsers.length} sample users`);
}

/**
 * Create sample challenges
 */
async function createSampleChallenges() {
  console.log('  Creating sample challenges...');

  const sampleChallenges = [
    {
      id: 'challenge1',
      from: 'user1',
      to: 'user2',
      type: 'quiz',
      difficulty: 'hard',
      targetScore: 85,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      status: 'pending',
      createdAt: new Date()
    },
    {
      id: 'challenge2',
      from: 'user2',
      to: 'user1',
      type: 'puzzle',
      difficulty: 'medium',
      targetScore: 80,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'accepted',
      createdAt: new Date()
    }
  ];

  const batch = writeBatch(db);

  sampleChallenges.forEach(challenge => {
    const challengeRef = doc(db, 'challenges', challenge.id);
    batch.set(challengeRef, challenge);
  });

  await batch.commit();
  console.log(`    ✓ Created ${sampleChallenges.length} sample challenges`);
}

/**
 * Create sample cosmetics
 */
async function createSampleCosmetics() {
  console.log('  Creating sample cosmetics...');

  const sampleCosmetics = [
    {
      id: 'cosmetic_dark_theme',
      name: 'Dark Theme',
      type: 'theme',
      icon: '🌙',
      price: 500,
      description: 'Dark mode theme for comfortable viewing'
    },
    {
      id: 'cosmetic_light_theme',
      name: 'Light Theme',
      type: 'theme',
      icon: '☀️',
      price: 500,
      description: 'Light mode theme'
    },
    {
      id: 'cosmetic_wizard_skin',
      name: 'Wizard Skin',
      type: 'skin',
      icon: '🧙',
      price: 300,
      description: 'Transform into a mystical wizard'
    },
    {
      id: 'cosmetic_scholar_badge',
      name: 'Scholar Badge',
      type: 'badge',
      icon: '🎓',
      price: 1000,
      description: 'Rare scholar achievement badge'
    }
  ];

  const batch = writeBatch(db);

  sampleCosmetics.forEach(cosmetic => {
    const cosmeticRef = doc(db, 'cosmetics', cosmetic.id);
    batch.set(cosmeticRef, {
      ...cosmetic,
      createdAt: new Date(),
      available: true
    });
  });

  await batch.commit();
  console.log(`    ✓ Created ${sampleCosmetics.length} sample cosmetics`);
}

/**
 * Create sample limited events
 */
async function createSampleLimitedEvents() {
  console.log('  Creating sample limited events...');

  const now = new Date();
  const sampleEvents = [
    {
      id: 'event_halloween',
      name: 'Halloween Hunt',
      description: 'Complete spooky puzzles to earn rewards',
      icon: '🎃',
      startDate: new Date(now.getFullYear(), 9, 15), // Oct 15
      endDate: new Date(now.getFullYear(), 9, 31), // Oct 31
      rewards: ['pumpkin_badge', 'spooky_cosmetic', 'xp_boost'],
      active: true,
      theme: 'halloween'
    },
    {
      id: 'event_winter',
      name: 'Winter Wonderland',
      description: 'Solve winter-themed challenges',
      icon: '❄️',
      startDate: new Date(now.getFullYear(), 11, 15), // Dec 15
      endDate: new Date(now.getFullYear() + 1, 0, 5), // Jan 5
      rewards: ['snowflake_badge', 'winter_cosmetic', 'coins_boost'],
      active: false,
      theme: 'winter'
    }
  ];

  const batch = writeBatch(db);

  sampleEvents.forEach(event => {
    const eventRef = doc(db, 'limited_events', event.id);
    batch.set(eventRef, event);
  });

  await batch.commit();
  console.log(`    ✓ Created ${sampleEvents.length} sample events`);
}

/**
 * Initialize analytics data
 */
export async function initializeAnalyticsData() {
  console.log('📊 Initializing analytics data...');

  try {
    const today = new Date();
    const dailyData = {
      date: today.toISOString().split('T')[0],
      totalEvents: 1250,
      activeUsers: 340,
      eventTypes: {
        quiz_completed: 600,
        puzzle_completed: 450,
        daily_challenge_submitted: 200
      },
      userSegments: {
        veryActive: 45,
        active: 120,
        moderate: 175,
        inactive: 340
      },
      trends: {
        trending: 'up',
        momentum: 'accelerating'
      }
    };

    const reportRef = doc(db, 'reports', `daily_${today.toISOString().split('T')[0]}`);
    await setDoc(reportRef, dailyData);

    console.log('  ✓ Analytics data initialized');
    return true;
  } catch (error) {
    console.error('  ✗ Error initializing analytics:', error);
    return false;
  }
}

/**
 * Verify Firestore setup
 */
export async function verifyFirestoreSetup() {
  console.log('🔍 Verifying Firestore setup...');

  const collectionsToCheck = [
    'users',
    'reports',
    'friendships',
    'challenges',
    'user_cosmetics',
    'limited_events',
    'user_recommendations'
  ];

  let allGood = true;

  for (const collectionName of collectionsToCheck) {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef); // Simple query
      const snapshot = await getDocs(q);
      console.log(`  ✓ ${collectionName}: ${snapshot.size} documents`);
    } catch (error) {
      console.error(`  ✗ ${collectionName}: ${error.message}`);
      allGood = false;
    }
  }

  return allGood;
}

/**
 * Full setup sequence
 */
export async function setupComplete() {
  console.log('\n🎯 Starting complete AmAha Firestore setup...\n');

  const steps = [
    { name: 'Firestore Initialization', fn: initializeFirestore },
    { name: 'Sample Data', fn: initializeSampleData },
    { name: 'Analytics Data', fn: initializeAnalyticsData },
    { name: 'Verification', fn: verifyFirestoreSetup }
  ];

  let successCount = 0;

  for (const { name, fn } of steps) {
    console.log(`\n📍 ${name}:`);
    try {
      const result = await fn();
      if (result !== false) {
        successCount++;
      }
    } catch (error) {
      console.error(`  Error: ${error.message}`);
    }
  }

  console.log(`\n✅ Setup complete! (${successCount}/${steps.length} steps successful)\n`);

  return successCount === steps.length;
}

export default setupComplete;
