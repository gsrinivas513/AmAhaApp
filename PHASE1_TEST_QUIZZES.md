# 🧪 PHASE 1 TEST QUIZZES - Copy/Paste to Firestore

Follow this guide to create test quizzes that verify all 8 question types work correctly.

---

## Quick Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your AmAha project
3. Go to Firestore Database
4. Click "Add collection" → Enter "quizzes"
5. Copy/paste each quiz below as a new document

---

## Test 1: Multiple Choice

### Create Document
- Collection: `quizzes`
- Document ID: `test-mc-001`

### Paste This Content
```json
{
  "title": "Test Multiple Choice",
  "description": "Simple multiple choice quiz to verify question type works",
  "category": "Test",
  "difficulty": "Easy",
  "avgTime": 5,
  "questions": [
    {
      "type": "multiple-choice",
      "text": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "correctAnswer": 2,
      "explanation": "Paris is the capital and largest city of France, famous for the Eiffel Tower.",
      "difficulty": "Easy"
    },
    {
      "type": "multiple-choice",
      "text": "Which planet is closest to the Sun?",
      "options": ["Venus", "Mercury", "Mars", "Earth"],
      "correctAnswer": 1,
      "explanation": "Mercury is the closest planet to the Sun and also the smallest.",
      "difficulty": "Easy"
    }
  ],
  "levelVariants": {
    "Easy": {
      "questions": [
        {
          "type": "multiple-choice",
          "text": "What is 2+2?",
          "options": ["3", "4", "5", "6"],
          "correctAnswer": 1,
          "explanation": "2+2 equals 4.",
          "difficulty": "Easy"
        }
      ],
      "questionCount": 1
    },
    "Medium": {
      "questions": [
        {
          "type": "multiple-choice",
          "text": "What is 5×7?",
          "options": ["30", "35", "40", "45"],
          "correctAnswer": 1,
          "explanation": "5×7 equals 35.",
          "difficulty": "Medium"
        }
      ],
      "questionCount": 1
    },
    "Hard": {
      "questions": [
        {
          "type": "multiple-choice",
          "text": "What is 12×8?",
          "options": ["96", "104", "112", "120"],
          "correctAnswer": 0,
          "explanation": "12×8 equals 96.",
          "difficulty": "Hard"
        }
      ],
      "questionCount": 1
    },
    "Expert": {
      "questions": [
        {
          "type": "multiple-choice",
          "text": "What is 15×15?",
          "options": ["215", "220", "225", "230"],
          "correctAnswer": 2,
          "explanation": "15×15 equals 225.",
          "difficulty": "Expert"
        }
      ],
      "questionCount": 1
    }
  }
}
```

**What to Test:**
- [ ] Quiz loads
- [ ] 2 questions display
- [ ] Can click answer buttons
- [ ] Hear "ding" sound on correct answer
- [ ] Hear "buzz" on wrong answer
- [ ] Explanation displays after answering
- [ ] Can select different difficulties
- [ ] Difficulty variants work

---

## Test 2: True/False

### Create Document
- Collection: `quizzes`
- Document ID: `test-tf-001`

### Paste This Content
```json
{
  "title": "Test True/False",
  "description": "True/False questions",
  "category": "Test",
  "difficulty": "Easy",
  "avgTime": 5,
  "questions": [
    {
      "type": "true-false",
      "text": "Paris is the capital of France.",
      "correctAnswer": 0,
      "explanation": "True. Paris is the capital and largest city of France.",
      "difficulty": "Easy"
    },
    {
      "type": "true-false",
      "text": "The Earth is flat.",
      "correctAnswer": 1,
      "explanation": "False. The Earth is an oblate spheroid (nearly spherical).",
      "difficulty": "Easy"
    }
  ],
  "levelVariants": {
    "Easy": {
      "questions": [
        {
          "type": "true-false",
          "text": "Water boils at 100°C at sea level.",
          "correctAnswer": 0,
          "explanation": "True. This is the standard boiling point of water.",
          "difficulty": "Easy"
        }
      ],
      "questionCount": 1
    }
  }
}
```

**What to Test:**
- [ ] True/False buttons appear
- [ ] Can click True button
- [ ] Can click False button
- [ ] Audio plays on answer
- [ ] Correct/incorrect feedback shows
- [ ] ✓ and ✗ icons display

---

## Test 3: Fill in the Blank

### Create Document
- Collection: `quizzes`
- Document ID: `test-fillblank-001`

### Paste This Content
```json
{
  "title": "Test Fill in the Blank",
  "description": "Fill in the blank questions",
  "category": "Test",
  "difficulty": "Easy",
  "avgTime": 5,
  "questions": [
    {
      "type": "fill-blank",
      "text": "The capital of France is ____.",
      "answer": "Paris",
      "explanation": "Paris is the capital and largest city of France.",
      "difficulty": "Easy"
    },
    {
      "type": "fill-blank",
      "text": "The largest planet in our solar system is ____.",
      "answer": ["Jupiter", "jupiter"],
      "explanation": "Jupiter is the largest planet in our solar system.",
      "difficulty": "Easy"
    }
  ],
  "levelVariants": {
    "Easy": {
      "questions": [
        {
          "type": "fill-blank",
          "text": "1+1 = ____",
          "answer": ["2", "two"],
          "explanation": "1+1 equals 2.",
          "difficulty": "Easy"
        }
      ],
      "questionCount": 1
    }
  }
}
```

**What to Test:**
- [ ] Text input field appears
- [ ] Can type answer
- [ ] Submit button appears
- [ ] Correct answer accepted
- [ ] Wrong answer shows as incorrect
- [ ] Case-insensitive matching works
- [ ] Multiple answer variations work

---

## Test 4: Matching

### Create Document
- Collection: `quizzes`
- Document ID: `test-matching-001`

### Paste This Content
```json
{
  "title": "Test Matching",
  "description": "Match items to their pairs",
  "category": "Test",
  "difficulty": "Easy",
  "avgTime": 5,
  "questions": [
    {
      "type": "matching",
      "text": "Match countries to their capitals:",
      "pairs": [
        { "id": 1, "left": "France", "right": "Paris" },
        { "id": 2, "left": "Germany", "right": "Berlin" },
        { "id": 3, "left": "Italy", "right": "Rome" }
      ],
      "correctPairs": {
        "1": 1,
        "2": 2,
        "3": 3
      },
      "explanation": "These are the correct capital cities for each country.",
      "difficulty": "Easy"
    }
  ],
  "levelVariants": {
    "Easy": {
      "questions": [
        {
          "type": "matching",
          "text": "Match numbers to words:",
          "pairs": [
            { "id": 1, "left": "1", "right": "One" },
            { "id": 2, "left": "2", "right": "Two" }
          ],
          "correctPairs": {
            "1": 1,
            "2": 2
          },
          "explanation": "These are the correct matches.",
          "difficulty": "Easy"
        }
      ],
      "questionCount": 1
    }
  }
}
```

**What to Test:**
- [ ] Two columns display (left and right)
- [ ] Can click to match pairs
- [ ] Visual feedback shows connections
- [ ] Can see which pairs are matched
- [ ] Audio plays on completion
- [ ] Correct pairs validated

---

## Test 5: Ordering

### Create Document
- Collection: `quizzes`
- Document ID: `test-ordering-001`

### Paste This Content
```json
{
  "title": "Test Ordering",
  "description": "Put items in the correct order",
  "category": "Test",
  "difficulty": "Easy",
  "avgTime": 5,
  "questions": [
    {
      "type": "ordering",
      "text": "Put these numbers in order from smallest to largest:",
      "items": [
        { "id": 1, "text": "5" },
        { "id": 2, "text": "2" },
        { "id": 3, "text": "8" },
        { "id": 4, "text": "1" }
      ],
      "correctOrder": [4, 2, 1, 3],
      "explanation": "The correct order is 1, 2, 5, 8",
      "difficulty": "Easy"
    }
  ],
  "levelVariants": {
    "Easy": {
      "questions": [
        {
          "type": "ordering",
          "text": "Put in correct order: A, B, C",
          "items": [
            { "id": 1, "text": "A" },
            { "id": 2, "text": "B" },
            { "id": 3, "text": "C" }
          ],
          "correctOrder": [1, 2, 3],
          "explanation": "Alphabetical order.",
          "difficulty": "Easy"
        }
      ],
      "questionCount": 1
    }
  }
}
```

**What to Test:**
- [ ] Items display in list
- [ ] Up/down buttons appear
- [ ] Can drag items to reorder
- [ ] Visual feedback shows current order
- [ ] Order validation works
- [ ] Audio plays on correct ordering

---

## Test 6: Image Selection

### Create Document
- Collection: `quizzes`
- Document ID: `test-imageselect-001`

### Paste This Content
```json
{
  "title": "Test Image Selection",
  "description": "Select the correct image",
  "category": "Test",
  "difficulty": "Easy",
  "avgTime": 5,
  "questions": [
    {
      "type": "image-select",
      "text": "Which is a cat?",
      "options": [
        { "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg", "label": "Cat", "isCorrect": true },
        { "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg", "label": "Painting", "isCorrect": false },
        { "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png", "label": "Square", "isCorrect": false }
      ],
      "correctImages": [0],
      "explanation": "A cat is a domesticated feline mammal.",
      "difficulty": "Easy"
    }
  ],
  "levelVariants": {
    "Easy": {
      "questions": [
        {
          "type": "image-select",
          "text": "Select all fruits:",
          "options": [
            { "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/1280px-Red_Apple.jpg", "label": "Apple", "isCorrect": true },
            { "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/1200px-Cat03.jpg", "label": "Cat", "isCorrect": false }
          ],
          "correctImages": [0],
          "explanation": "Apples are fruits.",
          "difficulty": "Easy"
        }
      ],
      "questionCount": 1
    }
  }
}
```

**What to Test:**
- [ ] Images load and display
- [ ] Can click image to select
- [ ] Selected image highlights
- [ ] Multiple selection works (if enabled)
- [ ] Image label displays
- [ ] Correct selection validated
- [ ] Audio plays on answer

---

## Test 7: Multi-Select

### Create Document
- Collection: `quizzes`
- Document ID: `test-multiselect-001`

### Paste This Content
```json
{
  "title": "Test Multi-Select",
  "description": "Select multiple correct answers",
  "category": "Test",
  "difficulty": "Easy",
  "avgTime": 5,
  "questions": [
    {
      "type": "multi-select",
      "text": "Which of these are fruits? (Select all that apply)",
      "options": [
        { "id": 0, "text": "Apple", "isCorrect": true },
        { "id": 1, "text": "Banana", "isCorrect": true },
        { "id": 2, "text": "Carrot", "isCorrect": false },
        { "id": 3, "text": "Orange", "isCorrect": true }
      ],
      "correctAnswers": [0, 1, 3],
      "explanation": "Apples, bananas, and oranges are fruits. Carrots are vegetables.",
      "difficulty": "Easy"
    }
  ],
  "levelVariants": {
    "Easy": {
      "questions": [
        {
          "type": "multi-select",
          "text": "Which are colors?",
          "options": [
            { "id": 0, "text": "Red", "isCorrect": true },
            { "id": 1, "text": "Blue", "isCorrect": true },
            { "id": 2, "text": "Car", "isCorrect": false }
          ],
          "correctAnswers": [0, 1],
          "explanation": "Red and Blue are colors.",
          "difficulty": "Easy"
        }
      ],
      "questionCount": 1
    }
  }
}
```

**What to Test:**
- [ ] Checkboxes appear for each option
- [ ] Can click to select multiple
- [ ] Selected items show checkmarks
- [ ] Can unselect items
- [ ] All correct answers must be selected
- [ ] No incorrect answers allowed
- [ ] Audio plays when all correct

---

## Test 8: Drag & Drop

### Create Document
- Collection: `quizzes`
- Document ID: `test-dragdrop-001`

### Paste This Content
```json
{
  "title": "Test Drag & Drop",
  "description": "Drag items to correct categories",
  "category": "Test",
  "difficulty": "Easy",
  "avgTime": 5,
  "questions": [
    {
      "type": "drag-drop",
      "text": "Drag animals to their habitats:",
      "dropZones": [
        { "id": "z1", "label": "Land" },
        { "id": "z2", "label": "Water" }
      ],
      "items": [
        { "id": "i1", "text": "Lion", "correctZone": "z1" },
        { "id": "i2", "text": "Fish", "correctZone": "z2" },
        { "id": "i3", "text": "Eagle", "correctZone": "z1" }
      ],
      "correctPlacements": {
        "i1": "z1",
        "i2": "z2",
        "i3": "z1"
      },
      "explanation": "Lions and eagles live on land. Fish live in water.",
      "difficulty": "Easy"
    }
  ],
  "levelVariants": {
    "Easy": {
      "questions": [
        {
          "type": "drag-drop",
          "text": "Sort by color:",
          "dropZones": [
            { "id": "z1", "label": "Red" },
            { "id": "z2", "label": "Blue" }
          ],
          "items": [
            { "id": "i1", "text": "Apple", "correctZone": "z1" },
            { "id": "i2", "text": "Sky", "correctZone": "z2" }
          ],
          "correctPlacements": {
            "i1": "z1",
            "i2": "z2"
          },
          "explanation": "Apples are red, sky is blue.",
          "difficulty": "Easy"
        }
      ],
      "questionCount": 1
    }
  }
}
```

**What to Test:**
- [ ] Drop zones appear
- [ ] Items can be dragged
- [ ] Items can be dropped in zones
- [ ] Visual feedback during drag
- [ ] Incorrect placement shows error
- [ ] All items must be placed correctly
- [ ] Audio plays on completion

---

## Test 9: Mixed Question Types (All 8 in One Quiz)

### Create Document
- Collection: `quizzes`
- Document ID: `test-all-types-001`

### Paste This Content
```json
{
  "title": "Test All Question Types",
  "description": "Quiz with all 8 question types combined",
  "category": "Test",
  "difficulty": "Medium",
  "avgTime": 15,
  "questions": [
    {
      "type": "multiple-choice",
      "text": "1. What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "correctAnswer": 2,
      "explanation": "Paris is the capital of France.",
      "difficulty": "Easy"
    },
    {
      "type": "true-false",
      "text": "2. The Earth orbits the Sun.",
      "correctAnswer": 0,
      "explanation": "True. The Earth orbits the Sun.",
      "difficulty": "Easy"
    },
    {
      "type": "fill-blank",
      "text": "3. 5 + 3 = ____",
      "answer": ["8", "eight"],
      "explanation": "5 + 3 = 8",
      "difficulty": "Easy"
    },
    {
      "type": "matching",
      "text": "4. Match fruit to color:",
      "pairs": [
        { "id": 1, "left": "Banana", "right": "Yellow" },
        { "id": 2, "left": "Apple", "right": "Red" }
      ],
      "correctPairs": {
        "1": 1,
        "2": 2
      },
      "explanation": "Bananas are yellow, apples are red.",
      "difficulty": "Easy"
    },
    {
      "type": "ordering",
      "text": "5. Put in size order (small to large):",
      "items": [
        { "id": 1, "text": "Planet" },
        { "id": 2, "text": "Ant" },
        { "id": 3, "text": "Mountain" }
      ],
      "correctOrder": [2, 1, 3],
      "explanation": "Ant < Planet < Mountain",
      "difficulty": "Easy"
    }
  ],
  "levelVariants": {
    "Easy": {
      "questions": [
        {
          "type": "multiple-choice",
          "text": "What is 1+1?",
          "options": ["1", "2", "3"],
          "correctAnswer": 1,
          "explanation": "1+1=2",
          "difficulty": "Easy"
        }
      ],
      "questionCount": 1
    }
  }
}
```

**What to Test:**
- [ ] All 5 question types load
- [ ] Can answer each type
- [ ] Audio plays for each
- [ ] Explanations display
- [ ] Score calculates correctly
- [ ] Transitions work smoothly

---

## Testing Checklist

After creating each quiz, follow this checklist:

### For Each Quiz:
- [ ] Create Firestore document
- [ ] Document ID matches above
- [ ] All fields pasted correctly
- [ ] No JSON syntax errors
- [ ] Quiz appears in Quizzes page
- [ ] Can start quiz

### For Each Question Type:
- [ ] Question displays clearly
- [ ] Can select/input answer
- [ ] Answer validation works
- [ ] Feedback displays
- [ ] Audio sounds play
- [ ] Explanation shows
- [ ] Can move to next question
- [ ] Score increments correctly

### Overall:
- [ ] All quizzes load without errors
- [ ] No console errors
- [ ] Mobile displays correctly
- [ ] Leaderboard updates
- [ ] Can retake quizzes
- [ ] Scores save to database

---

## If Something Doesn't Work

### Quiz won't load:
1. Check JSON syntax (use [JSONLint.com](https://jsonlint.com))
2. Verify all required fields present
3. Look at browser console for errors
4. Try refreshing page

### Questions don't show:
1. Check `questions` array exists
2. Check each question has `type` field
3. Verify `type` matches one of 8 types
4. Check `text` field exists

### Audio doesn't play:
1. Check sound files in `/public/sounds/`
2. Check browser permissions
3. Try different browser
4. Check volume isn't muted
5. Look at browser console

### Answers don't validate:
1. Check `correctAnswer` format matches question type
2. For fill-blank: check spelling (case-insensitive by default)
3. For matching: check `correctPairs` object format
4. Look at browser console for validation errors

---

## Next Steps

Once all tests pass:

1. ✅ Delete test quizzes or keep for reference
2. ✅ Create real quizzes with new question types
3. ✅ Test on mobile devices
4. ✅ Gather user feedback
5. ✅ Start Phase 1, Day 4: Quiz Builder UI

---

**Good luck with testing! 🧪 Let me know if you need help creating more quizzes!**

