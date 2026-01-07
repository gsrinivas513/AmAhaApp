---
sidebar_position: 5
title: Firebase Integration
---

# Firebase Integration

AmAha is built on Firebase as the primary backend, providing database, authentication, hosting, and real-time capabilities.

## Firebase Services Used

| Service | Purpose | Usage |
|---------|---------|-------|
| **Firestore** | Primary database (NoSQL) | All content & user data |
| **Firebase Auth** | Authentication | User login, signup, security |
| **Cloud Functions** | Serverless backend | API logic, scheduled tasks |
| **Cloud Storage** | File storage | User uploads, media |
| **Hosting** | Web hosting | Deploy frontend app |
| **Realtime Database** | Real-time sync | Leaderboards, live updates |
| **Cloud Messaging** | Push notifications | User notifications |
| **Analytics** | Usage tracking | User behavior analytics |

---

## Firestore Database Structure

### Collections Overview

```
firestore/
├── users/
├── quizzes/
├── puzzles/
├── activities/
├── userProgress/
├── assignments/
├── classes/
├── leaderboards/
├── lessonPlans/
└── systemSettings/
```

### 1. Users Collection

**Document:**
```javascript
db.collection('users').doc('user-123') = {
  // Profile Information
  email: 'student@example.com',
  name: 'John Doe',
  avatar: 'https://cloudinary.../avatar.jpg',
  
  // Preferences
  gradeLevel: '6-8',
  interests: ['Science', 'Math', 'History'],
  preferredLanguage: 'en',
  theme: 'light',
  
  // Account
  role: 'student', // 'student' | 'educator' | 'admin'
  isVerified: true,
  isActive: true,
  
  // Metadata
  createdAt: Timestamp(2024-01-10, 10:00:00),
  lastLoginAt: Timestamp(2024-01-15, 14:30:00),
  
  // Stats (denormalized for quick access)
  stats: {
    totalCompleted: 45,
    totalScore: 3825,
    longestStreak: 12,
  }
}
```

### 2. Quizzes Collection

**Document:**
```javascript
db.collection('quizzes').doc('quiz-math-001') = {
  // Basic Info
  id: 'quiz-math-001',
  title: 'Basic Algebra Quiz',
  description: 'Test your algebra skills',
  type: 'MCQ', // Quiz type
  
  // Difficulty Variants (each difficulty has own question set)
  levelVariants: {
    Easy: {
      questions: [
        {
          id: 'q1-easy',
          text: '2 + 2 = ?',
          type: 'MCQ',
          options: ['3', '4', '5', '6'],
          correctAnswer: '4',
          explanation: 'Basic addition',
        },
        // ... more questions
      ],
      timeLimit: 300, // 5 minutes
      passingScore: 60,
    },
    Medium: {
      questions: [...], // Harder questions
      timeLimit: 600,
      passingScore: 70,
    },
    Hard: { ... },
    Expert: { ... },
  },
  
  // Metadata
  metadata: {
    subject: 'Math',
    gradeLevel: '6-8',
    avgTime: 600, // seconds
    rating: 4.5,
    playCount: 234,
    tags: ['algebra', 'equations', 'beginners'],
  },
  
  // Admin
  createdBy: 'creator-456',
  createdAt: Timestamp(2024-01-01, 10:00:00),
  status: 'published', // 'draft' | 'review' | 'published'
  isVerified: true,
}
```

### 3. Puzzles Collection

**Document:**
```javascript
db.collection('puzzles').doc('puzzle-sudoku-001') = {
  // Basic Info
  id: 'puzzle-sudoku-001',
  title: 'Morning Sudoku Challenge',
  type: 'sudoku',
  category: 'grid',
  
  // Puzzle Data
  puzzle: {
    size: 9,
    grid: [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      // ... 7 more rows
    ],
    solution: [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      // ... complete solution
    ],
  },
  
  // Hints
  hints: [
    {
      id: 'hint-1',
      cell: { row: 0, col: 4 },
      value: 7,
      costInTokens: 5,
    },
    // ... more hints
  ],
  
  // Difficulty
  difficulty: 'Medium',
  estimatedTime: 1200, // seconds
  minMoves: 0,
  
  // Metadata
  subject: 'Logic',
  gradeLevel: 'All',
  tags: ['sudoku', 'logic', 'numbers'],
  playCount: 567,
  avgCompletionTime: 1150,
  
  // Admin
  createdAt: Timestamp(2024-01-05, 10:00:00),
  status: 'published',
}
```

### 4. Activities Collection

**Document:**
```javascript
db.collection('activities').doc('activity-order-001') = {
  // Basic Info
  id: 'activity-order-001',
  title: 'Order the Planets',
  type: 'ordering', // 'ordering' | 'matching' | 'free-play'
  subtype: 'alphabetical', // Type-specific
  
  // Activity Data
  data: {
    items: [
      { id: 'item-1', text: 'Earth' },
      { id: 'item-2', text: 'Venus' },
      { id: 'item-3', text: 'Mars' },
      { id: 'item-4', text: 'Jupiter' },
    ],
    correctOrder: ['Venus', 'Earth', 'Mars', 'Jupiter'],
    instruction: 'Order the planets by distance from the sun',
  },
  
  // Difficulty (inline, no variants)
  difficulty: 'Easy',
  estimatedTime: 120, // seconds
  
  // Metadata
  subject: 'Science',
  gradeLevel: '3-5',
  tags: ['astronomy', 'ordering', 'planets'],
  skillFocus: ['Sequencing', 'Recall'],
  
  // Leaderboard
  leaderboards: {
    allTime: true,
    daily: true,
    weekly: true,
  },
  
  // Admin
  createdBy: 'creator-789',
  createdAt: Timestamp(2024-01-08, 10:00:00),
  status: 'published',
}
```

### 5. User Progress Collection

**Document Structure:** `db.collection('userProgress').doc(userId)/sessions/{sessionId}`

```javascript
db.collection('userProgress').doc('user-123') = {
  // User completion history
  completedQuizzes: [
    {
      quizId: 'quiz-001',
      difficulty: 'Medium',
      score: 85,
      time: 450000, // milliseconds
      answers: [
        { questionId: 'q1', answer: 'B', isCorrect: true },
        { questionId: 'q2', answer: 'A', isCorrect: false },
      ],
      completedAt: Timestamp(2024-01-10, 15:30:00),
      sessionId: 'session-abc-123',
    },
    // ... more completions
  ],
  
  completedPuzzles: [
    {
      puzzleId: 'puzzle-001',
      score: 90,
      moves: 23,
      time: 1200000,
      hints: 1,
      completedAt: Timestamp(2024-01-10, 16:00:00),
    },
    // ... more puzzles
  ],
  
  completedActivities: [
    {
      activityId: 'activity-001',
      score: 100,
      time: 60000,
      completedAt: Timestamp(2024-01-10, 16:15:00),
    },
  ],
  
  // Current session (being played)
  currentSession: {
    contentId: 'quiz-002',
    contentType: 'quiz',
    difficulty: 'Hard',
    startedAt: Timestamp(2024-01-15, 14:00:00),
    userAnswers: [
      { questionId: 'q1', answer: 'D' },
    ],
    currentQuestion: 1,
  },
  
  // Statistics
  stats: {
    totalCompleted: 45,
    totalScore: 3825,
    byType: {
      quiz: { count: 30, avgScore: 84 },
      puzzle: { count: 10, avgScore: 88 },
      activity: { count: 5, avgScore: 82 },
    },
    currentStreak: 3,
    longestStreak: 12,
    lastCompletedAt: Timestamp(2024-01-15, 14:30:00),
  },
}
```

### 6. Assignments Collection

**Document:**
```javascript
db.collection('assignments').doc('assign-001') = {
  // Assignment Info
  id: 'assign-001',
  title: 'Chapter 3 Quiz - Due Friday',
  description: 'Complete all medium difficulty quizzes',
  
  // Assignment Content
  contentIds: ['quiz-001', 'quiz-002', 'quiz-003'],
  contentType: 'quiz',
  requiredDifficulty: 'Medium',
  
  // Timing
  createdAt: Timestamp(2024-01-10, 10:00:00),
  dueDate: Timestamp(2024-01-12, 23:59:59),
  
  // Class & Teacher
  classId: 'class-001',
  classLevel: '6-8 Grade Science',
  teacherId: 'teacher-123',
  
  // Status Tracking
  assignedTo: ['student-1', 'student-2', ...], // User IDs
  status: 'active', // 'draft' | 'active' | 'completed'
  
  // Submission Tracking
  submissions: {
    'student-1': {
      status: 'submitted',
      completedItems: ['quiz-001', 'quiz-002'],
      pendingItems: ['quiz-003'],
      submittedAt: Timestamp(2024-01-12, 15:00:00),
      score: 170, // Total score
    },
    'student-2': {
      status: 'incomplete',
      completedItems: ['quiz-001'],
      pendingItems: ['quiz-002', 'quiz-003'],
    },
  },
  
  // Settings
  allowLateSubmission: true,
  latePenalty: 10, // % reduction
  showAnswersAfterDueDate: true,
}
```

### 7. Classes Collection

**Document:**
```javascript
db.collection('classes').doc('class-001') = {
  // Class Info
  id: 'class-001',
  name: '6th Grade Science - Period 3',
  gradeLevel: '6-8',
  subject: 'Science',
  code: 'SCIENCE6-P3', // Join code
  
  // Teacher
  teacherId: 'teacher-123',
  createdAt: Timestamp(2024-01-01, 10:00:00),
  
  // Members
  students: ['student-1', 'student-2', ...], // User IDs
  studentCount: 28,
  
  // Assignments
  activeAssignments: ['assign-001', 'assign-002'],
  allAssignments: ['assign-001', 'assign-002', 'assign-003'],
  
  // Settings
  isActive: true,
  isPublic: false, // Only teacher can add students
  archiveDate: null, // When archived (if at all)
}
```

### 8. Leaderboards Collection

**Subcollection:** `db.collection('leaderboards').doc(contentId)/entries`

```javascript
db.collection('leaderboards').doc('quiz-001') = {
  // Quick access to top entries
  topEntries: [
    {
      rank: 1,
      userId: 'user-5',
      userName: 'Alice',
      score: 98,
      time: 420000,
      difficulty: 'Hard',
      date: Timestamp(2024-01-15, 14:00:00),
    },
    {
      rank: 2,
      userId: 'user-3',
      userName: 'Bob',
      score: 95,
      time: 450000,
      difficulty: 'Hard',
      date: Timestamp(2024-01-14, 16:30:00),
    },
    // ... top 100
  ],
  
  // Metadata
  contentId: 'quiz-001',
  contentTitle: 'Algebra Quiz',
  totalEntries: 1234,
  lastUpdated: Timestamp(2024-01-15, 15:00:00),
}

// Subcollection: entries
db.collection('leaderboards').doc('quiz-001').collection('entries') = {
  'user-123': {
    userId: 'user-123',
    userName: 'Charlie',
    score: 85,
    time: 500000,
    difficulty: 'Medium',
    date: Timestamp(2024-01-15, 15:30:00),
    rank: 45, // Cached for quick display
  },
  // ... one entry per user
}
```

---

## Authentication

### Firebase Auth Integration

```javascript
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut 
} from 'firebase/auth';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign Up
const signup = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      email, 
      password
    );
    
    // Create user profile in Firestore
    await db.collection('users').doc(userCredential.user.uid).set({
      email,
      name,
      avatar: '', // Will set later
      role: 'student', // Default role
      createdAt: new Date(),
      stats: {
        totalCompleted: 0,
        totalScore: 0,
        longestStreak: 0,
      }
    });
    
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Sign In
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Sign Out
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Auto-restore session
auth.onAuthStateChanged(async (user) => {
  if (user) {
    // User is signed in
    const userData = await db.collection('users').doc(user.uid).get();
    dispatch(setUser(userData.data()));
  } else {
    // User is signed out
    dispatch(logout());
  }
});
```

---

## Firestore Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if isAdmin();
    }
    
    // Public content (quizzes, puzzles, activities)
    match /quizzes/{document=**} {
      allow read: if request.auth != null;
      allow write: if isCreator();
    }
    
    match /puzzles/{document=**} {
      allow read: if request.auth != null;
      allow write: if isCreator();
    }
    
    // User progress - only owner can access
    match /userProgress/{userId}/{document=**} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Assignments - teacher or student
    match /assignments/{assignmentId} {
      allow read: if 
        request.auth.uid == resource.data.teacherId ||
        request.auth.uid in resource.data.assignedTo;
      allow write: if request.auth.uid == resource.data.teacherId;
    }
    
    // Classes - teacher can manage, students can read
    match /classes/{classId} {
      allow read: if 
        request.auth.uid == resource.data.teacherId ||
        request.auth.uid in resource.data.students;
      allow write: if request.auth.uid == resource.data.teacherId;
    }
    
    // Leaderboards - public read, system write only
    match /leaderboards/{document=**} {
      allow read: if request.auth != null;
      allow write: if isCloudFunction();
    }
  }
  
  // Helper functions
  function isAdmin() {
    return request.auth.token.role == 'admin';
  }
  
  function isCreator() {
    return request.auth.token.role in ['admin', 'creator'];
  }
  
  function isCloudFunction() {
    return request.auth.uid == 'cloud-function-service';
  }
}
```

---

## Cloud Functions

### Quiz Submission Handler

```javascript
// functions/quiz/submitQuiz.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.submitQuiz = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }

  const { quizId, userAnswers, difficulty, time } = data;
  const userId = context.auth.uid;

  try {
    // 1. Get quiz
    const quizDoc = await db.collection('quizzes').doc(quizId).get();
    const quiz = quizDoc.data();

    // 2. Calculate score
    const variant = quiz.levelVariants[difficulty];
    const answers = variant.questions;
    let correctCount = 0;

    userAnswers.forEach(userAnswer => {
      const question = answers.find(q => q.id === userAnswer.questionId);
      if (question && question.correctAnswer === userAnswer.answer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / answers.length) * 100);
    const passed = score >= variant.passingScore;

    // 3. Save progress
    const completion = {
      quizId,
      difficulty,
      score,
      passed,
      time,
      answers: userAnswers,
      completedAt: admin.firestore.Timestamp.now(),
    };

    await db
      .collection('userProgress')
      .doc(userId)
      .collection('completedQuizzes')
      .add(completion);

    // 4. Update user stats
    const userRef = db.collection('users').doc(userId);
    await userRef.update({
      'stats.totalCompleted': admin.firestore.FieldValue.increment(1),
      'stats.totalScore': admin.firestore.FieldValue.increment(score),
    });

    // 5. Update leaderboard
    if (score > 0) {
      const leaderboardRef = db
        .collection('leaderboards')
        .doc(quizId)
        .collection('entries')
        .doc(userId);

      const existingEntry = await leaderboardRef.get();
      if (!existingEntry.exists || score > existingEntry.data().score) {
        await leaderboardRef.set({
          userId,
          userName: context.auth.token.name,
          score,
          time,
          difficulty,
          date: admin.firestore.Timestamp.now(),
        });
      }
    }

    return {
      success: true,
      score,
      passed,
      message: passed ? 'Quiz passed!' : 'Try again!',
    };
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Error processing quiz submission'
    );
  }
});
```

### Scheduled Tasks

```javascript
// Daily challenge reset
exports.resetDailyChallenge = functions.pubsub
  .schedule('0 0 * * *') // Midnight UTC
  .onRun(async (context) => {
    const challengePool = await db.collection('dailyChallenges').get();
    
    for (const doc of challengePool.docs) {
      const randomQuiz = await getRandomContent('quizzes');
      await doc.ref.update({
        contentId: randomQuiz.id,
        date: admin.firestore.Timestamp.now(),
        completionCount: 0,
      });
    }
    
    return null;
  });
```

---

## Indexes

**Required Firestore Indexes:**

```javascript
// User progress queries
// Collection: userProgress/{userId}/completedQuizzes
// Fields: completedAt (Descending)
// Fields: difficulty

// Leaderboard queries
// Collection: leaderboards/{contentId}/entries
// Fields: score (Descending), time (Ascending)

// Assignments
// Collection: assignments
// Fields: classId, status
// Fields: dueDate (Descending)
```

---

## Performance Optimization

### Denormalization Strategy

```javascript
// Store frequently accessed data in user document
users/{userId} {
  stats: {
    totalCompleted: 45,     // Denormalized
    totalScore: 3825,        // Denormalized
    longestStreak: 12,       // Denormalized
  }
}

// Update stats when quiz completed
// Instead of computing from all completions
```

### Caching Strategy

```javascript
// Client-side Redux cache
// Server-side Firestore cache enabled
// CDN cache for static content

// Query patterns optimized for indexes
// Batch writes for efficiency
```

---

## Backup & Recovery

- **Automatic backups:** Daily to Cloud Storage
- **Manual exports:** Via Firestore console
- **Point-in-time recovery:** Up to 35 days
- **Disaster recovery plan:** Documented in DevOps

---

**Next:** [Future Features](../future/advanced-puzzles) or [Architecture Overview](overview)
