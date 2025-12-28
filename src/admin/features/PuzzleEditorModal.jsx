import React, { useState } from "react";
import { Button } from "../../components/ui";
import ImageUpload from "../../components/ImageUpload";
import ImageCropControl from "../../components/ImageCropControl";

/**
 * PuzzleEditorModal - Simple puzzle editor for admin panel
 * Allows viewing and editing puzzle properties
 */
function PuzzleEditorModal({
  puzzle = null,
  subtopic = null,
  onClose,
  onSave
}) {
  const [formData, setFormData] = useState(puzzle || {
    title: "",
    type: "matching",
    description: "",
    imageUrl: "",
    cloudinaryId: "",
    imageCrop: "cover",
    imageZoom: 1,
    imageOffsetX: 0,
    imageOffsetY: 0,
    difficulty: "easy",
    ageGroup: "5-7",
    color: "#0284c7"
  });

  const [showImageControls, setShowImageControls] = useState(!!formData.imageUrl);

  const puzzleTypes = [
    "matching",
    "ordering",
    "drag",
    "picture-word",
    "spot-difference",
    "picture-shadow",
    "jigsaw",
    "word-search"
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert("Please enter a puzzle title");
      return;
    }
    
    onSave({
      ...formData,
      subtopicId: subtopic?.id
    });
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "24px",
        maxWidth: "600px",
        width: "90%",
        maxHeight: "80vh",
        overflow: "auto",
        boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ margin: "0 0 16px 0", fontSize: "20px", fontWeight: 700 }}>
          {puzzle ? "Edit Puzzle" : "Create New Puzzle"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Title */}
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: 600, fontSize: "14px" }}>
              Puzzle Title *
            </label>
            <input
              type="text"
              value={formData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Match the Colors"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Type */}
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: 600, fontSize: "14px" }}>
              Puzzle Type *
            </label>
            <select
              value={formData.type || "matching"}
              onChange={(e) => handleChange("type", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            >
              {puzzleTypes.map(type => (
                <option key={type} value={type}>{type.replace('-', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: 600, fontSize: "14px" }}>
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the puzzle..."
              rows="3"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                boxSizing: "border-box",
                fontFamily: "inherit"
              }}
            />
          </div>

          {/* Image Upload */}
          <div>
            <ImageUpload
              label="Puzzle Image (Upload or paste URL)"
              value={formData.imageUrl || ''}
              onChange={(imageData) => {
                if (typeof imageData === 'string') {
                  setFormData(prev => ({ ...prev, imageUrl: imageData }));
                } else if (imageData?.url) {
                  setFormData(prev => ({ 
                    ...prev, 
                    imageUrl: imageData.url,
                    cloudinaryId: imageData.cloudinaryId 
                  }));
                }
              }}
              folder="puzzles"
            />
          </div>

          {/* Image Crop & Zoom Controls */}
          {formData.imageUrl && (
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
                    imageUrl={formData.imageUrl}
                    currentSettings={{
                      crop: formData.imageCrop || "cover",
                      zoom: formData.imageZoom || 1,
                      offsetX: formData.imageOffsetX || 0,
                      offsetY: formData.imageOffsetY || 0,
                    }}
                    onChange={(settings) => {
                      setFormData(prev => ({
                        ...prev,
                        imageCrop: settings.crop,
                        imageZoom: settings.zoom,
                        imageOffsetX: settings.offsetX,
                        imageOffsetY: settings.offsetY,
                      }));
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Color Fallback */}
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Color (fallback if no image)
            </label>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                type="color"
                value={formData.color || "#0284c7"}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                style={{
                  width: "60px",
                  height: "40px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              />
              <input
                type="text"
                value={formData.color || "#0284c7"}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                placeholder="#0284c7"
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: 600, fontSize: "14px" }}>
              Difficulty
            </label>
            <select
              value={formData.difficulty || "easy"}
              onChange={(e) => handleChange("difficulty", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Age Group */}
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: 600, fontSize: "14px" }}>
              Age Group
            </label>
            <input
              type="text"
              value={formData.ageGroup || ""}
              onChange={(e) => handleChange("ageGroup", e.target.value)}
              placeholder="e.g., 5-7"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {subtopic && (
            <div style={{ 
              padding: "12px", 
              backgroundColor: "#f0f9ff", 
              borderRadius: "4px",
              borderLeft: "4px solid #0284c7"
            }}>
              <div style={{ fontSize: "12px", color: "#0c4a6e", fontWeight: 600 }}>
                Subtopic: {subtopic.label || subtopic.name}
              </div>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginTop: "24px",
          justifyContent: "flex-end"
        }}>
          <Button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              background: "#f3f4f6",
              color: "#374151",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {puzzle ? "Update Puzzle" : "Create Puzzle"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PuzzleEditorModal;
