/**
 * updateStoriesCategories.js
 * 
 * Run this script to add category field to existing stories in Firestore
 * 
 * Usage:
 * node updateStoriesCategories.js
 * 
 * OR in browser console (if using admin SDK):
 * const { updateAllStoriesCategories } = await import('./updateStoriesCategories.js');
 * await updateAllStoriesCategories();
 */

const admin = require('firebase-admin');
const serviceAccount = require('./src/firebase/serviceAccountKey.json');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://amaha-b9a5d.firebaseapp.com'
  });
}

const db = admin.firestore();

// Define story categories (customize based on your needs)
const storyCategories = {
  'Leo and the Lost Forest': 'Kids',
  'Kids': 'Kids',
  'general': 'General',
  'adventure': 'Adventure',
  'math': 'Math',
  'reading': 'Reading',
  'science': 'Science'
};

async function updateAllStoriesCategories() {
  try {
    console.log('\n📖 Starting stories category update...\n');

    // Get all published stories
    const storiesSnapshot = await db
      .collection('stories')
      .where('published', '==', true)
      .get();

    if (storiesSnapshot.empty) {
      console.log('❌ No published stories found');
      return;
    }

    console.log(`📚 Found ${storiesSnapshot.size} published stories\n`);

    let updated = 0;
    let skipped = 0;

    for (const storyDoc of storiesSnapshot.docs) {
      const story = storyDoc.data();
      const storyId = storyDoc.id;

      // Check if story already has a category
      if (story.category && story.category !== 'Uncategorized') {
        console.log(`⏭️  Skip "${story.title}" - already has category: "${story.category}"`);
        skipped++;
        continue;
      }

      // Determine category based on title or default to Kids
      let category = 'Kids'; // Default category

      // Try to match category from title
      for (const [keyword, cat] of Object.entries(storyCategories)) {
        if (story.title?.toLowerCase().includes(keyword.toLowerCase())) {
          category = cat;
          break;
        }
      }

      // Update the story with category
      try {
        await db.collection('stories').doc(storyId).update({
          category: category,
          updatedAt: new Date()
        });

        console.log(`✅ Updated "${story.title}" → category: "${category}"`);
        updated++;
      } catch (error) {
        console.error(`❌ Error updating story ${storyId}:`, error.message);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Updated: ${updated} stories`);
    console.log(`  ⏭️  Skipped: ${skipped} stories`);
    console.log(`\n✨ Stories category update complete!\n`);

  } catch (error) {
    console.error('❌ Error updating stories categories:', error);
    process.exit(1);
  } finally {
    // Close the Firebase connection
    await admin.app().delete();
  }
}

// Run the update
updateAllStoriesCategories();
