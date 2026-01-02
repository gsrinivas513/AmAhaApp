// src/admin/components/AdminEditorToolbar.jsx
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import AdminTemplatePreviewModal from "./AdminTemplatePreviewModal";

export default function AdminEditorToolbar({
  onAddClick,
  addButtonText = "+ Add",
  onClearAll,
  clearButtonText = "Clear All",
  templates = [],
  loadingTemplates = false,
  onApplyTemplate, // (templateId) => void
  getCurrentData, // () => editor content snapshot for diff
  editorKind, // string used by preview modal to render diffs
}) {
  const { theme } = useTheme();
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleApply = () => {
    if (selectedTemplateId && typeof onApplyTemplate === "function") {
      onApplyTemplate(selectedTemplateId);
    }
  };

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        marginBottom: 12,
        background: theme.surfacePrimary,
        border: `1px solid ${theme.border}`,
        borderRadius: 10,
        padding: 10,
      }}
    >
      {onAddClick && (
        <button type="button" onClick={onAddClick} className="btn btn-secondary">
          {addButtonText}
        </button>
      )}
      {onClearAll && (
        <button type="button" onClick={onClearAll} className="btn btn-danger">
          {clearButtonText}
        </button>
      )}

      <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
        <select
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(e.target.value)}
          className="form-input"
          disabled={loadingTemplates || templates.length === 0}
          aria-label="Select template"
          style={{ minWidth: 220 }}
        >
          <option value="">
            {loadingTemplates ? "Loading templates…" : "Choose a template"}
          </option>
          {templates.map((t) => (
            <option key={t.id} value={t.id} title={t.description}>
              {t.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setShowPreview(true)}
          disabled={!selectedTemplateId}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="btn btn-primary"
          disabled={!selectedTemplateId}
        >
          Apply Template
        </button>
      </div>

      <AdminTemplatePreviewModal
        open={showPreview}
        onClose={() => setShowPreview(false)}
        template={selectedTemplate}
        editorKind={editorKind}
        currentData={typeof getCurrentData === 'function' ? getCurrentData() : undefined}
      />
    </div>
  );
}
