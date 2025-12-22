// TEST_CASE_MAINTENANCE.md
# 🧪 Test Case Maintenance Guide

## Overview
This document outlines the process for keeping automation test cases in sync with new features and functionality added to the AmAha platform.

## 🔄 Update Process

### When to Update Tests
**ALWAYS update test cases when adding:**
- ✅ New Firestore collections
- ✅ New CRUD operations
- ✅ New admin pages/features
- ✅ New data validation rules
- ✅ New user features
- ✅ New API integrations
- ✅ New analytics tracking
- ✅ Changes to existing collections structure

---

## 📋 Test Case Checklist

### Step 1: Identify New Functionality
- [ ] Document the new feature/module name
- [ ] Identify Firestore collections involved
- [ ] List CRUD operations (Create, Read, Update, Delete)
- [ ] Note any validation rules
- [ ] Check for dependencies

### Step 2: Create Test Cases
For each new feature, add a test in `src/admin/AutomationTestPage.jsx`:

**Test Template:**
```javascript
// NEW TEST EXAMPLE
testNewFeature: async () => {
  const startTime = Date.now();
  try {
    // 1. Describe what you're testing
    // 2. Execute the operation
    // 3. Validate the result
    // 4. Return status
    
    const snap = await getDocs(collection(db, "newCollection"));
    const duration = Date.now() - startTime;
    
    return {
      name: "New Feature Test",
      status: "PASS", // or "FAIL", "WARN", "SKIP"
      message: `Test details here`,
      duration: `${duration}ms`,
    };
  } catch (err) {
    return {
      name: "New Feature Test",
      status: "FAIL",
      message: `Error: ${err.message}`,
      duration: "N/A",
    };
  }
},
```

### Step 3: Register Test in Test Suite
Add your new test to the `runAllTests` function:

```javascript
// In runAllTests() function, add:
result = await tests.testNewFeature();
results.push(result);
setProgress(XX); // Increment progress percentage
```

### Step 4: Update Progress Tracking
- Adjust progress percentages (should total 100% across all tests)
- Each test should increment by ~10% per test

### Step 5: Document the Test
- Add comment explaining what the test validates
- List expected data structure
- Note any edge cases

---

## 📊 Current Test Coverage Map

### Collections Being Tested
| Collection | Read Test | Write Test | Update Test | Delete Test | Validation |
|---|---|---|---|---|---|
| `categories` | ✅ | ❌ | ❌ | ❌ | ✅ |
| `questions` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `scores` | ✅ | ❌ | ❌ | ❌ | ✅ |
| `users` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `test_questions` | ❌ | ✅ | ✅ | ✅ | ❌ |
| `analytics` | ✅ | ❌ | ❌ | ❌ | ❌ |

### Features Being Tested
| Feature | Test Name | Status |
|---|---|---|
| Database Connection | testDatabaseConnection | ✅ Active |
| Read Categories | testReadCategories | ✅ Active |
| Read Questions | testReadQuestions | ✅ Active |
| Read Scores | testReadScores | ✅ Active |
| Create Records | testCreateRecord | ✅ Active |
| Update Records | testUpdateRecord | ✅ Active |
| Delete Records | testDeleteRecord | ✅ Active |
| Data Validation | testDataValidation | ✅ Active |
| Query Performance | testQueryPerformance | ✅ Active |
| Concurrent Operations | testConcurrentOperations | ✅ Active |
| Text-to-Speech Support | testTextToSpeechSupport | ✅ NEW |
| Kids Questions Validation | testKidsQuestionsValidation | ✅ NEW |

---

## 🆕 Adding New Tests: Examples

### Example 1: New User Preferences Collection
**Scenario:** You add a new `userPreferences` collection for storing user settings

```javascript
// Add to tests object:
testReadUserPreferences: async () => {
  const startTime = Date.now();
  try {
    const snap = await getDocs(collection(db, "userPreferences"));
    const prefs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const duration = Date.now() - startTime;

    if (prefs.length > 0) {
      const validPrefs = prefs.filter(p => p.userId && p.theme !== undefined);
      return {
        name: "Read User Preferences",
        status: validPrefs.length === prefs.length ? "PASS" : "WARN",
        message: `Retrieved ${prefs.length} preferences (${validPrefs.length} valid)`,
        duration: `${duration}ms`,
      };
    } else {
      return {
        name: "Read User Preferences",
        status: "WARN",
        message: "No user preferences found",
        duration: `${duration}ms`,
      };
    }
  } catch (err) {
    return {
      name: "Read User Preferences",
      status: "FAIL",
      message: `Failed: ${err.message}`,
      duration: "N/A",
    };
  }
},
```

### Example 2: New Gamification Features
**Scenario:** You add badges, achievements, and rewards system

```javascript
// Add multiple tests:
testReadBadges: async () => { /* test badges collection */ },
testReadAchievements: async () => { /* test achievements */ },
testUserRewards: async () => { /* test rewards calculation */ },
testAchievementUnlock: async () => { /* test achievement unlock logic */ },
```

### Example 3: New Analytics Integration
**Scenario:** You integrate a new analytics provider

```javascript
testAnalyticsTracking: async () => {
  const startTime = Date.now();
  try {
    // Test if analytics events are being recorded
    const snap = await getDocs(collection(db, "analytics"));
    const events = snap.docs.map(d => d.data());
    const duration = Date.now() - startTime;

    const validEvents = events.filter(e => 
      e.eventName && 
      e.timestamp && 
      e.userId
    );

    return {
      name: "Analytics Event Tracking",
      status: validEvents.length === events.length ? "PASS" : "WARN",
      message: `Tracked ${events.length} events (${validEvents.length} valid)`,
      duration: `${duration}ms`,
    };
  } catch (err) {
    return {
      name: "Analytics Event Tracking",
      status: "FAIL",
      message: `Failed: ${err.message}`,
      duration: "N/A",
    };
  }
},
```

---

## 🔍 Validation Checklist Before Deployment

### Pre-Deployment Tasks
- [ ] All new tests added to `AutomationTestPage.jsx`
- [ ] Tests cover all CRUD operations for new features
- [ ] Data validation rules are tested
- [ ] Progress percentages sum to 100%
- [ ] Test descriptions are clear
- [ ] Error handling is comprehensive
- [ ] Test timing is reasonable (< 5 seconds total)
- [ ] No test data left in production collections
- [ ] All new collections referenced in security rules docs

### Test Execution
- [ ] Run full test suite before pushing to production
- [ ] All tests pass (status = PASS or WARN, not FAIL)
- [ ] No warnings about missing test data
- [ ] Execution time is acceptable
- [ ] Error messages are clear and actionable

---

## 📝 Update Log

Track all test case updates here:

### 2025-12-21 - Kids Text-to-Speech Feature Added
- ✅ Added testTextToSpeechSupport test
- ✅ Added testKidsQuestionsValidation test
- ✅ Updated progress percentages (now 12 tests, 85% + 95% + 100%)
- ✅ Created KIDS_TEXT_TO_SPEECH_FEATURE.md documentation
- ✅ Integrated AudioButton component with QuizPage
- ✅ Tests verify browser TTS support and kids content

### 2025-12-21 - Initial Implementation
- ✅ Created 10 comprehensive tests
- ✅ Added database connectivity tests
- ✅ Added CRUD operation tests
- ✅ Added data validation tests
- ✅ Added performance tests

### Future Updates
- [ ] Add user preferences tests (when implemented)
- [ ] Add gamification tests (when implemented)
- [ ] Add analytics tests (when implemented)
- [ ] Add puzzle module tests (when implemented)
- [ ] Add achievement system tests (when implemented)
- [ ] Add rewards system tests (when implemented)

---

## 📞 Support & Questions

### Common Issues

**Q: Test is failing but feature works**
A: The test may not match the actual data structure. Debug with:
1. Check Firestore console for actual document structure
2. Add console.logs to test function
3. Verify field names and types match

**Q: How do I test write operations safely?**
A: Always use a dedicated `test_*` collection to avoid corrupting production data

**Q: Test takes too long to run**
A: Optimize by:
- Reducing number of documents queried
- Using specific queries with `where()` clauses
- Removing unnecessary operations

**Q: How do I test authentication-dependent features?**
A: Use mock auth data or test accounts that have proper Firestore security rules access

---

## 🎯 Best Practices

### DO ✅
- Write descriptive test names that explain what's being tested
- Include timing information for performance monitoring
- Test both happy path and error scenarios
- Clean up test data after tests complete
- Document expected data structures in comments
- Group related tests together
- Use `WARN` status for non-critical issues (missing data)
- Return helpful error messages for debugging

### DON'T ❌
- Test with production data directly
- Leave test data in production collections
- Create overly complex test logic
- Test unrelated features in one test
- Skip error handling
- Hardcode collection names (use constants)
- Ignore test maintenance as features are added
- Create infinite loops or hanging tests

---

## 🚀 Integration with CI/CD

When ready, integrate tests with CI/CD pipeline:

```bash
# Run tests before deployment
npm run test:automation

# Generate test report
npm run test:report

# Monitor test health
npm run test:monitor
```

---

## 📚 Related Documentation
- `AUTOMATION_TESTING.md` - Full automation testing guide
- `src/admin/AutomationTestPage.jsx` - Test implementation
- Firestore Collection Schema (coming soon)

---

**Last Updated:** December 2025
**Maintained By:** Development Team
**Status:** 🟢 Active

