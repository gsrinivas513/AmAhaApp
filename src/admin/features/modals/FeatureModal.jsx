// src/admin/features/modals/FeatureModal.jsx
import React, { useState } from "react";
import { Modal, Button, Input } from "../../../components/ui";
import ImageUpload from "../../../components/ImageUpload";
import ImageCropControl from "../../../components/ImageCropControl";

export default function FeatureModal({ show, editingId, form, setForm, onSave, onClose }) {
  const [showImageControls, setShowImageControls] = useState(!!form.imageUrl); // Auto-expand if image exists

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
        
        <ImageUpload
          label="Feature Image (Upload or paste URL)"
          value={form.imageUrl || ''}
          onChange={(imageData) => {
            // Handle both string (URL) and object { url, cloudinaryId }
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
          folder="features"
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
          label="Cloudinary ID (auto-filled from upload)"
          value={form.cloudinaryId}
          onChange={(e) => setForm({ ...form, cloudinaryId: e.target.value })}
          placeholder="e.g., quiz_feature"
          disabled
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
