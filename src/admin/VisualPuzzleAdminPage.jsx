// src/admin/VisualPuzzleAdminPage.jsx
// Admin page for creating and managing visual puzzles
import React, { useState, useRef } from "react";
import AdminLayout from "./AdminLayout";
import { useSearchParams } from "react-router-dom";
import {
  createVisualPuzzle,
  updateVisualPuzzle,
  VISUAL_PUZZLE_TYPES,
  DIFFICULTY_LEVELS,
  AGE_GROUPS,
} from "../quiz/services/visualPuzzleService";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import PictureWordEditor from "./puzzle-editors/PictureWordEditor";
import SpotDifferenceEditor from "./puzzle-editors/SpotDifferenceEditor";
import FindPairEditor from "./puzzle-editors/FindPairEditor";
import PictureShadowEditor from "./puzzle-editors/PictureShadowEditor";
import OrderingEditor from "./puzzle-editors/OrderingEditor";
import "./styles/puzzle-admin.css";

const defaultPuzzle = {
  title: "",
  description: "",
  type: "picture-word",
  difficulty: "easy",
  ageGroup: "6-8",
  categoryId: "",
  categoryName: "",
  topicId: "",
  topicName: "",
  subtopicId: "",
  subtopicName: "",
  xpReward: 10,
  isPublished: false,
  data: {},
};

const PUZZLE_TYPE_DETAILS = {
  "picture-word": {
    title: "🖼️ Create Picture-Word Puzzle",
    description: "Show images and ask kids to match or identify words",
    icon: "🖼️",
    defaultCategory: "Logic Puzzles"
  },
  "find-pair": {
    title: "🔍 Create Find Pair Puzzle",
    description: "Kids match identical pairs from shuffled items",
    icon: "🔍",
    defaultCategory: "Logic Puzzles"
  },
  "spot-difference": {
    title: "🔎 Create Spot Difference Puzzle",
    description: "Find and click on differences between two images",
    icon: "🔎",
    defaultCategory: "Logic Puzzles"
  },
  "picture-shadow": {
    title: "🌙 Create Picture Shadow Puzzle",
    description: "Match shadows to their corresponding pictures",
    icon: "🌙",
    defaultCategory: "Logic Puzzles"
  },
  "ordering": {
    title: "🔢 Create Sequence/Ordering Puzzle",
    description: "Kids arrange items (numbers, days, months, sizes, etc.) in correct order",
    icon: "🔢",
    defaultCategory: "Logic Puzzles"
  }
};

function VisualPuzzleAdminPage({ puzzleId: propPuzzleId }) {
  const [searchParams] = useSearchParams();
  const puzzleId = propPuzzleId || searchParams.get("id");
  const typeFromUrl = searchParams.get("type"); // Get type from URL
  const [puzzle, setPuzzle] = useState(defaultPuzzle);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [features, setFeatures] = useState([]);
  const editorRef = useRef();

  React.useEffect(() => {
    loadCategoriesAndFeatures();
  }, []);

  // Handle prepopulation from query params (when coming from SubTopicsList)
  React.useEffect(() => {
    const subtopicId = searchParams.get("subtopicId");
    const subtopicName = searchParams.get("subtopicName");
    const topicId = searchParams.get("topicId");
    const categoryId = searchParams.get("categoryId");
    const puzzleType = searchParams.get("type");

    if (subtopicId && categories.length > 0) {
      setPuzzle(prev => ({
        ...prev,
        subtopicId,
        subtopicName,
        topicId,
        categoryId,
        type: puzzleType || prev.type
      }));
    } else if (puzzleType && categories.length > 0) {
      // If only type is provided (no subtopic), auto-select category
      const defaultCategoryName = PUZZLE_TYPE_DETAILS[puzzleType]?.defaultCategory;
      const matchingCategory = categories.find(cat => cat.name === defaultCategoryName);
      
      setPuzzle(prev => ({
        ...prev,
        type: puzzleType,
        categoryId: matchingCategory?.id || "",
        categoryName: matchingCategory?.name || ""
      }));
    }
  }, [categories, searchParams]);

  React.useEffect(() => {
    if (categories.length > 0 && puzzleId) {
      loadExistingPuzzle(puzzleId);
    }
  }, [puzzleId, categories]);

  React.useEffect(() => {
    if (puzzle.categoryId) {
      loadTopics(puzzle.categoryId);
    }
  }, [puzzle.categoryId]);

  React.useEffect(() => {
    if (puzzle.topicId) {
      loadSubtopics(puzzle.topicId);
    }
  }, [puzzle.topicId]);

  const loadCategoriesAndFeatures = async () => {
    try {
      console.log("Loading categories...");
      
      // Load all categories (simpler approach)
      const snapshot = await getDocs(collection(db, "categories"));
      const catsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      console.log("Categories loaded:", catsData.length, catsData);
      setCategories(catsData);
      
      // Also load features for reference
      const featuresSnap = await getDocs(collection(db, "features"));
      const featuresData = featuresSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeatures(featuresData);
    } catch (err) {
      console.error("Error loading categories and features:", err);
      setError("Failed to load categories: " + err.message);
    }
  };

  const loadExistingPuzzle = async (pId) => {
    try {
      setLoading(true);
      console.log("Loading puzzle with ID:", pId);
      
      // First, try to load by document ID
      let docSnap = await getDoc(doc(db, "puzzles", pId));
      
      // If not found by ID, try to find by subtopicId
      if (!docSnap.exists()) {
        console.log("Not found by ID, searching by subtopicId...");
        const q = query(
          collection(db, "puzzles"),
          where("subtopicId", "==", pId)
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.docs.length > 0) {
          docSnap = snapshot.docs[0];
        }
      }
      
      if (docSnap && docSnap.exists()) {
        const data = docSnap.data();
        console.log("✅ Puzzle loaded:", data);
        
        const puzzleData = {
          ...defaultPuzzle,
          ...data,
          id: docSnap.id
        };
        
        setPuzzle(puzzleData);
        
        // Load topics for this category
        if (data.categoryId) {
          await loadTopics(data.categoryId);
          
          // Load subtopics for this topic
          if (data.topicId) {
            await loadSubtopics(data.topicId);
          }
        }
      } else {
        console.log("❌ Puzzle not found with ID:", pId);
        setError("Puzzle not found. Make sure the ID is correct.");
      }
    } catch (err) {
      console.error("Error loading puzzle:", err);
      setError("Failed to load puzzle: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTopics = async (categoryId) => {
    try {
      const q = query(
        collection(db, "topics"),
        where("categoryId", "==", categoryId)
      );
      const snapshot = await getDocs(q);
      setTopics(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error("Error loading topics:", err);
    }
  };

  const loadSubtopics = async (topicId) => {
    try {
      const q = query(
        collection(db, "subtopics"),
        where("topicId", "==", topicId)
      );
      const snapshot = await getDocs(q);
      setSubtopics(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    } catch (err) {
      console.error("Error loading subtopics:", err);
    }
  };

  const handleBasicChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(`🔄 Form change: ${name} = ${value}`);
    setPuzzle((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePuzzleTypeChange = (typeValue) => {
    console.log(`🎯 Setting puzzle type to: ${typeValue}`);
    setPuzzle((prev) => ({
      ...prev,
      type: typeValue,
    }));
  };

  const handleHierarchyChange = (e) => {
    const { name, value } = e.target;

    if (name === "categoryId") {
      const category = categories.find((c) => c.id === value);
      setPuzzle((prev) => ({
        ...prev,
        categoryId: value,
        categoryName: category?.name || "",
        topicId: "",
        topicName: "",
        subtopicId: "",
        subtopicName: "",
      }));
    } else if (name === "topicId") {
      const topic = topics.find((t) => t.id === value);
      setPuzzle((prev) => ({
        ...prev,
        topicId: value,
        topicName: topic?.name || "",
        subtopicId: "",
        subtopicName: "",
      }));
    } else if (name === "subtopicId") {
      const subtopic = subtopics.find((s) => s.id === value);
      setPuzzle((prev) => ({
        ...prev,
        subtopicId: value,
        subtopicName: subtopic?.name || "",
      }));
    }
  };

  const handleDataChange = (newData) => {
    setPuzzle((prev) => ({
      ...prev,
      data: newData,
    }));
  };

  const renderEditor = () => {
    switch (puzzle.type) {
      case "picture-word":
        return (
          <PictureWordEditor
            ref={editorRef}
            data={puzzle.data}
            onChange={handleDataChange}
          />
        );
      case "spot-difference":
        return (
          <SpotDifferenceEditor
            ref={editorRef}
            data={puzzle.data}
            onChange={handleDataChange}
          />
        );
      case "find-pair":
        return (
          <FindPairEditor
            ref={editorRef}
            data={puzzle.data}
            onChange={handleDataChange}
          />
        );
      case "picture-shadow":
        return (
          <PictureShadowEditor
            ref={editorRef}
            data={puzzle.data}
            onChange={handleDataChange}
          />
        );
      case "ordering":
        return (
          <OrderingEditor
            ref={editorRef}
            data={puzzle.data}
            onChange={handleDataChange}
          />
        );
      default:
        return <div className="error">Unknown puzzle type</div>;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!puzzle.title.trim()) {
      setError("Please enter a puzzle title");
      return;
    }

    if (!puzzle.categoryId) {
      setError("Please select a category");
      return;
    }

    if (!puzzle.topicId) {
      setError("Please select a topic");
      return;
    }

    if (!puzzle.subtopicId) {
      setError("Please select a subtopic");
      return;
    }

    if (Object.keys(puzzle.data).length === 0) {
      setError("Please configure the puzzle content");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      console.log("💾 Saving puzzle:", puzzle);
      if (puzzle.id) {
        // Use puzzle.id from state (set when loading existing puzzle)
        console.log("Updating existing puzzle with ID:", puzzle.id);
        console.log("  - Type:", puzzle.type);
        console.log("  - Title:", puzzle.title);
        await updateVisualPuzzle(puzzle.id, puzzle);
      } else {
        // Create new puzzle
        console.log("Creating new puzzle");
        console.log("  - Type:", puzzle.type);
        await createVisualPuzzle(puzzle);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setPuzzle(defaultPuzzle);
    } catch (err) {
      setError(err.message || "Error saving puzzle");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="puzzle-admin-container">
        <div className="puzzle-admin-header">
          <h1>{PUZZLE_TYPE_DETAILS[puzzle.type]?.title || "🧩 Create Visual Puzzle"}</h1>
          <p>{PUZZLE_TYPE_DETAILS[puzzle.type]?.description || "Design interactive visual puzzles for kids"}</p>
        </div>

      <form onSubmit={handleSave} className="puzzle-admin-form">
        {/* Alerts */}
        {error && (
          <div className="alert alert-error" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            <strong>❌ Error:</strong> {error}
          </div>
        )}
        {success && <div className="alert alert-success">Puzzle saved! ✨</div>}

        {/* Basic Information */}
        <section className="form-section">
          <h2>Basic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="title">Puzzle Title *</label>
              <input
                id="title"
                type="text"
                name="title"
                value={puzzle.title}
                onChange={handleBasicChange}
                placeholder="e.g., Match Numbers 1-5"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={puzzle.description}
                onChange={handleBasicChange}
                placeholder="Brief description for kids"
                className="form-input"
                rows="3"
              />
            </div>
          </div>
        </section>

        {/* Type Selection - Only show if not coming from a specific type link AND not editing existing puzzle */}
        {!typeFromUrl && !puzzleId && (
          <section className="form-section">
            <h2>Puzzle Type</h2>
            <div className="puzzle-type-grid">
              {VISUAL_PUZZLE_TYPES.map((type) => (
                <label 
                  key={type.value} 
                  className="puzzle-type-option"
                  onClick={() => handlePuzzleTypeChange(type.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={puzzle.type === type.value}
                    onChange={handleBasicChange}
                  />
                  <div className="puzzle-type-card">
                    <span className="type-icon">{type.icon}</span>
                    <span className="type-label">{type.label}</span>
                    <span className="type-desc">{type.description}</span>
                  </div>
                </label>
              ))}
            </div>
          </section>
        )}

        {/* Hierarchy */}
        <section className="form-section">
          <h2>Puzzle Category & Topic</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="categoryId">Category *</label>
              <select
                id="categoryId"
                name="categoryId"
                value={puzzle.categoryId}
                onChange={handleHierarchyChange}
                className="form-input"
                disabled={categories.length === 0}
              >
                <option value="">
                  {categories.length === 0 ? "Loading categories..." : "Select Category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name || cat.label}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <small style={{ color: '#f97316', marginTop: '4px', display: 'block' }}>
                  Loading categories... if this takes too long, please refresh the page.
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="topicId">Topic *</label>
              <select
                id="topicId"
                name="topicId"
                value={puzzle.topicId}
                onChange={handleHierarchyChange}
                disabled={!puzzle.categoryId}
                className="form-input"
              >
                <option value="">Select Topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subtopicId">Subtopic *</label>
              <select
                id="subtopicId"
                name="subtopicId"
                value={puzzle.subtopicId}
                onChange={handleHierarchyChange}
                disabled={!puzzle.topicId}
                className="form-input"
              >
                <option value="">Select Subtopic</option>
                {subtopics.map((subtopic) => (
                  <option key={subtopic.id} value={subtopic.id}>
                    {subtopic.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Difficulty & Age */}
        <section className="form-section">
          <h2>Difficulty & Target Age</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                value={puzzle.difficulty}
                onChange={handleBasicChange}
                className="form-input"
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="ageGroup">Age Group</label>
              <select
                id="ageGroup"
                name="ageGroup"
                value={puzzle.ageGroup}
                onChange={handleBasicChange}
                className="form-input"
              >
                {AGE_GROUPS.map((group) => (
                  <option key={group} value={group}>
                    {group} years
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="xpReward">XP Reward</label>
              <input
                id="xpReward"
                type="number"
                name="xpReward"
                value={puzzle.xpReward}
                onChange={handleBasicChange}
                min="1"
                max="100"
                className="form-input"
              />
            </div>
          </div>
        </section>

        {/* Content Editor */}
        <section className="form-section">
          <h2>Puzzle Content</h2>
          <div className="editor-container">{renderEditor()}</div>
        </section>

        {/* Publish */}
        <section className="form-section">
          <label className="checkbox-group">
            <input
              type="checkbox"
              name="isPublished"
              checked={puzzle.isPublished}
              onChange={handleBasicChange}
            />
            <span>Publish this puzzle (make it visible to users)</span>
          </label>
        </section>

        {/* Save Button */}
        <div className="form-actions">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary btn-large"
          >
            {saving ? "Saving..." : "Save Puzzle"}
          </button>
        </div>
      </form>
    </div>
    </AdminLayout>
  );
}

export default VisualPuzzleAdminPage;
