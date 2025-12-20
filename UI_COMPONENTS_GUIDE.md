# 🎨 AmAha UI Component Library

A complete, modern, reusable component library built with React and Tailwind CSS, inspired by Quiz.com's clean design.

---

## 📦 Components Overview

### 1. **Button**
Versatile button component with multiple variants and sizes.

**File**: `src/components/ui/Button.jsx`

**Variants**:
- `primary` - Main action button (blue)
- `secondary` - Secondary action button (gray)
- `danger` - Destructive action (red)
- `success` - Positive action (green)
- `ghost` - Transparent, text-only button

**Sizes**:
- `sm` - Small buttons (padding: 3px 12px)
- `md` - Medium buttons (default)
- `lg` - Large buttons
- `xl` - Extra large buttons

**Props**:
```typescript
<Button
  variant="primary"        // Button style
  size="md"               // Button size
  fullWidth              // Takes 100% width
  isLoading              // Shows loading spinner
  disabled               // Disabled state
  onClick={handleClick}  // Click handler
>
  Click me
</Button>
```

**Examples**:
```jsx
import { Button } from '../components/ui';

// Primary CTA button
<Button variant="primary" size="lg">Start Quiz</Button>

// Loading state
<Button isLoading>Submitting...</Button>

// Full-width danger button
<Button variant="danger" fullWidth>Delete Account</Button>

// Ghost button (text-only)
<Button variant="ghost">Skip</Button>
```

---

### 2. **Input**
Text input component with validation states, labels, and helper text.

**File**: `src/components/ui/Input.jsx`

**Types**:
- `text` - Regular text input
- `email` - Email validation
- `password` - Password field
- `number` - Number input
- `tel` - Telephone input
- `url` - URL input

**Props**:
```typescript
<Input
  label="Email Address"      // Field label
  type="email"              // Input type
  placeholder="name@example.com"
  value={value}            // Controlled input
  onChange={handleChange}  // Change handler
  error="Email is required" // Error message
  helperText="We'll never share your email"
  disabled                 // Disabled state
  required                 // Required field
  fullWidth               // 100% width
  icon={<Icon />}         // Prefix/suffix icon
  iconPosition="left"     // Icon position
/>
```

**Examples**:
```jsx
import { Input } from '../components/ui';
import { SearchIcon } from 'lucide-react'; // or your icon library

// Basic email input
<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  required
/>

// With validation error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  helperText="Use uppercase, numbers, and symbols"
/>

// With icon
<Input
  type="text"
  placeholder="Search quizzes..."
  icon={<SearchIcon />}
  iconPosition="left"
/>

// Full-width search
<Input
  placeholder="Search categories..."
  fullWidth
/>
```

---

### 3. **Card**
Container component for grouped content with optional elevation or outline.

**File**: `src/components/ui/Card.jsx`

**Variants**:
- `elevated` - Box shadow (default)
- `outlined` - Border only

**Props**:
```typescript
<Card
  variant="elevated"    // Card style
  hover               // Enable hover effects
  onClick={handleClick} // Click handler
>
  Card content here
</Card>
```

**Examples**:
```jsx
import { Card } from '../components/ui';

// Quiz category card
<Card hover onClick={() => navigate('/quiz/students')}>
  <h3>Students</h3>
  <p>42 Quizzes</p>
</Card>

// Achievement card
<Card variant="outlined">
  <h4>🏆 Gold Badge</h4>
  <p>Completed 15 levels</p>
</Card>

// Feature card (clickable)
<Card hover onClick={openQuizEditor}>
  <span className="text-4xl">✏️</span>
  <h3>Create Quiz</h3>
  <p>Build your own quizzes</p>
</Card>
```

---

### 4. **Badge**
Small label/tag component for status, categories, or labels.

**File**: `src/components/ui/Badge.jsx`

**Variants**:
- `default` - Gray badge
- `primary` - Blue badge
- `success` - Green badge
- `warning` - Amber/yellow badge
- `error` - Red badge
- `accent` - Pink accent badge

**Sizes**:
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large

**Examples**:
```jsx
import { Badge } from '../components/ui';

// Difficulty badges
<Badge variant="success">Easy</Badge>
<Badge variant="warning">Medium</Badge>
<Badge variant="error">Hard</Badge>

// Category badges
<Badge variant="primary">Entertainment</Badge>

// Achievement badges
<Badge variant="accent" size="lg">⭐ Premium</Badge>

// Status badges
<div className="flex gap-2">
  <Badge variant="success">Active</Badge>
  <Badge>In Progress</Badge>
</div>
```

---

### 5. **Modal**
Dialog/popup component for forms, confirmations, and alerts. Supports header, body, and footer sections.

**File**: `src/components/ui/Modal.jsx`

**Sizes**:
- `sm` - Small dialog
- `md` - Medium (default)
- `lg` - Large
- `xl` - Extra large

**Props**:
```typescript
<Modal
  isOpen={isOpen}                    // Show/hide modal
  onClose={handleClose}             // Close handler
  size="md"                         // Modal size
  closeOnBackdropClick={true}       // Close on background click
>
  <Modal.Header onClose={handleClose}>Title</Modal.Header>
  <Modal.Body>Content here</Modal.Body>
  <Modal.Footer>Actions</Modal.Footer>
</Modal>
```

**Examples**:
```jsx
import { Modal, Button, Input } from '../components/ui';
import { useState } from 'react';

function JoinQuizModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState('');

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Join Quiz</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
        <Modal.Header onClose={() => setIsOpen(false)}>Enter PIN</Modal.Header>
        <Modal.Body>
          <Input
            label="Quiz PIN"
            placeholder="123 456"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            fullWidth
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary">Join Quiz</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
```

---

### 6. **Avatar**
User profile image component with fallback to initials.

**File**: `src/components/ui/Avatar.jsx`

**Sizes**:
- `sm` - 32px
- `md` - 40px (default)
- `lg` - 64px
- `xl` - 96px

**Props**:
```typescript
<Avatar
  src="https://example.com/avatar.jpg" // Image URL
  alt="User Name"
  name="John Doe"    // Shows initials if no src
  size="md"
/>
```

**Examples**:
```jsx
import { Avatar } from '../components/ui';

// With image
<Avatar
  src={user.photoURL}
  alt={user.name}
  size="md"
/>

// With initials (no image)
<Avatar name="Sarah Johnson" size="lg" />

// In user card
<div className="flex items-center gap-3">
  <Avatar name={user.name} size="md" />
  <div>
    <p className="font-bold">{user.name}</p>
    <p className="text-sm text-gray-500">Rank: #{user.rank}</p>
  </div>
</div>
```

---

### 7. **Spinner**
Loading indicator for async operations.

**File**: `src/components/ui/Spinner.jsx`

**Sizes**:
- `sm` - 24px
- `md` - 32px (default)
- `lg` - 48px
- `xl` - 64px

**Props**:
```typescript
<Spinner
  size="md"
  text="Loading..."  // Optional text
/>
```

**Examples**:
```jsx
import { Spinner } from '../components/ui';

// Just spinner
<Spinner />

// Spinner with text
<Spinner text="Loading quizzes..." size="md" />

// In a container
<div className="flex items-center justify-center h-40">
  <Spinner text="Starting quiz..." />
</div>

// Large spinner
<Spinner size="lg" text="Processing..." />
```

---

## 🎯 Usage Examples

### Example 1: Quiz Join Modal
```jsx
import { useState } from 'react';
import { Modal, Button, Input, Badge } from '../components/ui';

export function JoinQuizModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (!pin) {
      setError('PIN is required');
      return;
    }
    // Join logic here
  };

  return (
    <>
      <Button variant="primary" size="lg">
        Join Game
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="sm">
        <Modal.Header onClose={() => setIsOpen(false)}>
          Join Quiz Game
        </Modal.Header>
        <Modal.Body>
          <Input
            label="Enter PIN"
            placeholder="e.g., 123456"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            error={error}
            fullWidth
          />
          <div className="mt-4">
            <Badge variant="info">Get the PIN from the quiz host</Badge>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleJoin}>
            Join Quiz
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
```

### Example 2: Category Cards Grid
```jsx
import { Card, Badge } from '../components/ui';

const categories = [
  { id: 1, name: 'Entertainment', count: 42, difficulty: 'Easy' },
  { id: 2, name: 'Science', count: 28, difficulty: 'Medium' },
  { id: 3, name: 'History', count: 35, difficulty: 'Hard' },
];

export function CategoriesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((cat) => (
        <Card key={cat.id} hover onClick={() => navigate(`/quiz/${cat.id}`)}>
          <h3 className="text-lg font-bold mb-2">{cat.name}</h3>
          <p className="text-gray-600 mb-3">{cat.count} quizzes</p>
          <Badge variant="primary">{cat.difficulty}</Badge>
        </Card>
      ))}
    </div>
  );
}
```

### Example 3: User Profile Header
```jsx
import { Avatar, Badge, Button } from '../components/ui';

export function UserProfileHeader({ user }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Avatar src={user.avatar} name={user.name} size="lg" />
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-600">Level {user.level}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="success">⭐ Premium</Badge>
            <Badge variant="warning">{user.xp} XP</Badge>
          </div>
        </div>
      </div>
      <Button variant="secondary">Edit Profile</Button>
    </div>
  );
}
```

---

## 🎨 Styling & Customization

### Adding Custom Classes
All components accept a `className` prop for custom styling:

```jsx
<Button
  variant="primary"
  className="text-lg font-bold shadow-lg"
>
  Custom Button
</Button>

<Card className="bg-gradient-to-r from-primary-500 to-accent-pink">
  Gradient Card
</Card>
```

### Using Tailwind Utilities
Since we're using Tailwind, you can combine components with utility classes:

```jsx
<div className="flex flex-col md:flex-row gap-6 p-8">
  <Card className="flex-1">
    <h3>Feature 1</h3>
  </Card>
  <Card className="flex-1">
    <h3>Feature 2</h3>
  </Card>
</div>
```

---

## 🚀 Best Practices

1. **Import from index.js**
   ```jsx
   // ✅ Good
   import { Button, Input, Card } from '../components/ui';
   
   // ❌ Avoid
   import { Button } from '../components/ui/Button';
   ```

2. **Use semantic HTML**
   - Buttons for actions
   - Inputs for data entry
   - Cards for content grouping

3. **Accessibility**
   - Always add labels to inputs
   - Use proper button types
   - Include error messages for validation

4. **Responsive design**
   ```jsx
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
     {/* Cards stack on mobile, 2 on tablet, 3 on desktop */}
   </div>
   ```

5. **Consistent spacing**
   ```jsx
   <div className="space-y-6"> {/* 24px vertical gap */}
     <Card>Item 1</Card>
     <Card>Item 2</Card>
   </div>
   ```

---

## 📝 Component Checklist

- [x] Button - Primary action button
- [x] Input - Form input field
- [x] Card - Content container
- [x] Badge - Status/label component
- [x] Modal - Dialog component
- [x] Avatar - User profile image
- [x] Spinner - Loading indicator
- [ ] Tabs - Tabbed content (coming soon)
- [ ] Dropdown - Menu component (coming soon)
- [ ] Toast - Notification component (coming soon)
- [ ] Table - Data table (coming soon)

---

## 🤝 Contributing

When adding new components:
1. Create component file in `src/components/ui/`
2. Export from `index.js`
3. Document usage with examples
4. Support multiple variants/sizes
5. Make responsive by default

---

**Last Updated**: December 20, 2025
**Version**: 1.0.0
