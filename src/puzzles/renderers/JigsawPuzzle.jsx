import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import JigsawGamePixi from "../JigsawGamePixi";

/**
 * Jigsaw Puzzle Renderer
 * Wrapper around JigsawGamePage that handles variant selection
 */
export default function JigsawPuzzleRenderer({ puzzle: puzzleData, onComplete }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Extract puzzle data
  const puzzleContent = puzzleData.data || {};
  const imageUrl = puzzleContent.imageUrl || puzzleData.imageUrl;
  const variants = puzzleContent.variants || puzzleData.variants || [];

  // If variant not selected, show selection screen
  if (!selectedVariant) {
    return (
      <div
        style={{
          background: theme.background || "#F3F4F6",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px"
        }}
      >
        <div
          style={{
            background: theme.surface || "#FFFFFF",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
            maxWidth: "600px"
          }}
        >
          <h1 style={{ color: theme.text || theme.textPrimary || "#1F2937", marginBottom: "24px" }}>
            Select Puzzle Difficulty
          </h1>

          {imageUrl && (
            <img
              src={imageUrl}
              alt="Puzzle preview"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "24px"
              }}
            />
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {variants && variants.length > 0 ? (
              variants.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariant(variant)}
                  style={{
                    background: theme.accent || theme.primary || "#4F46E5",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "16px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "0.8";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  {variant.name || variant.label || `${variant.cols}×${variant.rows}`}
                </button>
              ))
            ) : (
              // Default variants if none provided
              [
                { name: "Easy (3×4)", cols: 3, rows: 4 },
                { name: "Medium (4×5)", cols: 4, rows: 5 },
                { name: "Hard (6×6)", cols: 6, rows: 6 }
              ].map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVariant(variant)}
                  style={{
                    background: theme.accent || theme.primary || "#4F46E5",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "16px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "16px",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = "0.8";
                    e.target.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = "1";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  {variant.name}
                </button>
              ))
            )}
          </div>

          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: "16px",
              background: "transparent",
              color: theme.accent || theme.primary || "#4F46E5",
              border: `2px solid ${theme.accent || theme.primary || "#4F46E5"}`,
              borderRadius: "8px",
              padding: "12px 24px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "14px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = theme.accent || theme.primary || "#4F46E5";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = theme.accent || theme.primary || "#4F46E5";
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // Render the actual game using PixiJS
  return (
    <JigsawGamePixi
      puzzle={{
        ...puzzleData,
        data: {
          ...puzzleContent,
          imageUrl,
          selectedVariant,
        }
      }}
      onComplete={onComplete}
    />
  );
}
