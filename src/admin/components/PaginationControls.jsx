import React from 'react';

export default function PaginationControls({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  theme,
}) {
  if (totalPages <= 1) return null;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 20px',
      borderTop: `2px solid ${theme.border}`,
      background: theme.surfaceSecondary,
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <div style={{
        color: theme.textSecondary,
        fontSize: '12px',
        fontWeight: '500',
      }}>
        Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </div>
      
      <div style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            background: currentPage === 1 ? theme.surfaceSecondary : 'transparent',
            color: currentPage === 1 ? theme.textSecondary : theme.accentPrimary,
            border: `1px solid ${currentPage === 1 ? theme.border : theme.accentPrimary}`,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          First
        </button>
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: '8px 12px',
            background: currentPage === 1 ? theme.surfaceSecondary : 'transparent',
            color: currentPage === 1 ? theme.textSecondary : theme.accentPrimary,
            border: `1px solid ${currentPage === 1 ? theme.border : theme.accentPrimary}`,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
          }}
        >
          ← Prev
        </button>
        
        <div style={{
          padding: '0 12px',
          color: theme.textPrimary,
          fontSize: '12px',
          fontWeight: '600',
        }}>
          {currentPage} / {totalPages}
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            background: currentPage === totalPages ? theme.surfaceSecondary : 'transparent',
            color: currentPage === totalPages ? theme.textSecondary : theme.accentPrimary,
            border: `1px solid ${currentPage === totalPages ? theme.border : theme.accentPrimary}`,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          Next →
        </button>
        
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 12px',
            background: currentPage === totalPages ? theme.surfaceSecondary : 'transparent',
            color: currentPage === totalPages ? theme.textSecondary : theme.accentPrimary,
            border: `1px solid ${currentPage === totalPages ? theme.border : theme.accentPrimary}`,
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
          }}
        >
          Last
        </button>
      </div>
    </div>
  );
}
