# Sample Quizzes on Quiz Page

## 🎯 Overview

11 sample quizzes demonstrating each quiz type have been added to the `/quiz` page. These are for demonstration and testing purposes.

---

## 📋 Sample Quizzes (Available on /quiz page)

### 1. 🎯 Basic MCQ Quiz
**Quiz Type:** MCQ (Multiple Choice Question)  
**Difficulty:** Easy  
**Questions:** 3  
**Time:** ~5 minutes  
**Points:** 10 per question  

**Sample Question:**
```
"What is the capital of France?"
A) London
B) Paris ← Correct
C) Berlin
D) Madrid
```

---

### 2. ✓ Multiple Answer Quiz
**Quiz Type:** MULTI_SELECT (Multiple Answer)  
**Difficulty:** Medium  
**Questions:** 2  
**Time:** ~6 minutes  
**Points:** 15 per question  

**Sample Question:**
```
"Which of these are planets in our solar system?"
A) Mars ✓ Correct
B) Venus ✓ Correct
C) Moon ✗ Incorrect
D) Jupiter ✓ Correct

(Select ALL that apply)
```

---

### 3. ✓✗ True or False Quiz
**Quiz Type:** TRUE_FALSE  
**Difficulty:** Easy  
**Questions:** 4  
**Time:** ~3 minutes  
**Points:** 5 per question  

**Sample Question:**
```
"The Great Wall of China is visible from space with the naked eye."
Answer: FALSE ✓
```

---

### 4. 📝 Fill in the Blank
**Quiz Type:** FILL_BLANK  
**Difficulty:** Medium  
**Questions:** 3  
**Time:** ~7 minutes  
**Points:** 10 per question  

**Sample Question:**
```
"The capital of Germany is _______."
Answer: Berlin (accepts variations, case-insensitive)
```

---

### 5. 🔗 Matching Pairs
**Quiz Type:** MATCHING  
**Difficulty:** Medium  
**Questions:** 2  
**Time:** ~8 minutes  
**Points:** 20 per question  

**Sample Question:**
```
Match animals with their sounds:

Left Column          Right Column
Cat          ───────  Meow
Dog          ───────  Bark
Cow          ───────  Moo
Duck         ───────  Quack
```

---

### 6. 📊 Sequence Ordering
**Quiz Type:** ORDERING  
**Difficulty:** Medium  
**Questions:** 2  
**Time:** ~10 minutes  
**Points:** 15 per question  

**Sample Question:**
```
"Arrange these historical events in chronological order:"

Items to arrange:
- Renaissance
- Middle Ages
- Ancient Rome
- Modern Era

Correct order:
1. Ancient Rome
2. Middle Ages
3. Renaissance
4. Modern Era
```

---

### 7. 🧩 Puzzle Assembly
**Quiz Type:** PUZZLE  
**Difficulty:** Medium  
**Questions:** 2  
**Time:** ~12 minutes  
**Points:** 20 per question  

**Sample Question:**
```
"Arrange the life cycle stages of a butterfly in correct order:"

Pieces to arrange:
- Egg
- Larva
- Pupa
- Adult

Correct sequence:
1. Egg
2. Larva (Caterpillar)
3. Pupa (Chrysalis)
4. Adult (Butterfly)
```

---

### 8. 🎯 Drag & Drop Categorization
**Quiz Type:** DRAG_DROP  
**Difficulty:** Hard  
**Questions:** 1  
**Time:** ~10 minutes  
**Points:** 25 per question  

**Sample Question:**
```
"Categorize these foods:"

Categories:
├─ Fruits
├─ Vegetables
└─ Proteins

Items to categorize:
- Apple → Fruits
- Carrot → Vegetables
- Chicken → Proteins
- Banana → Fruits
- Broccoli → Vegetables
- Fish → Proteins
```

---

### 9. 💻 Code Challenge
**Quiz Type:** CODING  
**Difficulty:** Hard  
**Questions:** 1  
**Time:** ~15 minutes  
**Points:** 50 per question  

**Sample Challenge:**
```
"Write a function to calculate the factorial of a number"

Language: JavaScript

Code Template:
function factorial(n) {
  // Write your solution here
}

Test Cases:
- Input: 5 → Output: 120 ✓
- Input: 4 → Output: 24 ✓
- Input: 3 → Output: 6 ✓
- Input: 1 → Output: 1 ✓
```

---

### 10. 🖼️ Image Selection
**Quiz Type:** IMAGE_BASED  
**Difficulty:** Medium  
**Questions:** 1  
**Time:** ~6 minutes  
**Points:** 10 per question  

**Sample Question:**
```
"Click on the location of the Eiffel Tower in this world map:"

[Interactive image with clickable regions]
```

---

### 11. 🎵 Audio Listening Quiz
**Quiz Type:** AUDIO_BASED  
**Difficulty:** Easy  
**Questions:** 2  
**Time:** ~8 minutes  
**Points:** 10 per question  

**Sample Question:**
```
"Listen to the audio and answer: What animal sound did you hear?"

[Audio player with playback controls]
"🔊 Dog barking"

A) Cat meowing
B) Dog barking ← Correct
C) Bird chirping
D) Cow mooing
```

---

## 🎯 How to Access Sample Quizzes

1. **Navigate to:** `http://localhost:3000/quiz`
2. **View all sample quizzes** displayed alongside any real quizzes
3. **Filter by category:**
   - 🔬 Science (MCQ, MULTI_SELECT, PUZZLE, DRAG_DROP, IMAGE_BASED)
   - 📐 Mathematics (None in samples currently)
   - 🏛️ History (TRUE_FALSE, ORDERING)
   - 🌍 Geography (IMAGE_BASED)
   - 📚 Literature (AUDIO_BASED)
   - 💻 Technology (CODING)

4. **Filter by audience:**
   - All audiences supported for all quizzes

5. **Click on any quiz** to take it and see how it works

---

## ✨ Features Demonstrated

### Content Flexibility
Sample quizzes show how different content types can be mixed:
- **Text content:** Instructions and question text
- **Image content:** Visual aids and diagrams
- **Audio content:** Audio playback (in AUDIO_BASED)
- **Video content:** Ready for video URLs

### Type-Specific Answer Forms
Each quiz type demonstrates its unique answer configuration:
- MCQ: Single selection from options
- MULTI_SELECT: Multiple selection with checkboxes
- TRUE_FALSE: Binary choice
- FILL_BLANK: Text input with fuzzy matching
- MATCHING: Pairing left and right items
- ORDERING: Arranging in sequence
- PUZZLE: Puzzle piece assembly
- DRAG_DROP: Item categorization
- CODING: Code execution with test cases
- IMAGE_BASED: Coordinate-based clicking
- AUDIO_BASED: Audio with multiple choice

### Metadata Completeness
All quizzes include:
- ✓ Title and description
- ✓ Category and difficulty
- ✓ Point values
- ✓ Time estimates
- ✓ Rating and play counts
- ✓ Hints and explanations

---

## 📊 Sample Quiz Statistics

| Type | Title | Category | Difficulty | Questions | Time |
|------|-------|----------|-----------|-----------|------|
| MCQ | Basic MCQ Quiz | Science | Easy | 3 | 5 min |
| MULTI_SELECT | Multiple Answer Quiz | Science | Medium | 2 | 6 min |
| TRUE_FALSE | True or False Quiz | History | Easy | 4 | 3 min |
| FILL_BLANK | Fill in the Blank | Language | Medium | 3 | 7 min |
| MATCHING | Matching Pairs | Science | Medium | 2 | 8 min |
| ORDERING | Sequence Ordering | History | Medium | 2 | 10 min |
| PUZZLE | Puzzle Assembly | Science | Medium | 2 | 12 min |
| DRAG_DROP | Drag & Drop | Science | Hard | 1 | 10 min |
| CODING | Code Challenge | Technology | Hard | 1 | 15 min |
| IMAGE_BASED | Image Selection | Geography | Medium | 1 | 6 min |
| AUDIO_BASED | Audio Listening | Language | Easy | 2 | 8 min |

---

## 🔧 Technical Implementation

### Location
- **File:** `/src/data/sampleQuizzes.js`
- **Imported in:** `/src/pages/QuizzesPage.jsx`

### Integration
Sample quizzes are:
1. ✓ Loaded alongside real Firestore quizzes
2. ✓ Automatically combined with any real quizzes
3. ✓ Filterable by category and audience
4. ✓ Fully playable like real quizzes
5. ✓ Available even if Firestore is offline

### Code Structure
```javascript
// In QuizzesPage.jsx:
import { SAMPLE_QUIZZES } from '../data/sampleQuizzes';

// During load:
const combinedQuizzes = [...firebaseQuizzes, ...SAMPLE_QUIZZES];
setQuizzes(combinedQuizzes);
```

---

## 🚀 Testing Sample Quizzes

### Test MCQ
1. Go to `/quiz`
2. Click "🎯 Basic MCQ Quiz"
3. Try selecting different options
4. See immediate feedback

### Test Puzzle Assembly
1. Go to `/quiz`
2. Click "🧩 Puzzle Assembly"
3. Drag puzzle pieces to arrange
4. Submit to check sequence

### Test Audio-Based
1. Go to `/quiz`
2. Click "🎵 Audio Listening Quiz"
3. Click play to hear audio
4. Answer the question

### Test Coding
1. Go to `/quiz`
2. Click "💻 Code Challenge"
3. Write JavaScript code
4. Run against test cases

---

## 💡 Using Sample Quizzes for Development

### For Testing Quiz Types
Use sample quizzes to verify each quiz type works correctly:
```javascript
// Test MCQ rendering
navigate('/quiz-play/sample_mcq_001');

// Test PUZZLE interaction
navigate('/quiz-play/sample_puzzle_001');

// Test CODING challenge
navigate('/quiz-play/sample_coding_001');
```

### For UI Testing
Sample quizzes provide consistent data for:
- Layout testing
- Responsive design verification
- Theme compatibility
- Performance testing

### For Documentation
Show users what each quiz type looks like:
- Provide working examples
- Demonstrate expected behavior
- Show all features in action

---

## 🎓 Next Steps

To add more sample quizzes:

1. **Edit** `/src/data/sampleQuizzes.js`
2. **Add** new quiz objects to `SAMPLE_QUIZZES` array
3. **Include** all required fields (title, category, quizType, questions, etc.)
4. **Save** and rebuild (`npm run build`)
5. **View** on `/quiz` page automatically

Example:
```javascript
export const SAMPLE_QUIZZES = [
  // ... existing quizzes ...
  {
    id: "sample_custom_001",
    title: "Your Custom Quiz",
    category: "science",
    quizType: "MCQ",
    questions: [...],
    // ... other fields
  }
];
```

---

## ✅ Verification Checklist

- ✓ All 11 quiz types have sample quizzes
- ✓ Quizzes are visible on `/quiz` page
- ✓ Each quiz has complete metadata
- ✓ Sample quizzes include example questions
- ✓ Filterable by category and audience
- ✓ Playable and functional
- ✓ Build successful with no errors
- ✓ Ready for production use

