/**
 * createSampleStory.js
 * Script to create a sample story with chapters
 * Run with: node createSampleStory.js
 */

const admin = require('firebase-admin');
const serviceAccount = require('./amaha-firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function createSampleStory() {
  try {
    console.log('Starting story creation...');

    // Delete all existing stories
    console.log('Deleting all existing stories...');
    const storiesSnapshot = await db.collection('stories').get();
    const deletePromises = storiesSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);
    console.log(`Deleted ${storiesSnapshot.docs.length} existing stories`);

    // Create a new story with chapters
    const storyData = {
      title: 'The Adventure Chronicles',
      description: 'Join Zara on an exciting journey through enchanted lands filled with puzzles and challenges!',
      targetAudience: 'kids',
      coverColor: '#667eea',
      isPublished: true,
      createdAt: admin.firestore.Timestamp.now(),
      chapters: [
        {
          title: 'Chapter 1: The Mysterious Forest',
          description: 'Zara discovers a hidden path in the forest and meets a friendly dragon named Spark.',
          character: 'Zara',
          characterImage: '',
          content: 'Once upon a time, in the heart of an enchanted forest, there lived a young adventurer named Zara. She had always dreamed of exploring beyond her village...'
        },
        {
          title: 'Chapter 2: The Puzzle Tower',
          description: 'Zara and Spark encounter an ancient tower with magical puzzles to solve.',
          character: 'Spark',
          characterImage: '',
          content: 'As they ventured deeper into the forest, a magnificent tower appeared before them. It glowed with an ethereal light and seemed to call to Zara...'
        },
        {
          title: 'Chapter 3: The Treasure Discovery',
          description: 'After solving all puzzles, Zara finds an ancient treasure and makes a new friend.',
          character: 'Zara & Spark',
          characterImage: '',
          content: 'With each puzzle solved, the tower revealed its secrets. Finally, they reached the top chamber where a glowing treasure chest awaited...'
        }
      ]
    };

    // Add the story to Firestore
    const docRef = await db.collection('stories').add(storyData);
    console.log('\n✅ Story created successfully!');
    console.log('Story ID:', docRef.id);
    console.log('Story Title:', storyData.title);
    console.log('Chapters:', storyData.chapters.length);
    console.log('\nChapter Details:');
    storyData.chapters.forEach((ch, idx) => {
      console.log(`  ${idx + 1}. ${ch.title}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating story:', error);
    process.exit(1);
  }
}

createSampleStory();
