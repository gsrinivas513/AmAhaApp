import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "../components/ui";

function ViewQuestionsPage() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subtopics, setSubtopicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFeature, setFilterFeature] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubtopic, setFilterSubtopic] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" or "desc"

  const navigate = useNavigate();

  /* ---------- LOAD QUESTIONS ---------- */
  const load = async () => {
    setLoading(true);
    
    // Load all collections
    const [questionsSnap, featuresSnap, categoriesSnap, subtopicsSnap] = await Promise.all([
      getDocs(collection(db, "questions")),
      getDocs(collection(db, "features")),
      getDocs(collection(db, "categories")),
      getDocs(collection(db, "subtopics"))
    ]);

    const featuresData = featuresSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const categoriesData = categoriesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const subtopicsData = subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    setFeatures(featuresData);
    setCategories(categoriesData);
    setSubtopicies(subtopicsData);
    
    const questionsData = questionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    
    // Debug: Log first question to see actual database structure
    if (questionsData.length > 0) {
      console.log("First question from Firestore:", {
        feature: questionsData[0].feature,
        category: questionsData[0].category,
        subtopic: questionsData[0].subtopic,
        topic: questionsData[0].topic,
        featureId: questionsData[0].featureId,
        subtopicId: questionsData[0].subtopicId,
        question: questionsData[0].question?.substring(0, 30) + "..."
      });
    }
    
    setList(questionsData);
    setLoading(false);
  };

  // Helper functions to get names from IDs or names (backward compatible)
  const getFeatureName = (featureIdOrName) => {
    if (!featureIdOrName) return "-";
    
    // Try to find by ID first
    let feature = features.find(f => f.id === featureIdOrName);
    
    // If not found, try to find by name
    if (!feature) {
      feature = features.find(f => 
        (f.name && f.name.toLowerCase() === featureIdOrName.toLowerCase()) || 
        (f.label && f.label.toLowerCase() === featureIdOrName.toLowerCase())
      );
    }
    
    // Debug logging
    if (!feature && featureIdOrName !== "-") {
      console.log("Feature not found:", featureIdOrName, "Available:", features.map(f => ({ id: f.id, name: f.name })));
    }
    
    return feature?.name || feature?.label || featureIdOrName;
  };

  const getCategoryName = (categoryIdOrName) => {
    if (!categoryIdOrName) return "-";
    
    // Try to find by ID first
    let category = categories.find(c => c.id === categoryIdOrName);
    
    // If not found, try to find by name
    if (!category) {
      category = categories.find(c => 
        (c.name && c.name.toLowerCase() === categoryIdOrName.toLowerCase()) || 
        (c.label && c.label.toLowerCase() === categoryIdOrName.toLowerCase())
      );
    }
    
    // Debug logging
    if (!category && categoryIdOrName !== "-") {
      console.log("Category not found:", categoryIdOrName, "Available:", categories.map(c => ({ id: c.id, name: c.name })));
    }
    
    return category?.name || category?.label || categoryIdOrName;
  };

  const getSubTopicName = (subtopicIdOrName) => {
    if (!subtopicIdOrName) return "-";
    
    // Try to find by ID first
    let subtopic = subtopics.find(s => s.id === subtopicIdOrName);
    
    // If not found, try to find by name
    if (!subtopic) {
      subtopic = subtopics.find(s => 
        (s.name && s.name.toLowerCase() === subtopicIdOrName.toLowerCase()) || 
        (s.label && s.label.toLowerCase() === subtopicIdOrName.toLowerCase())
      );
    }
    
    // Debug logging
    if (!subtopic && subtopicIdOrName !== "-") {
      console.log("SubTopic not found:", subtopicIdOrName, "Available:", subtopics.map(s => ({ id: s.id, name: s.name })));
    }
    
    return subtopic?.name || subtopic?.label || subtopicIdOrName;
  };

  const getTopicName = (question) => {
    // First check if question has a direct topic field
    if (question?.topic) return question.topic;
    
    // Otherwise, try to get topic from subtopic
    const subtopicIdOrName = question?.subtopic || question?.subtopicId;
    if (!subtopicIdOrName) return "-";
    
    // Try to find subtopic by ID first
    let subtopic = subtopics.find(s => s.id === subtopicIdOrName);
    
    // If not found, try to find by name
    if (!subtopic) {
      subtopic = subtopics.find(s => 
        (s.name && s.name.toLowerCase() === subtopicIdOrName.toLowerCase()) || 
        (s.label && s.label.toLowerCase() === subtopicIdOrName.toLowerCase())
      );
    }
    
    return subtopic?.topic || "-";
  };

  useEffect(() => {
    load();
  }, []);

  /* ---------- SINGLE DELETE ---------- */
  const remove = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    
    // Get the question data before deleting
    const questionToDelete = list.find(q => q.id === id);
    
    await deleteDoc(doc(db, "questions", id));
    
    // Update counts and check if category/subtopic should be unpublished
    await updateCountsAfterDelete([questionToDelete]);
    
    load();
  };

  /* ---------- BULK DELETE ---------- */
  const handleBulkDelete = async () => {
    if (!window.confirm("Delete selected questions?")) return;

    // Get questions being deleted
    const questionsToDelete = list.filter(q => selectedIds.includes(q.id));

    for (const id of selectedIds) {
      await deleteDoc(doc(db, "questions", id));
    }

    // Update counts and check if categories/subtopics should be unpublished
    await updateCountsAfterDelete(questionsToDelete);

    setSelectedIds([]);
    load();
  };

  /* ---------- UPDATE COUNTS AFTER DELETE ---------- */
  const updateCountsAfterDelete = async (deletedQuestions) => {
    const { updateDoc: updateDocFn, doc: docFn, query: queryFn, where: whereFn, getDocs: getDocsFn, getDoc: getDocFn } = await import("firebase/firestore");
    
    // Track affected categories and subtopics
    const affectedCategories = new Set();
    const affectedSubtopicies = new Set();
    
    deletedQuestions.forEach(q => {
      if (q.category) affectedCategories.add(q.category);
      if (q.subtopicId) affectedSubtopicies.add(q.subtopicId);
    });
    
    // Update category counts and unpublish if no questions remain
    for (const categoryIdOrName of affectedCategories) {
      // Find the actual category document ID
      let categoryId = categoryIdOrName;
      const categoryDoc = categories.find(c => c.id === categoryIdOrName);
      
      // If not found by ID, try to find by name
      if (!categoryDoc) {
        const categoryByName = categories.find(c => 
          (c.name && c.name.toLowerCase() === categoryIdOrName.toLowerCase()) || 
          (c.label && c.label.toLowerCase() === categoryIdOrName.toLowerCase())
        );
        if (categoryByName) {
          categoryId = categoryByName.id;
        } else {
          console.warn(`⚠️ Category not found: ${categoryIdOrName}, skipping update`);
          continue;
        }
      }
      
      // Verify the document exists before updating
      const docRef = docFn(db, "categories", categoryId);
      const docSnap = await getDocFn(docRef);
      
      if (!docSnap.exists()) {
        console.warn(`⚠️ Category document does not exist: ${categoryId}, skipping update`);
        continue;
      }
      
      const questionsQuery = queryFn(
        collection(db, "questions"),
        whereFn("category", "==", categoryIdOrName)
      );
      const questionsSnap = await getDocsFn(questionsQuery);
      const newCount = questionsSnap.size;
      
      const updateData = { quizCount: newCount };
      
      // If no questions remain, unpublish the category
      if (newCount === 0) {
        updateData.isPublished = false;
        console.log(`📦 Unpublished category ${categoryId} - no questions remaining`);
      }
      
      await updateDocFn(docRef, updateData);
    }
    
    // Update subtopic counts and unpublish if no questions remain
    for (const subtopicId of affectedSubtopicies) {
      // Verify the document exists before updating
      const docRef = docFn(db, "subtopics", subtopicId);
      const docSnap = await getDocFn(docRef);
      
      if (!docSnap.exists()) {
        console.warn(`⚠️ Subtopic document does not exist: ${subtopicId}, skipping update`);
        continue;
      }
      
      const questionsQuery = queryFn(
        collection(db, "questions"),
        whereFn("subtopicId", "==", subtopicId)
      );
      const questionsSnap = await getDocsFn(questionsQuery);
      const newCount = questionsSnap.size;
      
      const updateData = { quizCount: newCount };
      
      // If no questions remain, unpublish the subtopic
      if (newCount === 0) {
        updateData.published = false;
        updateData.isPublished = false;
        console.log(`📦 Unpublished subtopic ${subtopicId} - no questions remaining`);
      }
      
      await updateDocFn(docRef, updateData);
    }
  };

  /* ---------- FILTERED LIST ---------- */
  const filteredList = list.filter((q) => {
    // Search filter
    const matchesSearch = searchTerm === "" || 
      q.question?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.correctAnswer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Feature filter
    const matchesFeature = filterFeature === "" || q.feature === filterFeature;
    
    // Category filter
    const matchesCategory = filterCategory === "" || q.category === filterCategory;
    
    // Subtopic filter
    const matchesSubtopic = filterSubtopic === "" || q.subtopic === filterSubtopic || q.subtopicId === filterSubtopic;
    
    // Difficulty filter
    const matchesDifficulty = filterDifficulty === "" || q.difficulty === filterDifficulty;
    
    return matchesSearch && matchesFeature && matchesCategory && matchesSubtopic && matchesDifficulty;
  });

  /* ---------- SORTING ---------- */
  const sortedList = [...filteredList].sort((a, b) => {
    if (!sortColumn) return 0;

    let aVal, bVal;

    switch (sortColumn) {
      case "feature":
        aVal = getFeatureName(a.feature);
        bVal = getFeatureName(b.feature);
        break;
      case "category":
        aVal = getCategoryName(a.category);
        bVal = getCategoryName(b.category);
        break;
      case "topic":
        aVal = getTopicName(a);
        bVal = getTopicName(b);
        break;
      case "subtopic":
        aVal = getSubTopicName(a.subtopic);
        bVal = getSubTopicName(b.subtopic);
        break;
      case "question":
        aVal = a.question || "";
        bVal = b.question || "";
        break;
      case "correctAnswer":
        aVal = a.correctAnswer || "";
        bVal = b.correctAnswer || "";
        break;
      case "difficulty":
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        aVal = difficultyOrder[a.difficulty] || 0;
        bVal = difficultyOrder[b.difficulty] || 0;
        break;
      default:
        return 0;
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  /* ---------- SORTING HANDLER ---------- */
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  /* ---------- SORT INDICATOR ---------- */
  const SortIndicator = ({ column }) => {
    if (sortColumn !== column) {
      return <span style={{ opacity: 0.3, marginLeft: "4px" }}>↕</span>;
    }
    return (
      <span style={{ marginLeft: "4px", fontWeight: "bold" }}>
        {sortDirection === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  /* ---------- STATS ---------- */
  const stats = {
    total: list.length,
    filtered: sortedList.length,
    easy: list.filter(q => q.difficulty === "easy").length,
    medium: list.filter(q => q.difficulty === "medium").length,
    hard: list.filter(q => q.difficulty === "hard").length,
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, marginBottom: 8 }}>All Questions</h2>
          <div style={{ display: "flex", gap: 12, fontSize: "13px", color: "#64748b" }}>
            <span><strong>{stats.total}</strong> Total</span>
            <span>•</span>
            <span style={{ color: "#16a34a" }}><strong>{stats.easy}</strong> Easy</span>
            <span style={{ color: "#d97706" }}><strong>{stats.medium}</strong> Medium</span>
            <span style={{ color: "#dc2626" }}><strong>{stats.hard}</strong> Hard</span>
          </div>
        </div>
        {selectedIds.length > 0 && (
          <Button variant="danger" size="sm" onClick={handleBulkDelete}>
            Delete Selected ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="🔍 Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: "1 1 300px",
              padding: "10px 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none"
            }}
          />
          
          <select
            value={filterFeature}
            onChange={(e) => setFilterFeature(e.target.value)}
            style={{
              padding: "10px 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="">All Features</option>
            {features.map(f => (
              <option key={f.id} value={f.id}>{f.name || f.label}</option>
            ))}
          </select>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: "10px 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name || c.label}</option>
            ))}
          </select>
          
          <select
            value={filterSubtopic}
            onChange={(e) => setFilterSubtopic(e.target.value)}
            style={{
              padding: "10px 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="">All Subtopics</option>
            {subtopics.map(s => (
              <option key={s.id} value={s.id}>{s.name || s.label}</option>
            ))}
          </select>
          
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            style={{
              padding: "10px 14px",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              minWidth: "130px"
            }}
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          
          {(searchTerm || filterFeature || filterCategory || filterSubtopic || filterDifficulty) && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setFilterFeature("");
                setFilterCategory("");
                setFilterSubtopic("");
                setFilterDifficulty("");
              }}
            >
              Clear Filters
            </Button>
          )}
          
          <div style={{ marginLeft: "auto", fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
            Showing {stats.filtered} of {stats.total} questions
          </div>
        </div>
      </Card>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Card>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: "1400px", fontSize: "13px" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                <th style={{ padding: "12px 8px", textAlign: "left", width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={
                      sortedList.length > 0 &&
                      selectedIds.length === sortedList.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? sortedList.map((q) => q.id) : []
                      )
                    }
                  />
                </th>
                <th 
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "left", 
                    width: "120px",
                    cursor: "pointer",
                    userSelect: "none",
                    background: sortColumn === "feature" ? "#e0f2fe" : "transparent"
                  }}
                  onClick={() => handleSort("feature")}
                >
                  Feature <SortIndicator column="feature" />
                </th>
                <th 
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "left", 
                    width: "120px",
                    cursor: "pointer",
                    userSelect: "none",
                    background: sortColumn === "category" ? "#e0f2fe" : "transparent"
                  }}
                  onClick={() => handleSort("category")}
                >
                  Category <SortIndicator column="category" />
                </th>
                <th 
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "left", 
                    width: "100px",
                    cursor: "pointer",
                    userSelect: "none",
                    background: sortColumn === "topic" ? "#e0f2fe" : "transparent"
                  }}
                  onClick={() => handleSort("topic")}
                >
                  Topic <SortIndicator column="topic" />
                </th>
                <th 
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "left", 
                    width: "120px",
                    cursor: "pointer",
                    userSelect: "none",
                    background: sortColumn === "subtopic" ? "#e0f2fe" : "transparent"
                  }}
                  onClick={() => handleSort("subtopic")}
                >
                  SubTopic <SortIndicator column="subtopic" />
                </th>
                <th 
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "left", 
                    minWidth: "200px",
                    cursor: "pointer",
                    userSelect: "none",
                    background: sortColumn === "question" ? "#e0f2fe" : "transparent"
                  }}
                  onClick={() => handleSort("question")}
                >
                  Question <SortIndicator column="question" />
                </th>
                <th style={{ padding: "12px 8px", textAlign: "left", minWidth: "250px" }}>Options</th>
                <th 
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "left", 
                    width: "150px",
                    cursor: "pointer",
                    userSelect: "none",
                    background: sortColumn === "correctAnswer" ? "#e0f2fe" : "transparent"
                  }}
                  onClick={() => handleSort("correctAnswer")}
                >
                  Correct Answer <SortIndicator column="correctAnswer" />
                </th>
                <th 
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "left", 
                    width: "90px",
                    cursor: "pointer",
                    userSelect: "none",
                    background: sortColumn === "difficulty" ? "#e0f2fe" : "transparent"
                  }}
                  onClick={() => handleSort("difficulty")}
                >
                  Difficulty <SortIndicator column="difficulty" />
                </th>
                <th style={{ padding: "12px 8px", textAlign: "left", width: "180px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedList.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
                    {list.length === 0 ? "No questions found. Add your first question!" : "No questions match your filters."}
                  </td>
                </tr>
              ) : (
                sortedList.map((q) => (
                  <tr key={q.id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(q.id)}
                        onChange={(e) => {
                          setSelectedIds((prev) =>
                            e.target.checked
                              ? [...prev, q.id]
                              : prev.filter((id) => id !== q.id)
                          );
                        }}
                      />
                    </td>
                    <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                      <span style={{ 
                        fontSize: "12px", 
                        background: "#eff6ff", 
                        color: "#1e40af", 
                        padding: "3px 8px", 
                        borderRadius: "4px",
                        fontWeight: 600
                      }}>
                        {getFeatureName(q.feature)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                      <span style={{ fontSize: "12px", color: "#475569", fontWeight: 500 }}>
                        {getCategoryName(q.category)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                      <span style={{ 
                        fontSize: "11px", 
                        background: "#f0fdf4", 
                        color: "#15803d", 
                        padding: "2px 6px", 
                        borderRadius: "3px",
                        fontWeight: 500
                      }}>
                        {getTopicName(q)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                      <span style={{ fontSize: "12px", color: "#64748b" }}>
                        {getSubTopicName(q.subtopic)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                      <div style={{ 
                        maxWidth: "300px", 
                        whiteSpace: "normal", 
                        wordWrap: "break-word",
                        lineHeight: "1.5"
                      }}>
                        {q.question || "-"}
                      </div>
                    </td>
                    <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                      {q.options && q.options.length > 0 ? (
                        <div style={{ fontSize: "12px", lineHeight: "1.6" }}>
                          {q.options.map((opt, idx) => (
                            <div key={idx} style={{ 
                              marginBottom: "4px",
                              padding: "4px 8px",
                              background: opt === q.correctAnswer ? "#f0fdf4" : "#f8fafc",
                              border: opt === q.correctAnswer ? "1px solid #86efac" : "1px solid #e2e8f0",
                              borderRadius: "4px"
                            }}>
                              <strong>{String.fromCharCode(65 + idx)}:</strong> {opt}
                              {opt === q.correctAnswer && (
                                <span style={{ marginLeft: "6px", color: "#16a34a", fontWeight: 600 }}>✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "12px" }}>No options</span>
                      )}
                    </td>
                    <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                      <div style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#16a34a",
                        background: "#f0fdf4",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        border: "1px solid #86efac",
                        maxWidth: "200px",
                        whiteSpace: "normal",
                        wordWrap: "break-word"
                      }}>
                        {q.correctAnswer || "-"}
                      </div>
                    </td>
                    <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                      <span style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        background: 
                          q.difficulty === "easy" ? "#dcfce7" : 
                          q.difficulty === "medium" ? "#fef3c7" : 
                          q.difficulty === "hard" ? "#fee2e2" : "#f1f5f9",
                        color: 
                          q.difficulty === "easy" ? "#166534" : 
                          q.difficulty === "medium" ? "#92400e" : 
                          q.difficulty === "hard" ? "#991b1b" : "#475569"
                      }}>
                        {q.difficulty || "N/A"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 8px", verticalAlign: "top" }}>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <Button size="sm" onClick={() => navigate(`/admin/edit-question/${q.id}`)}>
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => remove(q.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </Card>
      )}
    </AdminLayout>
  );
}

// replaced inline btn styles with shared Button component

export default ViewQuestionsPage;