// Dashboard constants, templates, and data definitions
// Extracted from ModernAdminDashboard.jsx to reduce main file size

export const STORY_TEMPLATES = [
  {
    id: 'kids-3-chapter-adventure',
    title: 'Kids Adventure',
    description: 'Wholesome 3-part journey',
    fullDescription: 'Wholesome 3-part journey with simple language and visuals.',
    chapters: 3,
    targetAudience: 'kids',
    color: '#8b5cf6',
    chapterDetails: [
      { title: 'The Beginning', description: 'Meet the hero and the goal.' },
      { title: 'The Challenge', description: 'Overcome an obstacle with help.' },
      { title: 'Happy Ending', description: 'Celebrate the win and a lesson.' },
    ],
  },
  {
    id: 'general-5-chapter-guide',
    title: 'General Guide',
    description: 'Structured 5-chapter format',
    fullDescription: 'Structured guide format ideal for learning topics.',
    chapters: 5,
    targetAudience: 'general',
    color: '#10b981',
    chapterDetails: [
      { title: 'Overview', description: 'Scope and goals.' },
      { title: 'Fundamentals', description: 'Core concepts explained.' },
      { title: 'Examples', description: 'Illustrative examples.' },
      { title: 'Practice', description: 'Exercises or reflections.' },
      { title: 'Summary', description: 'Key takeaways and next steps.' },
    ],
  },
  {
    id: 'programmer-4-part-tutorial',
    title: 'Programmer Tutorial',
    description: 'Hands-on 4-part tutorial',
    fullDescription: 'Hands-on tutorial with steps and checkpoints.',
    chapters: 4,
    targetAudience: 'programmers',
    color: '#2563eb',
    chapterDetails: [
      { title: 'Setup', description: 'Environment and prerequisites.' },
      { title: 'Build', description: 'Implement the feature step-by-step.' },
      { title: 'Test', description: 'Validate with examples and edge cases.' },
      { title: 'Ship', description: 'Polish, deploy, and monitor.' },
    ],
  },
];

export const SAMPLE_QUIZZES = [
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
      { id: 'q1', text: 'What is the basic unit of life?', options: ['Atom', 'Cell', 'Molecule', 'Organ'], correctAnswer: 1, explanation: 'The cell is the basic unit of life.' },
      { id: 'q2', text: 'What is photosynthesis?', options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'], correctAnswer: 1, explanation: 'Photosynthesis is how plants make food.' },
      { id: 'q3', text: 'Which is a herbivore?', options: ['Lion', 'Rabbit', 'Snake', 'Eagle'], correctAnswer: 1, explanation: 'Rabbits are herbivores.' },
      { id: 'q4', text: 'What is a species?', options: ['Family', 'Species', 'Population', 'Community'], correctAnswer: 1, explanation: 'A species is a group of organisms.' },
      { id: 'q5', text: 'Which organ pumps blood?', options: ['Brain', 'Lungs', 'Heart', 'Liver'], correctAnswer: 2, explanation: 'The heart pumps blood.' }
    ]
  },
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
      { id: 'q1', text: 'Solve: 2x + 5 = 13', options: ['x = 4', 'x = 5', 'x = 6', 'x = 9'], correctAnswer: 0, explanation: 'x = 4' },
      { id: 'q2', text: 'What is (a + b)²?', options: ['a² + b²', 'a² + 2ab + b²', 'a² + ab + b²', 'a + 2ab + b'], correctAnswer: 1, explanation: '(a + b)² = a² + 2ab + b²' },
      { id: 'q3', text: 'Find the vertex of y = x² - 4x + 3', options: ['(2, -1)', '(1, 0)', '(0, 3)', '(-1, 8)'], correctAnswer: 0, explanation: 'Vertex is (2, -1)' },
      { id: 'q4', text: 'What is the slope of 3x - 2y = 6?', options: ['3', '-2', '3/2', '-3/2'], correctAnswer: 2, explanation: 'Slope is 3/2' },
      { id: 'q5', text: 'If f(x) = 2x + 3, what is f(5)?', options: ['10', '13', 'f5', '15'], correctAnswer: 1, explanation: 'f(5) = 13' }
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
      { id: 'q1', text: 'How many sides does a pentagon have?', options: ['4', '5', '6', '8'], correctAnswer: 1, explanation: 'Pentagon has 5 sides.' },
      { id: 'q2', text: 'What is the sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], correctAnswer: 1, explanation: 'Sum is 180 degrees.' },
      { id: 'q3', text: 'What is the formula for the area of a circle?', options: ['πr', 'πr²', '2πr', '2πr²'], correctAnswer: 1, explanation: 'Area = πr²' },
      { id: 'q4', text: 'What is a right angle?', options: ['45°', '90°', '120°', '180°'], correctAnswer: 1, explanation: 'Right angle = 90°' },
      { id: 'q5', text: 'Which shape has all equal sides and angles?', options: ['Rectangle', 'Trapezoid', 'Regular polygon', 'Scalene triangle'], correctAnswer: 2, explanation: 'Regular polygon has equal sides and angles.' }
    ]
  },
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
      { id: 'q1', text: 'In which year did World War II end?', options: ['1943', '1944', '1945', '1946'], correctAnswer: 2, explanation: 'WWII ended in 1945.' },
      { id: 'q2', text: 'Who was the first President of the United States?', options: ['Thomas Jefferson', 'George Washington', 'John Adams', 'James Madison'], correctAnswer: 1, explanation: 'George Washington was first.' },
      { id: 'q3', text: 'Which ancient wonder is still standing?', options: ['Colossus of Rhodes', 'Hanging Gardens', 'Great Pyramid of Giza', 'Lighthouse of Alexandria'], correctAnswer: 2, explanation: 'Great Pyramid of Giza still stands.' },
      { id: 'q4', text: 'In what year did the Berlin Wall fall?', options: ['1987', '1988', '1989', '1991'], correctAnswer: 2, explanation: 'Berlin Wall fell in 1989.' },
      { id: 'q5', text: 'Who discovered America in 1492?', options: ['Amerigo Vespucci', 'Christopher Columbus', 'Ferdinand Magellan', 'Bartolomeu Dias'], correctAnswer: 1, explanation: 'Christopher Columbus.' }
    ]
  },
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
      { id: 'q1', text: 'What is the capital of France?', options: ['Lyon', 'Paris', 'Marseille', 'Nice'], correctAnswer: 1, explanation: 'Paris is the capital.' },
      { id: 'q2', text: 'Which is the largest ocean?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 3, explanation: 'Pacific Ocean is largest.' },
      { id: 'q3', text: 'What is the capital of Japan?', options: ['Osaka', 'Tokyo', 'Kyoto', 'Yokohama'], correctAnswer: 1, explanation: 'Tokyo is the capital.' },
      { id: 'q4', text: 'Which continent is the "Dark Continent"?', options: ['Asia', 'Africa', 'South America', 'Antarctica'], correctAnswer: 1, explanation: 'Africa was called the Dark Continent.' },
      { id: 'q5', text: 'What is the longest river?', options: ['Amazon', 'Yangtze', 'Nile', 'Mississippi'], correctAnswer: 2, explanation: 'Nile is the longest.' }
    ]
  },
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
      { id: 'q1', text: 'Who wrote "Pride and Prejudice"?', options: ['Charlotte Brontë', 'Jane Austen', 'Emily Dickinson', 'George Eliot'], correctAnswer: 1, explanation: 'Jane Austen wrote it.' },
      { id: 'q2', text: 'What is the main theme of "1984"?', options: ['Love', 'Totalitarianism', 'Adventure', 'Mystery'], correctAnswer: 1, explanation: 'Totalitarianism and control.' },
      { id: 'q3', text: 'Who wrote "The Great Gatsby"?', options: ['Ernest Hemingway', 'F. Scott Fitzgerald', 'John Steinbeck', 'William Faulkner'], correctAnswer: 1, explanation: 'F. Scott Fitzgerald.' },
      { id: 'q4', text: 'Who is the main character in "To Kill a Mockingbird"?', options: ['Atticus Finch', 'Scout Finch', 'Boo Radley', 'Mayella Ewell'], correctAnswer: 1, explanation: 'Scout Finch is the narrator.' }
    ]
  },
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
      { id: 'q1', text: 'What does HTML stand for?', options: ['Hypertext Machine Language', 'Hypertext Markup Language', 'High Tech Markup Language', 'Hypertext Management Language'], correctAnswer: 1, explanation: 'Hypertext Markup Language.' },
      { id: 'q2', text: 'Which is a JavaScript framework?', options: ['Django', 'Laravel', 'React', 'Flask'], correctAnswer: 2, explanation: 'React is a JavaScript library.' },
      { id: 'q3', text: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Coded Style Sheets'], correctAnswer: 1, explanation: 'Cascading Style Sheets.' },
      { id: 'q4', text: 'Which HTTP method sends data to a server?', options: ['GET', 'POST', 'PATCH', 'DELETE'], correctAnswer: 1, explanation: 'POST sends data.' },
      { id: 'q5', text: 'What is the purpose of a database?', options: ['Display web pages', 'Store and retrieve data', 'Compile code', 'Manage servers'], correctAnswer: 1, explanation: 'Store and retrieve data.' }
    ]
  }
];
