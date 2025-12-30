import React from 'react';
import { Button } from '../../components/ui';

function TablePagination({ 
  totalItems, 
  itemsPerPage, 
  onItemsPerPageChange, 
  currentPage, 
  onPageChange 
}) {
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(totalItems / parseInt(itemsPerPage));
  const itemsPerPageOptions = [10, 20, 30, 50, 100];

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  if (totalItems === 0) {
    return null;
  }

  const startItem = itemsPerPage === 'all' ? 1 : (currentPage - 1) * parseInt(itemsPerPage) + 1;
  const endItem = itemsPerPage === 'all' ? totalItems : Math.min(currentPage * parseInt(itemsPerPage), totalItems);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 0',
      borderTop: '1px solid #e2e8f0',
      marginTop: '16px',
      flexWrap: 'wrap',
      gap: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>
          Items per page:
        </label>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            onItemsPerPageChange(e.target.value);
            onPageChange(1); // Reset to page 1 when changing items per page
          }}
          style={{
            padding: '8px 12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
            minWidth: '80px'
          }}
        >
          {itemsPerPageOptions.map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
          <option value="all">All</option>
        </select>
      </div>

      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
        Showing {startItem} to {endItem} of {totalItems} items
      </div>

      {itemsPerPage !== 'all' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '6px 12px',
              minWidth: 'auto'
            }}
          >
            ← Back
          </Button>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', minWidth: '60px', textAlign: 'center' }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '6px 12px',
              minWidth: 'auto'
            }}
          >
            Next →
          </Button>
        </div>
      )}
    </div>
  );
}

export default TablePagination;
