/**
 * src/utils/debugStories.js
 * 
 * Helper utilities for debugging stories
 * Use these in browser console:
 * 
 * import { debugStories } from './utils/debugStories'
 * await debugStories.checkStoriesCollection()
 */

import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, addDoc, writeBatch, doc, updateDoc, setDoc } from 'firebase/firestore';

export const debugStories = {
  /**
   * Check what's in the stories collection
   */
  async checkStoriesCollection() {
    console.log('🔍 Checking stories collection...\n');
    try {
      const snapshot = await getDocs(collection(db, 'stories'));
      console.log(`Total stories: ${snapshot.size}`);
      
      snapshot.docs.forEach(doc => {
        console.log('\n📖 Story:', doc.id);
        console.log(doc.data());
      });
      
      // Check published stories specifically
      const publishedSnapshot = await getDocs(
        query(collection(db, 'stories'), where('published', '==', true))
      );
      console.log(`\n✅ Published stories: ${publishedSnapshot.size}`);
      
      return {
        total: snapshot.size,
        published: publishedSnapshot.size,
        stories: snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      };
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  },

  /**
   * Add Stories feature to features collection
   * This makes Stories appear in navigation and home page
   */
  async addStoriesFeature() {
    console.log('📖 Adding Stories feature to Firestore...\n');
    try {
      const storiesFeature = {
        id: 'stories',
        name: 'Stories',
        label: 'Stories',
        description: 'Interactive stories for learning and adventure',
        icon: '📖',
        featureType: 'story',
        type: 'story',
        enabled: true,
        status: 'enabled',
        isPublished: true,
        showInMenu: true,
        order: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'features', 'stories'), storiesFeature);
      
      console.log('✅ Stories feature created successfully!');
      console.log(storiesFeature);
      console.log('\n✅ Stories will now appear in:');
      console.log('  - Home page navigation');
      console.log('  - Top navigation bar');
      console.log('  - Mobile menu');
      
      return storiesFeature;
    } catch (error) {
      console.error('❌ Error adding Stories feature:', error);
      throw error;
    }
  },

  /**
   * Create a sample story (Leo and the Lost Forest)
   */
  async createSampleStory() {
    console.log('📝 Creating sample story...\n');
    try {
      const storyData = {
        title: 'Leo and the Lost Forest of Numbers',
        description: 'Join Leo on an adventure through a magical forest where numbers come alive! Solve puzzles, meet magical creatures, and discover the treasure of mathematical knowledge.',
        targetAudience: 'kids',
        published: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        coverImage: 'https://images.unsplash.com/photo-1614613535308-eb5fbd8d2c17?w=400&h=400&fit=crop',
        chapterCount: 5,
        status: 'published'
      };

      const docRef = await addDoc(collection(db, 'stories'), storyData);
      console.log('✅ Story created:', docRef.id);
      console.log(storyData);

      // Add chapters
      const chapters = [
        {
          order: 1,
          title: 'The Forest Entrance',
          description: 'Leo discovers a mysterious forest gate surrounded by glowing numbers',
          content: 'Leo found himself at the entrance of a beautiful, shimmering forest. Numbers floated in the air like fireflies...',
          characterImage: '🧒',
          createdAt: new Date()
        },
        {
          order: 2,
          title: 'Meeting the Number Sprites',
          description: 'Magical sprites made of colorful numbers greet Leo',
          content: 'Suddenly, Leo saw glowing creatures made entirely of numbers - 1, 2, 3, 5, 8. They danced in the air...',
          characterImage: '✨',
          createdAt: new Date()
        },
        {
          order: 3,
          title: 'The Math Challenge',
          description: 'Leo must solve a puzzle to unlock the path forward',
          content: 'The sprites challenged Leo: "Add us up and find the secret number!" Can you solve it?',
          characterImage: '🧩',
          createdAt: new Date()
        },
        {
          order: 4,
          title: 'The Hidden Treasure',
          description: 'Leo discovers the legendary treasure of the forest',
          content: 'After solving the puzzles, Leo found a glowing treasure chest filled with golden mathematical symbols...',
          characterImage: '💎',
          createdAt: new Date()
        },
        {
          order: 5,
          title: 'The Return Home',
          description: 'Leo returns home with new magical knowledge',
          content: 'Leo waved goodbye to the sprites and headed home, ready to share their wisdom with the world!',
          characterImage: '🏠',
          createdAt: new Date()
        }
      ];

      const batch = writeBatch(db);
      for (const chapter of chapters) {
        const chapterRef = doc(collection(db, 'stories', docRef.id, 'chapters'));
        batch.set(chapterRef, chapter);
      }
      await batch.commit();
      console.log(`✅ Added ${chapters.length} chapters`);

      return { id: docRef.id, ...storyData };
    } catch (error) {
      console.error('❌ Error creating story:', error);
      throw error;
    }
  },

  /**
   * Mark a story as published
   */
  async publishStory(storyId) {
    console.log(`📤 Publishing story: ${storyId}\n`);
    try {
      const storyRef = doc(db, 'stories', storyId);
      await updateDoc(storyRef, {
        published: true,
        updatedAt: new Date()
      });
      console.log('✅ Story published');
      return true;
    } catch (error) {
      console.error('❌ Error publishing story:', error);
      throw error;
    }
  },

  /**
   * Get all stories (mimics getAllStories)
   */
  async getAllStories() {
    console.log('📚 Fetching all published stories...\n');
    try {
      const snapshot = await getDocs(
        query(collection(db, 'stories'), where('published', '==', true))
      );
      const stories = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log(`Found ${stories.length} published stories:`, stories);
      return stories;
    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    }
  }
};

export default debugStories;
