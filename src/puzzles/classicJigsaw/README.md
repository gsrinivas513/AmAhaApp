# Classic Jigsaw Puzzle Engine

Reference implementation of a production-quality jigsaw puzzle game with authentic curved pieces.

## Architecture

### Files

- **constants.js** - Configuration and constants (snap distance, piece size, tab dimensions)
- **snapUtils.js** - Snapping and physics calculations
- **generateJigsawPieces.js** - SVG path generation for curved jigsaw pieces
- **JigsawPiece.jsx** - Individual piece component with Konva Path clipping
- **useJigsawEngine.js** - Game state and logic hook
- **JigsawStage.jsx** - Konva stage with board and tray layers
- **ClassicJigsawGame.jsx** - Main component orchestrating the game

## Key Features

### Curved Jigsaw Pieces
- Real SVG paths with tabs and blanks
- Quadratic bezier curves for smooth edges
- Flat edges on puzzle borders
- Matching edge types between adjacent pieces

### Game Mechanics
- Empty board on load
- All pieces start in tray
- Drag-and-drop from tray to board
- Distance-based snapping (18px tolerance)
- Pieces lock when correctly placed
- Prevents re-dragging locked pieces

### User Interface
- Progress tracking (percentage, pieces placed, moves, time)
- Hint toggles (Grid, Background, Preview)
- Pause/Resume functionality
- Restart button
- Completion celebration
- Responsive layout with sidebar

### Visual Features
- SVG path rendering with Konva
- Image pattern fill for piece content
- Grid overlay option
- Background reference image (faded)
- Theme support with dark/light modes
- Shadow effects on placed pieces

## SVG Path Generation

The `generateJigsawPieces.js` creates SVG paths with:
- Configurable tab size and depth
- Random tab/blank placement
- Edge matching constraints (if A→B is tab, B→A is blank)
- Border pieces with flat edges
- Interior pieces with curved tabs/blanks

## Konva Integration

Uses react-konva primitives:
- **Stage** - Main canvas container
- **Layer** - Board and Tray layers
- **Group** - Piece containers for dragging
- **Path** - SVG-based piece shapes
- **Image** - Background reference and pattern fill
- **Line** - Grid overlay

## State Management

`useJigsawEngine` hook provides:
- Piece positions and state
- Drag operations
- Snap detection
- Lock/unlock logic
- Progress calculation
- Time tracking
- Move counting

## Image Clipping

Uses SVG path's `fillPatternImage` property:
```javascript
<Path
  data={piece.path}
  fillPatternImage={imageElement}
  fillPatternX={-piece.imageOffsetX}
  fillPatternY={-piece.imageOffsetY}
/>
```

This avoids CSS clipping and provides authentic puzzle appearance.

## Constants

```javascript
SNAP_DISTANCE = 18px      // Snap tolerance
TAB_SIZE = 15px           // Width of tab/blank
TAB_DEPTH = 8px           // Depth of curve
DEFAULT_ROWS = 4
DEFAULT_COLS = 3
```

## Usage

```javascript
import ClassicJigsawGame from "./classicJigsaw/ClassicJigsawGame";

<ClassicJigsawGame
  imageUrl="https://..."
  variant={{ cols: 6, rows: 4 }}
  theme={customTheme}
/>
```

## Performance Considerations

- SVG paths cached during piece generation
- Lazy image loading
- Layer-based rendering for board/tray separation
- Efficient drag handling with requestAnimationFrame
- Minimal re-renders through strategic state updates

## Browser Compatibility

Requires:
- SVG Path support (all modern browsers)
- Canvas API (for Konva)
- ES6+ JavaScript
- React 16.8+ (hooks)
