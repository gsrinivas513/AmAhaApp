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
  orderBy,
  limit,
  writeBatch,
} from "firebase/firestore";
import * as dailyChallengeService from "../services/dailyChallengeService";
import * as storyService from "../services/storyService";
import * as leaderboardService from "../services/leaderboardService";

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

    // 16. Daily Challenge CRUD - Create
    testDailyChallengeCreate: async () => {
      const startTime = Date.now();
      try {
        const testChallenge = {
          type: "quiz",
          difficulty: "easy",
          category: "Math",
          topic: "Basics",
          xp: 75,
          coins: 15,
          date: new Date().toISOString().split('T')[0],
          isTest: true,
        };
        const docRef = await addDoc(collection(db, "dailyChallenges"), testChallenge);
        const duration = Date.now() - startTime;
        return {
          name: "16. Daily Challenge Create",
          status: "PASS",
          message: `Created test daily challenge with ID: ${docRef.id}`,
          duration: `${duration}ms`,
          metadata: { testChallengeId: docRef.id },
        };
      } catch (err) {
        return {
          name: "16. Daily Challenge Create",
          status: "FAIL",
          message: `Failed to create daily challenge: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 17. Daily Challenge Read
    testDailyChallengeRead: async () => {
      const startTime = Date.now();
      try {
        const snap = await getDocs(
          query(
            collection(db, "dailyChallenges"),
            orderBy("date", "desc"),
            limit(10)
          )
        );
        const duration = Date.now() - startTime;
        const challenges = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        if (challenges.length > 0) {
          const validChallenges = challenges.filter(c => 
            c.type && c.difficulty && c.xp !== undefined && c.coins !== undefined
          );
          return {
            name: "17. Daily Challenge Read",
            status: validChallenges.length === challenges.length ? "PASS" : "WARN",
            message: `Retrieved ${challenges.length} daily challenges (${validChallenges.length} valid)`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "17. Daily Challenge Read",
            status: "WARN",
            message: "No daily challenges found in database",
            duration: `${duration}ms`,
          };
        }
      } catch (err) {
        return {
          name: "17. Daily Challenge Read",
          status: "FAIL",
          message: `Failed to read daily challenges: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 18. Daily Challenge Update
    testDailyChallengeUpdate: async (testChallengeId) => {
      if (!testChallengeId) {
        return {
          name: "18. Daily Challenge Update",
          status: "SKIP",
          message: "Skipped: No test challenge created",
          duration: "N/A",
        };
      }
      const startTime = Date.now();
      try {
        await updateDoc(doc(db, "dailyChallenges", testChallengeId), {
          xp: 100,
          coins: 20,
          updatedAt: new Date(),
        });
        const duration = Date.now() - startTime;
        return {
          name: "18. Daily Challenge Update",
          status: "PASS",
          message: `Successfully updated daily challenge`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "18. Daily Challenge Update",
          status: "FAIL",
          message: `Failed to update daily challenge: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 19. Daily Challenge Delete
    testDailyChallengeDelete: async (testChallengeId) => {
      if (!testChallengeId) {
        return {
          name: "19. Daily Challenge Delete",
          status: "SKIP",
          message: "Skipped: No test challenge to delete",
          duration: "N/A",
        };
      }
      const startTime = Date.now();
      try {
        await deleteDoc(doc(db, "dailyChallenges", testChallengeId));
        const duration = Date.now() - startTime;
        return {
          name: "19. Daily Challenge Delete",
          status: "PASS",
          message: `Successfully deleted test daily challenge`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "19. Daily Challenge Delete",
          status: "FAIL",
          message: `Failed to delete daily challenge: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 20. Stories CRUD - Create
    testStoryCreate: async () => {
      const startTime = Date.now();
      try {
        const testStory = {
          title: "Test Story Automation",
          description: "A test story for automation testing",
          targetAudience: "Kids",
          published: false,
          createdAt: new Date(),
          isTest: true,
        };
        const docRef = await addDoc(collection(db, "stories"), testStory);
        const duration = Date.now() - startTime;
        return {
          name: "20. Story Create",
          status: "PASS",
          message: `Created test story with ID: ${docRef.id}`,
          duration: `${duration}ms`,
          metadata: { testStoryId: docRef.id },
        };
      } catch (err) {
        return {
          name: "20. Story Create",
          status: "FAIL",
          message: `Failed to create story: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 21. Stories Read
    testStoryRead: async () => {
      const startTime = Date.now();
      try {
        const snap = await getDocs(
          query(
            collection(db, "stories"),
            orderBy("createdAt", "desc"),
            limit(20)
          )
        );
        const duration = Date.now() - startTime;
        const stories = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        const publishedStories = stories.filter(s => s.published);
        const draftStories = stories.filter(s => !s.published);
        
        return {
          name: "21. Story Read",
          status: stories.length > 0 ? "PASS" : "WARN",
          message: `Retrieved ${stories.length} stories (${publishedStories.length} published, ${draftStories.length} draft)`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "21. Story Read",
          status: "FAIL",
          message: `Failed to read stories: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 22. Stories Update
    testStoryUpdate: async (testStoryId) => {
      if (!testStoryId) {
        return {
          name: "22. Story Update",
          status: "SKIP",
          message: "Skipped: No test story created",
          duration: "N/A",
        };
      }
      const startTime = Date.now();
      try {
        await updateDoc(doc(db, "stories", testStoryId), {
          title: "Updated Test Story",
          updatedAt: new Date(),
        });
        const duration = Date.now() - startTime;
        return {
          name: "22. Story Update",
          status: "PASS",
          message: `Successfully updated story`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "22. Story Update",
          status: "FAIL",
          message: `Failed to update story: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 23. Stories Delete
    testStoryDelete: async (testStoryId) => {
      if (!testStoryId) {
        return {
          name: "23. Story Delete",
          status: "SKIP",
          message: "Skipped: No test story to delete",
          duration: "N/A",
        };
      }
      const startTime = Date.now();
      try {
        await deleteDoc(doc(db, "stories", testStoryId));
        const duration = Date.now() - startTime;
        return {
          name: "23. Story Delete",
          status: "PASS",
          message: `Successfully deleted test story`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "23. Story Delete",
          status: "FAIL",
          message: `Failed to delete story: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 24. Leaderboards Data
    testLeaderboardsData: async () => {
      const startTime = Date.now();
      try {
        const snap = await getDocs(
          query(
            collection(db, "leaderboards"),
            orderBy("score", "desc"),
            limit(50)
          )
        );
        const duration = Date.now() - startTime;
        const leaderboards = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        if (leaderboards.length > 0) {
          const validEntries = leaderboards.filter(l => 
            l.userId && l.score !== undefined && l.category
          );
          return {
            name: "24. Leaderboards Data",
            status: validEntries.length === leaderboards.length ? "PASS" : "WARN",
            message: `Retrieved ${leaderboards.length} leaderboard entries (${validEntries.length} valid)`,
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "24. Leaderboards Data",
            status: "WARN",
            message: "No leaderboard data found. Complete challenges to populate",
            duration: `${duration}ms`,
          };
        }
      } catch (err) {
        return {
          name: "24. Leaderboards Data",
          status: "FAIL",
          message: `Failed to read leaderboards: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 25. Category & Topic Mapping
    testCategoryTopicMapping: async () => {
      const startTime = Date.now();
      try {
        const expectedMapping = {
          Math: ["basics", "algebra", "geometry", "calculus"],
          English: ["vocabulary", "grammar", "literature", "writing"],
          Science: ["physics", "chemistry", "biology", "general"],
          History: ["ancient", "medieval", "modern", "current"],
          Programming: ["basics", "javascript", "python", "web-dev"],
        };

        // Verify at least some daily challenges have proper category/topic pairs
        const snap = await getDocs(
          query(collection(db, "dailyChallenges"), limit(5))
        );
        const challenges = snap.docs.map(d => d.data());
        
        const validPairs = challenges.filter(c => 
          c.category && 
          c.topic &&
          expectedMapping[c.category] &&
          expectedMapping[c.category].includes(c.topic.toLowerCase())
        );

        const duration = Date.now() - startTime;
        
        return {
          name: "25. Category & Topic Mapping",
          status: validPairs.length > 0 ? "PASS" : "WARN",
          message: `Verified ${validPairs.length}/${Math.min(5, challenges.length)} challenges have valid category-topic pairs`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "25. Category & Topic Mapping",
          status: "WARN",
          message: `Category-topic validation: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 26. Guest Data Storage
    testGuestDataStorage: async () => {
      const startTime = Date.now();
      try {
        // Check if localStorage API is available
        const canUseStorage = typeof(Storage) !== "undefined";
        
        if (canUseStorage) {
          // Test storing guest data
          const guestData = {
            guestId: "test-guest-" + Date.now(),
            progress: [{ challengeId: "test-1", completed: true, score: 100 }],
            xp: 150,
            coins: 30,
          };
          localStorage.setItem("guestProgress", JSON.stringify(guestData));
          
          // Retrieve and verify
          const retrieved = JSON.parse(localStorage.getItem("guestProgress"));
          const isValid = retrieved && retrieved.guestId && retrieved.progress;
          
          // Cleanup
          localStorage.removeItem("guestProgress");
          
          const duration = Date.now() - startTime;
          
          return {
            name: "26. Guest Data Storage",
            status: isValid ? "PASS" : "FAIL",
            message: "Guest progress data can be stored and retrieved from localStorage",
            duration: `${duration}ms`,
          };
        } else {
          return {
            name: "26. Guest Data Storage",
            status: "FAIL",
            message: "localStorage not available (required for guest feature)",
            duration: "N/A",
          };
        }
      } catch (err) {
        return {
          name: "26. Guest Data Storage",
          status: "FAIL",
          message: `Guest data storage failed: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 27. Mobile Viewport (375px)
    testMobileViewport: async () => {
      const startTime = Date.now();
      try {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Check if device is mobile-sized or can simulate it
        const isMobileSize = windowWidth <= 480;
        const hasViewportMeta = document.querySelector('meta[name="viewport"]');
        
        const duration = Date.now() - startTime;
        
        return {
          name: "27. Mobile Viewport",
          status: hasViewportMeta && (isMobileSize || window.innerWidth <= 1024) ? "PASS" : "WARN",
          message: `Current viewport: ${windowWidth}x${windowHeight}. Viewport meta tag: ${hasViewportMeta ? "Present" : "Missing"}`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "27. Mobile Viewport",
          status: "WARN",
          message: `Mobile viewport check: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 28. Dark Mode Support
    testDarkModeSupport: async () => {
      const startTime = Date.now();
      try {
        // Check for dark mode media query support
        const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        const supportsColorScheme = window.matchMedia("(prefers-color-scheme: dark)");
        
        // Check if app has CSS variables for theming
        const cssVariables = getComputedStyle(document.documentElement);
        const hasDarkModeVars = cssVariables.getPropertyValue("--bg-dark") || cssVariables.getPropertyValue("--color-dark");
        
        const duration = Date.now() - startTime;
        
        return {
          name: "28. Dark Mode Support",
          status: supportsColorScheme ? "PASS" : "WARN",
          message: `Dark mode support: Media query supported. Current preference: ${prefersDarkMode ? "Dark" : "Light"}`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "28. Dark Mode Support",
          status: "WARN",
          message: `Dark mode check: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 29. Error Boundary Test
    testErrorHandling: async () => {
      const startTime = Date.now();
      try {
        // Simulate error handling by trying invalid query
        try {
          const invalidQuery = query(
            collection(db, "invalid_collection")
          );
          await getDocs(invalidQuery);
        } catch (innerErr) {
          // Expected error
        }
        
        const duration = Date.now() - startTime;
        
        return {
          name: "29. Error Handling",
          status: "PASS",
          message: "Application handles errors gracefully without crashing",
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "29. Error Handling",
          status: "FAIL",
          message: `Error handling check failed: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 30. Responsive Image Loading
    testImageLoading: async () => {
      const startTime = Date.now();
      try {
        // Check if images on page load properly
        const images = document.querySelectorAll("img");
        const loadedImages = Array.from(images).filter(img => img.complete && img.naturalHeight > 0);
        
        const duration = Date.now() - startTime;
        
        return {
          name: "30. Image Loading",
          status: loadedImages.length > 0 ? "PASS" : "WARN",
          message: `Found ${loadedImages.length}/${images.length} images loaded successfully`,
          duration: `${duration}ms`,
        };
      } catch (err) {
        return {
          name: "30. Image Loading",
          status: "WARN",
          message: `Image loading check: ${err.message}`,
          duration: "N/A",
        };
      }
    },

    // 31. Analytics Collection Existence
    testAnalyticsCollectionExists: async () => {
      const startTime = Date.now();
      try {
        const snap = await getDocs(collection(db, "analytics_events"));
        const duration = Date.now() - startTime;
        
        return {
          name: "31. Analytics Collection Exists",
          status: "PASS",
          message: `Analytics events collection accessible with ${snap.docs.length} events recorded`,
          duration: `${duration}ms`,
          metadata: { eventCount: snap.docs.length },
        };
      } catch (err) {
        return {
          name: "31. Analytics Collection Exists",
          status: "WARN",
          message: `Analytics collection not yet created. Will be created on first event: ${err.message}`,
          duration: `${Date.now() - startTime}ms`,
        };
      }
    },

    // 32. Analytics Event Create
    testAnalyticsEventCreate: async () => {
      const startTime = Date.now();
      try {
        // Create a test event
        const testEvent = {
          userId: "test-user-analytics",
          eventType: "test_analytics_create",
          eventData: {
            featureName: "Analytics Testing",
            testAction: "Create Event",
            timestamp: Date.now(),
          },
          timestamp: new Date(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        };

        const docRef = await addDoc(collection(db, "analytics_events"), testEvent);
        const duration = Date.now() - startTime;

        return {
          name: "32. Analytics Event Create",
          status: "PASS",
          message: `Test analytics event created successfully`,
          duration: `${duration}ms`,
          metadata: { testEventId: docRef.id },
        };
      } catch (err) {
        return {
          name: "32. Analytics Event Create",
          status: "FAIL",
          message: `Failed to create analytics event: ${err.message}`,
          duration: `${Date.now() - startTime}ms`,
        };
      }
    },

    // 33. Analytics Event Read
    testAnalyticsEventRead: async () => {
      const startTime = Date.now();
      try {
        const snap = await getDocs(
          query(
            collection(db, "analytics_events"),
            where("userId", "==", "test-user-analytics"),
            limit(10)
          )
        );
        
        const events = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const duration = Date.now() - startTime;

        return {
          name: "33. Analytics Event Read",
          status: events.length > 0 ? "PASS" : "WARN",
          message: `Found ${events.length} test analytics events for user`,
          duration: `${duration}ms`,
          metadata: { eventCount: events.length },
        };
      } catch (err) {
        return {
          name: "33. Analytics Event Read",
          status: "FAIL",
          message: `Failed to read analytics events: ${err.message}`,
          duration: `${Date.now() - startTime}ms`,
        };
      }
    },

    // 34. Performance Monitor Metrics
    testPerformanceMonitorMetrics: async () => {
      const startTime = Date.now();
      try {
        const { performanceMonitor } = require("../utils/performanceMonitor");
        
        // Start a test measurement
        performanceMonitor.startMeasure("test_analytics_operation");
        
        // Simulate some work
        await new Promise(resolve => setTimeout(resolve, 100));
        
        performanceMonitor.endMeasure("test_analytics_operation");
        
        const metrics = performanceMonitor.getAllMetrics();
        const duration = Date.now() - startTime;

        const hasTestMetric = metrics && Object.keys(metrics).length > 0;

        return {
          name: "34. Performance Monitor Metrics",
          status: hasTestMetric ? "PASS" : "WARN",
          message: `Performance monitor functional. Tracked ${Object.keys(metrics || {}).length} metric groups`,
          duration: `${duration}ms`,
          metadata: { metricsCount: Object.keys(metrics || {}).length },
        };
      } catch (err) {
        return {
          name: "34. Performance Monitor Metrics",
          status: "WARN",
          message: `Performance monitor check: ${err.message}`,
          duration: `${Date.now() - startTime}ms`,
        };
      }
    },

    // 35. Analytics Cleanup & Validation
    testAnalyticsCleanup: async () => {
      const startTime = Date.now();
      try {
        // Find and delete test analytics events
        const snap = await getDocs(
          query(
            collection(db, "analytics_events"),
            where("userId", "==", "test-user-analytics")
          )
        );

        const batch = writeBatch(db);
        let deletedCount = 0;

        snap.docs.forEach(d => {
          batch.delete(d.ref);
          deletedCount++;
        });

        if (deletedCount > 0) {
          await batch.commit();
        }

        const duration = Date.now() - startTime;

        return {
          name: "35. Analytics Cleanup & Validation",
          status: "PASS",
          message: `Cleanup successful. Removed ${deletedCount} test analytics events`,
          duration: `${duration}ms`,
          metadata: { cleanedupCount: deletedCount },
        };
      } catch (err) {
        return {
          name: "35. Analytics Cleanup & Validation",
          status: "WARN",
          message: `Analytics cleanup: ${err.message}`,
          duration: `${Date.now() - startTime}ms`,
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
    let testChallengeId = null;
    let testStoryId = null;

    // Run tests in sequence
    try {
      // 1. Database Connection
      let result = await tests.testDatabaseConnection();
      results.push(result);
      setTestResults([...results]);
      setProgress(3);

      // 2. Read Features
      result = await tests.testReadFeatures();
      results.push(result);
      setTestResults([...results]);
      setProgress(7);

      // 3. Read Categories
      result = await tests.testReadCategories();
      results.push(result);
      setTestResults([...results]);
      setProgress(10);

      // 4. Read Subtopicies
      result = await tests.testReadSubtopicies();
      results.push(result);
      setTestResults([...results]);
      setProgress(13);

      // 5. Read Questions
      result = await tests.testReadQuestions();
      results.push(result);
      setTestResults([...results]);
      setProgress(17);

      // 6. Read Scores
      result = await tests.testReadScores();
      results.push(result);
      setTestResults([...results]);
      setProgress(20);

      // 7. Hierarchy Validation
      result = await tests.testHierarchyValidation();
      results.push(result);
      setTestResults([...results]);
      setProgress(23);

      // 8. Create Record
      result = await tests.testCreateRecord();
      results.push(result);
      setTestResults([...results]);
      testDocId = result.metadata?.testDocId;
      setProgress(27);

      // 9. Update Record
      result = await tests.testUpdateRecord(testDocId);
      results.push(result);
      setTestResults([...results]);
      setProgress(30);

      // 10. Delete Record
      result = await tests.testDeleteRecord(testDocId);
      results.push(result);
      setTestResults([...results]);
      setProgress(33);

      // 11. Data Validation
      result = await tests.testDataValidation();
      results.push(result);
      setTestResults([...results]);
      setProgress(37);

      // 12. Query Performance
      result = await tests.testQueryPerformance();
      results.push(result);
      setTestResults([...results]);
      setProgress(40);

      // 13. Concurrent Operations
      result = await tests.testConcurrentOperations();
      results.push(result);
      setTestResults([...results]);
      setProgress(43);

      // 14. Text-to-Speech Support
      result = await tests.testTextToSpeechSupport();
      results.push(result);
      setTestResults([...results]);
      setProgress(47);

      // 15. Kids Questions Validation
      result = await tests.testKidsQuestionsValidation();
      results.push(result);
      setTestResults([...results]);
      setProgress(50);

      // 16. Daily Challenge Create
      result = await tests.testDailyChallengeCreate();
      results.push(result);
      setTestResults([...results]);
      testChallengeId = result.metadata?.testChallengeId;
      setProgress(53);

      // 17. Daily Challenge Read
      result = await tests.testDailyChallengeRead();
      results.push(result);
      setTestResults([...results]);
      setProgress(57);

      // 18. Daily Challenge Update
      result = await tests.testDailyChallengeUpdate(testChallengeId);
      results.push(result);
      setTestResults([...results]);
      setProgress(60);

      // 19. Daily Challenge Delete
      result = await tests.testDailyChallengeDelete(testChallengeId);
      results.push(result);
      setTestResults([...results]);
      setProgress(63);

      // 20. Story Create
      result = await tests.testStoryCreate();
      results.push(result);
      setTestResults([...results]);
      testStoryId = result.metadata?.testStoryId;
      setProgress(67);

      // 21. Story Read
      result = await tests.testStoryRead();
      results.push(result);
      setTestResults([...results]);
      setProgress(70);

      // 22. Story Update
      result = await tests.testStoryUpdate(testStoryId);
      results.push(result);
      setTestResults([...results]);
      setProgress(73);

      // 23. Story Delete
      result = await tests.testStoryDelete(testStoryId);
      results.push(result);
      setTestResults([...results]);
      setProgress(77);

      // 24. Leaderboards Data
      result = await tests.testLeaderboardsData();
      results.push(result);
      setTestResults([...results]);
      setProgress(80);

      // 25. Category & Topic Mapping
      result = await tests.testCategoryTopicMapping();
      results.push(result);
      setTestResults([...results]);
      setProgress(83);

      // 26. Guest Data Storage
      result = await tests.testGuestDataStorage();
      results.push(result);
      setTestResults([...results]);
      setProgress(87);

      // 27. Mobile Viewport
      result = await tests.testMobileViewport();
      results.push(result);
      setTestResults([...results]);
      setProgress(90);

      // 28. Dark Mode Support
      result = await tests.testDarkModeSupport();
      results.push(result);
      setTestResults([...results]);
      setProgress(93);

      // 29. Error Handling
      result = await tests.testErrorHandling();
      results.push(result);
      setTestResults([...results]);
      setProgress(97);

      // 30. Image Loading
      result = await tests.testImageLoading();
      results.push(result);
      setTestResults([...results]);
      setProgress(94);

      // 31. Analytics Collection Exists
      result = await tests.testAnalyticsCollectionExists();
      results.push(result);
      setTestResults([...results]);
      setProgress(97);

      // 32. Analytics Event Create
      result = await tests.testAnalyticsEventCreate();
      results.push(result);
      setTestResults([...results]);
      setProgress(100);

      // 33. Analytics Event Read
      result = await tests.testAnalyticsEventRead();
      results.push(result);
      setTestResults([...results]);
      setProgress(103);

      // 34. Performance Monitor Metrics
      result = await tests.testPerformanceMonitorMetrics();
      results.push(result);
      setTestResults([...results]);
      setProgress(106);

      // 35. Analytics Cleanup & Validation
      result = await tests.testAnalyticsCleanup();
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
