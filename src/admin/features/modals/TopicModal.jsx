// src/admin/features/modals/TopicModal.jsx
import React, { useState } from "react";
import { Modal, Button, Input } from "../../../components/ui";
import ImageUpload from "../../../components/ImageUpload";
import ImageCropControl from "../../../components/ImageCropControl";

export default function TopicModal({ show, editingId, form, setForm, onSave, onClose }) {
  const [showImageControls, setShowImageControls] = useState(false);

  if (!show) return null;

  return (
    <Modal
      title={editingId ? "Edit Topic" : "Create New Topic"}
      onClose={onClose}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          label="Topic Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g., Animals, Math, Science"
        />
        <Input
          label="Display Label"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="Optional - defaults to name"
        />
        <Input
          label="Icon"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          placeholder="e.g., 🐾 🧮 🔬"
        />
        
        <ImageUpload
          label="Topic Image (Upload or paste URL)"
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
          folder="topics"
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
        
        <Input
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Brief description of this topic"
        />
        <Input
          label="Sort Order"
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
          placeholder="0"
        />
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            style={{ width: 16, height: 16 }}
          />
          <span style={{ fontSize: 14, color: "#374151" }}>Publish this topic</span>
        </label>
        <div style={{ display: "flex", gap: 10 }}>
          <Button onClick={onSave} style={{ flex: 1 }}>
            {editingId ? "Update Topic" : "Create Topic"}
          </Button>
          <Button onClick={onClose} style={{ flex: 1, background: "#f3f4f6", color: "#374151" }}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
