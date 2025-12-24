# Visual Puzzles Implementation Guide

## Overview

This document describes the complete visual puzzle system implemented for AmAha. Puzzles are separate from quizzes and provide visual, interactive, drag-and-drop based games designed for kids.

## 📋 Table of Contents

1. [Architecture](#architecture)
2. [Puzzle Types](#puzzle-types)
3. [Admin Features](#admin-features)
4. [User Experience](#user-experience)
5. [Technical Implementation](#technical-implementation)
6. [Getting Started](#getting-started)

---

## 🏗️ Architecture

### Firestore Collections

**puzzles** - Main puzzle data
```
{
  id: string (auto-generated)
  title: string
  description: string
  difficulty: string (easy | medium | hard)
  ageGroup: string (3-5 | 6-8 | 9-12)
  
  // Hierarchy
  categoryId: string
  categoryName: string
  topicId: string
  topicName: string
  subtopicId: string
  subtopicName: string
  
  // Content
  type: string (picture-word | spot-difference | find-pair | picture-shadow | ordering)
  data: object (type-specific data)
  
  // Metadata
  isPublished: boolean
  xpReward: number
  createdAt: timestamp
  updatedAt: timestamp
}
```

**puzzleProgress** - User progress tracking
```
puzzleProgress/
  {userId}/
    puzzles/
      {puzzleId}: {
        completed: boolean
        attempts: number
        firstCompletedAt: timestamp
        score: number (0-100)
      }
```

### localStorage (Guest Users)

```javascript
{
  "amaha_puzzle_progress": {
    "puzzleId": {
      completed: boolean,
      attempts: number,
      firstCompletedAt: timestamp,
      score: number
    }
  }
}
```

---

## 🎮 Puzzle Types

### 1. Picture-Word Matching (🖼️)
**File**: `src/puzzles/renderers/PictureWordPuzzle.jsx`

Kids match pictures with their corresponding words by clicking or dragging.

**Data Structure**:
```javascript
{
  pairs: [
    { id: string, image: url, word: string }
  ],
  layout: string (grid-2x2 | grid-2x3 | grid-3x3)
}
```

**Features**:
- Click-based or drag-based matching
- Attempts tracking
- Visual feedback on correct matches
- Celebration animation on completion

---

### 2. Spot the Difference (👁️)
**File**: `src/puzzles/renderers/SpotDifferencePuzzle.jsx`

Find the differences between two similar images by clicking on them.

**Data Structure**:
```javascript
{
  imageA: url,
  imageB: url,
  differences: [
    { id: string, x: number (0-100%), y: number (0-100%), radius: number (pixels) }
  ]
}
```

**Features**:
- Click-based difference finding
- Visual markers for found differences
- Difficulty based on number of differences
- Precision-based feedback

---

### 3. Find Matching Pair (🧩)
**File**: `src/puzzles/renderers/FindPairPuzzle.jsx`

Classic memory game - flip cards to find matching pairs.

**Data Structure**:
```javascript
{
  cards: [
    { id: string, image: url }
  ],
  layout: string (grid-2x4 | grid-3x4 | grid-4x4)
}
```

**Features**:
- Card flipping animation
- Pair matching logic
- Shuffled card layout
- Attempt tracking
- Memory improvement focus

---

### 4. Picture-Shadow Matching (🌑)
**File**: `src/puzzles/renderers/PictureShadowPuzzle.jsx`

Match pictures with their corresponding shadows.

**Data Structure**:
```javascript
{
  pairs: [
    { id: string, image: url, shadow: url }
  ]
}
```

**Features**:
- Drag-and-drop matching
- Visual learning about object shapes
- Multiple pair support
- Interactive feedback

---

### 5. Ordering/Sequencing (🔢)
**File**: `src/puzzles/renderers/OrderingPuzzle.jsx`

Arrange items in the correct sequence (numbers, steps, or visual sequence).

**Data Structure**:
```javascript
{
  items: [
    { id: string, image: url, label: string, order: number }
  ],
  itemType: string (numbers | sequence | steps)
}
```

**Features**:
- Drag-and-drop reordering
- Order validation
- Support for multiple sequence types
- Progress visualization

---

## 🎨 Admin Features

### Visual Puzzle Admin Page
**File**: `src/admin/VisualPuzzleAdminPage.jsx`

Complete interface for creating and managing visual puzzles.

#### Features:
1. **Puzzle Type Selection**
   - Radio buttons with icons for each type
   - Type descriptions
   - Visual type indicators

2. **Basic Information**
   - Title (required)
   - Description
   - Difficulty level
   - Age group
   - XP reward

3. **Hierarchy Selection**
   - Category dropdown
   - Topic dropdown (filtered by category)
   - Subtopic dropdown (filtered by topic)

4. **Content Editors**
   - Type-specific puzzle editors
   - Visual preview
   - Image upload (Cloudinary integration)
   - Drag-and-drop support

5. **Publishing**
   - Publish toggle
   - Save functionality

### Puzzle Type Editors

**PictureWordEditor** (`src/admin/puzzle-editors/PictureWordEditor.jsx`)
- Add/remove pairs
- Grid layout selection (2x2, 2x3, 3x3)
- Image upload per pair
- Word/label input

**SpotDifferenceEditor** (`src/admin/puzzle-editors/SpotDifferenceEditor.jsx`)
- Upload two images
- Click-to-mark differences
- Adjust difference radius
- Visual preview

**FindPairEditor** (`src/admin/puzzle-editors/FindPairEditor.jsx`)
- Add cards with images
- Grid layout selection (2x4, 3x4, 4x4)
- Auto-shuffle preview
- Memory game setup

**PictureShadowEditor** (`src/admin/puzzle-editors/PictureShadowEditor.jsx`)
- Add pairs of images and shadows
- Side-by-side preview
- Drag-drop setup visualization

**OrderingEditor** (`src/admin/puzzle-editors/OrderingEditor.jsx`)
- Add items in sequence
- Reorder with up/down buttons
- Image and label per item
- Sequence type selection

---

## 👥 User Experience

### Level Path (Candy Crush Style)
**File**: `src/puzzles/PuzzleLevelPath.jsx`

Visualization of puzzle progression as a level path.

**Features**:
- Circular level bubbles
- Progress connectors between levels
- Lock/unlock mechanism
- Difficulty badges
- Completion tracking
- XP display
- Smooth animations
- Mobile-responsive

### Puzzle Play Flow

1. **Browse Path** → 2x4 grid of puzzle levels
2. **View Level** → Detailed puzzle information
3. **Play Puzzle** → Interactive puzzle experience
4. **Complete** → Celebration animation + progress saved
5. **Unlock Next** → Next level becomes available

---

## 🛠️ Technical Implementation

### Services

**visualPuzzleService.js** - All puzzle operations
```javascript
// Puzzle CRUD
- createVisualPuzzle(puzzleData)
- updateVisualPuzzle(puzzleId, updates)
- getVisualPuzzleById(puzzleId)
- getVisualPuzzlesBySubtopic(subtopicId)
- getVisualPuzzlesByType(type)
- getAllVisualPuzzles()
- deleteVisualPuzzle(puzzleId)

// Progress - Logged-in users
- savePuzzleProgress(puzzleId, progressData)
- getPuzzleProgress(puzzleId)
- getAllPuzzleProgress()

// Progress - Guest users
- saveGuestPuzzleProgress(puzzleId, progressData)
- getGuestPuzzleProgress(puzzleId)
- getAllGuestPuzzleProgress()
- clearGuestPuzzleProgress()
```

### Routes

```
Admin:
- /admin/create-visual-puzzle → VisualPuzzleAdminPage
- /admin/create-visual-puzzle/:puzzleId → Edit existing puzzle

User:
- /puzzle/:categoryName → PuzzleTopicPage (browse topics)
- /puzzle/:categoryName/:topicName → PuzzleSubcategoryPage (browse subtopics)
- /puzzle/:categoryName/:topicName/:subtopicName → PuzzleLevelPath (level selection)
- /puzzle/:categoryName/:topicName/:subtopicName/:puzzleId → VisualPuzzlePlayPage (play)
```

### Styling

**puzzle-admin.css** - Admin interface
- Form styling with gradients
- Grid layouts for editors
- Image preview components
- Type selection cards
- Responsive design

**puzzle-renderers.css** - Puzzle play interface
- Kid-friendly pastel colors
- Rounded cards
- Smooth animations
- Celebration effects
- Touch-friendly sizes
- Mobile-responsive

**puzzle-level-path.css** - Level path visualization
- Candy Crush-style bubbles
- Progress connectors
- Lock indicators
- Difficulty badges
- Responsive grid

---

## 🎯 Color Palette

**Pastel Colors**:
- 🌟 Primary: #667eea (Soft Purple)
- 🌟 Secondary: #764ba2 (Deep Purple)
- 🌟 Success: #84fab0 (Mint Green)
- 🌟 Info: #8fd3f4 (Sky Blue)
- 🌟 Warning: #fcc419 (Soft Yellow)
- 🌟 Danger: #ff6b6b (Light Red)
- 🌟 Background: #ffeaa7, #fab1a0, #fd79a8 (Pastel Mix)

---

## 📱 Mobile Features

- **Touch-friendly**: Large tap targets (44px minimum)
- **Responsive Grid**: Auto-adjusting columns
- **Vertical Layout**: Portrait-first design
- **Simplified Controls**: Fewer UI elements on mobile
- **Optimized Images**: Cloudinary serving
- **Full-screen Play**: Immersive experience
- **Haptic Feedback**: Ready for vibration support

---

## 🚀 Getting Started

### Create a Puzzle

1. Go to `/admin/create-visual-puzzle`
2. Enter puzzle title and description
3. Select puzzle type
4. Choose category → topic → subtopic
5. Set difficulty and age group
6. Use type-specific editor to add content
7. Click "Save Puzzle"

### Play a Puzzle

1. Navigate to `/puzzle/Kids%20Puzzles` (or your category)
2. Select a topic
3. Select a subtopic
4. See level path with all puzzles
5. Click on a puzzle to play
6. Interact with the puzzle
7. Complete and unlock next level

---

## 📊 Progress Tracking

### For Logged-in Users
- Stored in Firestore `puzzleProgress` collection
- Per-user progress tracking
- Persistent across devices
- Synced in real-time

### For Guest Users
- Stored in browser localStorage
- Auto-synced to Firestore on login
- Offline-capable
- Limited to current device

---

## 🎨 Animations

**Entrance**: Fade-in effect (0.5s)
**Celebration**: Pop-in + bounce with emoji (0.6s)
**Card Flip**: 3D flip effect (0.6s)
**Button Hover**: Scale + shadow transform
**Connector**: Pulse effect when found
**Level Complete**: Scale + glow effect

---

## 🔄 Next Steps (Phase 2+)

Potential enhancements:
- [ ] Leaderboards for puzzles
- [ ] Daily puzzle challenges
- [ ] Puzzle packs/bundles
- [ ] Sound effects and background music
- [ ] More puzzle types (jigsaw, crossword, etc.)
- [ ] Multiplayer puzzle battles
- [ ] Puzzle difficulty auto-adjustment
- [ ] Hint system
- [ ] Custom puzzle creation by users

---

## 📝 Notes

- Puzzles use separate Firestore schema from quizzes
- Progress is tracked independently from quiz progress
- All puzzle types support full mobile experience
- Admin interface uses kid-friendly color scheme
- All components are touch-optimized
- Responsive breakpoints: 1200px, 768px, 480px

---

**Created**: December 2025
**Version**: 1.0
**Status**: Production Ready
