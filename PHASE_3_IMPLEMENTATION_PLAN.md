# Phase 3: Selection & Transform Tools - Implementation Plan

**Status**: 📅 **IN PROGRESS**  
**Estimated Duration**: 5-7 hours  
**Target Bundle Growth**: +6-8 kB  
**Components to Create**: 7 new components + 1 hook + 600+ lines CSS

---

## Overview

Phase 3 adds professional selection and transformation capabilities to Paint Studio. Users will be able to select areas of their artwork and apply transformations like move, rotate, and scale.

---

## Components to Build

### 1. Rectangle Select Tool (150 lines JSX)
**Purpose**: Select rectangular areas of the canvas

**Features**:
- Click and drag to create selection
- Visual rectangle outline during drag
- Selection indicator (marching ants animation)
- Show dimensions while dragging
- Fixed aspect ratio option (shift+drag)
- Corner/edge resize handles

**Props**:
- `canvas` - Canvas reference
- `onSelectionChange` - Callback with selection bounds
- `theme` - Theme preference

**State**:
- `isSelecting: boolean` - Is user currently selecting
- `startPoint: {x, y}` - Selection start position
- `endPoint: {x, y}` - Selection end position
- `selectedBounds: {x, y, width, height}` - Final selection

**Methods**:
- `startSelection(e)` - Handle mouse down
- `updateSelection(e)` - Handle mouse move
- `finishSelection(e)` - Handle mouse up
- `drawSelectionOutline()` - Render selection visuals

---

### 2. Free Select Tool (180 lines JSX)
**Purpose**: Freehand polygon selection (lasso tool)

**Features**:
- Click to add points
- Double-click or press Enter to finish
- Visual path preview (line connecting points)
- Path smoothing (simplified polygon)
- Undo last point (right-click or Backspace)
- Auto-close path when near start point
- Visual feedback during drawing

**Props**:
- `canvas` - Canvas reference
- `onSelectionChange` - Callback with selection path
- `theme` - Theme preference

**State**:
- `isDrawing: boolean` - Is user drawing
- `points: [{x, y}]` - Polygon points
- `previewPath: [{x, y}]` - Current path preview
- `selectedPath: [{x, y}]` - Final selection path

**Methods**:
- `addPoint(x, y)` - Add polygon point
- `undoPoint()` - Remove last point
- `finishSelection()` - Complete selection
- `smoothPath()` - Simplify polygon
- `drawPath()` - Render visual feedback

---

### 3. Magic Wand Tool (150 lines JSX)
**Purpose**: Select by color/similarity (flood fill selection)

**Features**:
- Click to select similar colors
- Tolerance slider (0-255) for color matching
- Contiguous option (connected pixels only)
- Show selection preview on hover
- Visual feedback (area to be selected highlighted)
- Add to selection (Shift+click)
- Subtract from selection (Ctrl+click)

**Props**:
- `canvas` - Canvas reference
- `onSelectionChange` - Callback with selected area
- `theme` - Theme preference

**State**:
- `tolerance: number` - Color matching threshold
- `contiguous: boolean` - Only connected pixels
- `mode: string` - Add/Replace/Subtract
- `selectedPixels: Set<string>` - Selected pixel coordinates

**Methods**:
- `floodFill(x, y, tolerance)` - Flood fill algorithm
- `getPixelColor(imageData, x, y)` - Get pixel color
- `colorMatch(color1, color2, tolerance)` - Color similarity
- `buildSelection()` - Create selection from pixels

---

### 4. Move Tool (100 lines JSX)
**Purpose**: Move selected areas or layers

**Features**:
- Click and drag to move selection
- Show position feedback during drag
- Arrow keys for fine adjustment (+1 pixel)
- Shift+arrow for large adjustment (+10 pixels)
- Grid snap option
- Snap to guides (future feature)
- Display relative movement (delta X/Y)

**Props**:
- `selection` - Current selection data
- `onMove` - Callback with new position
- `theme` - Theme preference

**State**:
- `isDragging: boolean` - Moving selection
- `dragStart: {x, y}` - Drag start position
- `offset: {x, y}` - Current offset

**Methods**:
- `startDrag(e)` - Begin move
- `updateDrag(e)` - Update position
- `finishDrag(e)` - Complete move
- `applyMove(deltaX, deltaY)` - Apply offset

---

### 5. Rotate & Scale Tools (100 lines JSX)
**Purpose**: Rotate and scale selected content

**Features**:

**Rotate**:
- Click and drag corner to rotate
- Shows rotation angle during drag
- 90° snap option (Shift)
- Rotation center indicator
- Preview of rotated content

**Scale**:
- Drag corner to scale
- Shift to maintain aspect ratio
- Shows scale percentage
- Proportional scaling option
- Preview of scaled content

**Props**:
- `selection` - Selection bounds
- `onTransform` - Callback with transform data
- `theme` - Theme preference

**State**:
- `transformMode: 'rotate' | 'scale'` - Active mode
- `angle: number` - Rotation angle (0-360)
- `scale: {x, y}` - Scale factors
- `isDragging: boolean` - In progress

---

### 6. Selection Panel (120 lines JSX)
**Purpose**: Show and modify selection properties

**Features**:
- Selection dimensions (W × H)
- Position (X, Y)
- Feather radius (0-50 pixels)
- Anti-alias toggle
- Selection mode (Replace/Add/Subtract/Intersect)
- Buttons: Invert, Grow, Shrink, Feather, Clear
- Load/Save selection option

**Props**:
- `selection` - Current selection data
- `onPropertyChange` - Update selection property
- `onAction` - Execute selection action
- `theme` - Theme preference

**State**:
- `properties: {feather, antiAlias, mode}` - Selection settings

**Methods**:
- `updateProperty(key, value)` - Change property
- `invertSelection()` - Invert selection
- `growSelection(pixels)` - Expand selection
- `shrinkSelection(pixels)` - Reduce selection
- `featherSelection(radius)` - Feather edges
- `clearSelection()` - Remove selection

---

### 7. Transform Menu (100 lines JSX)
**Purpose**: Batch transform operations

**Features**:
- **Flip**:
  - Flip Horizontal
  - Flip Vertical
- **Rotate**:
  - Rotate 90° CW
  - Rotate 90° CCW
  - Rotate 180°
  - Arbitrary angle dialog
- **Scale**:
  - Scale Layer (with % input)
  - Scale Canvas
  - Resize Canvas with position options
- **Crop to Selection**
- **Transform Selection** - Apply transform to selection bounds

**Props**:
- `selection` - Current selection
- `onTransform` - Callback
- `theme` - Theme preference

**Methods**:
- `flipHorizontal()`
- `flipVertical()`
- `rotate(angle)`
- `scale(percent)`
- `cropToSelection()`

---

## State Management Hook

### useSelection.js Hook (120 lines)
**Purpose**: Manage selection state across application

**State**:
```javascript
{
  isActive: boolean,
  type: 'rectangle' | 'free' | 'wand' | null,
  bounds: { x, y, width, height },
  path: [{ x, y }],  // For free select
  pixels: Set,  // For magic wand
  feather: number,
  antiAlias: boolean,
  mode: 'replace' | 'add' | 'subtract' | 'intersect'
}
```

**Methods**:
- `setSelection(selectionData)` - Update selection
- `clearSelection()` - Remove selection
- `featherSelection(radius)` - Apply feather
- `invertSelection()` - Invert selection
- `growSelection(pixels)` - Expand selection
- `shrinkSelection(pixels)` - Reduce selection
- `getSelectionMask()` - Get pixel mask
- `saveSelection(name)` - Save to localStorage
- `loadSelection(name)` - Load from localStorage

---

## Styling (600+ lines)

### RectangleSelectTool.css (150 lines)
- Selection outline (marching ants animation)
- Resize handles (corner + edge)
- Dimension tooltip
- Hover states
- Dark theme variables

### FreeSelectTool.css (100 lines)
- Path visualization (lines connecting points)
- Point markers
- Preview lines
- Tool cursor
- Dark theme

### MagicWandTool.css (100 lines)
- Color preview box
- Tolerance slider styling
- Selection area highlight
- Hover effects
- Dark theme

### TransformTools.css (100 lines)
- Transform handles (corners, edges, center)
- Rotation angle indicator
- Scale percentage display
- Grid overlay (optional)
- Dark theme

### SelectionPanel.css (150 lines)
- Two-column layout for properties
- Input fields for dimensions
- Slider for feather
- Action buttons grid
- Dark theme variables

---

## Integration Points

### PaintStudio.jsx Updates (100 lines)
1. Import all new components and hook
2. Add state for active selection tool
3. Add useSelection hook
4. Add selection tools to toolbar:
   - Rectangle Select (keyboard: R)
   - Free Select (keyboard: F)
   - Magic Wand (keyboard: W)
   - Move (keyboard: M)
5. Add Transform submenu
6. Add SelectionPanel to right sidebar
7. Pass callbacks to all tools
8. Render selection outlines on canvas

### Toolbar Updates
```
Selection Tools:
[R] Rectangle Select
[F] Free Select (Lasso)
[W] Magic Wand

Transform Tools:
[M] Move
[+] Rotate
[~] Scale

Menus:
Transform → Flip / Rotate / Scale / Crop
Select → All / None / Invert / Grow / Shrink
```

---

## Implementation Order

1. **useSelection Hook** - Foundation (120 lines)
2. **Rectangle Select Tool** - Simplest (150 lines)
3. **Free Select Tool** - Medium (180 lines)
4. **Magic Wand Tool** - Medium (150 lines)
5. **Selection Panel** - Medium (120 lines)
6. **Move Tool** - Simple (100 lines)
7. **Transform Tools** - Complex (100 lines)
8. **Transform Menu** - Simple (100 lines)
9. **All CSS Files** - Styling (600+ lines)
10. **PaintStudio Integration** - Wiring (100 lines)
11. **Build & Testing** - Verification

---

## Expected Challenges

### 1. Selection Rendering
- "Marching ants" animation (dashed line animation)
- Performance with large selections
- Solution: Use requestAnimationFrame for animation

### 2. Flood Fill Algorithm
- Efficient color matching for large images
- Memory usage with large selections
- Solution: Use typed arrays, optimize pixel iteration

### 3. Transform Preview
- Real-time preview during rotation/scale
- Canvas composition performance
- Solution: Use offscreen canvas, throttle updates

### 4. Selection Persistence
- Maintaining selection across tool changes
- Serialization for save/load
- Solution: useSelection hook, localStorage

### 5. Touch Support
- Mobile selection and transform
- Touch gestures (two-finger rotate/scale)
- Solution: Touch event handlers, gesture detection

---

## Testing Plan

### Unit Tests
- Selection creation (rectangle, free, wand)
- Boundary calculations
- Flood fill algorithm
- Transform matrix calculations

### Integration Tests
- Tool switching with active selection
- Selection persistence
- Multiple selection operations
- Undo/redo with selections

### Visual Tests
- Marching ants animation smooth
- Selection accuracy
- Transform preview accuracy
- Dark theme rendering

### Performance Tests
- Large image selection performance
- Real-time transform preview
- Selection rendering performance

---

## Estimated Timeline

| Component | Duration | Complexity |
|-----------|----------|-----------|
| useSelection Hook | 45 min | Medium |
| Rectangle Select | 1 hour | Low |
| Free Select | 1.5 hours | Medium |
| Magic Wand | 1 hour | Medium |
| Selection Panel | 45 min | Low |
| Move Tool | 30 min | Low |
| Transform Tools | 1.5 hours | High |
| Transform Menu | 30 min | Low |
| All Styling | 1.5 hours | Medium |
| Integration & Testing | 1 hour | Medium |
| **Total** | **9 hours** | **~7 hour sprint** |

**Notes**:
- Adjusted estimate from 5-7 hours → 7-9 hours for quality
- Can be completed in 2-3 focused sessions
- Build verification required at end

---

## Success Criteria

✅ All 7 tools implemented and functional  
✅ Selection persistence across tool changes  
✅ Transform operations preview before apply  
✅ Selection Panel shows/modifies all properties  
✅ Dark theme support across all components  
✅ Mobile responsive (touch support)  
✅ Build passes (bundle ~978 kB, +6-8 kB growth)  
✅ No TypeScript errors  
✅ Zero new ESLint warnings  
✅ Comprehensive documentation  

---

## Phase 3 Deliverables

### Code Files (1,200+ lines)
- 7 tool components (~1,000 lines JSX)
- 1 state management hook (~120 lines)
- 5 CSS files (~600 lines)
- PaintStudio integration (~100 lines)

### Documentation
- Phase 3 Completion Report
- Selection Tools User Guide
- Transform Tools Tutorial
- Architecture documentation

### Build Output
- Bundle: ~978 kB (from 972.16 kB)
- Growth: +5.84 kB (acceptable)

---

## Next After Phase 3

**Phase 4: Advanced Features** (5-7 hours)
- Filters (Blur, Sharpen, etc.)
- Effects (Drop Shadow, Glow, etc.)
- Color Adjustments (Brightness, Contrast, Saturation, etc.)
- Distortion Tools (Warp, Twirl, etc.)

---

## References

- [KRITA_ENHANCEMENT_PHASES.md](./KRITA_ENHANCEMENT_PHASES.md) - Full roadmap
- [PHASE_2_COMPLETION_REPORT.md](./PHASE_2_COMPLETION_REPORT.md) - Architecture patterns
- [PAINT_STUDIO_QUICK_START.md](./PAINT_STUDIO_QUICK_START.md) - Integration guide

---

**Ready to begin Phase 3 implementation! 🚀**

Start with useSelection hook as foundation, then build tools systematically.
