# Implementation Guide: Applying Sort & Filter to Other Admin Tabs

This guide shows how to apply the new column sorting and filtering features to other admin tabs.

## Quick Reference

### Files Created/Modified
1. ✅ `src/admin/components/SearchFilterBar.jsx` - Enhanced with better filtering
2. ✅ `src/admin/components/TableColumnHeader.jsx` - New component for column headers
3. ✅ `src/admin/utils/tableUtils.js` - New utility functions
4. ✅ `src/admin/tabs/AdminPuzzlesTab.jsx` - Example implementation

### What Was Fixed in SearchFilterBar
- ✅ Better null/undefined handling
- ✅ Broader search across all fields
- ✅ Visibility & featured filters
- ✅ Better date handling
- ✅ Safe filtering with optional chaining

---

## Step-by-Step Implementation for Other Tabs

### Step 1: Add Imports
```jsx
import { TableColumnHeader, generateFilterOptions } from '../components/TableColumnHeader';
import { sortData } from '../utils/tableUtils';
```

### Step 2: Add State Management
```jsx
const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
```

### Step 3: Apply Sorting to Your Data
```jsx
// After SearchFilterBar filters the data, apply column sorting
const sortedAndFilteredData = sortData(filteredData, sortConfig);

// Then paginate the sorted results
const paginatedData = sortedAndFilteredData.slice(startIdx, endIdx);
```

### Step 4: Replace Static Headers with Sortable Headers
#### Before:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', ... }}>
  <div>Title</div>
  <div style={{ textAlign: 'center' }}>Type</div>
  <div style={{ textAlign: 'center' }}>Status</div>
</div>
```

#### After:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', ... }}>
  <TableColumnHeader
    label="Title"
    sortKey="title"
    currentSort={sortConfig}
    onSort={setSortConfig}
    filterOptions={generateFilterOptions(filteredData, 'title')}
    showFilter={false}
  />
  <div style={{ textAlign: 'center' }}>
    <TableColumnHeader
      label="Type"
      sortKey="type"
      currentSort={sortConfig}
      onSort={setSortConfig}
      filterOptions={generateFilterOptions(filteredData, 'type')}
      showFilter={true}
    />
  </div>
  <div style={{ textAlign: 'center' }}>
    <TableColumnHeader
      label="Status"
      sortKey="status"
      currentSort={sortConfig}
      onSort={setSortConfig}
      filterOptions={generateFilterOptions(filteredData, 'status')}
      showFilter={true}
    />
  </div>
</div>
```

### Step 5: Update Pagination Display
```jsx
// Change from:
({startIdx + 1}–{Math.min(endIdx, filteredData.length)} of {filteredData.length})

// To:
({startIdx + 1}–{Math.min(endIdx, sortedAndFilteredData.length)} of {sortedAndFilteredData.length})
```

---

## Configuration Options for TableColumnHeader

```jsx
<TableColumnHeader
  label="Column Label"              // Display name
  sortKey="fieldName"               // Database field to sort by
  currentSort={sortConfig}          // Current sort state: { key: string, direction: 'asc'|'desc' }
  onSort={setSortConfig}            // Callback when sort changes
  filterOptions={[                  // Array of filter options
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
  showFilter={true}                 // Show filter button (true|false)
  isNumeric={false}                 // Number formatting (unused but available)
  isDate={false}                    // Date formatting (unused but available)
/>
```

---

## Common Sort Keys by Tab

### AdminQuizzesTab
- `title` - Quiz title
- `difficulty` - Difficulty level
- `createdAt` - Creation date
- `updatedAt` - Last update
- `status` - Publication status

### AdminStoriesTab
- `title` - Story title
- `category` - Story category
- `audience` - Target audience
- `createdAt` - Creation date

### AdminUsersTab
- `name` - User name
- `email` - Email address
- `role` - User role
- `createdAt` - Signup date

### AdminDocumentsTab
- `title` - Document title
- `type` - Document type
- `status` - Status
- `createdAt` - Creation date

---

## Generate Filter Options

To get unique values from a column:
```jsx
import { generateFilterOptions } from '../components/TableColumnHeader';

// In your component:
const typeOptions = generateFilterOptions(filteredData, 'type');
// Returns: [{ value: 'option1', label: 'Option 1' }, ...]
```

Or use the tableUtils helper:
```jsx
import { getUniqueValues } from '../utils/tableUtils';

const uniqueTypes = getUniqueValues(filteredData, 'type');
```

---

## Advanced: Custom Sorting

For complex data types, use the tableUtils directly:

```jsx
import { sortData, processTableData } from '../utils/tableUtils';

// Just sorting
const sorted = sortData(data, { key: 'date', direction: 'desc' });

// Sorting + filtering by multiple columns
const processed = processTableData(data, 
  { key: 'status', direction: 'asc' },
  { type: 'Jigsaw', status: 'Published' }
);
```

---

## Styling & Theming

The TableColumnHeader component automatically uses your ThemeContext:
- ✅ Uses theme.accentPrimary for active sort
- ✅ Uses theme.textPrimary for labels
- ✅ Uses theme.border for inactive state
- ✅ Fully responsive and mobile-friendly

No additional styling needed!

---

## Example: Complete AdminQuizzesTab Update

Here's what the complete implementation looks like:

```jsx
import React, { useState } from 'react';
import SearchFilterBar from '../components/SearchFilterBar';
import { TableColumnHeader, generateFilterOptions } from '../components/TableColumnHeader';
import { sortData } from '../utils/tableUtils';
// ... other imports

export default function QuizzesTab({ theme, quizzes, filteredQuizzes, setFilteredQuizzes, ... }) {
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Apply sorting to already-filtered data
  const sortedQuizzes = sortData(filteredQuizzes, sortConfig);
  const totalPages = Math.ceil(sortedQuizzes.length / ITEMS_PER_PAGE);
  const paginatedQuizzes = sortedQuizzes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div>
      {/* SearchFilterBar unchanged */}
      <SearchFilterBar 
        items={quizzes}
        onFilter={setFilteredQuizzes}
        // ... other props
      />

      {/* Table with sortable headers */}
      {filteredQuizzes.length > 0 ? (
        <div>
          {/* Sortable Header Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', ... }}>
            <TableColumnHeader
              label="Title"
              sortKey="title"
              currentSort={sortConfig}
              onSort={setSortConfig}
              showFilter={false}
            />
            <div style={{ textAlign: 'center' }}>
              <TableColumnHeader
                label="Difficulty"
                sortKey="difficulty"
                currentSort={sortConfig}
                onSort={setSortConfig}
                filterOptions={generateFilterOptions(filteredQuizzes, 'difficulty')}
                showFilter={true}
              />
            </div>
            {/* ... more headers */}
          </div>

          {/* Data Rows */}
          {paginatedQuizzes.map(quiz => (
            <div key={quiz.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', ... }}>
              <div>{quiz.title}</div>
              <div>{quiz.difficulty}</div>
              {/* ... more cells */}
            </div>
          ))}

          {/* Pagination */}
          <div style={{ ... }}>
            <span>({(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sortedQuizzes.length)} of {sortedQuizzes.length})</span>
          </div>
        </div>
      ) : (
        <div>No quizzes found</div>
      )}
    </div>
  );
}
```

---

## Troubleshooting

### Column headers not showing sort indicators
- ✅ Make sure `currentSort` prop is passed correctly
- ✅ Verify `sortKey` matches your data field names

### Filters not showing options
- ✅ Pass `showFilter={true}` to TableColumnHeader
- ✅ Ensure `filterOptions` array is not empty
- ✅ Check that `generateFilterOptions()` returns data

### Sort not working
- ✅ Verify data is passed to `sortData()` function
- ✅ Check that `sortKey` matches actual field name in data
- ✅ Ensure data array is not null/undefined

### Pagination shows wrong count
- ✅ Use `sortedAndFilteredData.length` not `filteredData.length`
- ✅ Update all pagination references to use sorted data

---

## Performance Tips

1. **Memoize sorted data**:
```jsx
const sortedData = useMemo(() => sortData(filteredData, sortConfig), [filteredData, sortConfig]);
```

2. **Limit unique filter options**:
```jsx
const typeOptions = useMemo(
  () => generateFilterOptions(filteredData, 'type').slice(0, 50),
  [filteredData]
);
```

3. **Only show filters for high-cardinality columns**:
```jsx
showFilter={uniqueValues.length <= 20 && uniqueValues.length > 1}
```

---

## Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

---

**Created**: January 13, 2026
**Framework Version**: React 18+
**Status**: Ready for implementation
