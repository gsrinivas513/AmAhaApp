# Phase 2 Feature Guide: User Quick Start

## 🚀 Quick Navigation

All Phase 2 features are in the **Secondary Toolbar** (below the main tool icons):

```
┌─────────────────────────────────────────────────────────────────────┐
│ Paint Studio                                                         │
├─────────────────────────────────────────────────────────────────────┤
│  [Tools Toolbar: Pencil, Brush, Eraser, etc.]                      │
├─────────────────────────────────────────────────────────────────────┤
│  [↶ Undo] [↷ Redo] [🔍−] [100%] [🔍+] [100%]                      │
│  [🧹 Clear] [⬇️ Download] [🎨 Presets] [🎨 Color] [⚙️ Options] [📐 Layers] │
│                                      ↑ NEW           ↑ NEW
├─────────────────────────────────────────────────────────────────────┤
│ [ Color Wheel Panel ] [ Tool Options Panel ]                        │
│ (when enabled)         (always enabled)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                           [CANVAS AREA]                             │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│ Canvas: 800x600px  Tool: PENCIL  Zoom: 100%                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Feature 1: 🎨 Color Wheel Selector

### Where to Find It
**Secondary Toolbar** → 🎨 **Color** button (toggle on/off)

### What It Does
Professional HSL color picker with visual color wheel

### How to Use

#### Method 1: Hue Wheel
1. Click **🎨 Color** to open the color wheel
2. Click/drag on the **circular hue wheel** (outer ring)
3. Select your base color (e.g., red, blue, green)

#### Method 2: Saturation & Lightness Square
1. After selecting hue, click the **square** (center area)
2. Left side = more desaturated (grayish)
3. Right side = more saturated (vibrant)
4. Top = lighter (more white)
5. Bottom = darker (more black)

#### Method 3: Sliders
1. Use **H (Hue)** slider: 0-360°
2. Use **S (Saturation)** slider: 0-100%
3. Use **L (Lightness)** slider: 0-100%

#### Method 4: Direct Input
1. Type **HEX color** (e.g., #FF6B6B)
2. Or enter **RGB values** (e.g., 255, 107, 107)
3. Or enter **HSL values** (e.g., 0°, 100%, 50%)

#### View Color History
1. Click **History** tab (within color panel)
2. See last 12 colors you've selected
3. Click any color to apply it again

#### Get Complementary Color
1. Select any color
2. View **Complementary Color** suggestion (opposite on color wheel)
3. Click to apply complementary color

### Color Display
```
Current Color: #FF6B6B
RGB: R: 255, G: 107, B: 107
HSL: H: 0°, S: 100%, L: 50%
Complementary: #00FFFF
```

---

## Feature 2: ⚙️ Tool Options Panel

### Where to Find It
**Secondary Toolbar** → ⚙️ **Options** button (always enabled by default)

### What It Does
Context-aware settings that change based on your selected drawing tool

### Tool-Specific Options

#### Pencil Tool
```
✏️ Pencil Options
├─ Hardness:       [=========  ] 0.8
└─ Stabilization:  [=         ] 0
```
- **Hardness**: 0 (soft) to 1 (hard)
- **Stabilization**: 0-10 (smooths stroke)

#### Brush Tool
```
🖌️  Brush Options
├─ Brush Shape:    [Circle    ▼] (Select: Circle, Square, Diamond)
├─ Texture Amount: [===       ] 50
└─ Hardness:       [=========  ] 0.8
```
- **Brush Shape**: Choose from preset shapes
- **Texture Amount**: 0-100 for texture intensity
- **Hardness**: Affects edge softness

#### Eraser Tool
```
🧹 Eraser Options
├─ Hardness: [=========  ] 0.8
└─ Feather:  [==        ] 5
```
- **Hardness**: 0 (soft edge) to 1 (hard edge)
- **Feather**: 0-20 for edge softening

#### Line Tool
```
📏 Line Options
├─ Corner Radius: [=========  ] 15
└─ Anti-Alias:    [✓] (Checkbox)
```
- **Corner Radius**: 0-50 for rounded corners
- **Anti-Alias**: Toggle for smooth edges

#### Rectangle Tool
```
▭ Rectangle Options
├─ Corner Radius: [=========  ] 15
└─ Fill Type:     [Solid     ▼] (Select: Solid, Gradient, Pattern)
```
- **Corner Radius**: 0-50 for rounded corners
- **Fill Type**: Choose fill method

#### Circle Tool
```
● Circle Options
├─ Fill Type:     [Solid     ▼] (Select: Solid, Gradient, Pattern)
└─ Stroke Width:  [====      ] 2
```
- **Fill Type**: Choose fill method
- **Stroke Width**: 0-20 for outline thickness

#### Bucket Fill Tool
```
🪣 Bucket Options
├─ Tolerance:   [=========  ] 30
└─ Contiguous:  [✓] (Checkbox)
```
- **Tolerance**: 0-255 for color matching threshold
- **Contiguous**: Check to fill only connected areas

#### Text Tool
```
A Text Options
├─ Font Size:   [===       ] 16
├─ Font Family: [Arial     ▼] (Select: Arial, Times, Courier, Georgia)
└─ Alignment:   [Left      ▼] (Select: Left, Center, Right)
```
- **Font Size**: 8-72 pixels
- **Font Family**: Choose from common fonts
- **Alignment**: Left, center, or right align

### Advanced Options
```
[ Advanced Options ▼ ]
(Additional tool-specific settings when available)
```
Click to expand advanced settings for your current tool

### Save Tool Preset
```
[ Save Preset ]
```
Button to save current tool configuration (for future use)

---

## Feature 3: 🎨 Layer Blend Modes

### Where to Find It
**Right Panel** → **Layers** → **Each Layer** has a **Blend Mode** dropdown

### Blend Mode Visual

```
Layer Item:
┌─────────────────────────────────┐
│ 👁️ Layer 1                      │
│    Opacity: [===========] 100%  │
│    Blend:   [source-over ▼]     │  ← Click here
│                                  │
│    [Lock] [Visible]              │
└─────────────────────────────────┘
```

### Available Blend Modes (10 Total)

1. **normal** (source-over)
   - Default, overlays without special blending
   - Use for: Normal painting

2. **multiply**
   - Darkens image, good for shadows
   - Use for: Shadow layers, darkening

3. **screen**
   - Lightens image, good for light effects
   - Use for: Light glows, highlights

4. **overlay**
   - Combines multiply and screen
   - Use for: Detail enhancement

5. **color-dodge**
   - Brightens significantly, intense effect
   - Use for: Light rays, glow effects

6. **color-burn**
   - Darkens significantly, intense effect
   - Use for: Shadow enhancement

7. **darken**
   - Only shows darker pixels
   - Use for: Shadow layers

8. **lighten**
   - Only shows lighter pixels
   - Use for: Light layers

9. **hard-light**
   - Strong contrast effect
   - Use for: Contrast enhancement

10. **soft-light**
    - Subtle overlay effect
    - Use for: Subtle adjustments

### How to Apply Blend Mode

1. **Open Layers Panel**
   - Click 📐 **Layers** button (if not visible)

2. **Select a Layer**
   - Click on any layer in the list

3. **Click Blend Mode Dropdown**
   - Default shows "source-over"
   - Click to open list

4. **Choose Blend Mode**
   - Click desired mode from dropdown
   - Dropdown auto-closes
   - Effect applies instantly to canvas

5. **See Changes**
   - Canvas updates immediately
   - Active mode shown in dropdown
   - Checkmark (✓) indicates active mode

### Blend Mode Examples

#### Shadow Depth
```
Layer 1: Purple shape (multiply mode) - adds shadow
Layer 2: Blue shape (normal mode) - main layer
Effect: Shadow layer darkens what's below
```

#### Light Glow
```
Layer 1: Yellow glow (screen mode) - adds light
Layer 2: Image (normal mode) - main layer
Effect: Glow layer brightens what's below
```

#### Overlay Effect
```
Layer 1: Detail (overlay mode) - adds contrast
Layer 2: Base image (normal mode) - foundation
Effect: Detail layer enhances contrast
```

---

## Phase 2 Workflow Example

### Drawing with Full Phase 2 Tools

**Step 1: Setup**
1. Open Paint Studio
2. Enable color wheel: 🎨 Color
3. Tool options already visible: ⚙️ Options

**Step 2: Draw Base**
1. Select **Brush** tool
2. In **Tool Options**, set:
   - Brush Shape: Circle
   - Texture Amount: 20
3. In **Color Wheel**, select vibrant blue
4. Paint on canvas

**Step 3: Add Shadow**
1. Create new layer: 📐 Layers → [Add Layer]
2. Select **Pencil** tool
3. In **Tool Options**, set:
   - Hardness: 0.5 (soft)
   - Stabilization: 5
4. In **Color Wheel**, select dark purple
5. Draw shadow details
6. Change layer blend mode to **multiply**
7. Adjust layer opacity for effect

**Step 4: Add Highlights**
1. Create new layer
2. Select **Brush** tool
3. In **Tool Options**, set:
   - Brush Shape: Diamond
   - Texture Amount: 30
4. In **Color Wheel**, select bright yellow
5. Paint highlights
6. Change layer blend mode to **screen**
7. Lower opacity to 60%

**Step 5: Final Touch**
1. Add text layer with text tool
2. Customize in **Tool Options**:
   - Font Size: 32
   - Font Family: Arial
   - Alignment: Center
3. Position with color indicating final position

---

## Tips & Tricks

### Color Wheel Pro Tips
- **Quick History Access**: Click History tab for previously used colors
- **Precise HSL**: Use sliders for exact color values
- **Hex Input**: Paste hex codes directly for exact colors
- **Complementary Colors**: Use suggested complement for balanced color schemes

### Tool Options Pro Tips
- **Save Workflow**: Configure tool options once, they stick for session
- **Tool Switching**: Options automatically update when you switch tools
- **Reset**: Use reset button to return to defaults
- **Advanced**: Expand advanced options for power-user settings

### Blend Mode Pro Tips
- **Layer Order Matters**: Blend modes affect what's below
- **Opacity + Blend**: Combine opacity (0-100%) with blend modes
- **Experimentation**: Try different blends to find effects
- **Common Combos**:
  - Multiply + 70% opacity = natural shadow
  - Screen + 50% opacity = subtle glow
  - Overlay + 100% opacity = strong contrast

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Toggle Color Wheel | N/A (use button) |
| Toggle Tool Options | N/A (auto-visible) |
| Toggle Layers | N/A (use button) |
| Undo | Ctrl+Z |
| Redo | Ctrl+Shift+Z |
| Download | N/A (use button) |

---

## Troubleshooting

**Q: Color wheel not showing?**  
A: Click 🎨 Color button in secondary toolbar to toggle

**Q: Tool options not updating when I switch tools?**  
A: Make sure you're clicking different tools. Options update automatically

**Q: Blend mode not applying?**  
A: Make sure layer is visible, check opacity isn't 0%

**Q: Color changes but tool color doesn't update?**  
A: Make sure to use the color wheel to set tool color (not just view)

---

## Next Steps

Once you're comfortable with Phase 2:
- **Phase 3** will add Selection Tools (rectangle, free, magic wand)
- **Transform Tools** for moving and rotating selections
- **More Blend Modes** and advanced blending options

---

**Ready to create with professional tools! 🎨✨**
