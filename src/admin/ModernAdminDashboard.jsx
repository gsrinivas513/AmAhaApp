import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import PictureWordEditor from './puzzle-editors/PictureWordEditor';
import SpotDifferenceEditor from './puzzle-editors/SpotDifferenceEditor';
import FindPairEditor from './puzzle-editors/FindPairEditor';
import PictureShadowEditor from './puzzle-editors/PictureShadowEditor';
import OrderingEditor from './puzzle-editors/OrderingEditor';
import WordSearchEditor from './puzzle-editors/WordSearchEditor';
import JigsawEditor from './puzzle-editors/JigsawEditor';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createVisualPuzzle } from '../quiz/services/visualPuzzleService';
import QuizEditModal from './modals/QuizEditModal';
import PuzzleEditModal from './modals/PuzzleEditModal';
import StoryEditModal from './modals/StoryEditModal';
import QuizDetailsModal from './modals/QuizDetailsModal';
import PuzzleDetailsModal from './modals/PuzzleDetailsModal';
import StoryDetailsModal from './modals/StoryDetailsModal';
// QuestionsManager import removed (unused)
import BulkImport from './modals/BulkImport';
import PuzzleTemplateModal from './modals/PuzzleTemplateModal';
import AdminTemplatePreviewModal from './components/AdminTemplatePreviewModal';
import TemplateInputForm from './components/TemplateInputForm';
import { sanitizeTemplateForEditor } from './utils/templateGuards';
import { runTemplate } from './utils/templateExecutor';
import SearchFilterBar from './components/SearchFilterBar';
import ImprovedFeaturesHierarchyManager from './components/ImprovedFeaturesHierarchyManager';
import StatusBadge from '../components/badges/StatusBadge';
import VisibilityBadge from '../components/badges/VisibilityBadge';
import FeaturedBadge from '../components/badges/FeaturedBadge';
import AdminStatusFilter from './components/AdminStatusFilter';

// ===== BASE PUZZLE TEMPLATES (Reusable, Generic) =====
const BASE_PUZZLE_TEMPLATES = [
  {
    name: 'Find Pairs (Generic)',
    typeKey: 'findPairs',
    category: 'logic-puzzles',
    description: 'Generic pair-matching template. Replace pairs with any content (words, images, numbers).',
    schema: {
      pairs: [
        { left: 'A', right: 'a' },
        { left: 'B', right: 'b' },
      ],
      mediaSupport: true,
    },
  },
  {
    name: 'Lateral Thinking (Generic)',
    typeKey: 'lateralThinking',
    category: 'logic-puzzles',
    description: 'Prompt + solution template. Replace questions/answers freely.',
    schema: {
      questions: [
        { prompt: 'A riddle goes here...', answer: 'Solution' },
      ],
    },
  },
  {
    name: 'Ordering (Generic Items)',
    typeKey: 'ordering',
    category: 'logic-puzzles',
    description: 'Ordering template with free-form items. Replace items and order as needed.',
    schema: {
      items: ['Item 1', 'Item 2', 'Item 3'],
      correctOrder: [0, 1, 2],
    },
  },
  {
    name: 'Picture Shadow (Generic)',
    typeKey: 'pictureShadow',
    category: 'logic-puzzles',
    description: 'Match pictures to their shadows. Replace URLs.',
    schema: {
      imagePairs: [
        { imageUrl: 'https://example.com/image1.png', shadowUrl: 'https://example.com/shadow1.png' },
      ],
    },
  },
  {
    name: 'Picture Word Matching (Generic)',
    typeKey: 'pictureWordMatching',
    category: 'logic-puzzles',
    description: 'Match images to words. Replace URLs and labels.',
    schema: {
      pairs: [
        { imageUrl: 'https://example.com/apple.png', word: 'Apple' },
      ],
    },
  },
  {
    name: 'Spot Difference (Generic)',
    typeKey: 'spotDifference',
    category: 'logic-puzzles',
    description: 'Provide two images and mark difference points or a difference count.',
    schema: {
      baseImageUrl: 'https://example.com/base.png',
      alteredImageUrl: 'https://example.com/altered.png',
      differencePoints: [ { x: 10, y: 25 }, { x: 120, y: 88 } ],
      differenceCount: 5,
    },
  },
  {
    name: 'Sudoku Style (Generic)',
    typeKey: 'sudokuStyle',
    category: 'logic-puzzles',
    description: 'Grid-based number puzzle. Adjust size and presets.',
    schema: {
      gridSize: 9,
      presets: [ { r: 0, c: 0, value: 5 }, { r: 4, c: 4, value: 7 } ],
    },
  },
  {
    name: 'Sequence Completion (Generic)',
    typeKey: 'sequenceCompletion',
    category: 'pattern-puzzles',
    description: 'Fill the next element(s) in the sequence.',
    schema: {
      sequence: [1, 2, 3, null],
      solutions: [4],
    },
  },
  {
    name: 'Visual Patterns (Generic)',
    typeKey: 'visualPatterns',
    category: 'pattern-puzzles',
    description: 'Image-based pattern sequence. Replace image URLs.',
    schema: {
      images: [
        'https://example.com/pattern1.png',
        'https://example.com/pattern2.png',
        'https://example.com/pattern3.png',
        '',
      ],
      solutions: [ 'https://example.com/pattern4.png' ],
    },
  },
  {
    name: 'Jigsaw Puzzles (Generic)',
    typeKey: 'jigsaw',
    category: 'traditional-puzzles',
    description: 'Jigsaw with adjustable piece count.',
    schema: {
      imageUrl: 'https://example.com/jigsaw.png',
      pieces: 16,
    },
  },
  {
    name: 'Matching Pairs (Generic)',
    typeKey: 'matchingPairs',
    category: 'traditional-puzzles',
    description: 'Classic matching pairs. Replace labels or images.',
    schema: {
      pairs: [
        { left: 'Dog', right: '🐶' },
        { left: 'Cat', right: '🐱' },
      ],
    },
  },
  {
    name: 'Word Search (Generic)',
    typeKey: 'wordSearch',
    category: 'traditional-puzzles',
    description: 'Word search grid with word list.',
    schema: {
      gridRows: [
        'CATS',
        'DOGS',
        'BIRD',
        'FISH',
      ],
      words: ['CAT', 'DOG', 'BIRD', 'FISH'],
    },
  },
];

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
  const [quickCreateType, setQuickCreateType] = useState(null);
  const [quickCreateData, setQuickCreateData] = useState({});
  const [quickTemplates, setQuickTemplates] = useState([]);
  const [quickTemplatesLoading, setQuickTemplatesLoading] = useState(false);
  const [selectedQuickTemplateId, setSelectedQuickTemplateId] = useState('');
  const [showQuickPreview, setShowQuickPreview] = useState(false);
  // Jigsaw params moved to appear only after template apply in CN flow
  const [showQuickDetails, setShowQuickDetails] = useState(false);

  // Create New Puzzle (form) template-driven states (visual puzzle types unified)
  const [cnTemplates, setCnTemplates] = useState([]);
  const [cnTemplatesLoading, setCnTemplatesLoading] = useState(false);
  const [cnSelectedTemplateId, setCnSelectedTemplateId] = useState('');
  const [cnShowPreview, setCnShowPreview] = useState(false);
  const [cnVisualType, setCnVisualType] = useState('');
  const [cnShowInputForm, setCnShowInputForm] = useState(false);
  const [cnTemplateInputs, setCnTemplateInputs] = useState(null);
  const [cnExecutionResult, setCnExecutionResult] = useState(null);
  const [cnExecutionLoading, setCnExecutionLoading] = useState(false);
  const [cnExecutionError, setCnExecutionError] = useState('');
  const [cnEditorData, setCnEditorData] = useState(null);
  const [qcTitle, setQcTitle] = useState('');
  const [qcDescription, setQcDescription] = useState('');
  const [qcDifficulty, setQcDifficulty] = useState('easy');
  const [qcAgeGroup, setQcAgeGroup] = useState('6-8');
  const [qcCategoryId, setQcCategoryId] = useState('');
  const [qcCategoryName, setQcCategoryName] = useState('');
  const [qcTopicId, setQcTopicId] = useState('');
  const [qcTopicName, setQcTopicName] = useState('');
  const [qcSubtopicId, setQcSubtopicId] = useState('');
  const [qcSubtopicName, setQcSubtopicName] = useState('');
  const [qcIsPublished, setQcIsPublished] = useState(false);
  const [qcXpReward, setQcXpReward] = useState(10);
  const [categoriesList, setCategoriesList] = useState([]);
  const [topicsList, setTopicsList] = useState([]);
  const [subtopicsList, setSubtopicsList] = useState([]);

  const resetQuickCreate = () => {
    setQuickCreateType(null);
    setQuickCreateData({});
    setQuickTemplates([]);
    setQuickTemplatesLoading(false);
    setSelectedQuickTemplateId('');
    setShowQuickPreview(false);
    setShowQuickDetails(false);
    setQcTitle('');
    setQcDescription('');
    setQcDifficulty('easy');
    setQcAgeGroup('6-8');
    setQcCategoryId('');
    setQcCategoryName('');
    setQcTopicId('');
    setQcTopicName('');
    setQcSubtopicId('');
    setQcSubtopicName('');
    setQcIsPublished(false);
    setQcXpReward(10);
    setTopicsList([]);
    setSubtopicsList([]);
  };

  const loadCategories = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      const cats = snapshot.docs.map(d => ({ id: d.id, name: d.data().name || d.data().label || 'Untitled' }));
      setCategoriesList(cats);
    } catch (e) {
      console.warn('Failed to load categories', e);
    }
  }, []);

  const loadTopicsForCategory = useCallback(async (categoryId) => {
    try {
      const q = query(collection(db, 'topics'), where('categoryId', '==', categoryId));
      const snapshot = await getDocs(q);
      const t = snapshot.docs.map(d => ({ id: d.id, name: d.data().name || d.data().label || 'Untitled' }));
      setTopicsList(t);
    } catch (e) {
      console.warn('Failed to load topics', e);
    }
  }, []);

  const loadSubtopicsForTopic = useCallback(async (topicId) => {
    try {
      const q = query(collection(db, 'subtopics'), where('topicId', '==', topicId));
      const snapshot = await getDocs(q);
      const s = snapshot.docs.map(d => ({ id: d.id, name: d.data().name || d.data().label || 'Untitled' }));
      setSubtopicsList(s);
    } catch (e) {
      console.warn('Failed to load subtopics', e);
    }
  }, []);
  // Load templates for Create New Puzzle when a visual type is chosen
  useEffect(() => {
    const run = async () => {
      if (!cnVisualType) { setCnTemplates([]); setCnSelectedTemplateId(''); return; }
      try {
        setCnTemplatesLoading(true);
        const tk = typeKeyFor(cnVisualType);
        if (!tk) { setCnTemplates([]); return; }
        const qT = query(collection(db, 'puzzleTemplates'), where('typeKey', '==', tk));
        const snap = await getDocs(qT);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setCnTemplates(list);
        if (list.length > 0 && !cnSelectedTemplateId) {
          setCnSelectedTemplateId(list[0].id);
          setCnShowInputForm(true);
        }
      } catch (e) {
        console.warn('Failed to load templates', e);
        setCnTemplates([]);
      } finally {
        setCnTemplatesLoading(false);
      }
    };
    run();
  }, [cnVisualType, cnSelectedTemplateId]);

  useEffect(() => {
    if (quickCreateType) {
      loadCategories();
    }
  }, [quickCreateType, loadCategories]);

  const typeKeyFor = (editorType) => ({
    'find-pair': 'findPairs',
    'picture-word': 'pictureWordMatching',
    'picture-shadow': 'pictureShadow',
    'word-search': 'wordSearch',
    'spot-difference': 'spotDifference',
    'ordering': 'ordering',
    'jigsaw': 'jigsaw',
  }[editorType] || '');

  useEffect(() => {
    const loadQuickTemplates = async () => {
      if (!quickCreateType) return;
      try {
        setQuickTemplatesLoading(true);
        const tk = typeKeyFor(quickCreateType);
        if (!tk) { setQuickTemplates([]); return; }
        const q = query(collection(db, 'puzzleTemplates'), where('typeKey', '==', tk));
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setQuickTemplates(list);
        if (quickCreateType === 'jigsaw' && list.length > 0 && !selectedQuickTemplateId) {
          setSelectedQuickTemplateId(list[0].id);
        }
      } catch (e) {
        console.warn('Failed to load templates', e);
        setQuickTemplates([]);
      } finally {
        setQuickTemplatesLoading(false);
      }
    };
    loadQuickTemplates();
  }, [quickCreateType, selectedQuickTemplateId]);

  const fetchExistingData = useCallback(async () => {
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
  }, []);

  // Kick off initial data load after function is defined
  useEffect(() => {
    fetchExistingData();
  }, [fetchExistingData]);

  // ===== SLUG GENERATION HELPER =====
  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove multiple hyphens
  };

  // BASE_PUZZLE_TEMPLATES defined at module scope

  const seedBasePuzzleTemplates = useCallback(async () => {
    const results = { created: 0, errors: [] };
    try {
      const snapshot = await getDocs(collection(db, 'puzzleTemplates'));
      const existing = snapshot.docs.map(d => d.data().name);
      const toCreate = BASE_PUZZLE_TEMPLATES.filter(t => !existing.includes(t.name));
      for (const t of toCreate) {
        try {
          await addDoc(collection(db, 'puzzleTemplates'), {
            name: t.name,
            typeKey: t.typeKey,
            category: t.category,
            description: t.description,
            schema: t.schema,
            createdAt: new Date(),
          });
          results.created += 1;
        } catch (err) {
          console.error('Seed error for template', t.name, err);
          results.errors.push({ name: t.name, message: err.message });
        }
      }
      if (results.errors.length === 0) {
        alert(`✅ Seeded ${results.created} template(s).`);
      } else {
        const errText = results.errors.map(e => `• ${e.name}: ${e.message}`).join('\n');
        alert(`⚠️ Seed completed with errors. Created: ${results.created}.\n\nIssues:\n${errText}`);
      }
    } catch (e) {
      console.error('Error seeding templates', e);
      alert('❌ Failed to seed templates: ' + e.message);
    }
  }, []);

  // Auto-seed templates on first load if none exist
  useEffect(() => {
    const ensureTemplates = async () => {
      try {
        const tSnap = await getDocs(collection(db, 'puzzleTemplates'));
        if (tSnap.empty) {
          await seedBasePuzzleTemplates();
        }
      } catch (e) {
        console.error('Template seed check failed', e);
      }
    };
    ensureTemplates();
  }, [seedBasePuzzleTemplates]);

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
  const applyFilters = useCallback((items) => {
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
  }, [statusFilter, visibilityFilter, featuredFilter]);

  // Apply filters whenever filter states change
  useEffect(() => {
    setFilteredQuizzes(applyFilters(quizzes));
    setFilteredPuzzles(applyFilters(puzzles));
    setFilteredStories(applyFilters(stories));
  }, [quizzes, puzzles, stories, applyFilters]);

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

  const CATEGORIES = React.useMemo(() => ['Science', 'Math', 'History', 'Geography', 'Literature', 'Technology'], []);
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
    // Accept either displayLabel or title (Manage Puzzles form uses title)
    const effectiveLabel = (puzzleFormData.displayLabel || puzzleFormData.title || '').trim();
    if (effectiveLabel && puzzleFormData.type && puzzleFormData.audience) {
      const finalName = puzzleFormData.name || generateSlug(effectiveLabel);
      // Block if unique name exists
      const nameDuplicate = await checkPuzzleNameDuplicate(finalName);
      if (nameDuplicate) {
        alert(`❌ Cannot create puzzle!\n\nA puzzle with the unique name "${finalName}" already exists.\nPlease choose a different label.`);
        return;
      }

      try {
        const newPuzzle = {
          // Keep backward-compatible title while introducing displayLabel + name
          title: effectiveLabel,
          displayLabel: effectiveLabel,
          name: finalName,
          type: puzzleFormData.type,
          audience: puzzleFormData.audience,
          pieces: parseInt(puzzleFormData.pieces) || 0,
          difficulty: puzzleFormData.difficulty,
          status: 'Draft',
          createdDate: new Date(),
          plays: 0,
          published: false,
        };
        
        // Save to Firestore
        const docRef = await addDoc(collection(db, 'puzzles'), newPuzzle);
        
        // Add to local state
        setPuzzles([{ id: docRef.id, ...newPuzzle }, ...puzzles]);
        setPuzzleFormData({ title: '', displayLabel: '', name: '', type: '', audience: '', pieces: '', difficulty: '' });
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
                    {/* Display Label - Editable */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: theme.textSecondary,
                        marginBottom: '6px',
                      }}>
                        Display Label (e.g., "Programming World")
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Programming World"
                        value={puzzleFormData.displayLabel}
                        onChange={async (e) => {
                          const newLabel = e.target.value;
                          const newName = generateSlug(newLabel);
                          setPuzzleFormData({ ...puzzleFormData, displayLabel: newLabel, name: newName });
                          
                          // Check for unique name duplicates
                          if (newName) {
                            const isDuplicate = await checkPuzzleNameDuplicate(newName);
                            setPuzzleDuplicateWarning(prev => ({ ...(prev || {}), hasDuplicateName: !!isDuplicate, name: newName }));
                          } else {
                            setPuzzleDuplicateWarning(null);
                          }
                          
                          // Also check for similar labels (FYI only)
                          if (newLabel.trim()) {
                            const similarResult = await checkPuzzleDuplicates(newLabel);
                            setPuzzleDuplicateWarning(prev => ({ ...(prev || {}), ...similarResult }));
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
                    </div>
                    {/* Unique Name - Auto-generated, Read-only */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: theme.textSecondary,
                        marginBottom: '6px',
                      }}>
                        Unique Name (auto-generated from label)
                      </label>
                      <input
                        type="text"
                        placeholder="Auto-generated from label"
                        value={puzzleFormData.name}
                        readOnly
                        style={{
                          padding: '12px 16px',
                          background: theme.background,
                          border: `2px solid ${theme.border}`,
                          borderRadius: `8px`,
                          color: theme.textSecondary,
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          opacity: '0.6',
                          cursor: 'not-allowed',
                        }}
                      />
                    </div>
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
                  {puzzleDuplicateWarning && ((puzzleDuplicateWarning.hasDuplicateName) || (puzzleDuplicateWarning.similars && puzzleDuplicateWarning.similars.length > 0)) && (
                    <div style={{
                      marginBottom: '24px',
                      borderRadius: '12px',
                      padding: '16px',
                      background: puzzleDuplicateWarning.hasDuplicateName ? '#FEE2E2' : '#FFFBEB',
                      borderLeft: `4px solid ${puzzleDuplicateWarning.hasDuplicateName ? '#DC2626' : '#F59E0B'}`,
                    }}>
                      {puzzleDuplicateWarning.hasDuplicateName && (
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{
                            color: '#DC2626',
                            fontWeight: '700',
                            fontSize: '14px',
                            marginBottom: '8px',
                          }}>
                            ⛔ NAME ALREADY EXISTS (UNIQUE)
                          </div>
                          <div style={{
                            color: '#991B1B',
                            fontSize: '13px',
                            lineHeight: '1.5',
                          }}>
                            A puzzle with the unique name <strong>"{puzzleDuplicateWarning.name}"</strong> already exists. Please choose a different label.
                          </div>
                        </div>
                      )}
                      
                      {puzzleDuplicateWarning.similars && puzzleDuplicateWarning.similars.length > 0 && (
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
                      disabled={puzzleDuplicateWarning && puzzleDuplicateWarning.hasDuplicateName}
                      style={{
                        padding: '12px 32px',
                        background: (puzzleDuplicateWarning && puzzleDuplicateWarning.hasDuplicateName) 
                          ? '#CCCCCC'
                          : `linear-gradient(135deg, #FFE66D, #FF85A2)`,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: (puzzleDuplicateWarning && puzzleDuplicateWarning.hasDuplicateName) 
                          ? 'not-allowed'
                          : 'pointer',
                        opacity: (puzzleDuplicateWarning && puzzleDuplicateWarning.hasDuplicateName) 
                          ? '0.6'
                          : '1',
                      }}
                    >
                      Save Puzzle
                    </button>
                    <button
                      onClick={() => {
                        setShowAddPuzzleForm(false);
                        setPuzzleFormData({ displayLabel: '', name: '', type: '', audience: '', pieces: '', difficulty: '' });
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
                  onClick={seedBasePuzzleTemplates}
                  style={{
                    padding: '12px 24px',
                    background: `transparent`,
                    color: '#2FA84F',
                    border: '2px solid #2FA84F',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                  title="Create missing generic templates for all puzzle types"
                >
                  🌱 Seed Base Templates
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

              {/* Quick Create (Modern) */}
              <div style={{
                marginBottom: '24px',
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '16px',
                padding: '24px',
              }}>
                <h3 style={{
                  color: theme.textPrimary,
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0 0 16px 0',
                }}>
                  🧩 Template-Driven Create
                </h3>
                <p style={{ color: theme.textSecondary, margin: '0 0 16px 0' }}>
                  Step 1: Choose a type, select a template, and preview/apply its content into the editor. Step 2: Add puzzle details and save.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {[
                    { label: 'Find Pairs', icon: '🔍', type: 'find-pair' },
                    { label: 'Ordering', icon: '🔢', type: 'ordering' },
                    { label: 'Picture Shadow', icon: '🌙', type: 'picture-shadow' },
                    { label: 'Picture Word Matching', icon: '🖼️', type: 'picture-word' },
                    { label: 'Spot Difference', icon: '🔎', type: 'spot-difference' },
                    { label: 'Word Search', icon: '🔤', type: 'word-search' },
                    { label: 'Jigsaw Puzzles', icon: '🧩', type: 'jigsaw' },
                  ].map(item => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setQuickCreateType(item.type);
                        // Initialize with basic schema
                        if (item.type === 'jigsaw') {
                          setQuickCreateData({ imageUrl: '', rows: 3, cols: 4, variants: [ { label: 'Easy', rows: 3, cols: 4 }, { label: 'Medium', rows: 4, cols: 6 }, { label: 'Hard', rows: 6, cols: 8 } ] });
                        } else if (item.type === 'find-pair') {
                          setQuickCreateData({ pairs: [ { left: 'A', right: 'a' }, { left: 'B', right: 'b' } ] });
                        } else if (item.type === 'ordering') {
                          setQuickCreateData({ items: ['Item 1', 'Item 2', 'Item 3'] });
                        } else if (item.type === 'picture-shadow') {
                          setQuickCreateData({ imagePairs: [ { imageUrl: '', shadowUrl: '' } ] });
                        } else if (item.type === 'picture-word') {
                          setQuickCreateData({ pairs: [ { imageUrl: '', word: '' } ] });
                        } else if (item.type === 'spot-difference') {
                          setQuickCreateData({ baseImageUrl: '', alteredImageUrl: '', differencePoints: [] });
                        } else if (item.type === 'word-search') {
                          setQuickCreateData({ gridRows: [], words: [] });
                        }
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                        background: theme.background, border: `2px solid ${theme.border}`, borderRadius: 10,
                        color: theme.textPrimary, fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                {quickCreateType && (
                    <div style={{ marginTop: 16, background: theme.surfacePrimary, border: `2px solid ${theme.border}`, borderRadius: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      {showQuickDetails && (<h4 style={{ margin: 0, color: theme.textPrimary }}>Inline Editor: {quickCreateType}</h4>)}
                      <button type="button" onClick={resetQuickCreate} style={{ padding: '8px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfaceSecondary, color: theme.textPrimary, cursor: 'pointer' }}>Close</button>
                    </div>

                    {/* Template selection + preview */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <label style={{ fontWeight: 600, color: theme.textSecondary }}>Template</label>
                        <select
                          value={selectedQuickTemplateId}
                          onChange={(e) => setSelectedQuickTemplateId(e.target.value)}
                          disabled={quickTemplatesLoading || quickTemplates.length === 0}
                          style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary, minWidth: 240 }}
                        >
                          <option value="">{quickTemplatesLoading ? 'Loading…' : 'Choose a template'}</option>
                          {quickTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                        {/* Jigsaw configuration moved to appear after template apply (within details/editor) */}
                        <button type="button" onClick={() => setShowQuickPreview(true)} disabled={!selectedQuickTemplateId} style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfaceSecondary, color: theme.textPrimary, cursor: !selectedQuickTemplateId ? 'not-allowed' : 'pointer' }}>Preview</button>
                        <button
                          type="button"
                          onClick={() => {
                            const tpl = quickTemplates.find(t => t.id === selectedQuickTemplateId);
                            if (!tpl) return;
                            const editorKind = quickCreateType;
                            const sanitized = sanitizeTemplateForEditor(tpl, editorKind);
                            // Map sanitized content into editor data shape
                            if (editorKind === 'picture-word') {
                              const newPairs = (sanitized.pairs || []).map((p, idx) => ({ id: `pair-${Date.now()}-${idx}`, image: p.imageUrl || '', word: p.word || '' }));
                              setQuickCreateData({ pairs: newPairs, layout: 'grid-2x2' });
                            } else if (editorKind === 'picture-shadow') {
                              const newPairs = (sanitized.pairs || []).map((p, idx) => ({ id: `pair-${Date.now()}-${idx}`, imageUrl: p.imageUrl || '', shadowUrl: p.shadowUrl || '' }));
                              setQuickCreateData({ pairs: newPairs });
                            } else if (editorKind === 'find-pair') {
                              const newPairs = (sanitized.pairs || []).map((p) => ({ left: p.left || '', right: p.right || '', leftImageUrl: p.leftImageUrl || '', rightImageUrl: p.rightImageUrl || '' }));
                              setQuickCreateData({ pairs: newPairs });
                            } else if (editorKind === 'word-search') {
                              setQuickCreateData({ gridRows: sanitized.gridRows || [], words: sanitized.words || [] });
                            } else if (editorKind === 'spot-difference') {
                              setQuickCreateData({ baseImageUrl: sanitized.baseImageUrl || '', alteredImageUrl: sanitized.alteredImageUrl || '', differencePoints: sanitized.differencePoints || [] });
                            } else if (editorKind === 'ordering') {
                              setQuickCreateData({ items: (sanitized.items || []).map(it => (typeof it === 'string' ? it : (it.label || ''))) });
                            } else if (editorKind === 'jigsaw') {
                              const rows = sanitized.rows || 3;
                              const cols = sanitized.cols || 4;
                              const imageUrl = sanitized.imageUrl || '';
                              setQuickCreateData({ imageUrl, rows, cols, variants: [ { label: 'Default', rows, cols } ] });
                            }
                            setShowQuickDetails(true);
                          }}
                          disabled={!selectedQuickTemplateId}
                          style={{ padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.primary, color: theme.onPrimary, cursor: !selectedQuickTemplateId ? 'not-allowed' : 'pointer', fontWeight: 700 }}
                        >
                          Apply to Editor
                        </button>
                      </div>
                    </div>
                    {showQuickDetails && quickCreateType === 'picture-word' && (
                      <PictureWordEditor data={quickCreateData} onChange={setQuickCreateData} />
                    )}
                    {showQuickDetails && quickCreateType === 'spot-difference' && (
                      <SpotDifferenceEditor data={quickCreateData} onChange={setQuickCreateData} />
                    )}
                    {showQuickDetails && quickCreateType === 'find-pair' && (
                      <FindPairEditor data={quickCreateData} onChange={setQuickCreateData} />
                    )}
                    {showQuickDetails && quickCreateType === 'picture-shadow' && (
                      <PictureShadowEditor data={quickCreateData} onChange={setQuickCreateData} />
                    )}
                    {showQuickDetails && quickCreateType === 'ordering' && (
                      <OrderingEditor data={quickCreateData} onChange={setQuickCreateData} />
                    )}
                    {showQuickDetails && quickCreateType === 'word-search' && (
                      <WordSearchEditor data={quickCreateData} onChange={setQuickCreateData} />
                    )}
                    {showQuickDetails && quickCreateType === 'jigsaw' && (
                      <JigsawEditor data={quickCreateData} onChange={setQuickCreateData} />
                    )}

                    {/* Preview Modal for selected template */}
                    <AdminTemplatePreviewModal
                      open={showQuickPreview}
                      onClose={() => setShowQuickPreview(false)}
                      template={quickTemplates.find(t => t.id === selectedQuickTemplateId)}
                      editorKind={quickCreateType}
                      currentData={quickCreateData}
                    />

                    {/* Puzzle Details (shown after template applied) */}
                    {showQuickDetails && (
                    <div style={{ marginTop: 16, background: theme.background, border: `2px solid ${theme.border}`, borderRadius: 12, padding: 12 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: theme.textPrimary }}>Title *</label>
                          <input value={qcTitle} onChange={(e) => setQcTitle(e.target.value)} placeholder="e.g., Panda Patrol Jigsaw" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: theme.textPrimary }}>Difficulty</label>
                          <select value={qcDifficulty} onChange={(e) => setQcDifficulty(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}>
                            {['easy','medium','hard'].map(d => (<option key={d} value={d}>{d}</option>))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: theme.textPrimary }}>Age Group</label>
                          <select value={qcAgeGroup} onChange={(e) => setQcAgeGroup(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}>
                            {['4-5','5-6','6-7','6-8','7-8','8-9'].map(a => (<option key={a} value={a}>{a} years</option>))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: theme.textPrimary }}>Category *</label>
                          <select value={qcCategoryId} onChange={(e) => { setQcCategoryId(e.target.value); const cat = categoriesList.find(c => c.id === e.target.value); setQcCategoryName(cat?.name || ''); setQcTopicId(''); setQcTopicName(''); setQcSubtopicId(''); setQcSubtopicName(''); loadTopicsForCategory(e.target.value); }} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}>
                            <option value="">Select Category</option>
                            {categoriesList.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: theme.textPrimary }}>Topic *</label>
                          <select value={qcTopicId} disabled={!qcCategoryId} onChange={(e) => { setQcTopicId(e.target.value); const t = topicsList.find(t => t.id === e.target.value); setQcTopicName(t?.name || ''); setQcSubtopicId(''); setQcSubtopicName(''); loadSubtopicsForTopic(e.target.value); }} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}>
                            <option value="">Select Topic</option>
                            {topicsList.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, color: theme.textPrimary }}>Subtopic *</label>
                          <select value={qcSubtopicId} disabled={!qcTopicId} onChange={(e) => { setQcSubtopicId(e.target.value); const s = subtopicsList.find(s => s.id === e.target.value); setQcSubtopicName(s?.name || ''); }} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}>
                            <option value="">Select Subtopic</option>
                            {subtopicsList.map(s => (<option key={s.id} value={s.id}>{s.name}</option>))}
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: theme.textPrimary }}>
                          <input type="checkbox" checked={qcIsPublished} onChange={(e) => setQcIsPublished(e.target.checked)} />
                          Publish
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: theme.textSecondary }}>XP</span>
                          <input type="number" min={1} max={100} value={qcXpReward} onChange={(e) => setQcXpReward(Number(e.target.value) || 10)} style={{ width: 90, padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }} />
                        </div>

                        <button type="button" onClick={async () => {
                          // Basic validation
                          if (!qcTitle.trim() || !qcCategoryId || !qcTopicId || !qcSubtopicId) {
                            alert('Please fill Title, Category, Topic, and Subtopic');
                            return;
                          }
                          try {
                            if (['find-pair','picture-word','spot-difference','picture-shadow','ordering','word-search'].includes(quickCreateType)) {
                              const payload = {
                                title: qcTitle,
                                description: qcDescription,
                                type: quickCreateType,
                                difficulty: qcDifficulty,
                                ageGroup: qcAgeGroup,
                                categoryId: qcCategoryId,
                                categoryName: qcCategoryName,
                                topicId: qcTopicId,
                                topicName: qcTopicName,
                                subtopicId: qcSubtopicId,
                                subtopicName: qcSubtopicName,
                                xpReward: qcXpReward,
                                isPublished: qcIsPublished,
                                data: quickCreateData,
                              };
                              await createVisualPuzzle(payload);
                            } else if (quickCreateType === 'jigsaw') {
                              await addDoc(collection(db, 'puzzles'), {
                                title: qcTitle,
                                description: qcDescription,
                                type: 'jigsaw',
                                puzzleType: 'traditional',
                                difficulty: qcDifficulty,
                                ageGroup: qcAgeGroup,
                                categoryId: qcCategoryId,
                                categoryName: qcCategoryName,
                                topicId: qcTopicId,
                                topicName: qcTopicName,
                                subtopicId: qcSubtopicId,
                                subtopicName: qcSubtopicName,
                                xpReward: qcXpReward,
                                isPublished: qcIsPublished || false,
                                data: quickCreateData,
                                featureId: 'puzzles',
                                createdAt: serverTimestamp(),
                                updatedAt: serverTimestamp(),
                              });
                            }
                            resetQuickCreate();
                            alert('✅ Puzzle created successfully');
                          } catch (err) {
                            console.error('Save error', err);
                            alert('❌ Error saving puzzle: ' + (err.message || 'Unknown error'));
                          }
                        }} style={{ marginLeft: 'auto', padding: '10px 14px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.primary, color: theme.onPrimary, cursor: 'pointer', fontWeight: 700 }}>Save Puzzle</button>
                      </div>
                    </div>
                    )}
                  </div>
                )}
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

                  </div>
                  {/* Unified Template-First (Visual) for Create New Puzzle */}
                  <div style={{ marginTop: 12, background: theme.surfaceSecondary, border: `2px solid ${theme.border}`, borderRadius: 12, padding: 12 }}>
                    <h4 style={{ margin: '0 0 12px 0', color: theme.textPrimary }}>📋 Puzzle Creation (Template-Driven)</h4>

                    {/* Step 1: Select Visual Type & Template */}
                    {!cnEditorData && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, alignItems: 'start' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Visual Type</div>
                          <select
                            value={cnVisualType}
                            onChange={(e) => {
                              setCnVisualType(e.target.value);
                              setCnSelectedTemplateId('');
                              setCnShowInputForm(false);
                              setCnTemplateInputs(null);
                              setCnExecutionResult(null);
                              setCnEditorData(null);
                            }}
                            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}
                          >
                            <option value="">Choose visual type</option>
                            <option value="find-pair">Find Pairs</option>
                            <option value="ordering">Ordering</option>
                            <option value="picture-shadow">Picture Shadow</option>
                            <option value="picture-word">Picture Word Matching</option>
                            <option value="spot-difference">Spot Difference</option>
                            <option value="word-search">Word Search</option>
                            <option value="jigsaw">Jigsaw</option>
                          </select>
                        </div>

                        {cnVisualType && (
                          <div>
                            <div style={{ fontWeight: 600, color: theme.textSecondary, marginBottom: 6 }}>Template</div>
                            <select
                              value={cnSelectedTemplateId}
                              onChange={(e) => {
                                setCnSelectedTemplateId(e.target.value);
                                setCnShowInputForm(true);
                                setCnTemplateInputs(null);
                                setCnExecutionResult(null);
                              }}
                              disabled={cnTemplatesLoading || cnTemplates.length === 0}
                              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary }}
                            >
                              <option value="">{cnTemplatesLoading ? 'Loading…' : 'Choose a template'}</option>
                              {cnTemplates.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))}
                            </select>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 2: Show Input Form (based on template schema) */}
                    {cnShowInputForm && cnSelectedTemplateId && (
                      <>
                        <TemplateInputForm
                          template={cnTemplates.find(t => t.id === cnSelectedTemplateId)}
                          typeKey={cnVisualType}
                          onInputsReady={async (inputs) => {
                            setCnTemplateInputs(inputs);
                            setCnExecutionLoading(true);
                            setCnExecutionError('');
                            try {
                              const tpl = cnTemplates.find(t => t.id === cnSelectedTemplateId);
                              const result = await runTemplate(cnVisualType, tpl.schema, inputs);
                              if (!result.ok) {
                                setCnExecutionError(result.error || 'Template execution failed');
                                return;
                              }
                              setCnExecutionResult(result.result);
                            } catch (e) {
                              setCnExecutionError(e.message || 'Execution error');
                            } finally {
                              setCnExecutionLoading(false);
                            }
                          }}
                          onLoading={(loading) => setCnExecutionLoading(loading)}
                        />
                      </>
                    )}

                    {/* Step 3: Show Execution Preview */}
                    {cnExecutionResult && (
                      <div style={{ background: theme.surfacePrimary, border: `2px solid ${theme.border}`, borderRadius: 12, padding: 16, marginTop: 12 }}>
                        <h4 style={{ margin: '0 0 12px 0', color: theme.textPrimary }}>✓ Template Executed</h4>
                        <p style={{ margin: '0 0 16px 0', color: theme.textSecondary }}>Preview all difficulty variants:</p>

                        {cnVisualType === 'jigsaw' && cnExecutionResult && cnExecutionResult.variants && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
                            {cnExecutionResult.variants.map((variant, vidx) => (
                              <div key={vidx} style={{
                                background: theme.surfaceSecondary,
                                border: `2px solid ${theme.border}`,
                                borderRadius: 10,
                                padding: 12,
                              }}>
                                <h5 style={{ margin: '0 0 8px 0', color: theme.textPrimary }}>
                                  {variant.label} ({variant.rows} × {variant.cols} = {variant.rows * variant.cols} pieces)
                                </h5>
                                {!variant.error && variant.imageUrl && (
                                  <div style={{ position: 'relative', width: '100%', paddingTop: '66%', background: '#f1f5f9', borderRadius: 8, overflow: 'hidden', border: `1px solid ${theme.border}` }}>
                                    {/* Full image with GRID overlay showing interlocking piece boundaries */}
                                    <img src={variant.imageUrl} alt={`variant-${variant.label}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                                    
                                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                                      {/* Grid overlay with interlocking puzzle piece boundaries */}
                                      {Array.from({ length: variant.rows }).map((_, row) =>
                                        Array.from({ length: variant.cols }).map((_, col) => {
                                          const pieceWidth = 400 / variant.cols;
                                          const pieceHeight = 300 / variant.rows;
                                          const tabDepth = Math.min(pieceWidth, pieceHeight) * 0.5;
                                          const x0 = col * pieceWidth;
                                          const y0 = row * pieceHeight;
                                          const x1 = (col + 1) * pieceWidth;
                                          const y1 = (row + 1) * pieceHeight;
                                          
                                          let path = `M ${x0} ${y0}`;
                                          
                                          // Top
                                          if (row === 0) {
                                            path += ` L ${x1} ${y0}`;
                                          } else {
                                            path += ` L ${x0 + pieceWidth * 0.1} ${y0}`;
                                            if ((col + row) % 2 === 0) {
                                              path += ` Q ${x0 + pieceWidth * 0.5} ${y0 - tabDepth}, ${x0 + pieceWidth * 0.9} ${y0}`;
                                            } else {
                                              path += ` Q ${x0 + pieceWidth * 0.5} ${y0 + tabDepth}, ${x0 + pieceWidth * 0.9} ${y0}`;
                                            }
                                            path += ` L ${x1} ${y0}`;
                                          }
                                          
                                          // Right
                                          if (col === variant.cols - 1) {
                                            path += ` L ${x1} ${y1}`;
                                          } else {
                                            path += ` L ${x1} ${y0 + pieceHeight * 0.1}`;
                                            if ((col + row + 1) % 2 === 0) {
                                              path += ` Q ${x1 + tabDepth} ${y0 + pieceHeight * 0.5}, ${x1} ${y0 + pieceHeight * 0.9}`;
                                            } else {
                                              path += ` Q ${x1 - tabDepth} ${y0 + pieceHeight * 0.5}, ${x1} ${y0 + pieceHeight * 0.9}`;
                                            }
                                            path += ` L ${x1} ${y1}`;
                                          }
                                          
                                          // Bottom
                                          if (row === variant.rows - 1) {
                                            path += ` L ${x0} ${y1}`;
                                          } else {
                                            path += ` L ${x0 + pieceWidth * 0.9} ${y1}`;
                                            if ((col + row) % 2 === 0) {
                                              path += ` Q ${x0 + pieceWidth * 0.5} ${y1 + tabDepth}, ${x0 + pieceWidth * 0.1} ${y1}`;
                                            } else {
                                              path += ` Q ${x0 + pieceWidth * 0.5} ${y1 - tabDepth}, ${x0 + pieceWidth * 0.1} ${y1}`;
                                            }
                                            path += ` L ${x0} ${y1}`;
                                          }
                                          
                                          // Left
                                          if (col === 0) {
                                            path += ` L ${x0} ${y0}`;
                                          } else {
                                            path += ` L ${x0} ${y0 + pieceHeight * 0.9}`;
                                            if ((col + row + 1) % 2 === 0) {
                                              path += ` Q ${x0 - tabDepth} ${y0 + pieceHeight * 0.5}, ${x0} ${y0 + pieceHeight * 0.1}`;
                                            } else {
                                              path += ` Q ${x0 + tabDepth} ${y0 + pieceHeight * 0.5}, ${x0} ${y0 + pieceHeight * 0.1}`;
                                            }
                                            path += ` L ${x0} ${y0}`;
                                          }
                                          
                                          return (
                                            <path
                                              key={`grid-${row}-${col}`}
                                              d={path}
                                              fill="none"
                                              stroke="#1a1a2e"
                                              strokeWidth="0.8"
                                              opacity="0.8"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          );
                                        })
                                      )}
                                    </svg>
                                  </div>
                                )}
                                {variant.error && (
                                  <p style={{ margin: 0, color: '#991b1b', fontSize: 12 }}>⚠️ {variant.error}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                          <button
                            type="button"
                            onClick={() => {
                              // Proceed to editor - use first variant as base
                              if (cnVisualType === 'jigsaw' && cnExecutionResult.variants && cnExecutionResult.variants.length > 0) {
                                const firstVariant = cnExecutionResult.variants[0];
                                setCnEditorData({
                                  imageUrl: cnExecutionResult.imageUrl,
                                  rows: firstVariant.rows,
                                  cols: firstVariant.cols,
                                  variants: cnExecutionResult.variants.map(v => ({
                                    label: v.label,
                                    rows: v.rows,
                                    cols: v.cols,
                                  })),
                                });
                              }
                            }}
                            style={{ padding: '10px 14px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.primary, color: theme.onPrimary, fontWeight: 700, cursor: 'pointer' }}
                          >
                            ✓ Continue to Editor
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCnShowInputForm(false);
                              setCnTemplateInputs(null);
                              setCnExecutionResult(null);
                              setCnExecutionError('');
                            }}
                            style={{ padding: '10px 14px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary, cursor: 'pointer' }}
                          >
                            ← Back
                          </button>
                        </div>
                      </div>
                    )}

                    {cnExecutionError && (
                      <div style={{ background: '#fee2e2', border: '2px solid #fca5a5', borderRadius: 12, padding: 12, marginTop: 12, color: '#991b1b' }}>
                        ⚠️ {cnExecutionError}
                      </div>
                    )}

                    {/* Step 4: Editor & Save */}
                    {cnEditorData && (
                      <div style={{ marginTop: 12 }}>
                        <h4 style={{ margin: '0 0 12px 0', color: theme.textPrimary }}>🎨 Edit Puzzle</h4>
                        {cnVisualType === 'picture-word' && (
                          <PictureWordEditor data={cnEditorData} onChange={setCnEditorData} />
                        )}
                        {cnVisualType === 'spot-difference' && (
                          <SpotDifferenceEditor data={cnEditorData} onChange={setCnEditorData} />
                        )}
                        {cnVisualType === 'find-pair' && (
                          <FindPairEditor data={cnEditorData} onChange={setCnEditorData} />
                        )}
                        {cnVisualType === 'picture-shadow' && (
                          <PictureShadowEditor data={cnEditorData} onChange={setCnEditorData} />
                        )}
                        {cnVisualType === 'ordering' && (
                          <OrderingEditor data={cnEditorData} onChange={setCnEditorData} />
                        )}
                        {cnVisualType === 'word-search' && (
                          <WordSearchEditor data={cnEditorData} onChange={setCnEditorData} />
                        )}
                        {cnVisualType === 'jigsaw' && (
                          <JigsawEditor data={cnEditorData} onChange={setCnEditorData} />
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                          <button
                            onClick={() => {
                              setCnVisualType('');
                              setCnSelectedTemplateId('');
                              setCnShowInputForm(false);
                              setCnTemplateInputs(null);
                              setCnExecutionResult(null);
                              setCnEditorData(null);
                            }}
                            style={{ padding: '10px 14px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.surfacePrimary, color: theme.textPrimary, cursor: 'pointer' }}
                          >
                            Reset
                          </button>
                          <button
                            onClick={async () => {
                              if (!qcTitle?.trim()) { alert('Please enter Title'); return; }
                              try {
                                const puzzleDoc = {
                                  title: qcTitle,
                                  description: qcDescription,
                                  type: cnVisualType,
                                  difficulty: qcDifficulty,
                                  ageGroup: qcAgeGroup,
                                  content: cnEditorData,
                                  // For Jigsaw, store the image URL and all variants
                                  imageUrl: cnVisualType === 'jigsaw' ? cnEditorData?.imageUrl : undefined,
                                  variants: cnVisualType === 'jigsaw' && cnEditorData?.variants ? cnEditorData.variants : undefined,
                                  categoryId: qcCategoryId,
                                  topicId: qcTopicId,
                                  subtopicId: qcSubtopicId,
                                  isPublished: qcIsPublished,
                                  xpReward: Number(qcXpReward) || 10,
                                  createdAt: serverTimestamp(),
                                };
                                await addDoc(collection(db, 'puzzles'), puzzleDoc);
                                alert('✓ Puzzle saved!');
                                setCnVisualType('');
                                setCnSelectedTemplateId('');
                                setCnShowInputForm(false);
                                setCnTemplateInputs(null);
                                setCnExecutionResult(null);
                                setCnEditorData(null);
                                setQcTitle('');
                                setQcDescription('');
                              } catch (e) {
                                alert('Save error: ' + e.message);
                              }
                            }}
                            style={{ padding: '10px 14px', borderRadius: 8, border: `2px solid ${theme.border}`, background: theme.primary, color: theme.onPrimary, fontWeight: 700, cursor: 'pointer' }}
                          >
                            💾 Save Puzzle
                          </button>
                        </div>
                      </div>
                    )}
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
