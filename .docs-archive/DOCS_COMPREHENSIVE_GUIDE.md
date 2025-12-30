# 📚 AmAha - Comprehensive Development Guide

**Last Updated:** December 22, 2025

## 📖 Table of Contents
- [Architecture Overview](#architecture-overview)
- [Database Structure](#database-structure)
- [Feature System](#feature-system)
- [Quiz System](#quiz-system)
- [Admin Panel](#admin-panel)
- [Content Management](#content-management)
- [Development Workflow](#development-workflow)

---

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend:** React 19, React Router 7, Tailwind CSS
- **Backend:** Firebase (Firestore, Auth, Hosting)
- **Build Tool:** React Scripts 5.0
- **State Management:** React Hooks (useState, useEffect)

### Project Structure
```
src/
├── home/                   # Landing page components
├── quiz/                   # Quiz feature
│   ├── components/         # Quiz UI components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Firebase services
│   └── CategoryLevelsPage.jsx
├── admin/                  # Admin dashboard
│   ├── features/           # Feature management
│   │   ├── hooks/          # Admin hooks (useSubtopicData.js)
│   │   └── components/     # Admin UI components
│   ├── AddQuestionPage.jsx
│   ├── ViewQuestionsPage.jsx
│   └── ImportQuestionsPage.jsx
├── puzzles/                # Puzzle feature (planned)
├── auth/                   # Authentication
├── components/             # Shared components
├── firebase/               # Firebase config
└── utils/                  # Utility functions
```

### Design Principles
1. **Feature-Based Architecture** - Each feature is self-contained
2. **Service Layer Pattern** - UI → Hooks → Services → Firestore
3. **Component Composition** - Small, reusable components
4. **Mobile-First Design** - Responsive by default

---

## 🗄️ Database Structure

### Firestore Collections Hierarchy

```
features (collection)
├── {featureId} (document)
│   ├── name: "Quiz"
│   ├── icon: "🎯"
│   ├── order: 1
│   └── isActive: true
│
└── categories (subcollection)
    ├── {categoryId} (document)
    │   ├── name: "Kids"
    │   ├── featureId: "quiz123"
    │   ├── order: 1
    │   └── isPublished: true
    │
    └── topics (subcollection)
        ├── {topicId} (document)
        │   ├── name: "Math"
        │   ├── categoryId: "kids123"
        │   ├── order: 1
        │   └── isPublished: true
        │
        └── subtopics (subcollection)
            ├── {subtopicId} (document)
            │   ├── name: "Addition & Subtraction"
            │   ├── topicId: "math123"
            │   ├── order: 1
            │   └── isPublished: true
            │
            └── questions (subcollection)
                └── {questionId} (document)
                    ├── question: "What is 2+2?"
                    ├── options: ["3", "4", "5", "6"]
                    ├── correctAnswer: "4"
                    ├── difficulty: "easy"
                    ├── subtopicId: "addition123"
                    └── order: 1
```

### Key Collections

#### **features**
```javascript
{
  id: "quiz123",
  name: "Quiz",
  description: "Test your knowledge",
  icon: "🎯",
  order: 1,
  isActive: true,
  createdAt: timestamp
}
```

#### **categories**
```javascript
{
  id: "kids123",
  name: "Kids",
  featureId: "quiz123",
  description: "Learning for children",
  order: 1,
  isPublished: true,
  createdAt: timestamp
}
```

#### **topics**
```javascript
{
  id: "math123",
  name: "Math",
  categoryId: "kids123",
  description: "Mathematics topics",
  order: 1,
  isPublished: true,
  createdAt: timestamp
}
```

#### **subtopics**
```javascript
{
  id: "addition123",
  name: "Simple Math (Addition & Subtraction)",
  topicId: "math123",
  description: "Basic arithmetic",
  order: 1,
  isPublished: true,
  totalQuestions: 50,
  createdAt: timestamp
}
```

#### **questions**
```javascript
{
  id: "q123",
  question: "What is 2 + 2?",
  options: ["3", "4", "5", "6"],
  correctAnswer: "4",
  difficulty: "easy",      // easy, medium, hard
  subtopicId: "addition123",
  order: 1,
  createdAt: timestamp
}
```

---

## 🎯 Feature System

### Feature Types
1. **Quiz** - Question-based learning
2. **Puzzles** - Visual problem solving (planned)
3. **Studies** - Reading materials (planned)
4. **Arts** - Creative content (planned)

### Feature Management
- Located in: `src/admin/features/`
- Key hook: `useSubtopicData.js`
- Manages CRUD operations for features, categories, topics, subtopics

---

## 📝 Quiz System

### Quiz Flow
```
Home Page
  ↓
Feature Selection (Quiz)
  ↓
Category Selection (Kids/Students/Programming)
  ↓
Topic Selection (Math, Science, etc.)
  ↓
Subtopic Selection (Addition, Multiplication, etc.)
  ↓
Difficulty Selection (Easy/Medium/Hard)
  ↓
Level Selection (Level 1, 2, 3...)
  ↓
Questions
```

### URL Structure
```
/quiz/{category}/{topic}/{subtopic}/{difficulty}
```
Example: `/quiz/Kids/Math/Simple%20Math%20(Addition%20%26%20Subtraction)/easy`

### Quiz Rules
- **10 questions per level**
- **ALL answers must be correct** to pass
- **Any wrong answer = level failed**
- Failed levels must be retried
- Questions randomized per user
- No question repetition across levels

### Key Components

#### CategoryLevelsPage.jsx
- Displays difficulty selection
- Shows topic navigation
- Shows subtopic navigation
- Handles level selection
- Located: `src/quiz/CategoryLevelsPage.jsx`

**Recent Enhancement (Dec 2025):**
- Added "Choose Topic" section
- Topics load dynamically by categoryId
- Green highlight (#10b981) for active topic
- Smart navigation to first subtopic

---

## 🔧 Admin Panel

### Admin Routes
- `/admin` - Dashboard
- `/admin/view-questions` - Question management
- `/admin/add-question` - Add single question
- `/admin/import-questions` - Bulk import
- `/admin/feature-management` - Manage features/categories/topics/subtopics

### ViewQuestionsPage Features
**Location:** `src/admin/ViewQuestionsPage.jsx`

**Sortable Columns:**
1. Feature
2. Category
3. Topic
4. SubTopic
5. Question
6. Correct Answer
7. Difficulty

**Filters:**
- Search (question text)
- Feature dropdown
- Category dropdown
- Subtopic dropdown
- Difficulty dropdown

**Sort Indicators:**
- ↕ (unsorted)
- ↑ (ascending)
- ↓ (descending)

**Visual Feedback:**
- Blue highlight (#e0f2fe) on sorted column
- Clear Filters button when filters active

### Import Questions
**Location:** `src/admin/ImportQuestionsPage.jsx`

**Supported Formats:**
- CSV
- Excel (XLSX)

**CSV Format:**
```csv
question,option1,option2,option3,option4,correctAnswer,difficulty
"What is 2+2?","3","4","5","6","4","easy"
```

**Import Script:**
`importKidsQuestions.js` - Batch import multiple CSV files

---

## 📊 Content Management

### Creating New Content

#### 1. Feature Setup
```javascript
// In Firebase Console or Admin Panel
{
  name: "Quiz",
  icon: "🎯",
  order: 1,
  isActive: true
}
```

#### 2. Category Setup
```javascript
{
  name: "Kids",
  featureId: "quiz123",
  order: 1,
  isPublished: true
}
```

#### 3. Topic Setup
```javascript
{
  name: "Math",
  categoryId: "kids123",
  order: 1,
  isPublished: true
}
```

#### 4. Subtopic Setup
```javascript
{
  name: "Addition & Subtraction",
  topicId: "math123",
  order: 1,
  isPublished: true
}
```

#### 5. Add Questions
- Use Admin Panel → Add Question (manual)
- Use Admin Panel → Import Questions (bulk)
- Questions automatically link to subtopic

### Content Strategy

**Current Content Status:**
- ✅ Kids: 400 questions (8 subtopics)
- ✅ Students: 300 questions
- ✅ Programming: 50 questions

**Content Categories:**

**Kids Topics:**
- Math (Addition, Subtraction, Multiplication)
- Animals (Sounds, Birds, Insects)
- Colors & Shapes
- Body Parts
- Fruits & Vegetables
- Days & Months
- Vehicles

**Students Topics:**
- Science
- History
- Geography
- Literature

**Programming Topics:**
- Python Basics
- JavaScript Fundamentals
- Web Development

---

## 🛠️ Development Workflow

### Getting Started

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm start
```
Runs on: `http://localhost:3008`

3. **Build for Production**
```bash
npm build
```

### Firebase Setup

**Config Location:** `src/firebase/firebase.js`

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### Key Hooks

#### useSubtopicData.js
**Location:** `src/admin/features/hooks/useSubtopicData.js`

**Functions:**
- `loadSubtopics()` - Fetch all subtopics
- `createSubtopic(data)` - Create new subtopic
- `updateSubtopic(id, data)` - Update subtopic
- `toggleSubtopicPublish(id, currentStatus)` - Publish/unpublish

**Recent Bug Fix (Dec 2025):**
Fixed collection name from "subcategories" to "subtopics" in 4 locations (lines 18, 22, 68, 97)

### Common Development Tasks

#### Add New Question
1. Go to `/admin/add-question`
2. Select Feature, Category, Topic, Subtopic
3. Enter question and options
4. Select correct answer and difficulty
5. Click "Add Question"

#### Bulk Import Questions
1. Prepare CSV file with proper format
2. Go to `/admin/import-questions`
3. Select file and upload
4. Questions appear in selected subtopic

#### Publish/Unpublish Subtopic
1. Go to `/admin/feature-management`
2. Navigate to subtopic
3. Toggle "Published" status
4. Only published subtopics appear to users

### Debugging Tips

**Check Firebase Console:**
- View collections structure
- Verify data integrity
- Check security rules

**Browser DevTools:**
- React DevTools - Component state
- Network tab - API calls
- Console - Error messages

**Common Issues:**
- Collection name mismatch → Check useSubtopicData.js
- Publishing fails → Verify Firestore rules
- Questions not loading → Check subtopicId reference

---

## 🎨 UI/UX Guidelines

### Color Scheme
- **Primary:** Green (#10b981)
- **Secondary:** Blue (#3b82f6)
- **Success:** Green (#22c55e)
- **Error:** Red (#ef4444)
- **Warning:** Yellow (#f59e0b)

### Component Patterns
- Use Tailwind CSS utility classes
- Mobile-first responsive design
- Consistent spacing (p-4, p-6, p-8)
- Hover states for interactive elements

### Typography
- Headings: font-bold text-2xl/3xl/4xl
- Body: text-base/lg
- Small text: text-sm/xs

---

## 🚀 Future Roadmap

### Phase 1 (Completed)
- ✅ Feature-based architecture
- ✅ Quiz flow implementation
- ✅ Admin panel
- ✅ Question import system
- ✅ Subtopic system
- ✅ Topic navigation

### Phase 2 (In Progress)
- 🔄 Monetization integration
- 🔄 User authentication
- 🔄 Progress tracking
- 🔄 Leaderboards

### Phase 3 (Planned)
- 📋 Puzzle feature
- 📋 Studies feature
- 📋 Reward system
- 📋 Social features
- 📋 Mobile app

---

## 📞 Support & Resources

**Documentation Files:**
1. `DOCS_COMPREHENSIVE_GUIDE.md` (this file)
2. `DOCS_QUICK_REFERENCE.md` - Quick commands
3. `DOCS_CONTENT_STRATEGY.md` - Content planning
4. `DOCS_BUGFIX_LOG.md` - Bug fixes history
5. `README.md` - Project overview

**Import Script:**
- `importKidsQuestions.js` - Bulk question import

**Key Files to Remember:**
- `src/admin/features/hooks/useSubtopicData.js` - Subtopic management
- `src/admin/ViewQuestionsPage.jsx` - Question table
- `src/quiz/CategoryLevelsPage.jsx` - Quiz navigation
- `src/firebase/firebase.js` - Firebase config

---

**Need Help?** Check the other documentation files or review the codebase structure above.
