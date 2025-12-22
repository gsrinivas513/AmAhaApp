import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { addDoc, collection, getDocs, query, where, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Card, Button } from "../components/ui";

function AddQuestionPage() {
  const location = useLocation();
  const preselectedData = location.state || {};
  
  /* ---------------- CATEGORIES FROM FIREBASE ---------------- */
  const [categories, setCategories] = useState([]);
  const [subtopics, setSubtopicies] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoriesAndFeatures();
  }, []);

  const loadCategoriesAndFeatures = async () => {
    try {
      // Load features
      const featuresSnap = await getDocs(collection(db, "features"));
      const featuresData = featuresSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setFeatures(featuresData);

      // Load ALL categories (not just quiz)
      const categoriesSnap = await getDocs(collection(db, "categories"));
      const categoriesData = categoriesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setCategories(categoriesData);

      // Load subtopics
      const subtopicsSnap = await getDocs(collection(db, "subtopics"));
      const subtopicsData = subtopicsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubtopicies(subtopicsData);
      
      // Set preselected values if they exist
      if (preselectedData.preselectedCategory) {
        const selectedCat = categoriesData.find(c => c.id === preselectedData.preselectedCategory);
        if (selectedCat) {
          const selectedFeature = featuresData.find(f => f.id === selectedCat.featureId);
          setForm(prev => ({
            ...prev,
            feature: selectedFeature?.id || "",
            category: selectedCat.id,
            subtopic: preselectedData.preselectedSubtopic || ""
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- MANUAL FORM ---------------- */
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    feature: "",
    category: "",
    subtopic: "",
    difficulty: "",
    imageUrl: "", // For puzzles and other visual content
    description: "", // For studies/articles
  });

  /* ---------------- BULK IMPORT ---------------- */
  const [importedQuestions, setImportedQuestions] = useState([]);
  const [importing, setImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  /* ---------------- MANUAL HELPERS ---------------- */
  const update = (field, value) =>
    setForm({ ...form, [field]: value });

  // Get the selected feature's type
  const getSelectedFeatureType = () => {
    const selectedFeature = features.find(f => f.id === form.feature);
    const featureType = selectedFeature?.featureType || "";
    const featureName = (selectedFeature?.label || selectedFeature?.name || "").toLowerCase();
    
    // If featureType is set, use it; otherwise infer from name
    if (featureType) return featureType.toLowerCase();
    
    // Fallback: infer type from feature name
    if (featureName.includes("quiz")) return "quiz";
    if (featureName.includes("puzzle")) return "puzzle";
    if (featureName.includes("study") || featureName.includes("article")) return "study";
    
    return "";
  };

  // Check if all required fields except difficulty are filled based on feature type
  const isFormValid = () => {
    const featureType = getSelectedFeatureType();
    
    // Common required fields
    const hasBasicFields = form.feature && form.category && form.subtopic;
    
    if (!hasBasicFields) return false;

    // Feature-specific validation
    switch (featureType) {
      case "quiz":
        // Quiz requires: question, 4 options, correct answer
        return (
          form.question &&
          form.options.every(o => o) &&
          form.correctAnswer
        );
      
      case "puzzle":
        // Puzzle requires: question/title and optionally image
        return form.question;
      
      case "study":
      case "article":
        // Study/Article requires: title (question field) and description
        return form.question && form.description;
      
      default:
        // Default: require at least question
        return form.question;
    }
  };

  const updateOption = (i, value) => {
    const copy = [...form.options];
    copy[i] = value;
    update("options", copy);
  };

  /* ---------------- SAVE MANUAL ---------------- */
  const saveManual = async () => {
    const featureType = getSelectedFeatureType();

    // Validate based on feature type
    if (!isFormValid() || !form.difficulty) {
      let errorMsg = "Please fill all required fields:\n";
      
      if (!form.feature) errorMsg += "- Select Feature\n";
      if (!form.category) errorMsg += "- Select Category\n";
      if (!form.subtopic) errorMsg += "- Select SubTopic\n";
      if (!form.question) errorMsg += "- Enter Question/Title\n";
      
      if (featureType === "quiz") {
        if (form.options.some(o => !o)) errorMsg += "- Fill all 4 options\n";
        if (!form.correctAnswer) errorMsg += "- Enter Correct Answer\n";
      } else if (featureType === "study" || featureType === "article") {
        if (!form.description) errorMsg += "- Enter Description\n";
      }
      
      if (!form.difficulty) errorMsg += "- Select Difficulty\n";
      
      alert(errorMsg);
      return;
    }

    try {
      // Prepare data based on feature type
      const dataToSave = {
        feature: form.feature,
        category: form.category,
        subtopic: form.subtopic,
        difficulty: form.difficulty,
        createdAt: new Date(),
        featureType: featureType
      };

      // Add feature-specific fields
      if (featureType === "quiz") {
        dataToSave.question = form.question;
        dataToSave.options = form.options;
        dataToSave.correctAnswer = form.correctAnswer;
      } else if (featureType === "puzzle") {
        dataToSave.question = form.question; // Title
        dataToSave.imageUrl = form.imageUrl || "";
        dataToSave.correctAnswer = form.correctAnswer || ""; // For puzzle validation
      } else if (featureType === "study" || featureType === "article") {
        dataToSave.question = form.question; // Title
        dataToSave.description = form.description;
        dataToSave.imageUrl = form.imageUrl || "";
      } else {
        // Default: save all fields
        dataToSave.question = form.question;
        dataToSave.description = form.description || "";
        dataToSave.imageUrl = form.imageUrl || "";
      }

      await addDoc(collection(db, "questions"), dataToSave);

      // Update the category's quiz count
      const category = categories.find(c => c.name === form.category);
      if (category) {
        // Count current questions
        const questionsQuery = query(
          collection(db, "questions"),
          where("category", "==", form.category)
        );
        const questionsSnap = await getDocs(questionsQuery);
        const newCount = questionsSnap.size;

        // Update category with new count
        const { updateDoc, doc } = await import("firebase/firestore");
        await updateDoc(doc(db, "categories", category.id), {
          quizCount: newCount,
        });
      }

      alert("Content added successfully!");
      setForm({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        feature: "",
        category: "",
        subtopic: "",
        difficulty: "",
        imageUrl: "",
        description: "",
      });
    } catch (err) {
      console.error("Error saving content:", err);
      alert("Failed to add content");
    }
  };

  /* ---------------- FILE HANDLING ---------------- */

  const handleFile = (file) => {
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "csv") parseCSV(file);
    else if (ext === "xlsx" || ext === "xls") parseExcel(file);
    else alert("Unsupported file type");
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => normalizeQuestions(res.data),
    });
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      normalizeQuestions(XLSX.utils.sheet_to_json(sheet));
    };
    reader.readAsBinaryString(file);
  };

  /* ---------------- NORMALIZE ---------------- */

const normalizeQuestions = (rows) => {
  const formatted = rows.map((q, idx) => {
    console.log("RAW ROW:", q); // ✅ keep for debug

    return {
      question: q.question?.trim(),
      options: [
        q.optionA,
        q.optionB,
        q.optionC,
        q.optionD,
      ],
      correctAnswer: q.correctAnswer?.trim(),
      feature: q.feature?.trim() || q.Feature?.trim() || null,
      category: q.category?.trim() || q.Category?.trim() || null,
      subtopic: q.subtopic?.trim() || q.Subtopic?.trim() || q.subtopic?.trim() || q.SubTopic?.trim() || null,
      topic: q.topic?.trim() || q.Topic?.trim() || null,
      difficulty: q.difficulty?.trim() || "easy",
      createdAt: new Date(),
    };
  });

  setImportedQuestions(formatted);
};

  /* ---------------- SAVE BULK ---------------- */

  const saveImported = async () => {
    console.log("🚀 NEW IMPORT CODE LOADED - Version 2.1 with duplicate detection");
    setImporting(true);

    try {
      let saved = 0;
      let skipped = 0;
      const { updateDoc, doc: fsDoc } = await import("firebase/firestore");
      const categoriesUpdated = new Set();

      // Reload fresh data from Firestore
      const [featuresSnap, categoriesSnap, subtopicsSnap, questionsSnap] = await Promise.all([
        getDocs(collection(db, "features")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "subtopics")),
        getDocs(collection(db, "questions"))
      ]);

      const existingFeatures = featuresSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const existingCategories = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const existingSubtopicies = subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Create a Set of existing question texts for duplicate detection
      const existingQuestions = new Set(
        questionsSnap.docs.map(d => d.data().question?.toLowerCase().trim())
      );
      console.log(`📊 Found ${existingQuestions.size} existing questions in database`);

      // Helper: Get or create Feature
      const getOrCreateFeature = async (featureName) => {
        if (!featureName) return null;
        const nameLower = featureName.toLowerCase();
        
        let existing = existingFeatures.find(f => 
          (f.name && f.name.toLowerCase() === nameLower) ||
          (f.label && f.label.toLowerCase() === nameLower)
        );
        
        if (existing) return existing.id;
        
        const newFeature = {
          name: featureName,
          label: featureName,
          type: nameLower,
          icon: "📝",
          createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, "features"), newFeature);
        existingFeatures.push({ id: docRef.id, ...newFeature });
        console.log(`✅ Created Feature: ${featureName} (ID: ${docRef.id})`);
        return docRef.id;
      };

      // Helper: Get or create Category
      const getOrCreateCategory = async (categoryName, featureId) => {
        if (!categoryName) return null;
        const nameLower = categoryName.toLowerCase();
        
        let existing = existingCategories.find(c => 
          ((c.name && c.name.toLowerCase() === nameLower) ||
           (c.label && c.label.toLowerCase() === nameLower) ||
           c.id === nameLower)
        );
        
        if (existing) return existing.id;
        
        const categoryId = nameLower;
        const newCategory = {
          name: categoryName,
          label: categoryName,
          featureId: featureId || null,
          published: true,
          createdAt: serverTimestamp()
        };
        
        await setDoc(doc(db, "categories", categoryId), newCategory);
        existingCategories.push({ id: categoryId, ...newCategory });
        console.log(`✅ Created Category: ${categoryName} (ID: ${categoryId})`);
        return categoryId;
      };

      // Helper: Get or create Topic
      const getOrCreateTopic = async (topicName, categoryId) => {
        if (!topicName) return null;
        
        // Try to find existing topic
        const topicQuery = query(
          collection(db, "topics"),
          where("categoryId", "==", categoryId),
          where("name", "==", topicName)
        );
        const topicSnap = await getDocs(topicQuery);
        
        if (!topicSnap.empty) {
          return topicSnap.docs[0].id;
        }
        
        // Create new topic
        const newTopic = {
          name: topicName,
          label: topicName,
          categoryId: categoryId,
          isPublished: true,
          sortOrder: 0,
          quizCount: 0,
          createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, "topics"), newTopic);
        console.log(`✅ Created Topic: ${topicName} (ID: ${docRef.id}) under Category: ${categoryId}`);
        return docRef.id;
      };

      // Helper: Get or create Subtopic
      const getOrCreateSubtopic = async (subtopicName, categoryId, featureId, topic = null) => {
        if (!subtopicName) return null;
        const nameLower = subtopicName.toLowerCase();
        
        let existing = existingSubtopicies.find(s => 
          s.categoryId === categoryId &&
          ((s.name && s.name.toLowerCase() === nameLower) ||
           (s.label && s.label.toLowerCase() === nameLower))
        );
        
        // Get or create topic if provided
        let topicId = null;
        if (topic) {
          topicId = await getOrCreateTopic(topic, categoryId);
        }
        
        if (existing) {
          // Update topicId if provided and different
          if (topicId && existing.topicId !== topicId) {
            await updateDoc(doc(db, "subtopics", existing.id), { 
              topicId,
              topic // Keep old field for compatibility
            });
            existing.topicId = topicId;
            console.log(`✅ Updated SubTopic topic: ${subtopicName} → ${topic} (${topicId})`);
          }
          return existing.id;
        }
        
        const newSubtopic = {
          name: subtopicName,
          label: subtopicName,
          categoryId: categoryId,
          featureId: featureId || null,
          topic: topic || null, // Keep for compatibility
          topicId: topicId || null,
          published: true,
          quizCount: 0,
          createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, "subtopics"), newSubtopic);
        existingSubtopicies.push({ id: docRef.id, ...newSubtopic });
        console.log(`✅ Created SubTopic: ${subtopicName} (ID: ${docRef.id}) under Category: ${categoryId}, Topic: ${topic || 'None'} (ID: ${topicId || 'None'})`);
        return docRef.id;
      };

      // Collect unique features/categories/subtopics
      const uniqueFeatures = new Set();
      const uniqueCategories = new Set();
      const uniqueSubtopicies = new Map();

      for (const q of importedQuestions) {
        if (q.feature) uniqueFeatures.add(q.feature);
        if (q.category) uniqueCategories.add(q.category.toLowerCase());
        if (q.subtopic && q.category) {
          uniqueSubtopicies.set(`${q.category.toLowerCase()}|${q.subtopic}`, {
            category: q.category.toLowerCase(),
            subtopic: q.subtopic,
            topic: q.topic || null
          });
        }
      }

      // Create all Features/Categories/Subtopicies upfront
      const featureIdMap = new Map();
      const categoryIdMap = new Map();
      const subtopicIdMap = new Map();

      for (const featureName of uniqueFeatures) {
        try {
          const featureId = await getOrCreateFeature(featureName);
          featureIdMap.set(featureName, featureId);
        } catch (err) {
          console.error(`Failed to create Feature: ${featureName}`, err);
        }
      }

      for (const categoryName of uniqueCategories) {
        try {
          const featureId = featureIdMap.values().next().value || null;
          const categoryId = await getOrCreateCategory(categoryName, featureId);
          categoryIdMap.set(categoryName, categoryId);
        } catch (err) {
          console.error(`Failed to create Category: ${categoryName}`, err);
        }
      }

      for (const [key, data] of uniqueSubtopicies) {
        try {
          const categoryId = categoryIdMap.get(data.category);
          const featureId = featureIdMap.values().next().value || null;
          const subtopicId = await getOrCreateSubtopic(data.subtopic, categoryId, featureId, data.topic);
          subtopicIdMap.set(key, subtopicId);
        } catch (err) {
          console.error(`Failed to create Subtopic: ${data.subtopic}`, err);
        }
      }

      // Now save questions with proper IDs
      for (const q of importedQuestions) {
        if (
          !q.question ||
          q.options.some((o) => !o) ||
          !q.correctAnswer ||
          !q.category ||
          !q.difficulty
        ) continue;

        // Check for duplicate question
        const questionTextLower = q.question.toLowerCase().trim();
        if (existingQuestions.has(questionTextLower)) {
          console.log(`⏭️  Skipping duplicate: "${q.question}"`);
          skipped++;
          continue;
        }

        const categoryLower = q.category.toLowerCase();
        const featureId = q.feature ? featureIdMap.get(q.feature) : null;
        const categoryId = categoryIdMap.get(categoryLower) || categoryLower;
        const subtopicKey = `${categoryLower}|${q.subtopic}`;
        const subtopicId = q.subtopic ? subtopicIdMap.get(subtopicKey) : null;

        const questionData = {
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          category: categoryId,
          difficulty: q.difficulty,
          createdAt: new Date(),
        };

        if (q.feature) questionData.feature = q.feature;
        if (q.subtopic) questionData.subtopic = q.subtopic;
        if (q.topic) questionData.topic = q.topic;
        if (featureId) questionData.featureId = featureId;
        if (subtopicId) questionData.subtopicId = subtopicId;

        // Debug first question
        if (saved === 0) {
          console.log("📝 First question to save:", {
            feature: questionData.feature,
            featureId: questionData.featureId,
            category: questionData.category,
            subtopic: questionData.subtopic,
            subtopicId: questionData.subtopicId,
            topic: questionData.topic
          });
        }

        await addDoc(collection(db, "questions"), questionData);
        
        // Add to existing questions set to catch duplicates within the same import
        existingQuestions.add(questionTextLower);

        saved++;
        categoriesUpdated.add(categoryId);
      }

      // Update quiz counts for all affected categories
      for (const categoryId of categoriesUpdated) {
        // categoryId is already the lowercase ID like "kids"
        const category = existingCategories.find(c => c.id === categoryId);
        if (category) {
          const questionsQuery = query(
            collection(db, "questions"),
            where("category", "==", categoryId)
          );
          const questionsSnap = await getDocs(questionsQuery);
          const newCount = questionsSnap.size;

          await updateDoc(fsDoc(db, "categories", categoryId), {
            quizCount: newCount,
          });
          
          console.log(`✅ Updated category ${categoryId} quiz count: ${newCount}`);
        }
      }

      // Update quiz counts for all affected subtopics
      const subtopicsForCategory = existingSubtopicies.filter(s => 
        Array.from(categoriesUpdated).includes(s.categoryId)
      );
      
      console.log(`Updating quiz counts for ${subtopicsForCategory.length} subtopics...`);
      
      for (const subtopic of subtopicsForCategory) {
        try {
          // Count questions that have this subtopic ID
          const questionsQuery = query(
            collection(db, "questions"),
            where("subtopicId", "==", subtopic.id)
          );
          const questionsSnap = await getDocs(questionsQuery);
          const count = questionsSnap.size;

          await updateDoc(fsDoc(db, "subtopics", subtopic.id), {
            quizCount: count,
          });
          
          console.log(`✅ Updated subtopic ${subtopic.name} quiz count: ${count}`);
        } catch (err) {
          console.error(`Failed to update subtopic ${subtopic.name}:`, err);
        }
      }

      // Update quiz counts for all topics
      console.log('Updating quiz counts for topics...');
      const topicsSnap = await getDocs(collection(db, "topics"));
      
      for (const topicDoc of topicsSnap.docs) {
        try {
          const topicId = topicDoc.id;
          const topicName = topicDoc.data().name;
          
          // Query subtopics linked to this topic directly from database
          const subcatsQuery = query(
            collection(db, "subtopics"),
            where("topicId", "==", topicId)
          );
          const subcatsSnap = await getDocs(subcatsQuery);
          
          console.log(`📊 Topic "${topicName}" has ${subcatsSnap.size} subtopics`);
          
          // Count total questions across all subtopics for this topic
          let totalQuestions = 0;
          for (const subcatDoc of subcatsSnap.docs) {
            const questionsQuery = query(
              collection(db, "questions"),
              where("subtopicId", "==", subcatDoc.id)
            );
            const questionsSnap = await getDocs(questionsQuery);
            totalQuestions += questionsSnap.size;
            
            if (questionsSnap.size > 0) {
              console.log(`  ↳ SubTopic "${subcatDoc.data().name}" has ${questionsSnap.size} questions`);
            }
          }

          await updateDoc(fsDoc(db, "topics", topicId), {
            quizCount: totalQuestions,
          });
          
          console.log(`✅ Updated topic ${topicName} quiz count: ${totalQuestions}`);
        } catch (err) {
          console.error(`Failed to update topic:`, err);
        }
      }

      const message = skipped > 0 
        ? `Bulk import successful! Saved ${saved} new questions, skipped ${skipped} duplicates.`
        : `Bulk import successful! Saved ${saved} questions.`;
      
      alert(message);
      setImportedQuestions([]);
    } catch (err) {
      console.error("Error during bulk import:", err);
      alert("Error during bulk import. Some questions may not have been saved.");
    } finally {
      setImporting(false);
    }
  };

  /* ---------------- TEMPLATES ---------------- */

  const downloadCSVTemplate = () => {
    const csv =
      "question,optionA,optionB,optionC,optionD,correctAnswer,category,difficulty\n";

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "quiz_questions_template.csv";
    link.click();
  };

  const downloadExcelTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        category: "",
        difficulty: "",
      },
    ]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Questions");
    XLSX.writeFile(wb, "quiz_questions_template.xlsx");
  };

  /* ---------------- UI ---------------- */

  return (
    <AdminLayout>
      <Card>
        <h2>Add Content Item</h2>

        {loading ? (
          <p style={{ color: "#64748b" }}>Loading categories...</p>
        ) : categories.length === 0 ? (
          <div style={{ padding: 16, background: "#fef3c7", borderRadius: 8, marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 14, color: "#92400e", fontWeight: 600 }}>
              ⚠️ No categories found. Please create features and categories in <strong>Admin → Features & Categories</strong> first.
            </p>
          </div>
        ) : null}

        {/* Info message based on selected feature type */}
        {form.feature && (
          <div style={{ 
            width: "60%",
            padding: 12, 
            background: getSelectedFeatureType() === "quiz" ? "#e0f2fe" : 
                        getSelectedFeatureType() === "puzzle" ? "#fef3c7" : 
                        "#f0fdf4",
            borderRadius: 8, 
            marginTop: 10,
            marginBottom: 16,
            border: `1px solid ${
              getSelectedFeatureType() === "quiz" ? "#0284c7" : 
              getSelectedFeatureType() === "puzzle" ? "#f59e0b" : 
              "#10b981"
            }`
          }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
              {getSelectedFeatureType() === "quiz" && "📝 Quiz Mode: Requires question, 4 options, correct answer, and difficulty"}
              {getSelectedFeatureType() === "puzzle" && "🧩 Puzzle Mode: Requires title/question, optional image and solution"}
              {(getSelectedFeatureType() === "study" || getSelectedFeatureType() === "article") && "📚 Study/Article Mode: Requires title, description, and optional image"}
              {!["quiz", "puzzle", "study", "article"].includes(getSelectedFeatureType()) && "📄 Content Mode: Fill in the relevant fields for your content type"}
            </p>
          </div>
        )}

        <select
          style={{
            ...mediumWidth,
            ...(preselectedData.preselectedCategory && {
              background: "#f0f9ff",
              border: "2px solid #0284c7",
              cursor: "not-allowed",
              opacity: 0.8
            })
          }}
          value={form.feature}
          onChange={(e) => {
            const selectedFeature = e.target.value;
            setForm({
              ...form,
              feature: selectedFeature,
              category: "",
              subtopic: ""
            });
          }}
          disabled={features.length === 0 || preselectedData.preselectedCategory}
          title={preselectedData.preselectedCategory ? `🔒 Pre-selected: ${preselectedData.featureName || ''}` : ""}
        >
          <option value="">Select Feature</option>
          {features.map(feat => (
            <option key={feat.id} value={feat.id}>
              {feat.name}
            </option>
          ))}
        </select>

        <select
          style={{
            ...mediumWidth,
            ...(preselectedData.preselectedCategory && {
              background: "#f0f9ff",
              border: "2px solid #0284c7",
              cursor: "not-allowed",
              opacity: 0.8
            })
          }}
          value={form.category}
          onChange={(e) => {
            const selectedCategory = e.target.value;
            setForm({
              ...form,
              category: selectedCategory,
              subtopic: ""
            });
          }}
          disabled={!form.feature || categories.length === 0 || preselectedData.preselectedCategory}
          title={preselectedData.preselectedCategory ? `🔒 Pre-selected: ${preselectedData.categoryName || ''}` : ""}
        >
          <option value="">Select Category</option>
          {categories.filter(cat => cat.featureId === form.feature).map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}{!cat.isPublished ? " (Draft)" : ""}
            </option>
          ))}
        </select>

        <select
          style={{
            ...mediumWidth,
            marginBottom: "24px",
            ...(preselectedData.preselectedSubtopic && {
              background: "#f0f9ff",
              border: "2px solid #0284c7",
              cursor: "not-allowed",
              opacity: 0.8
            })
          }}
          value={form.subtopic}
          onChange={(e) => {
            const selectedSubtopic = e.target.value;
            setForm({
              ...form,
              subtopic: selectedSubtopic
            });
          }}
          disabled={!form.category || preselectedData.preselectedSubtopic}
          title={preselectedData.preselectedSubtopic ? `🔒 Pre-selected: ${preselectedData.subtopicName || ''}` : ""}
        >
          <option value="">Select SubTopic</option>
          {subtopics
            .filter(sub => sub.categoryId === form.category)
            .map(sub => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
        </select>

        {/* Dynamic field label based on feature type */}
        <textarea
          style={{
            ...mediumWidth,
            minHeight: "80px",
            maxHeight: "200px",
            resize: "vertical",
            fontFamily: "inherit",
            overflow: "auto"
          }}
          placeholder={
            getSelectedFeatureType() === "quiz" ? "Question (Can be multiline)" :
            getSelectedFeatureType() === "puzzle" ? "Puzzle Title/Question" :
            getSelectedFeatureType() === "study" || getSelectedFeatureType() === "article" ? "Article Title" :
            "Title/Question"
          }
          value={form.question}
          onChange={(e) => update("question", e.target.value)}
        />

        {/* Show description field for study/article types */}
        {(getSelectedFeatureType() === "study" || getSelectedFeatureType() === "article") && (
          <textarea
            style={{
              ...fullWidth,
              minHeight: "120px",
              resize: "vertical",
              fontFamily: "inherit"
            }}
            placeholder="Content Description / Article Body"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        )}

        {/* Show image URL field for puzzle, study, article */}
        {(getSelectedFeatureType() === "puzzle" || getSelectedFeatureType() === "study" || getSelectedFeatureType() === "article") && (
          <input
            style={fullWidth}
            placeholder="Image URL (optional)"
            value={form.imageUrl}
            onChange={(e) => update("imageUrl", e.target.value)}
          />
        )}

        {/* Show options only for quiz type */}
        {getSelectedFeatureType() === "quiz" && (
          <>
            {form.options.map((o, i) => (
              <textarea
                key={i}
                style={{
                  ...mediumWidth,
                  minHeight: "50px",
                  maxHeight: "120px",
                  resize: "vertical",
                  fontFamily: "inherit",
                  overflow: "auto"
                }}
                placeholder={`Option ${i + 1}`}
                value={o}
                onChange={(e) => updateOption(i, e.target.value)}
              />
            ))}
          </>
        )}

        {/* Show correct answer field for quiz and puzzle */}
        {(getSelectedFeatureType() === "quiz" || getSelectedFeatureType() === "puzzle") && (
          <textarea
            style={{
              ...mediumWidth,
              minHeight: "50px",
              maxHeight: "120px",
              resize: "vertical",
              fontFamily: "inherit",
              overflow: "auto"
            }}
            placeholder={getSelectedFeatureType() === "quiz" ? "Correct Answer" : "Correct Answer / Solution (optional)"}
            value={form.correctAnswer}
            onChange={(e) => update("correctAnswer", e.target.value)}
          />
        )}

        <select
          style={{
            ...mediumWidth,
            ...((!isFormValid()) && {
              backgroundColor: "#f3f4f6",
              cursor: "not-allowed",
              opacity: 0.6
            })
          }}
          value={form.difficulty}
          onChange={(e) => update("difficulty", e.target.value)}
          disabled={!isFormValid()}
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <div style={{ marginTop: 14 }}>
          <Button onClick={saveManual} disabled={!isFormValid() || !form.difficulty}>
            Add Content
          </Button>
        </div>
      </Card>

      <hr style={{ margin: "40px 0" }} />

      <h2>Bulk Import (CSV / Excel)</h2>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button variant="secondary" onClick={downloadCSVTemplate}>Download CSV Template</Button>
        <Button variant="secondary" onClick={downloadExcelTemplate}>Download Excel Template</Button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        style={{
          border: "2px dashed #6C63FF",
          padding: 30,
          borderRadius: 12,
          textAlign: "center",
          background: dragActive ? "#f3f4ff" : "#fafafa",
          marginTop: 20,
        }}
      >
        Drag & Drop CSV / Excel here
        <br />
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>

      {importedQuestions.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <Button variant="primary" onClick={saveImported} disabled={importing}>
            {importing ? "Importing..." : "Save Imported Questions"}
          </Button>
        </div>
      )}
    </AdminLayout>
  );
}

/* ---------------- STYLES ---------------- */

const fieldBase = {
  padding: "10px 12px",
  borderRadius: "8px",
  marginTop: "10px",
  border: "1px solid #ddd",
  fontSize: "14px",
};

const fullWidth = { ...fieldBase, width: "80%" };
const mediumWidth = { ...fieldBase, width: "60%" };

// Buttons replaced with shared Button component from src/components/ui

export default AddQuestionPage;