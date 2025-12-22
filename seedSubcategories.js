// seedSubcategories.js
/**
 * Seed script to create initial subcategories for Kids category
 * Run: node seedSubcategories.js
 * 
 * This creates example subcategories:
 * - Kids > Math
 * - Kids > English  
 * - Kids > Science
 * 
 * Note: Update category ID and feature IDs as needed
 */

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAR8-mpS85CEopQuGuP4Lhm3xieYbG1HcY",
  authDomain: "amahaapp.firebaseapp.com",
  projectId: "amahaapp",
  storageBucket: "amahaapp.firebasestorage.app",
  messagingSenderId: "972893258212",
  appId: "1:972893258212:web:1f9a54fa450805ab2647f1",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const subcategories = [
  {
    categoryId: "kids", // Update with actual Kids category ID
    name: "math",
    label: "Math",
    description: "Numbers, addition, subtraction, multiplication, division",
    icon: "🔢",
    isPublished: true,
    quizCount: 0,
  },
  {
    categoryId: "kids",
    name: "english",
    label: "English",
    description: "Reading, writing, vocabulary, grammar",
    icon: "📖",
    isPublished: true,
    quizCount: 0,
  },
  {
    categoryId: "kids",
    name: "science",
    label: "Science",
    description: "Biology, physics, chemistry basics",
    icon: "🔬",
    isPublished: true,
    quizCount: 0,
  },
  {
    categoryId: "kids",
    name: "history",
    label: "History",
    description: "Historical events and facts",
    icon: "🏛️",
    isPublished: true,
    quizCount: 0,
  },
  {
    categoryId: "kids",
    name: "geography",
    label: "Geography",
    description: "Countries, capitals, landmarks",
    icon: "🌍",
    isPublished: true,
    quizCount: 0,
  },
];

async function seed() {
  try {
    console.log("🌱 Seeding subcategories...\n");

    // Check if category exists
    const categorySnap = await getDocs(
      query(collection(db, "categories"), where("name", "==", "Kids"))
    );

    if (categorySnap.empty) {
      console.log("❌ Kids category not found. Please create it first.");
      console.log("   Update the categoryId in this script with the actual Kids category ID");
      process.exit(1);
    }

    const categoryId = categorySnap.docs[0].id;
    console.log(`✅ Found Kids category with ID: ${categoryId}\n`);

    let count = 0;
    for (const subcat of subcategories) {
      const docRef = await addDoc(collection(db, "subtopics"), {
        ...subcat,
        categoryId: categoryId, // Use actual category ID
        createdAt: new Date(),
      });

      console.log(`✅ Created: ${subcat.label} (${docRef.id})`);
      count++;
    }

    console.log(`\n🎉 Successfully seeded ${count} subcategories!`);
    console.log("\n📝 Next steps:");
    console.log("   1. Go to Admin Panel > Subcategories");
    console.log("   2. Manage subcategories and assign quizzes");
    console.log("   3. Update question records to include subcategory field");
    console.log("   4. Test the subcategory flow on the home page");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding subcategories:", error);
    process.exit(1);
  }
}

seed();
