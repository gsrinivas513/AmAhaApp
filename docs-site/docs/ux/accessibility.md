---
sidebar_position: 3
title: Accessibility
---

# Accessibility

AmAha is committed to WCAG 2.1 AA accessibility standards, ensuring all users can access and enjoy content regardless of ability.

## Accessibility Philosophy

**"Accessibility is not a feature, it's a requirement."**

AmAha's approach:
- Build accessible from the start
- Test with real users
- Follow accessibility standards
- Fix issues immediately
- Continuous improvement

---

## WCAG 2.1 Compliance

### Level AA Standards

AmAha meets WCAG 2.1 Level AA across:

**Perceivable:**
- Readable text
- Non-color-dependent indicators
- Audio alternatives
- Clear navigation

**Operable:**
- Keyboard navigation
- Sufficient time limits
- No seizure-inducing content
- Multiple input methods

**Understandable:**
- Clear language
- Consistent navigation
- Input assistance
- Error prevention

**Robust:**
- Standards-compliant code
- Screen reader compatibility
- Proper semantic HTML
- Cross-browser support

---

## Vision Accessibility

### Color Contrast

**Standards:**
- Text: 4.5:1 contrast ratio (normal text)
- Text: 3:1 contrast ratio (large text)
- UI components: 3:1 ratio

**Testing:**
- All color combinations tested
- Simulator checked (Protanopia, Deuteranopia, Tritanopia)
- Real user testing with colorblind users

**Example:**
```
✓ Dark gray (#374151) on white - 10:1 ratio
✓ Medium gray (#6B7280) on white - 7:1 ratio
✗ Light gray (#D1D5DB) on white - 3.5:1 ratio
```

### Color-Blind Friendly Design

**Never rely on color alone:**

```
❌ WRONG:
Red = Wrong, Green = Correct
[Only color difference]

✅ RIGHT:
Red + ✗ = Wrong, Green + ✓ = Correct
[Color + symbol]
```

**Palette:**
- High contrast between key colors
- Not red + green only
- Use patterns/textures when needed
- Icons supplement color

### Dark Mode & High Contrast

**Offered as options:**
- Dark mode: Reduce eye strain
- High contrast: Increase visibility
- Color adjustment: Simulate colorblindness
- System preference: Auto-detect

**Implementation:**
- CSS custom properties for colors
- Toggle in settings
- Persist user preference
- Keyboard shortcut available

---

## Motor Accessibility

### Touch Targets

**Minimum sizes:**
- 44×44 pixels (mobile)
- 40×40 pixels (desktop minimum)
- Wider spacing preferred

```
✓ 44×44px minimum
┌────────────────┐
│    [Button]    │ 44px tall
└────────────────┘

✗ 20×20px too small
┌────┐
│[B] │ Too small
└────┘
```

### Keyboard Navigation

**All functionality accessible via keyboard:**

**Standard Keys:**
- **Tab** - Move to next element
- **Shift+Tab** - Move to previous element
- **Enter** - Activate/Select
- **Space** - Toggle/Activate
- **Escape** - Close/Cancel
- **Arrow Keys** - Navigate lists/grids

**Example Navigation:**
```
1. Press Tab → Focus on [Start Quiz] button
2. Press Enter → Quiz starts
3. Press Tab → Focus on first answer option
4. Press Arrow Down → Select next option
5. Press Enter → Submit answer
6. Focus moves to [Next] button automatically
```

### Keyboard Shortcuts

**Available shortcuts:**
- **?** - Show help (common convention)
- **N** - Next question (during quiz)
- **P** - Previous question (during quiz)
- **H** - Show hint (during activity)
- **S** - Skip current item (if allowed)

**Rules:**
- Don't conflict with browser defaults
- Display shortcut hints in UI
- Make optional (not required)
- Document in help section

### Focus Indicators

**Always visible:**
- Clear focus ring (3px border)
- High contrast color (3:1 minimum)
- Never removed
- Visible on all interactive elements

**Implementation:**
```css
:focus-visible {
  outline: 3px solid #2563EB;
  outline-offset: 2px;
}
```

---

## Hearing Accessibility

### Audio Feedback

**All audio has alternatives:**

**Sound Effects:**
- ✅ Correct answer: Sound + green checkmark
- ✅ Wrong answer: Sound + red X
- ✅ Achievement: Sound + visual animation

**Captions:**
- All instructional videos captioned
- Transcripts available
- Accuracy checked

### Volume Control

**Offered in settings:**
- Disable all sounds option
- Volume slider (0-100%)
- Different volumes for different sounds
- Haptic feedback as alternative

---

## Cognitive Accessibility

### Clear Language

**Writing standards:**
- Simple, direct language
- Short sentences (15-20 words max)
- Common words (avoid jargon)
- Define technical terms
- No unnecessary complexity

**Example:**
```
✗ "Utilize the pedagogical apparatus to facilitate learning outcomes"
✓ "Use this tool to help you learn"
```

### Consistent Navigation

**Predictability:**
- Same buttons mean same thing everywhere
- Navigation always same location
- Interactions work the same way
- Terminology consistent throughout

### Focus Management

**Clear focus/attention:**
- One primary action per screen
- Clear visual hierarchy
- Distractions minimized
- Instructions clear and brief

### Help & Support

**Available and clear:**
- Help text near controls
- Tooltip explanations
- "More info" links
- Contact support easily accessible
- Glossary of terms

---

## Learning Disability Support

### Dyslexia-Friendly

**Features:**
- Font selection: OpenDyslexic option
- Increased letter/line spacing
- Single-column layout (default)
- No justification (left-align)
- Larger text option

**Implementation:**
```css
body.dyslexia-friendly {
  font-family: 'OpenDyslexic', sans-serif;
  letter-spacing: 0.05em;
  line-height: 1.8;
  text-align: left;
  font-size: 18px;
}
```

### ADHD-Friendly

**Features:**
- Remove animations (option)
- Reduced motion support
- Minimize distractions
- Clear visual focus
- Timer warnings before deadline
- Pause functionality (when possible)

### Reading Support

**For struggling readers:**
- Text-to-speech option
- Adjustable reading speed
- Word highlighting
- Syllable breaking
- Simplified vocabulary option

---

## Screen Reader Support

### Semantic HTML

**Proper structure:**
- Headings: h1, h2, h3 (not divs styled as headers)
- Lists: `<ul>`, `<ol>`, `<li>`
- Forms: `<label>` associated with inputs
- Buttons: `<button>` not `<div onclick>`
- Navigation: `<nav>` landmark

**Example:**
```html
✗ <div onclick="submit()" class="button">Submit</div>
✓ <button type="submit">Submit</button>

✗ <div class="heading">Question 1</div>
✓ <h2>Question 1</h2>

✗ <span>Check this: <span class="checkbox"></span></span>
✓ <input type="checkbox" aria-label="Check this">
```

### ARIA Labels

**Used strategically:**
- `aria-label` - For icon-only buttons
- `aria-describedby` - For complex descriptions
- `aria-live` - For dynamic content
- `aria-expanded` - For expandable sections
- `role` - When semantic HTML insufficient

**Example:**
```html
<button aria-label="Close dialog">×</button>

<div aria-live="polite" aria-atomic="true">
  You got question 3 correct!
</div>

<section aria-label="Quiz Instructions">
  ...
</section>
```

### Testing

- Tested with NVDA (Windows)
- Tested with JAWS (Windows)
- Tested with VoiceOver (Mac/iOS)
- Tested with TalkBack (Android)
- Real user testing with blind/low vision users

---

## Mobile Accessibility

### Touch Interaction

**Touch-specific:**
- 44×44px minimum touch targets
- Sufficient spacing between targets
- No long-press required
- Double-tap avoidable (use single tap)
- Swipe gestures have alternatives

### Mobile Screen Readers

**Full support:**
- VoiceOver (iOS)
- TalkBack (Android)
- All gestures work
- Content accessible without zoom
- No horizontal scrolling required

### Mobile Zoom

**Maintained at 1x minimum:**
- Never disable zoom (viewport-fit)
- Text resizable (at least 200%)
- No functions lose access when zoomed
- Layouts reflow properly

---

## Testing & Validation

### Automated Testing

**Tools used:**
- axe DevTools
- WAVE Web Accessibility Evaluation Tool
- Lighthouse Accessibility Audit
- Pa11y (Automated testing)

**Run on:**
- Every build
- Before deployment
- Monthly comprehensive scan

### Manual Testing

**Performed with:**
- Keyboard only navigation
- Screen reader (NVDA)
- High contrast mode
- Zoom to 200%+
- Mobile screen readers

### User Testing

**Regular testing with:**
- Colorblind users
- Deaf/hard of hearing users
- Blind/low vision users
- Motor disability users
- Cognitive disability users

---

## Accessibility Checklist

### Before Publishing

- [ ] WCAG 2.1 AA compliance verified
- [ ] Keyboard navigation tested
- [ ] Screen reader tested
- [ ] Color contrast verified (4.5:1 minimum)
- [ ] Focus indicators visible
- [ ] Touch targets adequate (44×44px)
- [ ] Images have alt text
- [ ] Videos have captions
- [ ] Forms properly labeled
- [ ] Error messages clear
- [ ] Time limits appropriate
- [ ] No flashing content
- [ ] Motion reduced option available
- [ ] Content structure semantic
- [ ] ARIA labels used correctly
- [ ] Tested with multiple tools
- [ ] Tested with real users (if possible)

---

## Resources

**Standards:**
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Accessibility Initiative](https://www.w3.org/WAI/)

**Tools:**
- axe DevTools
- WAVE Browser Extension
- Lighthouse Audit
- Screen Reader Testing

**Communities:**
- WebAIM (Web Accessibility In Mind)
- The A11Y Project
- Accessibility community forums

---

**Next:** [User Flows](user-flows)
