// Quick script to set up test data in Firebase
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDvFqV7SXc6I9Rn_-9bN8kLm2pOqRsT3uU",
  authDomain: "amaha-app-f2a78.firebaseapp.com",
  projectId: "amaha-app-f2a78",
  storageBucket: "amaha-app-f2a78.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function setupTestData() {
  try {
    console.log("Checking features...");
    const featSnap = await getDocs(collection(db, "features"));
    console.log("Existing features:", featSnap.size);

    if (featSnap.size === 0) {
      console.log("Creating default features...");
      const quiz = await addDoc(collection(db, "features"), {
        name: "quiz",
        label: "Quiz",
        icon: "🎯",
        enabled: true,
        featureType: "quiz",
        createdAt: new Date().toISOString(),
      });
      console.log("Created Quiz feature:", quiz.id);

      const puzzles = await addDoc(collection(db, "features"), {
        name: "puzzles",
        label: "Puzzles",
        icon: "🧩",
        enabled: true,
        featureType: "puzzle",
        createdAt: new Date().toISOString(),
      });
      console.log("Created Puzzles feature:", puzzles.id);

      // Now create a test category for quiz
      const category = await addDoc(collection(db, "categories"), {
        name: "programming",
        label: "Programming",
        icon: "💻",
        color: "#0284c7",
        description: "Test programming quizzes",
        featureId: quiz.id,
        quizCount: 0,
        isPublished: false,
        defaultUiMode: "playful",
        createdAt: new Date().toISOString(),
      });
      console.log("Created Programming category:", category.id);
    } else {
      console.log("Features already exist. Skipping setup.");
    }
  } catch (error) {
    console.error("Error:", error);
  }

  process.exit(0);
}

setupTestData();
