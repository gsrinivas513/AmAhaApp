import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Button } from "../../components/ui";

function QuestionsTable() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFeature, setFilterFeature] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubtopic, setFilterSubtopic] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
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
      setSubtopics(subtopicsData);
      
      const questionsData = questionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setList(questionsData);
    } catch (err) {
      console.error("Failed to load questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFeatureName = (featureIdOrName) => {
    if (!featureIdOrName) return "-";
    let feature = features.find(f => f.id === featureIdOrName);
    if (!feature) {
      feature = features.find(f => 
        (f.name && f.name.toLowerCase() === featureIdOrName.toLowerCase()) || 
        (f.label && f.label.toLowerCase() === featureIdOrName.toLowerCase())
      );
    }
    return feature?.name || feature?.label || featureIdOrName;
  };

  const getCategoryName = (categoryIdOrName) => {
    if (!categoryIdOrName) return "-";
    let category = categories.find(c => c.id === categoryIdOrName);
    if (!category) {
      category = categories.find(c => 
        (c.name && c.name.toLowerCase() === categoryIdOrName.toLowerCase()) || 
        (c.label && c.label.toLowerCase() === categoryIdOrName.toLowerCase())
      );
    }
    return category?.name || category?.label || categoryIdOrName;
  };

  const getTopicName = (q) => {
    if (!q.topic) return "-";
    if (typeof q.topic === "string") return q.topic;
    return q.topicName || q.topic?.name || "-";
  };

  const getSubTopicName = (subtopicIdOrName) => {
    if (!subtopicIdOrName) return "-";
    let subtopic = subtopics.find(s => s.id === subtopicIdOrName);
    if (!subtopic) {
      subtopic = subtopics.find(s => 
        (s.name && s.name.toLowerCase() === subtopicIdOrName.toLowerCase()) || 
        (s.label && s.label.toLowerCase() === subtopicIdOrName.toLowerCase())
      );
    }
    return subtopic?.name || subtopic?.label || subtopicIdOrName;
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const SortIndicator = ({ column }) => {
    if (sortColumn !== column) return null;
    return <span style={{ marginLeft: "4px" }}>{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  const filteredList = list.filter((q) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      q.question?.toLowerCase().includes(searchLower) ||
      getFeatureName(q.feature).toLowerCase().includes(searchLower) ||
      getCategoryName(q.category).toLowerCase().includes(searchLower);

    const matchesFeature = !filterFeature || getFeatureName(q.feature) === filterFeature;
    const matchesDifficulty = !filterDifficulty || q.difficulty === filterDifficulty;
    const matchesCategory = !filterCategory || getCategoryName(q.category) === filterCategory;
    const matchesSubtopic = !filterSubtopic || getSubTopicName(q.subtopic) === filterSubtopic;

    return matchesSearch && matchesFeature && matchesDifficulty && matchesCategory && matchesSubtopic;
  });

  const sortedList = [...filteredList].sort((a, b) => {
    if (!sortColumn) return 0;

    let aVal = "";
    let bVal = "";

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
      case "difficulty":
        aVal = a.difficulty || "";
        bVal = b.difficulty || "";
        break;
      default:
        return 0;
    }

    return sortDirection === "asc" 
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const remove = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await deleteDoc(doc(db, "questions", id));
      setList((prev) => prev.filter((q) => q.id !== id));
      setSelectedIds((prev) => prev.filter((qid) => qid !== id));
    } catch (err) {
      alert("Failed to delete question");
      console.error(err);
    }
  };

  const removeMultiple = async () => {
    if (selectedIds.length === 0) {
      alert("Select questions to delete");
      return;
    }
    if (!window.confirm(`Delete ${selectedIds.length} question(s)?`)) return;
    
    try {
      for (const id of selectedIds) {
        await deleteDoc(doc(db, "questions", id));
      }
      setList((prev) => prev.filter((q) => !selectedIds.includes(q.id)));
      setSelectedIds([]);
    } catch (err) {
      alert("Failed to delete questions");
      console.error(err);
    }
  };

  const stats = {
    total: list.length,
    filtered: sortedList.length,
  };

  if (loading) return <p>Loading questions...</p>;

  return (
    <div>
      <style>{`
        .questions-table-container {
          margin-top: 24px;
        }
        .questions-filter-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        .questions-filter-input {
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
        }
      `}</style>

      <div className="questions-table-container">
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Filter & Search</h3>
          <div className="questions-filter-row">
            <input
              type="text"
              className="questions-filter-input"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="questions-filter-input"
              value={filterFeature}
              onChange={(e) => setFilterFeature(e.target.value)}
            >
              <option value="">All Features</option>
              {[...new Set(list.map(q => getFeatureName(q.feature)))].map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <select
              className="questions-filter-input"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {[...new Set(list.map(q => getCategoryName(q.category)))].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="questions-filter-input"
              value={filterSubtopic}
              onChange={(e) => setFilterSubtopic(e.target.value)}
            >
              <option value="">All SubTopics</option>
              {[...new Set(list.map(q => getSubTopicName(q.subtopic)))].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              className="questions-filter-input"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: 12,
          fontSize: 13,
          color: "#64748b"
        }}>
          <div>
            {selectedIds.length > 0 && (
              <Button variant="danger" size="sm" onClick={removeMultiple} style={{ marginRight: 12 }}>
                Delete {selectedIds.length} Selected
              </Button>
            )}
          </div>
          <div>
            Showing {stats.filtered} of {stats.total} questions
          </div>
        </div>

        <div style={{ overflowX: "auto", border: "1px solid #e2e8f0", borderRadius: 8 }}>
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
                    cursor: "pointer",
                    background: sortColumn === "feature" ? "#e0f2fe" : "transparent",
                    fontWeight: 600
                  }}
                  onClick={() => handleSort("feature")}
                >
                  Feature <SortIndicator column="feature" />
                </th>
                <th 
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "left",
                    cursor: "pointer",
                    background: sortColumn === "category" ? "#e0f2fe" : "transparent",
                    fontWeight: 600
                  }}
                  onClick={() => handleSort("category")}
                >
                  Category <SortIndicator column="category" />
                </th>
                <th 
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "left",
                    cursor: "pointer",
                    background: sortColumn === "subtopic" ? "#e0f2fe" : "transparent",
                    fontWeight: 600
                  }}
                  onClick={() => handleSort("subtopic")}
                >
                  SubTopic <SortIndicator column="subtopic" />
                </th>
                <th 
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "left",
                    minWidth: "250px",
                    cursor: "pointer",
                    background: sortColumn === "question" ? "#e0f2fe" : "transparent",
                    fontWeight: 600
                  }}
                  onClick={() => handleSort("question")}
                >
                  Question <SortIndicator column="question" />
                </th>
                <th style={{ padding: "12px 8px", textAlign: "left", minWidth: "200px", fontWeight: 600 }}>
                  Correct Answer
                </th>
                <th 
                  style={{ 
                    padding: "12px 8px", 
                    textAlign: "left",
                    cursor: "pointer",
                    background: sortColumn === "difficulty" ? "#e0f2fe" : "transparent",
                    fontWeight: 600
                  }}
                  onClick={() => handleSort("difficulty")}
                >
                  Difficulty <SortIndicator column="difficulty" />
                </th>
                <th style={{ padding: "12px 8px", textAlign: "left", fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedList.map((q) => (
                <tr key={q.id} style={{ borderBottom: "1px solid #e2e8f0", background: selectedIds.includes(q.id) ? "#f0fdf4" : "transparent" }}>
                  <td style={{ padding: "12px 8px" }}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(q.id)}
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked
                            ? [...selectedIds, q.id]
                            : selectedIds.filter((id) => id !== q.id)
                        )
                      }
                    />
                  </td>
                  <td style={{ padding: "12px 8px" }}>
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
                  <td style={{ padding: "12px 8px" }}>
                    <span style={{ fontSize: "12px", color: "#475569", fontWeight: 500 }}>
                      {getCategoryName(q.category)}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      {getSubTopicName(q.subtopic)}
                    </span>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ 
                      maxWidth: "300px", 
                      whiteSpace: "normal", 
                      wordWrap: "break-word",
                      lineHeight: "1.5"
                    }}>
                      {q.question || "-"}
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#16a34a",
                      background: "#f0fdf4",
                      padding: "6px 10px",
                      borderRadius: "4px",
                      border: "1px solid #86efac",
                      maxWidth: "180px",
                      whiteSpace: "normal",
                      wordWrap: "break-word"
                    }}>
                      {q.correctAnswer || "-"}
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px" }}>
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
                  <td style={{ padding: "12px 8px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <Button size="sm" onClick={() => window.location.href = `/admin/edit-question/${q.id}`}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => remove(q.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedList.length === 0 && (
          <div style={{ padding: 24, textAlign: "center", color: "#94a3b8" }}>
            No questions found
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionsTable;
