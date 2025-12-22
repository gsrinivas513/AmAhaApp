// NEW_FEATURE_TEST_TEMPLATE.md
# 🎯 New Feature Test Case Template

Use this template whenever adding new functionality to ensure tests are created alongside features.

---

## Feature Information
**Feature Name:** [Name of new feature]
**Module/Page:** [Which admin page or public page]
**Collections Used:** [List Firestore collections]
**CRUD Operations:** [Create/Read/Update/Delete - mark which apply]

---

## Test Case 1: Read [Feature] Data
```javascript
test[FeatureName]Read: async () => {
  const startTime = Date.now();
  try {
    const snap = await getDocs(collection(db, "[collectionName]"));
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const duration = Date.now() - startTime;

    if (data.length > 0) {
      return {
        name: "Read [Feature]",
        status: "PASS",
        message: `Successfully read ${data.length} [items]`,
        duration: `${duration}ms`,
      };
    } else {
      return {
        name: "Read [Feature]",
        status: "WARN",
        message: "No [items] found",
        duration: `${duration}ms`,
      };
    }
  } catch (err) {
    return {
      name: "Read [Feature]",
      status: "FAIL",
      message: `Failed: ${err.message}`,
      duration: "N/A",
    };
  }
},
```

---

## Test Case 2: Validate [Feature] Data
```javascript
test[FeatureName]Validation: async () => {
  const startTime = Date.now();
  try {
    const snap = await getDocs(collection(db, "[collectionName]"));
    const items = snap.docs.map(d => d.data());
    const duration = Date.now() - startTime;

    let issues = [];
    
    items.forEach((item, idx) => {
      // Add validation checks
      if (!item.requiredField) issues.push(`Item ${idx}: Missing required field`);
      if (typeof item.numericField !== 'number') issues.push(`Item ${idx}: Invalid numeric field`);
    });

    if (issues.length === 0) {
      return {
        name: "[Feature] Data Validation",
        status: "PASS",
        message: "All data valid",
        duration: `${duration}ms`,
      };
    } else {
      return {
        name: "[Feature] Data Validation",
        status: "WARN",
        message: `Found ${issues.length} issues`,
        duration: `${duration}ms`,
      };
    }
  } catch (err) {
    return {
      name: "[Feature] Data Validation",
      status: "FAIL",
      message: `Failed: ${err.message}`,
      duration: "N/A",
    };
  }
},
```

---

## Test Case 3: Create [Feature] Record (if applicable)
```javascript
test[FeatureName]Create: async () => {
  const startTime = Date.now();
  let testDocId = null;
  try {
    const testData = {
      // Add test data matching your collection schema
      field1: "value1",
      field2: "value2",
      createdAt: new Date(),
      isTestRecord: true,
    };

    const docRef = await addDoc(
      collection(db, "test_[featureName]"),
      testData
    );
    testDocId = docRef.id;
    const duration = Date.now() - startTime;

    return {
      name: "Create [Feature] Record",
      status: "PASS",
      message: `Successfully created test record`,
      duration: `${duration}ms`,
      metadata: { testDocId },
    };
  } catch (err) {
    return {
      name: "Create [Feature] Record",
      status: "FAIL",
      message: `Failed: ${err.message}`,
      duration: "N/A",
    };
  }
},
```

---

## Test Case 4: Update [Feature] Record (if applicable)
```javascript
test[FeatureName]Update: async (testDocId) => {
  if (!testDocId) {
    return {
      name: "Update [Feature] Record",
      status: "SKIP",
      message: "Skipped: No test record",
      duration: "N/A",
    };
  }

  const startTime = Date.now();
  try {
    await updateDoc(doc(db, "test_[featureName]", testDocId), {
      field1: "updatedValue",
      updatedAt: new Date(),
    });
    const duration = Date.now() - startTime;

    return {
      name: "Update [Feature] Record",
      status: "PASS",
      message: "Successfully updated record",
      duration: `${duration}ms`,
    };
  } catch (err) {
    return {
      name: "Update [Feature] Record",
      status: "FAIL",
      message: `Failed: ${err.message}`,
      duration: "N/A",
    };
  }
},
```

---

## Test Case 5: Delete [Feature] Record (if applicable)
```javascript
test[FeatureName]Delete: async (testDocId) => {
  if (!testDocId) {
    return {
      name: "Delete [Feature] Record",
      status: "SKIP",
      message: "Skipped: No test record",
      duration: "N/A",
    };
  }

  const startTime = Date.now();
  try {
    await deleteDoc(doc(db, "test_[featureName]", testDocId));
    const duration = Date.now() - startTime;

    return {
      name: "Delete [Feature] Record",
      status: "PASS",
      message: "Successfully deleted record",
      duration: `${duration}ms`,
    };
  } catch (err) {
    return {
      name: "Delete [Feature] Record",
      status: "FAIL",
      message: `Failed: ${err.message}`,
      duration: "N/A",
    };
  }
},
```

---

## Checklist Before Submitting
- [ ] Test function names follow naming convention: `test[FeatureName][Operation]`
- [ ] All required imports are present
- [ ] Error handling is comprehensive
- [ ] Test data uses `test_*` collections (not production)
- [ ] Timing is tracked and returned
- [ ] Status correctly reflects test result
- [ ] Message is clear and helpful
- [ ] Test is registered in `runAllTests()` function
- [ ] Progress percentages updated (should total 100%)
- [ ] Documentation updated in TEST_CASE_MAINTENANCE.md

---

## Example: Complete Feature Implementation

**Feature:** User Badges System

```javascript
// 1. Read Badges
testReadBadges: async () => { /* ... */ },

// 2. Validate Badge Structure
testValidateBadges: async () => { /* ... */ },

// 3. Create Test Badge
testCreateBadge: async () => { /* ... */ },

// 4. Update Badge
testUpdateBadge: async (testDocId) => { /* ... */ },

// 5. Delete Badge
testDeleteBadge: async (testDocId) => { /* ... */ },

// 6. User-Badge Relationship
testUserBadgeRelationship: async () => {
  // Test if badges are properly linked to users
},

// 7. Badge Unlock Logic
testBadgeUnlockLogic: async () => {
  // Test if badges unlock correctly based on achievements
},
```

---

## File Locations to Update
1. **Add test code:** `src/admin/AutomationTestPage.jsx`
2. **Register test:** Add to `runAllTests()` function
3. **Update documentation:** `TEST_CASE_MAINTENANCE.md` - Update Log section
4. **Update coverage table:** `TEST_CASE_MAINTENANCE.md` - Current Test Coverage Map

---

**Created:** December 2025
**Last Updated:** December 2025

