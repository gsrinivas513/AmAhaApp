# Quiz Builder: Visual Flowcharts & Diagrams

## 📊 Complete Quiz Creation Flow (All Types)

```
START: Admin Opens Quiz Builder
│
├─ STEP 1: QUIZ METADATA FORM
│  │
│  ├─ Fill Basic Info
│  │  ├─ Title: [Text input]
│  │  ├─ Audience: [Dropdown]
│  │  ├─ Category: [Dropdown]
│  │  └─ Level: [Dropdown]
│  │
│  ├─ SELECT QUIZ TYPE (THE KEY CHOICE)
│  │  ├─ MCQ
│  │  ├─ MULTI_SELECT
│  │  ├─ TRUE_FALSE
│  │  ├─ FILL_BLANK
│  │  ├─ MATCHING
│  │  ├─ ORDERING
│  │  ├─ PUZZLE ← (YOUR EXAMPLE)
│  │  ├─ DRAG_DROP
│  │  ├─ CODING
│  │  ├─ IMAGE_BASED
│  │  └─ AUDIO_BASED
│  │
│  ├─ Advanced Settings (Optional)
│  │  ├─ Time Limit
│  │  ├─ Passing Score
│  │  ├─ Max Attempts
│  │  ├─ Shuffle
│  │  ├─ Show Explanations
│  │  └─ Partial Scoring
│  │
│  └─ [NEXT →] (Goes to Step 2)
│
├─ STEP 2: QUESTIONS FORM (Dynamic based on Quiz Type from Step 1)
│  │
│  ├─ CREATE QUESTION #1
│  │  │
│  │  ├─ A) FLEXIBLE CONTENT SECTION
│  │  │   (Same for ALL quiz types)
│  │  │  │
│  │  │  └─ [+ Add Content] ← Admin clicks this
│  │  │     │
│  │  │     ├─ Choose Type: Text/Image/Video/Audio
│  │  │     │  │
│  │  │     │  └─ If TEXT:
│  │  │     │     └─ [Textarea for text content]
│  │  │     │
│  │  │     │  └─ If IMAGE:
│  │  │     │     └─ [Text field for image URL]
│  │  │     │
│  │  │     │  └─ If VIDEO:
│  │  │     │     └─ [Text field for video URL]
│  │  │     │
│  │  │     │  └─ If AUDIO:
│  │  │     │     └─ [Text field for audio URL]
│  │  │     │
│  │  │     └─ [✓ Save Content Item]
│  │  │
│  │  │  (Repeat [+ Add Content] for more items)
│  │  │
│  │  ├─ B) ANSWER CONFIGURATION SECTION
│  │  │   (Changes based on quiz type!)
│  │  │  │
│  │  │  │  IF PUZZLE:
│  │  │  │  └─ Items to Order: [piece1, piece2, piece3]
│  │  │  │
│  │  │  │  IF MCQ:
│  │  │  │  └─ Option A: [text]
│  │  │  │     Option B: [text]
│  │  │  │     Option C: [text]
│  │  │  │     Option D: [text]
│  │  │  │     Correct: [Select A/B/C/D]
│  │  │  │
│  │  │  │  IF MATCHING:
│  │  │  │  └─ Left Items: [item1, item2]
│  │  │  │     Right Items: [match1, match2]
│  │  │  │
│  │  │  │  IF DRAG_DROP:
│  │  │  │  └─ Categories: [cat1, cat2]
│  │  │  │     Items: item1:cat1, item2:cat2
│  │  │  │
│  │  │  │  ... (etc for other types)
│  │  │  │
│  │  │  └─ [✓ Save Answer Config]
│  │  │
│  │  ├─ C) QUESTION DETAILS SECTION
│  │  │  │
│  │  │  ├─ Points: [10]
│  │  │  ├─ Hint: [optional text]
│  │  │  └─ Explanation: [optional text]
│  │  │
│  │  └─ Auto-saved
│  │
│  ├─ ADD MORE QUESTIONS
│  │  │
│  │  ├─ [+ New] button ← Click to add Question #2
│  │  │  │
│  │  │  └─ (Repeat Question #1 steps)
│  │  │
│  │  ├─ Question #2
│  │  ├─ Question #3
│  │  └─ ... (unlimited questions)
│  │
│  └─ [SAVE QUIZ] ← Final save
│
└─ END: Quiz Created!
   ✓ Saved to database
   ✓ Ready for students
```

---

## 🎯 PUZZLE ASSEMBLY SPECIFIC FLOW

```
┌─────────────────────────────────────┐
│  ADMIN SELECTS "PUZZLE ASSEMBLY"    │
│  (In Step 1: Quiz Type Dropdown)    │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  STEP 2 NOW SHOWS:                  │
│  "PUZZLE ASSEMBLY ANSWER CONFIG"    │
│  (Not MCQ, Not MATCHING, PUZZLE!)   │
└────────────┬────────────────────────┘
             │
             ▼
        ┌────────────────────────────────┐
        │ Items to Order (comma-sep) *:  │
        │ [  TEXTAREA  ]                 │
        │                                │
        │ Enter items in CORRECT ORDER   │
        │                                │
        │ Example:                       │
        │ Event1, Event2, Event3, Event4 │
        └────────────┬───────────────────┘
                     │
             ▼────────────────▼
    
    Student takes quiz:
    │
    ├─ Sees question with content items
    │  (Text + Image + Instructions)
    │
    ├─ Sees shuffled items/pieces
    │  [Event 3] [Event 1] [Event 4] [Event 2]
    │
    ├─ Drags to arrange in correct order
    │  [Event 1] → [Event 2] → [Event 3] → [Event 4]
    │
    └─ System validates against admin's sequence
       ✓ Correct! Award points
       ✗ Incorrect! Show hint/try again
```

---

## 📋 DECISION TREE: Choosing Quiz Type

```
START: "What do I want students to do?"
│
├─ "Select from options"
│  │
│  ├─ "One option only"
│  │  ├─ "Multiple choice" → MCQ
│  │  └─ "Answer given in audio" → AUDIO_BASED
│  │
│  └─ "Multiple options"
│     └─ "Choose all that apply" → MULTI_SELECT
│
├─ "Type an answer"
│  └─ FILL_BLANK
│
├─ "Choose true or false"
│  └─ TRUE_FALSE
│
├─ "Match relationships"
│  └─ MATCHING
│
├─ "Arrange in sequence"
│  ├─ "Steps/timeline/events" → ORDERING
│  └─ "Puzzle pieces" → PUZZLE ← (YOUR QUESTION)
│
├─ "Categorize items"
│  └─ DRAG_DROP
│
├─ "Write code"
│  └─ CODING
│
├─ "Interact with image"
│  └─ IMAGE_BASED
│
└─ END: Selected appropriate type!
```

---

## 🔄 DATA FLOW: From Admin Input to Student Display

```
ADMIN SIDE:
┌──────────────────────────────────────┐
│ Quiz Type Selection: PUZZLE          │
│ Content Items:                       │
│  • Text: "Arrange events..."         │
│  • Image: "timeline.jpg"             │
│  • Text: "Chronological order"       │
│                                      │
│ Answer Config:                       │
│  Items: [Event1, Event2, Event3]     │
│  Sequence: [0, 1, 2]                 │
└────────────┬─────────────────────────┘
             │ (Save Quiz)
             ▼
DATABASE:
┌──────────────────────────────────────┐
│ {                                    │
│   id: "quiz_123",                    │
│   type: "PUZZLE",                    │
│   questions: [                       │
│     {                                │
│       contentItems: [...],           │
│       answer: {                      │
│         pieces: ["E1", "E2", "E3"],  │
│         correctSequence: [0, 1, 2]   │
│       }                              │
│     }                                │
│   ]                                  │
│ }                                    │
└────────────┬─────────────────────────┘
             │ (Student takes quiz)
             ▼
STUDENT SIDE:
┌──────────────────────────────────────┐
│ Question Content:                    │
│  • Text: "Arrange events..."         │
│  • Image: [Timeline displayed]       │
│  • Text: "Chronological order"       │
│                                      │
│ Student Interface:                   │
│  [E3] [E1] [E2] (Shuffled)           │
│                                      │
│  Drag to: [ ] [ ] [ ]                │
│           [E1] [E2] [E3] ← Correct   │
│                                      │
│ Result: ✓ Correct!                   │
└──────────────────────────────────────┘
```

---

## 📊 Admin Form Layout by Quiz Type

```
═══════════════════════════════════════════════════════════════
ALL QUIZ TYPES (Step 1 - SAME)
───────────────────────────────────────────────────────────────
┌─────────────────────────────────────┐
│ Title:      [________________]      │
│ Audience:   [Dropdown ▼]            │
│ Category:   [Dropdown ▼]            │
│ Level:      [Dropdown ▼]            │
│ Quiz Type:  [Dropdown ▼] ← KEY!     │
└─────────────────────────────────────┘
            [NEXT →]

═══════════════════════════════════════════════════════════════
Step 2 Content (ALL TYPES - SAME)
───────────────────────────────────────────────────────────────
[+ Add Content] [+ Add Content] [+ Add Content]
     TEXT           IMAGE          VIDEO/AUDIO

All questions have flexible content!

═══════════════════════════════════════════════════════════════
Step 2 Answer Config (TYPE-SPECIFIC)
───────────────────────────────────────────────────────────────

IF Quiz Type = MCQ:
┌──────────────────────────────────────┐
│ Option A: [______________]           │
│ Option B: [______________]           │
│ Option C: [______________]           │
│ Option D: [______________]           │
│ Correct:  [Dropdown: A/B/C/D]        │
└──────────────────────────────────────┘

IF Quiz Type = PUZZLE:
┌──────────────────────────────────────┐
│ Items to Order (comma-separated):    │
│ [                                    │
│   piece1, piece2, piece3, piece4    │
│ ]                                    │
└──────────────────────────────────────┘

IF Quiz Type = MATCHING:
┌──────────────────────────────────────┐
│ Left Items:                          │
│ [item1, item2, item3, item4]         │
│                                      │
│ Right Items (paired order):          │
│ [match1, match2, match3, match4]     │
└──────────────────────────────────────┘

IF Quiz Type = DRAG_DROP:
┌──────────────────────────────────────┐
│ Categories:                          │
│ [cat1, cat2, cat3]                   │
│                                      │
│ Items (format: item:category):       │
│ [                                    │
│   apple:cat1                         │
│   banana:cat1                        │
│   carrot:cat2                        │
│ ]                                    │
└──────────────────────────────────────┘

... (8 more types with different forms)
```

---

## 🔄 Component Hierarchy

```
AdminQuizBuilder (Root)
│
├─ useState: currentStep (1 or 2)
├─ useState: quiz (full quiz data)
│
├─ Conditional Render:
│  │
│  ├─ IF currentStep === 1:
│  │  └─ QuizMetadataStep
│  │     ├─ Displays Step 1 form
│  │     ├─ Handles: Title, Category, Level, Audience
│  │     ├─ Dropdown: Quiz Type (MCQ, PUZZLE, etc.)
│  │     └─ Button: [NEXT] → setCurrentStep(2)
│  │
│  └─ IF currentStep === 2:
│     └─ QuestionEditorStep
│        ├─ Question List Sidebar
│        │  └─ Tab for each question
│        │
│        └─ Question Editor (if question selected)
│           ├─ ContentItemsSection
│           │  ├─ [+ Add Content] button
│           │  └─ For each content item:
│           │     ├─ Type selector (Text/Image/Video/Audio)
│           │     └─ Content input (textarea/URL field)
│           │
│           └─ QuizTypeAnswerForm
│              ├─ Switch on quiz.quizType:
│              │
│              │  case "MCQ":
│              │  └─ Option A, B, C, D fields
│              │     Correct option dropdown
│              │
│              │  case "PUZZLE":
│              │  └─ Items to Order textarea
│              │
│              │  case "MATCHING":
│              │  └─ Left items, Right items textareas
│              │
│              │  case "CODING":
│              │  └─ Language select
│              │     Code template textarea
│              │     Test cases textarea
│              │
│              │  ... (8 more cases)
│              │
│              └─ Each case renders
│                 appropriate form fields
```

---

## 📈 State Flow Example: Puzzle Assembly

```
INITIAL STATE:
{
  currentStep: 1,
  quiz: {
    id: "quiz_123",
    title: "",
    quizType: "MCQ" (default),
    questions: []
  }
}

AFTER METADATA FILL:
{
  currentStep: 1,
  quiz: {
    id: "quiz_123",
    title: "Historical Events",
    quizType: "PUZZLE", ← CHANGED!
    category: "History",
    level: "Intermediate",
    audience: "Students",
    questions: []
  }
}
        ↓
    [NEXT CLICKED]
        ↓
{
  currentStep: 2, ← NOW SHOWS PUZZLE FORM
  quiz: { ... }
}

AFTER ADDING QUESTION:
{
  currentStep: 2,
  quiz: {
    ...
    questions: [
      {
        id: "q_456",
        quizType: "PUZZLE", ← Matches quiz type
        question: {
          contentItems: [
            { type: "text", value: "Arrange events..." }
          ]
        },
        answer: {
          pieces: ["Event1", "Event2", ...],
          correctSequence: [0, 1, 2, ...]
        },
        points: 10
      }
    ]
  }
}

AFTER SAVE:
{
  ✓ Quiz saved to database
  ✓ ID: "quiz_123"
  ✓ Type: "PUZZLE"
  ✓ Questions: 3
  ✓ Status: Ready for students
}
```

---

## 🎓 Render Path: Puzzle Assembly Question

```
QuestionEditorStep renders
    ↓
currentQuestion = quiz.questions[0]
currentQuestion.quizType = "PUZZLE"
    ↓
QuizTypeAnswerForm called
    ↓
renderAnswerFields() function
    ↓
switch(question.quizType)
    ↓
case "PUZZLE":
    ↓
Returns:
┌──────────────────────────────────┐
│ <div>                            │
│   <div className="form-group">   │
│     <label>Items to Order...</label>
│     <textarea                    │
│       placeholder="Enter items..." 
│       value={answer?.items}      │
│       onChange={...}             │
│     />                           │
│   </div>                         │
│ </div>                           │
└──────────────────────────────────┘
```

---

## 📱 Mobile Responsiveness

```
Desktop (1200px+):
┌─────────────────────────────────┐
│ Quiz Details | Flexible Content │
│             | Answer Form       │
└─────────────────────────────────┘

Tablet (768px-1200px):
┌─────────────────────────────────┐
│ Quiz Details                     │
├─────────────────────────────────┤
│ Flexible Content                 │
├─────────────────────────────────┤
│ Answer Form                      │
└─────────────────────────────────┘

Mobile (< 768px):
┌──────────────┐
│ Quiz Details │
├──────────────┤
│ Flexible     │
│ Content      │
├──────────────┤
│ Answer Form  │
├──────────────┤
│ Save Button  │
└──────────────┘
```

