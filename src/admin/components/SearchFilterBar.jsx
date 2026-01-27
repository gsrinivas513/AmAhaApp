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
  visibilityFilter = 'all',
  onVisibilityChange = () => {},
  featuredFilter = false,
  onFeaturedChange = () => {},
  onClearFilters = () => {},
}) => {
  const { theme } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('title'); // title, createdAt, updatedAt
  const [localVisibility, setLocalVisibility] = useState(visibilityFilter);
  const [localFeatured, setLocalFeatured] = useState(featuredFilter);

  // Perform filtering with proper dependency handling
  const filteredAndSorted = useMemo(() => {
    let filtered = items ? [...items] : [];

    // Search filter - search across all relevant text fields
    if (searchTerm && searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(item => {
        if (!item) return false;
        const searchableFields = [
          item.title || '',
          item.name || '',
          item.description || '',
          item.category || '',
          item.type || '',
          item.id || '',
          item.email || '',
          item.status || '',
          item.difficulty || '',
        ];
        return searchableFields.some(field => 
          String(field).toLowerCase().includes(lowercaseSearch)
        );
      });
    }

    // Category filter
    if (selectedCategory && selectedCategory.trim()) {
      filtered = filtered.filter(item =>
        item && (
          (item.category === selectedCategory) ||
          (item.type === selectedCategory) ||
          (item.categoryName === selectedCategory)
        )
      );
    }

    // Difficulty filter
    if (selectedDifficulty && selectedDifficulty.trim()) {
      filtered = filtered.filter(item => 
        item && item.difficulty === selectedDifficulty
      );
    }

    // Status filter
    if (selectedStatus && selectedStatus.trim()) {
      filtered = filtered.filter(item => 
        item && (item.status || 'Draft') === selectedStatus
      );
    }

    // Visibility filter
    if (localVisibility && localVisibility !== 'all') {
      filtered = filtered.filter(item =>
        item && (item.visibility || item.published) === localVisibility
      );
    }

    // Featured filter
    if (localFeatured) {
      filtered = filtered.filter(item =>
        item && (item.featured === true || item.isFeatured === true)
      );
    }

    // Sorting with proper date handling
    if (sortBy === 'title') {
      filtered.sort((a, b) => 
        (a?.title || a?.name || '').localeCompare(b?.title || b?.name || '')
      );
    } else if (sortBy === 'createdAt') {
      filtered.sort((a, b) => {
        const dateA = a?.createdAt instanceof Date ? a.createdAt : a?.createdAt?.toDate?.() || new Date(0);
        const dateB = b?.createdAt instanceof Date ? b.createdAt : b?.createdAt?.toDate?.() || new Date(0);
        return new Date(dateB) - new Date(dateA);
      });
    } else if (sortBy === 'updatedAt') {
      filtered.sort((a, b) => {
        const dateA = a?.updatedAt instanceof Date ? a.updatedAt : a?.updatedAt?.toDate?.() || a?.createdAt instanceof Date ? a.createdAt : a?.createdAt?.toDate?.() || new Date(0);
        const dateB = b?.updatedAt instanceof Date ? b.updatedAt : b?.updatedAt?.toDate?.() || b?.createdAt instanceof Date ? b.createdAt : b?.createdAt?.toDate?.() || new Date(0);
        return new Date(dateB) - new Date(dateA);
      });
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedStatus, localVisibility, localFeatured, sortBy, items]);

  // Call parent callback when filtered results change
  useMemo(() => {
    onFilter(filteredAndSorted);
  }, [filteredAndSorted, onFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setSelectedStatus('');
    setSortBy('title');
    setLocalVisibility('all');
    setLocalFeatured(false);
    onClearFilters();
  };

  const hasActiveFilters = searchTerm || selectedCategory || selectedDifficulty || selectedStatus || sortBy !== 'title' || localVisibility !== 'all' || localFeatured;

  return (
    <div>
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

        {/* Visibility Filter */}
        <div>
          <label style={{
            display: 'block',
            color: theme.textSecondary,
            fontSize: '11px',
            fontWeight: '600',
            marginBottom: '6px',
            textTransform: 'uppercase',
          }}>
            👁️ Visibility
          </label>
          <select
            value={localVisibility}
            onChange={(e) => {
              setLocalVisibility(e.target.value);
              onVisibilityChange(e.target.value);
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              background: theme.background,
              border: `2px solid ${localVisibility !== 'all' ? theme.accentPrimary : theme.border}`,
              borderRadius: '6px',
              color: theme.textPrimary,
              fontSize: '12px',
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
          >
            <option value="all">All</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        {/* Featured Filter */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '10px 12px',
            background: localFeatured ? `${theme.accentPrimary}25` : theme.background,
            border: `2px solid ${localFeatured ? theme.accentPrimary : theme.border}`,
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '12px',
            color: localFeatured ? theme.accentPrimary : theme.textPrimary,
            transition: 'all 0.2s',
            width: '100%',
            justifyContent: 'center',
          }}>
            <input
              type="checkbox"
              checked={localFeatured}
              onChange={(e) => {
                setLocalFeatured(e.target.checked);
                onFeaturedChange(e.target.checked);
              }}
              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
            />
            <span>⭐ Featured Only</span>
          </label>
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
