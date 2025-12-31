const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testQuizzes() {
  try {
    const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    console.log('Total quizzes found:', quizzesSnapshot.docs.length);
    quizzesSnapshot.docs.forEach(doc => {
      console.log('Quiz ID:', doc.id, 'Data:', doc.data());
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

testQuizzes();
