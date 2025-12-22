const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkQuestions() {
  const subcatId = 'MRvdgNIQmPemZFZI36Ct';
  
  // First, check what this subcategory is
  const subcatDoc = await db.collection('subcategories').doc(subcatId).get();
  console.log('📋 Subcategory:', subcatDoc.exists ? subcatDoc.data() : 'NOT FOUND');
  
  // Check questions by category field
  const questionsSnap = await db.collection('questions')
    .where('category', '==', subcatId)
    .get();
  
  console.log('\n📊 Questions with category=' + subcatId + ':', questionsSnap.size);
  
  if (questionsSnap.size > 0) {
    const difficulties = {};
    questionsSnap.forEach(doc => {
      const data = doc.data();
      const diff = data.difficulty || 'unknown';
      difficulties[diff] = (difficulties[diff] || 0) + 1;
    });
    console.log('By difficulty:', difficulties);
    
    // Show first few questions
    console.log('\nFirst 3 questions:');
    questionsSnap.docs.slice(0, 3).forEach(doc => {
      const data = doc.data();
      console.log(' -', data.question?.substring(0, 50), '| diff:', data.difficulty);
    });
  }
}

checkQuestions().then(() => process.exit(0)).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
