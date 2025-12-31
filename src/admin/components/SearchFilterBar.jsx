import React, { useContext, useState, useMemo } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const SearchFilterBar = ({
  items = [],
  onFilter = () => {},
  searchPlaceholder = 'Search...',
  categories = [],
  difficulties = [],
  statuses = ['Draft', 'Published', 'Archived'],
  showStatus = true,
  showDifficulty = true,
  showCategory = true,
}) => {
  const { theme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('title'); // title, createdAt, updatedAt

  // Perform filtering
  useMemo(() => {
    let filtered = items;

    // Search filter
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        (item.title && item.title.toLowerCase().includes(lowercaseSearch)) ||
        (item.description && item.description.toLowerCase().includes(lowercaseSearch)) ||
        (item.category && item.category.toLowerCase().includes(lowercaseSearch)) ||
        (item.id && item.id.toLowerCase().includes(lowercaseSearch))
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(item =>
        (item.category === selectedCategory) ||
        (item.type === selectedCategory)
      );
    }

    // Difficulty filter
    if (selectedDifficulty) {
      filtered = filtered.filter(item => item.difficulty === selectedDifficulty);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(item => (item.status || 'Draft') === selectedStatus);
    }

    // Sorting
    if (sortBy === 'title') {
      filtered = filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'createdAt') {
      filtered = filtered.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt?.toDate?.() || new Date(0);
        return new Date(dateB) - new Date(dateA); // Newest first
      });
    } else if (sortBy === 'updatedAt') {
      filtered = filtered.sort((a, b) => {
        const dateA = a.updatedAt instanceof Date ? a.updatedAt : a.updatedAt?.toDate?.() || a.createdAt instanceof Date ? a.createdAt : a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.updatedAt instanceof Date ? b.updatedAt : b.updatedAt?.toDate?.() || b.createdAt instanceof Date ? b.createdAt : b.createdAt?.toDate?.() || new Date(0);
        return new Date(dateB) - new Date(dateA); // Newest first
      });
    }

    onFilter(filtered);
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedStatus, sortBy, items, onFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSelectedStatus('');
    setSortBy('title');
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty || selectedStatus || sortBy !== 'title';

  return (
    <div style={{
      background: theme.surfacePrimary,
      border: `2px solid ${theme.border}`,
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
    }}>
      {/* Title */}
      <h3 style={{
        color: theme.textPrimary,
        fontSize: '14px',
        fontWeight: '600',
        margin: '0 0 16px 0',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        🔍 Search & Filter
      </h3>

      {/* Search Input */}
      <div style={{
        marginBottom: '16px',
      }}>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: theme.background,
            border: `2px solid ${theme.border}`,
            borderRadius: '8px',
            color: theme.textPrimary,
            fontSize: '14px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = theme.accentPrimary;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = theme.border;
          }}
        />
        <p style={{
          color: theme.textSecondary,
          fontSize: '11px',
          margin: '6px 0 0 0',
        }}>
          Search by title, description, category, or ID
        </p>
      </div>

      {/* Filter Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '16px',
      }}>
        {/* Category Filter */}
        {showCategory && categories.length > 0 && (
          <div>
            <label style={{
              display: 'block',
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}>
              📁 Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: theme.background,
                border: `2px solid ${selectedCategory ? theme.accentPrimary : theme.border}`,
                borderRadius: '6px',
                color: theme.textPrimary,
                fontSize: '12px',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}

        {/* Difficulty Filter */}
        {showDifficulty && difficulties.length > 0 && (
          <div>
            <label style={{
              display: 'block',
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}>
              ⭐ Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: theme.background,
                border: `2px solid ${selectedDifficulty ? theme.accentPrimary : theme.border}`,
                borderRadius: '6px',
                color: theme.textPrimary,
                fontSize: '12px',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <option value="">All Difficulties</option>
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        {showStatus && (
          <div>
            <label style={{
              display: 'block',
              color: theme.textSecondary,
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '6px',
              textTransform: 'uppercase',
            }}>
              📊 Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                background: theme.background,
                border: `2px solid ${selectedStatus ? theme.accentPrimary : theme.border}`,
                borderRadius: '6px',
                color: theme.textPrimary,
                fontSize: '12px',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        )}

        {/* Sorting */}
        <div>
          <label style={{
            display: 'block',
            color: theme.textSecondary,
            fontSize: '11px',
            fontWeight: '600',
            marginBottom: '6px',
            textTransform: 'uppercase',
          }}>
            📊 Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: theme.background,
              border: `2px solid ${sortBy !== 'title' ? theme.accentPrimary : theme.border}`,
              borderRadius: '6px',
              color: theme.textPrimary,
              fontSize: '12px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
          >
            <option value="title">Title (A-Z)</option>
            <option value="createdAt">Created (Newest)</option>
            <option value="updatedAt">Updated (Newest)</option>
          </select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: '#FF6B6B',
            border: `1px solid #FF6B6B`,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#FF6B6B25';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          ✕ Clear Filters
        </button>
      )}
    </div>
  );
};

export default SearchFilterBar;
