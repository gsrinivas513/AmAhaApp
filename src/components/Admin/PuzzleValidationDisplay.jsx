// src/components/admin/PuzzleValidationDisplay.jsx
// Generic validation error display component for all puzzle editors
// Reusable across all puzzle types

import React from "react";

/**
 * PuzzleValidationDisplay
 * Shows validation errors and warnings in a consistent format
 * 
 * @param {Object} validation - Validation result { valid, errors, warnings }
 * @param {boolean} showValidation - Whether to display validation errors
 * @returns {JSX.Element | null}
 */
export function ValidationErrorDisplay({ validation, showValidation = true }) {
  if (!showValidation || !validation || validation.valid) {
    return null;
  }

  return (
    <div style={{
      padding: "1.5rem",
      backgroundColor: "#ffebee",
      border: "3px solid #c62828",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      animation: "slideDown 0.3s ease"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1rem"
      }}>
        <span style={{ fontSize: "1.5rem" }}>❌</span>
        <h3 style={{
          margin: 0,
          color: "#c62828",
          fontSize: "1.1rem",
          fontWeight: "bold"
        }}>
          Cannot Save Puzzle
        </h3>
      </div>

      {validation.errors && validation.errors.length > 0 && (
        <div>
          <p style={{
            margin: "0.5rem 0",
            color: "#c62828",
            fontWeight: "600",
            fontSize: "0.9rem"
          }}>
            Please fix these errors:
          </p>
          <ul style={{
            margin: "0.5rem 0 0 0",
            paddingLeft: "1.5rem",
            color: "#c62828"
          }}>
            {validation.errors.map((error, idx) => (
              <li key={idx} style={{
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                listStyle: "disc"
              }}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings && validation.warnings.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <p style={{
            margin: "0.5rem 0",
            color: "#f57c00",
            fontWeight: "600",
            fontSize: "0.9rem"
          }}>
            ⚠️ Warnings:
          </p>
          <ul style={{
            margin: "0.5rem 0 0 0",
            paddingLeft: "1.5rem",
            color: "#f57c00"
          }}>
            {validation.warnings.map((warning, idx) => (
              <li key={idx} style={{
                marginBottom: "0.5rem",
                fontSize: "0.9rem",
                listStyle: "disc"
              }}>
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * ValidationSuccessDisplay
 * Shows success message when validation passes
 */
export function ValidationSuccessDisplay() {
  return (
    <div style={{
      padding: "1rem",
      backgroundColor: "#e8f5e9",
      border: "2px solid #4caf50",
      borderRadius: "8px",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    }}>
      <span style={{ fontSize: "1.2rem" }}>✅</span>
      <span style={{
        color: "#2e7d32",
        fontWeight: "600",
        fontSize: "0.95rem"
      }}>
        Puzzle data is valid and ready to save
      </span>
    </div>
  );
}

/**
 * usePuzzleValidation Hook
 * Handles validation state and save logic for any puzzle editor
 * 
 * @param {Object} puzzleData - The puzzle object to validate
 * @param {Function} onSave - Callback function to save puzzle
 * @returns {Object} { validate, validation, isSaving, handleSave }
 */
export function usePuzzleValidation(puzzleData, onSave) {
  const [validation, setValidation] = React.useState(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const validate = React.useCallback(() => {
    // Import validation function
    const { validatePuzzleData } = require("../../services/puzzleValidationService");
    const result = validatePuzzleData(puzzleData);
    setValidation(result);
    return result;
  }, [puzzleData]);

  const handleSave = React.useCallback(async () => {
    // Validate before saving
    const result = validate();

    if (!result.valid) {
      // Scroll to error message
      setTimeout(() => {
        const errorElement = document.querySelector("[data-validation-error]");
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return false;
    }

    // Save
    setIsSaving(true);
    try {
      const success = await onSave(puzzleData);
      setIsSaving(false);
      return success;
    } catch (error) {
      console.error("❌ Save error:", error);
      setValidation({
        valid: false,
        errors: [error.message || "Failed to save puzzle"],
        warnings: []
      });
      setIsSaving(false);
      return false;
    }
  }, [validate, onSave, puzzleData]);

  return {
    validate,
    validation,
    isSaving,
    handleSave
  };
}

/**
 * PuzzleValidationWrapper
 * Complete validation UI component - drop into any puzzle editor
 * 
 * @param {Object} props
 * @returns {JSX.Element}
 */
export function PuzzleValidationWrapper({
  puzzleData,
  onSave,
  children,
  isSaving = false,
  validationState = null
}) {
  const { validation, handleSave } = usePuzzleValidation(
    puzzleData,
    onSave
  );

  return (
    <div>
      {/* Validation Error Display */}
      <div data-validation-error>
        <ValidationErrorDisplay validation={validation} />
      </div>

      {/* Validation Success Display */}
      {validation?.valid && (
        <ValidationSuccessDisplay />
      )}

      {/* Editor Content */}
      {children}

      {/* Save Button */}
      <div style={{
        marginTop: "2rem",
        display: "flex",
        gap: "1rem",
        justifyContent: "flex-end"
      }}>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "12px 24px",
            backgroundColor: "#f5f5f5",
            border: "2px solid #ddd",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            color: "#333",
            transition: "all 0.3s ease"
          }}
        >
          ← Cancel
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: "12px 24px",
            backgroundColor: isSaving ? "#ccc" : "#4caf50",
            border: "none",
            borderRadius: "8px",
            cursor: isSaving ? "not-allowed" : "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            color: "white",
            transition: "all 0.3s ease",
            opacity: isSaving ? 0.7 : 1
          }}
        >
          {isSaving ? "💾 Saving..." : "💾 Save Puzzle"}
        </button>
      </div>
    </div>
  );
}
