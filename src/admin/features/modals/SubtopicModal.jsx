// src/admin/features/modals/SubtopicModal.jsx
import React from "react";
import { Modal, Button, Input } from "../../../components/ui";

export default function SubtopicModal({ show, editingId, form, setForm, topics, onSave, onClose }) {
  if (!show) return null;

  return (
    <Modal
      title={editingId ? "Edit SubTopic" : "Create New SubTopic"}
      onClose={onClose}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          label="Subtopic Name (e.g., 'math')"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g., math"
        />
        <Input
          label="Display Label (e.g., 'Math')"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="e.g., Math"
        />
        <Input
          label="Icon"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          placeholder="e.g., 🔢"
        />
        <div>
          <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
            Topic (Optional)
          </label>
          <select
            value={form.topicId}
            onChange={(e) => setForm({ ...form, topicId: e.target.value })}
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
            {topics.filter(t => t.isPublished).map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.icon} {topic.label || topic.name}
              </option>
            ))}
          </select>
          {topics.length === 0 && (
            <p style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
              No topics available. Create topics first.
            </p>
          )}
        </div>
        <Input
          label="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="SubTopic description"
        />
        <div style={{ display: "flex", gap: 10 }}>
          <Button onClick={onSave} style={{ flex: 1 }}>
            {editingId ? "Update SubTopic" : "Create SubTopic"}
          </Button>
          <Button onClick={onClose} style={{ flex: 1, background: "#f3f4f6", color: "#374151" }}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
