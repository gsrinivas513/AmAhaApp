#!/usr/bin/env node

/**
 * generateSampleData.js
 * 
 * Script to create sample daily challenge and story in Firestore
 * 
 * Usage:
 *   node generateSampleData.js
 * 
 * Note: Requires Firebase credentials and proper Firestore rules
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Update this with your Firebase credentials
const serviceAccount = require('./path-to-your-serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'amahaapp'
});

const db = admin.firestore();

/**
 * Create sample daily challenge
 */
async function createSampleChallenge() {
  try {
    console.log('📝 Creating sample daily challenge...');
    
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    const challengeData = {
      type: 'quiz',
      difficulty: 'easy',
      xp: 50,
      coins: 10,
      categoryName: 'math',
      topicName: 'arithmetic',
      subtopicName: 'addition',
      level: 1,
      description: 'Practice basic addition. Can you solve 5 problems correctly?',
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: 'admin',
      active: true
    };
    
    await db.collection('daily_challenges').doc(today).set(challengeData);
    console.log(`✅ Daily challenge created for ${today}`);
    
  } catch (error) {
    console.error('❌ Error creating challenge:', error.message);
  }
}

/**
 * Create sample story with chapters
 */
async function createSampleStory() {
  try {
    console.log('📖 Creating sample story...');
    
    const storyRef = db.collection('stories').doc();
    
    const storyData = {
      id: storyRef.id,
      title: 'Learn JavaScript Basics',
      description: 'A beginner-friendly journey through JavaScript fundamentals. Perfect for kids!',
      targetAudience: 'kids',
      coverImage: 'https://via.placeholder.com/400x300?text=JavaScript+Basics',
      chapters: 3,
      totalChapters: 3,
      published: true,
      createdAt: admin.firestore.Timestamp.now(),
      createdBy: 'admin',
      stats: {
        usersStarted: 0,
        usersCompleted: 0,
        averageRating: 0
      }
    };
    
    await storyRef.set(storyData);
    console.log(`✅ Story created: ${storyData.title} (ID: ${storyRef.id})`);
    
    // Create chapters
    const chapters = [
      {
        order: 1,
        title: 'What is JavaScript?',
        description: 'Discover what JavaScript is and why it\'s important for web development.',
        character: 'Professor Code 🧑‍🏫',
        content: 'JavaScript is a programming language that makes websites interactive and fun!',
        imageUrl: 'https://via.placeholder.com/300x200?text=What+is+JS'
      },
      {
        order: 2,
        title: 'Your First Line',
        description: 'Write your very first line of JavaScript code.',
        character: 'Code Buddy 🤖',
        content: 'console.log("Hello, JavaScript!"); - This is how you print messages!',
        imageUrl: 'https://via.placeholder.com/300x200?text=First+Line'
      },
      {
        order: 3,
        title: 'Making Decisions',
        description: 'Learn about if/else statements - how to make your code think!',
        character: 'Professor Code 🧑‍🏫',
        content: 'if (something) { do this } else { do that } - Now your code can make choices!',
        imageUrl: 'https://via.placeholder.com/300x200?text=Decisions'
      }
    ];
    
    for (const chapter of chapters) {
      const chapterRef = storyRef.collection('chapters').doc();
      const chapterData = {
        ...chapter,
        id: chapterRef.id,
        storyId: storyRef.id,
        createdAt: admin.firestore.Timestamp.now()
      };
      await chapterRef.set(chapterData);
      console.log(`  ✅ Chapter ${chapter.order}: "${chapter.title}"`);
    }
    
  } catch (error) {
    console.error('❌ Error creating story:', error.message);
  }
}

/**
 * Create sample leaderboard data
 */
async function createSampleLeaderboardData() {
  try {
    console.log('🏆 Creating sample leaderboard data...');
    
    const today = new Date().toISOString().split('T')[0];
    const sampleUsers = [
      { uid: 'user1', name: 'Alice', score: 1500, games: 15 },
      { uid: 'user2', name: 'Bob', score: 1200, games: 12 },
      { uid: 'user3', name: 'Charlie', score: 900, games: 10 }
    ];
    
    for (const user of sampleUsers) {
      await db
        .collection('leaderboards')
        .doc('daily')
        .collection('all')
        .collection('users')
        .doc(user.uid)
        .set({
          userId: user.uid,
          name: user.name,
          score: user.score,
          games: user.games,
          accuracy: Math.floor(Math.random() * 40 + 60), // 60-100%
          date: today,
          lastUpdated: admin.firestore.Timestamp.now()
        });
    }
    
    console.log('✅ Sample leaderboard data created');
    
  } catch (error) {
    console.error('❌ Error creating leaderboard data:', error.message);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  AmAha Sample Data Generator               ║');
  console.log('║  Creating sample challenge, story, & data  ║');
  console.log('╚════════════════════════════════════════════╝\n');
  
  try {
    await createSampleChallenge();
    await createSampleStory();
    await createSampleLeaderboardData();
    
    console.log('\n✅ All sample data created successfully!');
    console.log('\nYou can now:');
    console.log('  1. Visit http://localhost:3000 to see the daily challenge card');
    console.log('  2. Go to http://localhost:3000/stories to browse the story');
    console.log('  3. Check http://localhost:3000/leaderboards for rankings\n');
    
  } catch (error) {
    console.error('Fatal error:', error);
  } finally {
    process.exit(0);
  }
}

main();
