// src/admin/features/modals/FeatureModal.jsx
import React from "react";
import { Modal, Button, Input } from "../../../components/ui";

export default function FeatureModal({ show, editingId, form, setForm, onSave, onClose }) {
  if (!show) return null;

  return (
    <Modal
      title={editingId ? "Edit Feature" : "Create New Feature"}
      onClose={onClose}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          label="Feature Name (e.g., 'quiz')"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g., quiz"
        />
        <Input
          label="Display Label (e.g., 'Quiz')"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="e.g., Quiz"
        />
        <Input
          label="Icon"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          placeholder="e.g., 🎯"
        />
        <Input
          label="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Feature description"
        />
        <div>
          <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
            Feature Type
          </label>
          <select
            value={form.featureType}
            onChange={(e) => setForm({ ...form, featureType: e.target.value })}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "2px solid #e2e8f0",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            <option value="quiz">Quiz (Questions & Answers)</option>
            <option value="puzzle">Puzzle (Interactive Games)</option>
            <option value="custom">Custom (Other Content)</option>
          </select>
        </div>
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600 }}>
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            Feature Enabled
          </label>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button onClick={onSave} style={{ flex: 1 }}>
            {editingId ? "Update Feature" : "Create Feature"}
          </Button>
          <Button onClick={onClose} style={{ flex: 1, background: "#f3f4f6", color: "#374151" }}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
