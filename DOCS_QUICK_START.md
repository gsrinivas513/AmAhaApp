# Documentation Access - Quick Reference

## 🚀 Setup Complete!

Your documentation is configured to be accessible at:

```
https://amaha.app/docs
```

---

## 📝 What You Need to Do

### 1. **Build the Docs** (One-time)
```bash
cd /Users/srini/Desktop/AmAha/AmAhaApp/amaha-web
npm run build
```

Output folder: `build/`

### 2. **Add to Your React App**

In your navbar component:
```javascript
<a href="/docs" className="nav-link">📚 Docs</a>
```

### 3. **Deploy Together**

The docs build folder (`build/`) should be copied to your main React app and deployed as part of it.

---

## 🔗 Access Points

From your application:

| Page | Link | Purpose |
|------|------|---------|
| Navbar | `/docs` | Link to documentation home |
| Quiz Page | `/docs/quizzes/overview` | Learn about quizzes |
| Puzzle Page | `/docs/puzzles/overview` | Learn about puzzles |
| Activities | `/docs/activities/overview` | Learn about activities |
| Admin Panel | `/docs/admin/overview` | Admin user guide |

---

## 📂 File Structure

```
amaha-web/
├── docs/                  (Source files - 40 markdown files)
├── build/                 (Compiled docs - generated after npm run build)
├── docusaurus.config.js   (Updated: baseUrl: '/docs/')
├── sidebars.js           (Navigation structure)
└── DOCS_INTEGRATION_GUIDE.md (This guide)
```

---

## ⚙️ Configuration Changes Made

✅ **docusaurus.config.js**
- `baseUrl: '/docs/'` - Docs will be at `/docs` path
- `url: 'https://amaha.app'` - Updated to your main domain

---

## 🎯 User Flow

```
User visits app
       ↓
Sees "📚 Documentation" link in navbar
       ↓
Clicks link → redirects to /docs
       ↓
Docusaurus loads documentation
       ↓
User can navigate all 10 sections
       ↓
Can return to main app by clicking logo
```

---

## 📦 Deployment

**Simple approach:** Include docs in main app deployment

```bash
# 1. Build docs
npm run build                    # Creates ./build folder

# 2. Copy to main app
cp -r build /path/to/app/public/docs

# 3. Deploy main app
firebase deploy                  # Includes docs
```

**Result:**
- Main app: `https://amaha.app`
- Docs: `https://amaha.app/docs`
- Single Firebase deployment
- Seamless user experience

---

## 📊 Documentation Stats

| Section | Pages | Purpose |
|---------|-------|---------|
| Platform | 4 | Overview, audience, philosophy |
| Quizzes | 6 | All 11 quiz types documented |
| Puzzles | 5 | 13+ puzzle types documented |
| Activities | 4 | Ordering, matching, free-play |
| Content | 3 | Structure, organization, naming |
| UX | 4 | Design, UI, accessibility, flows |
| Admin | 3 | Tools, workflows, management |
| Architecture | 5 | Tech stack, frontend, backend |
| Future | 5 | Planned features |
| **Total** | **39** | **13,341+ lines** |

---

## ❓ Common Questions

**Q: Can users access docs without logging in?**
A: Yes, docs are public (set in Firestore rules)

**Q: Will docs have the same dark mode as app?**
A: Yes, Docusaurus inherits theme from config

**Q: Can I add a floating help button?**
A: Yes, add in your main app layout pointing to `/docs`

**Q: How often can I update docs?**
A: As often as needed. Edit `.md` files and redeploy.

---

## 🎓 Next Steps

1. ✅ **Review** the documentation locally: `npm start`
2. ✅ **Add navbar link** to your React app
3. ✅ **Build docs**: `npm run build`
4. ✅ **Test** the `/docs` path locally
5. ✅ **Deploy** to Firebase with main app

---

**Questions?** See `DOCS_INTEGRATION_GUIDE.md` for detailed instructions.
