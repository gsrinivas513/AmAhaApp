📍 HOW TO USE IMAGE CROP CONTROLS IN /admin/features

The image crop controls are integrated into the existing 4-step workflow at:
http://localhost:3000/admin/features

================================================================================
STEP-BY-STEP GUIDE
================================================================================

STEP 1️⃣ : FEATURES (Top Section)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Shows list of Features (Quizzes, Puzzles, Games, Stories)
- Click ✏️ EDIT button on any feature
- Feature Modal Opens → No image crop here (features don't have images)
- Click SAVE to continue

STEP 2️⃣ : CATEGORIES (Left Side - After selecting Feature)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Shows categories for selected feature
- Select a category (it highlights in yellow)
- Click ✏️ EDIT button on the category card
- **CATEGORY MODAL OPENS:**

    ┌─────────────────────────────────────────────────────┐
    │ Create/Edit Category Modal                          │
    ├─────────────────────────────────────────────────────┤
    │ • Category Name                                     │
    │ • Display Label                                     │
    │ • Icon                                              │
    │ • Upload Image (or paste URL)                      │
    │                                                     │
    │ 👉 ⚙️ ADJUST IMAGE (CROP/ZOOM) ← CLICK HERE       │
    │    This button ONLY appears after uploading image  │
    │                                                     │
    │ • Color picker (fallback if no image)              │
    │ • Description                                       │
    │ • UI Style/Mode                                     │
    │                                                     │
    │ [UPDATE CATEGORY] [CANCEL]                         │
    └─────────────────────────────────────────────────────┘

    When you click "⚙️ ADJUST IMAGE (CROP/ZOOM)":
    ┌─────────────────────────────────────────────────────┐
    │ 📸 PREVIEW (Card View)                              │
    │ [Image preview showing real-time adjustments]       │
    │                                                     │
    │ 🎯 CROP MODE (Choose one):                          │
    │ ☐ Cover (Fill) ☐ Contain (Fit) ☐ Crop Center     │
    │ ☐ Zoom In      ☐ Zoom Out                          │
    │                                                     │
    │ 🔍 ZOOM LEVEL: [====●============] 1.00x            │
    │                                                     │
    │ 📍 FINE-TUNE POSITION:                              │
    │    Horizontal (X): [===●======] 0px                │
    │    Vertical (Y):   [===●======] 0px                │
    │                                                     │
    │ 💡 Tip: Use "Cover" for best card appearance...    │
    └─────────────────────────────────────────────────────┘

    • Select your preferred crop mode
    • Adjust zoom slider if needed
    • Fine-tune position with offset controls
    • Preview updates in real-time
    • Click "SAVE" to apply changes

STEP 3️⃣ : TOPICS (Right Side - After selecting Category)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Shows topics for selected category
- Click ✏️ EDIT button on any topic
- **TOPIC MODAL OPENS:** (Same layout as Category Modal)
    - Upload/paste topic image
    - Click "⚙️ ADJUST IMAGE (CROP/ZOOM)"
    - Make adjustments and save

STEP 4️⃣ : SUBTOPICS (Right Side - After selecting Topic)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Shows subtopics for selected topic
- Click ✏️ EDIT button on any subtopic
- **SUBTOPIC MODAL OPENS:** (Same layout as Category/Topic Modal)
    - Upload/paste subtopic image
    - Click "⚙️ ADJUST IMAGE (CROP/ZOOM)"
    - Make adjustments and save

================================================================================
VISUAL WORKFLOW
================================================================================

Homepage Layout:
┌───────────────────────────────────────────────────────────┐
│  STEP 1️⃣  STEP 2️⃣ CATEGORIES     │  STEP 3️⃣  │  STEP 4️⃣    │
│  FEATURES │ (Select Feature)       │  TOPICS   │  SUBTOPICS  │
├───────────┼───────────────────────────────────────────────┤
│ Quizzes   │ • Kids         [✏️]    │ • Animals │ • Matching  │
│ Puzzles   │ • Students     [✏️]    │ • Math    │ • Ordering  │
│ Games     │ • Programmers  [✏️]    │ • Science │ • Counting  │
└───────────┴───────────────────────┴───────────┴─────────────┘
            Click ✏️ to open modal with image crop controls ↓
                              │
                              ▼
                    ┌─────────────────────────┐
                    │ MODAL with Crop Controls│
                    │ (See above for details) │
                    └─────────────────────────┘

================================================================================
KEY POINTS TO REMEMBER
================================================================================

✅ Image crop controls are in ALL MODALS:
   - Category Modal (Step 2️⃣)
   - Topic Modal (Step 3️⃣)
   - Subtopic Modal (Step 4️⃣)

✅ The button appears ONLY AFTER uploading an image:
   - Upload image first
   - Then "⚙️ ADJUST IMAGE (CROP/ZOOM)" button appears

✅ 5 Crop Modes Available:
   1. Cover - Fill entire card (may crop edges)
   2. Contain - Show full image (may have gaps)
   3. Crop Center - Focus on center
   4. Zoom In (1.2x) - Enlarge and crop
   5. Zoom Out (0.8x) - Shrink to show more

✅ Additional Controls:
   - Zoom Slider: 0.5x to 2.0x
   - Horizontal Offset: -50px to +50px
   - Vertical Offset: -50px to +50px

✅ Real-Time Preview:
   - See exactly how image looks on card
   - Adjust until satisfied
   - Click SAVE to persist changes

================================================================================
COMMON ISSUES & SOLUTIONS
================================================================================

Q: Why don't I see "⚙️ ADJUST IMAGE" button?
A: You need to upload an image first. The button only appears after image upload.

Q: I edited the category but the image still looks cropped?
A: Make sure you clicked "SAVE" after adjusting the crop settings.

Q: Can I use this for existing categories/topics?
A: Yes! Just click the ✏️ EDIT button, upload image (or it's already there),
   then adjust crop settings and save.

Q: Will changing crop settings affect other categories?
A: No! Each category/topic/subtopic has its own independent crop settings.

================================================================================
