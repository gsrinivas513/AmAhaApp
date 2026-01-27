# Krita-Inspired Paint Studio Enhancement Phases

## Overview

We'll enhance our Paint Studio in strategic phases, inspired by Krita's professional interface design. This approach balances feature richness with implementation complexity.

### Current State
- **7 Tools**: Pencil, Eraser, Line, Rectangle, Circle, Bucket Fill, Text
- **Basic UI**: Simple toolbar, layer panel, undo/redo
- **Canvas Features**: Zoom, pan, layer opacity, visibility toggle
- **Krita Parity**: ~20% feature complete

---

## Phase 1: Visual Presets & Quick Access ⭐ (HIGH PRIORITY)

**Focus**: Make brush presets discoverable and instantly applicable (like Krita's preset docker)

### Components to Create:
1. **BrushPresetsPanel.jsx** (200 lines)
   - Visual grid of preset thumbnails
   - Hover preview showing brush characteristics
   - Quick apply with single click
   - Search/filter by preset name
   - Categories: Basic, Natural, Digital, Special Effects

2. **PresetThumbnail.jsx** (80 lines)
   - Visual preview circle showing brush behavior
   - Brush name label
   - Metadata: size, hardness, spacing

### Features to Implement:
```
✅ 20 pre-built brush presets with visual previews
✅ Categorized organization (5 categories)
✅ Quick apply to current brush settings
✅ Drag-drop to reorder (optional enhancement)
✅ Preset customization infrastructure ready
✅ Export/import presets as JSON
```

### Architecture Changes:
- Update `constants.js`: Expand BRUSH_PRESETS from 8 to 20+ with visual metadata
- Update `useTools.js`: Add preset library state management
- New component: Toggle visibility in PaintStudio.jsx secondary toolbar
- localStorage: Save user-created presets

### Effort: **LOW** (1-2 hours)
**Impact**: **HIGH** (professional preset system like Photoshop/Krita)
**User Value**: Instant access to 20+ professional brushes

---

## Phase 2: Advanced Color & Tool Options (MEDIUM PRIORITY)

### Component Set A: Color Wheel Selector
1. **ColorWheelSelector.jsx** (250 lines)
   - HSL color wheel with saturation/brightness triangles
   - Real-time HEX/RGB/HSL value display
   - Complementary color suggestion
   - Color history palette (last 12 colors)
   - Tabs: Wheel, Palette, History

### Component Set B: Blend Modes Dropdown
1. **BlendModesPanel.jsx** (100 lines)
   - Update LayerPanel.jsx: Add blend mode selector per layer
   - Dropdown showing all 10 blend modes with visual preview
   - Affects layer compositing in useCanvas renderLayers()

### Component Set C: Dynamic Tool Options
1. **ToolOptionsPanel.jsx** (180 lines)
   - Context-aware panel that changes based on selected tool
   - **Pencil**: Brush shape selector, stabilization slider
   - **Line**: Corner radius, stroke width multiplier
   - **Rectangle**: Corner radius slider, fill type (solid/gradient)
   - **Circle**: Stroke width, fill gradient preview
   - **Bucket**: Tolerance slider, contiguous toggle
   - **Text**: Font selector, size dropdown, alignment buttons
   - **Eraser**: Hardness slider, opacity behavior

### Architecture Changes:
- Update `constants.js`: Add TOOL_OPTIONS configurations
- New hook `useToolOptions.js`: Manages tool-specific options
- Integration in PaintStudio.jsx: Display contextually below toolbar

### Effort: **MEDIUM** (3-4 hours)
**Impact**: **VERY HIGH** (professional color selection + tool power)
**User Value**: Full control over tool behavior, advanced color management

---

## Phase 3: Selection & Transform Tools (ADVANCED PRIORITY)

### Selection Tools:
1. **RectangleSelectTool.js** (120 lines)
   - Select rectangular regions
   - Marching ants animation
   - Copy/cut/paste selected area

2. **LassoSelectTool.js** (150 lines)
   - Freehand selection drawing
   - Anti-aliased selection edge
   - Feather selection option

3. **MagicWandSelectTool.js** (100 lines)
   - Color-based selection (enhanced flood fill)
   - Tolerance slider
   - Similar colors detection

### Transform Tools:
1. **RotateTool.js** (140 lines)
   - Rotate selected layer/canvas
   - Grid overlay showing rotation angle
   - Snap to common angles (90°, 45°, etc.)

2. **ScaleTool.js** (130 lines)
   - Scale layer with aspect ratio lock option
   - Transform handles at corners/edges
   - Preview outline

3. **SkewTool.js** (120 lines)
   - Perspective skew transformation
   - Handle-based UI

### Architecture Changes:
- Extend ToolFactory.js with 6 new tool classes
- Add SelectionManager hook: Manages selection state & marching ants animation
- Update CanvasCore.jsx: Support selection overlay rendering
- New utility: transformUtils.js for matrix operations

### Effort: **HIGH** (6-8 hours)
**Impact**: **MEDIUM** (advanced but less critical for basic drawing)
**User Value**: Professional editing capabilities

---

## Phase 4: Filters & Effects (FUTURE CONSIDERATION)

### Planned Filters:
- Blur (Gaussian, Motion, Directional)
- Sharpen & Edge Detect
- Color Adjustments (Levels, Curves, Hue-Saturation)
- Distortion (Twist, Bulge, Pinch)
- Artistic (Posterize, Oil Painting simulation)

### Effort: **VERY HIGH** (12+ hours)
**Impact**: **MEDIUM** (nice-to-have, not core to painting)

---

## Phase 5: Guides, Rulers & Assistants (FUTURE CONSIDERATION)

### Features:
- Rulers (top/left with pixel markings)
- Grid overlay with customizable spacing
- Guide lines (horizontal/vertical, angle-based)
- Symmetry painting (horizontal/vertical mirror)
- Perspective assistant (vanishing point guides)

### Effort: **MEDIUM** (4-5 hours)
**Impact**: **MEDIUM** (helpful for technical drawing, perspective)

---

## Implementation Priority Matrix

| Phase | Feature | Effort | Impact | Priority | Timeline |
|-------|---------|--------|--------|----------|----------|
| 1 | Brush Presets | 1-2h | 🔴 HIGH | ⭐⭐⭐ | Week 1 |
| 2 | Color Wheel | 2h | 🔴 HIGH | ⭐⭐⭐ | Week 1-2 |
| 2 | Blend Modes | 1h | 🔴 HIGH | ⭐⭐⭐ | Week 1 |
| 2 | Tool Options | 2h | 🔴 HIGH | ⭐⭐⭐ | Week 1-2 |
| 3 | Selection Tools | 4-5h | 🟡 MEDIUM | ⭐⭐ | Week 2-3 |
| 3 | Transform Tools | 3-4h | 🟡 MEDIUM | ⭐⭐ | Week 3 |
| 4 | Filters/Effects | 12h | 🟡 MEDIUM | ⭐ | Week 4+ |
| 5 | Guides/Rulers | 4-5h | 🟡 MEDIUM | ⭐ | Week 4+ |

---

## Recommended Approach

### Phase 1 Implementation (Starting Now)
```
✅ Create BrushPresetsPanel.jsx with 20+ presets
✅ Expand constants.js preset library
✅ Add toggle button to PaintStudio.jsx
✅ Test in browser at /arts/paint
✅ Build verification (npm run build)
✅ Est. Time: 1-2 hours
```

### Phase 2 Implementation (Week 1-2)
```
✅ Create ColorWheelSelector.jsx (advanced HSL)
✅ Update LayerPanel.jsx: Add blend mode dropdown
✅ Create ToolOptionsPanel.jsx (context-aware)
✅ Integrate all into PaintStudio.jsx
✅ Build verification
✅ Est. Time: 5-7 hours total
```

### Phase 3 Implementation (Week 2-3)
```
Optional: Selection tools (Rectangle, Lasso, Magic Wand)
Optional: Transform tools (Rotate, Scale, Skew)
```

### Phases 4-5 (Future)
```
Lower priority - implement after core features mature
```

---

## Krita Architecture Insights

### Key Design Patterns from Krita:
1. **Brush Presets**: Visual library with quick access, searchable, categorized
2. **Docker Panels**: Collapsible panels for Colors, Brushes, Layers, Tool Options
3. **Context-Aware UI**: Tool options change based on selected tool
4. **Professional Color**: Full HSL color wheel, mixer palette, history
5. **Blend Modes**: Per-layer compositing with 15+ blend modes
6. **Selection System**: Multiple selection types (rect, free, by color)
7. **Transform Tools**: Non-destructive transformations with grid overlay

### What We'll Implement:
- ✅ Brush Presets (Phase 1)
- ✅ Color Wheel + Mixer (Phase 2)
- ✅ Tool Options Panel (Phase 2)
- ✅ Blend Modes (Phase 2)
- ✅ Selection Tools (Phase 3)
- ✅ Transform Tools (Phase 3)
- ⏳ Filters (Phase 4)
- ⏳ Guides (Phase 5)

### What We'll Skip:
- Animation tools (different use case)
- Python scripting (not needed for learning app)
- Vector graphics (focus on raster)
- Color management/profiling (web-based, simplified)

---

## Code Architecture for Extensibility

### Current Structure (Ready for Enhancement):
```
paint-studio/
├── PaintStudio.jsx (orchestrator - will add more component integration)
├── components/
│   ├── CanvasCore.jsx (drawing core)
│   ├── Toolbar.jsx (primary tools)
│   ├── LayerPanel.jsx (will add blend mode selector)
│   ├── BrushPresetsPanel.jsx (NEW - Phase 1)
│   ├── ColorWheelSelector.jsx (NEW - Phase 2)
│   ├── ToolOptionsPanel.jsx (NEW - Phase 2)
│   └── SelectionIndicator.jsx (NEW - Phase 3)
├── hooks/
│   ├── useCanvas.js (existing)
│   ├── useTools.js (existing)
│   ├── useLayers.js (existing)
│   ├── useHistory.js (existing)
│   ├── useToolOptions.js (NEW - Phase 2)
│   └── useSelection.js (NEW - Phase 3)
├── services/
│   ├── BrushEngine.js (existing)
│   ├── ToolFactory.js (will expand)
│   ├── SelectionManager.js (NEW - Phase 3)
│   └── TransformManager.js (NEW - Phase 3)
└── utils/
    ├── constants.js (will expand presets)
    ├── colorUtils.js (existing - full featured)
    └── canvasUtils.js (existing - drawing ops)
```

### Plugin Points for Easy Extension:
1. **New Tools**: Add class to ToolFactory.js
2. **New Presets**: Update constants.js BRUSH_PRESETS
3. **New Filters**: Create filterUtils.js
4. **New Tool Options**: Update TOOL_OPTIONS in constants.js

---

## Build & Deployment Strategy

### After Each Phase:
1. Run `npm run build` - verify no errors
2. Test route `/arts/paint` in browser
3. Verify all components load
4. Test new feature functionality
5. Check no regressions in existing features
6. Commit to git

### Milestones:
- **Phase 1 Complete**: Build passes, 20 presets visible
- **Phase 2 Complete**: Color wheel, blend modes, tool options working
- **Phase 3 Complete**: Selection and transform tools implemented
- **Final**: Professional Paint Studio ready for production

---

## Success Criteria

### Phase 1 (Presets)
- ✅ 20+ presets displayed in grid
- ✅ Hovering shows preview
- ✅ Clicking applies preset
- ✅ Panel toggleable on/off
- ✅ Responsive design (mobile-friendly)

### Phase 2 (Color & Options)
- ✅ Color wheel interactive and responsive
- ✅ Blend modes dropdown working per layer
- ✅ Tool options update based on selected tool
- ✅ All values persist during session
- ✅ Smooth color transitions

### Phase 3 (Selection & Transform)
- ✅ Rectangle selection visible with marching ants
- ✅ Selection can be copied/pasted
- ✅ Rotate tool shows grid overlay
- ✅ Scale maintains aspect ratio
- ✅ Transform previews before commit

---

## Next Steps

1. **Start Phase 1**: Create BrushPresetsPanel.jsx
2. **Expand presets**: Add 20+ unique preset definitions
3. **Integrate**: Add toggle to PaintStudio.jsx
4. **Test**: Verify in `/arts/paint`
5. **Build**: Run `npm run build`

Ready to begin! 🚀
