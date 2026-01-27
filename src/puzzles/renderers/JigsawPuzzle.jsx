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

  // Calculate piece count from variant
  const getPieceCount = (variant) => {
    if (!variant) return 0;
    return (variant.rows || 4) * (variant.cols || 3);
  };

  // Get difficulty level based on piece count
  const getDifficultyLevel = (variant) => {
    const count = getPieceCount(variant);
    if (count <= 12) return { level: 'Easy', color: '#10B981', icon: '🟢' };
    if (count <= 20) return { level: 'Medium', color: '#F59E0B', icon: '🟡' };
    return { level: 'Hard', color: '#EF4444', icon: '🔴' };
  };

  // Default to Easy variant
  const defaultVariant = variants && variants.length > 0 ? variants[0] : { label: 'Easy', cols: 3, rows: 4 };
  const currentVariant = selectedVariant || defaultVariant;

  // Render the game directly with variant selector overlay
  return (
    <JigsawGamePixi
      puzzle={{
        ...puzzleData,
        data: {
          ...puzzleContent,
          imageUrl,
          selectedVariant: currentVariant,
          allVariants: variants,
          onVariantChange: setSelectedVariant,
        }
      }}
      onComplete={onComplete}
    />
  );
}
