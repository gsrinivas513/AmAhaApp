import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { addDoc, collection, getDocs, query, where, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Card, Button } from "../components/ui";
import QuestionsTable from "./components/QuestionsTable";

function AddQuestionPage() {
  const location = useLocation();
  const preselectedData = location.state || {};
  
  /* ---------------- CATEGORIES FROM FIREBASE ---------------- */
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
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

      // Load topics
      const topicsSnap = await getDocs(collection(db, "topics"));
      const topicsData = topicsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTopics(topicsData);

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
            topic: "",
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
    topic: "",
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
    const hasBasicFields = form.feature && form.category && form.topic && form.subtopic;
    
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
      if (!form.topic) errorMsg += "- Select Topic\n";
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
      // --- Helper: update puzzle counts for subtopic, topic, category ---
      async function updatePuzzleCounts({ subtopicId, topicId, categoryId }) {
        try {
          // Subtopic
          if (subtopicId) {
            const snap = await getDocs(query(collection(db, "puzzles"), where("subtopicId", "==", subtopicId)));
            await updateDoc(doc(db, "subtopics", subtopicId), { puzzleCount: snap.size });
          }
          // Topic
          if (topicId) {
            const snap = await getDocs(query(collection(db, "puzzles"), where("topicId", "==", topicId)));
            await updateDoc(doc(db, "topics", topicId), { puzzleCount: snap.size });
          }
          // Category
          if (categoryId) {
            const snap = await getDocs(query(collection(db, "puzzles"), where("categoryId", "==", categoryId)));
            await updateDoc(doc(db, "categories", categoryId), { puzzleCount: snap.size });
          }
        } catch (err) {
          console.error("Failed to update puzzle counts:", err);
        }
      }

      let dataToSave;
      let collectionName = "questions";
      if (featureType === "puzzle") {
        // Save as a puzzle
        collectionName = "puzzles";
        dataToSave = {
          title: form.question,
          description: form.description || "",
          imageUrl: form.imageUrl || "",
          type: form.type || "",
          feature: form.feature,
          featureId: form.feature,
          category: form.category,
          categoryId: form.category,
          topic: form.topic,
          topicId: form.topic,
          subtopic: form.subtopic,
          subtopicId: form.subtopic,
          difficulty: form.difficulty,
          createdAt: new Date(),
        };
        if (form.correctAnswer) dataToSave.correctAnswer = form.correctAnswer;
        const docRef = await addDoc(collection(db, collectionName), dataToSave);
        await updatePuzzleCounts({
          subtopicId: form.subtopic,
          topicId: form.topic,
          categoryId: form.category,
        });
      } else {
        // Save as a quiz or other content
        dataToSave = {
          feature: form.feature,
          category: form.category,
          topic: form.topic,
          subtopic: form.subtopic,
          difficulty: form.difficulty,
          createdAt: new Date(),
          featureType: featureType
        };
        if (featureType === "quiz") {
          dataToSave.question = form.question;
          dataToSave.options = form.options;
          dataToSave.correctAnswer = form.correctAnswer;
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
        await addDoc(collection(db, collectionName), dataToSave);
      }

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
        topic: "",
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

  // --- UNIFIED BULK IMPORT ---
  const saveImported = async () => {
    setImporting(true);
    try {
      let saved = 0;
      let skipped = 0;
      // Load all existing hierarchy
      const [featuresSnap, categoriesSnap, topicsSnap, subtopicsSnap, questionsSnap] = await Promise.all([
        getDocs(collection(db, "features")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "topics")),
        getDocs(collection(db, "subtopics")),
        getDocs(collection(db, "questions")),
      ]);
      const existingFeatures = featuresSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const existingCategories = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const existingTopics = topicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const existingSubtopics = subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const existingQuestions = new Set(questionsSnap.docs.map(d => d.data().question?.toLowerCase().trim()));
      // Helper: Get or create Feature
      const getOrCreateFeature = async (featureName) => {
        if (!featureName) return null;
        const nameLower = featureName.toLowerCase();
        let existing = existingFeatures.find(f => (f.name && f.name.toLowerCase() === nameLower) || (f.label && f.label.toLowerCase() === nameLower));
        if (existing) return existing.id;
        const newFeature = { name: featureName, label: featureName, type: nameLower, icon: "📝", createdAt: serverTimestamp() };
        const docRef = await addDoc(collection(db, "features"), newFeature);
        existingFeatures.push({ id: docRef.id, ...newFeature });
        return docRef.id;
      };
      // Helper: Get or create Category
      const getOrCreateCategory = async (categoryName, featureId) => {
        if (!categoryName) return null;
        const nameLower = categoryName.toLowerCase();
        let existing = existingCategories.find(c => ((c.name && c.name.toLowerCase() === nameLower) || (c.label && c.label.toLowerCase() === nameLower) || c.id === nameLower));
        if (existing) return existing.id;
        const categoryId = nameLower;
        const newCategory = { name: categoryName, label: categoryName, featureId: featureId || null, published: true, createdAt: serverTimestamp() };
        await setDoc(doc(db, "categories", categoryId), newCategory);
        existingCategories.push({ id: categoryId, ...newCategory });
        return categoryId;
      };
      // Helper: Get or create Topic
      const getOrCreateTopic = async (topicName, categoryId) => {
        if (!topicName) return null;
        let existing = existingTopics.find(t => t.categoryId === categoryId && ((t.name && t.name.toLowerCase() === topicName.toLowerCase()) || (t.label && t.label.toLowerCase() === topicName.toLowerCase())));
        if (existing) return existing.id;
        const newTopic = { name: topicName, label: topicName, categoryId, isPublished: true, sortOrder: 0, createdAt: serverTimestamp() };
        const docRef = await addDoc(collection(db, "topics"), newTopic);
        existingTopics.push({ id: docRef.id, ...newTopic });
        return docRef.id;
      };
      // Helper: Get or create Subtopic
      const getOrCreateSubtopic = async (subtopicName, categoryId, featureId, topicId) => {
        if (!subtopicName) return null;
        let existing = existingSubtopics.find(s => s.categoryId === categoryId && ((s.name && s.name.toLowerCase() === subtopicName.toLowerCase()) || (s.label && s.label.toLowerCase() === subtopicName.toLowerCase())));
        if (existing) return existing.id;
        const newSubtopic = { name: subtopicName, label: subtopicName, categoryId, featureId: featureId || null, topicId: topicId || null, published: true, createdAt: serverTimestamp() };
        const docRef = await addDoc(collection(db, "subtopics"), newSubtopic);
        existingSubtopics.push({ id: docRef.id, ...newSubtopic });
        return docRef.id;
      };
      // --- Main Bulk Import Loop ---
      const subtopicIdsUpdated = new Set();
      const topicIdsUpdated = new Set();
      for (const q of importedQuestions) {
        try {
          // Hierarchy creation
          const featureId = await getOrCreateFeature(q.feature || "Quiz");
          const categoryId = await getOrCreateCategory(q.category || "General", featureId);
          const topicId = await getOrCreateTopic(q.topic || "General", categoryId);
          const subtopicId = await getOrCreateSubtopic(q.subtopic || "General", categoryId, featureId, topicId);
          // Prepare quiz or puzzle data
          let docData = {
            feature: q.feature,
            category: categoryId,
            topic: topicId,
            subtopic: subtopicId,
            featureId,
            categoryId,
            topicId,
            subtopicId,
            createdAt: new Date(),
          };
          if (q.question) {
            // Quiz
            docData = {
              ...docData,
              question: q.question,
              options: [q.optionA, q.optionB, q.optionC, q.optionD],
              correctAnswer: q.correctAnswer,
              difficulty: q.difficulty || "easy",
            };
            // Check for duplicate
            if (existingQuestions.has(q.question.toLowerCase().trim())) {
              skipped++;
              continue;
            }
            await addDoc(collection(db, "questions"), docData);
          } else if (q.title) {
            // Puzzle
            docData = {
              ...docData,
              title: q.title,
              description: q.description,
              imageUrl: q.imageUrl,
              type: q.type,
              data: {},
            };
            if (q.type === "matching" && q.pairs) docData.data.pairs = q.pairs;
            if (q.type === "ordering" && q.items) docData.data.items = q.items;
            if (q.type === "drag") {
              if (q.draggables) docData.data.draggables = q.draggables;
              if (q.targets) docData.data.targets = q.targets;
            }
            await addDoc(collection(db, "puzzles"), docData);
          } else {
            skipped++;
            continue;
          }
          saved++;
          subtopicIdsUpdated.add(subtopicId);
          topicIdsUpdated.add(topicId);
        } catch {
          skipped++;
        }
      }
      // --- Update counts for subtopics and topics ---
      for (const subtopicId of subtopicIdsUpdated) {
        // Quiz count
        const quizSnap = await getDocs(query(collection(db, "questions"), where("subtopicId", "==", subtopicId)));
        // Puzzle count
        const puzzleSnap = await getDocs(query(collection(db, "puzzles"), where("subtopicId", "==", subtopicId)));
        await updateDoc(doc(db, "subtopics", subtopicId), { quizCount: quizSnap.size, puzzleCount: puzzleSnap.size });
      }
      for (const topicId of topicIdsUpdated) {
        const quizSnap = await getDocs(query(collection(db, "questions"), where("topicId", "==", topicId)));
        const puzzleSnap = await getDocs(query(collection(db, "puzzles"), where("topicId", "==", topicId)));
        await updateDoc(doc(db, "topics", topicId), { quizCount: quizSnap.size, puzzleCount: puzzleSnap.size });
      }
      alert(`Bulk import complete! Saved: ${saved}, Skipped: ${skipped}`);
      setImportedQuestions([]);
    } catch (err) {
      alert("Bulk import failed");
    }
    setImporting(false);
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
              topic: "",
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

        {/* Topic Dropdown */}
        <select
          style={mediumWidth}
          value={form.topic}
          onChange={e => {
            setForm({
              ...form,
              topic: e.target.value,
              subtopic: ""
            });
          }}
          disabled={!form.category}
        >
          <option value="">Select Topic</option>
          {topics.filter(t => t.categoryId === form.category).map(t => (
            <option key={t.id} value={t.id}>{t.label || t.name}</option>
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
          disabled={!form.topic || preselectedData.preselectedSubtopic}
          title={preselectedData.preselectedSubtopic ? `🔒 Pre-selected: ${preselectedData.subtopicName || ''}` : ""}
        >
          <option value="">Select SubTopic</option>
          {subtopics
            .filter(sub => sub.categoryId === form.category && sub.topicId === form.topic)
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

      <hr style={{ margin: "40px 0" }} />

      <h2 style={{ marginBottom: 20 }}>📋 View & Manage Questions</h2>
      <p style={{ color: "#64748b", marginBottom: 16, fontSize: 14 }}>
        View all quiz questions, filter by feature/category/difficulty, sort, and manage deletions below.
      </p>
      <QuestionsTable />
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