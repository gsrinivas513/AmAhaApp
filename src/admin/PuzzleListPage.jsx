import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { getAllPuzzles } from '../quiz/services/puzzleService';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Button, Card, Modal, Input } from '../components/ui';
import TablePagination from './components/TablePagination';

function PuzzleListPage() {
  const [puzzles, setPuzzles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortColumn, setSortColumn] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState(null); // For tabs
  const [itemsPerPage, setItemsPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('view'); // 'view' or 'edit'
  const [selectedPuzzle, setSelectedPuzzle] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  // Auto-select first puzzle category when categories load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      const puzzleCategories = categories.filter(c => c.featureId === 'puzzles' && c.uiMode === 'puzzle');
      if (puzzleCategories.length > 0) {
        setSelectedCategory(puzzleCategories[0].id);
      }
    }
  }, [categories, selectedCategory]);

  const load = async () => {
    try {
      const [catSnap, topicsSnap, subtopicsSnap] = await Promise.all([
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'topics')),
        getDocs(collection(db, 'subtopics')),
      ]);
      
      // Get categories
      const allCategories = catSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCategories(allCategories);
      
      // Get topics
      const allTopics = topicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTopics(allTopics);
      
      // Get puzzle subtopics (puzzles are represented as subtopics with featureId: 'puzzles')
      const allSubtopics = subtopicsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      const puzzleSubtopics = allSubtopics.filter(s => s.featureId === 'puzzles');
      
      // Get actual puzzle documents from puzzles collection
      const puzzleDocuments = await getAllPuzzles();
      
      // Helper to get category name from topic
      const getCatName = (topicId) => {
        const topic = allTopics.find(t => t.id === topicId);
        if (topic && topic.categoryId) {
          const cat = allCategories.find(c => c.id === topic.categoryId);
          return cat ? (cat.label || cat.name) : 'Unknown';
        }
        return 'Unknown';
      };
      
      // Prioritize actual puzzle documents, fallback to subtopics for reference
      const mergedPuzzles = [
        // First, add all actual puzzle documents from the puzzles collection
        ...puzzleDocuments.map(doc => {
          const topic = allTopics.find(t => t.id === doc.topicId);
          const category = allCategories.find(c => c.id === doc.categoryId);
          return {
            id: doc.id, // Real Firestore document ID (e.g., sgB9XCIvYhZPJQlS1xtF)
            title: doc.title,
            type: doc.type,
            description: doc.description || '',
            difficulty: doc.difficulty || 'medium',
            ageGroup: doc.ageGroup || 'all',
            topicId: doc.topicId,
            topicName: topic?.name || 'Unknown',
            categoryId: doc.categoryId,
            category: category?.id || 'unknown',
            subtopicId: doc.subtopicId,
            createdAt: doc.createdAt,
            source: 'puzzle-document'
          };
        })
      ];

      // Deduplicate: Keep only the most recently created puzzle per subtopicId
      const deduplicatedPuzzles = [];
      const seenSubtopics = new Set();
      
      // Sort by createdAt (most recent first)
      const sortedPuzzles = [...mergedPuzzles].sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      // Keep first occurrence of each subtopicId
      for (const puzzle of sortedPuzzles) {
        if (!seenSubtopics.has(puzzle.subtopicId)) {
          seenSubtopics.add(puzzle.subtopicId);
          deduplicatedPuzzles.push(puzzle);
        }
      }
      
      setPuzzles(deduplicatedPuzzles);
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
    
    // Filter by selected tab category
    const matchesTabCategory = !selectedCategory || p.categoryId === selectedCategory;

    return matchesSearch && matchesType && matchesCategory && matchesTabCategory;
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

  // Pagination logic
  const itemsToDisplay = itemsPerPage === 'all' ? sortedPuzzles.length : parseInt(itemsPerPage);
  const totalPages = Math.ceil(sortedPuzzles.length / itemsToDisplay);
  const startIndex = (currentPage - 1) * itemsToDisplay;
  const endIndex = Math.min(startIndex + itemsToDisplay, sortedPuzzles.length);
  const paginatedPuzzles = sortedPuzzles.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterCategory, selectedCategory]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this puzzle? This action cannot be undone.')) return;
    try {
      console.log("🗑️ Deleting puzzle:", id);
      await deleteDoc(doc(db, 'puzzles', id));
      setPuzzles((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((qid) => qid !== id));
      console.log("✅ Puzzle deleted successfully");
      alert('✅ Puzzle deleted successfully');
    } catch (err) {
      console.error('❌ Delete error:', err);
      alert('Failed to delete puzzle: ' + err.message);
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedIds.length === 0) {
      alert('Select puzzles to delete');
      return;
    }
    if (!window.confirm(`Delete ${selectedIds.length} puzzle(s)? This action cannot be undone.`)) return;
    
    try {
      console.log("🗑️ Deleting puzzles:", selectedIds);
      let successCount = 0;
      let failureCount = 0;

      for (const id of selectedIds) {
        try {
          await deleteDoc(doc(db, 'puzzles', id));
          successCount++;
          console.log(`✅ Deleted puzzle: ${id}`);
        } catch (err) {
          failureCount++;
          console.error(`❌ Failed to delete puzzle ${id}:`, err);
        }
      }

      // Update local state
      setPuzzles((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);

      // Show result
      if (failureCount === 0) {
        alert(`✅ Successfully deleted ${successCount} puzzle(s)`);
      } else {
        alert(`⚠️ Deleted ${successCount} puzzle(s), but failed to delete ${failureCount}`);
      }
    } catch (err) {
      console.error('❌ Bulk delete error:', err);
      alert('Failed to delete puzzles: ' + err.message);
    }
  };

  // View puzzle details
  const handleView = (puzzle) => {
    setSelectedPuzzle(puzzle);
    setDialogMode('view');
    setShowDialog(true);
  };

  // Edit puzzle
  const handleEdit = (puzzle) => {
    setSelectedPuzzle(puzzle);
    setEditForm({ ...puzzle });
    setDialogMode('edit');
    setShowDialog(true);
  };

  // Save edited puzzle
  const handleSave = async () => {
    if (!selectedPuzzle) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'puzzles', selectedPuzzle.id), {
        ...editForm,
        updatedAt: new Date().toISOString()
      });
      // Update local state
      setPuzzles(prev => prev.map(p => 
        p.id === selectedPuzzle.id ? { ...p, ...editForm } : p
      ));
      setShowDialog(false);
      alert('Puzzle updated successfully!');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const closeDialog = () => {
    setShowDialog(false);
    setSelectedPuzzle(null);
    setEditForm({});
  };

  if (loading) return <AdminLayout><div style={{ padding: 24 }}>Loading...</div></AdminLayout>;
  if (error) return <AdminLayout><div style={{ padding: 24, color: '#dc2626' }}>{error}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div style={{ padding: 0 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>🧩 View All Puzzles</h1>
          <p style={{ color: '#64748b', marginBottom: 16, fontSize: 14 }}>
            Use filters below to find specific puzzles.
          </p>
        </div>

        {/* Category Tabs */}
        {categories.filter(c => c.featureId === 'puzzles' && c.uiMode === 'puzzle').length > 0 && (
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '0px',
            overflowX: 'auto',
            paddingRight: '8px'
          }}>
            {categories
              .filter(c => c.featureId === 'puzzles' && c.uiMode === 'puzzle')
              .map((cat) => {
                const catPuzzleCount = puzzles.filter(p => p.categoryId === cat.id).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '12px 16px',
                      background: isSelected ? '#10b981' : 'transparent',
                      color: isSelected ? 'white' : '#64748b',
                      border: 'none',
                      borderBottom: isSelected ? '3px solid #059669' : '3px solid transparent',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: isSelected ? 600 : 500,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat.label || cat.name} <span style={{ fontSize: '12px', opacity: 0.8 }}>({catPuzzleCount})</span>
                  </button>
                );
              })}
          </div>
        )}

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
              <TablePagination
                totalItems={sortedPuzzles.length}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={setItemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
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
                        paginatedPuzzles.length > 0 &&
                        paginatedPuzzles.every((p) => selectedIds.includes(p.id))
                      }
                      onChange={(e) => {
                        setSelectedIds((prev) => {
                          if (e.target.checked) {
                            return [
                              ...prev,
                              ...paginatedPuzzles
                                .map((p) => p.id)
                                .filter((id) => !prev.includes(id)),
                            ];
                          } else {
                            return prev.filter(
                              (id) => !paginatedPuzzles.map((p) => p.id).includes(id)
                            );
                          }
                        });
                      }}
                    />
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
                    Feature <SortIndicator column="type" />
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
                    Topic
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>
                    Subtopic
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
                    Name <SortIndicator column="title" />
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>
                    Document ID
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>
                    Created
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>
                    Last Updated
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>
                    XP Reward
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>
                    Difficulty
                  </th>
                  <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>
                    Age Group
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
                {paginatedPuzzles.map((p) => (
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
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ fontSize: 12, color: '#475569' }}>
                        {p.topicName || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '11px', color: '#64748b', maxWidth: '150px' }}>
                      {p.subtopicId || '-'}
                    </td>
                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>
                      {p.title || '-'}
                    </td>
                    <td style={{ padding: '12px 8px', fontFamily: 'monospace', fontSize: '11px', color: '#475569', maxWidth: '180px' }}>
                      <button 
                        title={`Click to edit puzzle: ${p.id}`}
                        onClick={() => {
                          // Redirect to edit page with puzzle ID and type
                          window.location.href = `/admin/create-visual-puzzle?id=${p.id}&type=${p.type}`;
                        }}
                        style={{ 
                          cursor: 'pointer', 
                          color: '#3b82f6', 
                          textDecoration: 'underline',
                          background: 'none',
                          border: 'none',
                          padding: '0',
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '100%'
                        }}
                      >
                        {p.id}
                      </button>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        fontSize: 11,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: p.isPublished ? '#dcfce7' : '#fee2e2',
                        color: p.isPublished ? '#15803d' : '#991b1b',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}>
                        {p.isPublished ? '✓ Published' : '○ Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {p.createdAt ? new Date(p.createdAt.seconds ? p.createdAt.seconds * 1000 : p.createdAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {p.updatedAt ? new Date(p.updatedAt.seconds ? p.updatedAt.seconds * 1000 : p.updatedAt).toLocaleString('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>
                        {p.xpReward || '0'} 🎯
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: p.difficulty === 'hard' ? '#fee2e2' : p.difficulty === 'medium' ? '#fef3c7' : '#d1fae5',
                        color: p.difficulty === 'hard' ? '#991b1b' : p.difficulty === 'medium' ? '#92400e' : '#065f46',
                        fontWeight: 600
                      }}>
                        {p.difficulty || 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ fontSize: 12, color: '#475569' }}>
                        {p.ageGroup || '-'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', maxWidth: '250px', wordWrap: 'break-word' }}>
                      <div style={{ fontSize: 12, color: '#64748b', maxHeight: '60px', overflow: 'hidden' }}>
                        {p.description || '-'}
                      </div>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Button size="sm" style={{ background: '#3b82f6' }} onClick={() => handleView(p)}>
                          👁️ View
                        </Button>
                        <Button size="sm" style={{ background: '#f59e0b' }} onClick={() => handleEdit(p)}>
                          ✏️ Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(p.id)}>
                          🗑️
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

      {/* View/Edit Dialog */}
      {showDialog && selectedPuzzle && (
        <Modal 
          title={dialogMode === 'view' ? `📋 Puzzle Details: ${selectedPuzzle.title}` : `✏️ Edit Puzzle: ${selectedPuzzle.title}`}
          onClose={closeDialog}
        >
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {dialogMode === 'view' ? (
              // VIEW MODE
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>ID</label>
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                      {selectedPuzzle.id}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Type</label>
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                      {selectedPuzzle.type}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Title</label>
                  <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                    {selectedPuzzle.title}
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Description</label>
                  <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                    {selectedPuzzle.description || '-'}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Category</label>
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                      {getCategoryName(selectedPuzzle.category)}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Topic</label>
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                      {selectedPuzzle.topic || '-'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Difficulty</label>
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                      {selectedPuzzle.difficulty || '-'}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Published</label>
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                      {selectedPuzzle.isPublished ? '✅ Yes' : '❌ No'}
                    </div>
                  </div>
                </div>

                {selectedPuzzle.imageUrl && (
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Image</label>
                    <img 
                      src={selectedPuzzle.imageUrl} 
                      alt="Puzzle" 
                      style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginTop: 8 }}
                    />
                  </div>
                )}

                {selectedPuzzle.correctAnswer && (
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Correct Answer</label>
                    <div style={{ padding: '8px 12px', background: '#dcfce7', borderRadius: 6, fontSize: 13, color: '#166534' }}>
                      {selectedPuzzle.correctAnswer}
                    </div>
                  </div>
                )}

                {selectedPuzzle.hints && selectedPuzzle.hints.length > 0 && (
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Hints</label>
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
                      {selectedPuzzle.hints.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                )}

                {selectedPuzzle.items && (
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Items</label>
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                      {JSON.stringify(selectedPuzzle.items, null, 2)}
                    </div>
                  </div>
                )}

                {selectedPuzzle.pairs && (
                  <div>
                    <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Pairs</label>
                    <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                      {JSON.stringify(selectedPuzzle.pairs, null, 2)}
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ fontWeight: 600, fontSize: 12, color: '#64748b' }}>Created At</label>
                  <div style={{ padding: '8px 12px', background: '#f1f5f9', borderRadius: 6, fontSize: 13 }}>
                    {selectedPuzzle.createdAt || '-'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <Button onClick={() => { setDialogMode('edit'); setEditForm({...selectedPuzzle}); }} style={{ flex: 1 }}>
                    ✏️ Switch to Edit Mode
                  </Button>
                  <Button onClick={closeDialog} style={{ flex: 1, background: '#94a3b8' }}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              // EDIT MODE
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Input
                  label="Title"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                />

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Description</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      minHeight: 80,
                      fontSize: 14
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Type</label>
                    <select
                      value={editForm.type || ''}
                      onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        fontSize: 14
                      }}
                    >
                      <option value="picture-word">Picture Word</option>
                      <option value="spot-difference">Spot Difference</option>
                      <option value="find-pairs">Find Pairs</option>
                      <option value="picture-shadow">Picture Shadow</option>
                      <option value="matching-pairs">Matching Pairs</option>
                      <option value="ordering">Ordering</option>
                      <option value="drag-drop">Drag & Drop</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Difficulty</label>
                    <select
                      value={editForm.difficulty || 'easy'}
                      onChange={(e) => setEditForm({...editForm, difficulty: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        fontSize: 14
                      }}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Category</label>
                    <select
                      value={editForm.category || ''}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        fontSize: 14
                      }}
                    >
                      <option value="visual-puzzles">Visual Puzzles</option>
                      <option value="traditional-puzzles">Traditional Puzzles</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>Published</label>
                    <select
                      value={editForm.isPublished ? 'true' : 'false'}
                      onChange={(e) => setEditForm({...editForm, isPublished: e.target.value === 'true'})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: 6,
                        fontSize: 14
                      }}
                    >
                      <option value="true">Yes - Published</option>
                      <option value="false">No - Draft</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Image URL"
                  value={editForm.imageUrl || ''}
                  onChange={(e) => setEditForm({...editForm, imageUrl: e.target.value})}
                  placeholder="https://..."
                />

                {editForm.imageUrl && (
                  <img 
                    src={editForm.imageUrl} 
                    alt="Preview" 
                    style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8 }}
                  />
                )}

                <Input
                  label="Correct Answer (for picture-word type)"
                  value={editForm.correctAnswer || ''}
                  onChange={(e) => setEditForm({...editForm, correctAnswer: e.target.value})}
                />

                <div>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: 14 }}>
                    Items/Pairs (JSON format)
                  </label>
                  <textarea
                    value={JSON.stringify(editForm.items || editForm.pairs || editForm.correctOrder || [], null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value);
                        if (editForm.items) setEditForm({...editForm, items: parsed});
                        else if (editForm.pairs) setEditForm({...editForm, pairs: parsed});
                        else if (editForm.correctOrder) setEditForm({...editForm, correctOrder: parsed});
                      } catch (err) {
                        // Invalid JSON, ignore
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      minHeight: 100,
                      fontSize: 12,
                      fontFamily: 'monospace'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    style={{ flex: 1, background: '#10b981' }}
                  >
                    {saving ? '⏳ Saving...' : '💾 Save Changes'}
                  </Button>
                  <Button onClick={() => setDialogMode('view')} style={{ flex: 1, background: '#3b82f6' }}>
                    👁️ View Mode
                  </Button>
                  <Button onClick={closeDialog} style={{ flex: 1, background: '#94a3b8' }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

export default PuzzleListPage;
