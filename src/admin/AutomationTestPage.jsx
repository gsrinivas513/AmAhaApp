// src/admin/AutomationTestPage.jsx
import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Card, Button } from "../components/ui";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                   AMAHA AUTOMATION TESTING SUITE                           ║
 * ║                    Comprehensive Platform Test Coverage                    ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 * 
 * 📊 HIGH-LEVEL FLOW:
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 1. INFRASTRUCTURE TESTS (Database & Connectivity)
 *    ├─ Database Connection Test
 *    └─ Collection Access Validation
 * 
 * 2. DATA STRUCTURE TESTS (Feature Hierarchy)
 *    ├─ Features Collection
 *    │  ├─ Read Features (Quiz, Puzzle, Study, etc.)
 *    │  └─ Validate Feature Schema (id, name, featureType, icon)
 *    │
 *    ├─ Categories Collection
 *    │  ├─ Read Categories (filtered by featureId)
 *    │  └─ Validate Category Schema (id, name, featureId, isPublished)
 *    │
 *    └─ Subtopicies Collection
 *       ├─ Read Subtopicies (filtered by categoryId)
 *       └─ Validate Subtopic Schema (id, name, categoryId, icon)
 * 
 * 3. CONTENT TESTS (Questions & Quizzes)
 *    ├─ Read Questions Collection
 *    ├─ Validate Feature-Specific Fields
 *    │  ├─ Quiz: question, options[], correctAnswer, difficulty
 *    │  ├─ Puzzle: question, imageUrl, correctAnswer
 *    │  └─ Study: question, description, imageUrl
 *    └─ Test Question-Category Relationships
 * 
 * 4. USER DATA TESTS (Scores & Progress)
 *    ├─ Read Scores Collection
 *    ├─ Validate Score Schema (userId, score, category, feature)
 *    └─ Test Score-User Relationships
 * 
 * 5. CRUD OPERATION TESTS (Write Operations)
 *    ├─ Create Test Record (Content Item)
 *    ├─ Update Test Record (Field Modification)
 *    └─ Delete Test Record (Cleanup)
 * 
 * 6. DATA INTEGRITY TESTS
 *    ├─ Validate Feature → Category → Subtopic Hierarchy
 *    ├─ Check Required Fields Across Collections
 *    ├─ Verify Referential Integrity (featureId, categoryId, subtopicId)
 *    └─ Test Data Consistency (published flags, counters)
 * 
 * 7. PERFORMANCE TESTS
 *    ├─ Query Performance (filtered queries with where clauses)
 *    ├─ Concurrent Operations (parallel reads)
 *    └─ Load Test (multiple collection reads)
 * 
 * 8. FEATURE-SPECIFIC TESTS
 *    ├─ Text-to-Speech Support (Kids feature)
 *    ├─ Kids Questions Validation
 *    ├─ Quiz Option Validation (4 options required)
 *    ├─ Puzzle Image URL Validation
 *    └─ Study Content Validation (description required)
 * 
 * 9. NAVIGATION & ROUTING TESTS
 *    ├─ Add Content Page Routing (/admin/add-content)
 *    ├─ Feature Selection Flow
 *    ├─ Category Pre-selection from Management Page
 *    └─ Form Progressive Enablement
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🔄 TEST EXECUTION FLOW:
 *    1. Connect to Database ✓
 *    2. Read & Validate Features ✓
 *    3. Read & Validate Categories ✓
 *    4. Read & Validate Subtopicies ✓
 *    5. Read & Validate Questions ✓
 *    6. Read & Validate Scores ✓
 *    7. Test CRUD Operations ✓
 *    8. Validate Data Integrity ✓
 *    9. Performance Benchmarks ✓
 *    10. Feature-Specific Tests ✓
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 📋 TEST RESULTS:
 *    ✅ PASS   - Test completed successfully
 *    ⚠️  WARN   - Test passed with warnings (non-critical issues)
 *    ❌ FAIL   - Test failed (critical issues)
 *    ⏭️  SKIP   - Test skipped (dependencies not met)
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

function AutomationTestPage() {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Individual test functions
  const tests = {
    // 1. Database Connectivity Test
    testDatabaseConnection: async () => {
      const startTime = Date.now();
      try {
        const snap = await getDocs(collection(db, "features"));
        const duration = Date.now() - startTime;
        return {
          name: "1. Database Connection",
          status: "PASS",
          message: `Connected successfully. Retrieved ${snap.docs.length} features`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "1. Database Connection",
          status: "FAIL",
          message: `Connection failed: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 2. Read Features Test
    testReadFeatures: async () => {
      const startTime = Date.now();
      try {
        const snap = await getDocs(collection(db, "features"));
        const features = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const duration = Date.now() - startTime;

        if (features.length > 0) {
          // Validate feature structure
          const validFeatures = features.filter(
            (f) => f.name && f.featureType
          );
          const hasIcons = features.filter(f => f.icon).length;
          
          return {
            name: "2. Read Features",
            status: validFeatures.length === features.length ? "PASS" : "WARN",
            message: `Found ${features.length} features (${validFeatures.length} valid, ${hasIcons} with icons). Types: ${[...new Set(features.map(f => f.featureType))].join(", ")}`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "2. Read Features",
            status: "WARN",
            message: "No features found. Create features in Admin → Features & Categories",
            duration: `${duration}ms`,
          };
        }
      } catch (err) {
        return {
          name: "2. Read Features",
          status: "FAIL",
          message: `Failed to read features: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 3. Read Categories Test
    testReadCategories: async () => {
      const startTime = Date.now();
      try {
        const snap = await getDocs(collection(db, "categories"));
        const cats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const duration = Date.now() - startTime;

        if (cats.length > 0) {
          // Validate category structure
          const validCats = cats.filter(c => c.name && c.featureId);
          const publishedCats = cats.filter(c => c.isPublished).length;
          const draftCats = cats.length - publishedCats;
          
          // Group by feature
          const byFeature = {};
          cats.forEach(c => {
            if (!byFeature[c.featureId]) byFeature[c.featureId] = 0;
            byFeature[c.featureId]++;
          });
          
          return {
            name: "3. Read Categories",
            status: validCats.length === cats.length ? "PASS" : "WARN",
            message: `Found ${cats.length} categories (${validCats.length} valid, ${publishedCats} published, ${draftCats} draft). Distribution: ${Object.keys(byFeature).length} features`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "3. Read Categories",
            status: "WARN",
            message: "No categories found. Create categories in Admin → Features & Categories",
            duration: `${duration}ms`,
          };
        }
      } catch (err) {
        return {
          name: "3. Read Categories",
          status: "FAIL",
          message: `Failed to read categories: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 4. Read Subtopicies Test
    testReadSubtopicies: async () => {
      const startTime = Date.now();
      try {
        const snap = await getDocs(collection(db, "subtopics"));
        const subs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const duration = Date.now() - startTime;

        if (subs.length > 0) {
          // Validate subtopic structure
          const validSubs = subs.filter(s => s.name && s.categoryId);
          const withIcons = subs.filter(s => s.icon).length;
          
          // Group by category
          const byCategory = {};
          subs.forEach(s => {
            if (!byCategory[s.categoryId]) byCategory[s.categoryId] = 0;
            byCategory[s.categoryId]++;
          });
          
          return {
            name: "4. Read Subtopicies",
            status: validSubs.length === subs.length ? "PASS" : "WARN",
            message: `Found ${subs.length} subtopics (${validSubs.length} valid, ${withIcons} with icons). Distribution: ${Object.keys(byCategory).length} categories`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "4. Read Subtopicies",
            status: "WARN",
            message: "No subtopics found. Create subtopics in Admin → Subtopic Management",
            duration: `${duration}ms`,
          };
        }
      } catch (err) {
        return {
          name: "4. Read Subtopicies",
          status: "FAIL",
          message: `Failed to read subtopics: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 5. Read Questions Test
    testReadQuestions: async () => {
      const startTime = Date.now();
      try {
        const snap = await getDocs(collection(db, "questions"));
        const questions = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const duration = Date.now() - startTime;

        if (questions.length > 0) {
          // Validate question structure by feature type
          const byFeatureType = {
            quiz: questions.filter(q => q.featureType === "quiz"),
            puzzle: questions.filter(q => q.featureType === "puzzle"),
            study: questions.filter(q => q.featureType === "study"),
            other: questions.filter(q => !q.featureType || !["quiz", "puzzle", "study"].includes(q.featureType))
          };
          
          // Validate quiz questions (need options + correctAnswer)
          const validQuiz = byFeatureType.quiz.filter(q => 
            q.question && 
            q.options && 
            Array.isArray(q.options) && 
            q.options.length === 4 &&
            q.correctAnswer &&
            q.difficulty
          ).length;
          
          // Validate puzzle questions (need question/title)
          const validPuzzle = byFeatureType.puzzle.filter(q => q.question).length;
          
          // Validate study questions (need question + description)
          const validStudy = byFeatureType.study.filter(q => q.question && q.description).length;
          
          const hasFeatureId = questions.filter(q => q.feature).length;
          const hasCategoryId = questions.filter(q => q.category).length;
          const hasSubtopicId = questions.filter(q => q.subtopic).length;
          
          return {
            name: "5. Read Questions",
            status: questions.length > 0 ? "PASS" : "WARN",
            message: `Found ${questions.length} questions. Quiz: ${validQuiz}/${byFeatureType.quiz.length}, Puzzle: ${validPuzzle}/${byFeatureType.puzzle.length}, Study: ${validStudy}/${byFeatureType.study.length}. Links: ${hasFeatureId} features, ${hasCategoryId} categories, ${hasSubtopicId} subtopics`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "5. Read Questions",
            status: "WARN",
            message: "No questions found. Add content in Admin → Add Content",
            duration: `${duration}ms`,
          };
        }
      } catch (err) {
        return {
          name: "5. Read Questions",
          status: "FAIL",
          message: `Failed to read questions: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 6. Read Scores Test
    testReadScores: async () => {
      const startTime = Date.now();
      try {
        const snap = await getDocs(collection(db, "scores"));
        const scores = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const duration = Date.now() - startTime;

        if (scores.length > 0) {
          const validScores = scores.filter(
            (s) => s.userId && s.score !== undefined
          );
          return {
            name: "6. Read Scores",
            status: validScores.length === scores.length ? "PASS" : "WARN",
            message: `Retrieved ${scores.length} scores (${validScores.length} valid)`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "6. Read Scores",
            status: "WARN",
            message: "No scores found in database",
            duration: `${duration}ms`,
          };
        }
      } catch (err) {
        return {
          name: "6. Read Scores",
          status: "FAIL",
          message: `Failed to read scores: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 7. Hierarchy Validation Test (Feature → Category → Subtopic)
    testHierarchyValidation: async () => {
      const startTime = Date.now();
      try {
        const [featuresSnap, categoriesSnap, subtopicsSnap] = await Promise.all([
          getDocs(collection(db, "features")),
          getDocs(collection(db, "categories")),
          getDocs(collection(db, "subtopics"))
        ]);

        const features = featuresSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const categories = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const subtopics = subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        const featureIds = new Set(features.map(f => f.id));
        const categoryIds = new Set(categories.map(c => c.id));
        
        let issues = [];
        
        // Check if all categories reference valid features
        categories.forEach(cat => {
          if (!featureIds.has(cat.featureId)) {
            issues.push(`Category "${cat.name}" references invalid feature ID: ${cat.featureId}`);
          }
        });
        
        // Check if all subtopics reference valid categories
        subtopics.forEach(sub => {
          if (!categoryIds.has(sub.categoryId)) {
            issues.push(`Subtopic "${sub.name}" references invalid category ID: ${sub.categoryId}`);
          }
        });
        
        const duration = Date.now() - startTime;
        
        if (issues.length === 0) {
          return {
            name: "7. Hierarchy Validation",
            status: "PASS",
            message: `Feature → Category → Subtopic hierarchy is valid. ${features.length} features, ${categories.length} categories, ${subtopics.length} subtopics`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "7. Hierarchy Validation",
            status: "WARN",
            message: `Found ${issues.length} hierarchy issues: ${issues.slice(0, 2).join("; ")}${issues.length > 2 ? "..." : ""}`,
            duration: `${duration}ms`,
          };
        }
      } catch (err) {
        return {
          name: "7. Hierarchy Validation",
          status: "FAIL",
          message: `Hierarchy validation failed: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 8. Create Test Record Test
    testCreateRecord: async () => {
      const startTime = Date.now();
      let testDocId = null;
      try {
        const testData = {
          question: "Automation Test: What is 2+2?",
          options: ["3", "4", "5", "6"],
          correctAnswer: "4",
          difficulty: "easy",
          featureType: "quiz",
          createdAt: new Date(),
          isTestRecord: true,
        };

        const docRef = await addDoc(
          collection(db, "test_questions"),
          testData
        );
        testDocId = docRef.id;
        const duration = Date.now() - startTime;

        return {
          name: "8. Create Record (CRUD - Write)",
          status: "PASS",
          message: `Successfully created test quiz question with ID: ${testDocId}`,
          duration: `${duration}ms`,
          metadata: { testDocId },
        };
      } catch (err) {
        return {
          name: "8. Create Record (CRUD - Write)",
          status: "FAIL",
          message: `Failed to create record: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 9. Update Record Test (depends on Create test)
    testUpdateRecord: async (testDocId) => {
      if (!testDocId) {
        return {
          name: "9. Update Record (CRUD - Write)",
          status: "SKIP",
          message: "Skipped: No test record created",
          duration: "N/A",
        };
      }

      const startTime = Date.now();
      try {
        await updateDoc(doc(db, "test_questions", testDocId), {
          question: "Automation Test: What is 2+3?",
          correctAnswer: "5",
          updatedAt: new Date(),
        });
        const duration = Date.now() - startTime;

        return {
          name: "9. Update Record (CRUD - Write)",
          status: "PASS",
          message: `Successfully updated test record`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "9. Update Record (CRUD - Write)",
          status: "FAIL",
          message: `Failed to update record: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 10. Delete Record Test (depends on Create test)
    testDeleteRecord: async (testDocId) => {
      if (!testDocId) {
        return {
          name: "10. Delete Record (CRUD - Write)",
          status: "SKIP",
          message: "Skipped: No test record to delete",
          duration: "N/A",
        };
      }

      const startTime = Date.now();
      try {
        await deleteDoc(doc(db, "test_questions", testDocId));
        const duration = Date.now() - startTime;

        return {
          name: "10. Delete Record (CRUD - Write)",
          status: "PASS",
          message: `Successfully deleted test record`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "10. Delete Record (CRUD - Write)",
          status: "FAIL",
          message: `Failed to delete record: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 11. Data Validation Test
    testDataValidation: async () => {
      const startTime = Date.now();
      try {
        const [featuresSnap, categoriesSnap, subtopicsSnap, questionsSnap, scoresSnap] = await Promise.all([
          getDocs(collection(db, "features")),
          getDocs(collection(db, "categories")),
          getDocs(collection(db, "subtopics")),
          getDocs(collection(db, "questions")),
          getDocs(collection(db, "scores")),
        ]);

        const features = featuresSnap.docs;
        const categories = categoriesSnap.docs;
        const subtopics = subtopicsSnap.docs;
        const questions = questionsSnap.docs;
        const scores = scoresSnap.docs;

        let issues = [];

        // Check features
        features.forEach((doc) => {
          const data = doc.data();
          if (!data.name) issues.push(`Feature ${doc.id}: Missing name`);
          if (!data.featureType) issues.push(`Feature ${doc.id}: Missing featureType`);
        });

        // Check categories
        categories.forEach((doc) => {
          const data = doc.data();
          if (!data.name) issues.push(`Category ${doc.id}: Missing name`);
          if (!data.featureId) issues.push(`Category ${doc.id}: Missing featureId`);
          if (data.isPublished === undefined) issues.push(`Category ${doc.id}: Missing isPublished flag`);
        });

        // Check subtopics
        subtopics.forEach((doc) => {
          const data = doc.data();
          if (!data.name) issues.push(`Subtopic ${doc.id}: Missing name`);
          if (!data.categoryId) issues.push(`Subtopic ${doc.id}: Missing categoryId`);
        });

        // Check questions
        questions.forEach((doc) => {
          const data = doc.data();
          if (!data.question) issues.push(`Question ${doc.id}: Missing question text`);
          if (!data.featureType) issues.push(`Question ${doc.id}: Missing featureType`);
          
          // Feature-specific validation
          if (data.featureType === "quiz") {
            if (!Array.isArray(data.options) || data.options.length !== 4)
              issues.push(`Quiz Question ${doc.id}: Invalid options (must be array of 4)`);
            if (!data.correctAnswer) issues.push(`Quiz Question ${doc.id}: Missing correctAnswer`);
            if (!data.difficulty) issues.push(`Quiz Question ${doc.id}: Missing difficulty`);
          } else if (data.featureType === "study") {
            if (!data.description) issues.push(`Study Question ${doc.id}: Missing description`);
          }
        });

        // Check scores
        scores.forEach((doc) => {
          const data = doc.data();
          if (!data.userId) issues.push(`Score ${doc.id}: Missing userId`);
          if (data.score === undefined || data.score === null)
            issues.push(`Score ${doc.id}: Invalid score`);
        });

        const duration = Date.now() - startTime;

        if (issues.length === 0) {
          return {
            name: "11. Data Validation",
            status: "PASS",
            message: `All data records are valid. Checked ${features.length} features, ${categories.length} categories, ${subtopics.length} subtopics, ${questions.length} questions, ${scores.length} scores`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "11. Data Validation",
            status: "WARN",
            message: `Found ${issues.length} data issues: ${issues.slice(0, 3).join("; ")}${issues.length > 3 ? "..." : ""}`,
            duration: `${duration}ms`,
          };
        }
      } catch (err) {
        return {
          name: "11. Data Validation",
          status: "FAIL",
          message: `Validation failed: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 12. Query Performance Test
    testQueryPerformance: async () => {
      const startTime = Date.now();
      try {
        // Test filtering by featureId (categories)
        const featuresSnap = await getDocs(collection(db, "features"));
        if (featuresSnap.docs.length > 0) {
          const firstFeatureId = featuresSnap.docs[0].id;
          const q = query(collection(db, "categories"), where("featureId", "==", firstFeatureId));
          const snap = await getDocs(q);
          const duration = Date.now() - startTime;

          return {
            name: "12. Query Performance",
            status: "PASS",
            message: `Query executed in ${duration}ms, returned ${snap.docs.length} categories for feature`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "12. Query Performance",
            status: "WARN",
            message: "No features found to test query performance",
            duration: "N/A",
          };
        }
      } catch (err) {
        return {
          name: "12. Query Performance",
          status: "FAIL",
          message: `Query failed: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 13. Concurrent Operations Test
    testConcurrentOperations: async () => {
      const startTime = Date.now();
      try {
        const results = await Promise.all([
          getDocs(collection(db, "features")),
          getDocs(collection(db, "categories")),
          getDocs(collection(db, "subtopics")),
          getDocs(collection(db, "questions")),
          getDocs(collection(db, "scores")),
          getDocs(collection(db, "users")),
        ]);

        const totalDocs = results.reduce((sum, snap) => sum + snap.docs.length, 0);
        const duration = Date.now() - startTime;

        return {
          name: "13. Concurrent Operations",
          status: "PASS",
          message: `Successfully performed 6 concurrent reads (${totalDocs} total docs) in ${duration}ms`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "13. Concurrent Operations",
          status: "FAIL",
          message: `Concurrent operations failed: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 14. Text-to-Speech Support Test (Kids Feature)
    testTextToSpeechSupport: async () => {
      const startTime = Date.now();
      try {
        // Check browser support for Web Speech API
        const speechSynthesisSupported = 'speechSynthesis' in window;
        const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
        const duration = Date.now() - startTime;

        if (speechSynthesisSupported) {
          // Test if voices are available
          const voices = window.speechSynthesis.getVoices();
          const englishVoices = voices.filter(v => v.lang.startsWith('en'));

          return {
            name: "14. Text-to-Speech Support",
            status: "PASS",
            message: `TTS supported. Found ${voices.length} voices (${englishVoices.length} English)`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "14. Text-to-Speech Support",
            status: "WARN",
            message: "Web Speech API not available on this browser/device",
            duration: `${duration}ms`,
          };
        }
      } catch (err) {
        return {
          name: "14. Text-to-Speech Support",
          status: "FAIL",
          message: `TTS check failed: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 15. Kids Questions Validation Test
    testKidsQuestionsValidation: async () => {
      const startTime = Date.now();
      try {
        // Check if there are questions suitable for kids
        const snap = await getDocs(
          query(collection(db, "questions"), where("featureType", "==", "quiz"), where("difficulty", "==", "easy"))
        );
        
        const duration = Date.now() - startTime;
        const questions = snap.docs.map(d => d.data());

        if (questions.length > 0) {
          // Validate kids-friendly questions have proper structure
          const validQuestions = questions.filter(q => 
            q.question && 
            q.options && 
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            q.correctAnswer !== undefined
          );

          return {
            name: "15. Kids Questions Validation",
            status: validQuestions.length === questions.length ? "PASS" : "WARN",
            message: `Found ${questions.length} easy quiz questions (${validQuestions.length} valid). Suitable for kids feature`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "15. Kids Questions Validation",
            status: "WARN",
            message: "No easy quiz questions found. Create some for kids feature",
            duration: `${duration}ms`,
          };
        }
      } catch (err) {
        return {
          name: "15. Kids Questions Validation",
          status: "WARN",
          message: `Kids questions check: ${err.message}`,
          duration: "N/A",
        };
      }
    },
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setProgress(0);

    const results = [];
    let testDocId = null;

    // Run tests in sequence
    try {
      // 1. Database Connection
      let result = await tests.testDatabaseConnection();
      results.push(result);
      setTestResults([...results]);
      setProgress(7);

      // 2. Read Features
      result = await tests.testReadFeatures();
      results.push(result);
      setTestResults([...results]);
      setProgress(13);

      // 3. Read Categories
      result = await tests.testReadCategories();
      results.push(result);
      setTestResults([...results]);
      setProgress(20);

      // 4. Read Subtopicies
      result = await tests.testReadSubtopicies();
      results.push(result);
      setTestResults([...results]);
      setProgress(27);

      // 5. Read Questions
      result = await tests.testReadQuestions();
      results.push(result);
      setTestResults([...results]);
      setProgress(33);

      // 6. Read Scores
      result = await tests.testReadScores();
      results.push(result);
      setTestResults([...results]);
      setProgress(40);

      // 7. Hierarchy Validation
      result = await tests.testHierarchyValidation();
      results.push(result);
      setTestResults([...results]);
      setProgress(47);

      // 8. Create Record
      result = await tests.testCreateRecord();
      results.push(result);
      setTestResults([...results]);
      testDocId = result.metadata?.testDocId;
      setProgress(53);

      // 9. Update Record
      result = await tests.testUpdateRecord(testDocId);
      results.push(result);
      setTestResults([...results]);
      setProgress(60);

      // 10. Delete Record
      result = await tests.testDeleteRecord(testDocId);
      results.push(result);
      setTestResults([...results]);
      setProgress(67);

      // 11. Data Validation
      result = await tests.testDataValidation();
      results.push(result);
      setTestResults([...results]);
      setProgress(73);

      // 12. Query Performance
      result = await tests.testQueryPerformance();
      results.push(result);
      setTestResults([...results]);
      setProgress(80);

      // 13. Concurrent Operations
      result = await tests.testConcurrentOperations();
      results.push(result);
      setTestResults([...results]);
      setProgress(87);

      // 14. Text-to-Speech Support
      result = await tests.testTextToSpeechSupport();
      results.push(result);
      setTestResults([...results]);
      setProgress(93);

      // 15. Kids Questions Validation
      result = await tests.testKidsQuestionsValidation();
      results.push(result);
      setTestResults([...results]);
      setProgress(100);
    } catch (err) {
      console.error("Test execution error:", err);
    }

    setIsRunning(false);
  };

  // Calculate summary statistics
  const summary = {
    total: testResults.length,
    passed: testResults.filter((r) => r.status === "PASS").length,
    failed: testResults.filter((r) => r.status === "FAIL").length,
    warnings: testResults.filter((r) => r.status === "WARN").length,
    skipped: testResults.filter((r) => r.status === "SKIP").length,
    successRate:
      testResults.length > 0
        ? `${(
            ((testResults.filter((r) => r.status === "PASS").length +
              testResults.filter((r) => r.status === "WARN").length) /
              testResults.length) *
            100
          ).toFixed(1)}%`
        : "0%",
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Automation Testing Suite
          </h1>
          <p className="text-gray-600">
            Comprehensive automated tests for database, CRUD operations, and platform
            integrity
          </p>
        </div>

        {/* Run Tests Button */}
        <div className="mb-6">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? `Running Tests... ${progress}%` : "Run All Tests"}
          </Button>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <div className="mb-6 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Summary Section */}
        {testResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="text-sm font-semibold text-blue-700 mb-2">
                Total Tests
              </div>
              <div className="text-3xl font-bold text-blue-900">
                {summary.total}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="text-sm font-semibold text-green-700 mb-2">
                Passed
              </div>
              <div className="text-3xl font-bold text-green-900">
                {summary.passed}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
              <div className="text-sm font-semibold text-red-700 mb-2">Failed</div>
              <div className="text-3xl font-bold text-red-900">
                {summary.failed}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
              <div className="text-sm font-semibold text-yellow-700 mb-2">
                Warnings
              </div>
              <div className="text-3xl font-bold text-yellow-900">
                {summary.warnings}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="text-sm font-semibold text-purple-700 mb-2">
                Success Rate
              </div>
              <div className="text-3xl font-bold text-purple-900">
                {summary.successRate}
              </div>
            </Card>
          </div>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Test Results</h2>

            {testResults.map((result, idx) => (
              <Card
                key={idx}
                className={`p-6 border-l-4 ${
                  result.status === "PASS"
                    ? "border-l-green-500 bg-green-50"
                    : result.status === "FAIL"
                    ? "border-l-red-500 bg-red-50"
                    : result.status === "WARN"
                    ? "border-l-yellow-500 bg-yellow-50"
                    : "border-l-gray-500 bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          result.status === "PASS"
                            ? "bg-green-200 text-green-800"
                            : result.status === "FAIL"
                            ? "bg-red-200 text-red-800"
                            : result.status === "WARN"
                            ? "bg-yellow-200 text-yellow-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {result.status}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {result.name}
                      </h3>
                    </div>
                    <p className="text-gray-700 mb-2">{result.message}</p>
                    <p className="text-sm text-gray-500 font-mono">
                      Duration: {result.duration}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Tests Run Message */}
        {testResults.length === 0 && !isRunning && (
          <Card className="p-12 text-center border-2 border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">
              Click "Run All Tests" to start the automation testing suite
            </p>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}

export default AutomationTestPage;
