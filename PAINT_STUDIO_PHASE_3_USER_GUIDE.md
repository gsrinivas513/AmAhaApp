# Paint Studio Phase 3: Selection & Transform Tools User Guide

**Version**: 3.0  
**Date**: 2024  
**Status**: ✅ Complete

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Selection Tools](#selection-tools)
3. [Transform Tools](#transform-tools)
4. [Selection Panel](#selection-panel)
5. [Keyboard Shortcuts](#keyboard-shortcuts)
6. [Tips & Tricks](#tips--tricks)
7. [FAQ](#faq)

---

## Quick Start

### Accessing Selection Tools

1. Look at the **Secondary Toolbar** (below main toolbar)
2. Find the **Selection Tools Section** with 4 buttons:
   - **□ Rect** - Rectangle select
   - **✏ Lasso** - Free select
   - **✨ Wand** - Magic wand
   - **⤢ Move** - Move tool

3. Click any button to activate that tool
4. Click again to deactivate, or switch to another tool

### Accessing Panels

- **✂️ Selection** button - Toggle Selection Panel (shows properties, actions)
- **🔄 Transform** button - Toggle Transform Menu (flip, rotate, scale, crop)

---

## Selection Tools

### 1. Rectangle Select Tool (□ Rect)

**What it does**: Creates rectangular selections

#### How to Use

1. Click the **□ Rect** button to activate
2. Click and drag on the canvas:
   - **Drag** = Create rectangle
   - **Shift+Drag** = Create perfect square
   - **Ctrl+Drag** = Snap to grid

3. Visual feedback:
   - Blue rectangle outline while dragging
   - Dimension text (W × H) shows size
   - Marching ants (dashed line) appears when released

#### Tips

- Hold **Shift** to lock aspect ratio (square)
- Drag from any corner or edge to adjust selection
- Double-click inside selection to confirm

#### Common Use Cases

- Quick rectangular selections
- Creating square selections for logos or icons
- Selecting columns or rows of pixels
- Cropping to specific dimensions

---

### 2. Free Select Tool (✏ Lasso)

**What it does**: Creates polygon selections by clicking points

#### How to Use

1. Click the **✏ Lasso** button to activate
2. Click on canvas to add points (minimum 3 required)
3. Continue clicking to trace around object
4. **Close the selection**:
   - **Method 1**: Press **Enter** key
   - **Method 2**: Click near starting point (< 10px auto-closes)
   - **Method 3**: Double-click last point

5. Automatic path simplification removes unnecessary points

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Click | Add point |
| Enter | Finish & close selection |
| Backspace | Undo last point |
| Esc | Cancel entire selection |

#### Tips

- Minimum 3px distance between points (prevents accidental double-clicks)
- Path is **automatically simplified** while you draw
- Green indicator appears when near starting point (ready to close)
- Red dots show numbered points
- Blue lines show preview path

#### Common Use Cases

- Selecting irregular shapes
- Tracing around objects
- Creating custom polygon selections
- Precise edge selection

#### Example Workflow

```
1. Activate Free Select (✏ Lasso)
2. Click point 1 at top-left of object
3. Click point 2 at top-right
4. Click point 3 at bottom-right
5. Click point 4 at bottom-left
6. Click near point 1 to close, or press Enter
7. Selection confirmed!
```

---

### 3. Magic Wand Tool (✨ Wand)

**What it does**: Selects areas of similar color (flood fill)

#### How to Use

1. Click the **✨ Wand** button to activate
2. Adjust settings (optional):
   - **Tolerance** (0-255): How similar colors need to be
     - Low (0-50): Only exact colors
     - Medium (50-150): Similar colors
     - High (150-255): Broad color range
   - **Contiguous**: ☑ = Connected pixels only, ☐ = Any matching color
   - **Mode**: Replace, Add, or Subtract

3. Click on canvas color to select
4. All connected pixels of similar color selected

#### Understanding Tolerance

| Tolerance | Effect | Use Case |
|-----------|--------|----------|
| 0-20 | Very strict | Selecting single colors |
| 30-80 | Standard | Most selections |
| 90-150 | Loose | Selecting color ranges |
| 160-255 | Very loose | Selecting all similar hues |

#### Connectivity Modes

**Contiguous (☑ checked)**:
- Only selects **connected pixels**
- Stops at color boundaries
- Good for selecting objects that touch edges

**Non-Contiguous (☐ unchecked)**:
- Selects **all matching pixels** in entire image
- Ignores spatial separation
- Good for selecting scattered pixels

#### Selection Modes

| Mode | Behavior |
|------|----------|
| Replace | Replace current selection |
| Add | Add to current selection (Shift+Click) |
| Subtract | Remove from selection (Alt+Click) |

#### Tips

- Start with **Tolerance = 50** (good default)
- Increase tolerance if selection is too small
- Decrease tolerance if selection is too large
- Use **Contiguous mode** for objects with defined edges
- Use **Non-Contiguous** for selecting scattered colors

#### Common Use Cases

- Selecting sky (blue area)
- Selecting background
- Selecting objects of specific color
- Quick selections without tracing

#### Example Workflow

```
1. Activate Magic Wand (✨ Wand)
2. Set Tolerance = 80
3. Check "Contiguous" ☑
4. Click on blue sky
5. All connected blue pixels selected
6. Adjust if needed (increase tolerance to include more)
```

---

### 4. Move Tool (⤢ Move)

**What it does**: Moves selected content to new location

#### How to Use

1. Create a selection (using Rectangle, Lasso, or Magic Wand)
2. Click the **⤢ Move** button to activate
3. Move the selection:
   - **Drag**: Move selection
   - **Arrow Keys**: ±1 pixel per press
   - **Shift+Arrows**: ±10 pixels per press
   - **Ctrl+Drag**: Snap to grid (if enabled)

4. Visual feedback shows movement arrow and delta (Δx, Δy)

#### Keyboard Control

| Key | Movement |
|-----|----------|
| ← → ↑ ↓ | ±1 pixel |
| Shift+← → | ±10 pixels horizontal |
| Shift+↑ ↓ | ±10 pixels vertical |
| Ctrl+Drag | Grid snap movement |

#### Tips

- Marching ants outline shows new selection location
- Delta display (Δx, Δy) shows movement distance
- Fine-tune with arrow keys for precision
- Use **Shift+Arrow** for faster movement
- **Ctrl+Drag** aligns to grid if available

#### Common Use Cases

- Repositioning selections before applying operations
- Fine-tuning selection position
- Moving selection for content-aware fill
- Aligning selections to specific coordinates

#### Example Workflow

```
1. Create rectangle selection of object
2. Click Move Tool (⤢ Move)
3. Drag to move selection 50px right
4. Use arrow keys to fine-tune position
5. Apply operation (fill, copy, etc.)
```

---

## Transform Tools

### Accessing Transform Tools

Click **🔄 Transform** button to show Transform Menu panel

### Flip Operations

**Flip Horizontal**
- Mirrors selection left ↔ right
- Creates mirror image
- Use: Flipping text, symmetrical objects

**Flip Vertical**
- Mirrors selection top ↔ bottom
- Creates upside-down image
- Use: Flipping logos, symmetrical designs

#### Example
```
Original:  -->  Flipped H:  -->  Flipped V:
   →                ←                 ↓
```

---

### Rotate Operations

**Quick Rotations**
- **90° CW** - Rotate clockwise 90°
- **90° CCW** - Rotate counter-clockwise 90°
- **180°** - Rotate upside-down

**Custom Angle**
1. Click "Custom Angle" button
2. Enter angle in degrees (-360 to 360)
3. Positive = counter-clockwise
4. Negative = clockwise
5. Click "Apply"

#### Angle Reference
| Angle | Result |
|-------|--------|
| 0° | Original |
| 90° | CCW quarter turn |
| 180° | Upside down |
| 270° | CW quarter turn |
| 45° | Diagonal |
| -90° | CW quarter turn |

#### Example
```
Original  90° CCW  180°    -90° (CW)
  O  -->   │    -->  ⊖   -->  ⊥
```

---

### Scale Operations

**Scale to Percent**

1. In Transform Menu, find **Scale** section
2. Enter percentage (10-400%):
   - 50% = Half size
   - 100% = Original size
   - 200% = Double size

3. Choose mode:
   - **Layer**: Scale selection only
   - **Canvas**: Scale affects entire canvas

4. Click "Apply"

#### Scale Examples
```
100% (Original)  -->  50% (Half)  -->  150% (1.5x)
```

#### Tips

- Percentages are relative to original size
- 50% + 50% = 25% (multiplicative, not additive)
- Maintain aspect ratio automatically
- Non-integer percentages allowed

---

### Crop Operation

**Crop to Selection**

1. Create a selection
2. Open Transform Menu (🔄 Transform button)
3. Click **"Crop to Selection"** button
4. Canvas resized to match selection bounds
5. Everything outside selection removed

#### Note
- Only available when selection is active
- Removes all data outside selection
- Cannot be undone (use Undo button before confirming)

---

## Selection Panel

### Accessing Selection Panel

Click **✂️ Selection** button to show Selection Panel

### Properties Section

#### Position & Size (Editable)

| Property | Range | Use |
|----------|-------|-----|
| **X** | 0 - canvas width | Horizontal position |
| **Y** | 0 - canvas height | Vertical position |
| **Width** | 1 - canvas width | Selection width |
| **Height** | 1 - canvas height | Selection height |

**How to Edit**:
1. Click number field
2. Type new value
3. Press Enter to apply

#### Feather Radius

- **Range**: 0-50 pixels
- **Effect**: Softens selection edges
- **Use**: Smooth transitions, fade effects

**How to Apply**:
1. Slide feather slider (0-50)
2. Selection edges blur by specified radius

#### Anti-alias

- **Toggle**: ☑ On / ☐ Off
- **On**: Smooth edges (default)
- **Off**: Hard edges (aliased)
- **Best for**: Text, hard-edged shapes (Off)

---

### Action Buttons

#### Invert Selection

- **What**: Inverts selection (selected becomes unselected, vice versa)
- **Use**: Selecting background instead of object
- **Example**: 
  ```
  Before: Object selected     (⚪)
  After:  Background selected (🔵)
  ```

#### Grow Selection

- **What**: Expands selection by N pixels
- **Dialog**: Asks for pixel amount (default 5)
- **Use**: Expanding selections slightly

#### Shrink Selection

- **What**: Reduces selection by N pixels
- **Dialog**: Asks for pixel amount (default 5)
- **Use**: Reducing selections, cleaning up edges

#### Clear Selection

- **What**: Removes all selections
- **Use**: Starting fresh selection
- **Equivalent**: Ctrl+Shift+A

---

### Advanced Section

Click **"Advanced"** to expand additional options

#### Save Selection

1. Click **"Save Selection"** button
2. Enter name for selection
3. Selection saved to browser storage
4. Can be restored later in same session

#### Load Selection

1. Click **"Load Selection"** button
2. Choose saved selection from list
3. Selection restored to current canvas

#### Delete Saved Selection

1. Click **"Delete"** next to saved selection name
2. Selection removed from storage

**Note**: Saved selections use browser localStorage (not cloud)

---

## Keyboard Shortcuts

### Selection Tools

| Tool | Shortcut | Action |
|------|----------|--------|
| Rectangle | **R** | Activate Rectangle Select |
| Free Select | **F** | Activate Free Select (Lasso) |
| Magic Wand | **W** | Activate Magic Wand |
| Move | **M** | Activate Move Tool |

### Selection Operations

| Shortcut | Action |
|----------|--------|
| **Enter** | Confirm free selection |
| **Backspace** | Undo point in free selection |
| **Esc** | Cancel selection |
| **Shift+Click** | Add to selection (Magic Wand) |
| **Alt+Click** | Subtract from selection (Magic Wand) |
| **Shift+Drag** | Rectangle: make square, Wand: multi-select |

### Transform Operations

| Shortcut | Action |
|----------|--------|
| **Ctrl+Shift+A** | Clear/deselect all |
| **Shift+F** | Flip horizontal |
| **Shift+V** | Flip vertical |
| **Shift+R** | Rotate 90° CW |

---

## Tips & Tricks

### Pro Selection Techniques

#### 1. Combine Multiple Selections

```
Workflow:
1. Rectangle Select → Select main object
2. Magic Wand (Add mode) → Add color area
3. Free Select (Subtract mode) → Remove unwanted part
4. Feather selection → Soften edges
5. Apply operation
```

#### 2. Refine Selection Edges

```
For hard edges:
1. Create selection
2. Set Anti-alias = OFF
3. Shrink by 1-2 pixels (clean edges)

For soft edges:
1. Create selection
2. Set Anti-alias = ON
3. Feather by 3-5 pixels
```

#### 3. Select Objects from Background

```
Method 1 - Magic Wand:
1. Click on background color
2. Invert selection
3. Object now selected

Method 2 - By Color:
1. Magic Wand on object color
2. Add similar colors (Shift+Click)
3. Invert if needed
```

#### 4. Move Selection Precisely

```
For exact positioning:
1. Create selection
2. Activate Move Tool
3. Use arrow keys for pixel-perfect movement
4. View X,Y in Selection Panel
5. Type exact coordinates if needed
```

#### 5. Multi-Step Selection

```
Complex shape selection:
1. Rectangle Select → Select rough area
2. Free Select (Subtract mode) → Remove unwanted parts
3. Magic Wand (Add mode) → Add missed color areas
4. Feather slightly → Smooth result
5. Result: Professional selection
```

### Performance Tips

- **Large selections**: Use lower tolerance in Magic Wand
- **Complex paths**: Free Select auto-simplifies
- **Marching ants flickering**: Normal animation (toggle on/off with Selection Panel)
- **Grid snap**: Slows dragging slightly (disable if not needed)

---

## FAQ

### Selection Questions

**Q: How do I select an object with irregular edges?**
A: Use Free Select (✏ Lasso) - click around the edges, then press Enter.

**Q: Magic Wand isn't selecting enough. What should I do?**
A: Increase the Tolerance slider. Higher values = more colors included.

**Q: Can I adjust a selection after creating it?**
A: Yes! Use Selection Panel to edit X, Y, Width, Height directly.

**Q: How do I select only the background, not the object?**
A: Select the object, then click "Invert Selection" in Selection Panel.

**Q: Can I save selections for later?**
A: Yes! Use "Save Selection" in advanced section of Selection Panel.

---

### Transform Questions

**Q: How do I rotate by an exact angle?**
A: Click "Custom Angle" in Transform Menu, enter degrees, click Apply.

**Q: Does scale preserve aspect ratio?**
A: Yes, by default it maintains proportions. No way to change it (intentional).

**Q: What's the difference between Layer and Canvas scaling?**
A: **Layer**: Only scales selection. **Canvas**: Scales entire canvas size.

**Q: Can I flip just the selection, not the whole canvas?**
A: Yes, use Flip Horizontal/Vertical in Transform Menu with selection active.

---

### Technical Questions

**Q: Why does Free Select simplify my path?**
A: Automatic Ramer-Douglas-Peucker algorithm removes unnecessary points while keeping shape intact. This is a feature, not a bug.

**Q: What's the difference between Contiguous and Non-Contiguous magic wand?**
A: **Contiguous**: Only connected pixels of similar color. **Non-Contiguous**: All matching colors anywhere on canvas.

**Q: How does feathering work?**
A: Creates soft, blurred edges by gradually fading selection boundary. Great for blending.

**Q: Can I undo a selection operation?**
A: Selections don't have undo (different from canvas operations). Adjust properties instead, or recreate selection.

---

### Troubleshooting

**Selection not visible?**
- [ ] Check if Selection Panel shows "isActive = true"
- [ ] Try zooming in (marching ants small at low zoom)
- [ ] Verify canvas background (marching ants may blend)

**Magic Wand not selecting anything?**
- [ ] Check Tolerance isn't 0 (too strict)
- [ ] Verify Contiguous isn't preventing selection
- [ ] Try clicking exact pixel of target color

**Move Tool not working?**
- [ ] Ensure selection is active first
- [ ] Check Move Tool button is highlighted
- [ ] Try using arrow keys instead of dragging

**Transform Menu buttons disabled?**
- [ ] Some operations require active selection
- [ ] Check Selection Panel shows active selection
- [ ] Create a selection first if needed

---

## Example Workflows

### Workflow 1: Select & Copy Object

```
1. Activate Rectangle Select (□ Rect)
2. Drag around object
3. Adjust using Selection Panel (X, Y, W, H)
4. Set Feather = 2 for soft edges
5. Click "Copy" (to copy selection)
6. Activate Move Tool (⤢ Move)
7. Reposition if needed
8. Done!
```

### Workflow 2: Remove Background

```
1. Activate Magic Wand (✨ Wand)
2. Click background color
3. Adjust Tolerance (start at 80)
4. Invert selection (Object now selected)
5. Copy object
6. New canvas → Paste
7. Background removed!
```

### Workflow 3: Precise Rectangle with Round Corners

```
1. Rectangle Select (□ Rect)
2. Create square selection
3. Open Selection Panel
4. Edit Width, Height for exact size
5. Set Feather = 5 (rounded corners)
6. Set Anti-alias = ON
7. Apply operation with soft edges
```

### Workflow 4: Symmetrical Object

```
1. Free Select (✏ Lasso) half of object
2. Open Transform Menu
3. Flip Horizontal
4. Move to align with original
5. Flip Vertical
6. Result: Symmetrical design
```

---

## Next Steps

- Practice each tool with different objects
- Experiment with selection combinations
- Save useful selections for reuse
- Combine with other paint tools for advanced effects
- Share your work!

---

## Support

For issues or questions:
- Check FAQ section above
- Review Tips & Tricks section
- Try keyboard shortcuts
- Reset tool to defaults
- Contact support if issue persists

---

**Happy Selecting! 🎨**

Version 3.0 - Paint Studio with Phase 3 Selection & Transform Tools
