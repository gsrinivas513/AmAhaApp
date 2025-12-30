/**
 * checkStoriesData.js
 * 
 * Script to check if stories exist in Firestore and create sample data if needed
 * Run with: node checkStoriesData.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../../amaha-web-firebase-key.json');

// Check if the file exists
const fs = require('fs');
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Firebase service account key not found at:', serviceAccountPath);
  console.log('Please ensure the Firebase service account JSON key is in the AmAhaApp directory');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://amaha-app.firebaseio.com"
});

const db = admin.firestore();

async function checkAndCreateStories() {
  try {
    console.log('📖 Checking stories collection...\n');

    // Check existing stories
    const snapshot = await db.collection('stories').get();
    console.log(`Found ${snapshot.size} total stories in Firestore\n`);

    if (snapshot.size > 0) {
      console.log('Existing stories:');
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        console.log(`  - ID: ${doc.id}`);
        console.log(`    Title: ${data.title || 'N/A'}`);
        console.log(`    Published: ${data.published || 'not set'}`);
        console.log(`    Chapters: ${data.chapterCount || 0}`);
        console.log('');
      });
    } else {
      console.log('❌ No stories found in Firestore!\n');
      console.log('Creating sample story: "Leo and the Lost Forest of Numbers"...\n');
      
      // Create sample story
      const sampleStory = {
        title: 'Leo and the Lost Forest of Numbers',
        description: 'Join Leo on an adventure through a magical forest where numbers come alive!',
        targetAudience: 'kids',
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd8d2c17?w=400&h=400&fit=crop',
        chapterCount: 5
      };

      const docRef = await db.collection('stories').add(sampleStory);
      console.log(`✅ Story created with ID: ${docRef.id}\n`);

      // Add sample chapters
      const chapters = [
        {
          order: 1,
          title: 'The Forest Entrance',
          description: 'Leo discovers a mysterious forest gate',
          content: 'Leo found himself at the entrance of a beautiful forest...',
          createdAt: new Date().toISOString()
        },
        {
          order: 2,
          title: 'Meeting the Number Sprites',
          description: 'Leo meets magical sprites made of numbers',
          content: 'Suddenly, Leo saw glowing creatures made entirely of numbers...',
          createdAt: new Date().toISOString()
        },
        {
          order: 3,
          title: 'The Math Challenge',
          description: 'Leo must solve a puzzle to progress',
          content: 'The sprites challenged Leo to a math problem...',
          createdAt: new Date().toISOString()
        },
        {
          order: 4,
          title: 'The Hidden Treasure',
          description: 'Leo discovers the treasure of the forest',
          content: 'After solving the puzzles, Leo found the treasure...',
          createdAt: new Date().toISOString()
        },
        {
          order: 5,
          title: 'The Return Home',
          description: 'Leo returns home with new knowledge',
          content: 'Leo waved goodbye to the sprites and headed home...',
          createdAt: new Date().toISOString()
        }
      ];

      for (const chapter of chapters) {
        await db.collection('stories').doc(docRef.id).collection('chapters').add(chapter);
      }

      console.log(`✅ Added ${chapters.length} chapters to the story\n`);
    }

    // Check published stories
    const publishedSnapshot = await db.collection('stories').where('published', '==', true).get();
    console.log(`📊 Published stories: ${publishedSnapshot.size}\n`);

    if (publishedSnapshot.size === 0) {
      console.log('⚠️  No published stories found!');
      console.log('Make sure to publish stories from the admin panel at /admin/stories\n');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkAndCreateStories().then(() => {
  console.log('✅ Check complete!');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
