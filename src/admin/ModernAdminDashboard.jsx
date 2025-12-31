import React, { useState, useEffect, useMemo } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import QuizEditModal from './modals/QuizEditModal';
import PuzzleEditModal from './modals/PuzzleEditModal';
import StoryEditModal from './modals/StoryEditModal';
import QuizDetailsModal from './modals/QuizDetailsModal';
import PuzzleDetailsModal from './modals/PuzzleDetailsModal';
import StoryDetailsModal from './modals/StoryDetailsModal';
import QuestionsManager from './modals/QuestionsManager';
import BulkImport from './modals/BulkImport';
import PuzzleTemplateModal from './modals/PuzzleTemplateModal';
import SearchFilterBar from './components/SearchFilterBar';
import ImprovedFeaturesHierarchyManager from './components/ImprovedFeaturesHierarchyManager';
import StatusBadge from '../components/badges/StatusBadge';
import VisibilityBadge from '../components/badges/VisibilityBadge';
import FeaturedBadge from '../components/badges/FeaturedBadge';
import AdminStatusFilter from './components/AdminStatusFilter';

export default function ModernAdminDashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showAddQuizForm, setShowAddQuizForm] = useState(false);
  const [showAddPuzzleForm, setShowAddPuzzleForm] = useState(false);
  const [showAddStoryForm, setShowAddStoryForm] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [puzzles, setPuzzles] = useState([]);
  const [stories, setStories] = useState([]);
  const [scores, setScores] = useState([]);
  const [dbStats, setDbStats] = useState(null);
  const [quizFormData, setQuizFormData] = useState({ title: '', category: '', audience: '', questions: '', difficulty: '' });
  const [puzzleFormData, setPuzzleFormData] = useState({ displayLabel: '', name: '', type: '', audience: '', pieces: '', difficulty: '' });
  const [storyFormData, setStoryFormData] = useState({ title: '', category: '', audience: '', chapters: '' });
  const [loading, setLoading] = useState(true);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editingPuzzle, setEditingPuzzle] = useState(null);
  const [editingStory, setEditingStory] = useState(null);
  const [viewingQuiz, setViewingQuiz] = useState(null);
  const [viewingPuzzle, setViewingPuzzle] = useState(null);
  const [viewingStory, setViewingStory] = useState(null);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [filteredPuzzles, setFilteredPuzzles] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [managingQuestions, setManagingQuestions] = useState(null);
  const [showBulkImport, setShowBulkImport] = useState(null); // 'quiz', 'puzzle', 'story', or null
  const [filterCategory, setFilterCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [limitRows, setLimitRows] = useState(30);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupMessage, setSetupMessage] = useState('');
  const [setupError, setSetupError] = useState('');
  const [addingSampleQuizzes, setAddingSampleQuizzes] = useState(false);
  const [puzzleDuplicateWarning, setPuzzleDuplicateWarning] = useState(null);
  const [puzzleDuplicateCheckLoading, setPuzzleDuplicateCheckLoading] = useState(false);
  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    try {
      setLoading(true);
      
      // Fetch quizzes
      const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
      const quizzesData = quizzesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).slice(0, 100); // Limit to 100 for performance
      setQuizzes(quizzesData);
      setFilteredQuizzes(quizzesData);

      // Fetch puzzles
      const puzzlesSnapshot = await getDocs(collection(db, 'puzzles'));
      const puzzlesData = puzzlesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).slice(0, 100);
      setPuzzles(puzzlesData);
      setFilteredPuzzles(puzzlesData);

      // Fetch stories
      const storiesSnapshot = await getDocs(collection(db, 'stories'));
      const storiesData = storiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).slice(0, 100);
      setStories(storiesData);
      setFilteredStories(storiesData);

      // Fetch scores
      const scoresSnapshot = await getDocs(collection(db, 'scores'));
      const scoresData = scoresSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setScores(scoresData);

      // Load database stats
      const [features, topics, subtopics, questions, categories] = await Promise.all([
        getDocs(collection(db, 'features')),
        getDocs(collection(db, 'topics')),
        getDocs(collection(db, 'subtopics')),
        getDocs(collection(db, 'questions')),
        getDocs(collection(db, 'categories')),
      ]);

      let puzzlesByType = {
        'find-pair': 0,
        'picture-word': 0,
        'spot-difference': 0,
        'picture-shadow': 0,
        'ordering': 0,
        'invalid': 0,
      };

      for (const doc of puzzlesSnapshot.docs) {
        const type = doc.data().type;
        if (type && puzzlesByType.hasOwnProperty(type)) {
          puzzlesByType[type]++;
        } else {
          puzzlesByType['invalid']++;
        }
      }

      setDbStats({
        collections: {
          features: features.size,
          categories: categories.size,
          topics: topics.size,
          subtopics: subtopics.size,
          puzzles: puzzlesSnapshot.size,
          questions: questions.size,
          quizzes: quizzesSnapshot.size,
          stories: storiesSnapshot.size,
          scores: scoresSnapshot.size,
        },
        puzzles: {
          total: puzzlesSnapshot.size,
          byType: puzzlesByType,
          valid: puzzlesSnapshot.size - puzzlesByType['invalid'],
        },
        questions: {
          total: questions.size,
        },
        scores: {
          total: scoresSnapshot.size,
        },
        totalDocuments: features.size + categories.size + topics.size + subtopics.size + puzzlesSnapshot.size + questions.size + quizzesSnapshot.size + storiesSnapshot.size + scoresSnapshot.size,
      });
    } catch (error) {
      console.error('Error fetching data from Firestore:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== SLUG GENERATION HELPER =====
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove multiple hyphens
  };

  // ===== PUZZLE DEDUPLICATION HELPERS =====
  
  // Normalize title for comparison
  const normalizeTitle = (title) => {
    return title
      .trim()                           // Remove leading/trailing spaces
      .toLowerCase()                    // Convert to lowercase
      .replace(/\s+/g, ' ')            // Replace multiple spaces with single space
      .replace(/[^\w\s-]/g, '');       // Remove special characters except hyphens
  };

  // Calculate similarity between two strings (0-1, where 1 = identical)
  const calculateSimilarity = (str1, str2) => {
    const s1 = normalizeTitle(str1);
    const s2 = normalizeTitle(str2);
    
    if (s1 === s2) return 1;
    
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    const editDistance = getLevenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  // Levenshtein distance for fuzzy matching
  const getLevenshteinDistance = (s1, s2) => {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  };

  // Check for duplicate puzzle names (unique identifier)
  const checkPuzzleNameDuplicate = async (name) => {
    try {
      const puzzlesSnapshot = await getDocs(collection(db, 'puzzles'));
      const existingPuzzles = puzzlesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const isDuplicate = existingPuzzles.some(puzzle => puzzle.name === name);
      return isDuplicate;
    } catch (error) {
      console.error('Error checking name duplicate:', error);
      return false;
    }
  };

  // Check for duplicate or similar puzzles (for informational purposes only)
  const checkPuzzleDuplicates = async (title) => {
    try {
      const puzzlesSnapshot = await getDocs(collection(db, 'puzzles'));
      const existingPuzzles = puzzlesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const normalizedInput = normalizeTitle(title);
      const similars = [];

      existingPuzzles.forEach(puzzle => {
        const similarity = calculateSimilarity(title, puzzle.displayLabel || puzzle.title);
        
        if (similarity > 0.85) {
          // Very similar (85%+ match) - for FYI only
          similars.push({ ...puzzle, similarity });
        }
      });

      return { similars };
    } catch (error) {
      console.error('Error checking similar puzzles:', error);
      return { similars: [] };
    }
  };

  // Helper function to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp instanceof Date ? timestamp : timestamp.toDate?.() || new Date(timestamp);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        const hours = Math.floor(diffTime / (1000 * 60 * 60));
        if (hours === 0) return 'Just now';
        return `${hours}h ago`;
      } else if (diffDays === 1) {
        return 'Yesterday';
      } else if (diffDays < 7) {
        return `${diffDays}d ago`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks}w ago`;
      } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {
      return 'N/A';
    }
  };

  // Helper function to format full date and time
  const formatFullDateTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp instanceof Date ? timestamp : timestamp.toDate?.() || new Date(timestamp);
      return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  // Apply filters to quizzes, puzzles, stories
  const applyFilters = (items) => {
    return items.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      if (visibilityFilter !== 'all' && item.visibility !== visibilityFilter) {
        return false;
      }
      if (featuredFilter && !item.featured) {
        return false;
      }
      return true;
    });
  };

  // Apply filters whenever filter states change
  useEffect(() => {
    setFilteredQuizzes(applyFilters(quizzes));
    setFilteredPuzzles(applyFilters(puzzles));
    setFilteredStories(applyFilters(stories));
  }, [quizzes, puzzles, stories, statusFilter, visibilityFilter, featuredFilter]);

  // Add sample quizzes for testing
  const addSampleQuizzes = async () => {
    if (addingSampleQuizzes) return;
    
    const SAMPLE_QUIZZES = [
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
          { id: 'q4', text: 'Which continent is the \"Dark Continent\"?', options: ['Asia', 'Africa', 'South America', 'Antarctica'], correctAnswer: 1, explanation: 'Africa was called the Dark Continent.' },
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
          { id: 'q1', text: 'Who wrote \"Pride and Prejudice\"?', options: ['Charlotte Brontë', 'Jane Austen', 'Emily Dickinson', 'George Eliot'], correctAnswer: 1, explanation: 'Jane Austen wrote it.' },
          { id: 'q2', text: 'What is the main theme of \"1984\"?', options: ['Love', 'Totalitarianism', 'Adventure', 'Mystery'], correctAnswer: 1, explanation: 'Totalitarianism and control.' },
          { id: 'q3', text: 'Who wrote \"The Great Gatsby\"?', options: ['Ernest Hemingway', 'F. Scott Fitzgerald', 'John Steinbeck', 'William Faulkner'], correctAnswer: 1, explanation: 'F. Scott Fitzgerald.' },
          { id: 'q4', text: 'Who is the main character in \"To Kill a Mockingbird\"?', options: ['Atticus Finch', 'Scout Finch', 'Boo Radley', 'Mayella Ewell'], correctAnswer: 1, explanation: 'Scout Finch is the narrator.' }
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

    setAddingSampleQuizzes(true);
    try {
      const quizzesRef = collection(db, 'quizzes');
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

        await addDoc(quizzesRef, quizData);
        added++;
      }

      // Refresh quizzes list
      fetchExistingData();
      setAddingSampleQuizzes(false);
      alert(`✅ Successfully added ${added} sample quizzes!\n\nYou can now test the filters on the /quiz page`);
    } catch (error) {
      console.error('Error adding sample quizzes:', error);
      setAddingSampleQuizzes(false);
      alert(`❌ Error adding sample quizzes: ${error.message}`);
    }
  };

  const CATEGORIES = ['Science', 'Math', 'History', 'Geography', 'Literature', 'Technology'];
  const AUDIENCES = ['All Users', 'Kids 5-12', 'Students 13-18', 'Professionals', 'Programmers'];
  const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];
  const PUZZLE_TYPES = ['Jigsaw', 'Sudoku', 'Crossword', 'Logic', 'Matching', 'Pattern'];
  const STORY_CATEGORIES = ['Adventure', 'Mystery', 'Science', 'Fantasy', 'History', 'Educational'];

  // Computed statistics
  const filteredScores = useMemo(() => {
    if (filterCategory === 'all') return scores;
    return scores.filter((s) => (s.category || '').toString() === filterCategory);
  }, [scores, filterCategory]);

  const { attemptsData, avgData } = useMemo(() => {
    const attemptsMap = {};
    const sumMap = {};
    const cntMap = {};

    filteredScores.forEach((s) => {
      const c = (s.category || 'unknown').toString();
      attemptsMap[c] = (attemptsMap[c] || 0) + 1;
      sumMap[c] = (sumMap[c] || 0) + (Number(s.score) || 0);
      cntMap[c] = (cntMap[c] || 0) + 1;
    });

    const listCats = CATEGORIES.length ? CATEGORIES : Array.from(new Set(Object.keys(attemptsMap)));

    const attemptsData = listCats.map((id) => ({ id, value: attemptsMap[id] || 0 }));
    const avgData = listCats.map((id) => ({ id, value: cntMap[id] ? (sumMap[id] / cntMap[id]) : 0 }));

    return { attemptsData, avgData };
  }, [filteredScores, CATEGORIES]);

  // CSV export function
  const escapeCsv = (val) => {
    if (!val) return '';
    const s = val.toString();
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  const exportCSV = () => {
    const header = ['id', 'category', 'level', 'score', 'total', 'createdAt'];
    const rows = filteredScores.map((r) => {
      const created = r.createdAt && r.createdAt.toDate ? r.createdAt.toDate().toISOString() : (r.createdAt || '');
      return [r.id, r.category, r.level || '', r.score, r.total, created];
    });

    const csv = [header, ...rows].map((r) => r.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scores_${filterCategory}_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Setup new collections for 4 feature types
  const handleSetupNewCollections = async () => {
    setSetupLoading(true);
    setSetupMessage('');
    setSetupError('');

    try {
      console.log('🚀 Starting Firestore collection setup...\n');

      const setupData = {
        features: [
          {
            id: 'arts',
            name: 'Arts',
            label: 'Arts & Creative',
            icon: '🎨',
            type: 'arts',
            featureId: 'arts',
            description: 'Explore creative and artistic content including visual exercises, patterns, and design challenges',
            status: 'published',
            visibility: 'public',
            enabled: true,
            order: 5,
            showInMenu: true,
          },
          {
            id: 'documents',
            name: 'Documents',
            label: 'Educational Documents',
            icon: '📄',
            type: 'documents',
            featureId: 'documents',
            description: 'Learn through educational documents, reading materials, and reference guides',
            status: 'published',
            visibility: 'public',
            enabled: true,
            order: 6,
            showInMenu: true,
          },
          {
            id: 'studies',
            name: 'Studies',
            label: 'Study Guides',
            icon: '📚',
            type: 'studies',
            featureId: 'studies',
            description: 'Comprehensive study guides and learning paths for programming and technical topics',
            status: 'published',
            visibility: 'public',
            enabled: true,
            order: 7,
            showInMenu: true,
          },
          {
            id: 'worksheets',
            name: 'Worksheets',
            label: 'Practice Worksheets',
            icon: '📋',
            type: 'worksheets',
            featureId: 'worksheets',
            description: 'Interactive worksheets for hands-on practice and skill development',
            status: 'published',
            visibility: 'public',
            enabled: true,
            order: 8,
            showInMenu: true,
          },
        ],
        categories: [
          { collection: 'documentCategories', data: { id: 'educational-kids', name: 'Kids Learning', label: 'Kids Learning', featureId: 'documents', icon: '👶', description: 'Fun and educational documents for children', color: '#10b981', status: 'published', visibility: 'public', order: 1 } },
          { collection: 'studiesCategories', data: { id: 'programming-java', name: 'Java Programming', label: 'Java Programming', featureId: 'studies', icon: '☕', description: 'Complete Java programming study materials', color: '#f59e0b', status: 'published', visibility: 'public', order: 1 } },
          { collection: 'worksheetCategories', data: { id: 'logic-puzzles-ws', name: 'Logic Puzzles', label: 'Logic Puzzles', featureId: 'worksheets', icon: '🧩', description: 'Logic puzzle worksheets for problem-solving', color: '#8b5cf6', status: 'published', visibility: 'public', order: 1 } },
          { collection: 'artCategories', data: { id: 'visual-arts', name: 'Visual Arts', label: 'Visual Arts & Design', featureId: 'arts', icon: '🎨', description: 'Visual exercises, patterns, and design challenges', color: '#ec4899', status: 'published', visibility: 'public', order: 1 } },
        ],
        documents: [
          { id: 'doc-math-kids', title: 'Simple Math Guide', description: 'Learn basic math operations', categoryId: 'educational-kids', featureId: 'documents', topic: 'Math', difficulty: 'easy', icon: '📐', status: 'published', visibility: 'public', order: 1 },
          { id: 'doc-animals-kids', title: 'Animals Learning Guide', description: 'Discover different animals', categoryId: 'educational-kids', featureId: 'documents', topic: 'Animals', difficulty: 'easy', icon: '🦁', status: 'published', visibility: 'public', order: 2 },
          { id: 'doc-body-kids', title: 'Human Body Guide', description: 'Learn body parts and functions', categoryId: 'educational-kids', featureId: 'documents', topic: 'Body', difficulty: 'easy', icon: '🫀', status: 'published', visibility: 'public', order: 3 },
          { id: 'doc-food-kids', title: 'Fruits & Vegetables Guide', description: 'Explore food groups', categoryId: 'educational-kids', featureId: 'documents', topic: 'Food', difficulty: 'easy', icon: '🥗', status: 'published', visibility: 'public', order: 4 },
        ],
        studies: [
          { id: 'study-java-basics', title: 'Java Basics Study Guide', description: 'Master Java fundamentals', categoryId: 'programming-java', featureId: 'studies', topic: 'java', subtopic: 'basics', difficulty: 'medium', icon: '☕', status: 'published', visibility: 'public', order: 1, lessons: 5, quizzes: 10 },
          { id: 'study-java-arrays', title: 'Arrays in Java Study Guide', description: 'Deep dive into arrays', categoryId: 'programming-java', featureId: 'studies', topic: 'java', subtopic: 'arrays', difficulty: 'medium', icon: '📚', status: 'published', visibility: 'public', order: 2, lessons: 4, quizzes: 5 },
          { id: 'study-java-strings', title: 'String Handling in Java', description: 'Complete string guide', categoryId: 'programming-java', featureId: 'studies', topic: 'java', subtopic: 'strings', difficulty: 'medium', icon: '📝', status: 'published', visibility: 'public', order: 3, lessons: 4, quizzes: 5 },
        ],
        worksheets: [
          { id: 'ws-matching-pairs', title: 'Matching Pairs Practice', description: 'Visual recognition exercises', categoryId: 'logic-puzzles-ws', featureId: 'worksheets', topic: 'matching-pairs', difficulty: 'easy', icon: '🧩', status: 'published', visibility: 'public', order: 1, exercises: 10 },
          { id: 'ws-jigsaw-puzzles', title: 'Jigsaw Puzzles Workshop', description: 'Jigsaw puzzle challenges', categoryId: 'logic-puzzles-ws', featureId: 'worksheets', topic: 'jigsaw-puzzles', difficulty: 'medium', icon: '🧩', status: 'published', visibility: 'public', order: 2, exercises: 5 },
          { id: 'ws-word-search', title: 'Word Search Challenge', description: 'Find hidden words', categoryId: 'logic-puzzles-ws', featureId: 'worksheets', topic: 'word-search', difficulty: 'easy', icon: '🔤', status: 'published', visibility: 'public', order: 3, exercises: 8 },
          { id: 'ws-sudoku', title: 'Sudoku Practice Sheets', description: 'Logic puzzles', categoryId: 'logic-puzzles-ws', featureId: 'worksheets', topic: 'sudoku-style', difficulty: 'medium', icon: '🔢', status: 'published', visibility: 'public', order: 4, exercises: 6 },
        ],
        arts: [
          { id: 'art-visual-patterns', title: 'Visual Patterns Art', description: 'Create visual patterns', categoryId: 'visual-arts', featureId: 'arts', topic: 'visual-patterns', difficulty: 'easy', icon: '🎨', status: 'published', visibility: 'public', order: 1 },
          { id: 'art-spot-difference', title: 'Spot the Difference Challenge', description: 'Observation skills', categoryId: 'visual-arts', featureId: 'arts', topic: 'spot-difference', difficulty: 'medium', icon: '🔍', status: 'published', visibility: 'public', order: 2 },
          { id: 'art-color-sequences', title: 'Color Sequence Art', description: 'Color theory', categoryId: 'visual-arts', featureId: 'arts', topic: 'color-patterns', difficulty: 'easy', icon: '🌈', status: 'published', visibility: 'public', order: 3 },
          { id: 'art-shape-puzzles', title: 'Shape & Form Art', description: 'Shapes and forms', categoryId: 'visual-arts', featureId: 'arts', topic: 'shape-patterns', difficulty: 'medium', icon: '🟢', status: 'published', visibility: 'public', order: 4 },
        ],
      };

      let created = 0;

      // Create features
      for (const feature of setupData.features) {
        await setDoc(doc(db, 'features', feature.id), feature, { merge: true });
        created++;
        setSetupMessage(`Created feature: ${feature.name} ✅`);
      }

      // Create categories
      for (const cat of setupData.categories) {
        await setDoc(doc(db, cat.collection, cat.data.id), cat.data, { merge: true });
        created++;
      }

      // Create documents
      for (const doc_item of setupData.documents) {
        await setDoc(doc(db, 'documents', doc_item.id), doc_item);
        created++;
      }

      // Create studies
      for (const study of setupData.studies) {
        await setDoc(doc(db, 'studies', study.id), study);
        created++;
      }

      // Create worksheets
      for (const ws of setupData.worksheets) {
        await setDoc(doc(db, 'worksheets', ws.id), ws);
        created++;
      }

      // Create arts
      for (const art of setupData.arts) {
        await setDoc(doc(db, 'arts', art.id), art);
        created++;
      }

      setSetupMessage(`✨ Setup Complete! Created ${created} documents across 4 new feature collections.`);
    } catch (error) {
      console.error('❌ Setup error:', error);
      setSetupError(`Setup failed: ${error.message}`);
    } finally {
      setSetupLoading(false);
    }
  };

  const ADMIN_TABS = [
    { id: 'overview', label: '📊 Overview', icon: '📊' },
    { id: 'quizzes', label: '❓ Manage Quizzes', icon: '❓' },
    { id: 'puzzles', label: '🧩 Manage Puzzles', icon: '🧩' },
    { id: 'stories', label: '📖 Manage Stories', icon: '📖' },
    { id: 'arts', label: '🎨 Manage Arts', icon: '🎨' },
    { id: 'documents', label: '📄 Manage Documents', icon: '📄' },
    { id: 'studies', label: '📚 Manage Studies', icon: '📚' },
    { id: 'worksheets', label: '📋 Manage Worksheets', icon: '📋' },
    { id: 'features', label: '✨ Features & Categories', icon: '✨' },
    { id: 'users', label: '👥 Users & Analytics', icon: '👥' },
    { id: 'settings', label: '⚙️ Settings', icon: '⚙️' },
  ];

  const DASHBOARD_STATS = [
    { label: 'Total Quizzes', value: (48 + quizzes.length).toString(), icon: '❓', color: '#4ECDC4', change: '+5 this week' },
    { label: 'Total Puzzles', value: (156 + puzzles.length).toString(), icon: '🧩', color: '#FFE66D', change: '+12 this week' },
    { label: 'Total Stories', value: (32 + stories.length).toString(), icon: '📖', color: '#FF85A2', change: '+3 this week' },
    { label: 'Total Arts', value: '24', icon: '🎨', color: '#EC4899', change: '+2 this week' },
    { label: 'Total Documents', value: '18', icon: '📄', color: '#3B82F6', change: '+4 this week' },
    { label: 'Total Studies', value: '42', icon: '📚', color: '#10B981', change: '+6 this week' },
    { label: 'Total Worksheets', value: '56', icon: '📋', color: '#F59E0B', change: '+8 this week' },
    { label: 'Active Users', value: '1,234', icon: '👥', color: '#95E1D3', change: '+89 today' },
  ];

  const RECENT_ACTIVITIES = [
    { type: 'quiz', action: 'Added', title: 'Biology Basics Quiz', user: 'Admin User', time: '2 hours ago' },
    { type: 'puzzle', action: 'Updated', title: 'Jigsaw Challenge', user: 'Admin User', time: '4 hours ago' },
    { type: 'story', action: 'Published', title: 'The Lost Kingdom', user: 'Admin User', time: '1 day ago' },
    { type: 'art', action: 'Added', title: 'Digital Painting Guide', user: 'Admin User', time: '6 hours ago' },
    { type: 'document', action: 'Updated', title: 'Biology Textbook', user: 'Admin User', time: '5 hours ago' },
    { type: 'study', action: 'Published', title: 'Physics Study Guide', user: 'Admin User', time: '12 hours ago' },
    { type: 'worksheet', action: 'Added', title: 'Math Worksheet Pack', user: 'Admin User', time: '3 hours ago' },
    { type: 'user', action: 'Registered', title: 'New User: John Doe', user: 'System', time: '3 hours ago' },
  ];

  // Handlers for adding content
  const handleAddQuiz = async () => {
    if (quizFormData.title && quizFormData.category && quizFormData.audience) {
      try {
        const newQuiz = {
          title: quizFormData.title,
          category: quizFormData.category,
          audience: quizFormData.audience,
          questions: parseInt(quizFormData.questions) || 0,
          difficulty: quizFormData.difficulty,
          status: 'Draft',
          createdDate: new Date(),
          plays: 0,
          published: false,
        };
        
        // Save to Firestore
        const docRef = await addDoc(collection(db, 'quizzes'), newQuiz);
        
        // Add to local state
        setQuizzes([{ id: docRef.id, ...newQuiz }, ...quizzes]);
        setQuizFormData({ title: '', category: '', audience: '', questions: '', difficulty: '' });
        setShowAddQuizForm(false);
      } catch (error) {
        console.error('Error adding quiz:', error);
      }
    }
  };

  const handleAddPuzzle = async () => {
    if (puzzleFormData.title && puzzleFormData.type && puzzleFormData.audience) {
      // Check for EXACT duplicates before saving (only block these)
      if (puzzleDuplicateWarning && puzzleDuplicateWarning.duplicates.length > 0) {
        alert('❌ Cannot create puzzle!\n\nAn exact match already exists:\n' + 
              puzzleDuplicateWarning.duplicates.map(d => `"${d.title}"`).join(', ') + 
              '\n\nPlease choose a different title.');
        return;
      }

      try {
        const newPuzzle = {
          title: puzzleFormData.title,
          type: puzzleFormData.type,
          audience: puzzleFormData.audience,
          pieces: parseInt(puzzleFormData.pieces) || 0,
          difficulty: puzzleFormData.difficulty,
          status: 'Draft',
          createdDate: new Date(),
          plays: 0,
          published: false,
        };
        
        // Save to Firestore (similar puzzles are allowed - admin saw the warning)
        const docRef = await addDoc(collection(db, 'puzzles'), newPuzzle);
        
        // Add to local state
        setPuzzles([{ id: docRef.id, ...newPuzzle }, ...puzzles]);
        setPuzzleFormData({ title: '', type: '', audience: '', pieces: '', difficulty: '' });
        setPuzzleDuplicateWarning(null);
        setShowAddPuzzleForm(false);
      } catch (error) {
        console.error('Error adding puzzle:', error);
      }
    }
  };

  const handleAddStory = async () => {
    if (storyFormData.title && storyFormData.category && storyFormData.audience) {
      try {
        const newStory = {
          title: storyFormData.title,
          category: storyFormData.category,
          audience: storyFormData.audience,
          chapters: parseInt(storyFormData.chapters) || 0,
          status: 'Draft',
          createdDate: new Date(),
          reads: 0,
          published: false,
        };
        
        // Save to Firestore
        const docRef = await addDoc(collection(db, 'stories'), newStory);
        
        // Add to local state
        setStories([{ id: docRef.id, ...newStory }, ...stories]);
        setStoryFormData({ title: '', category: '', audience: '', chapters: '' });
        setShowAddStoryForm(false);
      } catch (error) {
        console.error('Error adding story:', error);
      }
    }
  };

  const handleDeleteQuiz = async (id) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'quizzes', id));
      // Remove from local state
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleDeletePuzzle = async (id) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'puzzles', id));
      // Remove from local state
      setPuzzles(puzzles.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting puzzle:', error);
    }
  };

  const handleDeleteStory = async (id) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, 'stories', id));
      // Remove from local state
      setStories(stories.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting story:', error);
    }
  };

  const handleEditQuizSave = (updatedData) => {
    setQuizzes(quizzes.map(q => q.id === editingQuiz.id ? { ...editingQuiz, ...updatedData } : q));
    setEditingQuiz(null);
  };

  const handleEditPuzzleSave = (updatedData) => {
    setPuzzles(puzzles.map(p => p.id === editingPuzzle.id ? { ...editingPuzzle, ...updatedData } : p));
    setEditingPuzzle(null);
  };

  const handleEditStorySave = (updatedData) => {
    setStories(stories.map(s => s.id === editingStory.id ? { ...editingStory, ...updatedData } : s));
    setEditingStory(null);
  };

  return (
    <SiteLayout>
      <QuizEditModal
        quiz={editingQuiz}
        isOpen={!!editingQuiz}
        onClose={() => setEditingQuiz(null)}
        onSave={handleEditQuizSave}
      />
      <PuzzleEditModal
        puzzle={editingPuzzle}
        isOpen={!!editingPuzzle}
        onClose={() => setEditingPuzzle(null)}
        onSave={handleEditPuzzleSave}
      />
      <PuzzleTemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
      />
      <StoryEditModal
        story={editingStory}
        isOpen={!!editingStory}
        onClose={() => setEditingStory(null)}
        onSave={handleEditStorySave}
      />

      <QuizDetailsModal
        quiz={viewingQuiz}
        isOpen={!!viewingQuiz}
        onClose={() => setViewingQuiz(null)}
      />
      <PuzzleDetailsModal
        puzzle={viewingPuzzle}
        isOpen={!!viewingPuzzle}
        onClose={() => setViewingPuzzle(null)}
      />
      <StoryDetailsModal
        story={viewingStory}
        isOpen={!!viewingStory}
        onClose={() => setViewingStory(null)}
      />

      <BulkImport
        isOpen={showBulkImport === 'quiz'}
        onClose={() => setShowBulkImport(null)}
        dataType="quiz"
        categories={CATEGORIES}
      />
      <BulkImport
        isOpen={showBulkImport === 'puzzle'}
        onClose={() => setShowBulkImport(null)}
        dataType="puzzle"
        categories={PUZZLE_TYPES}
      />
      <BulkImport
        isOpen={showBulkImport === 'story'}
        onClose={() => setShowBulkImport(null)}
        dataType="story"
        categories={STORY_CATEGORIES}
      />

      <div style={{
        minHeight: '100vh',
        padding: '40px 20px',
      }}>
        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: `4px solid ${theme.border}`,
              borderTop: `4px solid ${theme.accentPrimary}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}></div>
            <p style={{ color: theme.textSecondary, fontSize: '16px' }}>
              Loading your content...
            </p>
          </div>
        )}

        {!loading && (
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Hero Section */}
          <div style={{
            marginBottom: '50px',
            textAlign: 'center',
            background: `linear-gradient(135deg, ${theme.accentPrimary}20, ${theme.accentSecondary}20)`,
            borderRadius: '24px',
            padding: '60px 40px',
            border: `2px solid ${theme.border}`,
            backdropFilter: 'blur(10px)',
          }}>
            <h1 style={{
              color: theme.accentPrimary,
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: '800',
              margin: '0 0 16px 0',
            }}>
              🎛️ Admin Control Center
            </h1>
            <p style={{
              color: theme.textSecondary,
              fontSize: '18px',
              margin: '0',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}>
              Manage all content, users, and platform settings from one central dashboard
            </p>
          </div>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '40px',
            borderBottom: `2px solid ${theme.border}`,
            paddingBottom: '16px',
          }}>
            {ADMIN_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 24px',
                  background: activeTab === tab.id ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})` : 'transparent',
                  color: activeTab === tab.id ? '#fff' : theme.textPrimary,
                  border: `2px solid ${activeTab === tab.id ? 'transparent' : theme.border}`,
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.borderColor = theme.accentPrimary;
                    e.target.style.background = `${theme.accentPrimary}15`;
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.borderColor = theme.border;
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px',
              }}>
                {DASHBOARD_STATS.map((stat, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredCard(`stat-${idx}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: theme.surfacePrimary,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '16px',
                      padding: '24px',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      transform: hoveredCard === `stat-${idx}` ? 'translateY(-8px)' : 'translateY(0)',
                      borderColor: hoveredCard === `stat-${idx}` ? stat.color : theme.border,
                      boxShadow: hoveredCard === `stat-${idx}` ? `0 12px 24px ${stat.color}25` : 'none',
                    }}
                  >
                    <div style={{
                      fontSize: '32px',
                      marginBottom: '12px',
                    }}>
                      {stat.icon}
                    </div>
                    <div style={{
                      color: theme.textSecondary,
                      fontSize: '14px',
                      fontWeight: '500',
                      marginBottom: '8px',
                    }}>
                      {stat.label}
                    </div>
                    <div style={{
                      color: stat.color,
                      fontSize: '32px',
                      fontWeight: '800',
                      marginBottom: '8px',
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      color: theme.textSecondary,
                      fontSize: '12px',
                    }}>
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{
                marginBottom: '40px',
              }}>
                <h2 style={{
                  color: theme.textPrimary,
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '20px',
                }}>
                  ⚡ Quick Actions
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}>
                  <button
                    onClick={() => setShowAddQuizForm(!showAddQuizForm)}
                    style={{
                      padding: '20px',
                      background: '#4ECDC420',
                      border: `2px solid #4ECDC4`,
                      borderRadius: '12px',
                      color: '#4ECDC4',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#4ECDC440';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#4ECDC420';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ➕ Add Quiz
                  </button>

                  <button
                    onClick={() => setShowAddPuzzleForm(!showAddPuzzleForm)}
                    style={{
                      padding: '20px',
                      background: '#FFE66D20',
                      border: `2px solid #FFE66D`,
                      borderRadius: '12px',
                      color: '#FFE66D',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#FFE66D40';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#FFE66D20';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ➕ Add Puzzle
                  </button>

                  <button
                    onClick={() => setShowAddStoryForm(!showAddStoryForm)}
                    style={{
                      padding: '20px',
                      background: '#FF85A220',
                      border: `2px solid #FF85A2`,
                      borderRadius: '12px',
                      color: '#FF85A2',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#FF85A240';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#FF85A220';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ➕ Add Story
                  </button>

                  <button
                    style={{
                      padding: '20px',
                      background: '#95E1D320',
                      border: `2px solid #95E1D3`,
                      borderRadius: '12px',
                      color: '#95E1D3',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#95E1D340';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#95E1D320';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    📈 View Analytics
                  </button>

                  <button
                    onClick={addSampleQuizzes}
                    disabled={addingSampleQuizzes}
                    style={{
                      padding: '20px',
                      background: '#FF85A220',
                      border: `2px solid #FF85A2`,
                      borderRadius: '12px',
                      color: '#FF85A2',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: addingSampleQuizzes ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      opacity: addingSampleQuizzes ? 0.6 : 1,
                    }}
                    onMouseOver={(e) => {
                      if (!addingSampleQuizzes) {
                        e.currentTarget.style.background = '#FF85A240';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!addingSampleQuizzes) {
                        e.currentTarget.style.background = '#FF85A220';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {addingSampleQuizzes ? '⏳ Adding...' : '🧪 Add Sample Quizzes'}
                  </button>
                </div>
              </div>

              {/* Database Statistics Section */}
              {dbStats && (
                <div style={{
                  marginBottom: '40px',
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '32px',
                }}>
                  <h2 style={{
                    color: theme.textPrimary,
                    fontSize: '22px',
                    fontWeight: '700',
                    marginBottom: '24px',
                  }}>
                    📊 Database Overview
                  </h2>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '16px',
                  }}>
                    <div style={{
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                        {dbStats.collections.features}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Features</div>
                    </div>
                    <div style={{
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                        {dbStats.collections.categories}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Categories</div>
                    </div>
                    <div style={{
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                        {dbStats.collections.topics}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Topics</div>
                    </div>
                    <div style={{
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                        {dbStats.collections.subtopics}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Subtopics</div>
                    </div>
                    <div style={{
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: '#0284c7' }}>
                        {dbStats.puzzles.valid}/{dbStats.puzzles.total}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Puzzles (valid)</div>
                    </div>
                    <div style={{
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                        {dbStats.collections.questions}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Questions</div>
                    </div>
                    <div style={{
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                        {dbStats.collections.quizzes}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Quizzes</div>
                    </div>
                    <div style={{
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                        {dbStats.collections.stories}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Stories</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Quiz Form - Inline */}
              {showAddQuizForm && (
                <div style={{
                  marginBottom: '40px',
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '32px',
                }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '24px',
                  }}>
                    ➕ Add New Quiz
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px',
                  }}>
                    <input
                      type="text"
                      placeholder="Quiz Title"
                      value={quizFormData.title}
                      onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <select
                      value={quizFormData.category}
                      onChange={(e) => setQuizFormData({ ...quizFormData, category: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Select Category</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <select
                      value={quizFormData.audience}
                      onChange={(e) => setQuizFormData({ ...quizFormData, audience: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Select Audience</option>
                      {AUDIENCES.map(aud => (
                        <option key={aud} value={aud}>{aud}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Number of Questions"
                      value={quizFormData.questions}
                      onChange={(e) => setQuizFormData({ ...quizFormData, questions: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <select
                      value={quizFormData.difficulty}
                      onChange={(e) => setQuizFormData({ ...quizFormData, difficulty: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Select Difficulty</option>
                      {DIFFICULTIES.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}>
                    <button
                      onClick={handleAddQuiz}
                      style={{
                        padding: '12px 32px',
                        background: `linear-gradient(135deg, #4ECDC4, #FFE66D)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Save Quiz
                    </button>
                    <button
                      onClick={() => {
                        setShowAddQuizForm(false);
                        setQuizFormData({ title: '', category: '', audience: '', questions: '', difficulty: '' });
                      }}
                      style={{
                        padding: '12px 32px',
                        background: 'transparent',
                        color: theme.textPrimary,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Add Puzzle Form - Inline */}
              {showAddPuzzleForm && (
                <div style={{
                  marginBottom: '40px',
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '32px',
                }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '24px',
                  }}>
                    ➕ Add New Puzzle
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px',
                  }}>
                    <input
                      type="text"
                      placeholder="Puzzle Title"
                      value={puzzleFormData.title}
                      onChange={async (e) => {
                        const newTitle = e.target.value;
                        setPuzzleFormData({ ...puzzleFormData, title: newTitle });
                        
                        // Check for duplicates when title is typed
                        if (newTitle.trim()) {
                          setPuzzleDuplicateCheckLoading(true);
                          const result = await checkPuzzleDuplicates(newTitle);
                          setPuzzleDuplicateWarning(result);
                          setPuzzleDuplicateCheckLoading(false);
                        } else {
                          setPuzzleDuplicateWarning(null);
                        }
                      }}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: `8px`,
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <select
                      value={puzzleFormData.type}
                      onChange={(e) => setPuzzleFormData({ ...puzzleFormData, type: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Select Puzzle Type</option>
                      {PUZZLE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <select
                      value={puzzleFormData.audience}
                      onChange={(e) => setPuzzleFormData({ ...puzzleFormData, audience: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Select Audience</option>
                      {AUDIENCES.map(aud => (
                        <option key={aud} value={aud}>{aud}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Number of Pieces"
                      value={puzzleFormData.pieces}
                      onChange={(e) => setPuzzleFormData({ ...puzzleFormData, pieces: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <select
                      value={puzzleFormData.difficulty}
                      onChange={(e) => setPuzzleFormData({ ...puzzleFormData, difficulty: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Select Difficulty</option>
                      {DIFFICULTIES.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>

                  {/* Duplicate Warning Display */}
                  {puzzleDuplicateWarning && (puzzleDuplicateWarning.duplicates.length > 0 || puzzleDuplicateWarning.similars.length > 0) && (
                    <div style={{
                      marginBottom: '24px',
                      borderRadius: '12px',
                      padding: '16px',
                      background: puzzleDuplicateWarning.duplicates.length > 0 ? '#FEE2E2' : '#FFFBEB',
                      borderLeft: `4px solid ${puzzleDuplicateWarning.duplicates.length > 0 ? '#DC2626' : '#F59E0B'}`,
                    }}>
                      {puzzleDuplicateWarning.duplicates.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{
                            color: '#DC2626',
                            fontWeight: '700',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}>
                            ⛔ EXACT DUPLICATE DETECTED
                          </div>
                          <div style={{
                            color: '#991B1B',
                            fontSize: '13px',
                            lineHeight: '1.5',
                          }}>
                            The puzzle <strong>"{normalizeTitle(puzzleFormData.title)}"</strong> already exists:
                            {puzzleDuplicateWarning.duplicates.map((dup, idx) => (
                              <div key={idx} style={{ marginTop: '4px' }}>
                                • "{dup.title}" (ID: {dup.id})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {puzzleDuplicateWarning.similars.length > 0 && (
                        <div>
                          <div style={{
                            color: '#D97706',
                            fontWeight: '700',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}>
                            ℹ️ RELATED PUZZLES FOUND ({puzzleDuplicateWarning.similars.length}) - FYI Only
                          </div>
                          <div style={{
                            color: '#92400E',
                            fontSize: '13px',
                            lineHeight: '1.6',
                          }}>
                            These similar puzzles exist, but you can still create yours if it's intentional (e.g., different difficulty, variant):
                            {puzzleDuplicateWarning.similars.map((sim, idx) => (
                              <div key={idx} style={{ marginTop: '4px' }}>
                                • "{sim.title}" – {(sim.similarity * 100).toFixed(0)}% match
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}>
                    <button
                      onClick={handleAddPuzzle}
                      disabled={puzzleDuplicateWarning && puzzleDuplicateWarning.duplicates.length > 0}
                      style={{
                        padding: '12px 32px',
                        background: (puzzleDuplicateWarning && puzzleDuplicateWarning.duplicates.length > 0) 
                          ? '#CCCCCC'
                          : `linear-gradient(135deg, #FFE66D, #FF85A2)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: (puzzleDuplicateWarning && puzzleDuplicateWarning.duplicates.length > 0) 
                          ? 'not-allowed'
                          : 'pointer',
                        opacity: (puzzleDuplicateWarning && puzzleDuplicateWarning.duplicates.length > 0) 
                          ? '0.6'
                          : '1',
                      }}
                    >
                      Save Puzzle
                    </button>
                    <button
                      onClick={() => {
                        setShowAddPuzzleForm(false);
                        setPuzzleFormData({ title: '', type: '', audience: '', pieces: '', difficulty: '' });
                      }}
                      style={{
                        padding: '12px 32px',
                        background: 'transparent',
                        color: theme.textPrimary,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Add Story Form - Inline */}
              {showAddStoryForm && (
                <div style={{
                  marginBottom: '40px',
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '32px',
                }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '20px',
                    fontWeight: '700',
                    marginBottom: '24px',
                  }}>
                    ➕ Add New Story
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px',
                  }}>
                    <input
                      type="text"
                      placeholder="Story Title"
                      value={storyFormData.title}
                      onChange={(e) => setStoryFormData({ ...storyFormData, title: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <select
                      value={storyFormData.category}
                      onChange={(e) => setStoryFormData({ ...storyFormData, category: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Select Category</option>
                      {STORY_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <select
                      value={storyFormData.audience}
                      onChange={(e) => setStoryFormData({ ...storyFormData, audience: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Select Audience</option>
                      {AUDIENCES.map(aud => (
                        <option key={aud} value={aud}>{aud}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Number of Chapters"
                      value={storyFormData.chapters}
                      onChange={(e) => setStoryFormData({ ...storyFormData, chapters: e.target.value })}
                      style={{
                        padding: '12px 16px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '8px',
                        color: theme.textPrimary,
                        fontSize: '14px',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}>
                    <button
                      onClick={handleAddStory}
                      style={{
                        padding: '12px 32px',
                        background: `linear-gradient(135deg, #FF85A2, #FF6B6B)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Save Story
                    </button>
                    <button
                      onClick={() => {
                        setShowAddStoryForm(false);
                        setStoryFormData({ title: '', category: '', audience: '', chapters: '' });
                      }}
                      style={{
                        padding: '12px 32px',
                        background: 'transparent',
                        color: theme.textPrimary,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Activities */}
              <div>
                <h2 style={{
                  color: theme.textPrimary,
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '20px',
                }}>
                  📋 Recent Activities
                </h2>
                <div style={{
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}>
                  {RECENT_ACTIVITIES.map((activity, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '16px 24px',
                        borderBottom: idx !== RECENT_ACTIVITIES.length - 1 ? `1px solid ${theme.border}` : 'none',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        gap: '16px',
                        alignItems: 'center',
                        flex: 1,
                      }}>
                        <div style={{
                          fontSize: '24px',
                        }}>
                          {activity.type === 'quiz' ? '❓' : activity.type === 'puzzle' ? '🧩' : activity.type === 'story' ? '📖' : '👤'}
                        </div>
                        <div style={{
                          flex: 1,
                        }}>
                          <div style={{
                            color: theme.textPrimary,
                            fontSize: '15px',
                            fontWeight: '600',
                            marginBottom: '4px',
                          }}>
                            {activity.action} {activity.title}
                          </div>
                          <div style={{
                            color: theme.textSecondary,
                            fontSize: '12px',
                          }}>
                            by {activity.user}
                          </div>
                        </div>
                      </div>
                      <div style={{
                        color: theme.textSecondary,
                        fontSize: '12px',
                      }}>
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '16px',
              }}>
                <div>
                  <h2 style={{
                    color: theme.textPrimary,
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                  }}>
                    ❓ Manage Quizzes
                  </h2>
                  <p style={{
                    color: theme.textSecondary,
                    margin: '0',
                  }}>
                    Create, edit, and manage quiz content
                  </p>
                </div>
                <button
                  onClick={() => setShowAddQuizForm(!showAddQuizForm)}
                  style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, #4ECDC4, #FFE66D)`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ➕ Add New Quiz
                </button>
                <button
                  onClick={() => setShowBulkImport('quiz')}
                  style={{
                    padding: '12px 24px',
                    background: `transparent`,
                    color: '#4ECDC4',
                    border: '2px solid #4ECDC4',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📤 Bulk Import
                </button>
              </div>

              {/* Add Quiz Form */}
              {showAddQuizForm && (
                <div style={{
                  marginBottom: '30px',
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '24px',
                }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '20px',
                  }}>
                    Create New Quiz
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '16px',
                  }}>
                    <input
                      type="text"
                      placeholder="Quiz Title"
                      value={quizFormData.title}
                      onChange={(e) => setQuizFormData({ ...quizFormData, title: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <select
                      value={quizFormData.category}
                      onChange={(e) => setQuizFormData({ ...quizFormData, category: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Category</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <select
                      value={quizFormData.audience}
                      onChange={(e) => setQuizFormData({ ...quizFormData, audience: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Audience</option>
                      {AUDIENCES.map(aud => (
                        <option key={aud} value={aud}>{aud}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Questions"
                      value={quizFormData.questions}
                      onChange={(e) => setQuizFormData({ ...quizFormData, questions: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <select
                      value={quizFormData.difficulty}
                      onChange={(e) => setQuizFormData({ ...quizFormData, difficulty: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Difficulty</option>
                      {DIFFICULTIES.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                  }}>
                    <button
                      onClick={handleAddQuiz}
                      style={{
                        padding: '10px 20px',
                        background: `linear-gradient(135deg, #4ECDC4, #FFE66D)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowAddQuizForm(false);
                        setQuizFormData({ title: '', category: '', audience: '', questions: '', difficulty: '' });
                      }}
                      style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        color: theme.textPrimary,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Admin Status Filter */}
              <AdminStatusFilter
                onStatusChange={setStatusFilter}
                onVisibilityChange={setVisibilityFilter}
                onFeaturedChange={setFeaturedFilter}
                onClearFilters={() => {
                  setStatusFilter('all');
                  setVisibilityFilter('all');
                  setFeaturedFilter(false);
                }}
              />

              {/* Search & Filter Bar for Quizzes */}
              <SearchFilterBar
                items={quizzes}
                onFilter={setFilteredQuizzes}
                searchPlaceholder="Search quizzes by title..."
                categories={CATEGORIES}
                difficulties={DIFFICULTIES}
                showCategory={true}
                showDifficulty={true}
                showStatus={true}
              />

              {/* Quizzes List */}
              {filteredQuizzes.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gap: '12px',
                }}>
                  {filteredQuizzes.map(quiz => (
                    <div
                      key={quiz.id}
                      style={{
                        background: theme.surfacePrimary,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '10px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <h3 style={{
                          color: theme.textPrimary,
                          fontSize: '15px',
                          fontWeight: '600',
                          margin: '0 0 6px 0',
                        }}>
                          {quiz.title}
                        </h3>
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          fontSize: '12px',
                          color: theme.textSecondary,
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}>
                          <span>📚 {Array.isArray(quiz.questions) ? quiz.questions.length : typeof quiz.questions === 'number' ? quiz.questions : 0} Q</span>
                          <span>👥 {quiz.audience}</span>
                          {quiz.difficulty && <span>⭐ {quiz.difficulty}</span>}
                          {/* Status and Visibility Badges */}
                          {quiz.status && <StatusBadge status={quiz.status} />}
                          {quiz.visibility && <VisibilityBadge visibility={quiz.visibility} />}
                          {quiz.featured && <FeaturedBadge featured={quiz.featured} />}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap',
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          background: `${theme.accentPrimary}25`,
                          color: theme.accentPrimary,
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}>
                          {quiz.category}
                        </span>
                      </div>
                      <button
                        onClick={() => setEditingQuiz(quiz)}
                        style={{
                          padding: '6px 12px',
                          background: `${theme.accentPrimary}25`,
                          color: theme.accentPrimary,
                          border: `1px solid ${theme.accentPrimary}`,
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setViewingQuiz(quiz)}
                        style={{
                          padding: '6px 12px',
                          background: '#667eea25',
                          color: '#667eea',
                          border: '1px solid #667eea',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#FF6B6B25',
                          color: '#FF6B6B',
                          border: '1px solid #FF6B6B',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                  color: theme.textSecondary,
                }}>
                  <p>
                    {quizzes.length > 0
                      ? 'No quizzes match your filters. Try adjusting your search or filters.'
                      : 'No quizzes created yet. Click "➕ Add New Quiz" to get started!'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Puzzles Tab */}
          {activeTab === 'puzzles' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '16px',
              }}>
                <div>
                  <h2 style={{
                    color: theme.textPrimary,
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                  }}>
                    🧩 Manage Puzzles
                  </h2>
                  <p style={{
                    color: theme.textSecondary,
                    margin: '0',
                  }}>
                    Create and manage various puzzle types and complexity levels
                  </p>
                </div>
                <button
                  onClick={() => setShowAddPuzzleForm(!showAddPuzzleForm)}
                  style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, #667eea, #764ba2)`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ➕ Add New Puzzle
                </button>
                <button
                  onClick={() => setShowBulkImport('puzzle')}
                  style={{
                    padding: '12px 24px',
                    background: `transparent`,
                    color: '#667eea',
                    border: '2px solid #667eea',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📤 Bulk Import
                </button>
                <button
                  onClick={() => setShowTemplateModal(true)}
                  style={{
                    padding: '12px 24px',
                    background: `transparent`,
                    color: '#764ba2',
                    border: '2px solid #764ba2',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📋 Puzzle Templates
                </button>
                <button
                  onClick={() => navigate('/admin/puzzle-duplicates')}
                  style={{
                    padding: '12px 24px',
                    background: `transparent`,
                    color: '#FF6B6B',
                    border: '2px solid #FF6B6B',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  🔍 Find Duplicates
                </button>
              </div>

              {/* Add Puzzle Form */}
              {showAddPuzzleForm && (
                <div style={{
                  marginBottom: '30px',
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '24px',
                }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '20px',
                  }}>
                    Create New Puzzle
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '16px',
                  }}>
                    <input
                      type="text"
                      placeholder="Puzzle Title"
                      value={puzzleFormData.title}
                      onChange={(e) => setPuzzleFormData({ ...puzzleFormData, title: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <select
                      value={puzzleFormData.type}
                      onChange={(e) => setPuzzleFormData({ ...puzzleFormData, type: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Type</option>
                      {PUZZLE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <select
                      value={puzzleFormData.audience}
                      onChange={(e) => setPuzzleFormData({ ...puzzleFormData, audience: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Audience</option>
                      {AUDIENCES.map(aud => (
                        <option key={aud} value={aud}>{aud}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Pieces"
                      value={puzzleFormData.pieces}
                      onChange={(e) => setPuzzleFormData({ ...puzzleFormData, pieces: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <select
                      value={puzzleFormData.difficulty}
                      onChange={(e) => setPuzzleFormData({ ...puzzleFormData, difficulty: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Difficulty</option>
                      {DIFFICULTIES.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                  }}>
                    <button
                      onClick={handleAddPuzzle}
                      style={{
                        padding: '10px 20px',
                        background: `linear-gradient(135deg, #667eea, #764ba2)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowAddPuzzleForm(false);
                        setPuzzleFormData({ title: '', type: '', audience: '', pieces: '', difficulty: '' });
                      }}
                      style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        color: theme.textPrimary,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Search & Filter Bar for Puzzles */}
              <SearchFilterBar
                items={puzzles}
                onFilter={setFilteredPuzzles}
                searchPlaceholder="Search puzzles by title, category, or ID..."
                categories={PUZZLE_TYPES}
                difficulties={DIFFICULTIES}
                showCategory={true}
                showDifficulty={true}
                showStatus={true}
              />

              {/* Puzzles List */}
              {filteredPuzzles.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gap: '12px',
                }}>
                  {filteredPuzzles.map(puzzle => (
                    <div
                      key={puzzle.id}
                      style={{
                        background: theme.surfacePrimary,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '10px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <h3 style={{
                          color: theme.textPrimary,
                          fontSize: '15px',
                          fontWeight: '600',
                          margin: '0 0 6px 0',
                        }}>
                          🧩 {puzzle.title}
                        </h3>
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          fontSize: '12px',
                          color: theme.textSecondary,
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          marginBottom: '6px',
                        }}>
                          <span>📋 ID: {puzzle.id}</span>
                          {puzzle.category && <span>🏷️ {puzzle.category}</span>}
                          <span>🔧 {Array.isArray(puzzle.pieces) ? puzzle.pieces.length : typeof puzzle.pieces === 'number' ? puzzle.pieces : 0} Pieces</span>
                          <span>👥 {puzzle.audience}</span>
                          {puzzle.difficulty && <span>⭐ {puzzle.difficulty}</span>}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          fontSize: '11px',
                          color: theme.textSecondary,
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          marginBottom: '6px',
                          paddingTop: '4px',
                          borderTop: `1px solid ${theme.border}`,
                        }}>
                          <span title={formatFullDateTime(puzzle.createdAt)}>📅 Created: {formatDate(puzzle.createdAt)}</span>
                          {puzzle.updatedAt && <span title={formatFullDateTime(puzzle.updatedAt)}>✏️ Updated: {formatDate(puzzle.updatedAt)}</span>}
                        </div>
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          fontSize: '11px',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}>
                          {/* Status and Visibility Badges */}
                          {puzzle.status && <StatusBadge status={puzzle.status} />}
                          {puzzle.visibility && <VisibilityBadge visibility={puzzle.visibility} />}
                          {puzzle.featured && <FeaturedBadge featured={puzzle.featured} />}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap',
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          background: `${theme.accentPrimary}25`,
                          color: theme.accentPrimary,
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}>
                          {puzzle.type}
                        </span>
                      </div>
                      <button
                        onClick={() => setEditingPuzzle(puzzle)}
                        style={{
                          padding: '6px 12px',
                          background: `${theme.accentPrimary}25`,
                          color: theme.accentPrimary,
                          border: `1px solid ${theme.accentPrimary}`,
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setViewingPuzzle(puzzle)}
                        style={{
                          padding: '6px 12px',
                          background: '#667eea25',
                          color: '#667eea',
                          border: '1px solid #667eea',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleDeletePuzzle(puzzle.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#FF6B6B25',
                          color: '#FF6B6B',
                          border: '1px solid #FF6B6B',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                  color: theme.textSecondary,
                }}>
                  <p>
                    {puzzles.length > 0
                      ? 'No puzzles match your filters. Try adjusting your search or filters.'
                      : 'No puzzles created yet. Click "➕ Add New Puzzle" to get started!'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Stories Tab */}
          {activeTab === 'stories' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '16px',
              }}>
                <div>
                  <h2 style={{
                    color: theme.textPrimary,
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                  }}>
                    📖 Manage Stories
                  </h2>
                  <p style={{
                    color: theme.textSecondary,
                    margin: '0',
                  }}>
                    Create and manage stories with chapter management
                  </p>
                </div>
                <button
                  onClick={() => setShowAddStoryForm(!showAddStoryForm)}
                  style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, #f093fb, #f5576c)`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ➕ Add New Story
                </button>
                <button
                  onClick={() => setShowBulkImport('story')}
                  style={{
                    padding: '12px 24px',
                    background: `transparent`,
                    color: '#f093fb',
                    border: '2px solid #f093fb',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  📤 Bulk Import
                </button>
              </div>

              {/* Add Story Form */}
              {showAddStoryForm && (
                <div style={{
                  marginBottom: '30px',
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '16px',
                  padding: '24px',
                }}>
                  <h3 style={{
                    color: theme.textPrimary,
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '20px',
                  }}>
                    Create New Story
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                    marginBottom: '16px',
                  }}>
                    <input
                      type="text"
                      placeholder="Story Title"
                      value={storyFormData.title}
                      onChange={(e) => setStoryFormData({ ...storyFormData, title: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    />
                    <select
                      value={storyFormData.category}
                      onChange={(e) => setStoryFormData({ ...storyFormData, category: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Category</option>
                      {STORY_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <select
                      value={storyFormData.audience}
                      onChange={(e) => setStoryFormData({ ...storyFormData, audience: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    >
                      <option value="">Audience</option>
                      {AUDIENCES.map(aud => (
                        <option key={aud} value={aud}>{aud}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Chapters"
                      value={storyFormData.chapters}
                      onChange={(e) => setStoryFormData({ ...storyFormData, chapters: e.target.value })}
                      style={{
                        padding: '10px 12px',
                        background: theme.background,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                  }}>
                    <button
                      onClick={handleAddStory}
                      style={{
                        padding: '10px 20px',
                        background: `linear-gradient(135deg, #f093fb, #f5576c)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowAddStoryForm(false);
                        setStoryFormData({ title: '', category: '', audience: '', chapters: '' });
                      }}
                      style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        color: theme.textPrimary,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Admin Status Filter */}
              <AdminStatusFilter
                onStatusChange={setStatusFilter}
                onVisibilityChange={setVisibilityFilter}
                onFeaturedChange={setFeaturedFilter}
                onClearFilters={() => {
                  setStatusFilter('all');
                  setVisibilityFilter('all');
                  setFeaturedFilter(false);
                }}
              />

              {/* Search & Filter Bar for Stories */}
              <SearchFilterBar
                items={stories}
                onFilter={setFilteredStories}
                searchPlaceholder="Search stories by title..."
                categories={STORY_CATEGORIES}
                difficulties={[]}
                showCategory={true}
                showDifficulty={false}
                showStatus={true}
              />

              {/* Stories List */}
              {filteredStories.length > 0 ? (
                <div style={{
                  display: 'grid',
                  gap: '12px',
                }}>
                  {filteredStories.map(story => (
                    <div
                      key={story.id}
                      style={{
                        background: theme.surfacePrimary,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '10px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '200px' }}>
                        <h3 style={{
                          color: theme.textPrimary,
                          fontSize: '15px',
                          fontWeight: '600',
                          margin: '0 0 6px 0',
                        }}>
                          📖 {story.title}
                        </h3>
                        <div style={{
                          display: 'flex',
                          gap: '12px',
                          fontSize: '12px',
                          color: theme.textSecondary,
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}>
                          <span>📚 {Array.isArray(story.chapters) ? story.chapters.length : typeof story.chapters === 'number' ? story.chapters : 0} Chapters</span>
                          <span>👥 {story.audience}</span>
                          {/* Status and Visibility Badges */}
                          {story.status && <StatusBadge status={story.status} />}
                          {story.visibility && <VisibilityBadge visibility={story.visibility} />}
                          {story.featured && <FeaturedBadge featured={story.featured} />}
                        </div>
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap',
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          background: `${theme.accentPrimary}25`,
                          color: theme.accentPrimary,
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: '600',
                        }}>
                          {story.category}
                        </span>
                      </div>
                      <button
                        onClick={() => setEditingStory(story)}
                        style={{
                          padding: '6px 12px',
                          background: `${theme.accentPrimary}25`,
                          color: theme.accentPrimary,
                          border: `1px solid ${theme.accentPrimary}`,
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setViewingStory(story)}
                        style={{
                          padding: '6px 12px',
                          background: '#667eea25',
                          color: '#667eea',
                          border: '1px solid #667eea',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => handleDeleteStory(story.id)}
                        style={{
                          padding: '6px 12px',
                          background: '#FF6B6B25',
                          color: '#FF6B6B',
                          border: '1px solid #FF6B6B',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                  color: theme.textSecondary,
                }}>
                  <p>
                    {stories.length > 0
                      ? 'No stories match your filters. Try adjusting your search or filters.'
                      : 'No stories created yet. Click "➕ Add New Story" to get started!'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Arts Tab */}
          {activeTab === 'arts' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '16px',
              }}>
                <div>
                  <h2 style={{
                    color: theme.textPrimary,
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                  }}>
                    🎨 Manage Arts
                  </h2>
                  <p style={{
                    color: theme.textSecondary,
                    margin: '0',
                  }}>
                    Create and manage arts content including drawings, paintings, and digital art
                  </p>
                </div>
                <button
                  style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, #EC4899, #F97316)`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ➕ Add New Art
                </button>
              </div>
              <div style={{
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                color: theme.textSecondary,
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Arts Management Coming Soon</p>
                <p>This section will allow you to manage all arts content including drawings, paintings, and digital art</p>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '16px',
              }}>
                <div>
                  <h2 style={{
                    color: theme.textPrimary,
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                  }}>
                    📄 Manage Documents
                  </h2>
                  <p style={{
                    color: theme.textSecondary,
                    margin: '0',
                  }}>
                    Create and manage educational documents and reading materials
                  </p>
                </div>
                <button
                  style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, #3B82F6, #2563EB)`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ➕ Add New Document
                </button>
              </div>
              <div style={{
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                color: theme.textSecondary,
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Documents Management Coming Soon</p>
                <p>This section will allow you to manage all documents including textbooks, reading materials, and reference documents</p>
              </div>
            </div>
          )}

          {/* Studies Tab */}
          {activeTab === 'studies' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '16px',
              }}>
                <div>
                  <h2 style={{
                    color: theme.textPrimary,
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                  }}>
                    📚 Manage Studies
                  </h2>
                  <p style={{
                    color: theme.textSecondary,
                    margin: '0',
                  }}>
                    Create and manage study guides and structured learning materials
                  </p>
                </div>
                <button
                  style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, #10B981, #059669)`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ➕ Add New Study Guide
                </button>
              </div>
              <div style={{
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                color: theme.textSecondary,
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Studies Management Coming Soon</p>
                <p>This section will allow you to manage all study guides including chapters, difficulty levels, and learning paths</p>
              </div>
            </div>
          )}

          {/* Worksheets Tab */}
          {activeTab === 'worksheets' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                flexWrap: 'wrap',
                gap: '16px',
              }}>
                <div>
                  <h2 style={{
                    color: theme.textPrimary,
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                  }}>
                    📋 Manage Worksheets
                  </h2>
                  <p style={{
                    color: theme.textSecondary,
                    margin: '0',
                  }}>
                    Create and manage practice worksheets and exercises
                  </p>
                </div>
                <button
                  style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, #F59E0B, #D97706)`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  ➕ Add New Worksheet
                </button>
              </div>
              <div style={{
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                color: theme.textSecondary,
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Worksheets Management Coming Soon</p>
                <p>This section will allow you to manage all worksheets including problem sets, exercises, and practice materials</p>
              </div>
            </div>
          )}

          {/* Users & Analytics Tab */}
          {activeTab === 'users' && (
            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '40px',
            }}>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '16px',
              }}>
                👥 Users & Analytics
              </h2>
              <p style={{
                color: theme.textSecondary,
                marginBottom: '24px',
              }}>
                View user data, engagement metrics, and performance analytics
              </p>

              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
                marginBottom: '32px',
              }}>
                <div style={{
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                  <div style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '600' }}>
                    {scores.length}
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Total Attempts</div>
                </div>
                <div style={{
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>❓</div>
                  <div style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '600' }}>
                    {dbStats?.collections.quizzes || 0}
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Quiz Attempts</div>
                </div>
                <div style={{
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
                  <div style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '600' }}>
                    {scores.length > 0 ? Math.round(scores.reduce((a, b) => a + (Number(b.score) || 0), 0) / scores.length) : 0}
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Avg Score</div>
                </div>
              </div>

              {/* Category Filter & Controls */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: theme.background,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '8px',
                    color: theme.textPrimary,
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button
                  onClick={exportCSV}
                  style={{
                    padding: '8px 16px',
                    background: `${theme.accentPrimary}25`,
                    color: theme.accentPrimary,
                    border: `2px solid ${theme.accentPrimary}`,
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  📥 Export CSV
                </button>
              </div>

              {/* Attempts per Category Chart */}
              {attemptsData.length > 0 && (
                <div style={{
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                }}>
                  <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>Attempts per Category</h3>
                  <ChartBarSvg data={attemptsData} color={theme.accentPrimary} />
                </div>
              )}

              {/* Average Score per Category Chart */}
              {avgData.length > 0 && (
                <div style={{
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                }}>
                  <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>Average Score per Category</h3>
                  <ChartBarSvg data={avgData} color="#4CAF50" isFloat={true} />
                </div>
              )}

              {/* Recent Scores Table */}
              <div style={{
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '20px',
                overflow: 'auto',
              }}>
                <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>Recent Scores (showing {Math.min(filteredScores.length, limitRows)} of {filteredScores.length})</h3>
                {filteredScores.length === 0 ? (
                  <p style={{ color: theme.textSecondary }}>No scores recorded yet</p>
                ) : (
                  <>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      minWidth: '600px',
                    }}>
                      <thead style={{ background: `${theme.accentPrimary}15` }}>
                        <tr>
                          <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>#</th>
                          <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>Category</th>
                          <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>Level</th>
                          <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>Score</th>
                          <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>Total</th>
                          <th style={{ padding: '12px', textAlign: 'left', color: theme.textPrimary, fontWeight: '600', borderBottom: `2px solid ${theme.border}` }}>When</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredScores.slice(0, limitRows).map((s, i) => (
                          <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border}` }}>
                            <td style={{ padding: '12px', color: theme.textSecondary }}>{i + 1}</td>
                            <td style={{ padding: '12px', color: theme.textPrimary, fontWeight: '500' }}>{s.category}</td>
                            <td style={{ padding: '12px', color: theme.textSecondary }}>{s.level || '-'}</td>
                            <td style={{ padding: '12px', color: theme.accentPrimary, fontWeight: '600' }}>{s.score}</td>
                            <td style={{ padding: '12px', color: theme.textSecondary }}>{s.total}</td>
                            <td style={{ padding: '12px', color: theme.textSecondary, fontSize: '12px' }}>
                              {s.createdAt?.toDate ? s.createdAt.toDate().toLocaleString() : (s.createdAt || '-')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '16px',
                    }}>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>
                        Showing {Math.min(filteredScores.length, limitRows)} of {filteredScores.length}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setLimitRows((n) => Math.max(5, n - 5))}
                          style={{
                            padding: '6px 10px',
                            background: theme.background,
                            border: `2px solid ${theme.border}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: theme.textPrimary,
                            fontWeight: '600',
                          }}
                        >
                          −
                        </button>
                        <button
                          onClick={() => setLimitRows((n) => n + 5)}
                          style={{
                            padding: '6px 10px',
                            background: theme.background,
                            border: `2px solid ${theme.border}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: theme.textPrimary,
                            fontWeight: '600',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Setup New Collections Section */}
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            marginTop: '24px',
          }}>
            <h3 style={{
              color: theme.accentPrimary,
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '16px',
            }}>
              🚀 Initialize New Feature Collections
            </h3>
            <p style={{
              color: theme.textSecondary,
              marginBottom: '20px',
            }}>
              Create 4 new feature collections (Arts, Documents, Studies, Worksheets) with sample data from existing quiz and puzzle content.
            </p>
            
            {setupMessage && (
              <div style={{
                background: '#d1fae5',
                color: '#065f46',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                borderLeft: '4px solid #10b981',
              }}>
                ✅ {setupMessage}
              </div>
            )}
            
            {setupError && (
              <div style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '16px',
                borderLeft: '4px solid #ef4444',
              }}>
                ❌ {setupError}
              </div>
            )}

            <button
              onClick={handleSetupNewCollections}
              disabled={setupLoading}
              style={{
                background: setupLoading ? theme.border : theme.accentPrimary,
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: setupLoading ? 'not-allowed' : 'pointer',
                opacity: setupLoading ? 0.6 : 1,
              }}
            >
              {setupLoading ? '⏳ Setting up...' : '✨ Setup Collections'}
            </button>
            
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: theme.background,
              borderRadius: '8px',
              fontSize: '14px',
              color: theme.textSecondary,
            }}>
              <strong>What this does:</strong>
              <ul style={{ marginTop: '8px', marginBottom: 0 }}>
                <li>✅ Creates 4 new features: Arts, Documents, Studies, Worksheets</li>
                <li>✅ Creates category collections for each new type</li>
                <li>✅ Adds 4 sample documents from educational content</li>
                <li>✅ Adds 3 sample studies from programming quizzes</li>
                <li>✅ Adds 4 sample worksheets from puzzle exercises</li>
                <li>✅ Adds 4 sample arts from visual content</li>
              </ul>
            </div>
          </div>

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '40px',
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                  color: theme.textPrimary,
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '8px',
                }}>
                  ✨ Features & Hierarchy
                </h2>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '14px',
                  margin: 0,
                }}>
                  Manage your content hierarchy with an intuitive tree view
                </p>
              </div>
              <ImprovedFeaturesHierarchyManager theme={theme} />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div style={{
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '40px',
            }}>
              <h2 style={{
                color: theme.textPrimary,
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '16px',
              }}>
                ⚙️ Platform Settings & Database Tools
              </h2>
              <p style={{
                color: theme.textSecondary,
                marginBottom: '32px',
              }}>
                Configure system settings and manage database health
              </p>

              {/* Database Statistics */}
              {dbStats && (
                <div style={{
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '32px',
                }}>
                  <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>📊 Database Statistics</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '12px',
                  }}>
                    <div style={{ textAlign: 'center', padding: '12px' }}>
                      <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                        {dbStats.collections.features}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Features</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px' }}>
                      <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                        {dbStats.collections.categories}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Categories</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px' }}>
                      <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                        {dbStats.collections.topics}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Topics</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px' }}>
                      <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                        {dbStats.collections.subtopics}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Subtopics</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px' }}>
                      <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                        {dbStats.puzzles.valid}/{dbStats.puzzles.total}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Puzzles (valid)</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px' }}>
                      <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                        {dbStats.collections.questions}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Questions</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px' }}>
                      <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                        {dbStats.collections.quizzes}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Quizzes</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px' }}>
                      <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                        {dbStats.collections.stories}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Stories</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '12px' }}>
                      <div style={{ color: theme.accentPrimary, fontSize: '24px', fontWeight: '700' }}>
                        {dbStats.totalDocuments}
                      </div>
                      <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Total Documents</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Database Tools */}
              <div style={{
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '32px',
              }}>
                <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>🔧 Database Tools & Maintenance</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '12px',
                }}>
                  <button
                    onClick={() => navigate('/admin/database-audit')}
                    style={{
                      padding: '12px 16px',
                      background: '#0284c725',
                      color: '#0284c7',
                      border: '2px solid #0284c7',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    🔍 Run Audit
                  </button>
                  <button
                    onClick={() => navigate('/admin/standardize-features')}
                    style={{
                      padding: '12px 16px',
                      background: '#05966925',
                      color: '#059669',
                      border: '2px solid #059669',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    ⚡ Standardize Features
                  </button>
                  <button
                    onClick={() => navigate('/admin/fix-feature-mismatch')}
                    style={{
                      padding: '12px 16px',
                      background: '#d9770625',
                      color: '#d97706',
                      border: '2px solid #d97706',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    🔗 Fix Mismatch
                  </button>
                  <button
                    onClick={() => navigate('/admin/fix-orphaned-puzzles')}
                    style={{
                      padding: '12px 16px',
                      background: '#dc262625',
                      color: '#dc2626',
                      border: '2px solid #dc2626',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    🗑️ Delete Broken
                  </button>
                  <button
                    onClick={() => navigate('/admin/fix-generic-puzzle-types')}
                    style={{
                      padding: '12px 16px',
                      background: '#933326a25',
                      color: '#9333ea',
                      border: '2px solid #9333ea',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    🔧 Fix Generic Types
                  </button>
                  <button
                    onClick={() => navigate('/admin/populate-missing-puzzle-data')}
                    style={{
                      padding: '12px 16px',
                      background: '#1e40af25',
                      color: '#1e40af',
                      border: '2px solid #1e40af',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    📊 Check Data
                  </button>
                  <button
                    onClick={() => navigate('/admin/delete-incomplete-puzzles')}
                    style={{
                      padding: '12px 16px',
                      background: '#dc262625',
                      color: '#dc2626',
                      border: '2px solid #dc2626',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    🗑️ Delete Incomplete
                  </button>
                  <button
                    onClick={() => navigate('/admin/validate-puzzle-data')}
                    style={{
                      padding: '12px 16px',
                      background: '#0d948825',
                      color: '#0d9488',
                      border: '2px solid #0d9488',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    ✅ Validate All
                  </button>
                </div>
              </div>

              {/* General Settings */}
              <div style={{
                background: theme.background,
                border: `2px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '24px',
              }}>
                <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>⚙️ General Settings</h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                }}>
                  {['Maintenance Mode', 'Email Notifications', 'Auto Backup', 'Debug Mode'].map((setting) => (
                    <div key={setting} style={{
                      background: theme.surfacePrimary,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      padding: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                      <label style={{
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}>
                        {setting}
                      </label>
                      <input
                        type="checkbox"
                        style={{
                          cursor: 'pointer',
                          width: '18px',
                          height: '18px',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    </SiteLayout>
  );
}

// SVG Bar Chart Component
function ChartBarSvg({ data = [], color = '#6C63FF', isFloat = false }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const rowH = 36;
  const paddingLeft = 140;
  const svgHeight = Math.max(60, data.length * rowH);

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg width="100%" height={svgHeight} viewBox={`0 0 1000 ${svgHeight}`} preserveAspectRatio="xMinYMin meet">
        <defs>
          <linearGradient id="barGrad" x1="0" x2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#42A5F5" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {data.map((d, i) => {
          const y = i * rowH + 8;
          const w = Math.round(((d.value || 0) / (max || 1)) * 700);
          const label = isFloat ? (Math.round(d.value * 100) / 100) : Math.round(d.value || 0);
          return (
            <g key={d.id}>
              <text x={8} y={y + 14} style={{ fontSize: 13, fill: '#333' }}>{d.id}</text>
              <rect x={paddingLeft} y={y} width={w} height={18} rx={8} fill="url(#barGrad)" />
              <text x={paddingLeft + w + 12} y={y + 14} style={{ fontSize: 13, fill: '#333' }}>{label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
