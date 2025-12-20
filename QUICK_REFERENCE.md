# 🚀 AmAha Quick Reference Guide

Fast lookup for building features on AmAhaApp. Bookmark this!

---

## ⚡ Quick Commands

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test
```

---

## 📦 Import UI Components

```jsx
import { 
  Button, 
  Input, 
  Card, 
  Badge, 
  Modal, 
  Avatar, 
  Spinner 
} from '../components/ui';
```

---

## 🎨 Color Quick Reference

### Primary Colors
```jsx
className="text-primary-600"      // Main brand color
className="bg-primary-500"        // Lighter version
className="hover:bg-primary-700"  // Darker hover
```

### Accent Colors
```jsx
className="text-accent-pink"      // Pink
className="text-accent-teal"      // Teal
className="text-accent-amber"     // Amber
className="text-accent-violet"    // Violet
className="text-accent-lime"      // Lime
```

### Semantic Colors
```jsx
className="text-success"          // Green ✓
className="text-warning"          // Amber ⚠️
className="text-error"            // Red ✗
className="text-info"             // Blue ℹ️
```

---

## 🔘 Button Variants

```jsx
{/* Primary - Main action */}
<Button variant="primary">Save Quiz</Button>

{/* Secondary - Alternative action */}
<Button variant="secondary">Cancel</Button>

{/* Danger - Destructive action */}
<Button variant="danger">Delete</Button>

{/* Success - Positive action */}
<Button variant="success">Submit</Button>

{/* Ghost - Text-only button */}
<Button variant="ghost">Skip</Button>

{/* With loading state */}
<Button isLoading>Saving...</Button>

{/* Disabled state */}
<Button disabled>Can't Click</Button>

{/* Full width */}
<Button fullWidth>Full Width Button</Button>
```

---

## 📝 Input Examples

```jsx
{/* Basic input */}
<Input label="Full Name" placeholder="John Doe" required />

{/* Email input */}
<Input 
  type="email" 
  label="Email" 
  placeholder="name@example.com" 
/>

{/* With error */}
<Input
  label="Password"
  type="password"
  error="Password must be 8+ characters"
/>

{/* With helper text */}
<Input
  label="Confirm Password"
  type="password"
  helperText="Must match your password"
/>

{/* With icon */}
import { SearchIcon } from 'lucide-react';
<Input icon={<SearchIcon />} placeholder="Search..." />

{/* Full width */}
<Input fullWidth label="Category Name" />
```

---

## 🃏 Card Examples

```jsx
{/* Basic card */}
<Card>
  <h3>Quiz Title</h3>
  <p>Description</p>
</Card>

{/* Hover effect */}
<Card hover onClick={handleClick}>
  <h3>Clickable Card</h3>
</Card>

{/* Outlined variant */}
<Card variant="outlined">
  <h3>Outlined Card</h3>
</Card>

{/* Multiple cards in grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {quizzes.map(quiz => (
    <Card key={quiz.id} hover>
      <h3>{quiz.name}</h3>
    </Card>
  ))}
</div>
```

---

## 🏷️ Badge Examples

```jsx
{/* Difficulty badges */}
<Badge variant="success">Easy</Badge>
<Badge variant="warning">Medium</Badge>
<Badge variant="error">Hard</Badge>

{/* Category badges */}
<Badge variant="primary">Entertainment</Badge>

{/* Status badges */}
<Badge variant="success">✓ Active</Badge>
<Badge variant="warning">⏳ Pending</Badge>
<Badge variant="error">✗ Failed</Badge>

{/* Large badge */}
<Badge variant="accent" size="lg">⭐ Premium</Badge>

{/* Multiple badges */}
<div className="flex gap-2">
  <Badge>React</Badge>
  <Badge>Tailwind</Badge>
  <Badge>Firebase</Badge>
</div>
```

---

## 🪟 Modal Examples

```jsx
import { useState } from 'react';
import { Modal, Button, Input } from '../components/ui';

{/* Basic modal */}
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header onClose={() => setIsOpen(false)}>
    Dialog Title
  </Modal.Header>
  <Modal.Body>
    <p>Dialog content here</p>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary">Confirm</Button>
  </Modal.Footer>
</Modal>

{/* Different sizes */}
<Modal isOpen={isOpen} size="sm">  {/* Small */}
<Modal isOpen={isOpen} size="md">  {/* Medium (default) */}
<Modal isOpen={isOpen} size="lg">  {/* Large */}
<Modal isOpen={isOpen} size="xl">  {/* Extra large */}
```

---

## 👤 Avatar Examples

```jsx
{/* With image */}
<Avatar 
  src="https://example.com/avatar.jpg" 
  alt="User Name"
  size="md"
/>

{/* With initials (no image) */}
<Avatar name="Sarah Johnson" size="lg" />

{/* In a user card */}
<div className="flex items-center gap-3">
  <Avatar name={user.name} size="md" />
  <div>
    <p className="font-bold">{user.name}</p>
    <p className="text-sm text-gray-500">Rank: #{user.rank}</p>
  </div>
</div>

{/* Avatar sizes */}
<Avatar name="John" size="sm" />  {/* 32px */}
<Avatar name="John" size="md" />  {/* 40px */}
<Avatar name="John" size="lg" />  {/* 64px */}
<Avatar name="John" size="xl" />  {/* 96px */}
```

---

## ⏳ Spinner Examples

```jsx
{/* Basic spinner */}
<Spinner />

{/* Spinner with text */}
<Spinner text="Loading..." />

{/* Different sizes */}
<Spinner size="sm" text="Small" />
<Spinner size="md" text="Medium" />
<Spinner size="lg" text="Large" />

{/* Centered on page */}
<div className="flex items-center justify-center h-screen">
  <Spinner size="lg" text="Loading quizzes..." />
</div>

{/* In a container */}
<div className="w-full h-40 flex items-center justify-center">
  <Spinner text="Processing..." />
</div>
```

---

## 📱 Responsive Classes

```jsx
{/* Mobile-first grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>

{/* Responsive text size */}
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Title
</h1>

{/* Hide/show on different screens */}
<div className="hidden md:block">
  {/* Only shows on tablet and above */}
</div>

{/* Stack on mobile, side-by-side on desktop */}
<div className="flex flex-col md:flex-row gap-4">
  <Card className="flex-1">Item 1</Card>
  <Card className="flex-1">Item 2</Card>
</div>
```

---

## 🎯 Common Patterns

### Quiz Category Card
```jsx
<Card hover onClick={() => navigate(`/quiz/${cat.id}`)}>
  <div className="text-3xl mb-2">🎮</div>
  <h3 className="text-lg font-bold">{cat.name}</h3>
  <p className="text-gray-600 mb-3">{cat.count} quizzes</p>
  <Badge variant="primary">{cat.difficulty}</Badge>
</Card>
```

### User Profile Header
```jsx
<div className="flex items-center justify-between mb-6">
  <div className="flex items-center gap-4">
    <Avatar src={user.avatar} name={user.name} size="lg" />
    <div>
      <h2 className="text-2xl font-bold">{user.name}</h2>
      <p className="text-gray-600">Level {user.level}</p>
    </div>
  </div>
  <Button variant="secondary">Edit</Button>
</div>
```

### Quiz Question
```jsx
<Card className="space-y-4">
  <div>
    <Badge variant="info">Question 3 of 10</Badge>
    <h3 className="mt-3 text-xl font-bold">{question.text}</h3>
  </div>
  
  <div className="space-y-2">
    {question.options.map((opt) => (
      <button
        key={opt.id}
        onClick={() => selectAnswer(opt.id)}
        className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-primary-600 transition"
      >
        {opt.text}
      </button>
    ))}
  </div>

  <Button variant="primary" fullWidth>
    Submit Answer
  </Button>
</Card>
```

### Loading State
```jsx
{isLoading ? (
  <Spinner text="Loading quizzes..." />
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {/* Quiz cards */}
  </div>
)}
```

---

## 🔧 Tailwind Spacing Reference

```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
base: 1rem (16px)
md: 1.5rem (24px)
lg: 2rem (32px)
xl: 3rem (48px)
2xl: 4rem (64px)
```

Usage:
```jsx
<div className="p-6">        {/* 24px padding */}
<div className="m-4">        {/* 16px margin */}
<div className="gap-8">      {/* 32px gap */}
<div className="space-y-4"> {/* 16px vertical spacing */}
```

---

## 🎨 Font Sizes

```
xs: 0.75rem (12px)
sm: 0.875rem (14px)
base: 1rem (16px)
lg: 1.125rem (18px)
xl: 1.25rem (20px)
2xl: 1.5rem (24px)
3xl: 1.875rem (30px)
4xl: 2.25rem (36px)
5xl: 3rem (48px)
```

Usage:
```jsx
<p className="text-sm">Small text</p>
<p className="text-base">Normal text</p>
<h2 className="text-2xl font-bold">Heading</h2>
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **DEVELOPMENT_ROADMAP.md** | Your 5-phase development plan |
| **UI_COMPONENTS_GUIDE.md** | Complete component reference |
| **SETUP_SUMMARY.md** | What's been done & next steps |
| **ARCHITECTURE.md** | How the app is structured |
| **FEATURES.md** | Current & planned features |

---

## 🔗 Useful Links

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [Lucide Icons](https://lucide.dev)

---

## 💡 Pro Tips

1. **Always use responsive classes**: `grid-cols-1 md:grid-cols-2`
2. **Use gap instead of margin**: `gap-4` instead of `m-4`
3. **Leverage Tailwind utilities**: No need for extra CSS
4. **Import components from index**: `from '../components/ui'`
5. **Test on mobile first**: Design for small screens, scale up
6. **Use semantic colors**: `text-error`, `text-success`, not hardcoded colors
7. **Wrap modals in state**: Use `useState` for modal visibility
8. **Add loading states**: Show spinner while fetching data
9. **Handle errors gracefully**: Show error messages in inputs
10. **Keep components small**: Single responsibility principle

---

**Last Updated**: December 20, 2025
**Quick Links**: [Roadmap](./DEVELOPMENT_ROADMAP.md) | [Components](./UI_COMPONENTS_GUIDE.md) | [Summary](./SETUP_SUMMARY.md)
