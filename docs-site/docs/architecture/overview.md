---
sidebar_position: 1
title: Overview
---

# Architecture Overview

AmAha is built on a modern, scalable architecture using React, Firebase, and cloud technologies.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interfaces                      │
├─────────────────────────────────────────────────────────┤
│ • Web App (React)    • Mobile (React Native)           │
│ • Admin Panel        • Teacher Dashboard               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   API Layer                             │
├─────────────────────────────────────────────────────────┤
│ • REST/GraphQL API   • Authentication                  │
│ • Real-time Updates  • WebSocket Support               │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Business Logic Layer                       │
├─────────────────────────────────────────────────────────┤
│ • Quiz Engine        • Puzzle Solver                   │
│ • Scoring System     • User Management                 │
│ • Analytics Engine   • Leaderboard Manager             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│               Data & Services Layer                     │
├─────────────────────────────────────────────────────────┤
│ • Firestore Database • Storage (Images/Media)          │
│ • User Service       • Content Service                 │
│ • Analytics Service  • Notification Service            │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│            External Services & Infrastructure          │
├─────────────────────────────────────────────────────────┤
│ • Firebase Auth      • Cloudinary (Images)             │
│ • Hosting (Firebase) • Analytics (Google Analytics)    │
│ • CDN (CloudFlare)   • Email Service (SendGrid)        │
└─────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

**Web Application:**
- Framework: React 18+
- Routing: React Router v6
- State Management: Redux / Context API
- Styling: Tailwind CSS + CSS Modules
- Build Tool: Vite / Create React App
- Testing: Jest + React Testing Library

**Mobile Application:**
- Framework: React Native
- Navigation: React Navigation
- Platform: iOS & Android

### Backend

**Firebase Services:**
- **Firestore:** NoSQL database
- **Firebase Auth:** Authentication
- **Cloud Functions:** Serverless functions
- **Hosting:** Web hosting
- **Storage:** File storage
- **Realtime Database:** (for messaging, if needed)

**External Services:**
- **Cloudinary:** Image management
- **SendGrid:** Email delivery
- **Google Analytics:** Analytics

### Infrastructure

**Hosting:**
- Firebase Hosting (Frontend)
- Cloud Functions (Backend)
- Auto-scaling enabled

**CDN:**
- CloudFlare (global CDN)
- Image optimization
- Cache management

---

## Data Architecture

### Firestore Collections

```
firestore/
├── users/
│   ├── [user-id]: {
│   │   name, email, profile, preferences,
│   │   gradeLevel, interests, createdAt
│   }
├── quizzes/
│   ├── [quiz-id]: {
│   │   title, description, type, difficulty,
│   │   questions, levelVariants, metadata
│   }
├── puzzles/
│   ├── [puzzle-id]: {
│   │   title, type, category, difficulty,
│   │   puzzle, solution, hints
│   }
├── activities/
│   ├── [activity-id]: {
│   │   title, type, data, leaderboards
│   }
├── userProgress/
│   ├── [user-id]/[content-id]: {
│   │   progress, score, time, completed
│   }
├── assignments/
│   ├── [assignment-id]: {
│   │   content, class, dueDate, status
│   }
├── leaderboards/
│   ├── [content-id]/[difficulty]: [
│   │   { userId, score, time, date }
│   ]
└── classes/
    ├── [class-id]: {
        name, teacher, students, assignments
    }
```

### Document Structure Example

**Quiz Document:**
```json
{
  "id": "quiz-001",
  "title": "Photosynthesis Quiz",
  "type": "MCQ",
  "difficulty": "Medium",
  "levelVariants": {
    "Easy": { "questions": [...] },
    "Medium": { "questions": [...] },
    "Hard": { "questions": [...] },
    "Expert": { "questions": [...] }
  },
  "metadata": {
    "subject": "Biology",
    "gradeLevel": "6-8",
    "avgTime": "10-15 min",
    "rating": 4.5,
    "playCount": 234
  },
  "createdBy": "user-123",
  "createdAt": "2024-01-10T10:00:00Z"
}
```

---

## Frontend Architecture

### Component Structure

```
src/
├── pages/
│   ├── HomePage
│   ├── BrowsePage
│   ├── QuizPage
│   ├── PuzzlePage
│   ├── ActivityPage
│   └── DashboardPage
├── components/
│   ├── common/
│   │   ├── Navigation
│   │   ├── Header
│   │   ├── Footer
│   │   └── Modal
│   ├── content/
│   │   ├── QuizCard
│   │   ├── PuzzleCard
│   │   ├── ActivityCard
│   │   └── ContentList
│   ├── quiz/
│   │   ├── QuizPlayer
│   │   ├── QuestionDisplay
│   │   ├── AnswerOptions
│   │   └── ResultsScreen
│   ├── puzzle/
│   │   ├── PuzzleBoard
│   │   ├── PuzzleSolver
│   │   └── HintSystem
│   └── activity/
│       ├── ActivityPlayer
│       ├── LeaderboardDisplay
│       └── AchievementBadge
├── hooks/
│   ├── useQuiz
│   ├── usePuzzle
│   ├── useUser
│   └── useProgress
├── services/
│   ├── firebaseService
│   ├── authService
│   ├── contentService
│   └── analyticsService
├── store/
│   ├── userStore
│   ├── contentStore
│   └── progressStore
├── styles/
│   ├── variables.css
│   ├── global.css
│   └── components/
└── utils/
    ├── validators
    ├── formatters
    └── helpers
```

### State Management

```
Redux Store Structure:
├── auth
│   ├── user
│   ├── isAuthenticated
│   └── token
├── content
│   ├── quizzes
│   ├── puzzles
│   └── activities
├── progress
│   ├── currentContent
│   ├── answers
│   └── score
├── ui
│   ├── theme
│   ├── sidebarOpen
│   └── notifications
└── leaderboards
    ├── currentLeaderboard
    └── userRank
```

---

## Backend Architecture

### Cloud Functions

**Trigger-based Functions:**

```
onUserCreated()
  ├─ Create user profile
  ├─ Set up preferences
  └─ Initialize progress document

onQuizSubmitted()
  ├─ Calculate score
  ├─ Update user progress
  ├─ Update leaderboards
  ├─ Trigger notifications
  └─ Log analytics

onAssignmentCreated()
  ├─ Validate assignment
  ├─ Notify students
  ├─ Add to user's queue
  └─ Log creation event
```

**API Endpoints (via Cloud Functions):**

```
GET /api/quizzes
GET /api/quizzes/:id
POST /api/quizzes/:id/submit
GET /api/user/progress
GET /api/leaderboards/:contentId/:difficulty
POST /api/assignments
GET /api/assignments/:classId
```

---

## Security Architecture

### Authentication Flow

```
Login Page
    ↓
[Email/Password] → Firebase Auth
    ↓
Auth Service
    ├─ Verify credentials
    ├─ Generate JWT token
    └─ Store locally
    ↓
Protected Routes
    ├─ Check token validity
    ├─ Verify expiration
    └─ Allow/deny access
```

### Database Security

**Firestore Rules:**
```
rule: allow read/write only if user is authenticated
rule: users can only edit own data
rule: public content readable by all
rule: admin-only operations protected
rule: class assignments only visible to members
```

---

## Performance Optimization

### Caching Strategy

- **Client:** Redux store + localStorage
- **Server:** Firestore caching
- **CDN:** CloudFlare edge caching
- **Images:** Cloudinary with optimization

### Code Splitting

```
Route-based:
├── /home → homePage chunk
├── /quiz/:id → quizPage chunk
├── /puzzle/:id → puzzlePage chunk
└── /admin → adminPanel chunk (lazy-loaded)

Lazy-loaded:
├── Heavy libraries (only on demand)
├── Analysis charts
└── Advanced features
```

### Network Optimization

- Minimal bundle size (tree-shaking)
- Gzip compression
- Image optimization (WebP)
- API response caching
- Lazy loading for below-fold content

---

## Scalability Considerations

### Database Scaling

- Firestore auto-scales
- Collection sharding for hot data (leaderboards)
- Index optimization
- Query optimization

### Function Scaling

- Cloud Functions auto-scale
- Concurrent execution limits managed
- Cold start optimization
- Regional deployment options

### Frontend Scaling

- Static site generation (if applicable)
- Service workers for offline support
- Progressive Web App features
- Vertical/horizontal scaling of API

---

## Monitoring & Analytics

### Application Monitoring

- Sentry (error tracking)
- Google Analytics (user behavior)
- Firebase Analytics
- Custom event logging

### Performance Monitoring

- Lighthouse CI
- Web Vitals monitoring
- API response time tracking
- Database query performance

### User Analytics

- Quiz completion rates
- Average scores per content
- Time-to-complete tracking
- User engagement metrics

---

## Development Workflow

### Version Control

- Git (GitHub)
- Main branch (production)
- Develop branch (staging)
- Feature branches (development)

### Deployment Pipeline

```
Feature Branch
    ↓
[Push to GitHub] → [Automated Tests]
    ↓
[Code Review] → [Merge to Develop]
    ↓
[Deploy to Staging] → [Manual Testing]
    ↓
[Merge to Main] → [Auto Deploy to Production]
    ↓
[Monitor & Alert]
```

### Testing Strategy

- Unit tests (Jest)
- Integration tests
- E2E tests (Cypress)
- Performance testing
- Accessibility testing

---

## Disaster Recovery

### Backup Strategy

- Daily Firestore backups
- Cloud Storage for user data
- Code repository (GitHub)
- Version history maintained

### Recovery Plan

- RPO (Recovery Point Objective): 24 hours
- RTO (Recovery Time Objective): 4 hours
- Regular backup testing
- Documented recovery procedures

---

**Next:** [Frontend Stack](frontend) or [Future Features](../future/advanced-puzzles)
