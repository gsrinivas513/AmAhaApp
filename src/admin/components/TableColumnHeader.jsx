import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * TableColumnHeader Component
 * Provides sortable and filterable column headers for admin tables
 */
export const TableColumnHeader = ({
  label,
  sortKey,
  currentSort,
  onSort,
  onFilter,
  filterValue,
  filterOptions = [],
  showFilter = false,
  isNumeric = false,
  isDate = false,
}) => {
  const { theme } = useTheme();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const isSorted = currentSort?.key === sortKey;
  const isAscending = currentSort?.key === sortKey && currentSort?.direction === 'asc';

  const handleSort = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    let direction = 'asc';
    if (isSorted && isAscending) {
      direction = 'desc';
    }
    
    onSort?.({ key: sortKey, direction });
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
      }}
      onClick={handleSort}
    >
      {/* Label */}
      <span style={{
        fontWeight: isSorted ? '700' : '600',
        color: isSorted ? theme.accentPrimary : theme.textPrimary,
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}>
        {label}
        {/* Sort indicator */}
        <span style={{
          display: 'inline-flex',
          fontSize: '11px',
          opacity: isSorted ? 1 : 0.5,
          transition: 'opacity 0.2s',
        }}>
          {isSorted ? (
            isAscending ? '↑' : '↓'
          ) : (
            '⇅'
          )}
        </span>
      </span>

      {/* Filter button */}
      {showFilter && filterOptions.length > 0 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowFilterDropdown(!showFilterDropdown);
          }}
          style={{
            background: filterValue ? `${theme.accentPrimary}30` : 'transparent',
            border: `1px solid ${filterValue ? theme.accentPrimary : theme.border}`,
            borderRadius: '4px',
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: '12px',
            color: filterValue ? theme.accentPrimary : theme.textSecondary,
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          title="Filter by this column"
        >
          🔍 {filterValue ? '✓' : ''}
        </button>
      )}

      {/* Filter dropdown */}
      {showFilterDropdown && filterOptions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: theme.surfacePrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: '8px',
            padding: '8px',
            minWidth: '180px',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 100,
            marginTop: '4px',
            boxShadow: `0 8px 16px rgba(0,0,0,0.2)`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Clear filter option */}
          <div
            onClick={() => {
              onFilter?.(null);
              setShowFilterDropdown(false);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              background: !filterValue ? theme.accentPrimary : 'transparent',
              color: !filterValue ? '#fff' : theme.textPrimary,
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '4px',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              if (filterValue) {
                e.currentTarget.style.background = `${theme.accentPrimary}20`;
              }
            }}
            onMouseOut={(e) => {
              if (filterValue) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            Clear Filter
          </div>

          {/* Filter options */}
          {filterOptions.map((option, idx) => (
            <div
              key={idx}
              onClick={() => {
                onFilter?.(option.value);
                setShowFilterDropdown(false);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                background: filterValue === option.value ? `${theme.accentPrimary}30` : 'transparent',
                color: filterValue === option.value ? theme.accentPrimary : theme.textPrimary,
                fontSize: '12px',
                fontWeight: filterValue === option.value ? '600' : '500',
                marginBottom: '4px',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                if (filterValue !== option.value) {
                  e.currentTarget.style.background = `${theme.border}`;
                }
              }}
              onMouseOut={(e) => {
                if (filterValue !== option.value) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {filterValue === option.value && <span>✓</span>}
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Helper function to generate filter options from data
 */
export const generateFilterOptions = (items, field) => {
  const uniqueValues = [...new Set(items?.map(item => item?.[field]).filter(Boolean))];
  return uniqueValues
    .sort((a, b) => String(a).localeCompare(String(b)))
    .map(val => ({
      value: val,
      label: String(val),
    }));
};

export default TableColumnHeader;
