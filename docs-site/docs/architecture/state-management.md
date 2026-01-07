---
sidebar_position: 4
title: State Management
---

# State Management

AmAha uses Redux for global state management combined with React Context for theme and modal states.

## State Architecture

### Redux Store Overview

```javascript
store = {
  auth: {},              // User authentication & profile
  content: {},           // Quiz, puzzle, activity data
  progress: {},          // User progress & current session
  ui: {},                // Theme, sidebar, notifications
  leaderboard: {},       // Leaderboard rankings
  filters: {},           // Browse filters
}
```

---

## Auth Slice

**State Structure:**
```javascript
{
  user: {
    id: 'user-123',
    email: 'student@example.com',
    name: 'John Doe',
    role: 'student', // 'student' | 'educator' | 'admin'
    avatar: 'https://...',
    gradeLevel: '6-8',
    createdAt: '2024-01-01T10:00:00Z',
  },
  isAuthenticated: true,
  token: 'jwt-token...',
  loading: false,
  error: null,
}
```

**Actions:**
```javascript
// Auth Actions
dispatch(login({ email, password }));
dispatch(logout());
dispatch(signup({ email, password, name }));
dispatch(updateProfile({ name, avatar, gradeLevel }));
dispatch(changePassword({ oldPassword, newPassword }));
dispatch(restoreSession()); // On app load
dispatch(fetchUser());

// Async thunks
dispatch(loginAsync({ email, password })); // Firebase auth
dispatch(logoutAsync());
dispatch(signupAsync({ email, password, name }));
```

**Reducer Logic:**
```javascript
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});
```

---

## Content Slice

**State Structure:**
```javascript
{
  quizzes: {
    byId: {
      'quiz-001': { id, title, type, difficulty, ... },
      'quiz-002': { ... },
    },
    allIds: ['quiz-001', 'quiz-002', ...],
    loading: false,
    error: null,
  },
  puzzles: {
    byId: {
      'puzzle-001': { id, title, type, category, ... },
    },
    allIds: ['puzzle-001', ...],
    loading: false,
  },
  activities: {
    byId: {
      'activity-001': { id, title, type, ... },
    },
    allIds: ['activity-001', ...],
    loading: false,
  },
  currentContent: null, // Being played
  metadata: {
    categories: [...],
    subjects: [...],
    difficulties: ['Easy', 'Medium', 'Hard', 'Expert'],
  },
}
```

**Actions:**
```javascript
// Fetch operations
dispatch(fetchQuizzes(filters));
dispatch(fetchQuizzesById('quiz-123'));
dispatch(fetchPuzzles(filters));
dispatch(fetchActivities(filters));
dispatch(searchContent(query));

// Content creation (admin/creator only)
dispatch(createQuiz(quizData));
dispatch(updateQuiz({ id, data }));
dispatch(deleteQuiz('quiz-123'));
dispatch(publishQuiz('quiz-123'));
```

**Normalized State Pattern:**
```javascript
// Why? Easier updates, prevents duplication, enables lookups
const quizzes = {
  byId: {
    'q1': { id: 'q1', title: 'Quiz 1', categoryId: 'cat-1' },
    'q2': { id: 'q2', title: 'Quiz 2', categoryId: 'cat-1' },
  },
  allIds: ['q1', 'q2'],
  byCategory: {
    'cat-1': ['q1', 'q2'],
    'cat-2': [],
  },
};

// Selector to get quiz
const selectQuizById = (state, quizId) => 
  state.content.quizzes.byId[quizId];

// Selector to get all quizzes in category
const selectQuizzesByCategory = (state, categoryId) => 
  state.content.quizzes.byCategory[categoryId]?.map(id => 
    state.content.quizzes.byId[id]
  ) || [];
```

---

## Progress Slice

**State Structure:**
```javascript
{
  currentSession: {
    contentId: 'quiz-123',
    contentType: 'quiz', // 'quiz' | 'puzzle' | 'activity'
    startTime: 1704067200000,
    userAnswers: [
      { questionId: 'q1', answer: 'A', isCorrect: true },
      { questionId: 'q2', answer: '', isCorrect: false },
    ],
    currentQuestion: 0,
    score: 50,
    status: 'playing', // 'playing' | 'submitted' | 'completed'
  },
  completedContent: [
    {
      contentId: 'quiz-123',
      contentType: 'quiz',
      score: 85,
      time: 450000, // milliseconds
      difficulty: 'Medium',
      completedAt: '2024-01-10T15:30:00Z',
      movesCount: 23, // for puzzles
    },
    { ... },
  ],
  userStats: {
    totalCompleted: 45,
    totalScore: 3825,
    averageScore: 85,
    longestStreak: 12,
    currentStreak: 3,
    byType: {
      quiz: { completed: 30, avgScore: 84 },
      puzzle: { completed: 10, avgScore: 88 },
      activity: { completed: 5, avgScore: 82 },
    },
    byDifficulty: {
      Easy: { completed: 20, avgScore: 92 },
      Medium: { completed: 18, avgScore: 85 },
      Hard: { completed: 7, avgScore: 78 },
    },
  },
}
```

**Actions:**
```javascript
// Session management
dispatch(startContent({ contentId, contentType }));
dispatch(submitAnswer({ questionId, answer }));
dispatch(submitContent());
dispatch(resetContent());
dispatch(pauseContent());
dispatch(resumeContent());

// Progress updates
dispatch(recordCompletion(completionData));
dispatch(updateUserStats());
dispatch(fetchUserProgress());
```

**Session Workflow:**
```javascript
// 1. User clicks on quiz
dispatch(startContent({ contentId: 'quiz-001', contentType: 'quiz' }));
// Redux: currentSession initialized, timer starts

// 2. User selects answer
dispatch(submitAnswer({ questionId: 'q1', answer: 'A' }));
// Redux: Answer recorded, moves to next question

// 3. User submits quiz
dispatch(submitContent());
// Redux: 
//   - Calculate final score
//   - Save to completedContent
//   - Update userStats
//   - Update leaderboards
//   - Show results

// 4. User navigates away
dispatch(resetContent());
// Redux: currentSession cleared
```

---

## UI Slice

**State Structure:**
```javascript
{
  theme: 'light', // 'light' | 'dark'
  sidebarOpen: true,
  notifications: [
    {
      id: 'notif-1',
      type: 'success', // 'success' | 'error' | 'warning' | 'info'
      message: 'Quiz submitted!',
      duration: 3000,
    },
  ],
  modals: {
    confirmDeleteOpen: false,
    confirmDeleteData: null,
    settingsOpen: false,
  },
  loading: false,
  error: null,
}
```

**Actions:**
```javascript
dispatch(toggleTheme());
dispatch(setTheme('dark'));
dispatch(toggleSidebar());
dispatch(addNotification({ type: 'success', message: 'Saved!' }));
dispatch(removeNotification(notificationId));
dispatch(openModal('confirmDelete', { contentId: 'q1' }));
dispatch(closeModal('confirmDelete'));
```

**Notification System:**
```javascript
const addNotification = (payload) => (dispatch) => {
  const id = Date.now();
  dispatch({
    type: 'ui/addNotification',
    payload: { id, ...payload },
  });

  // Auto-remove after duration
  setTimeout(() => {
    dispatch(removeNotification(id));
  }, payload.duration || 3000);
};
```

---

## Leaderboard Slice

**State Structure:**
```javascript
{
  currentLeaderboard: {
    contentId: 'quiz-001',
    difficulty: 'Medium',
    entries: [
      { rank: 1, userId: 'user-5', name: 'Alice', score: 98 },
      { rank: 2, userId: 'user-3', name: 'Bob', score: 95 },
      { rank: 3, userId: 'user-1', name: 'Charlie', score: 92 },
      // ... user's rank highlighted
    ],
    userRank: 45,
    totalEntries: 234,
  },
  cached: {
    'quiz-001-Easy': { ... },
    'quiz-001-Medium': { ... },
  },
}
```

**Actions:**
```javascript
dispatch(fetchLeaderboard({ contentId, difficulty }));
dispatch(fetchUserRank({ contentId, difficulty }));
dispatch(updateLeaderboard({ contentId, score, time }));
dispatch(clearLeaderboardCache());
```

**Leaderboard Calculation:**
```javascript
class LeaderboardManager {
  calculateRanking(entries) {
    // Sort by score (descending), then by time (ascending)
    return entries
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time - b.time;
      })
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
  }

  getUserRank(entries, userId) {
    const ranked = this.calculateRanking(entries);
    return ranked.find(entry => entry.userId === userId)?.rank || null;
  }
}
```

---

## Filters Slice

**State Structure:**
```javascript
{
  browse: {
    category: 'all', // 'all' | 'quizzes' | 'puzzles' | 'activities'
    subject: 'all', // 'Science' | 'Math' | etc
    difficulty: 'all', // 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'all'
    gradeLevel: 'all', // '6-8' | '9-12' | etc
    sortBy: 'popular', // 'popular' | 'newest' | 'rating'
    searchQuery: '',
    pageSize: 12,
    currentPage: 1,
  },
  results: {
    items: [], // Filtered results
    totalCount: 0,
    hasMore: false,
  },
}
```

**Actions:**
```javascript
dispatch(setCategory('quizzes'));
dispatch(setSubject('Science'));
dispatch(setDifficulty('Medium'));
dispatch(setSearchQuery('photosynthesis'));
dispatch(setSortBy('newest'));
dispatch(setPage(2));
dispatch(resetFilters());
```

---

## Selectors

**Memoized selectors using Reselect:**
```javascript
import { createSelector } from 'reselect';

// Base selectors
const selectQuizzesState = (state) => state.content.quizzes;
const selectCategoryFilter = (state) => state.filters.browse.category;

// Memoized selectors
export const selectAllQuizzes = createSelector(
  [selectQuizzesState],
  (quizzes) => quizzes.allIds.map(id => quizzes.byId[id])
);

export const selectFilteredQuizzes = createSelector(
  [selectAllQuizzes, selectCategoryFilter],
  (quizzes, category) => 
    category === 'all' 
      ? quizzes 
      : quizzes.filter(q => q.category === category)
);

export const selectQuizById = createSelector(
  [selectQuizzesState, (_, quizId) => quizId],
  (quizzes, quizId) => quizzes.byId[quizId]
);

// Usage in component
const quizzes = useSelector(selectFilteredQuizzes);
const specificQuiz = useSelector(state => selectQuizById(state, 'quiz-123'));
```

---

## Middleware

**Logging Middleware:**
```javascript
const loggingMiddleware = store => next => action => {
  console.log('Dispatching:', action.type);
  const result = next(action);
  console.log('New State:', store.getState());
  return result;
};
```

**Analytics Middleware:**
```javascript
const analyticsMiddleware = store => next => action => {
  const result = next(action);

  if (action.type === 'progress/submitContent') {
    // Log to analytics service
    analytics.logEvent('content_completed', {
      contentId: action.payload.contentId,
      score: action.payload.score,
      time: action.payload.time,
    });
  }

  return result;
};
```

**Thunk Middleware:**
```javascript
// Already built into Redux Toolkit
export const loginAsync = createAsyncThunk(
  'auth/loginAsync',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await firebaseService.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

---

## Context API Usage

While Redux handles main app state, Context handles:

**Theme Context:**
```javascript
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Usage
const { theme, toggleTheme } = useContext(ThemeContext);
```

**Modal Context:**
```javascript
const ModalContext = createContext();

const ModalProvider = ({ children }) => {
  const [modals, setModals] = useState({});

  const openModal = (modalName, data) => {
    setModals(prev => ({ ...prev, [modalName]: data }));
  };

  const closeModal = (modalName) => {
    setModals(prev => {
      const newModals = { ...prev };
      delete newModals[modalName];
      return newModals;
    });
  };

  return (
    <ModalContext.Provider value={{ modals, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
```

---

## Performance Optimization

### Reselect for Memoization

```javascript
// Without memoization (re-renders even if data unchanged)
const selectUsers = (state) => 
  state.content.items.filter(item => item.type === 'user');

// With memoization (only re-renders if actual data changes)
export const selectUsers = createSelector(
  [state => state.content.items],
  (items) => items.filter(item => item.type === 'user')
);
```

### Normalized State

```javascript
// Before (deeply nested, hard to update)
{
  quizzes: [
    {
      id: '1',
      title: 'Quiz 1',
      questions: [
        { id: 'q1', text: '...', answers: [...] }
      ]
    }
  ]
}

// After (normalized, easy to update)
{
  quizzes: {
    byId: { '1': { id: '1', title: 'Quiz 1' } },
    allIds: ['1']
  },
  questions: {
    byId: { 'q1': { id: 'q1', text: '...' } },
    byQuiz: { '1': ['q1'] }
  }
}
```

---

## Debugging

### Redux DevTools Integration

```javascript
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: rootReducer,
  // DevTools automatically integrated in development
});

// Browser: Use Redux DevTools extension
// Features:
// - Inspect every action
// - Time-travel debugging
// - Dispatch custom actions
// - Export/import state
```

**Common Debugging Patterns:**
```javascript
// Log state before/after action
store.subscribe(() => {
  console.log('New state:', store.getState());
});

// Dispatch action manually
store.dispatch(setUser({ id: 'u1', name: 'Test' }));

// Check selector output
const quiz = selectQuizById(store.getState(), 'quiz-123');
```

---

## Best Practices

1. **Normalize State**: Use byId + allIds pattern
2. **Use Selectors**: Never access state directly in components
3. **Keep State Shallow**: 2-3 levels deep maximum
4. **Immutable Updates**: Use Immer in Redux Toolkit
5. **Async Operations**: Use createAsyncThunk
6. **Type Safety**: Use TypeScript for reducers/selectors
7. **Local State**: Use useState for UI-only state (sidebarOpen, modals)
8. **Memoization**: Use reselect for expensive computations

---

**Next:** [Firebase Integration](firebase-integration) or [Frontend Stack](frontend)
