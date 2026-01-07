# Complete Quiz Creation Workflow Guide

## Overview
The Quiz Builder follows a **2-Step Process**:
1. **Step 1: Quiz Details** - Set metadata (title, category, level, audience, time limits, etc.)
2. **Step 2: Questions** - Add questions with flexible content and type-specific answers

---

## Example: Creating a "Puzzle Assembly" Quiz

### Step 1: Quiz Details

Admin fills in these fields:
```
Quiz Title *:              "Historical Timeline Puzzle"
Audience *:                "Students"
Category *:                "History"
Level *:                   "Intermediate"
Quiz Type *:               "Puzzle Assembly"  ← Selected here
Description:               "Arrange historical events in chronological order"
Time Limit (minutes):      30
Total Points:              100
Passing Score (%):         70
Shuffle Questions:         ✓ (checked)
Allow Partial Scoring:     ☐ (unchecked)
Show Explanations:         ✓ (checked)
Max Attempts:              3
```

### Step 2: Add Questions

#### Adding Question #1

**A. Add Content Items** (Question presentation - any order, any combination)

Admin can add these in ANY order:
1. **📄 Text**: "Arrange these historical events in chronological order:"
2. **🖼️ Image**: [URL to historical timeline image]
3. **📝 Additional Text**: "Complete the sequence from earliest to latest"

Click **+ Add Content** for each item needed.

**B. Configure Answer** (Puzzle-specific answer setup)

For "Puzzle Assembly", the admin sees:
```
Items to Order (comma-separated) *
[Textarea with items in CORRECT order]

Example:
Ancient Rome Founded,Rome Collapses,Medieval Period Begins,Renaissance Starts,Modern Era Begins
```

The admin enters the puzzle pieces/events in the **correct sequence**.

**C. Question Details**
```
Points:              10
Hint:                "Think about the fall of Rome..."
Explanation:         "Ancient Rome was founded in 753 BC..."
```

#### Adding Question #2, #3, etc.

Admin clicks **+ New** to add more questions with same or different content types.

---

## Quiz Type-Specific Workflows

### 📋 1. MCQ (Multiple Choice)

**Step 2: Answer Configuration**
```
Define Options First:
Option A: [Paris]
Option B: [London]
Option C: [Berlin]
Option D: [Madrid]

Then Select Correct Option: [Option A]
```

---

### ✓ 2. MULTI_SELECT (Multiple Answer)

**Step 2: Answer Configuration**
```
Define Options First:
Option A: [Apple - Fruit]
Option B: [Carrot - Vegetable]
Option C: [Banana - Fruit]
Option D: [Spinach - Vegetable]

Select Correct Options (Multiple) * :
☑ Option A (Fruit)
☐ Option B
☑ Option C (Fruit)
☐ Option D
```

---

### ✓✓ 3. TRUE/FALSE

**Step 2: Answer Configuration**
```
Correct Answer *:
[Dropdown: True / False]
```

Simple binary choice.

---

### 📝 4. FILL_BLANK (Fill in the Blank)

**Step 2: Answer Configuration**
```
Correct Answers (comma-separated) *:
[Paris, Lutèce, City of Light]

☑ Case sensitive
☑ Allow fuzzy matching
```

Multiple acceptable answers with optional case sensitivity and fuzzy matching.

---

### 🔗 5. MATCHING (Matching Pairs)

**Step 2: Answer Configuration**
```
Left Column Items (comma-separated) *:
[Cat, Dog, Bird, Fish]

Right Column Items (same order as correct pairs) *:
[Meow, Bark, Chirp, Blub]
```

The admin defines which left items match with which right items by entering them in paired order.

---

### 📊 6. ORDERING (Sequence Ordering)

**Step 2: Answer Configuration**
```
Items to Order (comma-separated) *:
[First, Second, Third, Fourth, Fifth]
```

Admin enters items in the **correct order** (from 1st to last).

---

### 🧩 7. PUZZLE (Puzzle Assembly)

**Step 2: Answer Configuration**
```
Items to Order (comma-separated) *:
[Piece 1, Piece 2, Piece 3, Piece 4]
```

Similar to ORDERING but typically for puzzle pieces. Items entered in **correct assembly sequence**.

---

### 🎯 8. DRAG_DROP (Drag & Drop)

**Step 2: Answer Configuration**
```
Categories (comma-separated) *:
[Fruits, Vegetables, Proteins]

Available Items (format: item:category) *:
[Apple:Fruits]
[Banana:Fruits]
[Carrot:Vegetables]
[Chicken:Proteins]
[Broccoli:Vegetables]
```

Format: `itemName:categoryName` on each line.

---

### 💻 9. CODING (Code Challenge)

**Step 2: Answer Configuration**
```
Programming Language *:
[JavaScript ▼] (Options: JavaScript, Python, Java, C++, C#)

Code Template:
function factorial(n) {
  // Write your solution here
}

Test Cases (format: input|output) *:
[5|120]
[4|24]
[3|6]
```

Each test case: `input|expectedOutput`

---

### 🖼️ 10. IMAGE_BASED (Image Selection)

**Step 2: Answer Configuration**
```
Region X (pixel) *:        [150]
Region Y (pixel) *:        [200]
Region Width (pixel) *:    [300]
Region Height (pixel) *:   [250]
Tolerance (pixel) *:       [10]
```

Admin specifies the clickable region in the image with pixel coordinates.

---

### 🎵 11. AUDIO_BASED (Audio Listening)

**Step 2: Answer Configuration**
```
Define Options First:
Option A: [Jazz]
Option B: [Rock]
Option C: [Classical]
Option D: [Blues]

Then Select Correct Option: [Option A]
```

Same as MCQ, but typically with audio in the question content items.

---

## Complete Creation Flow for Puzzle Assembly

### ✅ Step 1: Quiz Details
1. Admin fills in metadata
2. Selects "Puzzle Assembly" as quiz type
3. Clicks **Next** → Goes to Step 2

### ✅ Step 2: Questions
1. Click **+ Add Question**
2. Add content items:
   - Click **+ Add Content** 
   - Select type (Text/Image/Video/Audio)
   - Add content
   - Repeat for multiple items
3. Fill answer configuration:
   - Enter puzzle pieces/events in correct order (comma-separated)
4. Set question details (points, hint, explanation)
5. Click **+ New** to add more questions
6. Click **Save Quiz** when done

### ✅ Result
Quiz created with:
- Complete metadata
- Multiple questions with flexible presentation
- Type-specific answer validation
- Ready for students to take

---

## Key Features

### Flexible Content Per Question
- Add **any number** of content items
- Mix **text, images, videos, audio** in any order
- Remove items individually

### Type-Specific Answer Forms
- Each quiz type has optimized answer configuration
- Smart defaults based on quiz type
- Validation ensures data consistency

### Multi-Question Support
- Add unlimited questions
- Each question can have different settings
- Delete questions easily

### Metadata Control
- Time limits, passing scores, attempt limits
- Shuffle options, partial scoring
- Explanation display settings

---

## Pro Tips

✨ **For Puzzle Assembly:**
- Use descriptive text in content items explaining what to arrange
- Include context/instructions as first content item
- Provide hints for complex sequences
- Test with actual puzzle order before saving

✨ **For Drag & Drop:**
- Keep categories clear and distinct
- Use consistent naming in items
- Test that item-category mapping is correct

✨ **For Matching:**
- Ensure left and right items count matches
- Order right items to correspond with left items
- Use consistent terminology

✨ **For Coding:**
- Provide clear test cases
- Include code template with placeholders
- Add detailed explanation of expected behavior

