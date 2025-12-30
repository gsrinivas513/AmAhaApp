/**
 * PuzzlePublishedFix.jsx
 * Admin tool to diagnose and fix puzzle visibility issues
 */

import React, { useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import AdminLayout from './AdminLayout';

export default function PuzzlePublishedFix() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [puzzlesBySubtopic, setPuzzlesBySubtopic] = useState({});

  const diagnose = async () => {
    setLoading(true);
    try {
      // Get all puzzles
      const puzzlesSnap = await getDocs(collection(db, 'puzzles'));
      const puzzles = puzzlesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Get all subtopics
      const subtopicsSnap = await getDocs(collection(db, 'subtopics'));
      const subtopics = subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Group puzzles by subtopic
      const groupedBySubtopic = {};
      puzzles.forEach(p => {
        if (!groupedBySubtopic[p.subtopicId]) {
          groupedBySubtopic[p.subtopicId] = [];
        }
        groupedBySubtopic[p.subtopicId].push(p);
      });

      setPuzzlesBySubtopic(groupedBySubtopic);

      // Analyze
      const stats = {
        totalPuzzles: puzzles.length,
        puzzlesWithoutIsPublished: puzzles.filter(p => p.isPublished === undefined).length,
        unpublishedPuzzles: puzzles.filter(p => p.isPublished === false).length,
        publishedPuzzles: puzzles.filter(p => p.isPublished === true).length,
        puzzlesWithoutSubtopicId: puzzles.filter(p => !p.subtopicId).length,
        subtopicsWithNoPuzzles: subtopics.filter(s => !groupedBySubtopic[s.id] || groupedBySubtopic[s.id].length === 0),
        subtopicsWithUnpublishedOnly: Object.entries(groupedBySubtopic)
          .filter(([subtopicId, puzs]) => puzs.every(p => p.isPublished === false))
          .map(([subtopicId]) => subtopics.find(s => s.id === subtopicId)),
      };

      setResults(stats);
    } catch (error) {
      console.error('Error diagnosing:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fixSubtopic = async (subtopicId) => {
    if (!window.confirm(`Fix all puzzles in subtopic ${subtopicId}?`)) return;

    setLoading(true);
    try {
      const puzzles = puzzlesBySubtopic[subtopicId] || [];
      let fixed = 0;

      for (const puzzle of puzzles) {
        if (puzzle.isPublished !== true) {
          await updateDoc(doc(db, 'puzzles', puzzle.id), {
            isPublished: true,
            updatedAt: new Date(),
          });
          fixed++;
        }
      }

      alert(`Fixed ${fixed} puzzles in subtopic ${subtopicId}`);
      diagnose();
    } catch (error) {
      console.error('Error fixing:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fixAll = async () => {
    if (!window.confirm('Fix ALL unpublished puzzles? This cannot be undone.')) return;

    setLoading(true);
    try {
      const puzzlesSnap = await getDocs(collection(db, 'puzzles'));
      let fixed = 0;

      for (const puzzleDoc of puzzlesSnap.docs) {
        const puzzle = puzzleDoc.data();
        if (puzzle.isPublished !== true) {
          await updateDoc(puzzleDoc.ref, {
            isPublished: true,
            updatedAt: new Date(),
          });
          fixed++;
        }
      }

      alert(`Fixed ${fixed} puzzles total`);
      diagnose();
    } catch (error) {
      console.error('Error fixing:', error);
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h2>🔧 Puzzle Published Status Fix</h2>
      <p>Diagnose and fix puzzle visibility issues</p>

      <button
        onClick={diagnose}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
        }}
      >
        {loading ? 'Analyzing...' : 'Diagnose Puzzles'}
      </button>

      {results && (
        <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3>📊 Diagnosis Results</h3>
          
          <div style={{ marginBottom: '20px' }}>
            <p><strong>Total Puzzles:</strong> {results.totalPuzzles}</p>
            <p><strong>Published:</strong> {results.publishedPuzzles} ✅</p>
            <p><strong>Unpublished:</strong> {results.unpublishedPuzzles} ❌</p>
            <p><strong>Missing isPublished field:</strong> {results.puzzlesWithoutIsPublished} ⚠️</p>
            <p><strong>Puzzles without subtopicId:</strong> {results.puzzlesWithoutSubtopicId}</p>
          </div>

          {results.subtopicsWithNoPuzzles.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4>📭 Subtopics with No Puzzles ({results.subtopicsWithNoPuzzles.length})</h4>
              <ul>
                {results.subtopicsWithNoPuzzles.map(s => (
                  <li key={s.id}>
                    {s.label || s.name} <code>{s.id}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.subtopicsWithUnpublishedOnly.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4>⚠️ Subtopics with ONLY Unpublished Puzzles ({results.subtopicsWithUnpublishedOnly.length})</h4>
              <ul>
                {results.subtopicsWithUnpublishedOnly.map(s => (
                  <li key={s.id}>
                    {s.label || s.name} <code>{s.id}</code>
                    <button
                      onClick={() => fixSubtopic(s.id)}
                      disabled={loading}
                      style={{
                        marginLeft: '10px',
                        padding: '5px 10px',
                        backgroundColor: '#ff9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Fix This Subtopic
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(results.unpublishedPuzzles > 0 || results.puzzlesWithoutIsPublished > 0) && (
            <button
              onClick={fixAll}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              🚀 Fix ALL Unpublished Puzzles
            </button>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
