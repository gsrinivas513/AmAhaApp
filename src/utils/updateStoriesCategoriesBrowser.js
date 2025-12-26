/**
 * src/utils/updateStoriesCategoriesBrowser.js
 * 
 * Update stories with category field directly from browser console
 * 
 * Usage in browser console:
 * import { updateAllStoriesCategories } from './utils/updateStoriesCategoriesBrowser'
 * await updateAllStoriesCategories()
 * 
 * OR with custom categories:
 * await updateAllStoriesCategories({
 *   'Leo': 'Kids',
 *   'Adventure': 'Adventure',
 *   'Math': 'Math'
 * })
 */

import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

export async function updateAllStoriesCategories(categoryMap = {}) {
  try {
    console.log('\n📖 Starting stories category update...\n');

    // Default category mappings
    const defaultCategories = {
      'kids': 'Kids',
      'kids (0-3)': 'Kids (0-3)',
      'kids (3-5)': 'Kids (3-5)',
      'kids (5-8)': 'Kids (5-8)',
      'adventure': 'Adventure',
      'math': 'Math',
      'reading': 'Reading',
      'science': 'Science',
      'general': 'General',
      'leo': 'Kids',
      'forest': 'Adventure'
    };

    const finalCategoryMap = { ...defaultCategories, ...categoryMap };

    // Get all published stories
    const storiesSnapshot = await getDocs(
      query(collection(db, 'stories'), where('published', '==', true))
    );

    if (storiesSnapshot.empty) {
      console.log('❌ No published stories found');
      return;
    }

    console.log(`📚 Found ${storiesSnapshot.size} published stories\n`);

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const storyDoc of storiesSnapshot.docs) {
      const story = storyDoc.data();
      const storyId = storyDoc.id;

      // Check if story already has a proper category
      if (story.category && story.category !== 'Uncategorized') {
        console.log(`⏭️  Skip "${story.title}" - already has category: "${story.category}"`);
        skipped++;
        continue;
      }

      // Determine category based on title
      let category = 'Kids'; // Default to Kids

      const title = story.title?.toLowerCase() || '';
      const description = story.description?.toLowerCase() || '';
      const fullText = `${title} ${description}`;

      // Try to match category from keywords
      for (const [keyword, cat] of Object.entries(finalCategoryMap)) {
        if (fullText.includes(keyword.toLowerCase())) {
          category = cat;
          break;
        }
      }

      // Update the story with category
      try {
        await updateDoc(doc(db, 'stories', storyId), {
          category: category,
          updatedAt: new Date()
        });

        console.log(`✅ Updated "${story.title}" → category: "${category}"`);
        updated++;
      } catch (error) {
        console.error(`❌ Error updating story ${storyId}:`, error.message);
        errors++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Updated: ${updated} stories`);
    console.log(`  ⏭️  Skipped: ${skipped} stories`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log(`\n✨ Stories category update complete!\n`);

    return {
      updated,
      skipped,
      errors,
      total: storiesSnapshot.size
    };

  } catch (error) {
    console.error('❌ Error updating stories categories:', error);
    throw error;
  }
}

/**
 * Check current stories and their categories
 */
export async function checkStoriesCategories() {
  try {
    console.log('\n📖 Checking stories categories...\n');

    const storiesSnapshot = await getDocs(
      query(collection(db, 'stories'), where('published', '==', true))
    );

    const categories = {};
    
    storiesSnapshot.docs.forEach((storyDoc) => {
      const story = storyDoc.data();
      const category = story.category || 'Uncategorized';
      
      if (!categories[category]) {
        categories[category] = [];
      }
      
      categories[category].push({
        id: storyDoc.id,
        title: story.title,
        category: story.category
      });
    });

    console.log('📚 Stories by Category:\n');
    for (const [cat, stories] of Object.entries(categories)) {
      console.log(`📂 ${cat} (${stories.length} stories)`);
      stories.forEach(s => console.log(`   - ${s.title}`));
      console.log();
    }

    return categories;

  } catch (error) {
    console.error('❌ Error checking categories:', error);
    throw error;
  }
}
