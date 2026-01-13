import React from 'react';
import ImprovedFeaturesHierarchyManager from '../components/ImprovedFeaturesHierarchyManager';

export default function FeaturesTab({ theme }) {
  return (
    <div style={{
      background: theme.surfacePrimary,
      border: `2px solid ${theme.border}`,
      borderRadius: '16px',
      padding: '40px',
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          color: theme.textPrimary,
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px',
        }}>
          ✨ Features & Hierarchy
        </h2>
        <p style={{
          color: theme.textSecondary,
          fontSize: '14px',
          margin: 0,
        }}>
          Manage your content hierarchy with an intuitive tree view
        </p>
      </div>
      <ImprovedFeaturesHierarchyManager theme={theme} />
    </div>
  );
}
