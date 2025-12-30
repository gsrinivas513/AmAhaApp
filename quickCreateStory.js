/**
 * quickCreateStory.js
 * Quick script to create a sample story - run in browser console
 * 
 * Instructions:
 * 1. Go to http://localhost:3000/admin/stories
 * 2. Open browser DevTools (F12)
 * 3. Go to Console tab
 * 4. Copy and paste this entire script and press Enter
 */

async function createTestStory() {
  try {
    const { getFirestore, collection, addDoc, deleteDoc, getDocs, Timestamp } = await import('https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js');
    const db = getFirestore();
    
    console.log('🗑️  Deleting all existing stories...');
    const storiesRef = collection(db, 'stories');
    const snapshot = await getDocs(storiesRef);
    
    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
      console.log('Deleted:', doc.id);
    }
    console.log(`✅ Deleted ${snapshot.docs.length} stories`);

    console.log('\n📝 Creating sample story with chapters...');
    
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
          content: 'Once upon a time, in the heart of an enchanted forest, there lived a young adventurer named Zara...'
        },
        {
          title: 'Chapter 2: The Puzzle Tower',
          description: 'Zara and Spark encounter an ancient tower with magical puzzles to solve.',
          character: 'Spark',
          characterImage: '',
          content: 'As they ventured deeper into the forest, a magnificent tower appeared before them...'
        },
        {
          title: 'Chapter 3: The Treasure Discovery',
          description: 'After solving all puzzles, Zara finds an ancient treasure and makes a new friend.',
          character: 'Zara & Spark',
          characterImage: '',
          content: 'With each puzzle solved, the tower revealed its secrets...'
        }
      ]
    };

    const docRef = await addDoc(storiesRef, storyData);
    
    console.log('\n✅ Story created successfully!');
    console.log('Story ID:', docRef.id);
    console.log('Story Title:', storyData.title);
    console.log('Chapters Count:', storyData.chapters.length);
    console.log('\nChapters:');
    storyData.chapters.forEach((ch, idx) => {
      console.log(`  ${idx + 1}. ${ch.title}`);
      console.log(`     ${ch.description}`);
    });
    
    console.log('\n🎉 You can now go to /admin/features and see this story!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTestStory();
