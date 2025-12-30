// Migration script to add enhanced fields to puzzle topics
// Run this in the admin panel to update all topics with new fields

import { collection, getDocs, updateDoc, doc, batch } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Enhanced topic data with tags and difficulty levels
const TOPIC_ENHANCEMENTS = {
  'Jigsaw': {
    'Easy': { difficulty: 'easy', tags: ['Scenic', 'Relaxing'], icon: '🧩' },
    'Medium': { difficulty: 'medium', tags: ['Art', 'Challenge'], icon: '🖼️' },
    'Hard': { difficulty: 'hard', tags: ['Complex', 'Expert'], icon: '🏆' },
  },
  'Matching Pairs': {
    'Easy': { difficulty: 'easy', tags: ['Memory', 'Fun'], icon: '🎯' },
    'Medium': { difficulty: 'medium', tags: ['Brain', 'Quick'], icon: '⚡' },
    'Hard': { difficulty: 'hard', tags: ['Intense', 'Master'], icon: '👑' },
  },
  'Word Search': {
    'Easy': { difficulty: 'easy', tags: ['Words', 'Relax'], icon: '📝' },
    'Medium': { difficulty: 'medium', tags: ['Puzzle', 'Think'], icon: '🧠' },
    'Hard': { difficulty: 'hard', tags: ['Challenge', 'Expert'], icon: '🔥' },
  },
  'Sudoku': {
    'Easy': { difficulty: 'easy', tags: ['Numbers', 'Logic'], icon: '🔢' },
    'Medium': { difficulty: 'medium', tags: ['Math', 'Mind'], icon: '📊' },
    'Hard': { difficulty: 'hard', tags: ['Complex', 'Master'], icon: '💎' },
  },
  'Spot Difference': {
    'Easy': { difficulty: 'easy', tags: ['Visual', 'Fun'], icon: '🔍' },
    'Medium': { difficulty: 'medium', tags: ['Observe', 'Quick'], icon: '👁️' },
    'Hard': { difficulty: 'hard', tags: ['Sharp Eyes', 'Expert'], icon: '🎯' },
  },
  'Lateral Thinking': {
    'Easy': { difficulty: 'beginner', tags: ['Logic', 'Think'], icon: '💡' },
    'Medium': { difficulty: 'medium', tags: ['Mind', 'Puzzle'], icon: '🧩' },
    'Hard': { difficulty: 'expert', tags: ['Challenge', 'Genius'], icon: '🌟' },
  },
};

export async function enhanceTopicsWithMetadata() {
  try {
    console.log('Starting topic enhancement migration...');
    
    const topicsSnapshot = await getDocs(collection(db, 'topics'));
    const batch_obj = batch();
    let updateCount = 0;

    topicsSnapshot.forEach((topicDoc) => {
      const topic = topicDoc.data();
      const topicName = topic.name || topic.label;
      
      // Find enhancements for this topic
      let enhancements = null;
      for (const [categoryName, topics] of Object.entries(TOPIC_ENHANCEMENTS)) {
        for (const [topicKey, enhancement] of Object.entries(topics)) {
          if (topicName.includes(topicKey) || topicKey.includes(topicName)) {
            enhancements = enhancement;
            break;
          }
        }
        if (enhancements) break;
      }

      if (enhancements) {
        batch_obj.update(doc(db, 'topics', topicDoc.id), {
          difficulty: enhancements.difficulty || topic.difficulty || 'medium',
          tags: enhancements.tags || topic.tags || [],
          icon: enhancements.icon || topic.icon || '🧩',
          rating: topic.rating || 4.5,
          completedCount: topic.completedCount || 0,
          updatedAt: new Date().toISOString()
        });
        updateCount++;
        console.log(`Updating topic: ${topicName}`);
      }
    });

    if (updateCount > 0) {
      await batch_obj.commit();
      console.log(`✅ Successfully enhanced ${updateCount} topics!`);
      return { success: true, updated: updateCount };
    } else {
      console.log('No topics needed enhancement');
      return { success: true, updated: 0 };
    }
  } catch (error) {
    console.error('Error enhancing topics:', error);
    return { success: false, error: error.message };
  }
}

// Add rating to categories
export async function enhanceCategoriesWithRatings() {
  try {
    console.log('Starting category enhancement migration...');
    
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const batch_obj = batch();
    let updateCount = 0;

    categoriesSnapshot.forEach((catDoc) => {
      const category = catDoc.data();
      
      if (category.uiMode === 'puzzle') {
        batch_obj.update(doc(db, 'categories', catDoc.id), {
          rating: category.rating || 4.6,
          updatedAt: new Date().toISOString()
        });
        updateCount++;
      }
    });

    if (updateCount > 0) {
      await batch_obj.commit();
      console.log(`✅ Successfully enhanced ${updateCount} categories!`);
      return { success: true, updated: updateCount };
    } else {
      console.log('No categories needed enhancement');
      return { success: true, updated: 0 };
    }
  } catch (error) {
    console.error('Error enhancing categories:', error);
    return { success: false, error: error.message };
  }
}

// Simple call to run both migrations
export async function runAllMigrations() {
  console.log('🚀 Running all data enhancements...');
  const result1 = await enhanceTopicsWithMetadata();
  const result2 = await enhanceCategoriesWithRatings();
  
  console.log('✅ All migrations complete!', { result1, result2 });
  return { result1, result2 };
}
