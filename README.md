# 🧠 AmAha – Learn Through Play

AmAha is a **quiz-first learning platform** inspired by modern products like Quiz.com.
It is designed to grow into a **multi-learning ecosystem** including:

- Quizzes
- Puzzles
- Studies (academic learning)
- Art & Literature

The core philosophy:
> Learning should feel like play — not pressure.

---

## 🌟 What Makes AmAha Different

- Clean, modern UI (Quiz.com–style)
- Level-based progression (Easy → Medium → Hard)
- Strict learning rules (all answers must be correct)
- Resume, retry, replay support
- Designed for monetization (ads-friendly UX)
- Built to scale into multiple learning features

---

## 🏠 Homepage (Implemented)

### Structure
Hero Section
→ Feature Hub (Quizzes / Puzzles / Studies / etc.)
→ Feature Grid (benefits)
→ Feature Tiles (categories)
→ Motivation Section
→ Footer
### Key Files
src/home/HomePage.jsx
src/home/components/HeroSection.jsx
src/home/components/FeatureHub.jsx
src/home/components/FeatureTiles.jsx
src/home/components/FeatureGrid.jsx
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