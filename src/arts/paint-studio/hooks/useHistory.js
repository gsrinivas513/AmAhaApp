/**
 * useHistory Hook
 * Manages undo/redo functionality
 */

import { useState, useCallback } from 'react';
import { UNDO_STACK_LIMIT } from '../utils/constants';

export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const pushHistory = useCallback((canvasState) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(canvasState);
      // Limit history size
      if (newHistory.length > UNDO_STACK_LIMIT) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, UNDO_STACK_LIMIT - 1));
  }, [historyIndex]);

  const undo = useCallback(() => {
    setHistoryIndex((prev) => Math.max(-1, prev - 1));
  }, []);

  const redo = useCallback(() => {
    setHistoryIndex((prev) => Math.min(prev + 1, history.length - 1));
  }, [history]);

  const getHistoryState = useCallback(() => {
    return historyIndex >= 0 ? history[historyIndex] : null;
  }, [history, historyIndex]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryIndex(-1);
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    history,
    historyIndex,
    pushHistory,
    undo,
    redo,
    getHistoryState,
    clearHistory,
    canUndo,
    canRedo,
  };
};
