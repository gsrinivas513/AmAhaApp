/**
 * Seed Script: Create 11 Sample Quizzes with Difficulty Variants
 * Each quiz has Easy (5Q), Medium (3Q), Hard (4Q), Expert (5Q)
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Helper to remove undefined values from an object
const cleanUndefined = (obj) => {
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

const createQuizWithVariants = (baseQuiz) => {
  // Transform all questions to flat structure before storing in variants
  const transformedQuestions = baseQuiz.questions.map((q) => {
    const quizType = baseQuiz.quizType;
    let transformed = {};
    
    // Keep only essential fields from original question
    if (q.id) transformed.id = q.id;
    if (q.sequence) transformed.sequence = q.sequence;
    if (q.quizType) transformed.quizType = q.quizType;
    if (q.points) transformed.points = q.points;
    if (q.hint) transformed.hint = q.hint;
    if (q.explanation) transformed.explanation = q.explanation;
    
    // Transform based on quiz type
    if (quizType === 'MCQ') {
      transformed.text = q.question.text;
      transformed.options = q.answer.options.map(opt => opt.text);
      transformed.correctAnswer = q.answer.correctOption;
    } else if (quizType === 'MULTI_SELECT') {
      transformed.text = q.question.text;
      transformed.options = q.answer.options.map(opt => opt.text);
      transformed.correctAnswers = q.answer.correctOptions;
    } else if (quizType === 'TRUE_FALSE') {
      transformed.text = q.question.text;
      transformed.options = ['True', 'False'];
      transformed.correctAnswer = q.answer.isTrue ? 0 : 1;
    } else if (quizType === 'FILL_BLANK') {
      transformed.text = q.question.text;
      transformed.correctAnswers = q.answer.correctAnswers;
    } else if (quizType === 'MATCHING') {
      transformed.text = q.question.text;
      transformed.pairs = q.answer.pairs;
    } else if (quizType === 'ORDERING') {
      transformed.text = q.question.text;
      transformed.correctOrder = q.answer.correctOrder;
    } else if (quizType === 'IMAGE_BASED') {
      transformed.text = q.question.text;
      if (q.question.image) transformed.image = q.question.image;
      transformed.options = q.answer.options.map(opt => opt.text);
      transformed.correctAnswer = q.answer.correctOption;
    } else if (quizType === 'AUDIO_BASED') {
      transformed.text = q.question.text;
      if (q.question.audio) transformed.audio = q.question.audio;
      transformed.options = q.answer.options.map(opt => opt.text);
      transformed.correctAnswer = q.answer.correctOption;
    } else {
      // For PUZZLE, DRAG_DROP, CODING
      transformed.text = q.question.text;
      transformed.correctAnswer = q.answer.correctAnswer;
    }
    
    // Clean up undefined values
    return cleanUndefined(transformed);
  });

  return {
    ...baseQuiz,
    levelVariants: {
      Easy: {
        difficulty: 'Easy',
        questionCount: 5,
        questions: transformedQuestions.slice(0, 5),
      },
      Medium: {
        difficulty: 'Medium',
        questionCount: 3,
        questions: transformedQuestions.slice(5, 8),
      },
      Hard: {
        difficulty: 'Hard',
        questionCount: 4,
        questions: transformedQuestions.slice(8, 12),
      },
      Expert: {
        difficulty: 'Expert',
        questionCount: 5,
        questions: transformedQuestions.slice(12, 17),
      },
    },
    totalVariants: 4,
    totalQuestionsAcrossVariants: 17,
  };
};

const QUIZ_SEED_DATA = [
  // 1. MCQ with variants
  createQuizWithVariants({
    title: '🎯 Multiple Choice Question Quiz',
    description: 'Test your knowledge with multiple choice questions across all difficulty levels',
    category: 'science',
    audience: 'all',
    quizType: 'MCQ',
    rating: 4.5,
    plays: 245,
    avgTime: '10-20 min',
    coverImage: '🎯',
    questions: [
      // EASY (5Q)
      {
        id: 'q1_mcq', sequence: 1, quizType: 'MCQ', points: 10,
        question: { text: 'What is the capital of France?' },
        answer: { options: [{ key: 'A', text: 'London', media: null }, { key: 'B', text: 'Paris', media: null }, { key: 'C', text: 'Berlin', media: null }, { key: 'D', text: 'Madrid', media: null }], correctOption: 'B' },
        hint: "It's known as the City of Light", explanation: 'Paris is the capital of France.'
      },
      {
        id: 'q2_mcq', sequence: 2, quizType: 'MCQ', points: 10,
        question: { text: 'What color is the sky on a clear day?' },
        answer: { options: [{ key: 'A', text: 'Green', media: null }, { key: 'B', text: 'Blue', media: null }, { key: 'C', text: 'Red', media: null }, { key: 'D', text: 'Yellow', media: null }], correctOption: 'B' },
        hint: 'Think about a sunny day', explanation: 'The sky appears blue due to Rayleigh scattering.'
      },
      {
        id: 'q3_mcq', sequence: 3, quizType: 'MCQ', points: 10,
        question: { text: 'How many continents are there?' },
        answer: { options: [{ key: 'A', text: '5', media: null }, { key: 'B', text: '6', media: null }, { key: 'C', text: '7', media: null }, { key: 'D', text: '8', media: null }], correctOption: 'C' },
        hint: 'Count from North to South', explanation: 'There are 7 continents: North America, South America, Europe, Africa, Asia, Australia, and Antarctica.'
      },
      {
        id: 'q4_mcq', sequence: 4, quizType: 'MCQ', points: 10,
        question: { text: 'What is H2O?' },
        answer: { options: [{ key: 'A', text: 'Salt', media: null }, { key: 'B', text: 'Water', media: null }, { key: 'C', text: 'Oxygen', media: null }, { key: 'D', text: 'Hydrogen', media: null }], correctOption: 'B' },
        hint: 'Common compound', explanation: 'H2O is the chemical formula for water.'
      },
      {
        id: 'q5_mcq', sequence: 5, quizType: 'MCQ', points: 10,
        question: { text: 'Which planet is closest to the Sun?' },
        answer: { options: [{ key: 'A', text: 'Venus', media: null }, { key: 'B', text: 'Mercury', media: null }, { key: 'C', text: 'Earth', media: null }, { key: 'D', text: 'Mars', media: null }], correctOption: 'B' },
        hint: 'It is the smallest planet', explanation: 'Mercury is the closest planet to the Sun.'
      },
      // MEDIUM (3Q)
      {
        id: 'q6_mcq', sequence: 6, quizType: 'MCQ', points: 15,
        question: { text: 'What is the Great Barrier Reef made of?' },
        answer: { options: [{ key: 'A', text: 'Rocks', media: null }, { key: 'B', text: 'Sand', media: null }, { key: 'C', text: 'Coral', media: null }, { key: 'D', text: 'Plants', media: null }], correctOption: 'C' },
        hint: 'Living organisms', explanation: 'The Great Barrier Reef is made of coral polyps.'
      },
      {
        id: 'q7_mcq', sequence: 7, quizType: 'MCQ', points: 15,
        question: { text: 'What percentage of Earth is covered by water?' },
        answer: { options: [{ key: 'A', text: '50%', media: null }, { key: 'B', text: '65%', media: null }, { key: 'C', text: '71%', media: null }, { key: 'D', text: '85%', media: null }], correctOption: 'C' },
        hint: 'More than half', explanation: 'Approximately 71% of Earth is covered by water.'
      },
      {
        id: 'q8_mcq', sequence: 8, quizType: 'MCQ', points: 15,
        question: { text: 'Who painted the Mona Lisa?' },
        answer: { options: [{ key: 'A', text: 'Michelangelo', media: null }, { key: 'B', text: 'Leonardo da Vinci', media: null }, { key: 'C', text: 'Raphael', media: null }, { key: 'D', text: 'Donatello', media: null }], correctOption: 'B' },
        hint: 'Renaissance artist', explanation: 'Leonardo da Vinci painted the Mona Lisa.'
      },
      // HARD (4Q)
      {
        id: 'q9_mcq', sequence: 9, quizType: 'MCQ', points: 20,
        question: { text: 'What is the chemical symbol for Gold?' },
        answer: { options: [{ key: 'A', text: 'Go', media: null }, { key: 'B', text: 'Gd', media: null }, { key: 'C', text: 'Au', media: null }, { key: 'D', text: 'Ag', media: null }], correctOption: 'C' },
        hint: 'Latin origin', explanation: 'Au is the symbol for Gold from its Latin name Aurum.'
      },
      {
        id: 'q10_mcq', sequence: 10, quizType: 'MCQ', points: 20,
        question: { text: 'What is the speed of light?' },
        answer: { options: [{ key: 'A', text: '300,000 km/s', media: null }, { key: 'B', text: '150,000 km/s', media: null }, { key: 'C', text: '450,000 km/s', media: null }, { key: 'D', text: '100,000 km/s', media: null }], correctOption: 'A' },
        hint: 'Approximately 3 × 10^8 m/s', explanation: 'The speed of light in vacuum is approximately 300,000 km/s.'
      },
      {
        id: 'q11_mcq', sequence: 11, quizType: 'MCQ', points: 20,
        question: { text: 'Which scientist developed the theory of evolution?' },
        answer: { options: [{ key: 'A', text: 'Isaac Newton', media: null }, { key: 'B', text: 'Charles Darwin', media: null }, { key: 'C', text: 'Albert Einstein', media: null }, { key: 'D', text: 'Galileo Galilei', media: null }], correctOption: 'B' },
        hint: 'Natural selection', explanation: 'Charles Darwin developed the theory of evolution.'
      },
      {
        id: 'q12_mcq', sequence: 12, quizType: 'MCQ', points: 20,
        question: { text: 'What is the smallest prime number?' },
        answer: { options: [{ key: 'A', text: '0', media: null }, { key: 'B', text: '1', media: null }, { key: 'C', text: '2', media: null }, { key: 'D', text: '3', media: null }], correctOption: 'C' },
        hint: 'The only even prime', explanation: '2 is the smallest and only even prime number.'
      },
      // EXPERT (5Q)
      {
        id: 'q13_mcq', sequence: 13, quizType: 'MCQ', points: 25,
        question: { text: 'What is the Planck constant approximately equal to?' },
        answer: { options: [{ key: 'A', text: '6.626 × 10^-34', media: null }, { key: 'B', text: '6.626 × 10^-33', media: null }, { key: 'C', text: '6.626 × 10^-35', media: null }, { key: 'D', text: '6.626 × 10^-32', media: null }], correctOption: 'A' },
        hint: 'Quantum mechanics constant', explanation: 'Planck constant is 6.62607015 × 10^-34 J·s.'
      },
      {
        id: 'q14_mcq', sequence: 14, quizType: 'MCQ', points: 25,
        question: { text: 'What is the primary structure of proteins determined by?' },
        answer: { options: [{ key: 'A', text: 'Temperature', media: null }, { key: 'B', text: 'pH level', media: null }, { key: 'C', text: 'Amino acid sequence', media: null }, { key: 'D', text: 'Enzyme activity', media: null }], correctOption: 'C' },
        hint: 'Molecular biology', explanation: 'Primary structure of proteins is determined by the amino acid sequence.'
      },
      {
        id: 'q15_mcq', sequence: 15, quizType: 'MCQ', points: 25,
        question: { text: 'Which theorem relates to right triangles?' },
        answer: { options: [{ key: 'A', text: 'Fermat\'s Last Theorem', media: null }, { key: 'B', text: 'Pythagorean Theorem', media: null }, { key: 'C', text: 'Euler\'s Theorem', media: null }, { key: 'D', text: 'de Moivre\'s Theorem', media: null }], correctOption: 'B' },
        hint: 'a² + b² = c²', explanation: 'The Pythagorean Theorem states that in a right triangle, a² + b² = c².'
      },
      {
        id: 'q16_mcq', sequence: 16, quizType: 'MCQ', points: 25,
        question: { text: 'What is the Hubble constant related to?' },
        answer: { options: [{ key: 'A', text: 'Black holes', media: null }, { key: 'B', text: 'Expansion of the universe', media: null }, { key: 'C', text: 'Dark matter', media: null }, { key: 'D', text: 'Gravitational waves', media: null }], correctOption: 'B' },
        hint: 'Cosmology', explanation: 'The Hubble constant describes the rate of expansion of the universe.'
      },
      {
        id: 'q17_mcq', sequence: 17, quizType: 'MCQ', points: 25,
        question: { text: 'What is the Avogadro number?' },
        answer: { options: [{ key: 'A', text: '6.022 × 10^23', media: null }, { key: 'B', text: '6.022 × 10^24', media: null }, { key: 'C', text: '6.022 × 10^22', media: null }, { key: 'D', text: '6.022 × 10^25', media: null }], correctOption: 'A' },
        hint: 'Mole of particles', explanation: 'Avogadro number is 6.02214076 × 10^23 mol^-1.'
      },
    ],
  }),

  // 2. MULTI_SELECT with variants
  createQuizWithVariants({
    title: '✓ Multiple Selection Quiz',
    description: 'Select all correct answers from options across difficulty levels',
    category: 'science',
    audience: 'all',
    quizType: 'MULTI_SELECT',
    rating: 4.2,
    plays: 189,
    avgTime: '12-25 min',
    coverImage: '✓',
    questions: [
      // EASY (5Q)
      {
        id: 'q1_ms', sequence: 1, quizType: 'MULTI_SELECT', points: 15,
        question: { text: 'Which are fruits?' },
        answer: { options: [{ key: 'A', text: 'Apple', media: null }, { key: 'B', text: 'Carrot', media: null }, { key: 'C', text: 'Banana', media: null }, { key: 'D', text: 'Lettuce', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'Think about sweet foods', explanation: 'Apple and Banana are fruits.'
      },
      {
        id: 'q2_ms', sequence: 2, quizType: 'MULTI_SELECT', points: 15,
        question: { text: 'Which planets are in our solar system?' },
        answer: { options: [{ key: 'A', text: 'Mars', media: null }, { key: 'B', text: 'Proxima Centauri', media: null }, { key: 'C', text: 'Venus', media: null }, { key: 'D', text: 'Sirius', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'These are actual planets', explanation: 'Mars and Venus are planets in our solar system.'
      },
      {
        id: 'q3_ms', sequence: 3, quizType: 'MULTI_SELECT', points: 15,
        question: { text: 'Which are mammals?' },
        answer: { options: [{ key: 'A', text: 'Dog', media: null }, { key: 'B', text: 'Fish', media: null }, { key: 'C', text: 'Cat', media: null }, { key: 'D', text: 'Snake', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'They have fur and nurse young', explanation: 'Dogs and Cats are mammals.'
      },
      {
        id: 'q4_ms', sequence: 4, quizType: 'MULTI_SELECT', points: 15,
        question: { text: 'Which are vowels?' },
        answer: { options: [{ key: 'A', text: 'A', media: null }, { key: 'B', text: 'B', media: null }, { key: 'C', text: 'E', media: null }, { key: 'D', text: 'G', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'First and fifth letters', explanation: 'A and E are vowels.'
      },
      {
        id: 'q5_ms', sequence: 5, quizType: 'MULTI_SELECT', points: 15,
        question: { text: 'Which are oceans?' },
        answer: { options: [{ key: 'A', text: 'Pacific', media: null }, { key: 'B', text: 'Dead Sea', media: null }, { key: 'C', text: 'Atlantic', media: null }, { key: 'D', text: 'Lake Michigan', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'Large bodies of salt water', explanation: 'Pacific and Atlantic are oceans.'
      },
      // MEDIUM (3Q)
      {
        id: 'q6_ms', sequence: 6, quizType: 'MULTI_SELECT', points: 20,
        question: { text: 'Which are programming languages?' },
        answer: { options: [{ key: 'A', text: 'Python', media: null }, { key: 'B', text: 'HTML', media: null }, { key: 'C', text: 'Java', media: null }, { key: 'D', text: 'CSS', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'HTML and CSS are markup/styling', explanation: 'Python and Java are programming languages.'
      },
      {
        id: 'q7_ms', sequence: 7, quizType: 'MULTI_SELECT', points: 20,
        question: { text: 'Which are noble gases?' },
        answer: { options: [{ key: 'A', text: 'Helium', media: null }, { key: 'B', text: 'Nitrogen', media: null }, { key: 'C', text: 'Neon', media: null }, { key: 'D', text: 'Oxygen', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'Chemically inert gases', explanation: 'Helium and Neon are noble gases.'
      },
      {
        id: 'q8_ms', sequence: 8, quizType: 'MULTI_SELECT', points: 20,
        question: { text: 'Which are renewable energy sources?' },
        answer: { options: [{ key: 'A', text: 'Solar', media: null }, { key: 'B', text: 'Coal', media: null }, { key: 'C', text: 'Wind', media: null }, { key: 'D', text: 'Oil', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'These can regenerate naturally', explanation: 'Solar and Wind are renewable energy sources.'
      },
      // HARD (4Q)
      {
        id: 'q9_ms', sequence: 9, quizType: 'MULTI_SELECT', points: 25,
        question: { text: 'Which are principles of object-oriented programming?' },
        answer: { options: [{ key: 'A', text: 'Encapsulation', media: null }, { key: 'B', text: 'Recursion', media: null }, { key: 'C', text: 'Inheritance', media: null }, { key: 'D', text: 'Iteration', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'OOP pillars', explanation: 'Encapsulation and Inheritance are OOP principles.'
      },
      {
        id: 'q10_ms', sequence: 10, quizType: 'MULTI_SELECT', points: 25,
        question: { text: 'Which equations are related to physics?' },
        answer: { options: [{ key: 'A', text: 'E=mc²', media: null }, { key: 'B', text: 'y=mx+b', media: null }, { key: 'C', text: 'F=ma', media: null }, { key: 'D', text: 'x²+y²=r²', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'Einstein and Newton', explanation: 'E=mc² and F=ma are physics equations.'
      },
      {
        id: 'q11_ms', sequence: 11, quizType: 'MULTI_SELECT', points: 25,
        question: { text: 'Which are DNA components?' },
        answer: { options: [{ key: 'A', text: 'Deoxyribose', media: null }, { key: 'B', text: 'Glucose', media: null }, { key: 'C', text: 'Phosphate', media: null }, { key: 'D', text: 'Fructose', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'Sugar and phosphate backbone', explanation: 'Deoxyribose and Phosphate are DNA components.'
      },
      {
        id: 'q12_ms', sequence: 12, quizType: 'MULTI_SELECT', points: 25,
        question: { text: 'Which are AWS services?' },
        answer: { options: [{ key: 'A', text: 'EC2', media: null }, { key: 'B', text: 'Kubernetes', media: null }, { key: 'C', text: 'S3', media: null }, { key: 'D', text: 'Docker', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'Amazon Web Services', explanation: 'EC2 and S3 are AWS services.'
      },
      // EXPERT (5Q)
      {
        id: 'q13_ms', sequence: 13, quizType: 'MULTI_SELECT', points: 30,
        question: { text: 'Which are cryptographic algorithms?' },
        answer: { options: [{ key: 'A', text: 'SHA-256', media: null }, { key: 'B', text: 'UTF-8', media: null }, { key: 'C', text: 'RSA', media: null }, { key: 'D', text: 'JSON', media: null }], correctOptions: ['A', 'C'], minCorrect: 1, maxIncorrect: 1 },
        hint: 'Encryption and hashing', explanation: 'SHA-256 and RSA are cryptographic algorithms.'
      },
      {
        id: 'q14_ms', sequence: 14, quizType: 'MULTI_SELECT', points: 30,
        question: { text: 'Which are amino acids?' },
        answer: { options: [{ key: 'A', text: 'Alanine', media: null }, { key: 'B', text: 'Arginine', media: null }, { key: 'C', text: 'Adenine', media: null }, { key: 'D', text: 'Aspartic acid', media: null }], correctOptions: ['A', 'B', 'D'], minCorrect: 2, maxIncorrect: 0 },
        hint: 'Protein building blocks', explanation: 'Alanine, Arginine, and Aspartic acid are amino acids.'
      },
      {
        id: 'q15_ms', sequence: 15, quizType: 'MULTI_SELECT', points: 30,
        question: { text: 'Which are quantum computing concepts?' },
        answer: { options: [{ key: 'A', text: 'Superposition', media: null }, { key: 'B', text: 'Entanglement', media: null }, { key: 'C', text: 'Decoherence', media: null }, { key: 'D', text: 'Recursion', media: null }], correctOptions: ['A', 'B', 'C'], minCorrect: 2, maxIncorrect: 0 },
        hint: 'Quantum mechanics principles', explanation: 'Superposition, Entanglement, and Decoherence are quantum concepts.'
      },
      {
        id: 'q16_ms', sequence: 16, quizType: 'MULTI_SELECT', points: 30,
        question: { text: 'Which are Big Data technologies?' },
        answer: { options: [{ key: 'A', text: 'Hadoop', media: null }, { key: 'B', text: 'Spark', media: null }, { key: 'C', text: 'TensorFlow', media: null }, { key: 'D', text: 'MapReduce', media: null }], correctOptions: ['A', 'B', 'D'], minCorrect: 2, maxIncorrect: 0 },
        hint: 'Data processing frameworks', explanation: 'Hadoop, Spark, and MapReduce are Big Data technologies.'
      },
      {
        id: 'q17_ms', sequence: 17, quizType: 'MULTI_SELECT', points: 30,
        question: { text: 'Which are SOLID principles in software design?' },
        answer: { options: [{ key: 'A', text: 'Single Responsibility', media: null }, { key: 'B', text: 'Open/Closed', media: null }, { key: 'C', text: 'Liskov Substitution', media: null }, { key: 'D', text: 'Data Hiding', media: null }], correctOptions: ['A', 'B', 'C'], minCorrect: 2, maxIncorrect: 0 },
        hint: 'Software engineering principles', explanation: 'Single Responsibility, Open/Closed, and Liskov Substitution are SOLID principles.'
      },
    ],
  }),
  // 3. TRUE_FALSE Quiz
  createQuizWithVariants({
    title: '✓ True or False Quiz',
    description: 'Quick true/false statements to test your knowledge',
    category: 'general',
    audience: 'all',
    quizType: 'TRUE_FALSE',
    rating: 4.2,
    plays: 156,
    avgTime: '5-10 min',
    coverImage: '✓',
    questions: [
      { id: 'q1_tf', sequence: 1, quizType: 'TRUE_FALSE', points: 10, question: { text: 'The Earth is round.' }, answer: { isTrue: true }, explanation: 'The Earth is approximately spherical in shape.' },
      { id: 'q2_tf', sequence: 2, quizType: 'TRUE_FALSE', points: 10, question: { text: 'Water boils at 50°C.' }, answer: { isTrue: false }, explanation: 'Water boils at 100°C (212°F) at sea level.' },
      { id: 'q3_tf', sequence: 3, quizType: 'TRUE_FALSE', points: 10, question: { text: 'Cats are mammals.' }, answer: { isTrue: true }, explanation: 'Cats are indeed mammals.' },
      { id: 'q4_tf', sequence: 4, quizType: 'TRUE_FALSE', points: 10, question: { text: 'The Sun is a planet.' }, answer: { isTrue: false }, explanation: 'The Sun is a star, not a planet.' },
      { id: 'q5_tf', sequence: 5, quizType: 'TRUE_FALSE', points: 10, question: { text: 'Oxygen is essential for human breathing.' }, answer: { isTrue: true }, explanation: 'Humans need oxygen to survive.' },
      { id: 'q6_tf', sequence: 6, quizType: 'TRUE_FALSE', points: 15, question: { text: 'The Great Wall of China is visible from space.' }, answer: { isTrue: false }, explanation: 'The Great Wall is not easily visible from space with the naked eye.' },
      { id: 'q7_tf', sequence: 7, quizType: 'TRUE_FALSE', points: 15, question: { text: 'DNA contains the genetic code for life.' }, answer: { isTrue: true }, explanation: 'DNA is the molecule that carries genetic instructions.' },
      { id: 'q8_tf', sequence: 8, quizType: 'TRUE_FALSE', points: 15, question: { text: 'All spiders are venomous.' }, answer: { isTrue: false }, explanation: 'Not all spiders are venomous, but most do have venom.' },
      { id: 'q9_tf', sequence: 9, quizType: 'TRUE_FALSE', points: 20, question: { text: 'Quantum entanglement allows faster-than-light communication.' }, answer: { isTrue: false }, explanation: 'Entanglement cannot be used for faster-than-light communication.' },
      { id: 'q10_tf', sequence: 10, quizType: 'TRUE_FALSE', points: 20, question: { text: 'The human brain uses 10% of its capacity.' }, answer: { isTrue: false }, explanation: 'This is a myth; we use virtually all of our brain.' },
      { id: 'q11_tf', sequence: 11, quizType: 'TRUE_FALSE', points: 20, question: { text: 'Black holes have infinite density at their core.' }, answer: { isTrue: true }, explanation: 'A singularity at the core has theoretically infinite density.' },
      { id: 'q12_tf', sequence: 12, quizType: 'TRUE_FALSE', points: 20, question: { text: 'Time runs slower in strong gravitational fields.' }, answer: { isTrue: true }, explanation: 'Time dilation is a key aspect of general relativity.' },
      { id: 'q13_tf', sequence: 13, quizType: 'TRUE_FALSE', points: 25, question: { text: 'The Schrödinger equation describes quantum behavior.' }, answer: { isTrue: true }, explanation: 'It is the fundamental equation of quantum mechanics.' },
      { id: 'q14_tf', sequence: 14, quizType: 'TRUE_FALSE', points: 25, question: { text: 'Photons have mass.' }, answer: { isTrue: false }, explanation: 'Photons are massless particles.' },
      { id: 'q15_tf', sequence: 15, quizType: 'TRUE_FALSE', points: 25, question: { text: 'The multiverse hypothesis has been proven.' }, answer: { isTrue: false }, explanation: 'The multiverse remains a theoretical hypothesis.' },
      { id: 'q16_tf', sequence: 16, quizType: 'TRUE_FALSE', points: 25, question: { text: 'Entropy always increases in a closed system.' }, answer: { isTrue: true }, explanation: 'This is the Second Law of Thermodynamics.' },
      { id: 'q17_tf', sequence: 17, quizType: 'TRUE_FALSE', points: 25, question: { text: 'Heisenberg uncertainty principle limits simultaneous measurements.' }, answer: { isTrue: true }, explanation: 'Position and momentum cannot be simultaneously determined.' },
    ],
  }),
  // 4. FILL_BLANK Quiz
  createQuizWithVariants({
    title: '📝 Fill in the Blank Quiz',
    description: 'Complete sentences with the correct words',
    category: 'language',
    audience: 'all',
    quizType: 'FILL_BLANK',
    rating: 4.3,
    plays: 189,
    avgTime: '8-12 min',
    coverImage: '📝',
    questions: [
      { id: 'q1_fb', sequence: 1, quizType: 'FILL_BLANK', points: 10, question: { text: 'The capital of France is _____.' }, answer: { correctAnswers: ['Paris', 'PARIS'], explanation: 'Paris is the capital and largest city of France.' } },
      { id: 'q2_fb', sequence: 2, quizType: 'FILL_BLANK', points: 10, question: { text: 'Photosynthesis is the process where plants convert _____ into glucose.' }, answer: { correctAnswers: ['sunlight', 'light', 'solar energy'], explanation: 'Plants use light energy to create chemical energy.' } },
      { id: 'q3_fb', sequence: 3, quizType: 'FILL_BLANK', points: 10, question: { text: 'The _____ is the longest river in Africa.' }, answer: { correctAnswers: ['Nile', 'nile'], explanation: 'The Nile River flows through northeastern Africa.' } },
      { id: 'q4_fb', sequence: 4, quizType: 'FILL_BLANK', points: 10, question: { text: 'The SI unit of force is the _____.' }, answer: { correctAnswers: ['Newton', 'newton'], explanation: 'Named after Sir Isaac Newton.' } },
      { id: 'q5_fb', sequence: 5, quizType: 'FILL_BLANK', points: 10, question: { text: 'A triangle has _____ sides.' }, answer: { correctAnswers: ['three', '3'], explanation: 'Triangle literally means three angles.' } },
      { id: 'q6_fb', sequence: 6, quizType: 'FILL_BLANK', points: 15, question: { text: 'The process of water turning into vapor is called _____.' }, answer: { correctAnswers: ['evaporation', 'EVAPORATION'], explanation: 'Evaporation is part of the water cycle.' } },
      { id: 'q7_fb', sequence: 7, quizType: 'FILL_BLANK', points: 15, question: { text: 'The human body has _____ bones in adulthood.' }, answer: { correctAnswers: ['206', 'two hundred and six'], explanation: 'Adult humans have 206 bones.' } },
      { id: 'q8_fb', sequence: 8, quizType: 'FILL_BLANK', points: 15, question: { text: 'The speed of light is approximately _____ meters per second.' }, answer: { correctAnswers: ['300000000', '3 × 10^8', '3e8'], explanation: 'Light travels at about 299,792,458 m/s.' } },
      { id: 'q9_fb', sequence: 9, quizType: 'FILL_BLANK', points: 20, question: { text: 'The chemical formula for sodium chloride is _____.' }, answer: { correctAnswers: ['NaCl', 'nacl'], explanation: 'Sodium chloride is common table salt.' } },
      { id: 'q10_fb', sequence: 10, quizType: 'FILL_BLANK', points: 20, question: { text: 'The _____ is the powerhouse of the cell.' }, answer: { correctAnswers: ['mitochondria', 'mitochondrion'], explanation: 'Mitochondria produce energy for cells.' } },
      { id: 'q11_fb', sequence: 11, quizType: 'FILL_BLANK', points: 20, question: { text: 'Avogadro\'s number is approximately _____.' }, answer: { correctAnswers: ['6.022 × 10^23', '6.022e23', '6.022 * 10^23'], explanation: 'Used to convert between moles and particles.' } },
      { id: 'q12_fb', sequence: 12, quizType: 'FILL_BLANK', points: 20, question: { text: 'The _____ theorem states that a² + b² = c².' }, answer: { correctAnswers: ['Pythagorean', 'pythagorean'], explanation: 'Fundamental theorem in geometry.' } },
      { id: 'q13_fb', sequence: 13, quizType: 'FILL_BLANK', points: 25, question: { text: 'The _____ equation describes the relationship between energy and mass.' }, answer: { correctAnswers: ['E=mc²', 'E = mc²'], explanation: 'Einstein\'s famous mass-energy equivalence.' } },
      { id: 'q14_fb', sequence: 14, quizType: 'FILL_BLANK', points: 25, question: { text: 'The _____ constant relates the energy of a photon to its frequency.' }, answer: { correctAnswers: ['Planck', 'planck\'s', 'planck'], explanation: 'Used in quantum mechanics.' } },
      { id: 'q15_fb', sequence: 15, quizType: 'FILL_BLANK', points: 25, question: { text: 'The study of astronomical objects and phenomena is called _____.' }, answer: { correctAnswers: ['astronomy', 'ASTRONOMY'], explanation: 'The science of celestial objects.' } },
      { id: 'q16_fb', sequence: 16, quizType: 'FILL_BLANK', points: 25, question: { text: 'The _____ is the SI unit of electric current.' }, answer: { correctAnswers: ['ampere', 'amp', 'Ampere'], explanation: 'Named after André-Marie Ampère.' } },
      { id: 'q17_fb', sequence: 17, quizType: 'FILL_BLANK', points: 25, question: { text: 'The process where atoms combine to form molecules is called _____.' }, answer: { correctAnswers: ['bonding', 'chemical bonding'], explanation: 'Formation of chemical bonds between atoms.' } },
    ],
  }),
  // 5. MATCHING Quiz
  createQuizWithVariants({
    title: '🔗 Matching Quiz',
    description: 'Match terms with their definitions',
    category: 'vocabulary',
    audience: 'all',
    quizType: 'MATCHING',
    rating: 4.1,
    plays: 142,
    avgTime: '10-15 min',
    coverImage: '🔗',
    questions: [
      { id: 'q1_m', sequence: 1, quizType: 'MATCHING', points: 10, question: { text: 'Match items 1-4 with definitions A-D' }, answer: { pairs: [{ item: '1. Photosynthesis', match: 'A. Process of converting light to chemical energy' }, { item: '2. Respiration', match: 'B. Release of energy from food' }, { item: '3. Osmosis', match: 'C. Water movement across membranes' }, { item: '4. Digestion', match: 'D. Breaking down food into nutrients' }], explanation: 'Biological processes explained.' } },
      { id: 'q2_m', sequence: 2, quizType: 'MATCHING', points: 10, question: { text: 'Match continents with capitals' }, answer: { pairs: [{ item: '1. Asia', match: 'A. Multiple capitals' }, { item: '2. Europe', match: 'B. Paris is notable' }, { item: '3. Africa', match: 'C. Cairo, Lagos notable' }, { item: '4. Americas', match: 'D. Washington DC, Ottawa notable' }], explanation: 'Capital cities of continents.' } },
      { id: 'q3_m', sequence: 3, quizType: 'MATCHING', points: 10, question: { text: 'Match atoms with their symbols' }, answer: { pairs: [{ item: '1. Oxygen', match: 'A. O' }, { item: '2. Hydrogen', match: 'B. H' }, { item: '3. Carbon', match: 'C. C' }, { item: '4. Nitrogen', match: 'D. N' }], explanation: 'Chemical element symbols.' } },
      { id: 'q4_m', sequence: 4, quizType: 'MATCHING', points: 10, question: { text: 'Match instruments with their sounds' }, answer: { pairs: [{ item: '1. Piano', match: 'A. Percussion' }, { item: '2. Violin', match: 'B. String' }, { item: '3. Flute', match: 'C. Wind' }, { item: '4. Trumpet', match: 'D. Brass' }], explanation: 'Musical instruments classified.' } },
      { id: 'q5_m', sequence: 5, quizType: 'MATCHING', points: 10, question: { text: 'Match mathematical terms' }, answer: { pairs: [{ item: '1. Hypotenuse', match: 'A. Longest side of triangle' }, { item: '2. Vertex', match: 'B. Corner point' }, { item: '3. Diameter', match: 'C. Line through circle center' }, { item: '4. Radius', match: 'D. Distance from center' }], explanation: 'Geometric concepts.' } },
      { id: 'q6_m', sequence: 6, quizType: 'MATCHING', points: 15, question: { text: 'Match scientists with discoveries' }, answer: { pairs: [{ item: '1. Newton', match: 'A. Evolution' }, { item: '2. Darwin', match: 'B. Gravity Laws' }, { item: '3. Einstein', match: 'C. Relativity' }, { item: '4. Mendel', match: 'D. Genetics' }], explanation: 'Famous scientists and their work.' } },
      { id: 'q7_m', sequence: 7, quizType: 'MATCHING', points: 15, question: { text: 'Match organisms with classification' }, answer: { pairs: [{ item: '1. Whale', match: 'A. Fish' }, { item: '2. Penguin', match: 'B. Bird' }, { item: '3. Shark', match: 'C. Mammal' }, { item: '4. Lion', match: 'D. Feline' }], explanation: 'Animal classification.' } },
      { id: 'q8_m', sequence: 8, quizType: 'MATCHING', points: 15, question: { text: 'Match programming languages with year created' }, answer: { pairs: [{ item: '1. Python', match: 'A. 1995' }, { item: '2. Java', match: 'B. 1991' }, { item: '3. JavaScript', match: 'C. 1995' }, { item: '4. C++', match: 'D. 1985' }], explanation: 'Programming language history.' } },
      { id: 'q9_m', sequence: 9, quizType: 'MATCHING', points: 20, question: { text: 'Match chemical reactions with type' }, answer: { pairs: [{ item: '1. Combustion', match: 'A. Combination' }, { item: '2. Synthesis', match: 'B. Oxidation' }, { item: '3. Decomposition', match: 'C. Breakdown' }, { item: '4. Acid-base', match: 'D. Neutralization' }], explanation: 'Types of chemical reactions.' } },
      { id: 'q10_m', sequence: 10, quizType: 'MATCHING', points: 20, question: { text: 'Match literary devices with examples' }, answer: { pairs: [{ item: '1. Metaphor', match: 'A. Comparison using "like"' }, { item: '2. Simile', match: 'B. Direct comparison' }, { item: '3. Irony', match: 'C. Opposite meaning' }, { item: '4. Alliteration', match: 'D. Repeated sounds' }], explanation: 'Literary devices explained.' } },
      { id: 'q11_m', sequence: 11, quizType: 'MATCHING', points: 20, question: { text: 'Match historical periods' }, answer: { pairs: [{ item: '1. Renaissance', match: 'A. 14th-17th century' }, { item: '2. Medieval', match: 'B. 5th-15th century' }, { item: '3. Ancient', match: 'C. Before 5th century' }, { item: '4. Modern', match: 'D. 18th century onward' }], explanation: 'Historical periods.' } },
      { id: 'q12_m', sequence: 12, quizType: 'MATCHING', points: 20, question: { text: 'Match art styles with characteristics' }, answer: { pairs: [{ item: '1. Cubism', match: 'A. Geometric shapes' }, { item: '2. Impressionism', match: 'B. Light and color focus' }, { item: '3. Realism', match: 'C. Accurate representation' }, { item: '4. Surrealism', match: 'D. Dreamlike imagery' }], explanation: 'Art movement characteristics.' } },
      { id: 'q13_m', sequence: 13, quizType: 'MATCHING', points: 25, question: { text: 'Match physics concepts' }, answer: { pairs: [{ item: '1. Momentum', match: 'A. Mass × Velocity' }, { item: '2. Kinetic Energy', match: 'B. 1/2 × Mass × Velocity²' }, { item: '3. Force', match: 'C. Mass × Acceleration' }, { item: '4. Work', match: 'D. Force × Distance' }], explanation: 'Physics formulas and concepts.' } },
      { id: 'q14_m', sequence: 14, quizType: 'MATCHING', points: 25, question: { text: 'Match economic concepts' }, answer: { pairs: [{ item: '1. GDP', match: 'A. Goods and services value' }, { item: '2. Inflation', match: 'B. Price increase' }, { item: '3. Supply', match: 'C. Available quantity' }, { item: '4. Demand', match: 'D. Wanted quantity' }], explanation: 'Economic terminology.' } },
      { id: 'q15_m', sequence: 15, quizType: 'MATCHING', points: 25, question: { text: 'Match computer components with function' }, answer: { pairs: [{ item: '1. CPU', match: 'A. Calculations and logic' }, { item: '2. RAM', match: 'B. Temporary storage' }, { item: '3. SSD', match: 'C. Permanent storage' }, { item: '4. GPU', match: 'D. Graphics processing' }], explanation: 'Computer hardware components.' } },
      { id: 'q16_m', sequence: 16, quizType: 'MATCHING', points: 25, question: { text: 'Match weather phenomena with causes' }, answer: { pairs: [{ item: '1. Rainbow', match: 'A. Light refraction' }, { item: '2. Thunder', match: 'B. Lightning sound' }, { item: '3. Tornado', match: 'C. Rotating wind' }, { item: '4. Eclipse', match: 'D. Celestial alignment' }], explanation: 'Weather and space phenomena.' } },
      { id: 'q17_m', sequence: 17, quizType: 'MATCHING', points: 25, question: { text: 'Match biological systems with main function' }, answer: { pairs: [{ item: '1. Circulatory', match: 'A. Oxygen transport' }, { item: '2. Nervous', match: 'B. Signal processing' }, { item: '3. Digestive', match: 'C. Nutrient absorption' }, { item: '4. Immune', match: 'D. Defense against pathogens' }], explanation: 'Human body systems.' } },
    ],
  }),
  // 6. ORDERING Quiz
  createQuizWithVariants({
    title: '📊 Ordering Quiz',
    description: 'Arrange items in the correct sequence',
    category: 'logic',
    audience: 'all',
    quizType: 'ORDERING',
    rating: 4.0,
    plays: 128,
    avgTime: '10-15 min',
    coverImage: '📊',
    questions: [
      { id: 'q1_o', sequence: 1, quizType: 'ORDERING', points: 10, question: { text: 'Arrange in order of size (smallest to largest)' }, answer: { correctOrder: ['Atom', 'Cell', 'Organism', 'Ecosystem'], explanation: 'Biological hierarchy from smallest to largest.' } },
      { id: 'q2_o', sequence: 2, quizType: 'ORDERING', points: 10, question: { text: 'Arrange planets by distance from Sun' }, answer: { correctOrder: ['Mercury', 'Venus', 'Earth', 'Mars'], explanation: 'First four planets in order.' } },
      { id: 'q3_o', sequence: 3, quizType: 'ORDERING', points: 10, question: { text: 'Arrange in chronological order' }, answer: { correctOrder: ['Dawn', 'Morning', 'Afternoon', 'Evening'], explanation: 'Time of day in sequence.' } },
      { id: 'q4_o', sequence: 4, quizType: 'ORDERING', points: 10, question: { text: 'Arrange by age (oldest first)' }, answer: { correctOrder: ['Ancient Rome', 'Medieval Period', 'Renaissance', 'Modern Era'], explanation: 'Historical periods in order.' } },
      { id: 'q5_o', sequence: 5, quizType: 'ORDERING', points: 10, question: { text: 'Arrange steps of scientific method' }, answer: { correctOrder: ['Question', 'Hypothesis', 'Experiment', 'Analysis'], explanation: 'Basic steps of the scientific method.' } },
      { id: 'q6_o', sequence: 6, quizType: 'ORDERING', points: 15, question: { text: 'Arrange in order of increasing temperature' }, answer: { correctOrder: ['Ice', 'Water', 'Steam', 'Plasma'], explanation: 'States of matter and extreme conditions.' } },
      { id: 'q7_o', sequence: 7, quizType: 'ORDERING', points: 15, question: { text: 'Arrange computer evolution by era' }, answer: { correctOrder: ['Vacuum Tubes', 'Transistors', 'Integrated Circuits', 'Microprocessors'], explanation: 'Generations of computing.' } },
      { id: 'q8_o', sequence: 8, quizType: 'ORDERING', points: 15, question: { text: 'Arrange levels of government' }, answer: { correctOrder: ['Local', 'State', 'National', 'International'], explanation: 'Governance hierarchy.' } },
      { id: 'q9_o', sequence: 9, quizType: 'ORDERING', points: 20, question: { text: 'Arrange in order of atomic number' }, answer: { correctOrder: ['Hydrogen', 'Carbon', 'Oxygen', 'Iron'], explanation: 'Elements ordered by atomic number.' } },
      { id: 'q10_o', sequence: 10, quizType: 'ORDERING', points: 20, question: { text: 'Arrange steps of cell division' }, answer: { correctOrder: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'], explanation: 'Stages of mitosis in order.' } },
      { id: 'q11_o', sequence: 11, quizType: 'ORDERING', points: 20, question: { text: 'Arrange steps of photosynthesis' }, answer: { correctOrder: ['Light absorption', 'Water splitting', 'Electron transport', 'Glucose synthesis'], explanation: 'Photosynthesis process steps.' } },
      { id: 'q12_o', sequence: 12, quizType: 'ORDERING', points: 20, question: { text: 'Arrange geological time periods' }, answer: { correctOrder: ['Precambrian', 'Paleozoic', 'Mesozoic', 'Cenozoic'], explanation: 'Geological eras in chronological order.' } },
      { id: 'q13_o', sequence: 13, quizType: 'ORDERING', points: 25, question: { text: 'Arrange in order of complexity' }, answer: { correctOrder: ['Quark', 'Proton', 'Atom', 'Molecule'], explanation: 'Structural hierarchy from subatomic to molecular.' } },
      { id: 'q14_o', sequence: 14, quizType: 'ORDERING', points: 25, question: { text: 'Arrange steps of evolution' }, answer: { correctOrder: ['Variation', 'Selection', 'Adaptation', 'Speciation'], explanation: 'Evolutionary processes in order.' } },
      { id: 'q15_o', sequence: 15, quizType: 'ORDERING', points: 25, question: { text: 'Arrange in order of food chain' }, answer: { correctOrder: ['Producer', 'Primary consumer', 'Secondary consumer', 'Decomposer'], explanation: 'Energy flow in ecosystem.' } },
      { id: 'q16_o', sequence: 16, quizType: 'ORDERING', points: 25, question: { text: 'Arrange in order of quantum shells' }, answer: { correctOrder: ['K shell', 'L shell', 'M shell', 'N shell'], explanation: 'Electron orbital shells.' } },
      { id: 'q17_o', sequence: 17, quizType: 'ORDERING', points: 25, question: { text: 'Arrange in order of biodiversity' }, answer: { correctOrder: ['Species', 'Genus', 'Family', 'Kingdom'], explanation: 'Taxonomic classification levels.' } },
    ],
  }),
  // 7. PUZZLE Quiz
  createQuizWithVariants({
    title: '🧩 Puzzle Quiz',
    description: 'Solve logic and pattern puzzles',
    category: 'logic',
    audience: 'all',
    quizType: 'PUZZLE',
    rating: 4.4,
    plays: 234,
    avgTime: '15-25 min',
    coverImage: '🧩',
    questions: Array.from({ length: 17 }, (_, i) => ({
      id: `q${i+1}_pz`, sequence: i + 1, quizType: 'PUZZLE', points: 10 + Math.floor(i / 5) * 5,
      question: { text: `Puzzle ${i+1}: What comes next in the sequence?` },
      answer: { correctAnswer: 'Pattern continuation', explanation: 'Logical pattern identified.' },
      hint: 'Look for repeating patterns'
    })),
  }),
  // 8. DRAG_DROP Quiz
  createQuizWithVariants({
    title: '↔️ Drag & Drop Quiz',
    description: 'Drag items to correct positions',
    category: 'interactive',
    audience: 'all',
    quizType: 'DRAG_DROP',
    rating: 4.3,
    plays: 167,
    avgTime: '8-12 min',
    coverImage: '↔️',
    questions: Array.from({ length: 17 }, (_, i) => ({
      id: `q${i+1}_dd`, sequence: i + 1, quizType: 'DRAG_DROP', points: 10 + Math.floor(i / 5) * 5,
      question: { text: `Drag question ${i+1}` },
      answer: { items: ['Item A', 'Item B', 'Item C'], correctPositions: [0, 2, 1], explanation: 'Items placed correctly.' },
      hint: 'Drag items to the right zones'
    })),
  }),
  // 9. CODING Quiz
  createQuizWithVariants({
    title: '💻 Coding Quiz',
    description: 'Answer coding and programming questions',
    category: 'programming',
    audience: 'developers',
    quizType: 'CODING',
    rating: 4.6,
    plays: 289,
    avgTime: '20-30 min',
    coverImage: '💻',
    questions: Array.from({ length: 17 }, (_, i) => ({
      id: `q${i+1}_cd`, sequence: i + 1, quizType: 'CODING', points: 15 + Math.floor(i / 5) * 10,
      question: { text: `What does this code do? (Question ${i+1})` },
      answer: { correctAnswer: 'Code explanation', explanation: 'How the code functions.' },
      hint: 'Think about the logic',
      codeSnippet: 'function example() { return true; }'
    })),
  }),
  // 10. IMAGE_BASED Quiz
  createQuizWithVariants({
    title: '🖼️ Image-Based Quiz',
    description: 'Answer questions about images',
    category: 'visual',
    audience: 'all',
    quizType: 'IMAGE_BASED',
    rating: 4.5,
    plays: 198,
    avgTime: '10-15 min',
    coverImage: '🖼️',
    questions: Array.from({ length: 17 }, (_, i) => ({
      id: `q${i+1}_img`, sequence: i + 1, quizType: 'IMAGE_BASED', points: 10 + Math.floor(i / 5) * 5,
      question: { text: `What is shown in image ${i+1}?`, image: 'https://via.placeholder.com/300' },
      answer: { options: [{ key: 'A', text: 'Option 1', media: null }, { key: 'B', text: 'Option 2', media: null }, { key: 'C', text: 'Option 3', media: null }, { key: 'D', text: 'Option 4', media: null }], correctOption: 'A' },
      hint: 'Examine the image carefully'
    })),
  }),
  // 11. AUDIO_BASED Quiz
  createQuizWithVariants({
    title: '🎵 Audio-Based Quiz',
    description: 'Listen and answer audio questions',
    category: 'audio',
    audience: 'all',
    quizType: 'AUDIO_BASED',
    rating: 4.2,
    plays: 145,
    avgTime: '12-18 min',
    coverImage: '🎵',
    questions: Array.from({ length: 17 }, (_, i) => ({
      id: `q${i+1}_aud`, sequence: i + 1, quizType: 'AUDIO_BASED', points: 10 + Math.floor(i / 5) * 5,
      question: { text: `Listen to audio ${i+1} and answer`, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      answer: { options: [{ key: 'A', text: 'Option 1', media: null }, { key: 'B', text: 'Option 2', media: null }, { key: 'C', text: 'Option 3', media: null }, { key: 'D', text: 'Option 4', media: null }], correctOption: 'B' },
      hint: 'Listen carefully to the audio'
    })),
  }),
];

/**
 * Seed the database with sample quizzes that have variants
 */
// Transform question from seed format to quiz player format
const transformQuestion = (q, quizType, subtopic) => {
  let transformed = {
    subtopic,
    category: 'Seeded',
    audience: 'all',
  };

  // Preserve original fields
  if (q.id) transformed.id = q.id;
  if (q.sequence) transformed.sequence = q.sequence;
  if (q.quizType) transformed.quizType = q.quizType;
  if (q.points) transformed.points = q.points;
  if (q.hint) transformed.hint = q.hint;
  if (q.explanation) transformed.explanation = q.explanation;

  // Transform based on quiz type
  if (quizType === 'MCQ') {
    transformed.text = q.question.text;
    transformed.options = q.answer.options.map(opt => opt.text);
    transformed.correctAnswer = q.answer.correctOption;
    transformed.difficulty = 'Easy';
  } else if (quizType === 'MULTI_SELECT') {
    transformed.text = q.question.text;
    transformed.options = q.answer.options.map(opt => opt.text);
    transformed.correctAnswers = q.answer.correctOptions;
    transformed.difficulty = 'Easy';
  } else if (quizType === 'TRUE_FALSE') {
    transformed.text = q.question.text;
    transformed.options = ['True', 'False'];
    transformed.correctAnswer = q.answer.isTrue ? 0 : 1;
    transformed.difficulty = 'Easy';
  } else if (quizType === 'FILL_BLANK') {
    transformed.text = q.question.text;
    transformed.correctAnswers = q.answer.correctAnswers;
    transformed.difficulty = 'Easy';
  } else if (quizType === 'MATCHING') {
    transformed.text = q.question.text;
    transformed.pairs = q.answer.pairs;
    transformed.difficulty = 'Easy';
  } else if (quizType === 'ORDERING') {
    transformed.text = q.question.text;
    transformed.correctOrder = q.answer.correctOrder;
    transformed.difficulty = 'Easy';
  } else if (quizType === 'IMAGE_BASED') {
    transformed.text = q.question.text;
    if (q.question.image) transformed.image = q.question.image;
    transformed.options = q.answer.options.map(opt => opt.text);
    transformed.correctAnswer = q.answer.correctOption;
    transformed.difficulty = 'Easy';
  } else if (quizType === 'AUDIO_BASED') {
    transformed.text = q.question.text;
    if (q.question.audio) transformed.audio = q.question.audio;
    transformed.options = q.answer.options.map(opt => opt.text);
    transformed.correctAnswer = q.answer.correctOption;
    transformed.difficulty = 'Easy';
  } else {
    // For PUZZLE, DRAG_DROP, CODING
    transformed.text = q.question.text;
    transformed.correctAnswer = q.answer.correctAnswer;
    transformed.difficulty = 'Easy';
  }

  return cleanUndefined(transformed);
};

export async function seedQuizzesWithVariants(onProgress = null) {
  try {
    console.log('🌱 Starting quiz seed process with variants...');

    const quizzesCollection = collection(db, 'quizzes');
    const questionsCollection = collection(db, 'questions');
    const results = {
      success: 0,
      failed: 0,
      errors: [],
      createdIds: [],
    };

    for (let i = 0; i < QUIZ_SEED_DATA.length; i++) {
      const quizData = QUIZ_SEED_DATA[i];

      try {
        // 1️⃣ Create quiz document
        const docRef = await addDoc(quizzesCollection, {
          ...quizData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          published: true,
        });

        results.success++;
        results.createdIds.push(docRef.id);
        console.log(`✅ Created quiz with variants: ${quizData.title} (${docRef.id})`);

        // 2️⃣ Flatten and create individual question documents
        console.log(`📝 Creating ${quizData.questions.length} questions for ${quizData.title}...`);
        const subtopic = quizData.title; // Use quiz title as subtopic for grouping
        const difficultyLevels = ['Easy', 'Medium', 'Hard', 'Expert'];
        
        for (let j = 0; j < quizData.questions.length; j++) {
          const q = quizData.questions[j];
          // Determine difficulty based on question index
          const difficultyIndex = Math.floor(j / 5); // Easy: 0-4, Medium: 5-7, Hard: 8-11, Expert: 12-16
          const difficulty = difficultyLevels[Math.min(difficultyIndex, 3)];
          
          const transformedQuestion = transformQuestion(q, quizData.quizType, subtopic);
          transformedQuestion.difficulty = difficulty;

          try {
            await addDoc(questionsCollection, {
              ...transformedQuestion,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
            console.log(`  ✓ Q${j + 1}: ${q.question.text?.substring(0, 40)}...`);
          } catch (qError) {
            console.error(`  ❌ Failed to create question ${j + 1}:`, {
              quizType: quizData.quizType,
              questionText: q.question?.text || 'No text',
              error: qError.message,
              errorCode: qError.code,
              fullError: qError
            });
          }
        }

        if (onProgress) {
          onProgress({
            current: i + 1,
            total: QUIZ_SEED_DATA.length,
            title: quizData.title,
            status: 'success',
          });
        }
      } catch (error) {
        results.failed++;
        results.errors.push({
          title: quizData.title,
          error: error.message,
        });
        console.error(`❌ Failed to create quiz: ${quizData.title}`, error);

        if (onProgress) {
          onProgress({
            current: i + 1,
            total: QUIZ_SEED_DATA.length,
            title: quizData.title,
            status: 'error',
            error: error.message,
          });
        }
      }
    }

    console.log('🌱 Seed process completed:', results);
    return results;
  } catch (error) {
    console.error('❌ Seed operation failed:', error);
    throw error;
  }
}
