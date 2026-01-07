---
sidebar_position: 2
title: UI Approach
---

# UI Approach

This page describes AmAha's user interface philosophy and structural approach.

## UI Philosophy

**Keep it simple, make it work.**

AmAha's interface is built on:
- **Clarity first** - Users understand instantly
- **Functionality second** - Features serve clarity
- **Beauty third** - Attractive when possible, clear always
- **Performance always** - Never sacrifice speed for looks

---

## Layout Principles

### Single-Column Design

**Desktop and mobile both use single-column layouts:**

```
Mobile (360px):        Desktop (1024px):
┌──────────┐          ┌──────────────────┐
│ [Nav]    │          │ [Navigation]     │
├──────────┤          ├──────────────────┤
│          │          │                  │
│ Content  │          │   Content Area   │
│  (full   │          │   (centered,     │
│  width)  │          │    max 600px)    │
│          │          │                  │
├──────────┤          ├──────────────────┤
│ [Footer] │          │ [Footer]         │
└──────────┘          └──────────────────┘
```

**Advantages:**
- No horizontal scrolling
- Same layout everywhere
- Easier to code/maintain
- Works on all devices
- Faster to load

---

### Card-Based Layouts

Content organized in cards:

```
┌──────────────────┐
│ Card Header      │
├──────────────────┤
│ Card Content     │
│ • Item 1         │
│ • Item 2         │
├──────────────────┤
│ [Action] [More]  │
└──────────────────┘

┌──────────────────┐
│ Another Card     │
├──────────────────┤
│ More content     │
└──────────────────┘
```

**Card Elements:**
- Title (clear, specific)
- Content (main information)
- Metadata (secondary info)
- Actions (button(s))
- Optional: Image, icon

**Example:**
```
┌──────────────────────────────┐
│ 🧬 Biology Quiz #3           │
│ Photosynthesis               │
├──────────────────────────────┤
│ Plant cells convert sunlight │
│ into chemical energy.        │
│                              │
│ Level: Intermediate          │
│ ⭐⭐⭐⭐ 4.2/5               │
│ 145 plays                    │
│                              │
│ [Try Quiz] [More Details]    │
└──────────────────────────────┘
```

---

### Navigation Structure

#### Top Navigation (All pages)

```
┌─────────────────────────────────────────┐
│ AmAha  [Home] [Browse] [Profile] [+]   │
└─────────────────────────────────────────┘
```

**Elements:**
- **Logo** - Home link
- **Primary Nav** - Browse, Profile
- **Action Button** - Create/Play
- **User Menu** - Settings, Logout

#### Breadcrumb Navigation (When needed)

```
Home > Quizzes > Biology > Photosynthesis Quiz
```

**Usage:**
- Shown when depth > 2 levels
- Each item is clickable
- Helps user orientation

#### Sidebar Navigation (Admin only)

```
┌──────────────────┐  ┌──────────────────┐
│ [Home]           │  │ Main content     │
│ [Create]         │  │                  │
│ [Browse]         │  │                  │
│ [Analytics]      │  │                  │
│ [Manage]         │  │                  │
│ [Settings]       │  │                  │
└──────────────────┘  └──────────────────┘
```

---

## Component Library

### Buttons

**Primary Button:**
```
[Start Quiz] - Blue, 44px height, full width on mobile
```
**Secondary Button:**
```
[Learn More] - Gray, 44px height
```
**Danger Button:**
```
[Delete] - Red, 44px height, requires confirmation
```

**Rules:**
- Minimum 44×44px (tap target)
- Enough padding inside
- Clear, action-oriented labels
- No nested buttons

### Input Fields

**Standard Input:**
```
┌──────────────────────┐
│ label                │
│ [Enter value....... ]│
│ ✓ Success or error   │
└──────────────────────┘
```

**Features:**
- Label above field
- Placeholder text helpful
- Real-time validation optional
- Error message clear
- Success indicator visible

### Modals/Dialogs

**Used minimally:**
```
┌─────────────────────┐
│ × Title             │
├─────────────────────┤
│ Content here        │
│                     │
│ [Cancel] [OK]       │
└─────────────────────┘
```

**Rules:**
- Only when necessary
- Clear title
- Simple content
- Clear action buttons
- Close button (X) always available

### Notifications

**Toast Notifications:**
```
┌────────────────────┐
│ ✓ Quiz saved!      │
└────────────────────┘
```

**Placement:** Bottom-right  
**Duration:** 3-5 seconds  
**Types:** Success, Error, Info, Warning

---

## Content Organization

### Home Page Structure

```
┌──────────────────────────────┐
│ Welcome / Hero Section       │
├──────────────────────────────┤
│ Quick Actions (3-4 buttons)  │
├──────────────────────────────┤
│ Featured Content             │
│ • New quizzes                │
│ • Popular puzzles            │
│ • Today's activity           │
├──────────────────────────────┤
│ By Content Type              │
│ [Quizzes] [Puzzles] [Act....]│
├──────────────────────────────┤
│ By Subject                   │
│ [Biology] [English] [Math]...│
├──────────────────────────────┤
│ Your Progress                │
│ • Quizzes: 25 completed      │
│ • Streak: 12 days            │
└──────────────────────────────┘
```

### Browse Page Structure

```
┌──────────────────────────────┐
│ Filters / Search             │
├──────────────────────────────┤
│ Results Count                │
│ "45 results"                 │
├──────────────────────────────┤
│ Results Cards (Grid)         │
│ [Card 1] [Card 2] [Card 3]   │
│ [Card 4] [Card 5] [Card 6]   │
├──────────────────────────────┤
│ Pagination                   │
│ Previous  1  2  3  Next      │
└──────────────────────────────┘
```

**Grid Layout:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

---

## Typography

### Font Sizes

```
Heading 1: 32px - Page titles
Heading 2: 24px - Section titles
Heading 3: 20px - Subsection titles
Body:      16px - Main content
Small:     14px - Captions, metadata
Tiny:      12px - Legal, timestamps
```

### Font Family

**Primary:** Inter (sans-serif, clean, readable)  
**Secondary:** Georgia (serif, when needed for contrast)  
**Monospace:** Courier New (code)

### Line Height

- **Headings:** 1.2x font size
- **Body:** 1.5x font size
- **Code:** 1.6x font size

---

## Color Palette

### Primary Colors

```
Primary Blue:    #2563EB  (Actions, highlights)
Primary Orange:  #EA580C  (Secondary accent)
```

### Semantic Colors

```
Success Green:   #10B981  (Correct, success)
Warning Orange:  #F59E0B  (Caution, warning)
Error Red:       #EF4444  (Error, danger)
Info Blue:       #3B82F6  (Information)
```

### Neutral Colors

```
Black:           #000000
Dark Gray:       #374151  (Dark text)
Medium Gray:     #9CA3AF  (Secondary text)
Light Gray:      #E5E7EB  (Dividers, borders)
Lighter Gray:    #F3F4F6  (Background)
White:           #FFFFFF
```

### Dark Mode

All colors have dark mode equivalents for OLED/night use.

---

## Spacing System

**8px grid-based spacing:**

```
4px   - Micro spacing (tight)
8px   - Minimal spacing
12px  - Extra small
16px  - Small (default)
24px  - Medium
32px  - Large
48px  - Extra large
64px  - Huge (sections)
```

**Example:**
```
Component:
├─ Padding: 16px (all sides)
├─ Margin Top: 24px
├─ Margin Bottom: 16px
└─ Gap Between Items: 8px
```

---

## Interactive States

### Button States

```
Default:   Blue background, white text
Hover:     Slightly darker blue
Active:    Even darker, slight shadow
Disabled:  Gray, 50% opacity, no pointer
Loading:   Spinner visible, no click
```

### Link States

```
Default:    Underlined, blue
Visited:    Purple (or blue depending on context)
Hover:      Darker, still underlined
Active:     Same as visited
Focus:      Clear focus ring (accessibility)
```

### Form States

```
Empty:      Normal styling
Focused:    Border color change, outline
Filled:     Subtle background change
Invalid:    Red border, error message visible
Valid:      Green checkmark appears
Disabled:   Gray, no interaction
```

---

## Animation & Motion

### Animation Principles

- **Duration:** 200-400ms typical
- **Easing:** Ease-out (natural feel)
- **Trigger:** User action
- **Purpose:** Clarify what happened

### Common Animations

**Fade In:**
- Duration: 300ms
- Usage: Content appears
- Easing: Ease-out

**Slide In:**
- Duration: 400ms
- Usage: Notifications, modals
- Easing: Ease-out

**Scale:**
- Duration: 300ms
- Usage: Button press, hover
- Easing: Ease-out

**Color Change:**
- Duration: 200ms
- Usage: State change
- Easing: Linear

---

## Responsive Design

### Breakpoints

```
Mobile:     < 640px  (1 column)
Tablet:     640-1024px (2 columns)
Desktop:    > 1024px (3+ columns)
```

### Responsive Patterns

**Button Group:**
```
Desktop: [Button 1] [Button 2] [Button 3]
Mobile:  [Button 1]
         [Button 2]
         [Button 3]
```

**Card Grid:**
```
Desktop: [Card] [Card] [Card]
Tablet:  [Card] [Card]
Mobile:  [Card]
```

**Navigation:**
```
Desktop: Horizontal top nav
Mobile:  Hamburger menu (drawer)
Tablet:  Hybrid approach
```

---

## Micro-Interactions

### Feedback Clarity

**On Click:**
- Visual state change < 50ms
- Ripple/highlight effect
- Sound effect (optional)
- Haptic feedback (mobile)

**On Hover (Desktop):**
- Subtle color change
- Cursor change (pointer)
- Slight animation

**Loading:**
- Spinner visible
- "Loading..." text optional
- Don't show if < 500ms

---

## Dark Mode

All pages support dark mode:

**Implementation:**
- Light mode: Default
- Dark mode: Toggle in settings
- System preference: Auto-detected
- Persist user choice

**Color Adjustments:**
- Darken backgrounds
- Lighten text
- Adjust contrast
- Maintain accessibility (AA+)

---

**Next:** [Accessibility](accessibility)
