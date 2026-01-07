---
sidebar_position: 4
title: Interaction Types
---

# Puzzle Interaction Types

Puzzles in AmAha use various interaction methods based on the puzzle type. This page explains how users interact with different puzzle mechanics.

## Interaction Categories

Puzzles employ 6 primary interaction methods:

### 1. **Selection/Clicking**

Users click or tap cells/elements to select, toggle, or confirm.

**Used in:**
- Nonogram (click cells to fill/empty)
- Word Search (click to highlight letters)
- Pattern Puzzles (select answer from options)
- Memory Puzzles (click to reveal, then match)

**Mechanics:**
- **Single Click** - Select/toggle state
- **Double Click** - Confirm or open details
- **Long Press** (mobile) - Context menu or alternative action
- **Toggle** - Click again to deselect

**User Experience:**
- Immediate visual feedback
- Color changes show state
- Count/progress updates
- Undo option available

**Accessibility:**
- Keyboard: Tab to navigate, Enter to select
- Mouse: Standard click
- Touch: Tap on target

---

### 2. **Dragging**

Users drag elements to new positions or containers.

**Used in:**
- Jigsaw Puzzle (drag pieces to board)
- Tangram (drag shapes to target positions)
- Block Puzzle (drag blocks to placement)
- Slider Puzzle (drag tiles into empty space)
- Matching (drag items to match partners)

**Mechanics:**
- **Click & Hold** - Pick up element
- **Drag** - Move while holding
- **Release** - Drop at destination
- **Snap-to-Grid** - Auto-align on release

**Constraints:**
- Boundaries (puzzle board edges)
- Collision detection (no overlaps)
- Valid zones (only certain areas)
- Grid alignment (cells only)

**User Experience:**
- Visual dragging feedback
- Ghost element shows path
- Valid/invalid zone indicators
- Drop animations

**Accessibility:**
- Keyboard: Arrow keys to move, Enter to place
- Mouse: Drag mechanic standard
- Touch: Standard drag

---

### 3. **Typing/Input**

Users type text, numbers, or enter responses.

**Used in:**
- Kakuro (type digit 1-9)
- Sudoku (type number in cell)
- Crossword (type letters)
- Word Ladder (type new word)
- Fill-in-the-Blank (type missing text)

**Mechanics:**
- **Direct Input** - Type in cell/field
- **Multiple Choice** - Type to filter options
- **Text Field** - Type answer in designated area
- **Numeric Only** - Restrict to numbers

**Constraints:**
- Character limits
- Valid character sets
- Auto-advance on completion
- Real-time validation

**User Experience:**
- Clear cursor/focus indicator
- Instant validation feedback
- Error messages for invalid input
- Clear/backspace options
- Auto-capitalization (where appropriate)

**Accessibility:**
- Keyboard: Full typing support
- Touch: Mobile keyboard appears
- Speech: Voice input (some browsers)

---

### 4. **Rotating/Spinning**

Users rotate elements to match patterns or orientations.

**Used in:**
- Rotational Puzzles (rotate rings/pieces)
- Tangram (rotate shapes)
- Picture Rotation (rotate image segments)
- 3D Puzzles (rotate in 3D space)

**Mechanics:**
- **Swipe Rotate** - Swipe to rotate (mobile)
- **Click Arrows** - Rotate via buttons
- **Drag Rotate** - Drag motion indicates rotation
- **Angle Input** - Type specific angle (90°, 180°, etc.)

**Constraints:**
- Snap angles (typically 90° increments)
- Range limits (some pieces fixed)
- Collision detection post-rotation
- Visual guides showing target

**User Experience:**
- Smooth rotation animation
- Snap-to-grid for discrete angles
- Visual alignment indicators
- Rotation count/progress

**Accessibility:**
- Keyboard: Arrow keys (left/right rotate)
- Mouse: Click buttons or drag
- Touch: Swipe to rotate

---

### 5. **Drawing/Paths**

Users draw lines or paths to connect elements or create patterns.

**Used in:**
- Pipeline (draw connecting pipes)
- Line Drawing (draw picture)
- Dot Connection (connect dots to form shape)
- Circuit/Flow (draw connections)

**Mechanics:**
- **Freehand Drawing** - Draw continuous line
- **Connected Nodes** - Click nodes in sequence
- **Constraint Path** - Follow specific rules
- **Erasing** - Remove drawn lines

**Constraints:**
- Connection points (nodes/ports)
- Path rules (no crossing, specific shapes)
- Segment limits (max segments)
- Visual guides

**User Experience:**
- Real-time line drawing
- Snap-to-grid for grid-based
- Color feedback (valid/invalid)
- Smooth animations
- Undo/redo support

**Accessibility:**
- Keyboard: Tab to select, arrows to draw
- Mouse: Click and drag for freehand
- Touch: Finger draw path

---

### 6. **Arrangement**

Users arrange or sort elements into specific sequences or groups.

**Used in:**
- Tower of Hanoi (move discs between pegs)
- Sequencing Puzzles (order items correctly)
- Categorization (sort into groups)
- Hierarchy/Tree (arrange in tree structure)

**Mechanics:**
- **Drag-Based** - Drag to new position
- **Click Sequence** - Click items in order
- **List Reordering** - Drag items up/down
- **Container Movement** - Move between containers

**Constraints:**
- Rule validation (only certain arrangements valid)
- Dependency ordering (some items before others)
- Grouping rules (which items together)
- Capacity limits (container size)

**User Experience:**
- Clear visual ordering
- Number indicators (1st, 2nd, etc.)
- Valid/invalid state feedback
- Smooth reordering animations
- Preview of final arrangement

**Accessibility:**
- Keyboard: Tab through items, Enter to reorder
- Mouse: Drag or click controls
- Touch: Tap-based or drag-based

---

## Interaction-to-Puzzle Mapping

| Interaction | Best For | Examples | Difficulty Ease |
|-------------|----------|----------|-----------------|
| **Selection** | Quick decisions | Nonogram, Word Search | Very Easy |
| **Dragging** | Spatial problems | Jigsaw, Tangram | Medium |
| **Typing** | Logic puzzles | Sudoku, Kakuro | Easy |
| **Rotating** | 3D visualization | Rotational Puzzles | Hard |
| **Drawing** | Path finding | Pipeline, Circuits | Hard |
| **Arrangement** | Sequencing | Tower of Hanoi | Medium-Hard |

---

## Device-Specific Adaptations

### Desktop (Mouse + Keyboard)

**Interaction Advantages:**
- Precise clicking
- Drag-and-drop native
- Full keyboard support
- Multiple controls

**Optimization:**
- Mouse hover states
- Right-click context menus
- Keyboard shortcuts
- Cursor feedback

**Example (Sudoku):**
```
[Click cell] → [Type number] → [Tab to next] → [Validate]
```

### Mobile (Touch + Keyboard)

**Interaction Advantages:**
- Native drag-and-drop
- Multi-touch gestures
- Touch feedback (haptic)
- Responsive

**Optimization:**
- Tap targets large (44×44 min)
- Swipe gestures
- Long-press menus
- Touch feedback/haptics

**Example (Jigsaw):**
```
[Tap piece] → [Drag to board] → [Release] → [Snap animation]
```

### Tablet (Hybrid)

**Interaction Advantages:**
- Large touch area
- Stylus support (some)
- Both touch and keyboard
- Hybrid input

**Optimization:**
- Stylus detection (precise drawing)
- Multi-touch gestures
- Split-screen friendly
- Landscape orientation support

---

## Accessibility Features

### Keyboard Navigation

**Standard Keys:**
| Key | Action |
|-----|--------|
| Tab | Move to next element |
| Shift+Tab | Move to previous element |
| Enter | Select/Confirm |
| Space | Toggle/Activate |
| Arrow Keys | Navigate grid/list |
| Backspace | Undo/Clear |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |

### Screen Reader Support

- All interactive elements labeled
- State changes announced
- Instructions provided
- Status updates read aloud
- Error messages clear

### Color & Contrast

- No color-only indicators
- High contrast mode
- Colorblind-friendly palette
- Large text options

### Motor Accessibility

- Large touch targets (minimum 44×44 pixels)
- Adjustable click/double-click time
- Keyboard-only playable
- Voice control support (some)
- Slower animation options

---

## Input Validation

### Real-Time Feedback

Puzzles provide instant feedback as users interact:

**Correct Placement:**
- ✅ Green highlight
- Sound effect (optional)
- Progress update

**Partially Correct:**
- 🟡 Yellow/orange highlight
- Partial credit awarded
- Suggestion hint available

**Invalid Placement:**
- ❌ Red highlight
- Error explanation
- Undo option offered

**Near Completion:**
- 🎯 Visual indicators
- Encouraging message
- Final validation ready

---

## Performance Considerations

### Smooth Interactions

- **Drag Responsiveness:** <50ms latency
- **Animation Duration:** 200-400ms (transitions)
- **Click Feedback:** Immediate (< 100ms)
- **Draw Rendering:** Smooth 60 FPS

### Optimization Techniques

- Hardware acceleration for animations
- Debouncing for input events
- Request animation frame for drawing
- Efficient collision detection
- Canvas rendering where appropriate

---

## Customization Options

Users can customize interaction preferences:

**Settings Available:**
- Animation speed (slow/normal/fast)
- Sound effects (on/off)
- Vibration/haptic feedback
- Cursor size and style
- Double-click delay
- Keyboard repeat rate

---

**Next:** [Puzzle Structure](puzzle-structure) for technical data models.
