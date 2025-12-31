// src/admin/features/modals/CategoryModal.jsx
import React, { useState } from "react";
import { Modal, Button, Input } from "../../../components/ui";
import ImageUpload from "../../../components/ImageUpload";
import ImageCropControl from "../../../components/ImageCropControl";
import { UI_MODES } from "../constants";

export default function CategoryModal({ show, editingId, form, setForm, onSave, onClose }) {
  const [showImageControls, setShowImageControls] = useState(!!form.imageUrl); // Auto-expand if image exists

  if (!show) return null;

  return (
    <Modal
      title={editingId ? "Edit Category" : "Create New Category"}
      onClose={onClose}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Input
          label="Category Name (e.g., 'programming')"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g., programming"
        />
        <Input
          label="Display Label (e.g., 'Programming')"
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
          placeholder="e.g., Programming"
        />
        <Input
          label="Icon"
          value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })}
          placeholder="e.g., 💻"
        />
        
        <ImageUpload
          label="Category Image (Upload or paste URL)"
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
          folder="categories"
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
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
            Color (fallback if no image)
          </label>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              style={{
                width: 50,
                height: 40,
                border: "1px solid #e2e8f0",
                borderRadius: 6,
                cursor: "pointer",
              }}
            />
            <span style={{ fontSize: 12, color: "#64748b" }}>
              {form.color}
            </span>
          </div>
        </div>
        <Input
          label="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Category description"
        />

        {/* Admin Enhancement Fields */}
        <div style={{ borderTop: "2px solid #e2e8f0", paddingTop: 16, marginTop: 8 }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#1f2937", fontSize: 14 }}>Publishing & Visibility</h4>
          
          {/* Status */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
              Status
            </label>
            <select
              value={form.status || 'published'}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: 6,
                border: "1px solid #d1d5db",
                fontFamily: "inherit",
                fontSize: 14,
              }}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="comingSoon">Coming Soon</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Visibility */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
              Visibility
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              {['public', 'private', 'comingSoon'].map(visibility => (
                <label key={visibility} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="visibility"
                    value={visibility}
                    checked={(form.visibility || 'public') === visibility}
                    onChange={(e) => setForm({ ...form, visibility: e.target.value })}
                  />
                  <span style={{ fontSize: 13, textTransform: "capitalize" }}>{visibility}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Featured & Home Page Toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 8 }}>
            <input
              type="checkbox"
              checked={form.featured || false}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              style={{ width: 16, height: 16 }}
            />
            <span style={{ fontSize: 14 }}>⭐ Featured</span>
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 12 }}>
            <input
              type="checkbox"
              checked={form.showInHome !== false}
              onChange={(e) => setForm({ ...form, showInHome: e.target.checked })}
              style={{ width: 16, height: 16 }}
            />
            <span style={{ fontSize: 14 }}>🏠 Show in Home</span>
          </label>
        </div>
        
        <div>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600, fontSize: 14 }}>
            UI Style/Mode
          </label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {UI_MODES.map((mode) => (
              <label
                key={mode.value}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: 10,
                  border: form.defaultUiMode === mode.value ? "2px solid #0284c7" : "2px solid #e2e8f0",
                  borderRadius: 8,
                  cursor: "pointer",
                  background: form.defaultUiMode === mode.value ? "#dbeafe" : "#fff",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  type="radio"
                  name="uiMode"
                  value={mode.value}
                  checked={form.defaultUiMode === mode.value}
                  onChange={(e) => setForm({ ...form, defaultUiMode: e.target.value })}
                  style={{ width: 16, height: 16, cursor: "pointer", marginTop: 2 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#0b1220" }}>
                    {mode.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                    {mode.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Button onClick={onSave} style={{ flex: 1 }}>
            {editingId ? "Update Category" : "Create Category"}
          </Button>
          <Button onClick={onClose} style={{ flex: 1, background: "#f3f4f6", color: "#374151" }}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
