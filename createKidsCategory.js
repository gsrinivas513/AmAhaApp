// createKidsCategory.js - Create the missing "kids" category
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAWs0dq_2WUC6CvMZpv9XFAOzPj0FCT3X0",
  authDomain: "amaha-58f21.firebaseapp.com",
  projectId: "amaha-58f21",
  storageBucket: "amaha-58f21.firebasestorage.app",
  messagingSenderId: "573743758256",
  appId: "1:573743758256:web:d00cd0fb2fae5f7f8bfd37",
  measurementId: "G-CLRN1JGCL8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createKidsCategory() {
  try {
    // Create kids category with document ID "kids"
    await setDoc(doc(db, "categories", "kids"), {
      name: "Kids",
      description: "Fun quizzes for kids",
      icon: "🧒",
      status: "published",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log("✅ Successfully created 'kids' category!");
    console.log("   Document ID: kids");
    console.log("   Name: Kids");
    console.log("\nYou can now import your CSV questions.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating category:", error);
    process.exit(1);
  }
}

createKidsCategory();
