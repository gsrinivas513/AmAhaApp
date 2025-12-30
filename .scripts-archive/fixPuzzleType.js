// Fix puzzle type in Firestore
// Run from browser console: copy this entire script and paste into browser console on any admin page

(async () => {
  try {
    const { collection, query, where, getDocs, updateDoc, doc } = window.firebase.firestore;
    const { db } = window.firebaseApp || {};
    
    if (!db) {
      console.error('❌ Firebase not initialized. Make sure you are on a page with Firebase loaded.');
      return;
    }
    
    console.log('🔍 Searching for puzzles with type: "puzzle"...');
    
    // Get all puzzles with type "puzzle"
    const q = query(collection(db, 'puzzles'), where('type', '==', 'puzzle'));
    const snapshot = await getDocs(q);
    
    console.log(`Found ${snapshot.docs.length} puzzles with type: "puzzle"`);
    
    if (snapshot.docs.length === 0) {
      console.log('✅ No puzzles to fix!');
      return;
    }
    
    // Update each one to "find-pair"
    for (const puzzleDoc of snapshot.docs) {
      const puzzleData = puzzleDoc.data();
      console.log(`Updating puzzle: ${puzzleDoc.id} (${puzzleData.title})`);
      
      await updateDoc(doc(db, 'puzzles', puzzleDoc.id), {
        type: 'find-pair'
      });
      
      console.log(`✅ Updated: ${puzzleDoc.id}`);
    }
    
    console.log('✅ All puzzles fixed!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
})();
