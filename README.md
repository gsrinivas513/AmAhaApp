# 🧠 AmAha – Learn Through Play & Earn Money

**AmAha** is a **gamified learning platform** built to be a **income-generating product** for creators and learners. It combines the addictiveness of quiz games with the monetization potential of educational content.

## 🎯 Vision

Transform learning into **earning**. Users can:
- Take quizzes to earn rewards/coins
- Create and monetize their own quizzes
- Unlock premium content through gameplay
- Participate in leaderboards and tournaments

---

## 🌟 What Makes AmAha Different

✅ **Quiz.com-style UI** - Clean, modern, playful design
✅ **Multi-learning ecosystem** - Quizzes, Puzzles, Studies, Arts
✅ **Monetization-first architecture** - Built for ads, subscriptions, and rewards
✅ **Gamification system** - XP, coins, badges, leaderboards
✅ **Creator economy** - Users can create and earn from content
✅ **Strict learning rules** - All answers correct to progress
✅ **Resume & retry support** - Player-friendly experience
✅ **Scalable feature design** - Easy to add new learning types

---

## 💰 Monetization Strategy

### Revenue Streams
1. **Ad Placements** - Rewarded ads, banner ads, interstitials
2. **Premium Membership** - Unlock all quizzes, ad-free experience
3. **Creator Revenue** - 70/30 split on quiz monetization
4. **In-app Purchases** - Coins, power-ups, cosmetics
5. **Sponsorships** - Corporate training quizzes

### Earning Mechanics
- Users earn **coins** by:
  - Completing quizzes
  - Daily login streaks
  - Leaderboard rankings
  - Watching ads
- **Coins can be:**
  - Converted to real money (via PayPal, UPI)
  - Used to unlock premium quizzes
  - Used for in-app cosmetics

---

## 🏠 Homepage (Implemented)

### Structure
- **Hero Section** - Main CTA with PIN join and Sign Up
- **Feature Hub** - Browse by category (Quiz, Puzzles, Studies, etc.)
- **Feature Tiles** - Quiz categories display
- **Feature Grid** - Benefits/USP showcase
- **Stats Strip** - User engagement metrics
- **Testimonials** - Social proof
- **Motivation Section** - Calls-to-action
- **Footer** - Links and info

### Key Files
```
src/home/
├── HomePage.jsx
├── components/
│   ├── HeroSection.jsx
│   ├── FeatureHub.jsx
│   ├── FeatureTiles.jsx
│   ├── FeatureGrid.jsx
│   ├── StatsStrip.jsx
│   ├── TestimonialsSection.jsx
│   ├── MotivationSection.jsx
│   └── Footer.jsx
```
---

## 🎯 Quiz Flow (Implemented)

### Navigation Flow
Home
→ Feature (Quiz)
→ Category (Kids / Students / Programming)
→ Difficulty (Easy / Medium / Hard)
→ Levels (Level 1, Level 2, …)
→ Questions

---

## 🧩 Quiz Rules

- Each level contains **fixed number of questions**
- Questions are:
  - Randomized per user
  - Never repeated across levels
- **Level completion rule**:
  - ✅ ALL answers must be correct
  - ❌ Any wrong answer → level fails
- Failed level must be retried
- Only after completion → next level unlocks

---

## ⏸ Resume & Retry

- Quiz state auto-saved (level + question index)
- Resume banner shown once
- Retry restarts same level cleanly
- Replay always allowed

---

## 🧠 UX & Feedback System

- Submit enabled only after option selection
- Clear answer feedback:
  - Green → correct
  - Red → wrong
  - Others muted
- Timer per question
- Progress bar
- Spam prevention on Next button
- Safe guards for reloads & invalid routes

---

## 🏆 Progress & Levels

- Level unlock based on completion
- Progress stored per user
- Guests limited to Level 1
- Trophy logic scaffolded

### Firestore Structure

users/{uid}/progress/{category_difficulty}
---

## 🧑‍💼 Admin Panel (Implemented)

- Add question (manual)
- Bulk import (CSV / Excel)
- View / edit questions
- Categories
- Scores & analytics (basic)
- UI mode settings

---

## 📊 Firestore Data Models

### Question
```js
{
  question: string,
  options: string[],
  correctAnswer: string,
  category: string,
  difficulty: "easy" | "medium" | "hard",
  createdAt: timestamp
}

User Progress
{
  easyCompletedLevels: number,
  mediumCompletedLevels: number,
  hardCompletedLevels: number,
  trophyEarned: boolean
}

🎨 Design System
	•	Global typography (Quiz.com inspired)
	•	Consistent cards, buttons, spacing
	•	Responsive layout
	•	Animation-safe UI (no layout shift)

src/index.css

🧩 Architecture Principles
	•	One responsibility per file
	•	Small files (~100 lines max)
	•	Clear separation:
	•	UI
	•	Hooks
	•	Services
	•	Pages
	•	Built for future expansion

🔮 Vision

AmAha aims to:
	•	Make learning addictive (positively)
	•	Support families via ethical monetization
	•	Become a universal learning platform