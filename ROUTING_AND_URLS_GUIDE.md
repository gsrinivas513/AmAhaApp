# AmAha Routing & URLs Complete Guide

## Overview

This document provides a comprehensive reference for all routes, URLs, and navigation paths in the AmAha application. The application uses **React Router v6** for client-side routing.

---

## 🏠 Home & Main Routes

| Route | Path | Component | Purpose |
|-------|------|-----------|---------|
| **Home** | `/` | `HomePage` | Landing page with feature overview |
| **All Categories** | `/categories` | `AllFeaturesPage` | Browse all available categories |
| **Explore** | `/explore` | `ExploreCategoriesPage` | Curated category exploration |

---

## 📚 Quiz Routes (Learning Hub)

### Route Hierarchy

```
/ (Home)
└── /quiz (Quiz Hub - List all categories)
    └── /quiz/:categoryName (Select topic)
        └── /quiz/:categoryName/:topicName (Select subtopic)
            └── /quiz/:categoryName/:topicName/:subtopicName/:difficulty (Select level)
                └── /quiz/:categoryName/:topicName/:subtopicName/:difficulty/:level (Play quiz)
```

### Complete Quiz Routes

| Route | Path | Component | Description |
|-------|------|-----------|-------------|
| **Quiz Hub** | `/quiz` | `QuizzesPage` | Browse all quiz categories |
| **Quiz Category** | `/quiz/:categoryName` | `SubcategoryPage` | View topics in a category |
| **Quiz Topic** | `/quiz/:categoryName/:topicName` | `TopicPage` | View subtopics in a topic |
| **Quiz Difficulty Level** | `/quiz/:categoryName/:topicName/:subtopicName/:difficulty` | `CategoryLevelsPage` | Select specific difficulty level |
| **Play Quiz** | `/quiz/:categoryName/:topicName/:subtopicName/:difficulty/:level` | `QuizPage` | Interactive quiz player |

### Quiz Path Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `categoryName` | string (URL-encoded) | `Language`, `Mathematics` | The learning category |
| `topicName` | string (URL-encoded) | `English`, `Algebra` | The topic within category |
| `subtopicName` | string (URL-encoded) | `Grammar`, `Equations` | The subtopic |
| `difficulty` | string | `Easy`, `Medium`, `Hard` | Difficulty level |
| `level` | number | `1`, `2`, `3` | Specific quiz level |

### Quiz Example Navigation Flows

**Example 1: Playing an English Grammar Quiz**
```
/quiz 
  → /quiz/Language 
  → /quiz/Language/English 
  → /quiz/Language/English/Grammar/Medium
  → /quiz/Language/English/Grammar/Medium/1
```

**Example 2: Playing a Math Algebra Quiz**
```
/quiz
  → /quiz/Mathematics
  → /quiz/Mathematics/Algebra
  → /quiz/Mathematics/Algebra/Equations/Hard
  → /quiz/Mathematics/Algebra/Equations/Hard/3
```

### Quiz Features

- **Game Modes**: Timed (60s), Speed (30s), Practice (unlimited), Memory (efficiency-based)
- **XP Multipliers**: 1.5x (Timed), 2x (Speed), 0.25x (Practice)
- **Streak System**: Track consecutive daily quiz completions
- **Dynamic Mode Selection**: Choose game mode before starting quiz

---

## 🧩 Puzzle Routes (Puzzle Solving Hub)

### Route Hierarchy

```
/puzzle (Puzzle Hub - Browse categories)
└── /puzzle/:categoryName (View category puzzles)
    └── /puzzle/:categoryName/:topicName (View topic puzzles)
        └── /puzzle/:categoryName/:topicName/:puzzleId (Play specific puzzle)
```

### Complete Puzzle Routes

| Route | Path | Component | Description |
|-------|------|-----------|-------------|
| **Puzzle Hub** | `/puzzle` | `PuzzleTopicPage` | Browse all puzzle categories |
| **Puzzle Category** | `/puzzle/:categoryName` | `PuzzleTopicPage` | View puzzles by category |
| **Puzzle Topic** | `/puzzle/:categoryName/:topicName` | `PuzzleSubcategoryPage` | View puzzles by topic |
| **Play Puzzle** | `/puzzle/:categoryName/:topicName/:puzzleId` | `UnifiedPuzzlePage` | Interactive puzzle player |

### Puzzle Path Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `categoryName` | string (URL-encoded) | `Logic`, `Geometry` | Puzzle category |
| `topicName` | string (URL-encoded) | `Patterns`, `Shapes` | Puzzle topic |
| `puzzleId` | Firebase Doc ID | `abc123def456` | Unique puzzle identifier |

### Puzzle Example Navigation Flow

```
/puzzle
  → /puzzle/Logic
  → /puzzle/Logic/Patterns
  → /puzzle/Logic/Patterns/abc123def456
```

### Puzzle Features

- **Practice Mode Integration**: 0.25x XP multiplier for practice
- **Visual Puzzles**: Custom visual puzzle player
- **Multiple Puzzle Types**: Image-based, text-based, interactive
- **Puzzle Solutions**: Step-by-step solution guides

---

## 🏆 Leaderboard Routes

| Route | Path | Component | Description |
|-------|------|-----------|-------------|
| **All Leaderboards** | `/leaderboards` | `LeaderboardsPage` | Global leaderboards across all categories |
| **Category Leaderboard** | `/leaderboard/:categoryId` | `LeaderboardPage` | Leaderboard for specific category |

### Leaderboard Path Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `categoryId` | Firebase Doc ID | `lang_001`, `math_001` | Category identifier |

### Leaderboard Features

- **Global Rankings**: Top users across all categories
- **Category Rankings**: Top users per category
- **User Scores**: XP, coins, streak statistics
- **Achievement Badges**: Display earned badges

---

## ⏰ Daily Challenge Route

| Route | Path | Component | Description |
|-------|------|-----------|-------------|
| **Daily Challenge** | `/daily-challenge` | `DailyChallengePage` | Daily mini-quiz with bonus rewards |

### Daily Challenge Features

- **Auto-Selection**: Randomly selects quiz from categories
- **Bonus Rewards**: 2x XP multiplier for daily completion
- **Daily Reset**: One challenge per 24 hours
- **Streak Tracking**: Consecutive daily challenge completions

---

## 📖 Story Routes

| Route | Path | Component | Description |
|-------|------|-----------|-------------|
| **Story Map** | `/stories` | `StoryMapPage` | Story-based learning journey |

### Story Features

- **Story Progression**: Unlock stories by completing quizzes
- **Story Narrative**: Educational stories with quiz integration
- **Character Development**: Progress through story arcs
- **Engagement**: Narrative-driven learning experience

---

## 👤 User Account Routes

| Route | Path | Component | Description |
|-------|------|-----------|-------------|
| **User Profile** | `/profile` | `ProfilePage` | View user profile, stats, achievements |
| **Settings** | `/settings` | `UserSettingsPage` | User preferences and account settings |

### Profile Features

- **Statistics Dashboard**: XP, coins, streak, achievements
- **Achievement Gallery**: Earned badges and milestones
- **Learning Analytics**: Category performance breakdown
- **Social Stats**: Leaderboard position, rank

### Settings Features

- **Account Preferences**: Theme, language, notifications
- **Privacy Settings**: Data sharing, visibility options
- **Game Preferences**: Game mode defaults, difficulty
- **Account Management**: Password, email, deletion

---

## 🛠️ Admin Routes & Sidebar Panel

### Admin Access

**Note**: All admin routes require authentication and admin privileges. Access path: `/admin/*`

### Admin Panel Structure

The admin panel uses a **collapsible sidebar** with three main sections: Global, Quiz, and Puzzles. Some items open inline modals instead of navigating to new pages.

```
Admin Panel Sidebar
├─ GLOBAL (Collapsible Section)
│  ├─ 📊 Dashboard → /admin/dashboard (Page Route)
│  ├─ 📁 Features & Categories → /admin/features (Page Route)
│  ├─ ➕ Add Content → /admin/add-content (Page Route)
│  ├─ 🏆 Scores → /admin/scores (Page Route)
│  ├─ 🎬 Social Media → /admin/social-media (Page Route)
│  ├─ ⏰ Daily Challenge → Opens Modal (Inline)
│  ├─ 📖 Stories → Opens Modal (Inline)
│  ├─ 📊 Analytics → /admin/analytics (Page Route)
│  ├─ ⚙️ System Tools → /admin/system-tools (Page Route)
│  └─ 🤖 Automation Tests → /admin/automation-tests (Page Route)
│
├─ QUIZ (Collapsible Section)
│  ├─ 📄 View Questions → /admin/view-questions (Page Route)
│  ├─ 📊 Quiz Analytics → /admin/quiz/analytics (Page Route)
│  └─ 🎬 Quiz UI Animations → /admin/quiz-ui (Page Route)
│
└─ PUZZLES (Collapsible Section)
   ├─ 📑 Traditional Puzzles → /admin/puzzles (Page Route)
   ├─ 🎨 Visual Puzzles → /admin/create-visual-puzzle (Page Route)
   └─ 🎮 Dashboard (Coming soon) - Disabled
```

### Global Admin Routes

| Sidebar Label | Path | Component | Display Type | Purpose |
|---------------|------|-----------|--------------|---------|
| **Dashboard** | `/admin/dashboard` | `AdminDashboard` | Page | Main admin control center with scores & analytics |
| **Features & Categories** | `/admin/features` | `FeatureCategoryManagement` | Page | Manage quiz categories and features |
| **Add Content** | `/admin/add-content` | `AddQuestionPage` | Page | Create new quiz questions |
| **Scores** | `/admin/scores` | `AdminScoresPage` | Page | View user scores, attempts, and performance |
| **Social Media** | `/admin/social-media` | `SocialMediaManagerPage` | Page | Manage social sharing content |
| **Daily Challenge** | (Modal) | `DailyChallengeModal` | Modal (Inline) | Configure daily challenges without page navigation |
| **Stories** | (Modal) | `StoryModal` | Modal (Inline) | Create/edit story content inline |
| **Analytics** | `/admin/analytics` | `AnalyticsPage` | Page | View user and content analytics dashboard |
| **System Tools** | `/admin/system-tools` | `SystemToolsPage` | Page | Database utilities and system maintenance tools |
| **Automation Tests** | `/admin/automation-tests` | `AutomationTestPage` | Page | Run automated test suites |

### Quiz Admin Routes

| Sidebar Label | Path | Component | Display Type | Purpose |
|---------------|------|-----------|--------------|---------|
| **View Questions** | `/admin/view-questions` | `ViewQuestionsPage` | Page | Browse, search, filter all quiz questions |
| **Quiz Analytics** | `/admin/quiz/analytics` | `QuizAnalyticsPage` | Page | View quiz performance metrics and completion rates |
| **Quiz UI Animations** | `/admin/quiz-ui` | `QuizUIConfigPage` | Page | Configure quiz UI animations and appearance |

### Puzzle Admin Routes

| Sidebar Label | Path | Component | Display Type | Purpose |
|---------------|------|-----------|--------------|---------|
| **Traditional Puzzles** | `/admin/puzzles` | `PuzzleListPage` | Page | Browse, manage, and view all text-based puzzles |
| **Visual Puzzles** | `/admin/create-visual-puzzle` | `VisualPuzzleAdminPage` | Page | Create and edit image/visual puzzles |
| **Visual Puzzles (Edit)** | `/admin/create-visual-puzzle/:puzzleId` | `VisualPuzzleAdminPage` | Page | Modify existing visual puzzle |
| **Dashboard** | (Coming Soon) | - | Disabled | Puzzle analytics (Future feature) |

### Admin Path Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `id` | Firebase Doc ID | `q123abc456` | Question/Content ID for editing |
| `puzzleId` | Firebase Doc ID | `p789xyz123` | Puzzle ID for editing |

---

## 🔌 API Endpoints

### Learning APIs

**Base**: `/api/quizzes`, `/api/puzzles`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/quizzes` | Fetch all quizzes |
| `GET` | `/api/quizzes/:id` | Get specific quiz details |
| `POST` | `/api/quizzes` | Create new quiz |
| `PUT` | `/api/quizzes/:id` | Update quiz |
| `DELETE` | `/api/quizzes/:id` | Delete quiz |
| `POST` | `/api/quizzes/:id/attempt` | Submit quiz attempt/score |
| `GET` | `/api/puzzles` | Fetch all puzzles |
| `GET` | `/api/puzzles/:id` | Get puzzle details |
| `POST` | `/api/puzzles/:id/attempt` | Submit puzzle solution |

### Community & Social APIs

**Base**: `/api/leaderboards`, `/api/users`, `/api/social`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/leaderboards` | Get global leaderboard |
| `GET` | `/api/leaderboards/:categoryId` | Get category leaderboard |
| `GET` | `/api/users/:userId` | Get user profile |
| `GET` | `/api/users/:userId/achievements` | Get user achievements |
| `GET` | `/api/users/:userId/stats` | Get user statistics |
| `POST` | `/api/social/share` | Share achievement/score |
| `POST` | `/api/social/follow` | Follow another user |
| `GET` | `/api/social/following` | Get following list |

### Monetization APIs

**Base**: `/api/payments`, `/api/coins`, `/api/store`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/payments/initiate` | Start payment process |
| `POST` | `/api/payments/verify` | Verify payment completion |
| `GET` | `/api/coins/balance` | Get user coin balance |
| `POST` | `/api/coins/purchase` | Purchase coins |
| `POST` | `/api/coins/spend` | Spend coins in store |
| `GET` | `/api/store/items` | Get store items |
| `POST` | `/api/store/buy` | Purchase store item |

### Content & Moderation APIs

**Base**: `/api/content`, `/api/moderation`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/content/submit` | Submit user-generated content |
| `GET` | `/api/content/pending` | Get pending moderation items |
| `POST` | `/api/content/approve` | Approve content |
| `POST` | `/api/content/reject` | Reject content |
| `POST` | `/api/moderation/report` | Report inappropriate content |
| `GET` | `/api/moderation/reports` | Get moderation reports |

### Analytics APIs

**Base**: `/api/analytics`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/analytics/dashboard` | Get analytics overview |
| `GET` | `/api/analytics/users` | Get user analytics |
| `GET` | `/api/analytics/content` | Get content performance |
| `GET` | `/api/analytics/engagement` | Get engagement metrics |
| `POST` | `/api/analytics/track` | Track user event |

---

## 🎮 Navigation Examples

### Example 1: Complete Quiz Learning Journey

**User Flow**: Home → Browse Categories → Select Quiz → Play Quiz

```
1. Start at Home:
   GET /

2. Browse categories:
   GET /categories
   or GET /explore

3. Select a category (e.g., Language):
   GET /quiz

4. Navigate to Language category:
   GET /quiz/Language

5. Select English topic:
   GET /quiz/Language/English

6. Select Grammar subtopic and difficulty:
   GET /quiz/Language/English/Grammar/Medium

7. Select level 1:
   GET /quiz/Language/English/Grammar/Medium/1

8. Play quiz and submit answers:
   POST /api/quizzes/123/attempt
   with quiz answers and selected game mode (e.g., Timed, Speed)

9. View results and return to home or leaderboards:
   GET /leaderboards
```

### Example 2: Puzzle Solving Journey

**User Flow**: Home → Browse Puzzles → Select Puzzle → Solve Puzzle

```
1. Start at Home:
   GET /

2. Navigate to puzzles:
   GET /puzzle

3. Select Logic category:
   GET /puzzle/Logic

4. Select Patterns topic:
   GET /puzzle/Logic/Patterns

5. Select specific puzzle:
   GET /puzzle/Logic/Patterns/puzzle_abc123

6. Submit solution:
   POST /api/puzzles/puzzle_abc123/attempt
   with solution data and practice mode flag

7. View results:
   GET /profile or /leaderboards
```

### Example 3: Daily Challenge Routine

**User Flow**: Home → Daily Challenge → Auto-selected Quiz → Leaderboard

```
1. Start at Home:
   GET /

2. Click Daily Challenge:
   GET /daily-challenge
   (Auto-selects random quiz from categories)

3. Complete selected quiz:
   POST /api/quizzes/selected_id/attempt
   with bonus: 2x XP multiplier

4. View updated rank:
   GET /leaderboards
```

### Example 4: Admin Content Creation

**Admin Flow**: Dashboard → Create Question → Manage Content

```
1. Access admin dashboard:
   GET /admin/dashboard

2. Navigate to add content:
   GET /admin/add-content

3. Create new question:
   POST /api/quizzes
   with question data

4. View all questions:
   GET /admin/view-questions

5. Edit specific question:
   GET /admin/edit-question/q_123abc
   PATCH /api/quizzes/q_123abc
   with updated data
```

---

## 📱 Modal Routes vs Page Routes

### What's the Difference?

**Page Routes** (Navigate to new page):
- URL changes (added to browser history)
- Full page load or view swap
- Examples: `/admin/dashboard`, `/admin/view-questions`, `/admin/analytics`
- User sees sidebar collapse/expand, main content changes

**Modal Routes** (Open inline dialog):
- URL does NOT change
- Dialog/modal appears on top of current view
- Examples: Daily Challenge (modal), Stories (modal)
- User stays in admin panel context
- Sidebar remains visible and accessible
- Faster, more seamless experience

### Admin Modal Items (Inline Display)

| Item | Opens As | Behavior |
|------|----------|----------|
| **Daily Challenge** | Modal Dialog | Opens config form without page navigation |
| **Stories** | Modal Dialog | Opens story editor without page navigation |

### When to Use Modal vs Page?

**Use Modal When:**
- ✅ Quick edits or configuration
- ✅ Small forms or brief dialogs
- ✅ User needs to maintain context
- ✅ No need to navigate away

**Use Page Route When:**
- ✅ Large, complex interfaces
- ✅ Multiple tabs/sections
- ✅ Need to show navigation history
- ✅ Dedicated admin workspace needed

---

## 🔐 Authentication & Authorization

### Requirements

- **Public Routes**: Home, Categories, Explore (no auth required)
- **User Routes**: Quiz, Puzzles, Leaderboards, Profile, Settings (requires login)
- **Admin Routes**: All `/admin/*` paths + Modal items (requires admin privileges)

### Firebase Authentication

All requests use Firebase Authentication:
- User ID from `firebase.auth().currentUser.uid`
- Auth token automatically included in API requests via interceptors
- Admin role verified from Firestore user document (role: "admin")

---

## 🎯 Admin Panel Guide (UI Structure & Features)

### Sidebar Navigation

The admin panel features a **collapsible left sidebar** with three sections:

**Section Features:**
- Click section title to expand/collapse
- Sections auto-expand when their routes are active
- All items show active state with highlight and icon background

### GLOBAL Section (10 items)

1. **Dashboard** → `/admin/dashboard`
   - Purpose: Main admin hub
   - Shows: Score statistics, charts, recent attempts
   - Features: Category filter dropdown, CSV export

2. **Features & Categories** → `/admin/features`
   - Purpose: Manage quiz structure
   - Shows: Categories, topics, subtopics
   - Features: Create, edit, delete functionality

3. **Add Content** → `/admin/add-content`
   - Purpose: Create new quiz questions
   - Shows: Question form with all fields
   - Features: Single question creation

4. **Scores** → `/admin/scores`
   - Purpose: View all user attempts and scores
   - Shows: Table of user quiz attempts
   - Features: Category filter, download, view details

5. **Social Media** → `/admin/social-media`
   - Purpose: Manage social sharing content
   - Shows: Social media templates and settings
   - Features: Create, edit social content

6. **Daily Challenge** → Modal (Inline)
   - Purpose: Configure daily challenges
   - Shows: Modal dialog form
   - Features: Set challenge parameters, no page navigation

7. **Stories** → Modal (Inline)
   - Purpose: Create and edit story content
   - Shows: Modal story editor
   - Features: Story management, no page navigation

8. **Analytics** → `/admin/analytics`
   - Purpose: View comprehensive analytics
   - Shows: Charts, graphs, engagement metrics
   - Features: Dashboard with visualizations

9. **System Tools** → `/admin/system-tools`
   - Purpose: Database and system utilities
   - Shows: Admin tools and options
   - Features: System maintenance and debugging

10. **Automation Tests** → `/admin/automation-tests`
    - Purpose: Run automated test suites
    - Shows: Test interface
    - Features: Execute and monitor tests

### QUIZ Section (3 items)

1. **View Questions** → `/admin/view-questions`
   - Purpose: Browse all quiz questions
   - Shows: Sortable, filterable table
   - Features: Search, sort by column, filter by difficulty/category

2. **Quiz Analytics** → `/admin/quiz/analytics`
   - Purpose: View quiz performance metrics
   - Shows: Analytics dashboard
   - Features: Performance charts and statistics

3. **Quiz UI Animations** → `/admin/quiz-ui`
   - Purpose: Configure quiz appearance
   - Shows: UI configuration interface
   - Features: Customize animations and appearance

### PUZZLES Section (3 items)

1. **Traditional Puzzles** → `/admin/puzzles`
   - Purpose: Manage text-based puzzles
   - Shows: List of all puzzles
   - Features: Browse, filter, manage puzzles

2. **Visual Puzzles** → `/admin/create-visual-puzzle`
   - Purpose: Create/edit image puzzles
   - Shows: Visual puzzle creator interface
   - Features: Create new or edit existing puzzles
   - Edit variant: `/admin/create-visual-puzzle/:puzzleId`

3. **Dashboard** → (Coming Soon)
   - Purpose: Future puzzle analytics
   - Status: Disabled, awaiting development

---

### Optional Query Parameters

Many routes support optional query parameters for filtering:

```
/leaderboards?category=Language&timeRange=week
/leaderboards?sort=xp&order=desc
/quiz/Language/English?difficulty=Hard
/profile?tab=achievements&filter=recent
```

### Common Query Parameters

| Parameter | Values | Example | Description |
|-----------|--------|---------|-------------|
| `category` | Category name | `Language`, `Math` | Filter by category |
| `difficulty` | `Easy`, `Medium`, `Hard` | `?difficulty=Hard` | Filter by difficulty |
| `timeRange` | `day`, `week`, `month`, `all` | `?timeRange=week` | Leaderboard time range |
| `sort` | `xp`, `coins`, `streak`, `name` | `?sort=xp` | Sort criteria |
| `order` | `asc`, `desc` | `?order=desc` | Sort direction |
| `tab` | `overview`, `achievements`, `stats` | `?tab=achievements` | Profile section |

---

## 🔄 Route Updates & Redirects

### Automatic Redirects

- `/puzzle/:categoryName` → Redirects to puzzle topic selection
- `/quiz/:categoryName` → Redirects to topic selection
- Logging out → Redirects to `/` (home)

### Route Protection

- Unauthenticated users cannot access user/admin routes
- Admin routes require admin role from Firestore user document
- Invalid IDs redirect to appropriate parent route

---

## 📱 Mobile & Responsive Routes

All routes are fully responsive and work on:
- Desktop browsers
- Tablets
- Mobile phones

Route parameters are URL-encoded for special characters:
```
/quiz/Language%20Arts/English%20Grammar
→ Displays as: Language Arts > English Grammar
```

---

## 🚀 Advanced Usage

### Programmatic Navigation

Use React Router's `useNavigate` hook:

```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigate to quiz
navigate(`/quiz/${categoryName}/${topicName}/${subtopic}/${difficulty}/${level}`);

// Navigate with state
navigate(`/quiz/Language/English`, { state: { mode: 'timed' } });

// Navigate back
navigate(-1);
```

### Link Components

Use `<Link>` for static routes:

```jsx
<Link to={`/quiz/${category}`}>Start Quiz</Link>
<Link to="/leaderboards">View Leaderboards</Link>
```

### URL Encoding

For special characters in route parameters:

```jsx
const categoryName = encodeURIComponent("Language Arts");
navigate(`/quiz/${categoryName}`);
```

---

## 📋 Complete Route Map Summary

**Total Routes: 53+**

| Category | Count | Details |
|----------|-------|---------|
| Home & Main | 3 | `/`, `/categories`, `/explore` |
| Quiz Routes | 5 | `/quiz*` (hierarchical) |
| Puzzle Routes | 4 | `/puzzle*` (hierarchical) |
| Leaderboards | 2 | `/leaderboards`, `/leaderboard/:categoryId` |
| Daily Challenge | 1 | `/daily-challenge` |
| Stories | 1 | `/stories` |
| User Account | 2 | `/profile`, `/settings` |
| Admin Global | 10 | Dashboard, Features, Add Content, Scores, Social Media, Daily Challenge (Modal), Stories (Modal), Analytics, System Tools, Automation Tests |
| Admin Quiz | 3 | View Questions, Quiz Analytics, Quiz UI Animations |
| Admin Puzzles | 3 | Traditional Puzzles, Visual Puzzles, Dashboard (Coming) |
| **TOTAL** | **34** | **All routes listed above** |

### Admin Modal Routes (Inline, No Page Navigation)

| Feature | Trigger | Display Type | Purpose |
|---------|---------|--------------|---------|
| **Daily Challenge** | Sidebar Item Click | Modal (Inline) | Configure daily challenges without leaving sidebar |
| **Stories** | Sidebar Item Click | Modal (Inline) | Create/edit stories inline without page change |

**Key Difference from Page Routes:**
- ✅ Modal routes DO NOT navigate to new pages
- ✅ Modal routes open inline dialogs within current view
- ✅ No URL change (no new route added to history)
- ✅ User stays in admin panel context
- ✅ Cleaner, faster admin experience

---

## 🎯 Quick Reference

### Most Common User Routes

```
HOME:        /
QUIZ:        /quiz → /quiz/[category] → ... → /quiz/[cat]/[topic]/[sub]/[diff]/[level]
PUZZLE:      /puzzle → /puzzle/[category] → ... → /puzzle/[cat]/[topic]/[id]
LEADERBOARDS: /leaderboards, /leaderboard/[categoryId]
DAILY:       /daily-challenge
STORIES:     /stories
PROFILE:     /profile
SETTINGS:    /settings
```

### Admin Dashboard

```
SIDEBAR NAVIGATION (Collapsible)

GLOBAL (Click to Expand)
├─ Dashboard:        /admin/dashboard
├─ Features & Cats:  /admin/features
├─ Add Content:      /admin/add-content
├─ Scores:           /admin/scores
├─ Social Media:     /admin/social-media
├─ Daily Challenge:  📱 Modal (Inline)
├─ Stories:          📱 Modal (Inline)
├─ Analytics:        /admin/analytics
├─ System Tools:     /admin/system-tools
└─ Automation Tests: /admin/automation-tests

QUIZ (Click to Expand)
├─ View Questions:   /admin/view-questions
├─ Quiz Analytics:   /admin/quiz/analytics
└─ Quiz UI Anims:    /admin/quiz-ui

PUZZLES (Click to Expand)
├─ Traditional:      /admin/puzzles
├─ Visual Puzzles:   /admin/create-visual-puzzle
└─ Dashboard:        Coming Soon (Disabled)

NOTE: 📱 = Opens modal dialog inline (no page navigation)
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Page shows 404 error?**
- Check that all path parameters are URL-encoded
- Verify category/topic/puzzle names exist in database
- Check for special characters in route parameters

**Can't access admin routes?**
- Verify admin privileges in user Firestore document
- Check authentication status
- Ensure logged in with admin account

**Link not working?**
- Verify route exists in App.js
- Check spelling of category/topic names
- Ensure proper URL encoding for special characters

---

## 📄 Document Info

- **Last Updated**: 2024
- **Version**: 1.0
- **Total Routes**: 53+
- **Admin Pages**: 40+
- **API Endpoints**: 30+

For questions or updates, refer to `src/App.js` for authoritative route definitions.
