# Firestore Schema Extension - Complete 8-Feature Architecture

## Overview

This document specifies the Firestore collections and document structures needed to support all 8 content types in the AmAha platform.

## Current Platform Features (8 Types)

1. **Quizzes** (❓) - `/quiz` - IMPLEMENTED ✅
2. **Puzzles** (🧩) - `/puzzle` - IMPLEMENTED ✅
3. **Stories** (📖) - `/stories` - IMPLEMENTED ✅
4. **Games** (🎮) - `/games` - STUB (needs data)
5. **Arts** (🎨) - `/arts` - NEWLY ADDED (needs data)
6. **Documents** (📄) - `/documents` - NEWLY ADDED (needs data)
7. **Studies** (📚) - `/studies` - NEWLY ADDED (needs data)
8. **Worksheets** (📋) - `/worksheets` - NEWLY ADDED (needs data)

## Core Collections (Unified)

### 1. Features Collection (`/features`)

**Purpose**: Centralized feature definitions for all 8 content types

**Document Structure** (Example: Quizzes):
```javascript
{
  id: "quizzes",
  name: "Quizzes",
  type: "quiz",
  label: "Quiz Questions",
  description: "Interactive quiz questions for learning and assessment",
  icon: "❓",
  route: "/quiz",
  color: "#4ECDC4",
  order: 1,
  visible: true,
  featured: false,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  status: "published" // draft, published, archived
}
```

**All Features** (Should exist):
- `quizzes` ✅
- `puzzles` ✅
- `stories` ✅
- `games` 🔄 (needs creation)
- `arts` 🔄 (needs creation)
- `documents` 🔄 (needs creation)
- `studies` 🔄 (needs creation)
- `worksheets` 🔄 (needs creation)

---

## Type-Specific Collections

### A. QUIZZES (✅ Existing)

#### Collection: `/quizzes`
```javascript
{
  id: auto,
  featureId: "quizzes",
  title: string,
  description: string,
  category: string, // Foreign key to categories
  topic: string,    // Foreign key to topics
  subtopic: string, // Foreign key to subtopics
  difficulty: "Beginner" | "Intermediate" | "Advanced",
  questions: [], // Array of question IDs
  totalQuestions: number,
  duration: number, // minutes
  passingScore: number, // percentage
  status: "draft" | "published",
  visibility: "public" | "private",
  featured: boolean,
  views: number,
  attempts: number,
  averageScore: number,
  createdBy: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  tags: []
}
```

#### Collection: `/categories` (with featureId)
```javascript
{
  id: auto,
  featureId: "quizzes", // Links to feature type
  name: string,
  description: string,
  icon: string,
  color: string,
  order: number,
  status: "published" | "draft",
  visibility: "public" | "private",
  featured: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

### B. PUZZLES (✅ Existing)

#### Collection: `/puzzles`
```javascript
{
  id: auto,
  featureId: "puzzles",
  title: string,
  description: string,
  category: string,
  topic: string,
  subtopic: string,
  puzzleType: string, // "jigsaw", "memory", "ordering", etc.
  difficulty: string,
  image: string, // URL
  timeLimit: number, // seconds
  status: "draft" | "published",
  visibility: "public" | "private",
  featured: boolean,
  views: number,
  plays: number,
  averageTime: number,
  createdBy: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  tags: []
}
```

---

### C. STORIES (✅ Existing)

#### Collection: `/stories`
```javascript
{
  id: auto,
  featureId: "stories",
  title: string,
  description: string,
  category: string,
  author: string,
  coverImage: string, // URL
  chapters: [], // Array of chapter objects or IDs
  totalChapters: number,
  readingLevel: string,
  estimatedReadTime: number, // minutes
  status: "draft" | "published",
  visibility: "public" | "private",
  featured: boolean,
  views: number,
  reads: number,
  rating: number, // 1-5
  createdAt: Timestamp,
  updatedAt: Timestamp,
  tags: []
}
```

---

### D. GAMES (🔄 Needs Creation)

#### Collection: `/games`
```javascript
{
  id: auto,
  featureId: "games",
  title: string,
  description: string,
  category: string,
  gameType: string, // "memory", "trivia", "puzzle", "interactive"
  thumbnail: string, // URL
  difficulty: "Easy" | "Medium" | "Hard",
  estimatedPlayTime: number, // minutes
  minPlayers: number,
  maxPlayers: number,
  rules: string,
  objectives: string,
  status: "draft" | "published",
  visibility: "public" | "private",
  featured: boolean,
  plays: number,
  averageScore: number,
  rating: number, // 1-5
  ageGroup: string, // "3-5", "6-8", "9-12", "13+"
  createdBy: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  tags: []
}
```

#### Collection: `/gameCategories`
```javascript
{
  id: auto,
  featureId: "games",
  name: string,
  description: string,
  icon: string,
  order: number,
  status: "published" | "draft",
  createdAt: Timestamp
}
```

---

### E. ARTS (🔄 Needs Creation)

#### Collection: `/arts`
```javascript
{
  id: auto,
  featureId: "arts",
  title: string,
  description: string,
  category: string, // Drawing, Painting, Digital Art, Sculpture
  artist: string,
  image: string, // URL - the actual art work
  technique: string, // "watercolor", "acrylic", "digital", etc.
  difficulty: "Beginner" | "Intermediate" | "Advanced",
  duration: number, // minutes to complete
  materials: [], // ["paint", "canvas", "brush"]
  steps: [], // Array of instruction steps
  status: "draft" | "published",
  visibility: "public" | "private",
  featured: boolean,
  views: number,
  likes: number,
  rating: number, // 1-5
  createdBy: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  tags: []
}
```

#### Collection: `/artCategories`
```javascript
{
  id: auto,
  featureId: "arts",
  name: string, // Drawing, Painting, Digital Art, Sculpture
  description: string,
  icon: string,
  color: string,
  order: number,
  status: "published" | "draft",
  createdAt: Timestamp
}
```

#### Sample Data:
```javascript
// Drawing
{ title: "Basic Drawing", category: "Drawing", difficulty: "Beginner", duration: 15 }

// Painting
{ title: "Watercolor Painting", category: "Painting", difficulty: "Intermediate", duration: 30 }

// Digital Art
{ title: "Digital Art Basics", category: "Digital Art", difficulty: "Beginner", duration: 20 }

// Sculpture
{ title: "Clay Sculpting", category: "Sculpture", difficulty: "Intermediate", duration: 45 }
```

---

### F. DOCUMENTS (🔄 Needs Creation)

#### Collection: `/documents`
```javascript
{
  id: auto,
  featureId: "documents",
  title: string,
  description: string,
  category: string, // Science, Math, History, Literature
  subject: string,
  author: string,
  fileUrl: string, // PDF or document link
  pageCount: number,
  language: string,
  grade: string, // "K-2", "3-5", "6-8", "9-12", "College"
  status: "draft" | "published",
  visibility: "public" | "private",
  featured: boolean,
  downloads: number,
  views: number,
  rating: number, // 1-5
  lastPage: number, // for resume reading
  createdBy: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  tags: []
}
```

#### Collection: `/documentCategories`
```javascript
{
  id: auto,
  featureId: "documents",
  name: string, // Science, Math, History, Literature
  description: string,
  icon: string,
  color: string,
  order: number,
  status: "published" | "draft",
  createdAt: Timestamp
}
```

#### Sample Data:
```javascript
// Biology
{ title: "Biology 101", category: "Science", pageCount: 180, grade: "9-12" }

// Mathematics
{ title: "Algebra Workbook", category: "Math", pageCount: 145, grade: "9-12" }

// History
{ title: "World History", category: "History", pageCount: 220, grade: "9-12" }

// Chemistry
{ title: "Chemistry Fundamentals", category: "Science", pageCount: 190, grade: "9-12" }
```

---

### G. STUDIES (🔄 Needs Creation)

#### Collection: `/studies`
```javascript
{
  id: auto,
  featureId: "studies",
  title: string,
  description: string,
  category: string, // English, Science, Math, Technology
  subject: string,
  level: "Beginner" | "Intermediate" | "Advanced",
  chapters: number,
  estimatedHours: number,
  topics: [], // Array of topic IDs
  keyPoints: [], // Main learning outcomes
  status: "draft" | "published",
  visibility: "public" | "private",
  featured: boolean,
  enrollments: number,
  completions: number,
  rating: number, // 1-5
  difficulty: "Beginner" | "Intermediate" | "Advanced",
  prerequisites: [], // Array of other study IDs
  createdBy: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  tags: []
}
```

#### Collection: `/studyCategories`
```javascript
{
  id: auto,
  featureId: "studies",
  name: string, // English, Science, Math, Technology
  description: string,
  icon: string,
  color: string,
  order: number,
  status: "published" | "draft",
  createdAt: Timestamp
}
```

#### Collection: `/studyChapters` (Nested option)
```javascript
{
  id: auto,
  studyId: string, // Foreign key
  chapterNumber: number,
  title: string,
  description: string,
  sections: [], // Array of section objects
  duration: number, // minutes
  content: string, // HTML/markdown content
  createdAt: Timestamp
}
```

#### Sample Data:
```javascript
// Grammar Study
{ title: "Grammar Guide", category: "English", level: "Intermediate", chapters: 12 }

// Physics Study
{ title: "Physics Study Guide", category: "Science", level: "Advanced", chapters: 18 }

// Computer Science Study
{ title: "CS Fundamentals", category: "Technology", level: "Beginner", chapters: 10 }

// Calculus Study
{ title: "Calculus Mastery", category: "Math", level: "Advanced", chapters: 20 }
```

---

### H. WORKSHEETS (🔄 Needs Creation)

#### Collection: `/worksheets`
```javascript
{
  id: auto,
  featureId: "worksheets",
  title: string,
  description: string,
  category: string, // Math, Reading, Science, English
  grade: string, // "1-2", "3-4", "5-6", "7-8", "9-12"
  subject: string,
  problemCount: number,
  difficulty: "Easy" | "Medium" | "Hard",
  estimatedTime: number, // minutes
  topics: [], // Array of topics covered
  answerKey: boolean,
  solutions: string, // URL or embedded
  status: "draft" | "published",
  visibility: "public" | "private",
  featured: boolean,
  downloads: number,
  views: number,
  rating: number, // 1-5
  completed: number,
  createdBy: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  tags: []
}
```

#### Collection: `/worksheetCategories`
```javascript
{
  id: auto,
  featureId: "worksheets",
  name: string, // Math, Reading, Science, English
  description: string,
  icon: string,
  color: string,
  order: number,
  status: "published" | "draft",
  createdAt: Timestamp
}
```

#### Sample Data:
```javascript
// Multiplication Practice
{ title: "Multiplication Practice", category: "Math", grade: "3-4", problemCount: 20 }

// Phonics
{ title: "Phonics Exercises", category: "Reading", grade: "1-2", problemCount: 15 }

// Science Lab
{ title: "Science Lab Report", category: "Science", grade: "5-8", problemCount: 8 }

// Vocabulary
{ title: "Vocabulary Builder", category: "English", grade: "3-6", problemCount: 25 }
```

---

## Hierarchical Structure (Optional but Recommended)

For Types that need deeper organization (Quizzes, Studies, Documents), use this pattern:

```
Feature
├── Categories
│   └── Topics
│       └── Subtopics
│           └── Content Items (questions, chapters, etc.)
```

**Firestore Implementation**:

### Topics Collection (`/topics`)
```javascript
{
  id: auto,
  featureId: string,
  categoryId: string,
  name: string,
  description: string,
  order: number,
  status: "published" | "draft",
  createdAt: Timestamp
}
```

### Subtopics Collection (`/subtopics`)
```javascript
{
  id: auto,
  featureId: string,
  categoryId: string,
  topicId: string,
  name: string,
  description: string,
  order: number,
  status: "published" | "draft",
  createdAt: Timestamp
}
```

---

## Common Fields (All Content Types)

Every content document should have:
- `id`: Unique identifier
- `featureId`: Which feature type it belongs to (e.g., "quizzes", "arts", "worksheets")
- `title`: Content title
- `description`: Brief description
- `category`: Primary category
- `status`: "draft" | "published" | "archived"
- `visibility`: "public" | "private"
- `featured`: boolean
- `views`: number
- `rating`: number (1-5, optional)
- `createdBy`: string (user ID)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp
- `tags`: [] (array of strings)

---

## Implementation Roadmap

### Phase 1: Core Collections (Week 1)
- ✅ Verify Features collection has all 8 types
- ✅ Verify Categories collection has `featureId` field
- 🔄 Create Games collection & gameCategories
- 🔄 Create Arts collection & artCategories
- 🔄 Create Documents collection & documentCategories
- 🔄 Create Studies collection & studyCategories
- 🔄 Create Worksheets collection & worksheetCategories

### Phase 2: Sample Data (Week 1)
- 🔄 Add 4 sample games
- 🔄 Add 4 sample arts
- 🔄 Add 4 sample documents
- 🔄 Add 4 sample studies
- 🔄 Add 4 sample worksheets

### Phase 3: Admin CRUD (Week 2)
- 🔄 Implement Arts management page
- 🔄 Implement Documents management page
- 🔄 Implement Studies management page
- 🔄 Implement Worksheets management page
- 🔄 Implement Games management page

### Phase 4: Frontend Integration (Week 2)
- ✅ Routes added (/arts, /documents, /studies, /worksheets, /games)
- ✅ Pages created with mock data
- 🔄 Integrate Firestore loading in each page
- 🔄 Remove mock data when Firestore is ready

### Phase 5: Advanced Features (Week 3+)
- 🔄 Hierarchical data (Topics/Subtopics for Studies, Documents)
- 🔄 Search and filtering optimizations
- 🔄 Analytics and reporting
- 🔄 User progress tracking

---

## Database Indexing (Recommended)

Create composite indexes for common queries:

1. **For all types**:
   - `featureId` + `status` + `createdAt`
   - `featureId` + `category` + `status`
   - `featureId` + `featured` + `views`

2. **For searchable types**:
   - `featureId` + `title` (text search)
   - `featureId` + `tags` + `status`

---

## Notes

- All 4 new page components (ArtsPage, DocumentsPage, StudiesPage, WorksheetsPage) have mock data with `_isMock: true` markers
- Mock data structure matches the Firestore schema above
- TODOs are marked in each component for Firestore loading
- The existing quiz/puzzle/stories architecture is the reference pattern
- New types follow the same feature-category-content hierarchy as much as possible
- All images should be stored in Cloudinary or Firebase Storage (URLs only in Firestore)

---

## Validation Checklist

Before going live with new content types:

- [ ] All 8 features exist in Features collection
- [ ] All 8 feature types have their own collections
- [ ] All 8 feature types have category collections with `featureId` field
- [ ] Sample data created for each type (at least 3-4 items)
- [ ] Routes added and pages load without errors
- [ ] Firestore loading code implemented in each page (remove TODOs)
- [ ] Admin management pages created or placeholders visible
- [ ] Features & Hierarchy manager can display all types
- [ ] Search and filtering work across all types
- [ ] Analytics tracking in place
- [ ] Images/media properly hosted
- [ ] Security rules updated for new collections
- [ ] Testing completed on all 8 content types

