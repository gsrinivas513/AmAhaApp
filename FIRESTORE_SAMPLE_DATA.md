# Firestore Setup Instructions - Sample Data & Collections

## Quick Copy-Paste Guide for Firestore Setup

This document provides exact data that can be directly copied into Firestore Console.

---

## Step 1: Create Collections Structure

Use Firestore Console → Create Collection

### Collections to Create (in order):

1. ✅ `features` (update existing with 4 new types)
2. ✅ `categories` (update existing with featureId field)
3. 🔄 `arts` (NEW)
4. 🔄 `artCategories` (NEW)
5. 🔄 `documents` (NEW)
6. 🔄 `documentCategories` (NEW)
7. 🔄 `studies` (NEW)
8. 🔄 `studyCategories` (NEW)
9. 🔄 `worksheets` (NEW)
10. 🔄 `worksheetCategories` (NEW)
11. 🔄 `games` (NEW)
12. 🔄 `gameCategories` (NEW)

---

## Step 2: Add Feature Definitions

### Collection: `/features`

#### Document 1: `arts`
```json
{
  "id": "arts",
  "name": "Arts",
  "type": "art",
  "label": "Arts & Creative",
  "description": "Creative art forms including drawing, painting, and digital art",
  "icon": "🎨",
  "route": "/arts",
  "color": "#EC4899",
  "order": 5,
  "visible": true,
  "featured": false,
  "status": "published",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 2: `documents`
```json
{
  "id": "documents",
  "name": "Documents",
  "type": "document",
  "label": "Educational Documents",
  "description": "Textbooks, reading materials, and reference documents",
  "icon": "📄",
  "route": "/documents",
  "color": "#3B82F6",
  "order": 6,
  "visible": true,
  "featured": false,
  "status": "published",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 3: `studies`
```json
{
  "id": "studies",
  "name": "Studies",
  "type": "study",
  "label": "Study Guides",
  "description": "Structured learning guides and study materials",
  "icon": "📚",
  "route": "/studies",
  "color": "#10B981",
  "order": 7,
  "visible": true,
  "featured": false,
  "status": "published",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 4: `worksheets`
```json
{
  "id": "worksheets",
  "name": "Worksheets",
  "type": "worksheet",
  "label": "Practice Worksheets",
  "description": "Interactive practice worksheets and exercises",
  "icon": "📋",
  "route": "/worksheets",
  "color": "#F59E0B",
  "order": 8,
  "visible": true,
  "featured": false,
  "status": "published",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 5: `games`
```json
{
  "id": "games",
  "name": "Games",
  "type": "game",
  "label": "Interactive Games",
  "description": "Fun and educational interactive games",
  "icon": "🎮",
  "route": "/games",
  "color": "#8B5CF6",
  "order": 3,
  "visible": true,
  "featured": false,
  "status": "published",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

---

## Step 3: Add Category Collections

### Collection: `/artCategories`

#### Document 1
```json
{
  "id": "drawing",
  "featureId": "arts",
  "name": "Drawing",
  "description": "Basic and advanced drawing techniques",
  "icon": "✏️",
  "color": "#FFB6B9",
  "order": 1,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 2
```json
{
  "id": "painting",
  "featureId": "arts",
  "name": "Painting",
  "description": "Watercolor, acrylic, and oil painting",
  "icon": "🎨",
  "color": "#FFE8D6",
  "order": 2,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 3
```json
{
  "id": "digital",
  "featureId": "arts",
  "name": "Digital Art",
  "description": "Digital design and illustration",
  "icon": "💻",
  "color": "#DAEAF6",
  "order": 3,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 4
```json
{
  "id": "sculpture",
  "featureId": "arts",
  "name": "Sculpture",
  "description": "3D sculpting and modeling techniques",
  "icon": "🗿",
  "color": "#D4A5A5",
  "order": 4,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

### Collection: `/documentCategories`

#### Document 1
```json
{
  "id": "science",
  "featureId": "documents",
  "name": "Science",
  "description": "Science textbooks and materials",
  "icon": "🔬",
  "color": "#FFE66D",
  "order": 1,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 2
```json
{
  "id": "math",
  "featureId": "documents",
  "name": "Math",
  "description": "Mathematics textbooks and workbooks",
  "icon": "🔢",
  "color": "#A8D8EA",
  "order": 2,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 3
```json
{
  "id": "history",
  "featureId": "documents",
  "name": "History",
  "description": "Historical documents and guides",
  "icon": "📜",
  "color": "#AA96DA",
  "order": 3,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 4
```json
{
  "id": "literature",
  "featureId": "documents",
  "name": "Literature",
  "description": "Books and literary materials",
  "icon": "📚",
  "color": "#FCBAD3",
  "order": 4,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

### Collection: `/studyCategories`

#### Document 1
```json
{
  "id": "english",
  "featureId": "studies",
  "name": "English",
  "description": "English language and grammar studies",
  "icon": "📖",
  "color": "#FFD4E5",
  "order": 1,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 2
```json
{
  "id": "science",
  "featureId": "studies",
  "name": "Science",
  "description": "Science study guides",
  "icon": "🔭",
  "color": "#C9E4CA",
  "order": 2,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 3
```json
{
  "id": "math",
  "featureId": "studies",
  "name": "Math",
  "description": "Mathematics study guides",
  "icon": "📐",
  "color": "#FFDAB9",
  "order": 3,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 4
```json
{
  "id": "technology",
  "featureId": "studies",
  "name": "Technology",
  "description": "Computer science and technology studies",
  "icon": "💻",
  "color": "#E0D5FF",
  "order": 4,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

### Collection: `/worksheetCategories`

#### Document 1
```json
{
  "id": "math",
  "featureId": "worksheets",
  "name": "Math",
  "description": "Mathematics worksheets and exercises",
  "icon": "🔢",
  "color": "#FFB3BA",
  "order": 1,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 2
```json
{
  "id": "reading",
  "featureId": "worksheets",
  "name": "Reading",
  "description": "Reading comprehension worksheets",
  "icon": "📖",
  "color": "#BAFFC9",
  "order": 2,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 3
```json
{
  "id": "science",
  "featureId": "worksheets",
  "name": "Science",
  "description": "Science worksheets and labs",
  "icon": "🔬",
  "color": "#FFFFBA",
  "order": 3,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 4
```json
{
  "id": "english",
  "featureId": "worksheets",
  "name": "English",
  "description": "English language worksheets",
  "icon": "✏️",
  "color": "#BAE1FF",
  "order": 4,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

### Collection: `/gameCategories`

#### Document 1
```json
{
  "id": "memory",
  "featureId": "games",
  "name": "Memory Games",
  "description": "Memory matching and recall games",
  "icon": "🧠",
  "color": "#FFD1DC",
  "order": 1,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 2
```json
{
  "id": "trivia",
  "featureId": "games",
  "name": "Trivia",
  "description": "Trivia and knowledge games",
  "icon": "🎯",
  "color": "#FFADC5",
  "order": 2,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 3
```json
{
  "id": "puzzle",
  "featureId": "games",
  "name": "Puzzle Games",
  "description": "Logic and puzzle games",
  "icon": "🧩",
  "color": "#CFFAFE",
  "order": 3,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

#### Document 4
```json
{
  "id": "adventure",
  "featureId": "games",
  "name": "Adventure",
  "description": "Interactive adventure games",
  "icon": "🎮",
  "color": "#D1FFF7",
  "order": 4,
  "status": "published",
  "visibility": "public",
  "featured": false,
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now()
}
```

---

## Step 4: Add Content Items

### Collection: `/arts`

#### Document 1
```json
{
  "id": 1,
  "featureId": "arts",
  "title": "Basic Drawing Fundamentals",
  "description": "Learn fundamental drawing techniques and principles",
  "category": "Drawing",
  "artist": "Art Master",
  "technique": "pencil",
  "difficulty": "Beginner",
  "duration": 15,
  "materials": ["pencil", "paper", "eraser"],
  "steps": ["Introduction", "Line work", "Shading", "Details"],
  "status": "published",
  "visibility": "public",
  "featured": true,
  "views": 567,
  "likes": 234,
  "rating": 4.7,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["drawing", "beginner", "fundamentals"],
  "_isMock": true
}
```

#### Document 2
```json
{
  "id": 2,
  "featureId": "arts",
  "title": "Watercolor Painting Basics",
  "description": "Master watercolor painting techniques",
  "category": "Painting",
  "artist": "Water Artist",
  "technique": "watercolor",
  "difficulty": "Intermediate",
  "duration": 30,
  "materials": ["watercolor", "brush", "paper", "water"],
  "steps": ["Color mixing", "Brush techniques", "Composition", "Finishing touches"],
  "status": "published",
  "visibility": "public",
  "featured": false,
  "views": 892,
  "likes": 445,
  "rating": 4.8,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["painting", "watercolor", "intermediate"],
  "_isMock": true
}
```

#### Document 3
```json
{
  "id": 3,
  "featureId": "arts",
  "title": "Digital Art for Beginners",
  "description": "Introduction to digital art and design",
  "category": "Digital Art",
  "artist": "Digital Creator",
  "technique": "digital",
  "difficulty": "Beginner",
  "duration": 20,
  "materials": ["tablet", "stylus", "software"],
  "steps": ["Setup", "Basic shapes", "Coloring", "Finishing"],
  "status": "published",
  "visibility": "public",
  "featured": true,
  "views": 1234,
  "likes": 567,
  "rating": 4.6,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["digital", "art", "design"],
  "_isMock": true
}
```

#### Document 4
```json
{
  "id": 4,
  "featureId": "arts",
  "title": "Clay Sculpture Masterclass",
  "description": "Learn professional sculpture techniques",
  "category": "Sculpture",
  "artist": "Sculptor Pro",
  "technique": "clay",
  "difficulty": "Intermediate",
  "duration": 45,
  "materials": ["clay", "tools", "kiln"],
  "steps": ["Preparation", "Forming", "Detailing", "Finishing"],
  "status": "published",
  "visibility": "public",
  "featured": false,
  "views": 345,
  "likes": 156,
  "rating": 4.9,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["sculpture", "clay", "advanced"],
  "_isMock": true
}
```

### Collection: `/documents`

#### Document 1
```json
{
  "id": 1,
  "featureId": "documents",
  "title": "Biology 101: Complete Guide",
  "description": "Comprehensive biology textbook for high school",
  "category": "Science",
  "subject": "Biology",
  "author": "Dr. Science",
  "fileUrl": "https://example.com/biology.pdf",
  "pageCount": 180,
  "language": "English",
  "grade": "9-12",
  "status": "published",
  "visibility": "public",
  "featured": true,
  "downloads": 1234,
  "views": 5678,
  "rating": 4.5,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["biology", "science", "textbook"],
  "_isMock": true
}
```

#### Document 2
```json
{
  "id": 2,
  "featureId": "documents",
  "title": "Algebra & Geometry Workbook",
  "description": "Practice problems and solutions for algebra and geometry",
  "category": "Math",
  "subject": "Mathematics",
  "author": "Math Expert",
  "fileUrl": "https://example.com/math.pdf",
  "pageCount": 145,
  "language": "English",
  "grade": "9-12",
  "status": "published",
  "visibility": "public",
  "featured": false,
  "downloads": 2345,
  "views": 6789,
  "rating": 4.7,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["math", "algebra", "workbook"],
  "_isMock": true
}
```

#### Document 3
```json
{
  "id": 3,
  "featureId": "documents",
  "title": "World History Reference",
  "description": "Complete world history from ancient times to present",
  "category": "History",
  "subject": "History",
  "author": "History Scholar",
  "fileUrl": "https://example.com/history.pdf",
  "pageCount": 220,
  "language": "English",
  "grade": "9-12",
  "status": "published",
  "visibility": "public",
  "featured": true,
  "downloads": 1567,
  "views": 4567,
  "rating": 4.6,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["history", "world", "reference"],
  "_isMock": true
}
```

#### Document 4
```json
{
  "id": 4,
  "featureId": "documents",
  "title": "Chemistry Fundamentals",
  "description": "Basic and advanced chemistry concepts",
  "category": "Science",
  "subject": "Chemistry",
  "author": "Chem Master",
  "fileUrl": "https://example.com/chemistry.pdf",
  "pageCount": 190,
  "language": "English",
  "grade": "9-12",
  "status": "published",
  "visibility": "public",
  "featured": false,
  "downloads": 890,
  "views": 3456,
  "rating": 4.8,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["chemistry", "science", "fundamentals"],
  "_isMock": true
}
```

### Collection: `/studies`

#### Document 1
```json
{
  "id": 1,
  "featureId": "studies",
  "title": "English Grammar Mastery",
  "description": "Complete guide to English grammar rules and usage",
  "category": "English",
  "subject": "English Language",
  "level": "Intermediate",
  "chapters": 12,
  "estimatedHours": 15,
  "topics": ["nouns", "verbs", "adjectives", "sentences"],
  "keyPoints": ["Grammar fundamentals", "Sentence structure", "Common mistakes"],
  "status": "published",
  "visibility": "public",
  "featured": true,
  "enrollments": 1234,
  "completions": 890,
  "rating": 4.6,
  "difficulty": "Intermediate",
  "prerequisites": [],
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["english", "grammar", "study guide"],
  "_isMock": true
}
```

#### Document 2
```json
{
  "id": 2,
  "featureId": "studies",
  "title": "Physics Study Guide",
  "description": "Comprehensive physics study material",
  "category": "Science",
  "subject": "Physics",
  "level": "Advanced",
  "chapters": 18,
  "estimatedHours": 24,
  "topics": ["mechanics", "energy", "waves", "electricity"],
  "keyPoints": ["Newton's laws", "Energy conservation", "Wave motion"],
  "status": "published",
  "visibility": "public",
  "featured": false,
  "enrollments": 2345,
  "completions": 1234,
  "rating": 4.7,
  "difficulty": "Advanced",
  "prerequisites": [],
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["physics", "science", "advanced"],
  "_isMock": true
}
```

#### Document 3
```json
{
  "id": 3,
  "featureId": "studies",
  "title": "Computer Science Fundamentals",
  "description": "Introduction to computer science and programming",
  "category": "Technology",
  "subject": "Computer Science",
  "level": "Beginner",
  "chapters": 10,
  "estimatedHours": 12,
  "topics": ["algorithms", "data structures", "programming basics"],
  "keyPoints": ["Logic", "Problem solving", "Coding fundamentals"],
  "status": "published",
  "visibility": "public",
  "featured": true,
  "enrollments": 3456,
  "completions": 2345,
  "rating": 4.8,
  "difficulty": "Beginner",
  "prerequisites": [],
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["cs", "programming", "beginner"],
  "_isMock": true
}
```

#### Document 4
```json
{
  "id": 4,
  "featureId": "studies",
  "title": "Calculus Mastery",
  "description": "Advanced calculus course material",
  "category": "Math",
  "subject": "Calculus",
  "level": "Advanced",
  "chapters": 20,
  "estimatedHours": 30,
  "topics": ["limits", "derivatives", "integrals", "applications"],
  "keyPoints": ["Differentiation", "Integration", "Applications"],
  "status": "published",
  "visibility": "public",
  "featured": false,
  "enrollments": 1567,
  "completions": 890,
  "rating": 4.9,
  "difficulty": "Advanced",
  "prerequisites": [],
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["calculus", "math", "advanced"],
  "_isMock": true
}
```

### Collection: `/worksheets`

#### Document 1
```json
{
  "id": 1,
  "featureId": "worksheets",
  "title": "Multiplication Practice Sheet",
  "description": "Practice multiplication tables and basic multiplication",
  "category": "Math",
  "grade": "3-4",
  "subject": "Mathematics",
  "problemCount": 20,
  "difficulty": "Easy",
  "estimatedTime": 15,
  "topics": ["multiplication", "times tables"],
  "answerKey": true,
  "solutions": "https://example.com/mult_solutions.pdf",
  "status": "published",
  "visibility": "public",
  "featured": true,
  "downloads": 1234,
  "views": 3456,
  "rating": 4.7,
  "completed": 1234,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["math", "multiplication", "practice"],
  "_isMock": true
}
```

#### Document 2
```json
{
  "id": 2,
  "featureId": "worksheets",
  "title": "Phonics Exercises",
  "description": "Letter sounds and phonics recognition exercises",
  "category": "Reading",
  "grade": "1-2",
  "subject": "Reading",
  "problemCount": 15,
  "difficulty": "Easy",
  "estimatedTime": 10,
  "topics": ["phonics", "letter sounds"],
  "answerKey": true,
  "solutions": "https://example.com/phonics_solutions.pdf",
  "status": "published",
  "visibility": "public",
  "featured": false,
  "downloads": 2345,
  "views": 4567,
  "rating": 4.6,
  "completed": 2345,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["reading", "phonics", "beginner"],
  "_isMock": true
}
```

#### Document 3
```json
{
  "id": 3,
  "featureId": "worksheets",
  "title": "Science Lab Report Template",
  "description": "Guide for writing scientific lab reports",
  "category": "Science",
  "grade": "5-8",
  "subject": "Science",
  "problemCount": 8,
  "difficulty": "Medium",
  "estimatedTime": 30,
  "topics": ["lab report", "scientific method"],
  "answerKey": true,
  "solutions": "https://example.com/lab_guide.pdf",
  "status": "published",
  "visibility": "public",
  "featured": true,
  "downloads": 890,
  "views": 2345,
  "rating": 4.8,
  "completed": 890,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["science", "lab", "report"],
  "_isMock": true
}
```

#### Document 4
```json
{
  "id": 4,
  "featureId": "worksheets",
  "title": "Vocabulary Building Worksheet",
  "description": "Expand vocabulary with word meanings and usage",
  "category": "English",
  "grade": "3-6",
  "subject": "English Language",
  "problemCount": 25,
  "difficulty": "Medium",
  "estimatedTime": 20,
  "topics": ["vocabulary", "word usage"],
  "answerKey": true,
  "solutions": "https://example.com/vocab_solutions.pdf",
  "status": "published",
  "visibility": "public",
  "featured": false,
  "downloads": 1567,
  "views": 3890,
  "rating": 4.5,
  "completed": 1567,
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["english", "vocabulary", "practice"],
  "_isMock": true
}
```

### Collection: `/games`

#### Document 1
```json
{
  "id": 1,
  "featureId": "games",
  "title": "Memory Match",
  "description": "Classic memory matching game",
  "category": "Memory Games",
  "gameType": "memory",
  "thumbnail": "https://example.com/memory-match.jpg",
  "difficulty": "Easy",
  "estimatedPlayTime": 10,
  "minPlayers": 1,
  "maxPlayers": 4,
  "rules": "Match pairs of identical cards to win",
  "objectives": "Find all matching pairs in minimum moves",
  "status": "published",
  "visibility": "public",
  "featured": true,
  "plays": 5678,
  "averageScore": 85,
  "rating": 4.7,
  "ageGroup": "3-5",
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["memory", "matching", "fun"],
  "_isMock": true
}
```

#### Document 2
```json
{
  "id": 2,
  "featureId": "games",
  "title": "Trivia Quiz Master",
  "description": "Test your knowledge with fun trivia questions",
  "category": "Trivia",
  "gameType": "trivia",
  "thumbnail": "https://example.com/trivia.jpg",
  "difficulty": "Medium",
  "estimatedPlayTime": 15,
  "minPlayers": 1,
  "maxPlayers": 4,
  "rules": "Answer trivia questions correctly to earn points",
  "objectives": "Get the highest score by answering questions",
  "status": "published",
  "visibility": "public",
  "featured": false,
  "plays": 4567,
  "averageScore": 72,
  "rating": 4.6,
  "ageGroup": "9-12",
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["trivia", "quiz", "knowledge"],
  "_isMock": true
}
```

#### Document 3
```json
{
  "id": 3,
  "featureId": "games",
  "title": "Puzzle Solver",
  "description": "Challenging logic and puzzle game",
  "category": "Puzzle Games",
  "gameType": "puzzle",
  "thumbnail": "https://example.com/puzzle.jpg",
  "difficulty": "Hard",
  "estimatedPlayTime": 30,
  "minPlayers": 1,
  "maxPlayers": 1,
  "rules": "Solve logic puzzles to progress",
  "objectives": "Complete all puzzle levels",
  "status": "published",
  "visibility": "public",
  "featured": true,
  "plays": 3456,
  "averageScore": 68,
  "rating": 4.8,
  "ageGroup": "13+",
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["puzzle", "logic", "challenge"],
  "_isMock": true
}
```

#### Document 4
```json
{
  "id": 4,
  "featureId": "games",
  "title": "Adventure Quest",
  "description": "Interactive adventure game with choices",
  "category": "Adventure",
  "gameType": "interactive",
  "thumbnail": "https://example.com/adventure.jpg",
  "difficulty": "Medium",
  "estimatedPlayTime": 45,
  "minPlayers": 1,
  "maxPlayers": 1,
  "rules": "Make choices to guide your adventure",
  "objectives": "Reach the end and unlock all endings",
  "status": "published",
  "visibility": "public",
  "featured": false,
  "plays": 2345,
  "averageScore": 76,
  "rating": 4.9,
  "ageGroup": "9-12",
  "createdBy": "admin",
  "createdAt": Timestamp.now(),
  "updatedAt": Timestamp.now(),
  "tags": ["adventure", "story", "interactive"],
  "_isMock": true
}
```

---

## How to Add This Data to Firestore

### Method 1: Firestore Console (Manual)
1. Go to Firebase Console → Firestore Database
2. Click "Create Collection"
3. Enter collection name (e.g., "arts")
4. Add first document by clicking "Add Document"
5. Copy-paste JSON above into the fields
6. Repeat for all collections and documents

### Method 2: Firebase CLI (Recommended)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Import data
firebase firestore:start

# Create a script to upload the JSON data
# (Firebase provides tools for bulk import)
```

### Method 3: Using Firebase Admin SDK
```javascript
// Node.js script to upload data
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const artsData = [
  {
    id: 1,
    featureId: "arts",
    // ... rest of document
  },
  // ... more documents
];

// Add documents
async function uploadData() {
  for (const doc of artsData) {
    await db.collection("arts").doc(doc.id.toString()).set(doc);
  }
}

uploadData().then(() => console.log("Done!"));
```

---

## Verification Checklist

After adding all data, verify:

- [ ] `/features` collection has 8 documents (quizzes, puzzles, stories, games, arts, documents, studies, worksheets)
- [ ] `/artCategories` has 4 documents (Drawing, Painting, Digital Art, Sculpture)
- [ ] `/documentCategories` has 4 documents (Science, Math, History, Literature)
- [ ] `/studyCategories` has 4 documents (English, Science, Math, Technology)
- [ ] `/worksheetCategories` has 4 documents (Math, Reading, Science, English)
- [ ] `/gameCategories` has 4 documents (Memory, Trivia, Puzzle, Adventure)
- [ ] `/arts` has 4 documents
- [ ] `/documents` has 4 documents
- [ ] `/studies` has 4 documents
- [ ] `/worksheets` has 4 documents
- [ ] `/games` has 4 documents
- [ ] All documents have `featureId` field
- [ ] All documents have `_isMock: true` marker
- [ ] All timestamps are Timestamp objects

---

## Next Steps

1. ✅ Copy all data above into Firestore
2. ✅ Verify collections and counts
3. 🔄 Update page components to replace mock loading with Firestore queries
4. 🔄 Create admin CRUD operations
5. 🔄 Remove `_isMock` checks once Firestore is live
6. 🔄 Implement full search and filtering
7. 🔄 Add analytics and tracking

---

## Firestore Query Examples

Once data is added, use these queries in your components:

```javascript
// Get all arts
const querySnapshot = await getDocs(collection(db, 'arts'));

// Get arts by category
const q = query(collection(db, 'arts'), where('category', '==', 'Drawing'));
const querySnapshot = await getDocs(q);

// Get all art categories
const categories = await getDocs(collection(db, 'artCategories'));

// Get featured content
const q = query(collection(db, 'arts'), where('featured', '==', true));
const featured = await getDocs(q);

// Real-time listener
onSnapshot(collection(db, 'arts'), (snapshot) => {
  snapshot.docs.forEach(doc => console.log(doc.data()));
});
```

Replace these in the TODO comments in each page component to activate Firestore integration!

