// src/admin/TopicManagement.jsx
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
 * TopicManagement
 * Manage topics for each category (Step 3 in admin flow)
 * Topics group related subtopics together
 */
export default function TopicManagement() {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  // Form state for new/edit topic
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    description: "",
    icon: "",
    sortOrder: 0,
    isPublished: false,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadTopics(selectedCategory);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const categoriesSnap = await getDocs(collection(db, "categories"));
      const cats = categoriesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCategories(cats);
      setLoading(false);
    } catch (error) {
      console.error("Error loading categories:", error);
      setStatus("Error loading categories");
      setLoading(false);
    }
  };

  const loadTopics = async (categoryId) => {
    try {
      const topicsQuery = query(
        collection(db, "topics"),
        where("categoryId", "==", categoryId)
      );
      const topicsSnap = await getDocs(topicsQuery);
      let topicsList = topicsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Sort: published first, then by sortOrder, then by date
      topicsList.sort((a, b) => {
        // Published first
        if (a.isPublished !== b.isPublished) {
          return (b.isPublished ? 1 : 0) - (a.isPublished ? 1 : 0);
        }
        // Then by sortOrder
        if (a.sortOrder !== b.sortOrder) {
          return (a.sortOrder || 0) - (b.sortOrder || 0);
        }
        // Then by latest date
        const dateA = a.updatedAt?.toDate?.() || a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.updatedAt?.toDate?.() || b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setTopics(topicsList);
    } catch (error) {
      console.error("Error loading topics:", error);
      setStatus("Error loading topics");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      setStatus("Please select a category first");
      return;
    }
    if (!formData.name.trim()) {
      setStatus("Topic name is required");
      return;
    }

    try {
      const topicData = {
        name: formData.name.trim(),
        label: formData.label.trim() || formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim() || "📚",
        sortOrder: parseInt(formData.sortOrder) || 0,
        isPublished: formData.isPublished,
        categoryId: selectedCategory,
      };

      if (editingId) {
        // Update existing topic
        await updateDoc(doc(db, "topics", editingId), {
          ...topicData,
          updatedAt: new Date(),
        });
        setStatus("Topic updated successfully!");
        setEditingId(null);
      } else {
        // Create new topic
        await addDoc(collection(db, "topics"), {
          ...topicData,
          createdAt: new Date(),
          updatedAt: new Date(),
          subtopicCount: 0,
        });
        setStatus("Topic created successfully!");
      }

      // Reset form
      setFormData({
        name: "",
        label: "",
        description: "",
        icon: "",
        sortOrder: 0,
        isPublished: false,
      });

      // Reload topics
      loadTopics(selectedCategory);

      // Clear status after 3 seconds
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Error saving topic:", error);
      setStatus("Error saving topic: " + error.message);
    }
  };

  const handleEdit = (topic) => {
    setFormData({
      name: topic.name,
      label: topic.label || topic.name,
      description: topic.description || "",
      icon: topic.icon || "📚",
      sortOrder: topic.sortOrder || 0,
      isPublished: topic.isPublished || false,
    });
    setEditingId(topic.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (topicId) => {
    if (!window.confirm("Are you sure you want to delete this topic? This will affect all subtopics using it.")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "topics", topicId));
      setStatus("Topic deleted successfully!");
      loadTopics(selectedCategory);
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Error deleting topic:", error);
      setStatus("Error deleting topic: " + error.message);
    }
  };

  const handleTogglePublish = async (topic) => {
    try {
      await updateDoc(doc(db, "topics", topic.id), {
        isPublished: !topic.isPublished,
        updatedAt: new Date(),
      });
      loadTopics(selectedCategory);
    } catch (error) {
      console.error("Error toggling publish status:", error);
      setStatus("Error updating publish status");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      label: "",
      description: "",
      icon: "",
      sortOrder: 0,
      isPublished: false,
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
          Topic Management
        </h1>

        {/* Step 1: Select Category */}
        <Card style={{ marginBottom: 24, padding: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
            Step 1: Select Category
          </h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: "10px 20px",
                  border: "2px solid",
                  borderColor: selectedCategory === cat.id ? "#3b82f6" : "#e5e7eb",
                  borderRadius: 8,
                  backgroundColor: selectedCategory === cat.id ? "#eff6ff" : "white",
                  color: selectedCategory === cat.id ? "#3b82f6" : "#374151",
                  cursor: "pointer",
                  fontWeight: selectedCategory === cat.id ? 600 : 400,
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
              >
                {cat.icon} {cat.label || cat.name}
              </button>
            ))}
          </div>
        </Card>

        {/* Step 2: Create/Edit Topic */}
        {selectedCategory && (
          <Card style={{ marginBottom: 24, padding: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              {editingId ? "Edit Topic" : "Step 2: Create New Topic"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Input
                    label="Topic Name *"
                    placeholder="e.g., Animals, Math, Science"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Display Label"
                    placeholder="Optional - defaults to name"
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  />
                </div>

                <Input
                  label="Description"
                  placeholder="Brief description of this topic"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Input
                    label="Icon"
                    placeholder="e.g., 🐾 🧮 🔬"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  />
                  <Input
                    label="Sort Order"
                    type="number"
                    placeholder="0"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                  />
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    style={{ width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 14, color: "#374151" }}>Publish this topic</span>
                </label>

                <div style={{ display: "flex", gap: 12 }}>
                  <Button type="submit" style={{ flex: 1 }}>
                    {editingId ? "Update Topic" : "Create Topic"}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      onClick={cancelEdit}
                      style={{ flex: 1, backgroundColor: "#6b7280" }}
                    >
                      Cancel Edit
                    </Button>
                  )}
                </div>
              </div>
            </form>
            {status && (
              <div
                style={{
                  marginTop: 16,
                  padding: 12,
                  backgroundColor: status.includes("Error") ? "#fee2e2" : "#d1fae5",
                  color: status.includes("Error") ? "#991b1b" : "#065f46",
                  borderRadius: 6,
                  fontSize: 14,
                }}
              >
                {status}
              </div>
            )}
          </Card>
        )}

        {/* Step 3: View Topics */}
        {selectedCategory && (
          <Card style={{ padding: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              Step 3: Topics for{" "}
              {categories.find((c) => c.id === selectedCategory)?.label || "this category"}
            </h2>
            {topics.length === 0 ? (
              <p style={{ color: "#999", fontSize: 14 }}>
                No topics yet. Create one above.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {topics.map((topic) => (
                  <div
                    key={topic.id}
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
                        {topic.icon} {topic.label || topic.name}
                        <span style={{ 
                          marginLeft: 8,
                          fontSize: 11,
                          color: "#666",
                          fontWeight: 400
                        }}>
                          (Order: {topic.sortOrder || 0})
                        </span>
                      </div>
                      {topic.description && (
                        <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                          {topic.description}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                        {topic.subtopicCount || 0} subtopics •{" "}
                        {topic.isPublished ? "✅ Published" : "⏸️ Draft"}
                        {(topic.updatedAt || topic.createdAt) && (
                          <span>
                            {" • "}
                            {(() => {
                              const date = topic.updatedAt?.toDate?.() || topic.createdAt?.toDate?.();
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
                        onClick={() => handleEdit(topic)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#f3f4f6",
                          border: "1px solid #e5e7eb",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleTogglePublish(topic)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: topic.isPublished ? "#fef3c7" : "#d1fae5",
                          border: "1px solid",
                          borderColor: topic.isPublished ? "#fbbf24" : "#34d399",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 13,
                        }}
                      >
                        {topic.isPublished ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => handleDelete(topic.id)}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#fee2e2",
                          border: "1px solid #fca5a5",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 13,
                          color: "#991b1b",
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
        )}
      </div>
    </AdminLayout>
  );
}
