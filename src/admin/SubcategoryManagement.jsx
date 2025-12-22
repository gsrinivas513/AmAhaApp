// src/admin/SubtopicManagement.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { Button, Card, Input } from "../components/ui";

/**
 * SubtopicManagement
 * Manage subtopics for each category
 * Create, update, delete, and publish/unpublish subtopics
 */
export default function SubtopicManagement() {
  const [categories, setCategories] = useState([]);
  const [subtopics, setSubtopicies] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // Form state for new/edit subtopic
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    description: "",
    icon: "",
    topicId: "",
    isPublished: false,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadSubtopics(selectedCategory);
      loadTopics(selectedCategory);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(db, "categories"));
      const cats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCategories(cats);

      if (cats.length > 0) {
        setSelectedCategory(cats[0].id);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      setStatus("❌ Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const loadSubtopics = async (categoryId) => {
    try {
      const snap = await getDocs(
        query(
          collection(db, "subtopics"),
          where("categoryId", "==", categoryId)
        )
      );
      const subcats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Sort: Published first, then by latest update (or creation) date
      subcats.sort((a, b) => {
        // First sort by published status (published first)
        if (a.isPublished !== b.isPublished) {
          return (b.isPublished ? 1 : 0) - (a.isPublished ? 1 : 0);
        }
        
        // Then sort by date (latest first)
        const dateA = a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      
      setSubtopicies(subcats);
    } catch (error) {
      console.error("Error loading subtopics:", error);
      setStatus("❌ Failed to load subtopics");
    }
  };

  const loadTopics = async (categoryId) => {
    try {
      const topicsQuery = query(
        collection(db, "topics"),
        where("categoryId", "==", categoryId),
        where("isPublished", "==", true)
      );
      const topicsSnap = await getDocs(topicsQuery);
      const topicsList = topicsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      
      // Sort by sortOrder
      topicsList.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      
      setTopics(topicsList);
    } catch (error) {
      console.error("Error loading topics:", error);
    }
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      setStatus("❌ Please select a category");
      return;
    }

    if (!formData.name || !formData.label) {
      setStatus("❌ Name and label are required");
      return;
    }

    try {
      const subcatData = {
        ...formData,
        categoryId: selectedCategory,
        quizCount: formData.quizCount || 0,
      };

      if (editingId) {
        // Update existing
        await updateDoc(doc(db, "subtopics", editingId), {
          ...subcatData,
          updatedAt: new Date(),
        });
        setStatus("✅ Subtopic updated");
      } else {
        // Create new
        await addDoc(collection(db, "subtopics"), {
          ...subcatData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setStatus("✅ Subtopic created");
      }

      // Reset form
      setFormData({
        name: "",
        label: "",
        description: "",
        icon: "",
        topicId: "",
        isPublished: false,
      });
      setEditingId(null);

      // Reload subtopics
      await loadSubtopics(selectedCategory);
    } catch (error) {
      console.error("Error saving subtopic:", error);
      setStatus("❌ Failed to save subtopic");
    }
  };

  const handleEdit = (subcat) => {
    setFormData({
      name: subcat.name,
      label: subcat.label,
      description: subcat.description || "",
      icon: subcat.icon || "",
      topicId: subcat.topicId || "",
      isPublished: subcat.isPublished || false,
    });
    setEditingId(subcat.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subtopic?")) return;

    try {
      await deleteDoc(doc(db, "subtopics", id));
      setStatus("✅ Subtopic deleted");
      await loadSubtopics(selectedCategory);
    } catch (error) {
      console.error("Error deleting subtopic:", error);
      setStatus("❌ Failed to delete subtopic");
    }
  };

  const togglePublish = async (id, isPublished) => {
    try {
      await updateDoc(doc(db, "subtopics", id), {
        isPublished: !isPublished,
      });
      setStatus(
        !isPublished ? "✅ Subtopic published" : "✅ Subtopic unpublished"
      );
      await loadSubtopics(selectedCategory);
    } catch (error) {
      console.error("Error updating publish status:", error);
      setStatus("❌ Failed to update publish status");
    }
  };

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  return (
    <AdminLayout>
      <h2>Subtopic Management</h2>

      {status && (
        <div
          style={{
            padding: 12,
            marginBottom: 16,
            backgroundColor: status.includes("✅") ? "#d4edda" : "#f8d7da",
            color: status.includes("✅") ? "#155724" : "#721c24",
            borderRadius: 8,
            fontSize: 14,
          }}
        >
          {status}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        {/* Category Selector */}
        <Card className="h-fit">
          <h3 style={{ marginTop: 0 }}>Categories</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: "12px 16px",
                  border:
                    selectedCategory === cat.id
                      ? "2px solid #0284c7"
                      : "1px solid #e5e7eb",
                  backgroundColor:
                    selectedCategory === cat.id ? "#f0f9ff" : "white",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: selectedCategory === cat.id ? "600" : "400",
                  transition: "all 0.2s ease",
                }}
              >
                {cat.label || cat.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Form and List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Add/Edit Form */}
          <Card>
            <h3 style={{ marginTop: 0 }}>
              {editingId ? "Edit Subtopic" : "Add New Subtopic"}
              {currentCategory && (
                <span style={{ fontSize: 14, color: "#666", fontWeight: 400 }}>
                  {" "}
                  for {currentCategory.label || currentCategory.name}
                </span>
              )}
            </h3>

            <form onSubmit={handleAddOrUpdate} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Input
                placeholder="Internal Name (e.g., math_algebra)"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Input
                placeholder="Display Label (e.g., Algebra)"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
              />

              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                style={{
                  padding: 10,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  fontFamily: "inherit",
                  fontSize: 14,
                  minHeight: 80,
                  resize: "vertical",
                }}
              />

              <Input
                placeholder="Icon (emoji, e.g., 🔢)"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
              />

              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
                  Topic (Optional)
                </label>
                <select
                  value={formData.topicId}
                  onChange={(e) =>
                    setFormData({ ...formData, topicId: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid #ddd",
                    fontFamily: "inherit",
                    fontSize: 14,
                    backgroundColor: "white",
                  }}
                >
                  <option value="">-- No Topic --</option>
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.icon} {topic.label || topic.name}
                    </option>
                  ))}
                </select>
                {topics.length === 0 && (
                  <p style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                    No topics available. Create topics first in the Topics page.
                  </p>
                )}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublished: e.target.checked })
                  }
                />
                <span style={{ fontSize: 14 }}>Publish on home page</span>
              </label>

              <div style={{ display: "flex", gap: 8 }}>
                <Button variant="primary" type="submit">
                  {editingId ? "Update" : "Add"} Subtopic
                </Button>
                {editingId && (
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      setFormData({
                        name: "",
                        label: "",
                        description: "",
                        icon: "",
                        isPublished: false,
                      });
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {/* Subtopicies List */}
          <Card>
            <h3 style={{ marginTop: 0 }}>
              Subtopicies ({subtopics.length})
            </h3>

            {subtopics.length === 0 ? (
              <p style={{ color: "#999", fontSize: 14 }}>
                No subtopics yet. Create one above.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {subtopics.map((subcat) => (
                  <div
                    key={subcat.id}
                    style={{
                      padding: 12,
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {subcat.icon} {subcat.label || subcat.name}
                      </div>
                      {subcat.description && (
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                          {subcat.description}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                        {subcat.quizCount || 0} quizzes •{" "}
                        {subcat.topicId && (
                          <span>
                            📁 {topics.find(t => t.id === subcat.topicId)?.label || 
                                topics.find(t => t.id === subcat.topicId)?.name || 
                                "Topic"} •{" "}
                          </span>
                        )}
                        {subcat.isPublished ? "✅ Published" : "⏸️ Draft"}
                        {(subcat.updatedAt || subcat.createdAt) && (
                          <span>
                            {" • "}
                            {(() => {
                              const date = subcat.updatedAt?.toDate?.() || subcat.createdAt?.toDate?.();
                              if (!date) return "";
                              const now = new Date();
                              const diffMs = now - date;
                              const diffMins = Math.floor(diffMs / 60000);
                              const diffHours = Math.floor(diffMs / 3600000);
                              const diffDays = Math.floor(diffMs / 86400000);
                              
                              if (diffMins < 1) return "Just now";
                              if (diffMins < 60) return `${diffMins}m ago`;
                              if (diffHours < 24) return `${diffHours}h ago`;
                              if (diffDays < 7) return `${diffDays}d ago`;
                              return date.toLocaleDateString();
                            })()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleEdit(subcat)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#f3f4f6",
                          border: "1px solid #d1d5db",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          togglePublish(subcat.id, subcat.isPublished)
                        }
                        style={{
                          padding: "6px 12px",
                          backgroundColor: subcat.isPublished
                            ? "#fef3c7"
                            : "#dbeafe",
                          border: "1px solid #fbbf24",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {subcat.isPublished ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        onClick={() => handleDelete(subcat.id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#fee2e2",
                          border: "1px solid #fca5a5",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#dc2626",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
