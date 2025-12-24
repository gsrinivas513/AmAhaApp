import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAllPuzzles, deletePuzzle } from '../quiz/services/puzzleService';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const PUZZLE_COLUMNS = [
  { key: 'title', label: 'Title' },
  { key: 'type', label: 'Type' },
  { key: 'category', label: 'Category' },
  { key: 'topic', label: 'Topic' },
  { key: 'subtopic', label: 'SubTopic' },
  { key: 'description', label: 'Description' },
  { key: 'imageUrl', label: 'Image URL' },
  { key: 'pairs', label: 'Pairs' },
  { key: 'items', label: 'Items' },
  { key: 'draggables', label: 'Draggables' },
  { key: 'targets', label: 'Targets' },
];

function PuzzleListPage() {
  const [puzzles, setPuzzles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [puzzlesData, catSnap] = await Promise.all([
          getAllPuzzles(),
          getDocs(collection(db, 'categories')),
        ]);
        setPuzzles(puzzlesData);
        setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch {
        setError('Failed to load puzzles or categories');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this puzzle?')) return;
    try {
      await deletePuzzle(id);
      setPuzzles((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete');
    }
  };

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? (cat.label || cat.name || cat.id) : catId;
  };

  const getCellValue = (p, key) => {
    if (key === 'category') return getCategoryName(p.category);
    if (key === 'pairs') return p.data?.pairs || '';
    if (key === 'items') return p.data?.items || '';
    if (key === 'draggables') return p.data?.draggables || '';
    if (key === 'targets') return p.data?.targets || '';
    return p[key] || '';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Traditional Puzzles (Drag & Drop)</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <Link to="/admin/add-puzzle" className="bg-green-600 text-white px-3 py-1 rounded inline-block">
            + Add Traditional Puzzle
          </Link>
          <Link to="/admin/create-visual-puzzle" className="bg-purple-600 text-white px-3 py-1 rounded inline-block">
            + Create Visual Puzzle
          </Link>
        </div>
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            {PUZZLE_COLUMNS.map(col => (
              <th key={col.key} className="p-2">{col.label}</th>
            ))}
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {puzzles.map((p) => (
            <tr key={p.id} className="border-t">
              {PUZZLE_COLUMNS.map(col => (
                <td key={col.key} className="p-2">{getCellValue(p, col.key)}</td>
              ))}
              <td className="p-2">
                <Link to={`/admin/add-puzzle/${p.id}`} className="text-blue-600 mr-2">Edit</Link>
                <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </AdminLayout>
  );
}

export default PuzzleListPage;
