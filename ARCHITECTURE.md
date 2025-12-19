# 🏗️ AmAha Architecture

This document explains **how the app is structured**.

---

## 📁 Folder Structure
src/
├── home/
├── quiz/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── ui/
├── admin/
├── pages/
├── layouts/
├── firebase/

---

## 🧩 Feature-Based Design

Each feature owns:
- UI
- Logic
- Services

Example:
quiz/
├── QuizPage.jsx
├── hooks/
├── components/
├── services/

---

## 🔁 Data Flow
UI → Hook → Service → Firestore
No UI should directly talk to Firestore.

---

## 🧠 State Rules

- Local state for UI
- Firestore for progress
- Resume state saved intentionally

---

## 🚀 Scalability Ready

This architecture supports:
- Adding new learning features
- Shared progress logic
- Unified reward system

---

## 🧭 Guiding Rule

If a file feels confusing:
➡️ split it.

Clarity > cleverness.