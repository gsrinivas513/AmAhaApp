# 🚀 AmAha Engagement Features - Complete Implementation Plan

**Status**: IN PROGRESS  
**Project**: AmAha Platform Enhancements  
**Date**: December 2025

---

## 📋 OVERVIEW

Implementing 5 major engagement features to increase daily active users (DAU) and learning hours:

1. **Daily & Habit Features** - Daily challenges, streak tracking, XP/coins
2. **Mini-Games** - Timed mode, speed mode, practice mode, memory mode
3. **Leaderboards** - Daily/weekly/all-time rankings
4. **Learning Modes** - Learn/Practice/Challenge modes for both quizzes & puzzles
5. **Story-Based Learning** - Story → Chapters → Quiz/Puzzle progression

---

## 🏗️ FIRESTORE SCHEMA ADDITIONS

### Collections to Add/Modify

#### 1. `daily_challenges`
```javascript
{
  id: "doc_id",
  date: "2025-12-25",  // ISO date
  type: "quiz" | "puzzle",  // What's being challenged
  contentId: "quiz_or_puzzle_id",
  contentTitle: "Today's Challenge",
  description: "Solve this puzzle for 50 coins!",
  xpReward: 50,
  coinReward: 50,
  difficulty: "medium",
  startTime: timestamp,
  endTime: timestamp,  // Optional: challenge window
  category: "Math",
  imageUrl: "cloudinary_url",
  status: "active" | "completed" | "archived",
  createdAt: timestamp,
  updatedAt: timestamp,
  adminConfigured: true
}
```

#### 2. `user_streaks` (subcollection of users)
```javascript
// Path: users/{uid}/user_streaks/{streakId}
{
  currentStreak: 5,  // Days in current streak
  longestStreak: 12,  // Historical max
  lastCompletionDate: "2025-12-25",
  completionDates: ["2025-12-21", "2025-12-22", ...],  // Last 90 days
  totalCompletions: 47,
  streakType: "daily_challenge" | "daily_puzzle" | "all",
  earnedRewards: [
    { milestone: 7, type: "badge", icon: "🔥7-Day", xp: 100 },
    { milestone: 30, type: "badge", icon: "🔥30-Day", xp: 500 }
  ],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 3. `leaderboards`
```javascript
{
  id: "leaderboard_id",
  period: "daily" | "weekly" | "all_time",
  date: "2025-12-25",  // For daily/weekly
  category: "Math" | "Science" | "Global",
  scoreType: "xp" | "coins" | "puzzles_completed",
  entries: [
    {
      rank: 1,
      userId: "uid",
      displayName: "Alex",
      avatarUrl: "url",
      score: 5000,
      puzzlesCompleted: 25,
      xpGained: 5000,
      lastUpdated: timestamp,
      badge: "🏆 Top Player"
    }
    // ... up to 100 entries
  ],
  totalPlayers: 1250,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 4. `guest_leaderboards`
```javascript
{
  id: "guest_leaderboard_id",
  sessionId: "temp_session_id",
  period: "daily" | "weekly",
  date: "2025-12-25",
  category: "Global",
  displayName: "Guest_${sessionId.slice(0,4)}",
  score: 1500,
  puzzlesCompleted: 10,
  xpGained: 1500,
  expiresAt: timestamp (7 days)
}
```

#### 5. `game_modes`
```javascript
{
  id: "game_mode_id",
  type: "timed" | "speed" | "practice" | "memory",
  contentId: "quiz_or_puzzle_id",
  contentType: "quiz" | "puzzle",
  
  // Mode-specific settings
  timedMode: {
    timeLimit: 60,  // seconds per question
    scoreMultiplier: 1.5
  },
  speedMode: {
    timeLimit: 30,  // seconds per question
    scoreMultiplier: 2.0,
    penaltyPerSecond: 5  // XP loss
  },
  practiceMode: {
    unlimitedAttempts: true,
    hints: true,
    explanations: true,
    xpReward: 10  // Lower reward for practice
  },
  memoryMode: {
    cardsHidden: true,
    sequenceLength: 5,
    timeLimit: 120,  // overall game time
    scoreMultiplier: 1.5
  },
  
  status: "active" | "archived",
  createdAt: timestamp
}
```

#### 6. `quiz_progress` (subcollection of users)
```javascript
// Path: users/{uid}/quiz_progress/{quizId}
{
  quizId: "quiz_id",
  attempts: 5,
  completions: 3,
  bestScore: 95,
  averageScore: 85,
  totalXpEarned: 500,
  totalCoinsEarned: 200,
  learnMode: { completed: true, timestamp },
  practiceMode: { attempts: 3, bestScore: 80, timestamp },
  challengeMode: { attempts: 2, score: 95, timestamp },
  lastAttempted: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 7. `puzzle_progress` (enhancement to existing)
```javascript
// Path: users/{uid}/puzzle_progress/{puzzleId}
{
  puzzleId: "puzzle_id",
  attempts: 3,
  completions: 2,
  bestScore: 100,
  averageScore: 90,
  totalXpEarned: 30,
  totalCoinsEarned: 15,
  learnMode: { completed: true, timestamp, hintsUsed: 2 },
  practiceMode: { attempts: 5, timestamp },
  challengeMode: { attempts: 1, score: 100, timestamp },
  lastAttempted: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 8. `stories`
```javascript
{
  id: "story_id",
  title: "The Math Adventure",
  description: "Learn math through a magical journey",
  imageUrl: "cloudinary_url",
  backgroundColor: "#6C63FF",  // Brand purple
  category: "Math",
  targetAgeGroup: "6-8",
  totalChapters: 5,
  difficulty: "easy",
  isPublished: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 9. `story_chapters` (subcollection)
```javascript
// Path: stories/{storyId}/chapters/{chapterId}
{
  id: "chapter_id",
  storyId: "story_id",
  chapterNumber: 1,
  title: "Chapter 1: The Beginning",
  narrative: "Once upon a time...",
  imageUrl: "cloudinary_url",
  contentId: "quiz_or_puzzle_id",  // The quiz/puzzle in this chapter
  contentType: "quiz" | "puzzle",
  requiredScore: 70,  // Must score 70+ to unlock next
  xpReward: 100,
  coinReward: 50,
  unlocksNext: true,
  position: { top: 10, left: 20 },  // For visual story map
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 10. `user_stories` (subcollection of users)
```javascript
// Path: users/{uid}/user_stories/{storyId}
{
  storyId: "story_id",
  startedAt: timestamp,
  completedAt: timestamp,  // null if in progress
  currentChapter: 3,  // Which chapter they're on
  completedChapters: [1, 2],  // Chapters they've beaten
  totalXpEarned: 300,
  totalCoinsEarned: 150,
  certificateEarned: true,
  certificateUrl: "cloudinary_url",
  progress: 60,  // percentage
  lastAccessedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 📂 FOLDER STRUCTURE

```
src/
├── services/
│   ├── dailyChallengeService.js       ← Daily challenge logic
│   ├── leaderboardService.js          ← Leaderboard CRUD & queries
│   ├── streakService.js               ← Streak tracking
│   ├── gameModeService.js             ← Game mode logic (NEW)
│   ├── storyService.js                ← Story system CRUD
│   └── storyProgressService.js        ← User story progress
│
├── components/
│   ├── daily-challenge/
│   │   ├── DailyChallengeCard.jsx      ← Home page widget
│   │   ├── DailyChallengeModal.jsx     ← Play challenge
│   │   ├── DailyChallengeReward.jsx    ← Completion screen
│   │   └── StreakDisplay.jsx           ← Streak counter
│   │
│   ├── leaderboard/
│   │   ├── LeaderboardTabs.jsx         ← Daily/Weekly/All-time
│   │   ├── LeaderboardRow.jsx          ← Single entry
│   │   ├── LeaderboardCategory.jsx     ← Category filter
│   │   ├── UserRankCard.jsx            ← "You are #X"
│   │   └── GuestLeaderboardNotice.jsx  ← "Sign up to keep rank"
│   │
│   ├── game-modes/
│   │   ├── TimedModeWrapper.jsx        ← Timer + countdown
│   │   ├── SpeedModeWrapper.jsx        ← Penalty system
│   │   ├── PracticeModeWrapper.jsx     ← Unlimited + hints
│   │   ├── MemoryModeWrapper.jsx       ← Card matching
│   │   └── ModeSelector.jsx            ← Pick a mode
│   │
│   ├── learning-modes/
│   │   ├── LearnModeScreen.jsx         ← Explanations
│   │   ├── PracticeModeScreen.jsx      ← Retry unlimited
│   │   ├── ChallengeModeScreen.jsx     ← Scored attempt
│   │   └── ModeProgressBar.jsx         ← Learn→Practice→Challenge
│   │
│   └── story/
│       ├── StoryCard.jsx               ← Story browse
│       ├── StoryMapViewer.jsx          ← Visual chapter progression
│       ├── StoryChapterPlay.jsx        ← Play chapter content
│       ├── ChapterRewards.jsx          ← XP + coins on unlock
│       ├── CertificatePreview.jsx      ← Story completion cert
│       └── StoryProgressIndicator.jsx  ← Chapter progress
│
├── pages/
│   ├── DailyChallengePage.jsx          ← Dedicated daily challenge page
│   ├── LeaderboardPage.jsx             ← Leaderboard page
│   ├── StoriesPage.jsx                 ← Browse all stories
│   ├── StoryDetailPage.jsx             ← Story overview
│   ├── StoryChapterPage.jsx            ← Play chapter
│   └── GameModeSelectorPage.jsx        ← Pick game mode
│
├── admin/
│   ├── DailyChallengeAdmin.jsx         ← Configure daily challenges
│   ├── StoryAdmin.jsx                  ← Manage stories
│   ├── StoryChapterEditor.jsx          ← Edit chapters
│   ├── GameModeAdmin.jsx               ← Configure game modes
│   └── LeaderboardManagement.jsx       ← Leaderboard settings
│
├── hooks/
│   ├── useDailyChallenge.js            ← Daily challenge state
│   ├── useLeaderboard.js               ← Leaderboard queries
│   ├── useStreak.js                    ← Streak tracking
│   ├── useGameMode.js                  ← Game mode settings
│   └── useStoryProgress.js             ← Story state
│
└── constants/
    ├── gameModeConstants.js            ← Game mode configs
    ├── dailyChallengeConstants.js      ← Daily challenge defaults
    ├── streakMilestones.js             ← Streak rewards
    └── storyConstants.js               ← Story defaults
```

---

## 🔄 DATA FLOW DIAGRAMS

### Daily Challenge Flow
```
Home Page
  ↓
[DailyChallengeCard] (shows today's challenge)
  ↓ (click "Start")
[DailyChallengeModal] (loads quiz/puzzle)
  ↓ (plays content)
[Quiz/Puzzle Component] (with game mode wrapper)
  ↓ (completes)
[DailyChallengeReward] (shows XP + coins + streak)
  ↓ (stores in Firestore)
user_streaks + quiz/puzzle_progress
```

### Leaderboard Flow
```
Navigation → LeaderboardPage
  ↓
[LeaderboardTabs] (Daily/Weekly/All-time)
  ↓ (filter by category)
[LeaderboardCategory] (Global/Math/Science)
  ↓
[LeaderboardRows] (top 100 players)
  ↓
[UserRankCard] (shows "You are #5")
  ↓
Guest users see notice to sign up
```

### Game Mode Flow
```
Start Quiz/Puzzle
  ↓
[ModeSelector] (Learn/Practice/Challenge)
  ↓ (select Challenge)
[GameModeSelector] (Timed/Speed/Practice/Memory)
  ↓ (select Timed)
[TimedModeWrapper] (wraps content)
  ↓ (plays with timer)
Quiz/Puzzle Component
  ↓ (with timer overlay)
[Result Screen] (score + XP + coins)
  ↓
Update game_modes + quiz/puzzle_progress
```

### Story Flow
```
StoriesPage (browse all)
  ↓
[StoryCard] (click story)
  ↓
StoryDetailPage (overview)
  ↓ (click "Start")
[StoryMapViewer] (visual chapter progression)
  ↓ (click chapter 1)
StoryChapterPage
  ↓
[StoryChapterPlay] (loads quiz/puzzle)
  ↓ (plays content)
[ChapterRewards] (unlocks next if score >= 70)
  ↓
user_stories progress updated
  ↓ (final chapter)
[CertificatePreview] (generate certificate)
```

---

## 🎨 DESIGN PRINCIPLES

### Colors (Strict)
- Primary: `#6C63FF` (Purple)
- Accent: `#FFD166` (Yellow)
- Mascot Pink: `#FF8FAB`
- Success: `#06D6A0`
- Background: `#F9FAFB`

### Components (Reusable)
- **Card**: Rounded 2xl corners, soft shadow, hover scale
- **Button**: Gradient on hover, emoji icons, rounded full
- **Badge**: Rounded full, small font, primary color
- **Modal**: Centered, overlay, smooth fade-in

### Typography
- **Headings**: Poppins (bold), 2xl-3xl
- **Body**: Inter (regular), base-lg
- **Small**: Inter (medium), sm-xs

---

## 📊 IMPLEMENTATION PHASES

### Phase 1: Foundation (Week 1)
- [ ] Create Firestore schema
- [ ] Implement daily challenge service
- [ ] Implement streak service
- [ ] Create constants & types
- [ ] Build base components

### Phase 2: Daily Challenges (Week 1-2)
- [ ] DailyChallengeCard component
- [ ] DailyChallengeModal
- [ ] Daily challenge workflow
- [ ] Streak tracking UI
- [ ] Admin panel for daily challenges

### Phase 3: Leaderboards (Week 2)
- [ ] Leaderboard service
- [ ] LeaderboardPage component
- [ ] Category filtering
- [ ] Guest leaderboard
- [ ] Real-time updates (batched)

### Phase 4: Game Modes (Week 2-3)
- [ ] Game mode service
- [ ] Timed mode wrapper
- [ ] Speed mode wrapper
- [ ] Practice mode wrapper
- [ ] Memory mode wrapper
- [ ] Mode selector UI

### Phase 5: Learning Modes (Week 3)
- [ ] Learning mode service enhancements
- [ ] Learn/Practice/Challenge flow
- [ ] Explanations system
- [ ] Progress tracking

### Phase 6: Stories (Week 3-4)
- [ ] Story service CRUD
- [ ] Story progress service
- [ ] StoryMapViewer component
- [ ] StoryChapterPlay component
- [ ] Certificate generation
- [ ] Admin panel for stories

### Phase 7: Integration & Polish (Week 4)
- [ ] Connect all features
- [ ] Performance optimization
- [ ] Admin panel completion
- [ ] QA & testing
- [ ] Documentation

---

## 🛠️ SERVICE ARCHITECTURE

### dailyChallengeService.js
```javascript
// Public API:
getDailyChallenge(date) // Get today's challenge
submitDailyChallenge(userId, result) // Log completion
getStreak(userId) // Get user's streak
configureDailyChallenge(challenge) // Admin: set challenge
```

### leaderboardService.js
```javascript
// Public API:
getLeaderboard(period, category) // Daily/Weekly/All-time
getUserRank(userId, period) // User's rank
getTopPlayers(count) // Top N
updateLeaderboardEntry(userId, score) // Batched write
getGuestRank(sessionId) // Guest rank
```

### streakService.js
```javascript
// Public API:
getCurrentStreak(userId) // Current streak number
getLongestStreak(userId) // Historical max
recordDailyCompletion(userId) // Mark today done
getMilestoneRewards(streakNumber) // Badges at 7, 14, 30, etc
```

### gameModeService.js
```javascript
// Public API:
getAvailableModes(contentType) // Timed/Speed/Practice/Memory
applyModeRules(content, mode) // Adjust timer, multiplier
calculateModeScore(baseScore, mode) // Apply multiplier
```

### storyService.js
```javascript
// Public API:
getStories() // All stories
getStoryDetails(storyId) // Single story
getChapters(storyId) // Chapters in story
getChapterContent(chapterId) // Quiz/puzzle in chapter
createStory(storyData) // Admin
updateStory(storyId, updates) // Admin
```

### storyProgressService.js
```javascript
// Public API:
getUserStoryProgress(userId, storyId) // Current progress
getCompletedChapters(userId, storyId) // Which chapters done
recordChapterCompletion(userId, chapterId, score) // Mark done
unlockNextChapter(userId, chapterId) // If score >= required
generateCertificate(userId, storyId) // Certificate URL
```

---

## ✅ SUCCESS CRITERIA

### Daily Challenges
- ✓ Users see challenge on Home page
- ✓ Completion tracked & rewarded
- ✓ Streak visible in UI
- ✓ Streak milestones trigger badges
- ✓ Admin can set daily challenge

### Leaderboards
- ✓ Rankings update in real-time (batched)
- ✓ Users can see their rank
- ✓ Category filtering works
- ✓ Guest leaderboard shows temporary rank
- ✓ Daily/Weekly/All-time periods update correctly

### Game Modes
- ✓ Timed mode has countdown
- ✓ Speed mode penalizes slow answers
- ✓ Practice mode allows unlimited attempts
- ✓ Memory mode shuffles cards
- ✓ Score multipliers apply correctly

### Learning Modes
- ✓ Learn mode shows explanations
- ✓ Practice mode has unlimited attempts
- ✓ Challenge mode scores and rewards
- ✓ Progress bar shows Learn→Practice→Challenge
- ✓ Unlocks track across both quizzes & puzzles

### Stories
- ✓ Users can browse stories
- ✓ Story map shows chapters visually
- ✓ Chapters unlock on score >= required
- ✓ Completion rewards XP + coins
- ✓ Certificate generated on completion
- ✓ Admin can create/edit stories

---

## 🚀 LAUNCH CHECKLIST

- [ ] Firestore collections created
- [ ] All services implemented
- [ ] All components created
- [ ] All pages created
- [ ] Admin panel complete
- [ ] Build passes (zero errors)
- [ ] All links working
- [ ] Mobile responsive tested
- [ ] Guest flow tested
- [ ] User flow tested
- [ ] Admin flow tested
- [ ] Documentation complete
- [ ] Git committed & pushed

---

## 📝 NOTES

- **Zero breaking changes**: All new features layer on existing quiz/puzzle engines
- **Reuse architecture**: Leverage existing progressService, guestProgressService
- **Mobile-first**: All components responsive on 320px+
- **Kid-friendly**: Simple UX, large tap targets, encouraging messages
- **Performance**: Batch Firestore writes, cache leaderboards, lazy load stories
- **Backward compatibility**: Existing quiz/puzzle flows unaffected

---

**Next Step**: BEGIN IMPLEMENTATION (Phase 1)
