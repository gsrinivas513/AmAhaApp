---
sidebar_position: 2
title: Quiz Management
---

# Quiz Management

This page details the complete quiz creation and management workflow in AmAha's admin panel.

## Quiz Creation Basics

### Start Creating a Quiz

```
[Admin Panel] → [Create Content] → [+ New Quiz]
```

**Three ways to create:**

1. **From Scratch** - Build completely new quiz
2. **From Template** - Use predefined structure
3. **From Existing** - Duplicate and modify

---

## Quiz Builder Interface

### Step 1: Basic Information

```
┌─────────────────────────────────────┐
│ New Quiz                            │
├─────────────────────────────────────┤
│                                     │
│ Title * [                         ] │
│ Description                         │
│ [                                   │
│  Write a brief explanation of      │
│  what this quiz covers              │
│ ]                                   │
│                                     │
│ Subject * [Biology             ▼]  │
│ Grade Level * [6-8             ▼]  │
│                                     │
│ Content Tags                        │
│ [Add tags...] (photosynthesis...)  │
│                                     │
│ Featured Image (Optional)           │
│ [Upload Image]                      │
│                                     │
│ [Save as Draft] [Continue →]        │
└─────────────────────────────────────┘
```

**Required Fields:**
- Title (required)
- Subject (required)
- Grade Level (required)
- Description (recommended)

### Step 2: Quiz Type Selection

```
┌─────────────────────────────────────┐
│ Select Quiz Type                    │
├─────────────────────────────────────┤
│                                     │
│ Selection-Based (3 types):          │
│ ☑ MCQ (Multiple Choice)             │
│ ○ True/False                        │
│ ○ Multi-Select                      │
│                                     │
│ Input-Based (2 types):              │
│ ○ Fill in Blank                     │
│ ○ Short Answer                      │
│                                     │
│ Matching & Logic (3 types):         │
│ ○ Matching                          │
│ ○ Ordering                          │
│ ○ Image-Based                       │
│                                     │
│ Media-Based (3 types):              │
│ ○ Audio-Based                       │
│ ○ Puzzle (Jigsaw)                   │
│ ○ Drag & Drop                       │
│                                     │
│ [Next: Add Questions →]             │
└─────────────────────────────────────┘
```

### Step 3: Add Questions

#### MCQ Question Builder

```
┌─────────────────────────────────────┐
│ Question 1 - Multiple Choice        │
├─────────────────────────────────────┤
│                                     │
│ Question Text *                     │
│ [What is photosynthesis?          ] │
│                                     │
│ Answer Options:                     │
│                                     │
│ Option 1 *                          │
│ ☑ [The process plants use light   ] │
│    (This is marked CORRECT)         │
│                                     │
│ Option 2                            │
│ ○ [The breakdown of glucose       ] │
│    [Mark as correct]                │
│                                     │
│ Option 3                            │
│ ○ [Water absorption by roots      ] │
│    [Mark as correct]                │
│                                     │
│ Option 4                            │
│ ○ [Release of oxygen by leaves    ] │
│    [Mark as correct]                │
│                                     │
│ [+ Add Option]                      │
│                                     │
│ Explanation (Why is it correct?)    │
│ [Photosynthesis is the process   ] │
│                                     │
│ Hint (Optional)                     │
│ [Think about what plants need...  ] │
│                                     │
│ Add Media:                          │
│ [Add Image] [Add Audio]             │
│ [Add Video]                         │
│                                     │
│ [+ Add Question] [Save Question]    │
└─────────────────────────────────────┘
```

#### Fill-in-Blank Question

```
┌─────────────────────────────────────┐
│ Question 2 - Fill in the Blank      │
├─────────────────────────────────────┤
│                                     │
│ Question Text *                     │
│ [Plants convert light into energy ] │
│ [through a process called ________] │
│                                     │
│ Accepted Answers (All valid):       │
│ [photosynthesis              ]      │
│ [Photosynthesis              ]      │
│ [photo-synthesis             ]      │
│ [+ Add another accepted answer]     │
│                                     │
│ Explanation                         │
│ [The correct answer is...        ]  │
│                                     │
│ Hint                                │
│ [It starts with 'P'...           ]  │
│                                     │
│ Case Sensitive: ○ Yes ☑ No         │
│ Exact Match: ○ Yes ☑ No (Fuzzy)   │
│                                     │
│ [Save Question]                     │
└─────────────────────────────────────┘
```

### Step 4: Organize by Difficulty

```
┌─────────────────────────────────────┐
│ Quiz Variants                       │
├─────────────────────────────────────┤
│                                     │
│ EASY (3-5 questions recommended)    │
│ ☑ Question 1 ✓                      │
│ ☑ Question 2 ✓                      │
│ [ ] Question 3                      │
│ [ ] Question 4                      │
│                                     │
│ MEDIUM (4-6 questions recommended)  │
│ ☑ Question 1                        │
│ ☑ Question 2                        │
│ ☑ Question 3 ✓                      │
│ ☑ Question 4 ✓                      │
│ [ ] Question 5                      │
│                                     │
│ HARD (5-7 questions recommended)    │
│ ☑ Question 1                        │
│ ☑ Question 2                        │
│ ☑ Question 3                        │
│ ☑ Question 4                        │
│ ☑ Question 5 ✓                      │
│ ☑ Question 6 ✓                      │
│                                     │
│ EXPERT (6-8 questions recommended)  │
│ (Same as Hard, for now)             │
│                                     │
│ Validation:                         │
│ ✓ Easy: 3 questions (OK)            │
│ ✓ Medium: 5 questions (OK)          │
│ ✓ Hard: 6 questions (OK)            │
│ ! Expert: Same as Hard (consider    │
│   making unique)                    │
│                                     │
│ [Continue →]                        │
└─────────────────────────────────────┘
```

### Step 5: Metadata & Settings

```
┌─────────────────────────────────────┐
│ Quiz Settings                       │
├─────────────────────────────────────┤
│                                     │
│ TIMING                              │
│ Time Limit per Question: ○ None     │
│                         ☑ 90 seconds│
│ Total Quiz Time Limit: ○ None       │
│                        ○ 30 minutes │
│                                     │
│ BEHAVIOR                            │
│ Show One Question at a Time: ☑ Yes  │
│ Allow Skipping: ☑ Yes               │
│ Allow Review: ☑ Yes (after complete)│
│ Immediate Feedback: ☑ Yes           │
│ Show Correct Answer: ☑ Yes (after)  │
│ Allow Retakes: ☑ Unlimited          │
│                                     │
│ HINTS                               │
│ Hints Available: ☑ Yes              │
│ Hints Per Question: [Unlimited  ▼]  │
│ Score Impact: [No penalty       ▼]  │
│                                     │
│ RANDOMIZATION                       │
│ Randomize Questions: ○ Yes ☑ No    │
│ Randomize Options: ○ Yes ☑ No      │
│ Same Random for all: ☑ Yes          │
│                                     │
│ ACCESSIBILITY                       │
│ High Contrast Mode: ☑ Available     │
│ Dyslexia Font: ☑ Available          │
│ Screen Reader Optimized: ☑ Yes      │
│                                     │
│ [Save Settings] [Continue →]        │
└─────────────────────────────────────┘
```

### Step 6: Preview & Publish

```
┌─────────────────────────────────────┐
│ PREVIEW - Quiz Preview              │
│ (See exactly as students see)       │
├─────────────────────────────────────┤
│                                     │
│ [Try Easy] [Try Medium] [Try Hard]  │
│                                     │
│ Mobile Preview: [View on Mobile]    │
│                                     │
│ Stats:                              │
│ • Total Questions: 17               │
│ • Est. Time: 12 minutes             │
│ • Media: 3 images, 1 audio          │
│ • Accessibility: ✓ Verified WCAG AA │
│                                     │
│ [Back to Edit] [Publish Now]        │
└─────────────────────────────────────┘
```

---

## Quiz Management Dashboard

### View All Quizzes

```
[My Quizzes] → Sorted by Recently Modified

┌─────────────────────────────────────────────┐
│ Photosynthesis Quiz (MCQ)                   │
├─────────────────────────────────────────────┤
│ • Status: Published                         │
│ • Created: Jan 10, 2024                     │
│ • Modified: Jan 15, 2024                    │
│ • Used in: 12 assignments (234 students)    │
│ • Avg Score: 82%                            │
│ • Rating: 4.5/5 ⭐                         │
│ • Views: 456                                │
│                                             │
│ Actions:                                    │
│ [Edit] [Preview] [Analytics] [Assign]       │
│ [Duplicate] [Share] [Delete] [More]         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Cell Structure Quiz (MCQ)                   │
├─────────────────────────────────────────────┤
│ • Status: Draft (Not Published)             │
│ • Created: Jan 5, 2024                      │
│ • Completion: 85% (3 questions to add)      │
│                                             │
│ [Continue Creating] [Preview] [Delete]      │
└─────────────────────────────────────────────┘
```

### Quiz Analytics

```
[Quiz Analytics: Photosynthesis Quiz]

├─ Usage Statistics:
│  ├─ Total Times Taken: 234
│  ├─ This Week: 45
│  ├─ This Month: 126
│  ├─ Unique Students: 156
│
├─ Performance Metrics:
│  ├─ Average Score: 82%
│  ├─ Median Score: 85%
│  ├─ Completion Rate: 98%
│  ├─ Average Time: 12 min 34 sec
│  └─ [Graph of score distribution]
│
├─ Difficulty Analytics:
│  ├─ Easy: Avg 91% (n=67)
│  ├─ Medium: Avg 82% (n=124)
│  ├─ Hard: Avg 68% (n=32)
│  └─ Expert: Avg 54% (n=11)
│
├─ Question-Level Data:
│  ├─ Q1: 94% correct (Easy)
│  ├─ Q2: 87% correct (OK)
│  ├─ Q3: 71% correct ⚠ Many struggle
│  ├─ Q4: 89% correct (OK)
│  └─ Q5: 79% correct (OK)
│
└─ Recommendations:
   ├─ "Q3 is too difficult, consider revision"
   └─ "Consider moving Q3 to Hard difficulty"
```

---

## Quiz Editing & Updates

### Editing Published Quiz

```
[Edit: Photosynthesis Quiz]

Changes Allowed (Without Affecting Results):
✓ Question explanations
✓ Hints
✓ Quiz description
✓ Tags & metadata
✓ Add questions
✗ Remove questions (would break existing attempts)
✗ Modify answer options (affects grading)

Edit Mode:
├─ [Edit Questions] (See warnings)
├─ [Update Metadata]
├─ [Preview Changes]
└─ [Save] [Cancel]

After Save:
├─ Option 1: Apply to new attempts only
├─ Option 2: Update all existing grades
│  (Warning: May change pass/fail status)
└─ [Choose and confirm]
```

### Versioning

```
[Quiz Versions: Photosynthesis Quiz]

├─ Version 2 (Current - Published)
│  ├─ Modified: Jan 15, 2024, 2:30 PM
│  ├─ Changes: Added Q4, revised explanation
│  ├─ Attempts: 47
│  └─ [View] [Revert] [Delete]
│
├─ Version 1 (Published)
│  ├─ Created: Jan 10, 2024
│  ├─ Attempts: 187
│  └─ [View] [Revert]
│
└─ Drafts: 0
```

---

## Duplicating & Customizing

```
[Duplicate Quiz: Photosynthesis Quiz]

Create a new quiz based on this one.

New Quiz Title:
[Photosynthesis Quiz - Advanced Edition]

Changes to Make:
□ Keep difficulty levels as-is
☑ Adjust difficulty (move questions around)
☑ Change grade level: [6-8 ▼] → [9-12 ▼]
☑ Add new questions: [+ Add blank questions]

[Create Duplicate]
```

---

## Best Practices

### Creating Effective Quizzes

✓ **DO:**
- Clear, specific questions
- Good quality images
- Helpful explanations
- Appropriate difficulty spread
- Test different knowledge levels
- Use variety of question types
- Ensure accessibility (captions, alt text)

✗ **DON'T:**
- Ambiguous questions
- Overly long (10+ questions for short lesson)
- Too easy (all questions trivial)
- Poor grammar/spelling
- Misleading options
- Trick questions (educational context)
- Jargon without explanation

### Testing Your Quiz

Before publishing:
1. Take it yourself (all difficulties)
2. Check on mobile
3. Test accessibility
4. Time yourself
5. Get peer feedback
6. Check for errors
7. Verify all links work

---

**Next:** [Content Workflow](content-workflow) or [Admin Overview](overview)
