# 🎯 Quiz Question Format - Visual Overview

## Question Type Support

```
┌─────────────────────────────────────────────────────────────┐
│           QUESTION TYPES SUPPORTED                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1️⃣  TEXT ONLY                                              │
│  ├─ Question: "What is 2+2?"                              │
│  └─ Options: 3|4|5|6 (2-4 options)                         │
│                                                             │
│  2️⃣  TEXT + IMAGE                                           │
│  ├─ Question: "Which color?" + [Flag Image]               │
│  ├─ Image: https://example.com/flag.jpg                   │
│  └─ Options: Red|Blue|Green|Yellow                         │
│                                                             │
│  3️⃣  IMAGE ONLY                                             │
│  ├─ Question: [Landmark Image]                            │
│  └─ Options: France|Germany|Italy|Spain                   │
│                                                             │
│  4️⃣  TRUE/FALSE (2 Options)                                │
│  ├─ Question: "Earth is round"                            │
│  └─ Options: True|False                                    │
│                                                             │
│  5️⃣  WITH OPTION IMAGES                                    │
│  ├─ Question: "Match the flags"                           │
│  ├─ Options: France|Germany|Italy                         │
│  └─ Images: [flag1]|[flag2]|[flag3]                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Options Flexibility

```
Options Supported:
┌──────────────┐
│      2       │  ← Minimum (True/False)
│      3       │  ← Supported
│      4       │  ← Maximum (Standard)
└──────────────┘

NOT supported: 1 or 5+
```

## Bulk Import Flow

```
┌─────────────────┐
│  Admin clicks   │
│ "📤 Bulk Import"│
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│  View CSV Template   │
│   (built-in modal)   │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Prepare CSV data    │
│  (use template)      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  Paste CSV in modal  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────┐
│  Click "📤 Import Data"  │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ System Validates:        │
│ ✓ Question format        │
│ ✓ Option count (2-4)     │
│ ✓ Answer in options      │
│ ✓ Image URLs (HTTPS)     │
│ ✓ Difficulty             │
│ ✓ Category               │
└────────┬─────────────────┘
         │
    Yes  │  No
    ┌────┴─────┐
    ▼          ▼
┌──────┐   ┌──────────┐
│Import│   │ Show     │
│  ✓   │   │ Errors   │
└──────┘   └──────────┘
```

## CSV Format Structure

```
┌────────────────────────────────────────────────────────────┐
│  REQUIRED COLUMNS                                          │
├────────────────────────────────────────────────────────────┤
│ question       | What is the capital?                      │
│ questionType   | text | text-image | image                 │
│ options        | Paris|London|Berlin|Madrid (pipe sep)     │
│ correctAnswer  | Paris (must match option)                 │
│ difficulty     | easy | medium | hard                      │
│ category       | Geography (must exist)                     │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  OPTIONAL COLUMNS                                          │
├────────────────────────────────────────────────────────────┤
│ questionImage  | https://example.com/image.jpg             │
│ images         | url1|url2|url3|url4 (matches option count)│
└────────────────────────────────────────────────────────────┘
```

## CSV Examples

### Example 1: Text Only
```
question,questionType,options,correctAnswer,difficulty,category
What is 2+2?,text,3|4|5|6,4,easy,Math
```

### Example 2: Text + Image
```
question,questionType,questionImage,options,correctAnswer,difficulty,category
Which color?,text-image,https://ex.com/flag.jpg,Red|Blue|Green|Yellow,Red,easy,Vision
```

### Example 3: With Option Images
```
question,questionType,options,images,correctAnswer,difficulty,category
Match flags,text,France|Germany|Italy,https://ex.com/f.jpg|https://ex.com/g.jpg|https://ex.com/i.jpg,France,easy,Geography
```

## Validation Checklist

```
QUESTION VALIDATION
┌─────────────────────────────────────────┐
│ ✓ Text: 5-500 characters               │
│ ✓ Type: text|text-image|image          │
│ ✓ Image required for non-text types    │
│ ✓ Image URLs must be HTTPS             │
└─────────────────────────────────────────┘

OPTIONS VALIDATION
┌─────────────────────────────────────────┐
│ ✓ Count: 2-4 (not 1, not 5+)           │
│ ✓ Length: 1-200 chars each             │
│ ✓ No duplicates                        │
│ ✓ All non-empty                        │
└─────────────────────────────────────────┘

ANSWER VALIDATION
┌─────────────────────────────────────────┐
│ ✓ Must match option exactly            │
│ ✓ Case-insensitive matching            │
│ ✓ Single correct answer                │
└─────────────────────────────────────────┘

METADATA VALIDATION
┌─────────────────────────────────────────┐
│ ✓ Difficulty: easy|medium|hard         │
│ ✓ Category: must exist in database     │
└─────────────────────────────────────────┘
```

## Error Handling

```
ROW 2: Question must be at least 5 characters
       └─ Fix: Add more text to question

ROW 3: Question type must be 'text', 'text-image', or 'image'
       └─ Fix: Use correct type values

ROW 4: Minimum 2 options required (found 1)
       └─ Fix: Add at least 2 options separated by |

ROW 5: Maximum 4 options allowed (found 5)
       └─ Fix: Remove extra options (keep max 4)

ROW 6: Correct answer 'Wrong' not found in options
       └─ Fix: Match answer exactly to one option

ROW 7: Question type 'text-image' requires valid HTTPS image URL
       └─ Fix: Add https:// image URL

ROW 8: Number of option images must match number of options
       └─ Fix: Provide 4 images for 4 options (use | to separate)
```

## Data Structure

```
STORED IN DATABASE (Firestore)
┌────────────────────────────────────────────┐
│ questions collection                       │
├────────────────────────────────────────────┤
│ {                                          │
│   question: "What is 2+2?",               │
│   questionType: "text",                   │
│   questionImage: null,                    │
│   options: [                              │
│     { text: "3", image: null },           │
│     { text: "4", image: null },           │
│     { text: "5", image: null },           │
│     { text: "6", image: null }            │
│   ],                                      │
│   correctAnswer: "4",                     │
│   difficulty: "easy",                     │
│   category: "Math",                       │
│   featureType: "quiz",                    │
│   createdAt: "2025-12-31T...",           │
│   updatedAt: "2025-12-31T..."            │
│ }                                         │
└────────────────────────────────────────────┘
```

## Feature Comparison

```
BEFORE (Old System)
┌──────────────────────────┐
│ ✗ Text only              │
│ ✗ Fixed 4 options        │
│ ✗ No images              │
│ ✗ Limited bulk import    │
└──────────────────────────┘

AFTER (New System)
┌──────────────────────────┐
│ ✓ Text, Text+Image, Image│
│ ✓ 2-4 flexible options   │
│ ✓ Question & option imgs │
│ ✓ Full CSV validation    │
│ ✓ Clear error messages   │
│ ✓ Bulk import ready      │
└──────────────────────────┘
```

## Documentation Map

```
START HERE
    │
    ▼
┌─────────────────────────────────┐
│ QUIZ_QUICK_REFERENCE.md         │ ← One page summary
│ (Quick overview, examples)      │
└────────────┬────────────────────┘
             │
    For detailed info:
    ├─→ QUIZ_BULK_IMPORT_GUIDE.md        (User guide)
    ├─→ QUIZ_QUESTION_FORMAT_SPEC.md     (Technical spec)
    └─→ QUIZ_FORMAT_IMPLEMENTATION.md    (Implementation)
```

## Implementation Status

```
✅ COMPLETED TASKS
┌────────────────────────────────────────────────┐
│ ✓ Enhanced BulkImport.jsx                      │
│ ✓ New validation function (validateQuizQuestion)
│ ✓ Updated import logic                         │
│ ✓ CSV template examples                        │
│ ✓ Created 4 documentation files                │
│ ✓ Verified zero compilation errors             │
│ ✓ Code ready for production                    │
└────────────────────────────────────────────────┘
```

## Quick Start

```
3 STEPS TO START:

1️⃣  Go to Admin → Quizzes Tab
    Click "📤 Bulk Import" button

2️⃣  Click "📋 View CSV Template"
    See examples of all question types

3️⃣  Paste CSV data and click "📤 Import Data"
    System validates and imports automatically
```

## CSV Template Samples

```
TEXT ONLY:
question,questionType,options,correctAnswer,difficulty,category
What is 2+2?,text,3|4|5|6,4,easy,Math

TEXT + IMAGE:
question,questionType,questionImage,options,correctAnswer,difficulty,category
Which color?,text-image,https://ex.com/flag.jpg,Red|Blue|Green|Yellow,Red,easy,Vision

WITH IMAGES:
question,questionType,options,images,correctAnswer,difficulty,category
Match,text,A|B|C,url1|url2|url3,A,easy,Visual

TRUE/FALSE:
question,questionType,options,correctAnswer,difficulty,category
Earth round?,text,True|False,True,easy,Science
```

---

## 🎉 YOU'RE ALL SET!

The quiz question format is now:
- ✅ Fully implemented
- ✅ Well-documented
- ✅ Production ready
- ✅ Easy to use

**Start by reading QUIZ_QUICK_REFERENCE.md!**

