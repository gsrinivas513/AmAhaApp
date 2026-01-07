# Documentation Footer Integration

## ✅ Changes Made

### 1. Updated Main Footer Component
**File:** `src/components/common/Footer.jsx`

Added "Documentation" link to the Support section:
```javascript
const supportLinks = [
  { label: 'Documentation', docs: 'http://localhost:3002' },
  { label: 'Help Center', external: 'https://help.amaha.com' },
  // ... other links
];
```

Updated the onClick handler to open docs in new tab:
```javascript
onClick={() => {
  if (item.path) {
    handleNavigate(item.path);
  } else if (item.external) {
    handleExternalLink(item.external);
  } else if (item.docs) {
    window.open(item.docs, '_blank');  // Opens in new tab
  }
}}
```

### 2. Updated Home Footer Component  
**File:** `src/home/components/Footer.jsx`

- Changed "Legal" section to "Support"
- Added Documentation link that opens in new tab
- Created `FooterLinkExternal` component for external links

---

## 🚀 How It Works

1. User sees "Documentation" link in the footer
2. Clicks on it
3. Documentation opens in a **new browser tab** at `http://localhost:3002`
4. User can read docs while keeping the app open

---

## 📍 Where to Find It

**Main App:** http://localhost:3001
- Footer → Support section → **Documentation** link

**Home Page:** http://localhost:3001/
- Footer → Support section → **Documentation** link

---

## 🔧 Configuration

### For Local Development:
Documentation link opens: `http://localhost:3002`

### For Production:
Update the URL in `src/components/common/Footer.jsx`:
```javascript
const supportLinks = [
  { label: 'Documentation', docs: 'https://amaha.app/docs' },
  // ... other links
];
```

And in `src/home/components/Footer.jsx`:
```javascript
<FooterLinkExternal href="https://amaha.app/docs" target="_blank">
  Documentation
</FooterLinkExternal>
```

---

## ✨ Result

Users can now:
- ✅ See "Documentation" in the footer
- ✅ Click to open documentation in new tab
- ✅ Read documentation without leaving the app
- ✅ Easy access from anywhere in the app

---

**No page refresh needed!** The changes are live in your running app.
