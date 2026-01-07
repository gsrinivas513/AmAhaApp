---
sidebar_position: 2
title: Frontend Stack
---

# Frontend Architecture

The AmAha web application is built with React 18+ and follows modern component-based architecture patterns.

## Technology Stack

### Core Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| React | 18+ | UI framework |
| React Router | v6 | Client-side routing |
| Redux | Latest | State management |
| Tailwind CSS | v3 | Styling framework |
| Vite | Latest | Build tool & dev server |
| TypeScript | 4.9+ | Type safety |

### Supporting Libraries

| Category | Libraries |
|----------|-----------|
| **Utilities** | lodash, date-fns, axios |
| **Validation** | formik, yup |
| **Testing** | Jest, React Testing Library |
| **UI Components** | Radix UI, Headless UI |
| **Charts** | Recharts (for analytics) |
| **Icons** | React Icons |

---

## Component Architecture

### Page Components (Top-Level Routes)

```
App.jsx
├── HomePage
├── BrowsePage
├── ContentPlayer (QuizPage, PuzzlePage, ActivityPage)
├── DashboardPage
├── AdminPanel (protected)
├── ClassManagementPage (teacher)
├── ProfilePage
└── NotFoundPage
```

### Component Hierarchy Example (Quiz Flow)

```
BrowsePage
├── ContentFilter
├── ContentGrid
│   └── QuizCard
│       ├── ContentHeader
│       ├── StatsBadge
│       └── ActionButtons
└── Pagination

QuizPage (when clicked)
├── QuizHeader
│   ├── Title
│   ├── Timer
│   └── Progress
├── QuizContent
│   ├── QuestionDisplay
│   │   ├── QuestionText
│   │   └── MediaContent (if needed)
│   └── AnswerOptions
│       ├── MCQOptions
│       ├── FillBlankInput
│       ├── DragDropZone
│       └── ImageSelector
├── QuestionNavigation
│   ├── PreviousButton
│   ├── QuestionIndicators
│   └── NextButton
├── HintPanel
└── SubmitButton
```

---

## State Management Structure

### Redux Store Organization

```javascript
store/
├── slices/
│   ├── authSlice.js
│   │   ├── user (currentUser data)
│   │   ├── isAuthenticated (boolean)
│   │   ├── token (JWT)
│   │   └── loading (auth state)
│   ├── contentSlice.js
│   │   ├── quizzes (loaded quizzes)
│   │   ├── puzzles (loaded puzzles)
│   │   ├── activities (loaded activities)
│   │   └── filters (current filters)
│   ├── progressSlice.js
│   │   ├── currentSession (quiz/puzzle playing)
│   │   ├── userAnswers (collected answers)
│   │   ├── sessionScore (running score)
│   │   └── completedContent (history)
│   ├── uiSlice.js
│   │   ├── theme (light/dark)
│   │   ├── sidebarOpen (mobile nav)
│   │   └── notifications (toast messages)
│   └── leaderboardSlice.js
│       ├── currentLeaderboard
│       ├── userRank
│       └── cached leaderboards
└── store.js (Redux config)
```

### Context API Usage

While Redux handles global state, Context is used for:
- Theme (light/dark mode)
- User preferences
- Modal state (confirm dialogs)
- Notification queue

---

## Routing Architecture

### Route Structure

```javascript
// Main Routes
/                     → HomePage
/browse               → BrowsePage
/quiz/:id             → QuizPage (protected)
/puzzle/:id           → PuzzlePage (protected)
/activity/:id         → ActivityPage (protected)
/dashboard            → DashboardPage (protected)
/profile              → ProfilePage (protected)
/admin                → AdminPanel (admin only)
/admin/quizzes        → QuizManagement
/admin/puzzles        → PuzzleManagement
/admin/classes        → ClassManagement
/admin/analytics      → AnalyticsPage
/login                → LoginPage
/signup               → SignupPage
/404                  → NotFoundPage
```

### Route Guards

```javascript
ProtectedRoute
├── Check authentication
├── Check authorization
└── Redirect if needed

AdminRoute
├── Check auth
├── Check admin role
└── Redirect if unauthorized

TeacherRoute
├── Check auth
├── Check teacher role
└── Redirect if unauthorized
```

---

## Styling Architecture

### CSS Organization

```
styles/
├── globals.css
│   ├── CSS variables (colors, spacing, shadows)
│   ├── Typography defaults
│   ├── Base element styles
│   └── Utility classes
├── components/
│   ├── navbar.css
│   ├── card.css
│   ├── button.css
│   ├── form.css
│   └── modal.css
├── pages/
│   ├── browsePage.css
│   ├── quizPage.css
│   └── dashboardPage.css
└── utils/
    ├── responsive.css
    ├── animations.css
    └── spacing.css
```

### Tailwind + CSS Modules

```javascript
// Button component example
import styles from './Button.module.css';

<button className={`${styles.btn} ${styles[variant]}`}>
  {children}
</button>

// Globals handled by Tailwind
<div className="mx-4 p-6 bg-primary-50 rounded-lg">
```

### Color System

**CSS Variables:**
```css
:root {
  /* Primary Colors */
  --color-primary: #3B82F6;
  --color-primary-light: #93C5FD;
  --color-primary-dark: #1E40AF;
  
  /* Semantic Colors */
  --color-success: #10B981;
  --color-error: #EF4444;
  --color-warning: #F59E0B;
  --color-info: #0EA5E9;
  
  /* Neutral Colors */
  --color-bg: #FFFFFF;
  --color-surface: #F9FAFB;
  --color-text: #1F2937;
  --color-border: #E5E7EB;
  
  /* Spacing */
  --spacing-unit: 8px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

---

## Hook Architecture

### Custom Hooks

```javascript
hooks/
├── useAuth.js
│   ├── user
│   ├── login()
│   ├── logout()
│   ├── signup()
│   └── updateProfile()
├── useQuiz.js
│   ├── currentQuiz
│   ├── currentQuestion
│   ├── userAnswers
│   ├── submitAnswer()
│   ├── navigateQuestion()
│   ├── submitQuiz()
│   └── getHint()
├── usePuzzle.js
│   ├── puzzle
│   ├── userSolution
│   ├── isComplete
│   ├── makeMoveValidation()
│   ├── resetPuzzle()
│   └── submitSolution()
├── useProgress.js
│   ├── userProgress
│   ├── completedItems
│   ├── currentStreak
│   └── getTotalStats()
├── useContent.js
│   ├── quizzes
│   ├── puzzles
│   ├── activities
│   ├── filterContent()
│   ├── searchContent()
│   └── getCategoryContent()
├── useLeaderboard.js
│   ├── leaderboard
│   ├── userRank
│   ├── getUserRanking()
│   └── updateLeaderboard()
└── useLocalStorage.js
```

---

## Form Handling

### Form Library: Formik + Yup

```javascript
// Login form example
const LoginForm = () => {
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email')
        .required('Required'),
      password: Yup.string()
        .min(6, 'Must be 6+ chars')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      await authService.login(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        type="email"
        {...formik.getFieldProps('email')}
      />
      {formik.touched.email && formik.errors.email && (
        <error>{formik.errors.email}</error>
      )}
    </form>
  );
};
```

---

## Service Layer

### API Communication

```javascript
services/
├── firebaseService.js
│   ├── initFirebase()
│   ├── getDocument()
│   ├── setDocument()
│   ├── updateDocument()
│   ├── deleteDocument()
│   ├── queryCollection()
│   └── listenToChanges()
├── authService.js
│   ├── login()
│   ├── logout()
│   ├── signup()
│   ├── getCurrentUser()
│   ├── updateProfile()
│   └── changePassword()
├── contentService.js
│   ├── getQuizzes()
│   ├── getQuizById()
│   ├── getPuzzles()
│   ├── searchContent()
│   ├── filterByCategory()
│   └── getCategoryContent()
├── progressService.js
│   ├── getUserProgress()
│   ├── saveQuizResult()
│   ├── savePuzzleResult()
│   ├── getCompletionStats()
│   └── getAchievements()
├── leaderboardService.js
│   ├── getLeaderboard()
│   ├── getUserRank()
│   ├── updateLeaderboard()
│   └── getHistoricalLeaderboard()
└── analyticsService.js
    ├── logEvent()
    ├── trackPageView()
    ├── trackUserAction()
    └── sendAnalyticsData()
```

---

## Error Handling

### Global Error Boundary

```javascript
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Catches React errors, logs to Sentry
// Displays fallback UI to user
// Prevents white-screen-of-death
```

### HTTP Error Handling

```javascript
try {
  const data = await api.get('/quiz/123');
} catch (error) {
  if (error.response?.status === 404) {
    // Content not found
  } else if (error.response?.status === 401) {
    // Unauthorized - redirect to login
  } else if (error.response?.status === 500) {
    // Server error
  }
  // Show error toast to user
}
```

---

## Performance Optimization

### Code Splitting

```javascript
// Route-based splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const QuizPage = React.lazy(() => import('./pages/QuizPage'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/quiz/:id" element={<QuizPage />} />
    <Route path="/admin/*" element={<AdminPanel />} />
  </Routes>
</Suspense>
```

### Memoization

```javascript
// Component memoization for expensive renders
const QuestionDisplay = React.memo(({ question }) => {
  return <div>{question.text}</div>;
});

// Hook memoization
const handleAnswer = useCallback((answer) => {
  dispatch(submitAnswer(answer));
}, [dispatch]);

// Value memoization
const sortedLeaderboard = useMemo(
  () => leaderboard.sort((a, b) => b.score - a.score),
  [leaderboard]
);
```

### Bundle Analysis

- Using webpack-bundle-analyzer
- Monitoring bundle size
- Tree-shaking unused code
- Lazy loading heavy components

---

## Testing Strategy

### Unit Tests (Jest)

```javascript
// Example test
describe('Button Component', () => {
  it('should render with correct text', () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick handler', () => {
    const handleClick = jest.fn();
    const { getByText } = render(
      <Button onClick={handleClick}>Click</Button>
    );
    fireEvent.click(getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Integration Tests

- Testing component interactions
- Testing Redux state updates
- Testing form submissions
- Testing error scenarios

### E2E Tests (Cypress)

```javascript
describe('Quiz Flow', () => {
  it('should complete a quiz successfully', () => {
    cy.visit('/');
    cy.contains('Browse Quizzes').click();
    cy.contains('Sample Quiz').click();
    cy.get('[data-cy=answer-option-1]').click();
    cy.contains('Next').click();
    cy.contains('Submit').click();
    cy.contains('Quiz Completed').should('be.visible');
  });
});
```

---

## Accessibility (Frontend)

### Implementation

- Semantic HTML (`<button>`, `<nav>`, `<main>`)
- ARIA labels for icons
- Keyboard navigation (Tab, Enter, Arrow keys)
- Focus management
- Color contrast compliance
- Alt text for images
- Screen reader testing

### Testing

- axe DevTools browser extension
- Manual keyboard navigation
- Screen reader testing (NVDA, JAWS)
- Lighthouse accessibility audit

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
# Runs on http://localhost:5173

# Run tests
npm run test
npm run test:watch

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

- **Linting:** ESLint
- **Code Format:** Prettier
- **Type Checking:** TypeScript
- **Pre-commit Hooks:** Husky + lint-staged

---

## Environment Variables

```
.env.local (development)
├── REACT_APP_FIREBASE_API_KEY
├── REACT_APP_FIREBASE_AUTH_DOMAIN
├── REACT_APP_FIREBASE_PROJECT_ID
├── REACT_APP_FIREBASE_STORAGE_BUCKET
├── REACT_APP_FIREBASE_MESSAGING_SENDER_ID
├── REACT_APP_FIREBASE_APP_ID
├── REACT_APP_CLOUDINARY_CLOUD_NAME
├── REACT_APP_CLOUDINARY_UPLOAD_PRESET
└── REACT_APP_API_URL

.env.production
├── Same variables, different values
└── No debug flags
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Next:** [Interaction Engine](interaction-engine) or [Architecture Overview](overview)
