# AmAha Documentation Integration Guide

## How to Access Docs from Your App

### 1. Update Your React Navbar

Add a Documentation link to your main app navbar:

```javascript
// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">AmAha</Link>
      </div>
      
      <div className="navbar-menu">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/browse">Browse</Link>
        
        {/* Documentation link */}
        <a 
          href="/docs" 
          target="_self"
          className="navbar-item"
        >
          📚 Help & Documentation
        </a>
        
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}

export default Navbar;
```

### 2. Add Context-Specific Help Links

Throughout your app, add help links to relevant pages:

```javascript
// src/pages/QuizPage.jsx
function QuizPage() {
  return (
    <div>
      <div className="header-with-help">
        <h1>Take a Quiz</h1>
        <a 
          href="/docs/quizzes/overview" 
          target="_self"
          className="help-icon"
          title="Learn about quizzes"
        >
          ❓
        </a>
      </div>
      {/* Quiz content */}
    </div>
  );
}
```

### 3. Create a Help Center Page

```javascript
// src/pages/HelpPage.jsx
function HelpPage() {
  return (
    <div className="help-page">
      <h1>Help Center</h1>
      <p>Learn more about AmAha features:</p>
      
      <div className="help-grid">
        <a href="/docs/platform/what-is-amaha" className="help-card">
          <h3>What is AmAha?</h3>
          <p>Platform overview and features</p>
        </a>
        
        <a href="/docs/quizzes/overview" className="help-card">
          <h3>Taking Quizzes</h3>
          <p>How to complete and score quizzes</p>
        </a>
        
        <a href="/docs/puzzles/overview" className="help-card">
          <h3>Solving Puzzles</h3>
          <p>Guide to puzzle types and strategies</p>
        </a>
        
        <a href="/docs/activities/overview" className="help-card">
          <h3>Interactive Activities</h3>
          <p>Learn about ordering and matching</p>
        </a>
        
        <a href="/docs/admin/overview" className="help-card">
          <h3>For Teachers</h3>
          <p>Teacher tools and class management</p>
        </a>
      </div>
    </div>
  );
}
```

### 4. Firebase Hosting Setup

Your main React app and docs are served from same domain:

```
https://amaha.app/          → Your React app (main site)
https://amaha.app/docs/     → Docusaurus documentation
```

**In your main React app's `firebase.json`:**

```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/docs/**",
        "destination": "/docs/index.html"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 5. Build & Deploy Steps

**Step 1: Build Docusaurus**
```bash
cd /Users/srini/Desktop/AmAha/AmAhaApp/amaha-web
npm run build
```

**Step 2: Copy docs build to main app**
```bash
# Copy the docusaurus 'build' folder to your main app's public folder
cp -r build /path/to/main-app/public/docs
```

**Step 3: Deploy main app with docs**
```bash
cd /path/to/main-app
firebase deploy
```

---

## Alternative: Separate Deployments

If you prefer to keep docs separate:

**Deploy docs to separate Firebase site:**
```bash
# In the docs project
firebase deploy --only hosting:docs
```

**Update navbar to link externally:**
```javascript
<a 
  href="https://docs.amaha.app" 
  target="_blank"
  rel="noopener noreferrer"
>
  📚 Documentation
</a>
```

---

## Recommended: Same Domain Approach

✅ **Why Option 2 (Same Firebase) is best:**
- Single domain (`amaha.app`)
- Seamless user experience
- No CORS issues
- Easy to navigate between app and docs
- Better for SEO
- Simpler deployment

**URL Structure:**
```
amaha.app/                    → Homepage
amaha.app/dashboard           → Dashboard
amaha.app/quiz/:id            → Quiz page
amaha.app/docs                → Documentation home
amaha.app/docs/quizzes/overview  → Specific doc page
```

---

## Styling & Branding

Docusaurus automatically respects:
- Dark mode toggle (same as your app)
- Color theme from `docusaurus.config.js`
- Custom fonts and styling

To match your app's brand, update in `docusaurus.config.js`:

```javascript
themeConfig: {
  colorMode: {
    defaultMode: 'light',
    disableSwitch: false,
  },
  navbar: {
    title: 'AmAha',
    logo: {
      alt: 'AmAha Logo',
      src: 'img/logo.svg',
    },
  },
}
```

---

## Testing Locally

**Run Docusaurus dev server:**
```bash
cd /Users/srini/Desktop/AmAha/AmAhaApp/amaha-web
npm start
```

**Open in browser:**
```
http://localhost:3000     → Docusaurus docs
```

---

## Summary

**To enable docs from your app:**

1. ✅ Docusaurus config updated (`/docs` path)
2. Add navbar link: `<a href="/docs">Documentation</a>`
3. Build docs: `npm run build` in docs folder
4. Copy build output to main app's `/docs` folder
5. Deploy main app to Firebase

**Users access docs at:** `https://amaha.app/docs`
