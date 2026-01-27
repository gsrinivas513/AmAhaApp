# Paint Studio Modern UI - CSS Reference & Visual Guide

**Quick Copy-Paste CSS Examples for Common Components**

---

## 🎨 Color Palette Reference

```css
/* Primary Actions (Orange) */
--color-primary: #FF6B35;
--color-primary-light: #FF7A4D;
--color-primary-dark: #E5591F;

/* Selection Tools (Cyan) */
--color-cyan: #00D4FF;
--color-cyan-dark: #0099FF;

/* Success (Green) */
--color-success: #10B981;

/* Dark Theme (Greys) */
--bg-darkest: #0F0F0F;
--bg-dark: #1A1A1A;
--bg-darker: #242424;

/* Text */
--text-primary: #F5F5F5;
--text-secondary: #B0B0B0;
```

**Visual Swatch**:
```
┌─────────────────────────────────┐
│ Primary   │ #FF6B35  ■■■■■     │
│ Primary   │ #FF7A4D  ■■■■■     │
│ Primary   │ #E5591F  ■■■■■     │
├─────────────────────────────────┤
│ Cyan      │ #00D4FF  ■■■■■     │
│ Cyan Dark │ #0099FF  ■■■■■     │
├─────────────────────────────────┤
│ Success   │ #10B981  ■■■■■     │
├─────────────────────────────────┤
│ Dark BG   │ #1A1A1A  ■■■■■     │
│ Text      │ #F5F5F5  ■■■■■     │
└─────────────────────────────────┘
```

---

## 🔘 Button Styles

### Primary Button (Download, Clear, etc.)

```css
.btn-primary {
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #FF6B35 0%, #FF5722 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}

.btn-primary:active {
  transform: translateY(0px);
}
```

**HTML Usage**:
```html
<button class="btn-primary">📥 Download</button>
```

**Before/After**:
```
BEFORE: Plain flat orange button, no feedback
AFTER:  Gradient orange, lifts on hover, shadow grows
```

---

### Secondary Button (Undo, Redo, Zoom)

```css
.btn-secondary {
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #667EEA 0%, #764BA2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}

.btn-secondary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.3);
}
```

**HTML Usage**:
```html
<button class="btn-secondary">↶ Undo</button>
<button class="btn-secondary">↷ Redo</button>
```

---

### Selection Tool Button (Rect, Lasso, Wand, Move)

```css
.btn-selection {
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  border: 2px solid transparent;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-selection:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-selection.active {
  background: linear-gradient(135deg, #00D4FF 0%, #0099FF 100%);
  color: white;
  box-shadow: 0 0 16px rgba(0, 212, 255, 0.5);
}
```

**HTML Usage**:
```html
<button class="btn-selection">□ Rect</button>
<button class="btn-selection active">□ Rect</button> <!-- When active -->
```

---

## 🎛️ Input Fields & Sliders

### Text Input / Number Input

```css
input[type="text"],
input[type="number"] {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #F5F5F5;
  padding: 8px 12px;
  font-size: 13px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

input[type="text"]:focus,
input[type="number"]:focus {
  outline: none;
  border-color: rgba(255, 107, 53, 0.5);
  box-shadow: 0 0 8px rgba(255, 107, 53, 0.3);
  background: rgba(255, 255, 255, 0.08);
}
```

**HTML Usage**:
```html
<input type="text" placeholder="Search..." />
<input type="number" value="100" />
```

---

### Modern Slider / Range Input

```css
input[type="range"] {
  width: 100%;
  height: 24px;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

/* Track (background bar) */
input[type="range"]::-webkit-slider-track {
  background: linear-gradient(90deg,
    rgba(255, 107, 53, 0.2) 0%,
    rgba(255, 107, 53, 0.4) 100%);
  border-radius: 8px;
  height: 6px;
  border: 1px solid rgba(255, 107, 53, 0.3);
}

/* Thumb (draggable circle) */
input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35 0%, #FF5722 100%);
  box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
  border: none;
  cursor: grab;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 16px rgba(255, 107, 53, 0.6);
}

input[type="range"]::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.1);
}
```

**HTML Usage**:
```html
<input type="range" min="0" max="100" value="50" />
```

**Visual**:
```
Before: ────○──── (Plain, static)
After:  ════●════ (Gradient track, animated thumb)
         Hover: ⊙ (Grows on hover)
```

---

## 📦 Panel Cards

### Card Style Panel

```css
.panel-card {
  background: linear-gradient(135deg, #1F1F1F 0%, #2A2A2A 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  padding: 20px;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 300px;
}

.panel-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

**HTML Usage**:
```html
<div class="panel-card">
  <div class="panel-title">Selection</div>
  <!-- Content -->
</div>
```

---

### Glass-Morphism Panel

```css
.panel-glass {
  background: rgba(26, 26, 26, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.05);
  padding: 20px;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Visual**:
```
Card:   Solid background with gradient
Glass:  Frosted glass effect with blur
```

---

## 📋 List Items (Presets, Selections)

```css
.list-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.list-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateX(2px);
}

.list-item.active {
  background: linear-gradient(135deg, #FF6B35 0%, #FF5722 100%);
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
  color: white;
}
```

**HTML Usage**:
```html
<div class="list-item">
  <div class="list-item-content">
    <div class="list-item-title">Brush Name</div>
    <div class="list-item-meta">Size: 20px • Opacity: 100%</div>
  </div>
  <div class="list-item-action">
    <button>Delete</button>
  </div>
</div>

<div class="list-item active">
  <!-- Active item with highlight -->
</div>
```

---

## 🎯 Toolbar Sections

```css
.paint-toolbar {
  background: #1A1A1A;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 14px 16px;
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.toolbar-section {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 0 12px;
}

.toolbar-section:not(:last-child) {
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.toolbar-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 4px;
}
```

**HTML Usage**:
```html
<div class="paint-toolbar">
  <!-- Edit Section -->
  <div class="toolbar-section">
    <span class="section-label">Edit</span>
    <button class="btn-secondary">↶ Undo</button>
    <button class="btn-secondary">↷ Redo</button>
  </div>
  
  <div class="toolbar-divider"></div>
  
  <!-- Selection Section -->
  <div class="toolbar-section">
    <span class="section-label">Select</span>
    <button class="btn-selection">□ Rect</button>
    <button class="btn-selection">✏ Lasso</button>
    <button class="btn-selection">✨ Wand</button>
  </div>
  
  <!-- More sections... -->
</div>
```

---

## ✨ Animation Classes

### Slide In
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.element {
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Scale In
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.element {
  animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.element {
  animation: fadeIn 0.2s ease-out;
}
```

### Marching Ants (Selection)
```css
@keyframes marchAnts {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 20px; }
}

.marching-ants {
  stroke: #00D4FF;
  stroke-dasharray: 10, 5;
  animation: marchAnts 0.5s linear infinite;
}
```

---

## 🚀 Complete Component Examples

### Minimal Button Setup
```html
<!-- Include CSS -->
<link rel="stylesheet" href="ModernUI.css">

<!-- Use buttons -->
<button class="btn-primary">Download</button>
<button class="btn-secondary">Undo</button>
<button class="btn-selection active">Rectangle</button>
```

### Minimal Slider Setup
```html
<div style="display: flex; gap: 12px; align-items: center;">
  <label>Opacity:</label>
  <input type="range" min="0" max="100" value="80">
  <span>80%</span>
</div>
```

### Minimal Panel Setup
```html
<div class="panel-card">
  <div class="panel-title">Selection</div>
  
  <div class="panel-section">
    <label class="panel-label">Position</label>
    <div class="panel-row">
      <label>X:</label>
      <input type="number" value="0" />
    </div>
    <div class="panel-row">
      <label>Y:</label>
      <input type="number" value="0" />
    </div>
  </div>
  
  <div class="btn-group-vertical">
    <button class="btn-primary">Invert</button>
    <button class="btn-primary">Grow</button>
    <button class="btn-primary">Clear</button>
  </div>
</div>
```

---

## 📱 Responsive Breakpoints

### Desktop (1200px+)
- Full width panels
- All buttons visible
- Normal spacing

### Tablet (768px - 1199px)
```css
@media (max-width: 1200px) {
  .panel-card {
    min-width: 250px;
  }
}
```

### Mobile (< 768px)
```css
@media (max-width: 768px) {
  .paint-toolbar {
    gap: 8px;
  }
  
  .btn-primary, .btn-secondary, .btn-selection {
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .panel-card {
    min-width: 100%;
    max-height: 200px;
    overflow-y: auto;
  }
}
```

---

## 🔧 Customization Snippets

### Change Primary Color (Orange → Blue)
```css
:root {
  --color-primary: #0066FF;
  --color-primary-light: #3399FF;
  --color-primary-dark: #0052CC;
  --gradient-primary: linear-gradient(135deg, #0066FF 0%, #003FCC 100%);
  --shadow-primary: 0 4px 12px rgba(0, 102, 255, 0.3);
}
```

### Make Animations Faster
```css
:root {
  /* 0.2s → 0.1s */
  /* In all transition: all 0.2s ... change to 0.1s */
}
```

### Increase Button Size
```css
.btn-primary {
  padding: 12px 24px; /* was 10px 18px */
  font-size: 14px; /* was 13px */
}
```

### More Rounded Buttons
```css
.btn-primary {
  border-radius: 12px; /* was 6px */
}
```

---

## ✅ Testing Checklist

After applying styles:
- [ ] Buttons have gradient backgrounds
- [ ] Buttons lift on hover
- [ ] Buttons press on click
- [ ] Sliders have modern track/thumb
- [ ] Sliders are smooth and draggable
- [ ] Input fields focus with glow
- [ ] Panels have shadow and border
- [ ] Panels slide in smoothly
- [ ] Selection tools toggle properly
- [ ] Marching ants animate
- [ ] Works on dark theme
- [ ] Mobile responsive

---

## 💡 Pro Tips

1. **Mix & Match**: Use modern buttons with old panels, or vice versa
2. **Customize Safely**: Only change CSS variables, don't modify selectors
3. **Test Mobile**: Check padding/size at 320px width
4. **Browser Test**: Chrome, Firefox, Safari all support these features
5. **Performance**: CSS animations are fast (GPU accelerated)

---

**Ready to use! Copy CSS classes directly into your HTML.** 🎨
