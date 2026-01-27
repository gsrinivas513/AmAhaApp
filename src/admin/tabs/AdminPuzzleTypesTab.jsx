import React, { useState, useEffect } from 'react';
import AddEditQuizTypeModal from '../modals/AddEditQuizTypeModal';
import PuzzleTypeCard from '../components/PuzzleTypeCard';
import {
  getAllPuzzleTypes,
  createPuzzleType,
  updatePuzzleType,
  deactivatePuzzleType,
  deletePuzzleType,
  getPuzzleTypeStatistics,
  initializeDefaultPuzzleTypes,
} from '../../services/puzzleTypesService';

/**
 * AdminPuzzleTypesTab - Manage puzzle types with full CRUD operations
 */
export default function AdminPuzzleTypesTab({ theme }) {
  const [types, setTypes] = useState([]);
  const [filteredTypes, setFilteredTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [stats, setStats] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  // Load types on mount
  useEffect(() => {
    loadTypes();
    loadStats();
  }, []);

  // Filter types when data or filters change
  useEffect(() => {
    filterTypes();
  }, [types, searchQuery, showInactive]);

  const loadTypes = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to initialize default types if empty
      try {
        await initializeDefaultPuzzleTypes();
      } catch (initErr) {
        console.warn('Could not initialize default puzzle types:', initErr);
      }

      const data = await getAllPuzzleTypes(!showInactive);
      // No filtering needed - getAllPuzzleTypes returns ALL puzzle types
      setTypes(data || []);
    } catch (err) {
      setError(`Failed to load puzzle types: ${err.message}`);
      console.error('Error loading puzzle types:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statistics = await getPuzzleTypeStatistics();
      setStats(statistics);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const filterTypes = () => {
    let filtered = types;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(query) ||
          t.label.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query)
      );
    }

    // Active filter
    if (!showInactive) {
      filtered = filtered.filter((t) => t.isActive);
    }

    setFilteredTypes(filtered);
  };

  const handleAddNew = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const handleEdit = (type) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const handleSave = async (typeData) => {
    try {
      setLoading(true);
      const userId = 'admin'; // Should get from auth

      if (editingType?.docId) {
        // Update existing
        await updatePuzzleType(editingType.docId, typeData, userId);
      } else {
        // Create new
        await createPuzzleType(typeData, userId);
      }

      setIsModalOpen(false);
      setEditingType(null);
      await loadTypes();
      await loadStats();
    } catch (err) {
      setError(`Failed to save type: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type) => {
    if (!window.confirm(`Delete ${type.label}? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      await deletePuzzleType(type.docId);
      await loadTypes();
      await loadStats();
    } catch (err) {
      setError(`Failed to delete type: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (type) => {
    try {
      setLoading(true);
      const userId = 'admin';
      await updatePuzzleType(type.docId, { isActive: true }, userId);
      await loadTypes();
      await loadStats();
    } catch (err) {
      setError(`Failed to activate type: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (type) => {
    try {
      setLoading(true);
      const userId = 'admin';
      await deactivatePuzzleType(type.docId, userId);
      await loadTypes();
      await loadStats();
    } catch (err) {
      setError(`Failed to deactivate type: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '24px',
        background: theme?.surfaceSecondary || '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              color: theme?.textPrimary || '#333',
              fontSize: '24px',
              fontWeight: '700',
              margin: '0 0 8px 0',
            }}
          >
            🧩 Puzzle Types Management
          </h1>
          <p
            style={{
              color: theme?.textSecondary || '#666',
              fontSize: '14px',
              margin: 0,
            }}
          >
            Manage all puzzle types: Find Pairs, Ordering, Picture Shadow, Picture Word, Spot Difference, Jigsaw, Crossword, Word Search, Sudoku, and more
          </p>
        </div>
        <button
          onClick={handleAddNew}
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: theme?.accentPrimary || '#007AFF',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          + Add New Puzzle Type
        </button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              padding: '16px',
              background: theme?.surfacePrimary || '#fff',
              borderRadius: '8px',
              border: `1px solid ${theme?.border || '#e0e0e0'}`,
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: theme?.textSecondary || '#999',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Total Puzzle Types
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: theme?.textPrimary || '#333',
              }}
            >
              {types.length}
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              background: theme?.surfacePrimary || '#fff',
              borderRadius: '8px',
              border: `1px solid ${theme?.border || '#e0e0e0'}`,
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: theme?.textSecondary || '#999',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Active Types
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: '#4CAF50',
              }}
            >
              {types.filter((t) => t.isActive).length}
            </div>
          </div>

          <div
            style={{
              padding: '16px',
              background: theme?.surfacePrimary || '#fff',
              borderRadius: '8px',
              border: `1px solid ${theme?.border || '#e0e0e0'}`,
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: theme?.textSecondary || '#999',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Total Usage
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: theme?.accentPrimary || '#007AFF',
              }}
            >
              {types.reduce((sum, t) => sum + (t.metadata?.usageCount || 0), 0)}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          padding: '16px',
          background: theme?.surfacePrimary || '#fff',
          borderRadius: '8px',
          marginBottom: '24px',
          border: `1px solid ${theme?.border || '#e0e0e0'}`,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            alignItems: 'end',
          }}
        >
          {/* Search */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: theme?.textPrimary || '#333',
                marginBottom: '8px',
                textTransform: 'uppercase',
              }}
            >
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: `1px solid ${theme?.border || '#ddd'}`,
                borderRadius: '6px',
                background: theme?.surfaceSecondary || '#f9f9f9',
                color: theme?.textPrimary || '#333',
                fontSize: '14px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Show Inactive Toggle */}
          <div>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: theme?.textPrimary || '#333',
              }}
            >
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Show Inactive Types
            </label>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            padding: '12px 16px',
            background: '#FFEBEE',
            border: '1px solid #EF5350',
            borderRadius: '6px',
            color: '#C62828',
            marginBottom: '24px',
            fontSize: '14px',
          }}
        >
          {error}
        </div>
      )}

      {/* Types Grid */}
      {loading ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: theme?.textSecondary || '#666',
          }}
        >
          Loading puzzle types...
        </div>
      ) : filteredTypes.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: theme?.textSecondary || '#666',
          }}
        >
          No puzzle types found.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
          }}
        >
          {filteredTypes.map((type) => (
            <PuzzleTypeCard
              key={type.docId}
              type={type}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onActivate={handleActivate}
              onDeactivate={handleDeactivate}
              isSystem={type.isSystem}
              theme={theme}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AddEditQuizTypeModal
        isOpen={isModalOpen}
        type={editingType}
        onSave={handleSave}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingType(null);
        }}
        theme={theme}
      />
    </div>
  );
}
