// src/puzzles/VisualPuzzlePlayPage.jsx
// Main page for playing visual puzzles
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVisualPuzzleById } from "../quiz/services/visualPuzzleService";
import PictureWordPuzzle from "./renderers/PictureWordPuzzle";
import SpotDifferencePuzzle from "./renderers/SpotDifferencePuzzle";
import FindPairPuzzle from "./renderers/FindPairPuzzle";
import PictureShadowPuzzle from "./renderers/PictureShadowPuzzle";
import OrderingPuzzle from "./renderers/OrderingPuzzle";
import CrosswordPuzzle from "./renderers/CrosswordPuzzle";
import SudokuPuzzle from "./renderers/SudokuPuzzle";
import WordSearchPuzzle from "./renderers/WordSearchPuzzle";
import PuzzleFinish from "./PuzzleFinish";
import "../styles/puzzle-renderers.css";

function VisualPuzzlePlayPage() {
  const {
    categoryName,
    topicName,
    subtopicName,
    puzzleId,
  } = useParams();
  const navigate = useNavigate();
  const [puzzle, setPuzzle] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        setLoading(true);
        const data = await getVisualPuzzleById(puzzleId);
        if (data) {
          setPuzzle(data);
        } else {
          setError("Puzzle not found");
        }
      } catch (err) {
        console.error("Error loading puzzle:", err);
        setError("Failed to load puzzle");
      } finally {
        setLoading(false);
      }
    };

    if (puzzleId) {
      loadPuzzle();
    }
  }, [puzzleId]);

  if (loading) {
    return (
      <div className="puzzle-loading">
        <div className="loading-spinner">⏳</div>
        <p>Loading puzzle...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="puzzle-error">
        <div className="error-message">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-back"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="puzzle-error">
        <div className="error-message">
          <h2>🤔 Puzzle Not Found</h2>
          <p>We couldn't find this puzzle.</p>
          <button
            onClick={() => navigate(-1)}
            className="btn-back"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <PuzzleFinish
        puzzle={puzzle}
        categoryName={categoryName}
        topicName={topicName}
        subtopicName={subtopicName}
      />
    );
  }

  const renderPuzzle = () => {
    const puzzleProps = {
      puzzle,
      onComplete: () => setCompleted(true),
    };

    switch (puzzle.type) {
      case "picture-word":
        return <PictureWordPuzzle {...puzzleProps} />;
      case "spot-difference":
        return <SpotDifferencePuzzle {...puzzleProps} />;
      case "find-pair":
        return <FindPairPuzzle {...puzzleProps} />;
      case "picture-shadow":
        return <PictureShadowPuzzle {...puzzleProps} />;
      case "ordering":
        return <OrderingPuzzle {...puzzleProps} />;
      case "crossword":
        return <CrosswordPuzzle {...puzzleProps} />;
      case "sudoku":
        return <SudokuPuzzle {...puzzleProps} />;
      case "word-search":
        return <WordSearchPuzzle {...puzzleProps} />;
      default:
        return (
          <div className="puzzle-error">
            <div className="error-message">
              <h2>❌ Unknown Puzzle Type</h2>
              <p>Puzzle type: {puzzle.type}</p>
            </div>
          </div>
        );
    }
  };

  return renderPuzzle();
}

export default VisualPuzzlePlayPage;
