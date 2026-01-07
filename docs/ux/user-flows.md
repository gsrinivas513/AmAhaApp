---
sidebar_position: 4
title: User Flows
---

# User Flows

This page documents common user journeys and interaction flows in AmAha.

## New User Onboarding

### First Visit Flow

```
New User Lands on AmAha
    ↓
[Welcome Screen]
"Welcome to AmAha!"
"Learn by playing quizzes, puzzles & activities"
    ↓
Choose How to Get Started:
├─ [Take a Quiz] → Demo Quiz
├─ [Solve a Puzzle] → Demo Puzzle
└─ [Create Account] → Sign Up
    ↓
If Chose Quiz:
├─ Start Demo Quiz
├─ Take 2-3 sample questions
├─ See instant feedback system
├─ View results screen
└─ → Prompted to Create Account
    ↓
Sign Up Process:
├─ Email & password
├─ Grade level / Age
├─ Interests (checkboxes)
└─ → Dashboard
```

### Account Setup

```
After Sign Up
    ↓
[Profile Setup]
├─ Profile Picture (optional)
├─ Display Name
├─ Bio (optional)
├─ Privacy Settings
└─ [Complete Setup]
    ↓
[Quick Tour]
├─ "Here's how to use AmAha"
├─ Show 3 main features:
│  ├─ Quizzes (for learning)
│  ├─ Puzzles (for thinking)
│  └─ Activities (for skills)
├─ "Ready to start?"
└─ [Yes, Start] [Later]
    ↓
Dashboard / Home Page
```

---

## Taking a Quiz

### Quiz Selection Flow

```
User on Home / Browse Page
    ↓
[Browse Quizzes]
    ↓
Option 1: Search
├─ [Search box: "Photosynthesis"]
├─ Results appear
└─ [Select Quiz]

Option 2: Browse by Subject
├─ [Biology] → [Click]
├─ Biology quizzes appear
└─ [Select Quiz]

Option 3: Recommended
├─ "Recommended for you"
├─ Cards based on interests
└─ [Select Quiz]
    ↓
[Quiz Card / Details]
├─ Title: "Photosynthesis Quiz"
├─ Description: "Learn how plants create energy"
├─ Stats:
│  ├─ Difficulty: Medium
│  ├─ Variants: Easy, Medium, Hard, Expert
│  ├─ Avg Time: 12 min
│  └─ Rating: 4.5/5
├─ "Choose Difficulty:"
│  ├─ [Easy 3 Q]
│  ├─ [Medium 5 Q] ← Recommended
│  ├─ [Hard 4 Q]
│  └─ [Expert 5 Q]
└─ [Start Quiz]
```

### Quiz Playing Flow

```
Quiz Starts (Timer begins)
    ↓
┌─────────────────────────────────────┐
│ Q3 of 5 (60%) | Photosynthesis Quiz │
│ ▓▓▓░░░░░░░░░░░░░░░░░               │
│ Time Remaining: 8 min               │
└─────────────────────────────────────┘
    ↓
[Question Display]
├─ "What is photosynthesis?"
├─ Answer Options:
│  ├─ [ ] Conversion of sunlight to energy
│  ├─ [ ] Breakdown of glucose
│  ├─ [ ] Water absorption
│  └─ [ ] Carbon dioxide release
└─ [Hint Available] [Skip]
    ↓
User Selects Answer
    ↓
Instant Feedback (<100ms)
├─ ✓ [Correct!]
│  ├─ Green highlight
│  ├─ "Great job!"
│  └─ Explanation appears
│
└─ ✗ [Not quite right]
   ├─ Red highlight
   ├─ "Let me show you why..."
   └─ Explanation + Hint offered
    ↓
[Next Question]
├─ Progress updates
├─ Score updates
└─ [Next] button active
```

### Quiz Results Flow

```
Quiz Completed
    ↓
[Results Screen]
┌──────────────────────────────┐
│ 🎉 You Did It!               │
│                              │
│ Score: 4 out of 5 ✓          │
│ ⭐⭐⭐⭐ 4/5 stars       │
│                              │
│ Time: 8 minutes 32 seconds   │
│ Personal Best? NO (prev 5/5) │
│                              │
│ Answers Review:              │
│ ✓ Question 1 (Correct)       │
│ ✓ Question 2 (Correct)       │
│ ✗ Question 3 (Incorrect)     │
│ ✓ Question 4 (Correct)       │
│ ✓ Question 5 (Correct)       │
│                              │
│ Leaderboard Position:        │
│ This Difficulty (Medium)     │
│ Your Rank: #47 of 1,234      │
└──────────────────────────────┘
    ↓
Actions Available:
├─ [Try Again] → Re-take same quiz
├─ [Review Answers] → See explanations
├─ [Share Result] → Social sharing
├─ [Next Quiz] → Similar quiz
├─ [Dashboard] → Home page
└─ [Leaderboard] → See rankings
```

---

## Solving a Puzzle

### Puzzle Selection & Start

```
[Puzzle Browsing]
├─ By Category (Grid, Tile, Word, Pattern)
├─ By Difficulty (Easy-Expert)
└─ By Type (Sudoku, Jigsaw, etc.)
    ↓
[Puzzle Card]
├─ Title: "Sudoku Expert #45"
├─ Type: Grid-Based Logic
├─ Est. Time: 15-20 min
├─ Rating: 4.7/5
└─ [Start Puzzle]
    ↓
[Difficulty Selection]
├─ [Easy - 4×4 - 5 min est.]
├─ [Medium - 6×6 - 10 min est.]
├─ [Hard - 9×9 - 15 min est.] ← Available
└─ [Expert - 12×12 - 25+ min est.] ← Unlocked
    ↓
[Puzzle Starts]
├─ Auto-save enabled
├─ Timer optional (can hide)
└─ Puzzle displayed
```

### Puzzle Solving Interaction

```
[Sudoku Puzzle Display]
┌─────────────────────────────┐
│ Sudoku Expert #45      ⏱ 14m│
│ ▓▓▓▓░░░░░░░░░░░░░░░░░░ 40% │
│                             │
│ 9×9 Grid [with some cells filled]
│ Selected cell: [3,5]        │
│                             │
│ Number Pad:                 │
│ [1][2][3][4][5][6][7][8][9]│
│ [Clear]                     │
│                             │
│ [Hint] [Check] [Solution]   │
└─────────────────────────────┘
    ↓
User Clicks Cell (3,5)
    ↓
Cell Highlights
    ↓
User Types/Clicks "7"
    ↓
Instant Validation
├─ ✓ Valid placement (green)
└─ ✗ Invalid (red X + explanation)
    ↓
Can Continue:
├─ [Next cell] (Tab or click)
├─ [Hint] (show related constraint)
├─ [Check] (verify current state)
├─ [Solution] (give up, show answer)
└─ [Save & Exit] (resume later)
```

### Puzzle Completion

```
Puzzle Solved
    ↓
[Victory Screen]
┌──────────────────────────────┐
│ 🎉 Puzzle Solved!            │
│                              │
│ Time: 14 minutes 32 seconds  │
│ Hints Used: 1 of 3           │
│ Score: 850 points            │
│                              │
│ Personal Best: NO (prev 900) │
│ Accuracy: 100%               │
│                              │
│ Leaderboard:                 │
│ Your Rank: #89 (Expert)      │
│ Friend's Best: 12:45         │
└──────────────────────────────┘
    ↓
Next Steps:
├─ [Try Again] → New instance
├─ [Replay Solution] → See steps
├─ [Share Score] → Social
├─ [Next Puzzle] → Similar puzzle
├─ [Different Type] → New puzzle type
└─ [Dashboard] → Home
```

---

## Completing an Activity

### Activity Selection

```
[Daily Activity Hub]
├─ "Today's Challenge: Vocabulary Matching"
├─ Difficulty: Medium
├─ Est. Time: 4 minutes
├─ Points Available: 100
└─ [Start Today's Challenge]
    ↓
[Browse Activities by Type]
├─ Ordering (Number Sprint, Alphabetical)
├─ Matching (Definition, Translation)
├─ Free-Play (Story, Poetry, Design)
└─ Memory (Simon, Flip, Reaction)
    ↓
[Select Activity Type]
├─ Activity Details:
│  ├─ "Match words to definitions"
│  ├─ Difficulty: Medium
│  ├─ Time: 3-4 minutes
│  └─ Points: 100 max
└─ [Start Activity]
```

### Activity Playing

```
[Activity in Progress]
├─ Timer: 3:45 remaining
├─ Score: 340 points
├─ Accuracy: 75%
├─ Streak: 3 correct
    ↓
[Current Item]
├─ "Match: PHOTOSYNTHESIS"
├─ Options (4 choices)
│  ├─ [ ] Breakdown of glucose
│  ├─ [ ] Sunlight → Energy process ✓
│  ├─ [ ] Water absorption
│  └─ [ ] Cellular respiration
└─ (User selects option)
    ↓
Instant Feedback
├─ ✓ Correct!
│  ├─ +50 points
│  ├─ Streak: 4 (multiplier!)
│  └─ [Next Match →]
│
└─ ✗ Not correct
   ├─ No points
   ├─ Streak broken
   ├─ Correct answer: [shown]
   └─ [Try Next]
```

### Activity Results

```
Activity Completed / Time's Up
    ↓
[Results Summary]
┌──────────────────────────────┐
│ Activity Completed! ⏱ 4m 12s │
│                              │
│ Final Score: 420 points      │
│ Accuracy: 85% (17/20)        │
│ Personal Best: 420 (TIE) 🏆  │
│                              │
│ Leaderboard (Daily):         │
│ Your Rank: #12 of 8,432      │
│ Your Friends: #3 (better!)   │
│                              │
│ Performance Trend: ↑ +5%     │
│ Next Recommended: Daily +5min│
└──────────────────────────────┘
    ↓
Options:
├─ [Play Again] → New instance
├─ [Next Activity] → Different type
├─ [View Leaderboard] → Rankings
├─ [Share Score] → Social
└─ [Dashboard] → Home
```

---

## Viewing Progress & Analytics

### Personal Dashboard

```
[User Dashboard]
├─ Welcome: "Hi Alex!"
├─ [Current Streak: 8 days 🔥]
│
├─ This Week's Stats:
│  ├─ Quizzes: 12 completed
│  ├─ Puzzles: 4 completed
│  ├─ Activities: 25 completed
│  ├─ Total Points: 2,450
│  └─ Rank Position: #234 globally
│
├─ Trending Topics:
│  ├─ Biology (8 items)
│  ├─ Vocabulary (12 items)
│  └─ Sudoku (5 items)
│
├─ Recent Achievements:
│  ├─ 🏆 Streak Master (7 days)
│  ├─ ⭐ Perfect Quiz (5/5)
│  └─ 🎯 Speed Demon (< 2 min activity)
│
└─ Quick Actions:
   ├─ [Continue: Biology Quiz]
   ├─ [Daily Challenge Waiting]
   └─ [Recommended: Photosynthesis]
```

### Detailed Statistics

```
[View Stats] → [Your Profile] → [Statistics]
    ↓
[Comprehensive Analytics]
├─ Overall Stats:
│  ├─ Total Content: 156 completed
│  ├─ Total Time: 42 hours 15 min
│  ├─ Global Rank: #234 / 45,000
│  └─ Level: Gold (next: Platinum)
│
├─ By Content Type:
│  ├─ Quizzes: 89 (57%)
│  ├─ Puzzles: 34 (22%)
│  └─ Activities: 33 (21%)
│
├─ Top Subjects:
│  ├─ Biology: 45 items
│  ├─ English: 38 items
│  └─ Math: 35 items
│
├─ Progress Graphs:
│  ├─ Weekly: Line graph trending up
│  ├─ Monthly: Bar chart by type
│  └─ Yearly: Overall progression
│
└─ Skill Assessment:
   ├─ Logic: ███████░░ 70%
   ├─ Memory: ████████░░ 80%
   ├─ Speed: █████░░░░ 50%
   └─ Vocabulary: ████████░░ 80%
```

---

## Teacher/Educator Flows

### Assigning Content

```
[Teacher Dashboard]
├─ [Classes] → Select Class
│
[Assign Content to Class]
├─ [Create Assignment]
├─ Content Type: [Quiz] [Puzzle] [Activity]
├─ Select Content: [Browse/Search]
├─ Due Date: [Picker]
├─ Difficulty Level: [Easy][Med][Hard][Expert]
├─ Instructions: [Text area]
├─ [Preview Assignment]
└─ [Assign to Class]
    ↓
[Confirmation]
├─ "Assignment created!"
├─ 28 students will see this
├─ View Student Responses
└─ [Done]
```

### Monitoring Student Progress

```
[Class Dashboard]
├─ Recent Assignments:
│  ├─ "Biology Quiz #3" (Due: Today)
│  ├─ Responses: 24/28 (86%)
│  ├─ Avg Score: 78%
│  └─ [View Details] [View Responses]
│
├─ Student Performance:
│  ├─ High performers: 8 (A+)
│  ├─ Good performers: 12 (A/B)
│  ├─ Developing: 6 (C)
│  ├─ Needs help: 2 (D/F)
│  └─ [View Class Report]
│
└─ Individual Student View:
   ├─ Student: "Emma Zhang"
   ├─ Assignment: "Biology Quiz #3"
   ├─ Status: Completed
   ├─ Score: 92% (4.6/5)
   ├─ Time: 12 minutes
   ├─ Strengths: Cell structure, genetics
   ├─ Areas for growth: Ecology
   └─ [Recommend follow-up content]
```

---

## Search & Discovery

### Quick Search

```
[Search Bar] (Always visible)
User types: "photosynthesis"
    ↓
[Instant Results]
├─ Top Results:
│  ├─ Quiz: "Photosynthesis Quiz" (15 plays)
│  ├─ Puzzle: "Plant Cell Diagram" (8 plays)
│  └─ Activity: "Vocabulary: Photosynthesis"
│
├─ By Type:
│  ├─ Quizzes (12 results)
│  ├─ Puzzles (5 results)
│  └─ Activities (3 results)
│
└─ [View All Results]
```

### Advanced Search

```
[Browse/Search] → [Advanced Search]
    ↓
[Filter Results]
├─ Content Type:
│  ├─ ☑ Quizzes
│  ├─ ☑ Puzzles
│  └─ ☑ Activities
│
├─ Subject: [Biology▼]
├─ Grade: [6-8▼]
├─ Difficulty: [Easy▼] [Medium▼]
├─ Duration: [5-10 min▼]
├─ Rating: [4+ stars▼]
├─ Sort By: [Relevance▼]
│
└─ [Search] [Reset]
    ↓
[Results List]
├─ [Matching cards in grid]
├─ [Pagination if 30+ results]
└─ [Bookmark favorites]
```

---

## Summary

These flows represent the main user journeys in AmAha. Each flow is optimized for:
- **Clarity** - User always knows what to do
- **Speed** - Minimal clicks to get to content
- **Feedback** - Instant results and encouragement
- **Flexibility** - Multiple ways to accomplish goals
- **Accessibility** - Keyboard & screen reader friendly

---

**Next:** Back to [UX Overview](design-principles) or [Admin & Content Creation](../admin/overview)
