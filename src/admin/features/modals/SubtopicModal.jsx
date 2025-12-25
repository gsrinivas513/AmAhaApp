// src/admin/features/modals/SubtopicModal.jsx
import React, { useState } from "react";
import { Modal, Button, Input } from "../../../components/ui";
import ImageUpload from "../../../components/ImageUpload";
import ImageCropControl from "../../../components/ImageCropControl";

export default function SubtopicModal({ show, editingId, form, setForm, topics, onSave, onClose }) {
  const [showImageControls, setShowImageControls] = useState(!!form.imageUrl); // Auto-expand if image exists

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
        
        <ImageUpload
          label="Subtopic Image (Upload or paste URL)"
          value={form.imageUrl || ''}
          onChange={(imageData) => {
            if (typeof imageData === 'string') {
              setForm({ ...form, imageUrl: imageData });
            } else if (imageData?.url) {
              setForm({ 
                ...form, 
                imageUrl: imageData.url,
                cloudinaryId: imageData.cloudinaryId 
              });
            }
          }}
          folder="subtopics"
        />

        {/* Image Crop & Zoom Controls */}
        {form.imageUrl && (
          <div>
            <button
              onClick={() => setShowImageControls(!showImageControls)}
              style={{
                width: "100%",
                padding: "10px",
                background: showImageControls ? "#e6f2ff" : "#f5f5f5",
                border: "1px solid #d0d0d0",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                color: showImageControls ? "#0066cc" : "#333",
                transition: "all 0.2s ease",
              }}
            >
              {showImageControls ? "✖ Hide Image Adjustments" : "⚙️ Adjust Image (Crop/Zoom)"}
            </button>

            {showImageControls && (
              <div style={{ marginTop: "12px", padding: "12px", background: "#fafafa", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <ImageCropControl
                  imageUrl={form.imageUrl}
                  currentSettings={{
                    crop: form.imageCrop || "cover",
                    zoom: form.imageZoom || 1,
                    offsetX: form.imageOffsetX || 0,
                    offsetY: form.imageOffsetY || 0,
                  }}
                  onChange={(settings) => {
                    setForm({
                      ...form,
                      imageCrop: settings.crop,
                      imageZoom: settings.zoom,
                      imageOffsetX: settings.offsetX,
                      imageOffsetY: settings.offsetY,
                    });
                  }}
                />
              </div>
            )}
          </div>
        )}
        
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
