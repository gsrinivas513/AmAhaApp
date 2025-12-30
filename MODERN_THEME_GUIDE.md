# Modern Theme System Implementation Guide

## Overview

The AmAha app now features a comprehensive modern theme system inspired by PuzzleFree.game, with 5 color variants and full dark mode support.

## Color Themes

### Available Colors
1. **Green** (Default) - Fresh, energetic, and friendly
2. **Blue** - Professional, calm, and trustworthy
3. **Purple** - Creative, mystical, and unique
4. **Red** - Energetic, bold, and passionate
5. **Orange** - Warm, welcoming, and optimistic

### Dark Mode
Each color has dedicated light and dark mode palettes for optimal viewing in any environment.

## Key Components

### 1. ModernTopNavBar.jsx
**Location:** `src/components/ModernTopNavBar.jsx`

Features:
- Glassmorphic design (backdrop blur, frosted glass effect)
- Navigation for all features (Puzzles, Quizzes, Stories, Leaderboard)
- Theme color switcher dropdown
- Dark mode toggle
- User menu with profile/settings
- Coin/score display
- Responsive design

**Usage:**
```jsx
import ModernTopNavBar from './components/ModernTopNavBar';

<ModernTopNavBar />
```

### 2. ModernHomePage.jsx
**Location:** `src/pages/ModernHomePage.jsx`

Features:
- Hero section with gradient text
- Feature highlights (4 cards)
- Main content sections (Puzzles, Quizzes, Stories, Daily Challenges)
- Leaderboard preview
- Fully theme-aware styling
- Professional, modern aesthetic

**Usage:**
```jsx
import ModernHomePage from './pages/ModernHomePage';

<ModernHomePage />
```

### 3. ModernCard.jsx
**Location:** `src/components/ModernCard.jsx`

Features:
- Universal card component for all content types (puzzle, quiz, story, daily, collection)
- Image support with color fallback
- Difficulty badges
- Category tags
- Stats display
- Smooth hover animations
- Type badges (puzzle, quiz, story, etc.)
- Responsive design

**Usage:**
```jsx
import ModernCard from './components/ModernCard';

<ModernCard
  title="Logic Puzzle #42"
  description="Find the missing number in the sequence"
  icon="🧩"
  type="puzzle"
  difficulty="medium"
  category="Math"
  stats={{ Attempts: '2.3K', Rating: '⭐ 4.8' }}
  onClick={() => navigate('/puzzle/42')}
/>
```

## Theme System Integration

### Using the Theme Hook

All components have access to theme through the `useTheme` hook:

```jsx
import { useTheme } from '../theme/ThemeProvider';

export default function MyComponent() {
  const { 
    currentTheme,      // Current theme color object
    themeColor,        // Current color name (green, blue, etc.)
    isDarkMode,        // Boolean dark mode status
    setThemeColor,     // Function to change theme
    toggleDarkMode,    // Function to toggle dark mode
    availableColors    // Array of available color names
  } = useTheme();

  // Use theme properties
  return (
    <div style={{ 
      background: currentTheme.background,
      color: currentTheme.text 
    }}>
      Content
    </div>
  );
}
```

### Theme Properties Available

Each theme color includes:
- `primary` - Main color
- `primaryDark` - Darker shade
- `primaryLight` - Lighter shade
- `secondary` - Complementary color
- `background` - Page background
- `surface` - Card/component background
- `surfaceAlt` - Alternative surface (inputs, etc.)
- `text` - Primary text color
- `textSecondary` - Secondary text color
- `border` - Border colors
- `accent` - Accent color for highlights
- `gradient` - Pre-made gradient using primary colors

## Implementation Steps for Other Pages

### 1. Import Required Components
```jsx
import { useTheme } from '../theme/ThemeProvider';
import ModernCard from '../components/ModernCard';
```

### 2. Apply Theme to Layout
```jsx
const { currentTheme, isDarkMode } = useTheme();

return (
  <div style={{
    background: currentTheme.background,
    color: currentTheme.text,
    minHeight: '100vh'
  }}>
    {/* Content */}
  </div>
);
```

### 3. Use ModernCard for Content
```jsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
  {items.map(item => (
    <ModernCard
      key={item.id}
      title={item.title}
      description={item.description}
      type="quiz"
      difficulty={item.difficulty}
      category={item.category}
      onClick={() => handleClick(item.id)}
    />
  ))}
</div>
```

### 4. Apply Theme to Buttons
```jsx
<button style={{
  background: currentTheme.gradient,
  color: '#ffffff',
  border: 'none',
  padding: '12px 24px',
  borderRadius: 8,
  fontWeight: 600,
  cursor: 'pointer'
}}>
  Click Me
</button>
```

## Migration Checklist

To migrate existing pages to the new modern theme system:

- [ ] Import `useTheme` hook
- [ ] Apply `currentTheme.background` to main container
- [ ] Replace all color hardcodes with `currentTheme` properties
- [ ] Update cards to use `ModernCard` component
- [ ] Add theme-aware hover states
- [ ] Test light and dark modes
- [ ] Test all 5 color themes
- [ ] Verify responsive design

## Pages to Update (Priority Order)

1. **PuzzlePage** - High traffic, visible by most users
2. **QuizPage** - High traffic
3. **StoryPage** - Moderate traffic
4. **LeaderboardPage** - Popular feature
5. **ProfilePage** - User-specific
6. **AdminDashboard** - Internal tool
7. **SettingsPage** - Utility
8. **SearchResultsPage** - Discovery

## Dark Mode CSS Class

Dark mode automatically adds `dark-mode` class to document root:

```css
/* Optional: Use for specific CSS-only adjustments */
.dark-mode .my-component {
  /* Dark mode specific styles */
}
```

## Glassmorphic Design Pattern

Used in ModernTopNavBar for frosted glass effect:

```jsx
style={{
  background: isDarkMode 
    ? 'rgba(15, 23, 42, 0.8)' 
    : 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: `1px solid ${currentTheme.border}`,
}}
```

## Color Accessibility

All color combinations are tested for:
- WCAG AA contrast ratios
- Color blindness compatibility
- Light and dark mode visibility
- Readability across all themes

## Performance Notes

- Theme switching is instant (no page reload)
- localStorage persistence prevents flashing
- CSS-in-JS approach provides dynamic theming without CSS duplication
- Gradient generation is lightweight

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Android Chrome)

All modern browsers support:
- CSS Grid and Flexbox
- backdrop-filter (with fallbacks)
- CSS variables
- CSS gradients

## Future Enhancements

- [ ] Additional custom color picker
- [ ] Scheduled theme switching (auto-dark at night)
- [ ] Accessibility color mode
- [ ] Theme preview before switching
- [ ] Import/export theme settings
- [ ] User-created custom themes
