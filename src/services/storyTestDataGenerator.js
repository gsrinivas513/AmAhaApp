/**
 * storyTestDataGenerator.js
 * Utility to generate test stories with chapters
 * 
 * Usage in React component:
 * import { createTestStory, deleteAllStories } from './storyTestDataGenerator';
 * 
 * // Delete all and create new
 * await deleteAllStories();
 * await createTestStory();
 */

import { collection, addDoc, deleteDoc, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export async function deleteAllStories() {
  try {
    console.log('🗑️ Deleting all stories...');
    const storiesRef = collection(db, 'stories');
    const snapshot = await getDocs(storiesRef);
    
    let deleted = 0;
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
      deleted++;
    }
    console.log(`✅ Deleted ${deleted} stories`);
    return deleted;
  } catch (error) {
    console.error('Error deleting stories:', error);
    throw error;
  }
}

export async function createTestStory() {
  try {
    console.log('📝 Creating test story with chapters...');
    
    const storyData = {
      title: 'The Adventure Chronicles',
      description: 'Join Zara on an exciting journey through enchanted lands filled with puzzles and challenges!',
      targetAudience: 'kids',
      coverColor: '#667eea',
      isPublished: true,
      createdAt: Timestamp.now(),
      chapters: [
        {
          title: 'Chapter 1: The Mysterious Forest',
          description: 'Zara discovers a hidden path in the forest and meets a friendly dragon named Spark.',
          character: 'Zara',
          characterImage: '',
          content: 'Once upon a time, in the heart of an enchanted forest, there lived a young adventurer named Zara. She had always dreamed of exploring beyond her village, searching for the legendary Lost Kingdom. One sunny afternoon, while picking berries, she stumbled upon an ancient stone path covered in moss and vines...'
        },
        {
          title: 'Chapter 2: The Puzzle Tower',
          description: 'Zara and Spark encounter an ancient tower with magical puzzles to solve.',
          character: 'Spark',
          characterImage: '',
          content: 'As they ventured deeper into the forest, a magnificent tower appeared before them, spiraling high into the clouds. It glowed with an ethereal blue light and seemed to beckon Zara forward. "This must be it!" she whispered to Spark. The dragon nodded, his eyes gleaming with excitement.'
        },
        {
          title: 'Chapter 3: The Treasure Discovery',
          description: 'After solving all puzzles, Zara finds an ancient treasure and makes a new friend.',
          character: 'Zara & Spark',
          characterImage: '',
          content: 'With each puzzle solved, the tower revealed its secrets. Ancient runes glowed on the walls, and magical doors swung open. Finally, they reached the top chamber where a glowing treasure chest awaited them. Inside, they found not gold or jewels, but a map to even greater adventures!'
        }
      ]
    };

    const storiesRef = collection(db, 'stories');
    const docRef = await addDoc(storiesRef, storyData);
    
    console.log('\n✅ Story created successfully!');
    console.log('📌 Story ID:', docRef.id);
    console.log('📖 Story Title:', storyData.title);
    console.log('📚 Chapters Count:', storyData.chapters.length);
    console.log('\nChapters:');
    storyData.chapters.forEach((ch, idx) => {
      console.log(`  ${idx + 1}. ${ch.title}`);
      console.log(`     ${ch.description}`);
    });
    
    return docRef;
  } catch (error) {
    console.error('Error creating story:', error);
    throw error;
  }
}

export async function createTestStoryAndDelete() {
  try {
    await deleteAllStories();
    await createTestStory();
    console.log('\n🎉 Done! Refresh the page to see the story.');
  } catch (error) {
    console.error('Error:', error);
  }
}
