/**
 * Script to seed Firestore with real quiz data
 * Run with: node scripts/seedQuizData.js
 * 
 * This creates:
 * - Quiz feature
 * - 5 quiz categories
 * - Topics and subtopics for each category
 * - Sample questions for each subtopic
 */

import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs,
  query,
  where,
  deleteDoc 
} from "firebase/firestore";

// Firebase config (same as frontend)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Quiz Data Structure
const quizData = {
  feature: {
    id: "quiz-feature",
    name: "Quiz",
    label: "Quiz",
    type: "quiz",
    description: "Interactive quizzes to test your knowledge",
    icon: "🧠",
    color: "#3B82F6",
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  categories: [
    {
      id: "general-knowledge",
      name: "General Knowledge",
      label: "General Knowledge",
      description: "Test your overall knowledge across various topics",
      icon: "🌍",
      color: "#8B5CF6",
      featureId: "quiz-feature",
      isPublished: true,
      topics: [
        {
          id: "world-capitals",
          name: "World Capitals",
          label: "World Capitals",
          description: "Identify capitals of countries around the world",
          icon: "🏛️",
          color: "#06B6D4",
          subtopics: [
            {
              id: "europe-capitals",
              name: "European Capitals",
              label: "Europe",
              description: "Capitals of European countries",
              icon: "🇪🇺",
            },
            {
              id: "asia-capitals",
              name: "Asian Capitals",
              label: "Asia",
              description: "Capitals of Asian countries",
              icon: "🏯",
            },
          ],
        },
        {
          id: "historic-events",
          name: "Historic Events",
          label: "Historic Events",
          description: "Learn about major historical events",
          icon: "📚",
          color: "#F59E0B",
          subtopics: [
            {
              id: "ancient-history",
              name: "Ancient History",
              label: "Ancient",
              description: "Events from ancient civilizations",
              icon: "🏺",
            },
            {
              id: "modern-history",
              name: "Modern History",
              label: "Modern",
              description: "Events from recent centuries",
              icon: "📰",
            },
          ],
        },
      ],
    },
    {
      id: "science-quiz",
      name: "Science",
      label: "Science",
      description: "Biology, Physics, Chemistry and more",
      icon: "🔬",
      color: "#10B981",
      featureId: "quiz-feature",
      isPublished: true,
      topics: [
        {
          id: "biology",
          name: "Biology",
          label: "Biology",
          description: "Questions about life and living organisms",
          icon: "🧬",
          color: "#6366F1",
          subtopics: [
            {
              id: "human-body",
              name: "Human Body",
              label: "Human Body",
              description: "Anatomy and physiology",
              icon: "🫀",
            },
            {
              id: "plant-life",
              name: "Plant Life",
              label: "Plants",
              description: "Botany and plant biology",
              icon: "🌿",
            },
          ],
        },
        {
          id: "physics",
          name: "Physics",
          label: "Physics",
          description: "Mechanics, energy, and forces",
          icon: "⚛️",
          color: "#EC4899",
          subtopics: [
            {
              id: "motion-forces",
              name: "Motion and Forces",
              label: "Motion",
              description: "Laws of motion and forces",
              icon: "🎯",
            },
            {
              id: "energy",
              name: "Energy",
              label: "Energy",
              description: "Types and transformation of energy",
              icon: "⚡",
            },
          ],
        },
      ],
    },
    {
      id: "programming-quiz",
      name: "Programming",
      label: "Programming",
      description: "Test your coding knowledge",
      icon: "💻",
      color: "#EF4444",
      featureId: "quiz-feature",
      isPublished: true,
      topics: [
        {
          id: "fundamentals",
          name: "Programming Fundamentals",
          label: "Fundamentals",
          description: "Core concepts of programming",
          icon: "🔧",
          color: "#F97316",
          subtopics: [
            {
              id: "variables-data-types",
              name: "Variables and Data Types",
              label: "Variables",
              description: "Variables, constants, and data types",
              icon: "📦",
            },
            {
              id: "control-flow",
              name: "Control Flow",
              label: "Control Flow",
              description: "If/else, loops, and conditions",
              icon: "🔀",
            },
          ],
        },
        {
          id: "web-development",
          name: "Web Development",
          label: "Web Development",
          description: "HTML, CSS, JavaScript and frameworks",
          icon: "🌐",
          color: "#14B8A6",
          subtopics: [
            {
              id: "javascript",
              name: "JavaScript",
              label: "JavaScript",
              description: "JavaScript fundamentals and ES6+",
              icon: "⚡",
            },
            {
              id: "react",
              name: "React",
              label: "React",
              description: "React concepts and patterns",
              icon: "⚛️",
            },
          ],
        },
      ],
    },
    {
      id: "movies-quiz",
      name: "Movies",
      label: "Movies",
      description: "Cinema, actors and movie trivia",
      icon: "🎬",
      color: "#F87171",
      featureId: "quiz-feature",
      isPublished: true,
      topics: [
        {
          id: "movie-history",
          name: "Movie History",
          label: "History",
          description: "Classic and iconic films",
          icon: "🎞️",
          color: "#A855F7",
          subtopics: [
            {
              id: "classic-films",
              name: "Classic Films",
              label: "Classics",
              description: "Golden age cinema",
              icon: "📽️",
            },
            {
              id: "modern-blockbusters",
              name: "Modern Blockbusters",
              label: "Blockbusters",
              description: "Contemporary hit movies",
              icon: "🍿",
            },
          ],
        },
      ],
    },
    {
      id: "languages-quiz",
      name: "Languages",
      label: "Languages",
      description: "Learn and test languages",
      icon: "🗣️",
      color: "#22D3EE",
      featureId: "quiz-feature",
      isPublished: true,
      topics: [
        {
          id: "spanish",
          name: "Spanish",
          label: "Spanish",
          description: "Spanish language and culture",
          icon: "🇪🇸",
          color: "#FCD34D",
          subtopics: [
            {
              id: "spanish-vocabulary",
              name: "Spanish Vocabulary",
              label: "Vocabulary",
              description: "Spanish words and phrases",
              icon: "📚",
            },
            {
              id: "spanish-grammar",
              name: "Spanish Grammar",
              label: "Grammar",
              description: "Spanish grammar rules",
              icon: "✏️",
            },
          ],
        },
      ],
    },
  ],
};

// Sample questions for different subtopics
const generateQuestions = (subtopicName) => {
  const questionSets = {
    "European Capitals": [
      {
        question: "What is the capital of France?",
        options: ["Paris", "Lyon", "Marseille", "Nice"],
        correct: 0,
        difficulty: "easy",
      },
      {
        question: "Which city is the capital of Germany?",
        options: ["Berlin", "Munich", "Hamburg", "Cologne"],
        correct: 0,
        difficulty: "easy",
      },
      {
        question: "What is the capital of Spain?",
        options: ["Barcelona", "Madrid", "Seville", "Valencia"],
        correct: 1,
        difficulty: "easy",
      },
    ],
    "Asian Capitals": [
      {
        question: "What is the capital of Japan?",
        options: ["Osaka", "Tokyo", "Kyoto", "Yokohama"],
        correct: 1,
        difficulty: "easy",
      },
      {
        question: "Which city is the capital of India?",
        options: ["Mumbai", "New Delhi", "Bangalore", "Kolkata"],
        correct: 1,
        difficulty: "medium",
      },
    ],
    "Ancient History": [
      {
        question: "In which year was the Great Pyramid of Giza built?",
        options: ["Around 2589 BC", "Around 1200 BC", "Around 500 BC", "Around 100 BC"],
        correct: 0,
        difficulty: "medium",
      },
      {
        question: "Which civilization built Machu Picchu?",
        options: ["Aztec", "Inca", "Maya", "Olmec"],
        correct: 1,
        difficulty: "medium",
      },
    ],
    "Modern History": [
      {
        question: "In what year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correct: 2,
        difficulty: "easy",
      },
      {
        question: "Who was the first President of the United States?",
        options: ["Thomas Jefferson", "George Washington", "John Adams", "James Madison"],
        correct: 1,
        difficulty: "easy",
      },
    ],
    "Human Body": [
      {
        question: "How many bones are in the adult human body?",
        options: ["186", "206", "226", "246"],
        correct: 1,
        difficulty: "medium",
      },
      {
        question: "What is the largest organ in the human body?",
        options: ["Heart", "Brain", "Liver", "Skin"],
        correct: 3,
        difficulty: "medium",
      },
    ],
    "Plant Life": [
      {
        question: "What do plants primarily use for energy?",
        options: ["Water", "Soil", "Sunlight", "Air"],
        correct: 2,
        difficulty: "easy",
      },
      {
        question: "Which part of the plant absorbs water?",
        options: ["Leaves", "Stem", "Roots", "Flowers"],
        correct: 2,
        difficulty: "easy",
      },
    ],
    "Motion and Forces": [
      {
        question: "What is the SI unit of force?",
        options: ["Joule", "Newton", "Watt", "Pascal"],
        correct: 1,
        difficulty: "medium",
      },
      {
        question: "Which law states that for every action, there is an equal and opposite reaction?",
        options: ["First Law", "Second Law", "Third Law", "Fourth Law"],
        correct: 2,
        difficulty: "medium",
      },
    ],
    "Energy": [
      {
        question: "What is the SI unit of energy?",
        options: ["Watt", "Joule", "Newton", "Pascal"],
        correct: 1,
        difficulty: "easy",
      },
      {
        question: "Which type of energy is possessed by a moving object?",
        options: ["Potential energy", "Kinetic energy", "Thermal energy", "Chemical energy"],
        correct: 1,
        difficulty: "medium",
      },
    ],
    "Variables and Data Types": [
      {
        question: "Which of the following is a primitive data type in Java?",
        options: ["String", "Array", "int", "List"],
        correct: 2,
        difficulty: "easy",
      },
      {
        question: "What is a variable?",
        options: ["A function", "A named memory location", "A class", "A loop"],
        correct: 1,
        difficulty: "easy",
      },
    ],
    "Control Flow": [
      {
        question: "Which keyword is used to repeat code in most programming languages?",
        options: ["if", "while", "function", "class"],
        correct: 1,
        difficulty: "easy",
      },
      {
        question: "What does an 'if' statement do?",
        options: ["Creates a loop", "Declares a variable", "Executes code based on a condition", "Defines a function"],
        correct: 2,
        difficulty: "easy",
      },
    ],
    "JavaScript": [
      {
        question: "What is the correct way to declare a variable in modern JavaScript?",
        options: ["var x = 5;", "let x = 5;", "const x = 5;", "All of the above"],
        correct: 3,
        difficulty: "easy",
      },
      {
        question: "What does 'this' refer to in JavaScript?",
        options: ["The window object", "The current object", "The global object", "Depends on context"],
        correct: 3,
        difficulty: "hard",
      },
    ],
    "React": [
      {
        question: "What is a React component?",
        options: ["A style file", "A reusable piece of UI", "A database query", "A server endpoint"],
        correct: 1,
        difficulty: "easy",
      },
      {
        question: "What hook is used to manage state in functional components?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correct: 1,
        difficulty: "easy",
      },
    ],
    "Classic Films": [
      {
        question: "In what year was 'Casablanca' released?",
        options: ["1940", "1942", "1944", "1946"],
        correct: 1,
        difficulty: "medium",
      },
      {
        question: "Who directed 'Citizen Kane'?",
        options: ["John Ford", "Orson Welles", "Alfred Hitchcock", "Frank Capra"],
        correct: 1,
        difficulty: "hard",
      },
    ],
    "Blockbusters": [
      {
        question: "In which year was 'Avatar' released?",
        options: ["2007", "2008", "2009", "2010"],
        correct: 2,
        difficulty: "easy",
      },
      {
        question: "Who directed 'The Avengers' (2012)?",
        options: ["Jon Favreau", "Joss Whedon", "Anthony Russo", "Joe Russo"],
        correct: 1,
        difficulty: "medium",
      },
    ],
    "Spanish Vocabulary": [
      {
        question: "What is 'hello' in Spanish?",
        options: ["Adiós", "Hola", "Por favor", "Gracias"],
        correct: 1,
        difficulty: "easy",
      },
      {
        question: "How do you say 'thank you' in Spanish?",
        options: ["De nada", "Gracias", "Por favor", "Hola"],
        correct: 1,
        difficulty: "easy",
      },
    ],
    "Spanish Grammar": [
      {
        question: "What is the past tense of 'ser' in Spanish?",
        options: ["soy", "fue", "será", "sería"],
        correct: 1,
        difficulty: "medium",
      },
    ],
  };

  return questionSets[subtopicName] || [];
};

async function seedDatabase() {
  console.log("🌱 Starting to seed Firestore with quiz data...\n");

  try {
    // 1. Clear existing quiz data (optional - comment out if you want to keep existing data)
    console.log("🗑️ Clearing existing quiz data...");
    const featureQuery = query(collection(db, "features"), where("type", "==", "quiz"));
    const featureDocs = await getDocs(featureQuery);
    for (const doc of featureDocs.docs) {
      await deleteDoc(doc.ref);
      console.log(`  ✓ Deleted feature: ${doc.id}`);
    }

    const categoryQuery = query(collection(db, "categories"), where("featureId", "==", "quiz-feature"));
    const categoryDocs = await getDocs(categoryQuery);
    for (const doc of categoryDocs.docs) {
      await deleteDoc(doc.ref);
      console.log(`  ✓ Deleted category: ${doc.id}`);
    }

    // 2. Create Quiz Feature
    console.log("\n✨ Creating Quiz feature...");
    await setDoc(doc(db, "features", quizData.feature.id), quizData.feature);
    console.log(`  ✓ Created feature: ${quizData.feature.id}`);

    // 3. Create Categories, Topics, and Subtopics
    console.log("\n📂 Creating categories with topics and subtopics...");
    for (const category of quizData.categories) {
      // Create category
      const categoryData = { ...category };
      delete categoryData.topics;
      await setDoc(doc(db, "categories", category.id), categoryData);
      console.log(`  ✓ Created category: ${category.id}`);

      // Create topics for this category
      for (const topic of category.topics) {
        const topicData = { ...topic };
        delete topicData.subtopics;
        const topicDocPath = `categories/${category.id}/topics/${topic.id}`;
        await setDoc(doc(db, topicDocPath), topicData);
        console.log(`    ✓ Created topic: ${topic.id}`);

        // Create subtopics for this topic
        for (const subtopic of topic.subtopics) {
          const subtopicDocPath = `categories/${category.id}/topics/${topic.id}/subtopics/${subtopic.id}`;
          await setDoc(doc(db, subtopicDocPath), subtopic);
          console.log(`      ✓ Created subtopic: ${subtopic.id}`);

          // Create questions for this subtopic
          const questions = generateQuestions(subtopic.name);
          for (let i = 0; i < questions.length; i++) {
            const questionData = {
              ...questions[i],
              subtopic: subtopic.name,
              topic: topic.name,
              category: category.name,
              order: i + 1,
              createdAt: new Date(),
            };
            const questionId = `${subtopic.id}-q${i + 1}`;
            const questionDocPath = `categories/${category.id}/topics/${topic.id}/subtopics/${subtopic.id}/questions/${questionId}`;
            await setDoc(doc(db, questionDocPath), questionData);
          }
          console.log(`        ✓ Created ${questions.length} questions for ${subtopic.name}`);
        }
      }
    }

    console.log("\n✅ Quiz data seeding complete!");
    console.log("\n📊 Summary:");
    console.log(`  • 1 Quiz feature created`);
    console.log(`  • ${quizData.categories.length} categories created`);
    let totalTopics = 0;
    let totalSubtopics = 0;
    let totalQuestions = 0;
    
    for (const cat of quizData.categories) {
      totalTopics += cat.topics.length;
      for (const topic of cat.topics) {
        totalSubtopics += topic.subtopics.length;
        for (const subtopic of topic.subtopics) {
          const qs = generateQuestions(subtopic.name);
          totalQuestions += qs.length;
        }
      }
    }
    
    console.log(`  • ${totalTopics} topics created`);
    console.log(`  • ${totalSubtopics} subtopics created`);
    console.log(`  • ${totalQuestions} questions created`);
    console.log("\n🎯 Your quiz page is now ready with real data!");
    console.log("   Visit: http://localhost:3000/quiz");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
