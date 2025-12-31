#!/usr/bin/env node

/**
 * Add sample quizzes with proper data structure
 * Includes: category, difficulty, audience, questions, rating, plays
 * Usage: node addSampleQuizzesWithProperData.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase
const serviceAccountPath = path.join(__dirname, 'amaha-service-key.json');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
}

const db = admin.firestore();

const SAMPLE_QUIZZES = [
  // Science Quizzes
  {
    title: 'Biology Basics',
    description: 'Learn fundamental biology concepts including cells, photosynthesis, and ecosystem basics',
    category: 'Science',
    difficulty: 'Easy',
    audience: 'kids',
    avgTime: '8 min',
    rating: 4.8,
    plays: 245,
    totalQuestions: 5,
    questions: [
      {
        id: 'q1',
        text: 'What is the basic unit of life?',
        options: ['Atom', 'Cell', 'Molecule', 'Organ'],
        correctAnswer: 1,
        explanation: 'The cell is the basic unit of life. All living organisms are made of one or more cells.'
      },
      {
        id: 'q2',
        text: 'What is the process by which plants make their own food?',
        options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
        correctAnswer: 1,
        explanation: 'Photosynthesis is the process where plants use sunlight to convert carbon dioxide and water into glucose.'
      },
      {
        id: 'q3',
        text: 'Which of these is an example of a herbivore?',
        options: ['Lion', 'Rabbit', 'Snake', 'Eagle'],
        correctAnswer: 1,
        explanation: 'A herbivore is an animal that eats only plants. Rabbits are herbivores that eat grass and vegetables.'
      },
      {
        id: 'q4',
        text: 'What do we call a group of similar organisms?',
        options: ['Family', 'Species', 'Population', 'Community'],
        correctAnswer: 1,
        explanation: 'A species is a group of organisms that can reproduce together and produce fertile offspring.'
      },
      {
        id: 'q5',
        text: 'Which organ pumps blood throughout the body?',
        options: ['Brain', 'Lungs', 'Heart', 'Liver'],
        correctAnswer: 2,
        explanation: 'The heart is the main pumping organ that circulates blood to all parts of the body.'
      }
    ]
  },
  {
    title: 'Advanced Physics',
    description: 'Dive deep into mechanics, energy, and motion with challenging problems',
    category: 'Science',
    difficulty: 'Hard',
    audience: 'students',
    avgTime: '15 min',
    rating: 4.6,
    plays: 182,
    totalQuestions: 4,
    questions: [
      {
        id: 'q1',
        text: 'What is the SI unit of force?',
        options: ['Joule', 'Newton', 'Watt', 'Pascal'],
        correctAnswer: 1,
        explanation: 'The Newton (N) is the SI unit of force, named after Sir Isaac Newton. 1 N = 1 kg·m/s²'
      },
      {
        id: 'q2',
        text: 'What does E=mc² represent?',
        options: ['Energy and momentum', 'Mass-energy equivalence', 'Force and acceleration', 'Work and power'],
        correctAnswer: 1,
        explanation: 'E=mc² shows that energy and mass are interchangeable. A small amount of mass can produce enormous energy.'
      },
      {
        id: 'q3',
        text: 'Which law states that for every action there is an equal and opposite reaction?',
        options: ['First Law', 'Second Law', 'Third Law', 'Law of Gravitation'],
        correctAnswer: 2,
        explanation: 'Newton\'s Third Law of Motion states that forces always come in pairs - action and reaction forces.'
      },
      {
        id: 'q4',
        text: 'What is the acceleration due to gravity on Earth?',
        options: ['5.8 m/s²', '9.8 m/s²', '15.2 m/s²', '20 m/s²'],
        correctAnswer: 1,
        explanation: 'Earth\'s gravitational acceleration is approximately 9.8 m/s² or 10 m/s² for simplifications.'
      }
    ]
  },

  // Mathematics Quizzes
  {
    title: 'Algebra Mastery',
    description: 'Master equations, functions, and polynomial expressions',
    category: 'Mathematics',
    difficulty: 'Medium',
    audience: 'students',
    avgTime: '12 min',
    rating: 4.7,
    plays: 318,
    totalQuestions: 5,
    questions: [
      {
        id: 'q1',
        text: 'Solve: 2x + 5 = 13',
        options: ['x = 4', 'x = 5', 'x = 6', 'x = 9'],
        correctAnswer: 0,
        explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4'
      },
      {
        id: 'q2',
        text: 'What is (a + b)²?',
        options: ['a² + b²', 'a² + 2ab + b²', 'a² + ab + b²', 'a + 2ab + b'],
        correctAnswer: 1,
        explanation: '(a + b)² = a² + 2ab + b² is a fundamental algebraic identity.'
      },
      {
        id: 'q3',
        text: 'Find the vertex of y = x² - 4x + 3',
        options: ['(2, -1)', '(1, 0)', '(0, 3)', '(-1, 8)'],
        correctAnswer: 0,
        explanation: 'Vertex form: x = -b/2a = 4/2 = 2, y = 4 - 8 + 3 = -1. Vertex is (2, -1)'
      },
      {
        id: 'q4',
        text: 'What is the slope of the line 3x - 2y = 6?',
        options: ['3', '-2', '3/2', '-3/2'],
        correctAnswer: 2,
        explanation: 'Rewrite as y = (3/2)x - 3. The slope is the coefficient of x, which is 3/2'
      },
      {
        id: 'q5',
        text: 'If f(x) = 2x + 3, what is f(5)?',
        options: ['10', '13', 'f5', '15'],
        correctAnswer: 1,
        explanation: 'f(5) = 2(5) + 3 = 10 + 3 = 13'
      }
    ]
  },
  {
    title: 'Geometry Basics',
    description: 'Understand shapes, angles, and spatial relationships',
    category: 'Mathematics',
    difficulty: 'Easy',
    audience: 'kids',
    avgTime: '10 min',
    rating: 4.9,
    plays: 421,
    totalQuestions: 5,
    questions: [
      {
        id: 'q1',
        text: 'How many sides does a pentagon have?',
        options: ['4', '5', '6', '8'],
        correctAnswer: 1,
        explanation: 'A pentagon is a polygon with 5 sides. The prefix "penta" means 5.'
      },
      {
        id: 'q2',
        text: 'What is the sum of angles in a triangle?',
        options: ['90°', '180°', '270°', '360°'],
        correctAnswer: 1,
        explanation: 'The sum of all interior angles in any triangle is always 180 degrees.'
      },
      {
        id: 'q3',
        text: 'What is the formula for the area of a circle?',
        options: ['πr', 'πr²', '2πr', '2πr²'],
        correctAnswer: 1,
        explanation: 'The area of a circle is πr², where r is the radius.'
      },
      {
        id: 'q4',
        text: 'What is a right angle?',
        options: ['45°', '90°', '120°', '180°'],
        correctAnswer: 1,
        explanation: 'A right angle measures exactly 90 degrees. It\'s the angle at the corner of a square.'
      },
      {
        id: 'q5',
        text: 'Which shape has all equal sides and all equal angles?',
        options: ['Rectangle', 'Trapezoid', 'Regular polygon', 'Scalene triangle'],
        correctAnswer: 2,
        explanation: 'A regular polygon has all sides of equal length and all angles of equal measure.'
      }
    ]
  },

  // History Quizzes
  {
    title: 'World History Essentials',
    description: 'Test your knowledge of major historical events and civilizations',
    category: 'History',
    difficulty: 'Medium',
    audience: 'students',
    avgTime: '11 min',
    rating: 4.5,
    plays: 156,
    totalQuestions: 5,
    questions: [
      {
        id: 'q1',
        text: 'In which year did World War II end?',
        options: ['1943', '1944', '1945', '1946'],
        correctAnswer: 2,
        explanation: 'World War II officially ended in 1945, with the surrender of Japan on September 2, 1945.'
      },
      {
        id: 'q2',
        text: 'Who was the first President of the United States?',
        options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'James Madison'],
        correctAnswer: 1,
        explanation: 'George Washington served as the first President of the United States from 1789 to 1797.'
      },
      {
        id: 'q3',
        text: 'Which ancient wonder is still standing today?',
        options: ['Colossus of Rhodes', 'Hanging Gardens', 'Great Pyramid of Giza', 'Lighthouse of Alexandria'],
        correctAnswer: 2,
        explanation: 'The Great Pyramid of Giza is the only surviving ancient wonder of the world.'
      },
      {
        id: 'q4',
        text: 'In what year did the Berlin Wall fall?',
        options: ['1987', '1988', '1989', '1991'],
        correctAnswer: 2,
        explanation: 'The Berlin Wall fell on November 9, 1989, marking a major step towards German reunification.'
      },
      {
        id: 'q5',
        text: 'Who discovered America in 1492?',
        options: ['Amerigo Vespucci', 'Christopher Columbus', 'Ferdinand Magellan', 'Bartolomeu Dias'],
        correctAnswer: 1,
        explanation: 'Christopher Columbus sailed across the Atlantic and reached the Americas in 1492.'
      }
    ]
  },

  // Geography Quizzes
  {
    title: 'Geography Fundamentals',
    description: 'Learn about countries, capitals, and geographical features',
    category: 'Geography',
    difficulty: 'Easy',
    audience: 'kids',
    avgTime: '9 min',
    rating: 4.8,
    plays: 267,
    totalQuestions: 5,
    questions: [
      {
        id: 'q1',
        text: 'What is the capital of France?',
        options: ['Lyon', 'Paris', 'Marseille', 'Nice'],
        correctAnswer: 1,
        explanation: 'Paris is the capital and largest city of France, located in the north-central part of the country.'
      },
      {
        id: 'q2',
        text: 'Which is the largest ocean on Earth?',
        options: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean', 'Pacific Ocean'],
        correctAnswer: 3,
        explanation: 'The Pacific Ocean is the largest ocean, covering about 165 million square kilometers.'
      },
      {
        id: 'q3',
        text: 'What is the capital of Japan?',
        options: ['Osaka', 'Tokyo', 'Kyoto', 'Yokohama'],
        correctAnswer: 1,
        explanation: 'Tokyo is the capital and largest city of Japan, located on the eastern coast.'
      },
      {
        id: 'q4',
        text: 'Which continent is known as the "Dark Continent"?',
        options: ['Asia', 'Africa', 'South America', 'Antarctica'],
        correctAnswer: 1,
        explanation: 'Africa was historically called the "Dark Continent" due to limited European knowledge of its interior.'
      },
      {
        id: 'q5',
        text: 'What is the longest river in the world?',
        options: ['Amazon', 'Yangtze', 'Nile', 'Mississippi'],
        correctAnswer: 2,
        explanation: 'The Nile River in Africa is the longest river in the world at approximately 6,650 kilometers.'
      }
    ]
  },

  // Literature Quizzes
  {
    title: 'Classic Literature',
    description: 'Test your knowledge of famous books and authors',
    category: 'Literature',
    difficulty: 'Medium',
    audience: 'students',
    avgTime: '10 min',
    rating: 4.7,
    plays: 198,
    totalQuestions: 4,
    questions: [
      {
        id: 'q1',
        text: 'Who wrote "Pride and Prejudice"?',
        options: ['Charlotte Brontë', 'Jane Austen', 'Emily Dickinson', 'George Eliot'],
        correctAnswer: 1,
        explanation: 'Jane Austen wrote "Pride and Prejudice", published in 1813. It\'s a classic of English literature.'
      },
      {
        id: 'q2',
        text: 'What is the main theme of "1984" by George Orwell?',
        options: ['Love and romance', 'Totalitarianism and control', 'Adventure', 'Mystery'],
        correctAnswer: 1,
        explanation: '"1984" explores themes of totalitarianism, surveillance, and the control of information by government.'
      },
      {
        id: 'q3',
        text: 'Who is the author of "The Great Gatsby"?',
        options: ['Ernest Hemingway', 'F. Scott Fitzgerald', 'John Steinbeck', 'William Faulkner'],
        correctAnswer: 1,
        explanation: 'F. Scott Fitzgerald wrote "The Great Gatsby", published in 1925. It\'s set in the Jazz Age.'
      },
      {
        id: 'q4',
        text: 'In "To Kill a Mockingbird", who is the main character?',
        options: ['Atticus Finch', 'Scout Finch', 'Boo Radley', 'Mayella Ewell'],
        correctAnswer: 1,
        explanation: 'Scout Finch is the narrator and main character of "To Kill a Mockingbird" by Harper Lee.'
      }
    ]
  },

  // Technology Quizzes
  {
    title: 'Web Development Fundamentals',
    description: 'Learn the basics of HTML, CSS, and JavaScript for web development',
    category: 'Technology',
    difficulty: 'Medium',
    audience: 'programmers',
    avgTime: '13 min',
    rating: 4.6,
    plays: 342,
    totalQuestions: 5,
    questions: [
      {
        id: 'q1',
        text: 'What does HTML stand for?',
        options: ['Hypertext Machine Language', 'Hypertext Markup Language', 'High Tech Markup Language', 'Hypertext Management Language'],
        correctAnswer: 1,
        explanation: 'HTML stands for HyperText Markup Language. It\'s the standard markup language for creating web pages.'
      },
      {
        id: 'q2',
        text: 'Which of these is a JavaScript framework?',
        options: ['Django', 'Laravel', 'React', 'Flask'],
        correctAnswer: 2,
        explanation: 'React is a JavaScript library for building user interfaces with reusable components.'
      },
      {
        id: 'q3',
        text: 'What does CSS stand for?',
        options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Coded Style Sheets'],
        correctAnswer: 1,
        explanation: 'CSS stands for Cascading Style Sheets. It\'s used to style HTML elements.'
      },
      {
        id: 'q4',
        text: 'Which HTTP method is used to send data to a server?',
        options: ['GET', 'POST', 'PATCH', 'DELETE'],
        correctAnswer: 1,
        explanation: 'POST is used to send data to a server. GET retrieves data, PATCH updates, DELETE removes.'
      },
      {
        id: 'q5',
        text: 'What is the purpose of a database?',
        options: ['Display web pages', 'Store and retrieve data', 'Compile code', 'Manage servers'],
        correctAnswer: 1,
        explanation: 'A database is used to store, organize, and retrieve data efficiently for applications.'
      }
    ]
  },

  // Professionals Quiz
  {
    title: 'Business Management',
    description: 'Understand core principles of business management and leadership',
    category: 'Technology',
    difficulty: 'Hard',
    audience: 'professionals',
    avgTime: '14 min',
    rating: 4.5,
    plays: 89,
    totalQuestions: 4,
    questions: [
      {
        id: 'q1',
        text: 'What is a SWOT analysis?',
        options: ['Strategic Weakness Opportunity Threat', 'Strength Weakness Opportunity Threat', 'Strategic Work On Tasks', 'Systematic Workflow Organization Tool'],
        correctAnswer: 1,
        explanation: 'SWOT is a strategic planning tool that analyzes Strengths, Weaknesses, Opportunities, and Threats.'
      },
      {
        id: 'q2',
        text: 'What does ROI stand for?',
        options: ['Return on Investment', 'Rate of Interest', 'Resource Organization Index', 'Return on Income'],
        correctAnswer: 0,
        explanation: 'ROI (Return on Investment) measures the profitability of an investment as a percentage.'
      },
      {
        id: 'q3',
        text: 'Which management approach focuses on continuous improvement?',
        options: ['Lean Management', 'Traditional', 'Waterfall', 'Chaos Theory'],
        correctAnswer: 0,
        explanation: 'Lean Management focuses on continuous improvement and eliminating waste in processes.'
      },
      {
        id: 'q4',
        text: 'What is stakeholder management?',
        options: ['Managing money', 'Identifying and engaging with people affected by decisions', 'Stock market trading', 'Managing employees'],
        correctAnswer: 1,
        explanation: 'Stakeholder management involves identifying, analyzing, and engaging with all stakeholders.'
      }
    ]
  }
];

async function addSampleQuizzes() {
  try {
    console.log('🎓 Adding sample quizzes with proper data...\n');
    
    const quizzesRef = db.collection('quizzes');
    let added = 0;

    for (const quiz of SAMPLE_QUIZZES) {
      const quizData = {
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        audience: quiz.audience,
        avgTime: quiz.avgTime,
        rating: quiz.rating,
        plays: quiz.plays,
        totalQuestions: quiz.totalQuestions,
        questions: quiz.questions,
        createdAt: new Date().toISOString(),
      };

      // Add document with auto-generated ID
      const docRef = await quizzesRef.add(quizData);
      added++;

      console.log(`✅ Added: "${quiz.title}"`);
      console.log(`   📁 ID: ${docRef.id}`);
      console.log(`   📚 Category: ${quiz.category} | Difficulty: ${quiz.difficulty} | Audience: ${quiz.audience}`);
      console.log(`   ❓ Questions: ${quiz.totalQuestions} | ⭐ Rating: ${quiz.rating} | ▶️ Plays: ${quiz.plays}\n`);
    }

    console.log(`\n🎉 Successfully added ${added} sample quizzes!`);
    console.log('\n📊 Summary:');
    console.log('   Science: 2 quizzes');
    console.log('   Mathematics: 2 quizzes');
    console.log('   History: 1 quiz');
    console.log('   Geography: 1 quiz');
    console.log('   Literature: 1 quiz');
    console.log('   Technology: 2 quizzes');
    console.log('\n🎯 Coverage:');
    console.log('   Difficulties: Easy (2), Medium (4), Hard (2)');
    console.log('   Audiences: kids (2), students (4), professionals (1), programmers (1)');
    console.log('\n🔗 Visit http://localhost:3000/quiz to see all quizzes');
    console.log('🧪 Test the filters:');
    console.log('   • Filter by Category (Science, Math, History, etc.)');
    console.log('   • Filter by Audience (Kids, Students, Professionals, Programmers)');
    console.log('   • Combine filters to narrow results\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding quizzes:', error);
    process.exit(1);
  }
}

addSampleQuizzes();
