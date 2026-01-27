import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import AudienceSelector, { AUDIENCES } from '../components/AudienceSelector';
import { seedQuizzesWithVariants } from '../scripts/seedQuizzesWithVariants';
import { setupTestQuizzes } from './utils/setupTestQuizzesAPI';
import { useAppIntegration } from '../hooks/useAppIntegration';
import { useAuth } from '../components/AuthProvider';
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
import AdminQuizBuilder from '../quizzes/admin/AdminQuizBuilder';
import AdminPuzzleBuilder from './AdminPuzzleBuilder';
import VisibilityBadge from '../components/badges/VisibilityBadge';
import FeaturedBadge from '../components/badges/FeaturedBadge';
import AdminStatusFilter from './components/AdminStatusFilter';
import ChartBarSvg from './components/ChartBarSvg';
import { BASE_PUZZLE_TEMPLATES } from './dashboard-constants';
import { STORY_TEMPLATES, SAMPLE_QUIZZES } from './dashboard-data';
import { SETUP_DATA, ADMIN_TABS, DASHBOARD_STATS, RECENT_ACTIVITIES } from './dashboard-setup';
import AdminOverviewTab from './tabs/AdminOverviewTab';
import AdminQuizzesTab from './tabs/AdminQuizzesTab';
import AdminPuzzlesTab from './tabs/AdminPuzzlesTab';
import AdminStoriesTab from './tabs/AdminStoriesTab';
import AdminArtsTab from './tabs/AdminArtsTab';
import AdminDocumentsTab from './tabs/AdminDocumentsTab';
import AdminStudiesTab from './tabs/AdminStudiesTab';
import AdminWorksheetsTab from './tabs/AdminWorksheetsTab';
import AdminUsersTab from './tabs/AdminUsersTab';
import AdminFeaturesTab from './tabs/AdminFeaturesTab';
import AdminSettingsTab from './tabs/AdminSettingsTab';
import AdminQuizTypesTab from './tabs/AdminQuizTypesTab';
import AdminPuzzleTypesTab from './tabs/AdminPuzzleTypesTab';

// ===== EXTRACTED CONSTANTS =====
// STORY_TEMPLATES imported from dashboard-data.js
// SAMPLE_QUIZZES imported from dashboard-data.js  
// SETUP_DATA imported from dashboard-setup.js
// ADMIN_TABS imported from dashboard-setup.js
// DASHBOARD_STATS imported from dashboard-setup.js
// RECENT_ACTIVITIES imported from dashboard-setup.js
// BASE_PUZZLE_TEMPLATES imported from dashboard-constants.js

export default function ModernAdminDashboard() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { quizService, currentTheme } = useAppIntegration();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showAddQuizForm, setShowAddQuizForm] = useState(false);
  const [showUniversalQuizBuilder, setShowUniversalQuizBuilder] = useState(false);
  const [showQuizBuilderPanel, setShowQuizBuilderPanel] = useState(false);
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false);
  const [editingQuizData, setEditingQuizData] = useState(null);
  const [showBulkImportQuiz, setShowBulkImportQuiz] = useState(false);
  const [bulkImportData, setBulkImportData] = useState('');
  const [showAddPuzzleForm, setShowAddPuzzleForm] = useState(false);
  const [showUniversalPuzzleBuilder, setShowUniversalPuzzleBuilder] = useState(false);
  const [editingPuzzleData, setEditingPuzzleData] = useState(null);
  const [showAddStoryForm, setShowAddStoryForm] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [newTemplateData, setNewTemplateData] = useState({ title: '', description: '', targetAudience: '', chapters: [{ title: '', description: '' }] });
  const [quizzes, setQuizzes] = useState([]);
  const [puzzles, setPuzzles] = useState([]);
  const [stories, setStories] = useState([]);
  const [scores, setScores] = useState([]);
  const [dbStats, setDbStats] = useState(null);
  const [quizFormData, setQuizFormData] = useState({ title: '', category: '', audience: '', questions: '', difficulty: '' });
  const [puzzleFormData, setPuzzleFormData] = useState({ displayLabel: '', name: '', type: '', audience: '', pieces: '', difficulty: '' });
  const [storyFormData, setStoryFormData] = useState({ title: '', category: '', audience: '', chapters: '', selectedTemplate: '' });

  // Hash-based routing for tabs
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove '#'
      if (hash && ADMIN_TABS.some(tab => tab.id === hash)) {
        setActiveTab(hash);
      } else if (!hash) {
        setActiveTab('overview');
      }
    };

    // Set initial tab from hash on mount
    handleHashChange();

    // Listen for hash changes (browser back/forward)
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = tabId;
  };

  // Story templates imported from dashboard-data.js

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
  const [activitiesSortBy, setActivitiesSortBy] = useState('time'); // 'time', 'type', 'action'
  const [activitiesTypeFilter, setActivitiesTypeFilter] = useState('all'); // 'all', 'quiz', 'puzzle', 'story', 'art', 'document', 'study', 'worksheet', 'user'
  const [activitiesLimitRows, setActivitiesLimitRows] = useState(20);
  const [addingSampleQuizzes, setAddingSampleQuizzes] = useState(false);
  const [seedingQuizzes, setSeedingQuizzes] = useState(false);
  const [seedProgress, setSeedProgress] = useState(null);
  const [seedResults, setSeedResults] = useState(null);
  const [creatingPhase1Quizzes, setCreatingPhase1Quizzes] = useState(false);
  const [phase1Progress, setPhase1Progress] = useState(null);
  const [phase1Results, setPhase1Results] = useState(null);
  const [deletingQuizzes, setDeletingQuizzes] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState(null);
  const [deleteResults, setDeleteResults] = useState(null);
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

  // Map visual types to their Firestore typeKey
  const typeKeyFor = (editorType) => ({
    'find-pair': 'findPairs',
    'picture-word': 'pictureWordMatching',
    'picture-shadow': 'pictureShadow',
    'word-search': 'wordSearch',
    'spot-difference': 'spotDifference',
    'ordering': 'ordering',
    'jigsaw': 'jigsaw',
  }[editorType] || '');

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
    
    // SAMPLE_QUIZZES imported from dashboard-data.js

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
  // ADMIN_TABS imported from dashboard-setup.js

  // DASHBOARD_STATS imported from dashboard-setup.js as a function
  const dashboardStats = DASHBOARD_STATS(quizzes, puzzles, stories);

  // RECENT_ACTIVITIES imported from dashboard-setup.js

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

  // Handle save from AdminQuizBuilder
  const handleSaveUniversalQuiz = async (quizData) => {
    try {
      // Add timestamp
      const quizWithTimestamp = {
        ...quizData,
        createdDate: new Date(),
        status: 'Draft',
        plays: 0,
        published: false,
      };
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'quizzes'), quizWithTimestamp);
      
      // Add to local state
      setQuizzes([{ id: docRef.id, ...quizWithTimestamp }, ...quizzes]);
      
      // Close builder and show success message
      setShowUniversalQuizBuilder(false);
      alert(`✅ Quiz "${quizData.title}" created successfully!`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('❌ Error saving quiz. Please try again.');
    }
  };

  // Handle bulk import quizzes with complete data (metadata + questions + options + answers)
  const handleBulkImportQuiz = async () => {
    if (!bulkImportData.trim()) {
      alert('❌ Please paste complete quiz JSON data');
      return;
    }

    try {
      let quizzesToImport = [];

      // Parse as JSON (required format for complete quiz data)
      try {
        const jsonData = JSON.parse(bulkImportData);
        quizzesToImport = Array.isArray(jsonData) ? jsonData : [jsonData];
      } catch (parseError) {
        alert('❌ Invalid JSON format. Please ensure your data is valid JSON.\n\nFor help, see the format examples in the textarea placeholder.');
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      const errors = [];

      for (const quizData of quizzesToImport) {
        try {
          // Validate required fields
          if (!quizData.title || !quizData.category || !quizData.quizType) {
            throw new Error('Missing required fields: title, category, quizType');
          }

          // Build complete quiz object with metadata AND questions
          const quizWithTimestamp = {
            // Metadata
            title: quizData.title,
            category: quizData.category,
            audience: quizData.audience || 'All Ages',
            level: quizData.level || 'Beginner',
            quizType: quizData.quizType,
            description: quizData.description || '',
            
            // Settings
            metadata: {
              timeLimit: parseInt(quizData.timeLimit) || 1800,
              passingScore: parseInt(quizData.passingScore) || 60,
              attempts: parseInt(quizData.attempts) || 1,
              shuffle: quizData.shuffle === 'true' || quizData.shuffle === true,
              partialScoring: quizData.partialScoring === 'true' || quizData.partialScoring === true,
              showExplanation: quizData.showExplanation !== 'false' && quizData.showExplanation !== false,
            },
            
            // Multiple levels support
            levelVariant: quizData.levelVariant || 'standard',
            
            // Questions - COMPLETE with options, answers, media
            questions: (quizData.questions || []).map((q, idx) => ({
              id: q.id || `q_${Date.now()}_${idx}`,
              order: q.order || idx + 1,
              text: q.text || '',
              type: q.type || 'multiple-choice',
              
              // For multiple choice questions
              options: (q.options || []).map((opt, optIdx) => ({
                id: opt.id || `opt_${Date.now()}_${optIdx}`,
                text: opt.text || '',
                image: opt.image || null,
                video: opt.video || null,
                correct: opt.correct === true || opt.correct === 'true',
              })),
              
              // Correct answer(s)
              correctAnswers: q.correctAnswers || [],
              
              // Answer explanation
              explanation: q.explanation || '',
              explanationImage: q.explanationImage || null,
              explanationVideo: q.explanationVideo || null,
              
              // Media
              image: q.image || null,
              video: q.video || null,
              audio: q.audio || null,
              
              // Points and difficulty
              points: q.points || 1,
              difficulty: q.difficulty || 'medium',
              
              // Additional metadata
              tags: q.tags || [],
              hints: q.hints || [],
            })),
            
            // File metadata
            createdDate: new Date(),
            status: 'Draft',
            plays: 0,
            published: false,
          };

          const docRef = await addDoc(collection(db, 'quizzes'), quizWithTimestamp);
          setQuizzes(prev => [{ id: docRef.id, ...quizWithTimestamp }, ...prev]);
          successCount++;
        } catch (err) {
          console.error('Error importing quiz:', err);
          errors.push(`"${quizData.title || 'Unknown'}": ${err.message}`);
          errorCount++;
        }
      }

      setShowBulkImportQuiz(false);
      setBulkImportData('');
      
      let message = `✅ Import Complete!\n✓ ${successCount} quizzes imported\n✗ ${errorCount} failed`;
      if (errors.length > 0 && errors.length <= 5) {
        message += `\n\nErrors:\n${errors.join('\n')}`;
      }
      alert(message);
    } catch (error) {
      console.error('Error in bulk import:', error);
      alert('❌ Error importing quizzes. Check your JSON format and try again.');
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
        setStoryFormData({ title: '', category: '', audience: '', chapters: '', selectedTemplate: '' });
        setShowAddStoryForm(false);
      } catch (error) {
        console.error('Error adding story:', error);
      }
    }
  };

  // Seed Sample Quizzes to Firebase
  const handleSeedQuizzes = async () => {
    try {
      setSeedingQuizzes(true);
      setSeedProgress(null);
      setSeedResults(null);

      console.log('🌱 Starting quiz seed process with variants...');

      const results = await seedQuizzesWithVariants((progress) => {
        setSeedProgress(progress);
      });

      setSeedResults(results);
      setSeedingQuizzes(false);

      // Log detailed results for debugging
      if (results.failed > 0) {
        console.error('🔴 Seed Failures:', results.errors);
        console.table(results.errors);
      } else {
        console.log('✅ All quizzes seeded successfully!');
        // Only auto-refresh if all successful
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Error seeding quizzes:', error);
      setSeedResults({
        success: 0,
        failed: 11,
        errors: [{ title: 'All', error: error.message }],
      });
      setSeedingQuizzes(false);
    }
  };

  // Create Phase 1 Test Quizzes
  const handleCreatePhase1Quizzes = async () => {
    try {
      setCreatingPhase1Quizzes(true);
      setPhase1Progress(null);
      setPhase1Results(null);

      console.log('🚀 Starting Phase 1 test quiz creation...');

      const results = await setupTestQuizzes((progress) => {
        setPhase1Progress(progress);
      });

      setPhase1Results(results);
      setCreatingPhase1Quizzes(false);

      // Log detailed results
      if (results.failed > 0) {
        console.error('🔴 Creation Failures:', results.errors);
        console.table(results.errors);
      } else {
        console.log('✅ All Phase 1 test quizzes created successfully!');
        // Auto-refresh after success
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error creating Phase 1 quizzes:', error);
      setPhase1Results({
        success: 0,
        failed: 9,
        errors: [{ error: error.message }],
      });
      setCreatingPhase1Quizzes(false);
    }
  };

  // Delete all quizzes from database
  const handleDeleteAllQuizzes = async () => {
    if (!window.confirm('🗑️ DELETE ALL QUIZZES? This action cannot be undone. All quiz data will be permanently removed.')) {
      return;
    }

    try {
      setDeletingQuizzes(true);
      setDeleteProgress(null);
      setDeleteResults(null);

      console.log('🗑️ Starting deletion of all quizzes...');

      const quizzesRef = collection(db, 'quizzes');
      const snapshot = await getDocs(quizzesRef);

      setDeleteProgress({
        current: 0,
        total: snapshot.docs.length,
      });

      let deleted = 0;
      let failed = 0;
      const errors = [];

      for (let i = 0; i < snapshot.docs.length; i++) {
        const quizDoc = snapshot.docs[i];
        try {
          await deleteDoc(doc(db, 'quizzes', quizDoc.id));
          deleted++;
          setDeleteProgress({
            current: i + 1,
            total: snapshot.docs.length,
          });
        } catch (error) {
          failed++;
          errors.push({
            id: quizDoc.id,
            error: error.message,
          });
        }
      }

      setDeleteResults({
        success: deleted,
        failed: failed,
        total: snapshot.docs.length,
        errors: errors,
      });

      setDeletingQuizzes(false);

      // Refresh quiz list after deletion
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('❌ Error deleting quizzes:', error);
      setDeleteResults({
        success: 0,
        failed: 1,
        errors: [{ error: error.message }],
      });
      setDeletingQuizzes(false);
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

  const handleCreateTemplate = async () => {
    if (!newTemplateData.title.trim()) {
      alert('Please enter a template title');
      return;
    }
    if (newTemplateData.chapters.length === 0 || newTemplateData.chapters.some(c => !c.title.trim())) {
      alert('Please enter titles for all chapters');
      return;
    }
    try {
      // Save to Firestore storyTemplates collection
      const docRef = await addDoc(collection(db, 'storyTemplates'), {
        ...newTemplateData,
        createdAt: serverTimestamp(),
      });
      
      // Show success message
      alert('Template created successfully!');
      setShowCreateTemplateModal(false);
      setNewTemplateData({ title: '', description: '', targetAudience: '', chapters: [{ title: '', description: '' }] });
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Error creating template: ' + error.message);
    }
  };

  // Handle saving quiz from Quiz Builder component
  const handleSaveQuizFromBuilder = async (quizData) => {
    try {
      if (!quizData || !quizData.title) {
        alert('❌ Please provide a quiz title');
        return;
      }

      // Prepare quiz with metadata
      const quizWithMetadata = {
        title: quizData.title,
        description: quizData.description || '',
        category: quizData.category || 'General',
        difficulty: quizData.difficulty || 'Medium',
        questions: quizData.questions || [],
        tags: quizData.tags || [],
        createdDate: new Date(),
        updatedDate: new Date(),
        status: 'Draft',
        plays: 0,
        published: false,
        author: user?.email || 'admin',
        timer: quizData.timer || null,
        shuffleQuestions: quizData.shuffleQuestions || false,
        shuffleOptions: quizData.shuffleOptions || false,
        showResults: quizData.showResults || true,
      };

      // Save to Firestore using quizService
      if (quizService && quizService.createQuiz) {
        const savedQuiz = await quizService.createQuiz(quizWithMetadata);
        
        // Update local state
        setQuizzes([savedQuiz, ...quizzes]);
        
        // Show success message
        alert(`✅ Quiz "${quizData.title}" saved successfully!`);
        
        // Switch to quizzes tab to show the new quiz
        setActiveTab('quizzes');
      } else {
        // Fallback: Save directly to Firestore
        const docRef = await addDoc(collection(db, 'quizzes'), quizWithMetadata);
        setQuizzes([{ id: docRef.id, ...quizWithMetadata }, ...quizzes]);
        alert(`✅ Quiz "${quizData.title}" saved successfully!`);
        setActiveTab('quizzes');
      }
    } catch (error) {
      console.error('Error saving quiz from builder:', error);
      alert(`❌ Error saving quiz: ${error.message}`);
    }
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

      {/* Create Story Template Modal */}
      {showCreateTemplateModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1003,
        }} onClick={() => setShowCreateTemplateModal(false)}>
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: '16px',
            width: '95%',
            maxWidth: '600px',
            maxHeight: '85vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 20px 80px rgba(0,0,0,0.4)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: theme.textPrimary, fontSize: '20px', fontWeight: '800' }}>
                ➕ Create New Story Template
              </h2>
              <button
                onClick={() => setShowCreateTemplateModal(false)}
                style={{ background: 'transparent', border: 'none', color: theme.textSecondary, fontSize: '24px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: theme.textPrimary, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Template Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Science Experiment Journey"
                value={newTemplateData.title}
                onChange={(e) => setNewTemplateData({ ...newTemplateData, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '6px',
                  color: theme.textPrimary,
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: theme.textPrimary, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Description
              </label>
              <input
                type="text"
                placeholder="Describe this template..."
                value={newTemplateData.description}
                onChange={(e) => setNewTemplateData({ ...newTemplateData, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '6px',
                  color: theme.textPrimary,
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: theme.textPrimary, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                Target Audience
              </label>
              <select
                value={newTemplateData.targetAudience}
                onChange={(e) => setNewTemplateData({ ...newTemplateData, targetAudience: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '6px',
                  color: theme.textPrimary,
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              >
                <option value="">Select audience</option>
                <option value="kids">Kids</option>
                <option value="general">General</option>
                <option value="programmers">Programmers</option>
                <option value="students">Students</option>
                <option value="professionals">Professionals</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label style={{ color: theme.textPrimary, fontSize: '12px', fontWeight: '600' }}>
                  Chapters *
                </label>
                <button
                  onClick={() => setNewTemplateData({
                    ...newTemplateData,
                    chapters: [...newTemplateData.chapters, { title: '', description: '' }]
                  })}
                  style={{
                    padding: '4px 8px',
                    background: theme.accentPrimary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  + Add Chapter
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {newTemplateData.chapters.map((chapter, idx) => (
                  <div key={idx} style={{
                    padding: '12px',
                    background: theme.background,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: theme.textSecondary, fontSize: '11px', fontWeight: '600' }}>Chapter {idx + 1}</span>
                      {newTemplateData.chapters.length > 1 && (
                        <button
                          onClick={() => setNewTemplateData({
                            ...newTemplateData,
                            chapters: newTemplateData.chapters.filter((_, i) => i !== idx)
                          })}
                          style={{
                            padding: '2px 6px',
                            background: '#FF6B6B',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            fontSize: '11px',
                            cursor: 'pointer',
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Chapter title"
                      value={chapter.title}
                      onChange={(e) => {
                        const updated = [...newTemplateData.chapters];
                        updated[idx].title = e.target.value;
                        setNewTemplateData({ ...newTemplateData, chapters: updated });
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: theme.surfaceSecondary,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '4px',
                        color: theme.textPrimary,
                        fontSize: '12px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                        marginBottom: '6px',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Chapter description"
                      value={chapter.description}
                      onChange={(e) => {
                        const updated = [...newTemplateData.chapters];
                        updated[idx].description = e.target.value;
                        setNewTemplateData({ ...newTemplateData, chapters: updated });
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        background: theme.surfaceSecondary,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '4px',
                        color: theme.textPrimary,
                        fontSize: '12px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleCreateTemplate}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: `linear-gradient(135deg, #f093fb, #f5576c)`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Create Template
              </button>
              <button
                onClick={() => setShowCreateTemplateModal(false)}
                style={{
                  flex: 1,
                  padding: '12px 24px',
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
        </div>
      )}

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
          maxWidth: '100%',
          margin: '0 auto',
          padding: '0 20px',
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

          {/* Tab Navigation - Vertical Sidebar (Compact with Icons & Text) */}
          <div style={{
            display: 'flex',
            gap: '0',
            minHeight: 'calc(100vh - 400px)',
          }}>
            {/* Compact Sidebar with Icons + Text */}
            <div style={{
              width: '220px',
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px 0 0 16px',
              padding: '20px 12px',
              overflowY: 'auto',
              position: 'sticky',
              top: '20px',
              height: 'fit-content',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}>
              {/* Group the tabs */}
              {['Dashboard', 'Content Management', 'Administration'].map((groupName, groupIdx) => {
                const groupTabs = ADMIN_TABS.filter(tab => tab.group === groupName);
                if (groupTabs.length === 0) return null;

                return (
                  <div key={groupName} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    marginBottom: groupIdx < 2 ? '12px' : '0',
                    paddingBottom: groupIdx < 2 ? '12px' : '0',
                    borderBottom: groupIdx < 2 ? `1px solid ${theme.border}` : 'none',
                  }}>
                    {/* Group Label */}
                    <div style={{
                      paddingLeft: '12px',
                      marginBottom: '4px',
                      fontSize: '10px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: theme.textSecondary,
                    }}>
                      {groupName}
                    </div>
                    
                    {/* Group Tabs */}
                    {groupTabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        style={{
                          padding: '10px 12px',
                          background: activeTab === tab.id ? `${theme.accentPrimary}20` : 'transparent',
                          color: activeTab === tab.id ? theme.accentPrimary : theme.textPrimary,
                          border: activeTab === tab.id ? `2px solid ${theme.accentPrimary}` : '2px solid transparent',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: activeTab === tab.id ? '600' : '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          textAlign: 'left',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        onMouseOver={(e) => {
                          if (activeTab !== tab.id) {
                            e.currentTarget.style.background = `${theme.accentPrimary}10`;
                            e.currentTarget.style.color = theme.accentPrimary;
                          }
                        }}
                        onMouseOut={(e) => {
                          if (activeTab !== tab.id) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = theme.textPrimary;
                          }
                        }}
                      >
                        <span style={{ fontSize: '16px', flexShrink: 0 }}>{tab.icon}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {tab.label.split(' ').slice(1).join(' ')}
                        </span>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Content Area */}
            <div style={{
              flex: 1,
              paddingLeft: '24px',
              paddingRight: '24px',
            }}>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
                marginBottom: '40px',
              }}>
                {dashboardStats.map((stat, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredCard(`stat-${idx}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      background: theme.surfacePrimary,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '12px',
                      padding: '16px',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease',
                      transform: hoveredCard === `stat-${idx}` ? 'translateY(-4px)' : 'translateY(0)',
                      borderColor: hoveredCard === `stat-${idx}` ? stat.color : theme.border,
                      boxShadow: hoveredCard === `stat-${idx}` ? `0 8px 16px ${stat.color}20` : 'none',
                    }}
                  >
                    <div style={{
                      fontSize: '24px',
                      marginBottom: '8px',
                    }}>
                      {stat.icon}
                    </div>
                    <div style={{
                      color: theme.textSecondary,
                      fontSize: '12px',
                      fontWeight: '500',
                      marginBottom: '6px',
                    }}>
                      {stat.label}
                    </div>
                    <div style={{
                      color: stat.color,
                      fontSize: '22px',
                      fontWeight: '800',
                      marginBottom: '4px',
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      color: theme.textSecondary,
                      fontSize: '11px',
                    }}>
                      {stat.change}
                    </div>
                  </div>
                ))}
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
                        setStoryFormData({ title: '', category: '', audience: '', chapters: '', selectedTemplate: '' });
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

                {/* Activities Table */}
                <div style={{
                  background: theme.surfacePrimary,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}>
                  {(() => {
                    let filtered = RECENT_ACTIVITIES.filter(act => 
                      activitiesTypeFilter === 'all' || act.type === activitiesTypeFilter
                    );

                    // Sort
                    if (activitiesSortBy === 'type') {
                      filtered = filtered.sort((a, b) => a.type.localeCompare(b.type));
                    } else if (activitiesSortBy === 'action') {
                      filtered = filtered.sort((a, b) => a.action.localeCompare(b.action));
                    }

                    return (
                      <>
                        {/* Table Grid */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '0.5fr 2fr 1fr 1fr 1fr 1fr',
                          gap: '0',
                          minWidth: '100%',
                          width: '100%',
                        }}>
                          {/* Header - Type */}
                          <div style={{
                            background: `${theme.accentPrimary}15`,
                            padding: '12px 16px',
                            fontWeight: '600',
                            color: theme.textPrimary,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            borderBottom: `2px solid ${theme.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}>
                            Type
                            <select
                              value={activitiesTypeFilter}
                              onChange={(e) => setActivitiesTypeFilter(e.target.value)}
                              style={{
                                padding: '2px 6px',
                                background: theme.background,
                                border: `1px solid ${theme.border}`,
                                borderRadius: '4px',
                                color: theme.textSecondary,
                                fontSize: '11px',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="all">All</option>
                              <option value="quiz">Quiz</option>
                              <option value="puzzle">Puzzle</option>
                              <option value="story">Story</option>
                              <option value="art">Art</option>
                              <option value="document">Doc</option>
                              <option value="study">Study</option>
                              <option value="worksheet">Work</option>
                              <option value="user">User</option>
                            </select>
                          </div>

                          {/* Header - Title */}
                          <div style={{
                            background: `${theme.accentPrimary}15`,
                            padding: '12px 16px',
                            fontWeight: '600',
                            color: theme.textPrimary,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            borderBottom: `2px solid ${theme.border}`,
                          }}>
                            Title
                          </div>

                          {/* Header - Action */}
                          <div style={{
                            background: `${theme.accentPrimary}15`,
                            padding: '12px 16px',
                            fontWeight: '600',
                            color: theme.textPrimary,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            borderBottom: `2px solid ${theme.border}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                          }}
                          onClick={() => setActivitiesSortBy(activitiesSortBy === 'action' ? 'time' : 'action')}
                          onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            Action
                            <span style={{ fontSize: '10px', opacity: 0.6 }}>
                              {activitiesSortBy === 'action' ? '↑' : ''}
                            </span>
                          </div>

                          {/* Header - User */}
                          <div style={{
                            background: `${theme.accentPrimary}15`,
                            padding: '12px 16px',
                            fontWeight: '600',
                            color: theme.textPrimary,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            borderBottom: `2px solid ${theme.border}`,
                          }}>
                            User
                          </div>

                          {/* Header - Time */}
                          <div style={{
                            background: `${theme.accentPrimary}15`,
                            padding: '12px 16px',
                            fontWeight: '600',
                            color: theme.textPrimary,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            borderBottom: `2px solid ${theme.border}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                          }}
                          onClick={() => setActivitiesSortBy(activitiesSortBy === 'time' ? 'type' : 'time')}
                          onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                          onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            Time
                            <span style={{ fontSize: '10px', opacity: 0.6 }}>
                              {activitiesSortBy === 'time' ? '↑' : ''}
                            </span>
                          </div>

                          {/* Header - Status */}
                          <div style={{
                            background: `${theme.accentPrimary}15`,
                            padding: '12px 16px',
                            fontWeight: '600',
                            color: theme.textPrimary,
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            borderBottom: `2px solid ${theme.border}`,
                          }}>
                            Status
                          </div>

                          {/* Rows */}
                          {filtered.slice(0, activitiesLimitRows).map((activity, idx) => (
                            <React.Fragment key={idx}>
                              <div style={{
                                padding: '12px 16px',
                                fontSize: '18px',
                                borderBottom: idx < Math.min(activitiesLimitRows, filtered.length) - 1 ? `1px solid ${theme.border}` : 'none',
                              }}>
                                {activity.type === 'quiz' ? '❓' : activity.type === 'puzzle' ? '🧩' : activity.type === 'story' ? '📖' : activity.type === 'art' ? '🎨' : activity.type === 'document' ? '📄' : activity.type === 'study' ? '📚' : activity.type === 'worksheet' ? '📋' : '👤'}
                              </div>
                              <div style={{
                                padding: '12px 16px',
                                color: theme.textPrimary,
                                fontWeight: '500',
                                borderBottom: idx < Math.min(activitiesLimitRows, filtered.length) - 1 ? `1px solid ${theme.border}` : 'none',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                                {activity.title}
                              </div>
                              <div style={{
                                padding: '12px 16px',
                                color: theme.textSecondary,
                                fontSize: '13px',
                                borderBottom: idx < Math.min(activitiesLimitRows, filtered.length) - 1 ? `1px solid ${theme.border}` : 'none',
                              }}>
                                <span style={{
                                  background: activity.action === 'Added' ? '#10B98120' : activity.action === 'Updated' ? '#3B82F620' : activity.action === 'Published' ? '#EC489920' : '#95E1D320',
                                  color: activity.action === 'Added' ? '#10B981' : activity.action === 'Updated' ? '#3B82F6' : activity.action === 'Published' ? '#EC4899' : '#95E1D3',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                }}>
                                  {activity.action}
                                </span>
                              </div>
                              <div style={{
                                padding: '12px 16px',
                                color: theme.textPrimary,
                                fontSize: '13px',
                                borderBottom: idx < Math.min(activitiesLimitRows, filtered.length) - 1 ? `1px solid ${theme.border}` : 'none',
                              }}>
                                {activity.user}
                              </div>
                              <div style={{
                                padding: '12px 16px',
                                color: theme.textSecondary,
                                fontSize: '12px',
                                borderBottom: idx < Math.min(activitiesLimitRows, filtered.length) - 1 ? `1px solid ${theme.border}` : 'none',
                              }}>
                                {activity.time}
                              </div>
                              <div style={{
                                padding: '12px 16px',
                                borderBottom: idx < Math.min(activitiesLimitRows, filtered.length) - 1 ? `1px solid ${theme.border}` : 'none',
                              }}>
                                <span style={{
                                  background: '#10B98120',
                                  color: '#10B981',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                }}>
                                  ✓ Completed
                                </span>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>

                        {/* Pagination Controls */}
                        {filtered.length > 0 && (
                          <div style={{
                            padding: '16px 24px',
                            borderTop: `1px solid ${theme.border}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: theme.background,
                          }}>
                            <div style={{
                              color: theme.textSecondary,
                              fontSize: '12px',
                            }}>
                              Showing {Math.min(filtered.length, activitiesLimitRows)} of {filtered.length}
                            </div>
                            <div style={{
                              display: 'flex',
                              gap: '8px',
                            }}>
                              <button
                                onClick={() => setActivitiesLimitRows((n) => Math.max(10, n - 5))}
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
                                onClick={() => setActivitiesLimitRows((n) => n + 5)}
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
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </>
          )}

          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <AdminQuizzesTab 
              theme={theme}
              quizzes={quizzes}
              filteredQuizzes={filteredQuizzes}
              setFilteredQuizzes={setFilteredQuizzes}
              CATEGORIES={CATEGORIES}
              AUDIENCES={AUDIENCES}
              DIFFICULTIES={DIFFICULTIES}
              showAddQuizForm={showAddQuizForm}
              setShowAddQuizForm={setShowAddQuizForm}
              quizFormData={quizFormData}
              setQuizFormData={setQuizFormData}
              showUniversalQuizBuilder={showUniversalQuizBuilder}
              setShowUniversalQuizBuilder={setShowUniversalQuizBuilder}
              editingQuizData={editingQuizData}
              setEditingQuizData={setEditingQuizData}
              seedingQuizzes={seedingQuizzes}
              seedProgress={seedProgress}
              seedResults={seedResults}
              handleSeedQuizzes={handleSeedQuizzes}
              phase1Progress={phase1Progress}
              phase1Results={phase1Results}
              creatingPhase1Quizzes={creatingPhase1Quizzes}
              handleCreatePhase1Quizzes={handleCreatePhase1Quizzes}
              deleteProgress={deleteProgress}
              deleteResults={deleteResults}
              deletingQuizzes={deletingQuizzes}
              handleDeleteAllQuizzes={handleDeleteAllQuizzes}
              showBulkImportQuiz={showBulkImportQuiz}
              setShowBulkImportQuiz={setShowBulkImportQuiz}
              bulkImportData={bulkImportData}
              setBulkImportData={setBulkImportData}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              visibilityFilter={visibilityFilter}
              setVisibilityFilter={setVisibilityFilter}
              featuredFilter={featuredFilter}
              setFeaturedFilter={setFeaturedFilter}
              handleAddQuiz={handleAddQuiz}
              handleSaveUniversalQuiz={handleSaveUniversalQuiz}
              handleDeleteQuiz={handleDeleteQuiz}
              handleBulkImportQuiz={handleBulkImportQuiz}
              setViewingQuiz={setViewingQuiz}
            />
          )}

          {/* Puzzles Tab */}
          {activeTab === 'puzzles' && (
            <AdminPuzzlesTab
              theme={theme}
              puzzles={puzzles}
              filteredPuzzles={filteredPuzzles}
              setFilteredPuzzles={setFilteredPuzzles}
              showAddPuzzleForm={showAddPuzzleForm}
              setShowAddPuzzleForm={setShowAddPuzzleForm}
              AUDIENCES={AUDIENCES}
              DIFFICULTIES={DIFFICULTIES}
              PUZZLE_TYPES={PUZZLE_TYPES}
              setEditingPuzzle={setEditingPuzzle}
              setViewingPuzzle={setViewingPuzzle}
              handleDeletePuzzle={handleDeletePuzzle}
              handleAddPuzzle={handleAddPuzzle}
              puzzleFormData={puzzleFormData}
              setPuzzleFormData={setPuzzleFormData}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              visibilityFilter={visibilityFilter}
              setVisibilityFilter={setVisibilityFilter}
              featuredFilter={featuredFilter}
              setFeaturedFilter={setFeaturedFilter}
              quickCreateType={quickCreateType}
              setQuickCreateType={setQuickCreateType}
              quickCreateData={quickCreateData}
              setQuickCreateData={setQuickCreateData}
              showQuickDetails={showQuickDetails}
              setShowQuickDetails={setShowQuickDetails}
              selectedQuickTemplateId={selectedQuickTemplateId}
              setSelectedQuickTemplateId={setSelectedQuickTemplateId}
              quickTemplates={quickTemplates}
              quickTemplatesLoading={quickTemplatesLoading}
              showQuickPreview={showQuickPreview}
              setShowQuickPreview={setShowQuickPreview}
              sanitizeTemplateForEditor={sanitizeTemplateForEditor}
              AdminTemplatePreviewModal={AdminTemplatePreviewModal}
              resetQuickCreate={resetQuickCreate}
              qcTitle={qcTitle}
              setQcTitle={setQcTitle}
              qcDifficulty={qcDifficulty}
              setQcDifficulty={setQcDifficulty}
              qcAgeGroup={qcAgeGroup}
              setQcAgeGroup={setQcAgeGroup}
              qcDescription={qcDescription}
              setQcDescription={setQcDescription}
              qcCategoryId={qcCategoryId}
              setQcCategoryId={setQcCategoryId}
              qcCategoryName={qcCategoryName}
              setQcCategoryName={setQcCategoryName}
              qcTopicId={qcTopicId}
              setQcTopicId={setQcTopicId}
              qcTopicName={qcTopicName}
              setQcTopicName={setQcTopicName}
              qcSubtopicId={qcSubtopicId}
              setQcSubtopicId={setQcSubtopicId}
              qcSubtopicName={qcSubtopicName}
              setQcSubtopicName={setQcSubtopicName}
              qcIsPublished={qcIsPublished}
              setQcIsPublished={setQcIsPublished}
              qcXpReward={qcXpReward}
              setQcXpReward={setQcXpReward}
              categoriesList={categoriesList}
              topicsList={topicsList}
              subtopicsList={subtopicsList}
              cnVisualType={cnVisualType}
              setCnVisualType={setCnVisualType}
              cnSelectedTemplateId={cnSelectedTemplateId}
              setCnSelectedTemplateId={setCnSelectedTemplateId}
              cnShowInputForm={cnShowInputForm}
              setCnShowInputForm={setCnShowInputForm}
              cnTemplateInputs={cnTemplateInputs}
              setCnTemplateInputs={setCnTemplateInputs}
              cnExecutionResult={cnExecutionResult}
              setCnExecutionResult={setCnExecutionResult}
              cnExecutionError={cnExecutionError}
              setCnExecutionError={setCnExecutionError}
              cnExecutionLoading={cnExecutionLoading}
              setCnExecutionLoading={setCnExecutionLoading}
              cnTemplates={cnTemplates}
              cnTemplatesLoading={cnTemplatesLoading}
              TemplateInputForm={TemplateInputForm}
              runTemplate={runTemplate}
              createVisualPuzzle={createVisualPuzzle}
              loadTopicsForCategory={loadTopicsForCategory}
              formatDate={formatDate}
              formatFullDateTime={formatFullDateTime}
              setShowTemplateModal={setShowTemplateModal}
              showUniversalPuzzleBuilder={showUniversalPuzzleBuilder}
              setShowUniversalPuzzleBuilder={setShowUniversalPuzzleBuilder}
              editingPuzzleData={editingPuzzleData}
              setEditingPuzzleData={setEditingPuzzleData}
            />
          )}

          {/* Stories Tab */}
          {activeTab === 'stories' && (
            <AdminStoriesTab
              theme={theme}
              stories={stories}
              filteredStories={filteredStories}
              setFilteredStories={setFilteredStories}
              showAddStoryForm={showAddStoryForm}
              setShowAddStoryForm={setShowAddStoryForm}
              storyFormData={storyFormData}
              setStoryFormData={setStoryFormData}
              STORY_CATEGORIES={STORY_CATEGORIES}
              AUDIENCES={AUDIENCES}
              STORY_TEMPLATES={STORY_TEMPLATES}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              visibilityFilter={visibilityFilter}
              setVisibilityFilter={setVisibilityFilter}
              featuredFilter={featuredFilter}
              setFeaturedFilter={setFeaturedFilter}
              setEditingStory={setEditingStory}
              setViewingStory={setViewingStory}
              handleDeleteStory={handleDeleteStory}
              handleAddStory={handleAddStory}
            />
          )}

          {/* Arts Tab */}
          {activeTab === 'arts' && (<AdminArtsTab theme={theme} />)}

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
                    Create and manage drawing, painting, and digital art lessons
                  </p>
                </div>
                <button
                  onClick={() => window.location.href = '/arts'}
                  style={{
                    padding: '12px 24px',
                    background: `linear-gradient(135deg, #FFB366, #FF85A2)`,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 181, 102, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🎨 Open Arts Studio
                </button>
              </div>

              {/* Arts Overview */}
              <div style={{
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
              }}>
                <h3 style={{
                  color: theme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 16px 0',
                }}>
                  📚 Arts Features
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '12px',
                }}>
                  <div style={{
                    padding: '16px',
                    background: theme.background,
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                  }}>
                    <div style={{
                      fontSize: '32px',
                      marginBottom: '8px',
                    }}>
                      ✏️
                    </div>
                    <p style={{
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 4px 0',
                    }}>
                      Drawing Tool
                    </p>
                    <p style={{
                      color: theme.textSecondary,
                      fontSize: '12px',
                      margin: 0,
                    }}>
                      Pencil & brush drawing
                    </p>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: theme.background,
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                  }}>
                    <div style={{
                      fontSize: '32px',
                      marginBottom: '8px',
                    }}>
                      🎨
                    </div>
                    <p style={{
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 4px 0',
                    }}>
                      Painting Tool
                    </p>
                    <p style={{
                      color: theme.textSecondary,
                      fontSize: '12px',
                      margin: 0,
                    }}>
                      Coloring & painting
                    </p>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: theme.background,
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                  }}>
                    <div style={{
                      fontSize: '32px',
                      marginBottom: '8px',
                    }}>
                      📚
                    </div>
                    <p style={{
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 4px 0',
                    }}>
                      Guided Lessons
                    </p>
                    <p style={{
                      color: theme.textSecondary,
                      fontSize: '12px',
                      margin: 0,
                    }}>
                      Step-by-step tutorials
                    </p>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: theme.background,
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                  }}>
                    <div style={{
                      fontSize: '32px',
                      marginBottom: '8px',
                    }}>
                      🌈
                    </div>
                    <p style={{
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 4px 0',
                    }}>
                      Digital Art
                    </p>
                    <p style={{
                      color: theme.textSecondary,
                      fontSize: '12px',
                      margin: 0,
                    }}>
                      Sticker composition
                    </p>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: theme.background,
                    borderRadius: '8px',
                    border: `1px solid ${theme.border}`,
                  }}>
                    <div style={{
                      fontSize: '32px',
                      marginBottom: '8px',
                    }}>
                      🖼️
                    </div>
                    <p style={{
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 4px 0',
                    }}>
                      Gallery
                    </p>
                    <p style={{
                      color: theme.textSecondary,
                      fontSize: '12px',
                      margin: 0,
                    }}>
                      View saved artwork
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div style={{
                background: theme.surfacePrimary,
                border: `2px solid ${theme.border}`,
                borderRadius: '12px',
                padding: '24px',
              }}>
                <h3 style={{
                  color: theme.textPrimary,
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 16px 0',
                }}>
                  🔗 Quick Links
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                }}>
                  <button
                    onClick={() => window.location.href = '/arts/draw'}
                    style={{
                      padding: '12px 16px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.accentPrimary + '20';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme.background;
                    }}
                  >
                    ✏️ Drawing Studio
                  </button>
                  <button
                    onClick={() => window.location.href = '/arts/paint'}
                    style={{
                      padding: '12px 16px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.accentPrimary + '20';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme.background;
                    }}
                  >
                    🎨 Painting Studio
                  </button>
                  <button
                    onClick={() => window.location.href = '/arts/guided'}
                    style={{
                      padding: '12px 16px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.accentPrimary + '20';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme.background;
                    }}
                  >
                    📚 Lessons
                  </button>
                  <button
                    onClick={() => window.location.href = '/arts/digital'}
                    style={{
                      padding: '12px 16px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.accentPrimary + '20';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme.background;
                    }}
                  >
                    🌈 Digital Art
                  </button>
                  <button
                    onClick={() => window.location.href = '/arts/gallery'}
                    style={{
                      padding: '12px 16px',
                      background: theme.background,
                      border: `2px solid ${theme.border}`,
                      borderRadius: '8px',
                      color: theme.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.accentPrimary + '20';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme.background;
                    }}
                  >
                    🖼️ Gallery
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (<AdminDocumentsTab theme={theme} />)}

          {/* Studies Tab */}
          {activeTab === 'studies' && (<AdminStudiesTab theme={theme} />)}

          {/* Worksheets Tab */}
          {activeTab === 'worksheets' && (<AdminWorksheetsTab theme={theme} />)}

          {/* Users & Analytics Tab */}
          {activeTab === 'users' && (
            <AdminUsersTab
              theme={theme}
              scores={scores}
              dbStats={dbStats}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              exportCSV={exportCSV}
              attemptsData={attemptsData}
              avgData={avgData}
              filteredScores={filteredScores}
              limitRows={limitRows}
              setLimitRows={setLimitRows}
              CATEGORIES={CATEGORIES}
            />
          )}

          {/* Quiz Types Tab */}
          {activeTab === 'quiz-types' && (<AdminQuizTypesTab theme={theme} />)}

          {/* Puzzle Types Tab */}
          {activeTab === 'puzzle-types' && (<AdminPuzzleTypesTab theme={theme} />)}

          {/* Features Tab */}
          {activeTab === 'features' && (<AdminFeaturesTab theme={theme} />)}

          {/* Settings Tab */}
          {activeTab === 'settings' && (<AdminSettingsTab theme={theme} dbStats={dbStats} navigate={navigate} />)}
            </div>
          </div>
        </div>
        )}
      </div>
    </SiteLayout>
  );
}

// SVG Bar Chart Component - Imported from components/ChartBarSvg.jsx
