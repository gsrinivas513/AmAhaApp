/**
 * Table Data Manipulation Utilities
 * Provides robust sorting and filtering for admin tables
 */

/**
 * Sort data by column
 * @param {Array} data - Data to sort
 * @param {Object} sortConfig - { key: string, direction: 'asc'|'desc' }
 * @returns {Array} - Sorted data
 */
export const sortData = (data, sortConfig) => {
  if (!sortConfig?.key) return data;

  const sorted = [...data].sort((a, b) => {
    const aVal = a?.[sortConfig.key];
    const bVal = b?.[sortConfig.key];

    // Handle null/undefined
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    // Handle dates
    if (aVal instanceof Date || (typeof aVal === 'object' && aVal?.toDate)) {
      const dateA = aVal instanceof Date ? aVal : aVal?.toDate?.() || new Date(0);
      const dateB = bVal instanceof Date ? bVal : bVal?.toDate?.() || new Date(0);
      return sortConfig.direction === 'asc'
        ? new Date(dateA) - new Date(dateB)
        : new Date(dateB) - new Date(dateA);
    }

    // Handle numbers
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    }

    // Handle strings
    const strA = String(aVal).toLowerCase();
    const strB = String(bVal).toLowerCase();
    const comparison = strA.localeCompare(strB);
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

/**
 * Filter data by column
 * @param {Array} data - Data to filter
 * @param {Object} filters - { columnKey: value, ... }
 * @returns {Array} - Filtered data
 */
export const filterDataByColumn = (data, filters) => {
  if (!filters || Object.keys(filters).length === 0) return data;

  return data.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      
      const itemValue = item?.[key];
      
      // Array match
      if (Array.isArray(value)) {
        return value.includes(itemValue);
      }

      // String match (case-insensitive)
      if (typeof itemValue === 'string' && typeof value === 'string') {
        return itemValue.toLowerCase() === value.toLowerCase();
      }

      // Direct match
      return itemValue === value;
    });
  });
};

/**
 * Combined sort and filter
 * @param {Array} data - Data to process
 * @param {Object} sortConfig - Sort configuration
 * @param {Object} columnFilters - Column-level filters
 * @returns {Array} - Processed data
 */
export const processTableData = (data, sortConfig, columnFilters = {}) => {
  let result = filterDataByColumn(data, columnFilters);
  result = sortData(result, sortConfig);
  return result;
};

/**
 * Format value for display
 * @param {*} value - Value to format
 * @param {string} type - Value type ('date', 'number', 'string')
 * @returns {string} - Formatted value
 */
export const formatValue = (value, type = 'string') => {
  if (value == null) return '-';

  switch (type) {
    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString();
      }
      if (value?.toDate) {
        return value.toDate().toLocaleDateString();
      }
      return String(value);

    case 'number':
      return Number(value).toLocaleString();

    case 'boolean':
      return value ? '✓ Yes' : '✗ No';

    default:
      return String(value);
  }
};

/**
 * Get unique values from column (for filter options)
 * @param {Array} data - Source data
 * @param {string} column - Column name
 * @returns {Array} - Unique values
 */
export const getUniqueValues = (data, column) => {
  const values = data
    ?.map(item => item?.[column])
    .filter(Boolean);

  return [...new Set(values)]
    .sort((a, b) => String(a).localeCompare(String(b)));
};

const tableUtils = {
  sortData,
  filterDataByColumn,
  processTableData,
  formatValue,
  getUniqueValues,
};

export default tableUtils;
