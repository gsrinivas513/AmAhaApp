# 🏗️ AmAhaApp - Feature Extension Architecture Plan

**Senior Full-Stack Architecture Document**  
**Status:** Design & Implementation Phase  
**Date:** December 24, 2025

---

## 📋 Executive Summary

This document outlines the systematic extension of AmAhaApp to support:
1. Daily Challenge & Habits
2. Mini-Games (Timed, Memory, Speed modes)
3. Leaderboards (Daily, Weekly, Category-wise)
4. Learning Modes (Learn, Practice, Challenge)
5. Creative Visual Puzzles (Kids-first)
6. Story-Based Learning

**Core Principle:** Zero breaking changes, maximum code reuse, progressive enhancement.

---

## 🗂️ Current Architecture Assessment

### Strengths to Leverage:
```
✅ Modular service pattern (progressService, guestProgressService)
✅ Clear quiz/puzzle separation
✅ Guest + User dual-path progress
✅ Firestore-first design
✅ Admin panel extensibility
✅ Responsive UI foundation
```

### Existing Services We'll Extend:
```
src/quiz/services/
├─ progressService.js (User progress - will extend)
├─ guestProgressService.js (Guest progress - will extend)
├─ levelProgressService.js (Level tracking - reuse)
├─ levelUnlockService.js (Unlock logic - reuse)
└─ rewardGuard.js (Reward system - extend)
```

---

## 🎯 Phase-by-Phase Implementation

### PHASE 1: Core Infrastructure (Days 1-2)
```
├─ Firestore schema design
├─ Service layer foundation
│  ├─ dailyChallengeService
│  ├─ leaderboardService
│  ├─ storyService
│  └─ gameModeService
└─ Type definitions / Constants
```

### PHASE 2: Daily Challenge & Habits (Days 3-4)
```
├─ Backend logic
├─ UI Components
├─ Admin panel
└─ Integration tests
```

### PHASE 3: Mini-Games & Modes (Days 5-7)
```
├─ Game mode engine
├─ Mode-specific UI
├─ Scoring system
└─ Leaderboard integration
```

### PHASE 4: Leaderboards (Days 8-9)
```
├─ Leaderboard service
├─ Real-time updates
├─ Admin dashboard
└─ Performance optimization
```

### PHASE 5: Creative Puzzles & Stories (Days 10-12)
```
├─ New puzzle types
├─ Story system
├─ Unlock logic
└─ Story UI
```

### PHASE 6: Polish & Optimization (Days 13-14)
```
├─ Performance tuning
├─ Mobile optimization
├─ Analytics
└─ Documentation
```

---

## 🏢 Proposed Folder Structure

```
src/
├─ services/
│  ├─ dailyChallengeService.js         [NEW]
│  ├─ leaderboardService.js            [NEW]
│  ├─ storyService.js                  [NEW]
│  ├─ gameModeService.js               [NEW]
│  └─ socialMedia/
│
├─ quiz/
│  ├─ services/
│  │  ├─ progressService.js            [EXTEND]
│  │  ├─ guestProgressService.js       [EXTEND]
│  │  └─ gameModeService.js            [NEW - quiz modes]
│  ├─ components/
│  │  ├─ DailyChallenge.jsx            [NEW]
│  │  ├─ GameModeSelector.jsx          [NEW]
│  │  ├─ LeaderboardCard.jsx           [NEW]
│  │  └─ StreakBadge.jsx               [NEW]
│  └─ hooks/
│     └─ useDailyChallenge.js          [NEW]
│
├─ puzzles/
│  ├─ types/
│  │  ├─ DrawLinepuzzle.jsx            [NEW]
│  │  ├─ DragImagePuzzle.jsx           [NEW]
│  │  ├─ SpotDifferencePuzzle.jsx      [NEW]
│  │  ├─ MatchingPairPuzzle.jsx        [NEW]
│  │  └─ OrderingPuzzle.jsx            [EXTEND]
│  └─ services/
│     └─ gameModeService.js            [NEW - puzzle modes]
│
├─ pages/
│  ├─ DailyChallengeResultPage.jsx     [NEW]
│  ├─ LeaderboardPage.jsx              [EXTEND]
│  ├─ StoryMapPage.jsx                 [NEW]
│  └─ StoryChapterPage.jsx             [NEW]
│
├─ admin/
│  ├─ DailyChallengeManager.jsx        [NEW]
│  ├─ LeaderboardAdmin.jsx             [NEW]
│  ├─ StoryEditor.jsx                  [NEW]
│  ├─ PuzzleTypeSelector.jsx           [NEW]
│  └─ GameModeConfig.jsx               [NEW]
│
├─ components/
│  ├─ DailyChallenge/
│  │  ├─ DailyChallengeCard.jsx        [NEW]
│  │  ├─ CompletionBadge.jsx           [NEW]
│  │  └─ StreakDisplay.jsx             [NEW]
│  └─ Leaderboard/
│     ├─ LeaderboardTable.jsx          [NEW]
│     ├─ UserRankCard.jsx              [NEW]
│     └─ LeaderboardFilter.jsx         [NEW]
│
└─ constants/
   ├─ gameModes.js                     [NEW]
   ├─ puzzleTypes.js                   [NEW]
   └─ dailyChallengeConfig.js          [NEW]
```

---

## 🗄️ Firestore Schema Design

### Collections Overview:

```javascript
// 1. DAILY CHALLENGE
/daily_challenges/{dateISO}
  {
    id: "2025-12-24",
    quizId: "quiz_123",
    puzzleId: null,
    type: "quiz", // "quiz" or "puzzle"
    difficulty: "medium",
    xpReward: 50,
    coinsReward: 10,
    active: true,
    createdAt: timestamp,
    completionCount: 1250
  }

// 2. DAILY CHALLENGE PROGRESS
/daily_progress/{userId}/challenges/{dateISO}
  {
    userId: "user123",
    dateISO: "2025-12-24",
    completed: true,
    completedAt: timestamp,
    score: 85,
    xpEarned: 50,
    coinsEarned: 10,
    attempts: 2
  }

// GUEST: localStorage
  {
    "daily_challenge_2025-12-24": {
      completed: true,
      completedAt: timestamp,
      score: 85
    }
  }

// 3. LEADERBOARD SCORES
/leaderboards/{period}/{categoryId}/users/{userId}
  {
    userId: "user123",
    displayName: "John",
    score: 1250,
    gamesPlayed: 45,
    gamesWon: 12,
    accuracy: 87.5,
    timestamp: timestamp,
    streak: 5
  }

// GUEST LEADERBOARD (Real-time, temporary)
/leaderboards/daily/global/guests/{guestId}
  {
    guestId: "guest_abc123",
    nickname: "QuizMaster99",
    score: 850,
    timestamp: timestamp
  }

// 4. STREAKS
/streaks/{userId}
  {
    userId: "user123",
    currentStreak: 5,
    longestStreak: 12,
    lastCompletedDate: "2025-12-24",
    totalCompletions: 45,
    lastResetDate: "2025-12-19"
  }

// GUEST: localStorage
  {
    "daily_streak_user123": {
      currentStreak: 5,
      longestStreak: 12,
      lastCompletedDate: "2025-12-24"
    }
  }

// 5. STORIES & CHAPTERS
/stories/{storyId}
  {
    id: "story_123",
    title: "Leo's Adventure",
    description: "Help Leo explore...",
    targetAudience: "kids", // "kids" or "general" or "programmers"
    coverImage: "url",
    chapterCount: 8,
    createdAt: timestamp,
    published: true
  }

/stories/{storyId}/chapters/{chapterId}
  {
    id: "chapter_1",
    storyId: "story_123",
    title: "Chapter 1: The Beginning",
    description: "...",
    order: 1,
    quizIds: ["quiz_1", "quiz_2", "quiz_3"],
    puzzleIds: ["puzzle_1", "puzzle_2"],
    requiredScore: 70, // % to unlock next
    character: "Leo",
    characterImage: "url",
    unlocked: false
  }

// 6. STORY PROGRESS
/story_progress/{userId}
  {
    userId: "user123",
    storyId: "story_123",
    completedChapters: [1, 2],
    currentChapter: 3,
    totalXpEarned: 450,
    lastPlayed: timestamp
  }

// GUEST: localStorage
  {
    "story_progress_story_123": {
      completedChapters: [1, 2],
      currentChapter: 3
    }
  }

// 7. GAME MODES (Meta - describes available modes)
/game_modes/{modeId}
  {
    id: "timed",
    name: "Timed Mode",
    description: "Answer as fast as you can!",
    icon: "⏱️",
    timeLimit: 30000, // milliseconds
    scoringFormula: "baseScore * (timeRemaining / totalTime)",
    enabled: true,
    audience: ["kids", "general", "programmers"]
  }

// 8. GAME SESSION (Track active game)
/game_sessions/{sessionId}
  {
    sessionId: "session_abc123",
    userId: "user123" | null, // null for guest
    mode: "timed", // "timed", "memory", "speed", "practice"
    contentType: "quiz", // "quiz" or "puzzle"
    contentId: "quiz_123",
    startTime: timestamp,
    endTime: null, // null if in progress
    currentQuestion: 0,
    answers: {
      "q1": "A",
      "q2": "B"
    },
    score: 0,
    completed: false,
    accuracy: 0
  }
```

---

## 🔧 Service Layer Architecture

### 1. dailyChallengeService.js
```javascript
// RESPONSIBILITIES:
// - Fetch today's challenge
// - Track completion
// - Manage streaks
// - Calculate rewards
// - Support guest + user

export async function getTodayChallenge()
export async function markChallengeComplete(userId, score, mode)
export async function getUserStreak(userId)
export async function getGuestStreak(guestId)
export async function resetUserStreak(userId)
export async function canCompleteTodaysChallenge(userId)
```

### 2. leaderboardService.js
```javascript
// RESPONSIBILITIES:
// - Fetch leaderboards
// - Update scores
// - Rank calculation
// - Real-time updates
// - Category-specific boards

export async function getLeaderboard(period, categoryId)
export async function updateLeaderboardScore(userId, categoryId, score)
export async function getUserRank(userId, categoryId, period)
export async function getTopPlayers(categoryId, limit = 10)
export async function resetLeaderboard(period, categoryId) // admin only
```

### 3. storyService.js
```javascript
// RESPONSIBILITIES:
// - Story CRUD
// - Chapter management
// - Unlock logic
// - Progress tracking

export async function getStory(storyId)
export async function getChapters(storyId)
export async function getStoryProgress(userId, storyId)
export async function unlockNextChapter(userId, storyId)
export async function updateChapterProgress(userId, storyId, chapterId)
```

### 4. gameModeService.js
```javascript
// RESPONSIBILITIES:
// - Mode detection
// - Mode-specific scoring
// - Time tracking
// - Difficulty multipliers

export function getGameModeRules(mode)
export function calculateScore(baseScore, mode, metadata)
export function getTimeLimit(mode, difficulty)
export function shouldEndGame(mode, state)
```

---

## 🔌 Integration Points

### Existing Services (Extend, Don't Replace):
```javascript
// progressService.js - ADD
export async function saveDailyChallenge(userId, challenge, score)
export async function getDailyChallengeHistory(userId)

// guestProgressService.js - ADD
export function saveDailyChallenge(challenge, score)
export function getDailyStreak()
export function hasCompletedToday()
```

### Reuse Quiz Engine:
```javascript
// quiz/services/gameModeService.js - NEW
// Uses existing QuizPage component + scoring logic
// Adds mode-specific wrappers

const modeConfigs = {
  timed: { timeLimit: 30s, showTimer: true },
  practice: { timeLimit: null, showHints: true },
  speed: { timeLimit: 20s, oneStrike: true }
}
```

---

## 🎨 UI Component Strategy

### Reuse Pattern:
```
✅ DailyChallenge.jsx (NEW wrapper)
   └─> Uses existing QuizPage.jsx component
       Just passes mode="daily" prop

✅ LeaderboardCard.jsx (NEW display)
   └─> Reads from leaderboardService
       Displays ranking data

✅ StoryChapterPage.jsx (NEW navigation)
   └─> Uses existing puzzle/quiz engines
       Adds story wrapper + unlock logic
```

### Component Hierarchy:
```
HomePage
├─ DailyChallengeCard
│  └─ onClick -> DailyChallenge page
├─ LeaderboardPreview
│  └─ Top 3 players
└─ Stories (if enabled)
   └─ Story cards

DailyChallenge Page
├─ QuizPage | PuzzlePage (reused)
└─ StreakBadge

LeaderboardPage
├─ LeaderboardFilter (period, category)
└─ LeaderboardTable
   └─ UserRankCard (each row)

StoryMapPage
├─ StoryHeader
└─ ChapterGrid
   └─ ChapterCard
      └─ onClick -> Story/Chapter content
```

---

## 📊 Data Flow Example: Daily Challenge

```
1. User visits Home
   ↓
2. HomePage calls useDailyChallenge()
   ├─ getTodayChallenge()
   │  └─ Fetch /daily_challenges/{today}
   ├─ Check hasCompletedToday(user)
   │  └─ Query /daily_progress/{userId}/{today}
   └─ getStreak(user)
      └─ Query /streaks/{userId}
   ↓
3. Display DailyChallengeCard
   ├─ If not completed: "Today's Challenge"
   └─ If completed: "✅ Complete! +50 XP"
   ↓
4. User clicks "Play Challenge"
   ↓
5. Load DailyChallenge page
   ├─ QuizPage (with mode="daily")
   └─ Track answers
   ↓
6. Quiz complete
   ↓
7. Calculate score
   └─ gameModeService.calculateScore()
   ↓
8. Mark as complete
   ├─ dailyChallengeService.markChallengeComplete()
   ├─ Update /daily_progress/{userId}/{today}
   ├─ Update /streaks/{userId}
   ├─ Update leaderboard
   └─ Award XP + coins
   ↓
9. Show results + streak badge + next challenge preview
```

---

## 🔐 Guest vs User Handling

### Principle:
```
Guest (localStorage)          →    User (Firestore)
─────────────────────────────────────────────────
daily_challenge              daily_progress/{userId}
daily_streak                 streaks/{userId}
story_progress               story_progress/{userId}
```

### Merge Strategy (Login):
```
1. User logs in
2. Check localStorage for guest progress
3. If exists:
   ├─ Copy daily completions
   ├─ Merge streaks (take max)
   ├─ Merge story progress (take furthest)
   └─ Copy to Firestore
4. Clear localStorage
5. Show "Progress merged!" toast
```

---

## 🎮 Mini-Games Implementation Strategy

### Mode Configuration:
```javascript
const GAME_MODES = {
  timed: {
    name: "Timed Mode",
    timeLimit: 30000,
    scoringFormula: (base, time, totalTime) => 
      base * (time / totalTime),
    features: ["timer", "score", "leaderboard"]
  },
  memory: {
    name: "Memory Mode",
    questionPool: "4-pick-best", // rotate options
    scoringFormula: (base, attempts) => 
      base * Math.max(0.5, 1 - (attempts - 1) * 0.25),
    features: ["attempts", "hints_limited"]
  },
  speed: {
    name: "Speed Mode",
    timePerQuestion: 20000,
    strikeRule: "one_strike_per_question", // wrong = game over
    scoringFormula: (count, timeRemaining) => 
      count * 100 + timeRemaining / 100,
    features: ["lives", "score", "leaderboard"]
  },
  practice: {
    name: "Practice Mode",
    timeLimit: null,
    showHints: true,
    features: ["explanations", "unlimited_attempts"]
  }
};
```

### Code Reuse:
```javascript
// quiz/QuizPage.jsx (existing)
// Just add:
const modeRules = gameModeService.getGameModeRules(mode);
if (mode === 'timed') renderTimer();
if (mode === 'speed') renderLives();
if (mode === 'practice') renderHints();
```

---

## 📈 Performance & Firestore Optimization

### Indexes Needed:
```
1. daily_progress (userId, dateISO desc)
2. leaderboards (period, categoryId, score desc)
3. streaks (userId) - single doc read
4. story_progress (userId, storyId)
5. daily_challenges (active, createdAt desc)
```

### Read Optimization:
```
❌ Don't:  Query all users daily_progress
✅ Do:     Cache in-memory, update on event

❌ Don't:  Fetch entire leaderboard
✅ Do:     Paginate (first 50, then more on scroll)

❌ Don't:  Update leaderboard on every game
✅ Do:     Batch updates every 5 minutes or async
```

### Caching Strategy:
```javascript
// In-memory cache for hot data
const cache = {
  todayChallenge: null,
  leaderboards: {},
  stories: {}
};

// Cache TTL: 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

// Invalidate on mutation
```

---

## 🧪 Testing Strategy

### Unit Tests:
```
✅ dailyChallengeService (mock Firestore)
✅ leaderboardService (mock queries)
✅ storyService (mock unlocks)
✅ gameModeService (math calculations)
```

### Integration Tests:
```
✅ Guest daily challenge flow
✅ User daily challenge flow
✅ Progress merge on login
✅ Streak calculation
✅ Leaderboard updates
```

### E2E Tests:
```
✅ Complete daily challenge (guest)
✅ Complete daily challenge (user)
✅ View leaderboard
✅ Progress in story
✅ Mode variations
```

---

## 🚀 Deployment Strategy

### Phases:
```
1. Firestore schema + basic services (no UI)
2. Daily challenge (hidden feature flag)
3. Enable for 10% users (canary)
4. Leaderboards (beta)
5. Stories (beta)
6. Full rollout
```

### Feature Flags:
```javascript
// In Firestore /config/features
{
  dailyChallenge: {
    enabled: true,
    percentage: 10 // 10% of users
  },
  miniGames: {
    enabled: false
  },
  stories: {
    enabled: false
  }
}
```

---

## 📱 Mobile-First Considerations

### Responsive Design:
```
✅ Daily challenge card responsive
✅ Leaderboard scrollable on mobile
✅ Story map touch-optimized
✅ Puzzle drag/draw touch-friendly
✅ Game mode buttons large (48px+)
```

### Touch Interactions:
```
✅ Tap to play challenge (no hover)
✅ Drag/draw puzzles work on touch
✅ Swipe for leaderboard navigation
✅ Double-tap to favorite story
```

### Performance:
```
✅ Lazy load story images
✅ Paginate leaderboards
✅ Minimize re-renders
✅ Optimize animations
```

---

## 📝 Summary: Next Steps

1. **Approve schema design** ← You are here
2. Create Firestore collections
3. Implement dailyChallengeService
4. Build Daily Challenge UI
5. Add leaderboards
6. Implement stories
7. Add mini-game modes
8. Create visual puzzles
9. Polish & deploy

---

## 🎯 Success Metrics

```
✅ Zero breaking changes
✅ <2s load time for daily challenge
✅ <5s leaderboard load
✅ 80%+ feature completion on release
✅ Mobile-optimized UX
✅ Clean, documented code
✅ >90% test coverage
```

---

**Ready to implement Phase 1?**  
Approval needed on:
1. Firestore schema
2. Service architecture
3. Component structure
4. Integration approach

Let me know any questions or adjustments!
