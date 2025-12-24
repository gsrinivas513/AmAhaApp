import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAllPuzzles, deletePuzzle } from '../quiz/services/puzzleService';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Button, Card } from '../components/ui';

function PuzzleListPage() {
  const [puzzles, setPuzzles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortColumn, setSortColumn] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [puzzlesData, catSnap] = await Promise.all([
        getAllPuzzles(),
        getDocs(collection(db, 'categories')),
      ]);
      setPuzzles(puzzlesData);
      setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setError('Failed to load puzzles or categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? (cat.label || cat.name || cat.id) : catId;
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortIndicator = ({ column }) => {
    if (sortColumn !== column) return null;
    return <span style={{ marginLeft: '4px' }}>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  const filteredPuzzles = puzzles.filter((p) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      p.title?.toLowerCase().includes(searchLower) ||
      p.description?.toLowerCase().includes(searchLower);

    const matchesType = !filterType || p.type === filterType;
    const matchesCategory = !filterCategory || getCategoryName(p.category) === filterCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  const sortedPuzzles = [...filteredPuzzles].sort((a, b) => {
    let aVal = '';
    let bVal = '';

    switch (sortColumn) {
      case 'title':
        aVal = a.title || '';
        bVal = b.title || '';
        break;
      case 'type':
        aVal = a.type || '';
        bVal = b.type || '';
        break;
      case 'category':
        aVal = getCategoryName(a.category);
        bVal = getCategoryName(b.category);
        break;
      case 'topic':
        aVal = a.topic || '';
        bVal = b.topic || '';
        break;
      default:
        return 0;
    }

    return sortDirection === 'asc' 
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this puzzle?')) return;
    try {
      await deleteDoc(doc(db, 'puzzles', id));
      setPuzzles((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((qid) => qid !== id));
    } catch (err) {
      alert('Failed to delete puzzle');
      console.error(err);
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedIds.length === 0) {
      alert('Select puzzles to delete');
      return;
    }
    if (!window.confirm(`Delete ${selectedIds.length} puzzle(s)?`)) return;
    
    try {
      for (const id of selectedIds) {
        await deleteDoc(doc(db, 'puzzles', id));
      }
      setPuzzles((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    } catch (err) {
      alert('Failed to delete puzzles');
      console.error(err);
    }
  };

  if (loading) return <AdminLayout><div style={{ padding: 24 }}>Loading...</div></AdminLayout>;
  if (error) return <AdminLayout><div style={{ padding: 24, color: '#dc2626' }}>{error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ padding: 0 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>🧩 Puzzle Manager</h1>
          <p style={{ color: '#64748b', marginBottom: 16, fontSize: 14 }}>
            Manage all traditional and visual puzzles. Use filters below to find specific puzzles.
          </p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <Link to="/admin/add-puzzle" style={{ textDecoration: 'none' }}>
              <Button style={{ background: '#10b981' }}>+ Add Traditional Puzzle</Button>
            </Link>
            <Link to="/admin/create-visual-puzzle" style={{ textDecoration: 'none' }}>
              <Button style={{ background: '#a855f7' }}>+ Create Visual Puzzle</Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card style={{ marginBottom: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Filter & Search</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 12
            }}>
              <input
                type="text"
                placeholder="Search puzzles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: 13
                }}
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: 13
                }}
              >
                <option value="">All Types</option>
                {[...new Set(puzzles.map(p => p.type))].map(t => (
                  <option key={t} value={t}>{t || 'Unknown'}</option>
                ))}
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: 13
                }}
              >
                <option value="">All Categories</option>
                {[...new Set(puzzles.map(p => getCategoryName(p.category)))].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            fontSize: 13,
            color: "#64748b"
          }}>
            <div>
              {selectedIds.length > 0 && (
                <Button variant="danger" size="sm" onClick={handleDeleteMultiple} style={{ marginRight: 12 }}>
                  Delete {selectedIds.length} Selected
                </Button>
              )}
            </div>
            <div>
              Showing {sortedPuzzles.length} of {puzzles.length} puzzles
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '1000px', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px 8px', textAlign: 'left', width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={
                        sortedPuzzles.length > 0 &&
                        selectedIds.length === sortedPuzzles.length
                      }
                      onChange={(e) =>
                        setSelectedIds(
                          e.target.checked ? sortedPuzzles.map((p) => p.id) : []
                        )
                      }
                    />
                  </th>
                  <th 
                    style={{ 
                      padding: '12px 8px', 
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: sortColumn === 'title' ? '#e0f2fe' : 'transparent',
                      fontWeight: 600
                    }}
                    onClick={() => handleSort('title')}
                  >
                    Title <SortIndicator column="title" />
                  </th>
                  <th 
                    style={{ 
                      padding: '12px 8px', 
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: sortColumn === 'type' ? '#e0f2fe' : 'transparent',
                      fontWeight: 600
                    }}
                    onClick={() => handleSort('type')}
                  >
                    Type <SortIndicator column="type" />
                  </th>
                  <th 
                    style={{ 
                      padding: '12px 8px', 
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: sortColumn === 'category' ? '#e0f2fe' : 'transparent',
                      fontWeight: 600
                    }}
                    onClick={() => handleSort('category')}
                  >
                    Category <SortIndicator column="category" />
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>
                    Description
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPuzzles.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', background: selectedIds.includes(p.id) ? '#f0fdf4' : 'transparent' }}>
                    <td style={{ padding: '12px 8px' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={(e) =>
                          setSelectedIds(
                            e.target.checked
                              ? [...selectedIds, p.id]
                              : selectedIds.filter((id) => id !== p.id)
                          )
                        }
                      />
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>
                      {p.title || '-'}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: 12,
                        background: '#e0f2fe',
                        color: '#0369a1'
                      }}>
                        {p.type || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ fontSize: 12, color: '#475569', fontWeight: 500 }}>
                        {getCategoryName(p.category)}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', maxWidth: '300px', wordWrap: 'break-word' }}>
                      <div style={{ fontSize: 12, color: '#64748b', maxHeight: '60px', overflow: 'hidden' }}>
                        {p.description || '-'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Link to={`/admin/add-puzzle/${p.id}`} style={{ textDecoration: 'none' }}>
                          <Button size="sm">Edit</Button>
                        </Link>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedPuzzles.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
              No puzzles found
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}

export default PuzzleListPage;
