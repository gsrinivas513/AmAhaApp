/**
 * src/utils/initializeStoriesHierarchy.js
 * 
 * Initialize the complete Stories hierarchy following the same structure as Quiz/Puzzles:
 * Feature → Category → Topic → Subtopic → Stories
 * 
 * Usage in browser console:
 * import { initializeStoriesHierarchy } from './utils/initializeStoriesHierarchy'
 * await initializeStoriesHierarchy()
 */

import { db } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore';

export async function initializeStoriesHierarchy() {
  console.log('\n📖 Initializing Stories Hierarchy...\n');
  
  try {
    // Step 1: Create/Verify Categories for Stories
    console.log('📚 Step 1: Setting up Story Categories...');
    
    const categories = [
      {
        id: 'stories-kids',
        name: 'Kids',
        label: 'Kids Stories',
        icon: '👶',
        description: 'Stories for young children',
        featureType: 'stories',
        isPublished: true
      },
      {
        id: 'stories-adventure',
        name: 'Adventure',
        label: 'Adventure Stories',
        icon: '🗺️',
        description: 'Exciting adventure stories',
        featureType: 'stories',
        isPublished: true
      },
      {
        id: 'stories-learning',
        name: 'Learning',
        label: 'Learning Stories',
        icon: '📚',
        description: 'Educational stories',
        featureType: 'stories',
        isPublished: true
      },
      {
        id: 'stories-fantasy',
        name: 'Fantasy',
        label: 'Fantasy Stories',
        icon: '✨',
        description: 'Magical fantasy stories',
        featureType: 'stories',
        isPublished: true
      }
    ];

    for (const cat of categories) {
      try {
        const catRef = doc(db, 'storyCategories', cat.id);
        await setDoc(catRef, {
          ...cat,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }, { merge: true });
        console.log(`✅ Category created/updated: ${cat.name}`);
      } catch (error) {
        console.error(`❌ Error creating category ${cat.name}:`, error.message);
      }
    }

    // Step 2: Create Topics for each category
    console.log('\n📂 Step 2: Setting up Story Topics...');
    
    const topics = [
      // Kids category topics
      {
        id: 'topic-kids-adventure',
        name: 'Adventure Tales',
        label: 'Adventure Tales',
        icon: '🧭',
        description: 'Adventure stories for kids',
        categoryId: 'stories-kids',
        isPublished: true
      },
      {
        id: 'topic-kids-learning',
        name: 'Learning Through Stories',
        label: 'Learning Through Stories',
        icon: '🎓',
        description: 'Educational stories',
        categoryId: 'stories-kids',
        isPublished: true
      },
      {
        id: 'topic-kids-fantasy',
        name: 'Fantasy & Magic',
        label: 'Fantasy & Magic',
        icon: '🪄',
        description: 'Magical fantasy stories',
        categoryId: 'stories-kids',
        isPublished: true
      },
      // Adventure category topics
      {
        id: 'topic-adventure-exploration',
        name: 'Exploration',
        label: 'Exploration Adventures',
        icon: '🗺️',
        description: 'Exploration and discovery stories',
        categoryId: 'stories-adventure',
        isPublished: true
      },
      {
        id: 'topic-adventure-mystery',
        name: 'Mystery',
        label: 'Mystery Adventures',
        icon: '🔍',
        description: 'Mystery and puzzle stories',
        categoryId: 'stories-adventure',
        isPublished: true
      },
      // Learning category topics
      {
        id: 'topic-learning-science',
        name: 'Science',
        label: 'Science Stories',
        icon: '🔬',
        description: 'Stories about science',
        categoryId: 'stories-learning',
        isPublished: true
      },
      {
        id: 'topic-learning-history',
        name: 'History',
        label: 'History Stories',
        icon: '📜',
        description: 'Historical stories',
        categoryId: 'stories-learning',
        isPublished: true
      },
      // Fantasy category topics
      {
        id: 'topic-fantasy-dragons',
        name: 'Dragons & Mythical Creatures',
        label: 'Dragons & Mythical Creatures',
        icon: '🐉',
        description: 'Stories about mythical creatures',
        categoryId: 'stories-fantasy',
        isPublished: true
      },
      {
        id: 'topic-fantasy-magic',
        name: 'Magic & Spells',
        label: 'Magic & Spells',
        icon: '⚡',
        description: 'Stories about magic',
        categoryId: 'stories-fantasy',
        isPublished: true
      }
    ];

    for (const topic of topics) {
      try {
        const topicRef = doc(db, 'storyTopics', topic.id);
        await setDoc(topicRef, {
          ...topic,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }, { merge: true });
        console.log(`✅ Topic created/updated: ${topic.name}`);
      } catch (error) {
        console.error(`❌ Error creating topic ${topic.name}:`, error.message);
      }
    }

    // Step 3: Create Subtopics for each topic
    console.log('\n📋 Step 3: Setting up Story Subtopics...');
    
    const subtopics = [
      // Kids - Adventure Tales subtopics
      {
        id: 'subtopic-kids-adventure-0-3',
        name: 'Kids (0-3)',
        label: 'For Ages 0-3',
        icon: '👶',
        description: 'Stories for babies and toddlers',
        topicId: 'topic-kids-adventure',
        categoryId: 'stories-kids',
        isPublished: true
      },
      {
        id: 'subtopic-kids-adventure-3-5',
        name: 'Kids (3-5)',
        label: 'For Ages 3-5',
        icon: '🧒',
        description: 'Stories for preschoolers',
        topicId: 'topic-kids-adventure',
        categoryId: 'stories-kids',
        isPublished: true
      },
      {
        id: 'subtopic-kids-adventure-5-8',
        name: 'Kids (5-8)',
        label: 'For Ages 5-8',
        icon: '👦',
        description: 'Stories for young kids',
        topicId: 'topic-kids-adventure',
        categoryId: 'stories-kids',
        isPublished: true
      },
      // Kids - Learning Through Stories subtopics
      {
        id: 'subtopic-kids-learning-math',
        name: 'Math Stories',
        label: 'Math Stories',
        icon: '🔢',
        description: 'Learn math through stories',
        topicId: 'topic-kids-learning',
        categoryId: 'stories-kids',
        isPublished: true
      },
      {
        id: 'subtopic-kids-learning-science',
        name: 'Science Stories',
        label: 'Science Stories',
        icon: '🔬',
        description: 'Learn science through stories',
        topicId: 'topic-kids-learning',
        categoryId: 'stories-kids',
        isPublished: true
      },
      {
        id: 'subtopic-kids-learning-reading',
        name: 'Reading Skills',
        label: 'Reading Skills',
        icon: '📖',
        description: 'Improve reading through stories',
        topicId: 'topic-kids-learning',
        categoryId: 'stories-kids',
        isPublished: true
      },
      // Kids - Fantasy & Magic subtopics
      {
        id: 'subtopic-kids-fantasy-magical',
        name: 'Magical Tales',
        label: 'Magical Tales',
        icon: '✨',
        description: 'Magical fantasy stories',
        topicId: 'topic-kids-fantasy',
        categoryId: 'stories-kids',
        isPublished: true
      },
      {
        id: 'subtopic-kids-fantasy-fairytales',
        name: 'Fairy Tales',
        label: 'Fairy Tales',
        icon: '🧚',
        description: 'Classic and modern fairy tales',
        topicId: 'topic-kids-fantasy',
        categoryId: 'stories-kids',
        isPublished: true
      }
    ];

    for (const subtopic of subtopics) {
      try {
        const stRef = doc(db, 'storySubtopics', subtopic.id);
        await setDoc(stRef, {
          ...subtopic,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        }, { merge: true });
        console.log(`✅ Subtopic created/updated: ${subtopic.name}`);
      } catch (error) {
        console.error(`❌ Error creating subtopic ${subtopic.name}:`, error.message);
      }
    }

    // Step 4: Update existing stories with proper category/topic/subtopic references
    console.log('\n🔄 Step 4: Updating existing stories...');
    
    const storiesSnapshot = await getDocs(
      query(collection(db, 'stories'), where('published', '==', true))
    );

    let updated = 0;
    for (const storyDoc of storiesSnapshot.docs) {
      const story = storyDoc.data();
      const updates = {};

      // Assign default category and subtopic
      if (!story.storyCategory) {
        updates.storyCategory = 'stories-kids';
      }
      if (!story.storyTopic) {
        updates.storyTopic = 'topic-kids-adventure';
      }
      if (!story.storySubtopic) {
        updates.storySubtopic = 'subtopic-kids-adventure-5-8';
      }

      // Keep the old category field for backwards compatibility
      if (!story.category) {
        updates.category = 'Kids';
      }

      if (Object.keys(updates).length > 0) {
        try {
          await updateDoc(doc(db, 'stories', storyDoc.id), {
            ...updates,
            updatedAt: Timestamp.now()
          });
          console.log(`✅ Updated story: ${story.title}`);
          updated++;
        } catch (error) {
          console.error(`❌ Error updating story ${story.title}:`, error.message);
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Categories: ${categories.length} created`);
    console.log(`  ✅ Topics: ${topics.length} created`);
    console.log(`  ✅ Subtopics: ${subtopics.length} created`);
    console.log(`  ✅ Stories: ${updated} updated with new structure`);
    console.log(`\n✨ Stories hierarchy initialized successfully!`);
    console.log(`\n📖 Refresh your browser to see the new category structure in the Stories dropdown.\n`);

    return {
      categoriesCount: categories.length,
      topicsCount: topics.length,
      subtopicsCount: subtopics.length,
      storiesUpdated: updated
    };

  } catch (error) {
    console.error('❌ Error initializing stories hierarchy:', error);
    throw error;
  }
}
