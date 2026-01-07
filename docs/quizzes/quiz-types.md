---
sidebar_position: 2
title: Quiz Types
---

# Quiz Types

AmAha supports 11 distinct quiz types, each designed for different learning objectives and content domains.

## All Quiz Types

### 1. MCQ (Multiple Choice Question)

**What it is:** Traditional multiple choice with 4 options

**Best For:** Conceptual knowledge, facts, definitions

**Example:**
```
Q: What is the capital of France?
A) London
B) Paris ✓
C) Berlin
D) Madrid
```

**Interaction:** Click to select answer

**Variants Supported:** All 4 (Easy, Medium, Hard, Expert)

---

### 2. MULTI_SELECT

**What it is:** Select all correct answers (multiple correct options)

**Best For:** Complex topics with multiple right answers, comprehensive understanding

**Example:**
```
Q: Which of these are fruits?
☐ Carrot
☑ Apple ✓
☐ Spinach
☑ Orange ✓
```

**Interaction:** Click checkboxes for each correct answer

**Variants Supported:** All 4

---

### 3. TRUE_FALSE

**What it is:** Binary yes/no questions

**Best For:** Quick validation, true/false statements

**Example:**
```
Q: The Earth is flat.
[True] [False] ✓
```

**Interaction:** Click True or False button

**Variants Supported:** All 4

---

### 4. FILL_BLANK

**What it is:** User types answer in text field

**Best For:** Vocabulary, spelling, exact terms

**Example:**
```
Q: The largest ocean is the ___________
Answer: Pacific ✓
```

**Interaction:** Type text, system validates

**Features:**
- Case-insensitive matching
- Supports multiple acceptable answers
- Partial credit possible

**Variants Supported:** All 4

---

### 5. MATCHING

**What it is:** Connect related items (drag to match)

**Best For:** Relationships, definitions, pairs

**Example:**
```
A) Mitochondria      →  1) Protein synthesis
B) Ribosome          →  2) Energy production ✓
C) Nucleus           →  3) Genetic material ✓
```

**Interaction:** Drag items to match pairs

**Variants Supported:** All 4

---

### 6. ORDERING

**What it is:** Arrange items in correct sequence

**Best For:** Process steps, historical timeline, sequence

**Example:**
```
Q: Arrange these steps in order:
1) Add eggs
2) Mix flour ← should be 1st
3) Heat oven ← should be 2nd
4) Bake ← should be 3rd
```

**Interaction:** Drag to reorder items

**Variants Supported:** All 4

---

### 7. IMAGE_BASED

**What it is:** Question with image/visual element

**Best For:** Visual learning, image identification, diagram interpretation

**Example:**
```
Q: [Image of landmark]
   What is this building?
A) Eiffel Tower ✓
B) Big Ben
C) Statue of Liberty
D) Colosseum
```

**Features:**
- Image is part of question
- Can be MCQ with image
- Supports image clues

**Interaction:** View image, select/type answer

**Variants Supported:** All 4

---

### 8. AUDIO_BASED

**What it is:** Question featuring audio content

**Best For:** Listening comprehension, pronunciation, audio identification

**Example:**
```
Q: [Play audio: "Bonjour"]
   Which language is this?
A) Spanish
B) French ✓
C) German
D) Italian
```

**Features:**
- Audio plays when quiz loads or on click
- Transcript available (optional)
- Can replay multiple times

**Interaction:** Listen to audio, answer question

**Variants Supported:** All 4

---

### 9. PUZZLE

**What it is:** Jigsaw-like puzzle pieces to arrange

**Best For:** Spatial reasoning, visual problem-solving

**Features:**
- Customizable piece count
- Drag pieces into position
- Snap-to-grid alignment
- Difficulty through complexity

**Interaction:** Drag puzzle pieces into grid

**Variants Supported:** All 4

---

### 10. DRAG_DROP

**What it is:** Drag items to correct zones

**Best For:** Categorization, placement, spatial understanding

**Example:**
```
Animals              Foods
[Cow] →  □           [Apple] →  □
[Apple] →  □         [Cow] →  □
```

**Interaction:** Drag items into correct drop zones

**Variants Supported:** All 4

---

### 11. CODING

**What it is:** Simple code completion or output prediction

**Best For:** Programming basics, logic, syntax

**Example:**
```
Q: What is the output?
   x = 5
   print(x * 2)
A) 5
B) 10 ✓
C) 25
D) Error
```

**Features:**
- Code snippet shown as image or text
- Can be prediction or completion
- Validates syntax understanding

**Interaction:** Read code, select/type answer

**Variants Supported:** All 4

---

## Quiz Type Distribution

Current AmAha includes at least one quiz for each type:

| Type | Status | Count |
|------|--------|-------|
| MCQ | ✅ | Multiple |
| MULTI_SELECT | ✅ | Multiple |
| TRUE_FALSE | ✅ | Seeded |
| FILL_BLANK | ✅ | Multiple |
| MATCHING | ✅ | Available |
| ORDERING | ✅ | Available |
| IMAGE_BASED | ✅ | Available |
| AUDIO_BASED | ✅ | Available |
| PUZZLE | ✅ | Available |
| DRAG_DROP | ✅ | Available |
| CODING | ✅ | Available |

## Choosing a Quiz Type

Consider these factors:

| Factor | Consideration |
|--------|----------------|
| **Learning Goal** | What skill does user need? |
| **Content** | Is multimedia needed? |
| **Difficulty** | Can complexity be adjusted? |
| **Engagement** | Does interaction style suit users? |
| **Accessibility** | Can all users interact with this type? |

---

**Next:** Learn about [Question Types](./question-types) and specific question formats
