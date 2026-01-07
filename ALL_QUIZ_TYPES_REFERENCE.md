# All 11 Quiz Types - Quick Reference Table

## 📋 Quiz Type Comparison Matrix

| Quiz Type | Admin Input | Student Interaction | Answer Format | Example | Points |
|-----------|-------------|-------------------|----------------|---------|--------|
| **MCQ** | 4 Options (A-D) + Select correct | Click one option | Single selection | "What is 2+2?" → B | 10 |
| **MULTI_SELECT** | 4 Options + Check multiple correct | Click multiple options | Multiple checkboxes | "Select all mammals" → [A, C] | 15 |
| **TRUE_FALSE** | Choose True or False | Click True or False | Binary choice | "Earth is round?" → True | 5 |
| **FILL_BLANK** | Acceptable answers (comma-separated) | Type answer in text box | Text input | "Capital of France?" → Paris | 10 |
| **MATCHING** | Left items + Right items (paired) | Match left to right | Pairing arrows | Cat→Meow, Dog→Bark | 20 |
| **ORDERING** | Items in correct sequence | Drag items to arrange | Ordered sequence | Steps: A→B→C→D | 15 |
| **PUZZLE** | Puzzle pieces in sequence | Drag pieces to arrange | Ordered pieces | Assemble 4 pieces | 20 |
| **DRAG_DROP** | Categories + Items:Category | Drag items to categories | Category mapping | apple→Fruit, carrot→Vegetable | 25 |
| **CODING** | Language + Code template + Test cases | Write code in editor | Code execution | Input: 5 → Output: 120 | 50 |
| **IMAGE_BASED** | Image URL + Region coordinates | Click/mark region in image | Pixel coordinates | Click capital in map | 10 |
| **AUDIO_BASED** | Audio URL + 4 Options (A-D) + correct | Listen + Click option | Single selection | Hear: "Meow" → A (Cat) | 10 |

---

## 🔍 Detailed Breakdown by Quiz Type

### 1️⃣ MCQ (Multiple Choice Question)

**Category:** Basic  
**Difficulty:** Simple  
**Best For:** Knowledge recall, basic comprehension

**Admin Steps:**
```
1. Define 4 Options: A, B, C, D
2. Select which option is correct (A/B/C/D)
3. Optional: Add content items with text/images/videos
```

**Student Experience:**
- Reads question (text/image/video)
- Selects one option from 4 choices
- Immediate feedback on correctness

**Answer Validation:** Exact match with correct option

---

### 2️⃣ MULTI_SELECT (Multiple Answer)

**Category:** Intermediate  
**Difficulty:** Medium  
**Best For:** Complex concepts with multiple valid answers

**Admin Steps:**
```
1. Define 4 Options: A, B, C, D
2. CHECK all options that are correct (multiple)
3. Optional: Content items
```

**Student Experience:**
- Reads question
- Selects ALL correct answers (not just one)
- Penalized for incorrect selections

**Answer Validation:** All correct options selected, no incorrect ones

---

### 3️⃣ TRUE_FALSE

**Category:** Basic  
**Difficulty:** Simple  
**Best For:** Binary statements, quick assessment

**Admin Steps:**
```
1. Select: True or False (dropdown)
2. That's it!
```

**Student Experience:**
- Reads statement
- Chooses: True or False
- Very fast format

**Answer Validation:** Boolean comparison

---

### 4️⃣ FILL_BLANK (Fill in the Blank)

**Category:** Intermediate  
**Difficulty:** Medium  
**Best For:** Vocabulary, precise knowledge, open-ended answers

**Admin Steps:**
```
1. Enter correct answers (comma-separated)
   Examples: Paris, Lutèce, City of Light
2. Toggle: Case Sensitive? 
3. Toggle: Fuzzy Match? (handles typos)
```

**Student Experience:**
- Reads question with blank
- Types answer in text field
- System checks against all acceptable answers

**Answer Validation:** Fuzzy matching with configurable strictness

---

### 5️⃣ MATCHING (Matching Pairs)

**Category:** Intermediate  
**Difficulty:** Medium  
**Best For:** Relationships, definitions, associations

**Admin Steps:**
```
1. Enter Left Items: Cat, Dog, Bird, Fish
2. Enter Right Items in CORRESPONDING order:
   Meow, Bark, Chirp, Blub
   (First left matches first right, etc.)
```

**Student Experience:**
- Left column: Items to match FROM
- Right column: Items to match TO
- Drag or click to create matches
- All pairs must be correct

**Answer Validation:** All pairs correctly matched

---

### 6️⃣ ORDERING (Sequence Ordering)

**Category:** Intermediate  
**Difficulty:** Medium  
**Best For:** Processes, timelines, ranking

**Admin Steps:**
```
1. Enter items in CORRECT ORDER (comma-separated):
   First, Second, Third, Fourth, Fifth
```

**Student Experience:**
- See 5 mixed-up items
- Drag them to arrange in correct sequence
- Submit when in correct order

**Answer Validation:** Exact sequence match

---

### 7️⃣ PUZZLE (Puzzle Assembly)

**Category:** Advanced  
**Difficulty:** Complex  
**Best For:** Visual assembly, puzzle pieces, physical arrangement

**Admin Steps:**
```
1. Enter puzzle pieces in CORRECT ORDER:
   Piece_1, Piece_2, Piece_3, Piece_4
2. Can add image of completed puzzle in content
```

**Student Experience:**
- See puzzle pieces scattered
- Drag pieces to assemble correct configuration
- Get visual feedback as pieces connect

**Answer Validation:** Correct assembly sequence

---

### 8️⃣ DRAG_DROP (Drag & Drop Categorization)

**Category:** Advanced  
**Difficulty:** Complex  
**Best For:** Categorization, sorting, organization

**Admin Steps:**
```
1. Enter Categories (comma-separated):
   Fruits, Vegetables, Proteins
2. Enter Items with categories (item:category):
   Apple:Fruits
   Carrot:Vegetables
   Chicken:Proteins
   (One per line)
```

**Student Experience:**
- See items to categorize
- Drag each item to correct category container
- Drop to place
- All must be correctly categorized

**Answer Validation:** Correct category assignment for all items

---

### 9️⃣ CODING (Code Challenge)

**Category:** Advanced  
**Difficulty:** Complex  
**Best For:** Programming skills, algorithm implementation

**Admin Steps:**
```
1. Select Programming Language:
   JavaScript, Python, Java, C++, C#
2. Enter Code Template (with placeholders):
   function factorial(n) { /* ... */ }
3. Enter Test Cases (input|output):
   5|120
   4|24
   3|6
```

**Student Experience:**
- See code editor with template
- Write solution code
- Run against test cases
- Get test results (passed/failed)

**Answer Validation:** Code execution against test cases

---

### 🔟 IMAGE_BASED (Image Selection/Clicking)

**Category:** Advanced  
**Difficulty:** Complex  
**Best For:** Geographic locations, anatomy, architecture

**Admin Steps:**
```
1. Provide image URL (in content item)
2. Define clickable region (coordinates):
   - X: 150 pixels from left
   - Y: 200 pixels from top
   - Width: 300 pixels
   - Height: 250 pixels
   - Tolerance: 10 pixels (clicking accuracy)
```

**Student Experience:**
- See image displayed
- Click or drag to select correct region
- Highlighted area shows their selection
- Compared with acceptable region

**Answer Validation:** Coordinate proximity within tolerance

---

### 1️⃣1️⃣ AUDIO_BASED (Audio Listening)

**Category:** Intermediate  
**Difficulty:** Medium  
**Best For:** Listening comprehension, language learning

**Admin Steps:**
```
1. Add audio URL in content items:
   https://example.com/audio.mp3
2. Define 4 Options: A, B, C, D
3. Select correct option
```

**Student Experience:**
- Audio player visible with play/pause/volume
- Listen to audio (can replay)
- Answer multiple choice question about audio
- E.g., "What animal made this sound?" → A (Cat)

**Answer Validation:** Exact match with correct option

---

## 🎯 Selection Guide: Which Quiz Type to Use?

```
Do you want students to:

✓ Select from options?
  └─→ Single answer? → MCQ
  └─→ Multiple answers? → MULTI_SELECT
  
✓ Type a text answer?
  └─→ FILL_BLANK
  
✓ Decide true/false?
  └─→ TRUE_FALSE
  
✓ Match relationships?
  └─→ MATCHING
  
✓ Arrange in sequence?
  ├─→ Events/steps/timeline? → ORDERING
  ├─→ Puzzle pieces? → PUZZLE
  └─→ Sort by category? → DRAG_DROP
  
✓ Work with code?
  └─→ CODING
  
✓ Interact with image?
  └─→ IMAGE_BASED
  
✓ Listen to audio?
  └─→ AUDIO_BASED
```

---

## 📊 Complexity & Time Investment

### Quick to Create (< 5 min):
- TRUE_FALSE
- MCQ

### Medium (5-10 min):
- MULTI_SELECT
- FILL_BLANK
- MATCHING
- ORDERING
- AUDIO_BASED

### Complex (10-30 min):
- PUZZLE
- DRAG_DROP
- IMAGE_BASED

### Very Complex (30+ min):
- CODING

---

## 💡 Pro Tips for Each Type

### MCQ
- Use clear, distinct options
- Avoid "all of the above" / "none of the above"
- Add images to make it engaging

### MULTI_SELECT
- Ensure multiple correct answers are indeed valid
- Avoid having too many correct options (confusing)
- Use partial scoring if students get some right

### FILL_BLANK
- List all acceptable variations
- Enable fuzzy matching for typo tolerance
- Use case-sensitive only when necessary

### MATCHING
- Keep left and right items count equal
- Use consistent terminology
- Test that your pairing makes sense

### ORDERING / PUZZLE
- Make items clearly distinguishable
- Test the sequence yourself
- Provide visual hints in content items

### DRAG_DROP
- Keep category count 3-5 (manageable)
- Use distinct category names
- Test item-category mapping before saving

### CODING
- Provide clear problem statement
- Include multiple test cases
- Add helpful comments in template
- Test your test cases!

### IMAGE_BASED
- Use high-quality images
- Define regions clearly with visual guides
- Set tolerance appropriately
- Test clicking yourself

### AUDIO_BASED
- Ensure audio quality is good
- Test audio playback in different browsers
- Provide transcript option for accessibility
- Keep questions clearly related to audio

---

## 🔄 Content Items Apply to ALL Types

Every quiz type can have flexible content:

```
Question: "What is 2+2?"

Option 1: 📄 Text
"Solve this math problem"

Option 2: 🖼️ Image
[Visual representation of +2+2]

Option 3: 📝 Text
"Choose the correct answer"

Option 4: 🎵 Audio
[Teacher voice saying "What is two plus two"]

Then: MCQ Answer Form (select A/B/C/D)
```

---

## ✅ Validation Rules

| Type | Min Content | Required Fields | Validation |
|------|-----------|-----------------|------------|
| MCQ | 1 | Options A-D + correct option | Must select one from 4 |
| MULTI_SELECT | 1 | Options + correct options (≥2) | All correct + no incorrect |
| TRUE_FALSE | 1 | Correct answer (T/F) | Must be boolean |
| FILL_BLANK | 1 | Correct answers (≥1) | Fuzzy/exact match |
| MATCHING | 1 | Left + Right (same count) | All pairs correct |
| ORDERING | 1 | Items (≥2) | Exact sequence |
| PUZZLE | 1 | Pieces (≥2) | Exact sequence |
| DRAG_DROP | 1 | Categories + Items | All items in correct category |
| CODING | 1 | Language + Test cases | All tests pass |
| IMAGE_BASED | 1 | Image + Region coords | Within tolerance |
| AUDIO_BASED | 1 | Audio + Options + correct | Exact match |

