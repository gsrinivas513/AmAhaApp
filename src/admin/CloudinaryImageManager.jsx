/**
 * CloudinaryImageManager.jsx
 * Admin page to manage Cloudinary images
 * - View all images used in the website
 * - See where images are used
 * - Find duplicate images
 * - Delete unused images to control costs
 */

import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  getAllCloudinaryImages,
  findDuplicateImages,
  getImageUsageReport,
  exportImageData,
} from '../services/cloudinaryAdminService';

const CARD_STYLE = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
};

const STAT_BOX_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '16px',
  background: '#f8fafc',
  borderRadius: '8px',
  flex: 1,
};

const TABLE_STYLE = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13px',
  marginTop: '12px',
};

const TH_STYLE = {
  background: '#f1f5f9',
  padding: '10px',
  textAlign: 'left',
  fontWeight: '600',
  borderBottom: '2px solid #e2e8f0',
  color: '#334155',
};

const TD_STYLE = {
  padding: '10px',
  borderBottom: '1px solid #e2e8f0',
};

// Image preview modal style
const MODAL_OVERLAY = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const MODAL_CONTENT = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '20px',
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
};

export default function CloudinaryImageManager() {
  const [images, setImages] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview'); // overview, all, duplicates
  const [filterText, setFilterText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // For image preview modal
  
  // Advanced filters for All Images tab
  const [filters, setFilters] = useState({
    filename: '',
    imageId: '',
    source: '', // cloudinary, firebase, external, all
    uploadDateFrom: '',
    uploadDateTo: '',
    usageMin: '',
    usageMax: '',
  });

  useEffect(() => {
    loadImageData();
  }, []);

  const loadImageData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [allImages, dups, rep] = await Promise.all([
        getAllCloudinaryImages(),
        findDuplicateImages(),
        getImageUsageReport(),
      ]);

      setImages(allImages);
      setDuplicates(dups);
      setReport(rep);
    } catch (err) {
      console.error('Error loading images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await exportImageData();
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cloudinary-images-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(`Export failed: ${err.message}`);
    }
  };

  const getUsageBadgeColor = (count) => {
    if (count === 0) return '#fee2e2'; // Red
    if (count === 1) return '#dbeafe'; // Blue
    return '#dcfce7'; // Green
  };

  const getUsageBadgeTextColor = (count) => {
    if (count === 0) return '#991b1b';
    if (count === 1) return '#0284c7';
    return '#15803d';
  };

  const resetFilters = () => {
    setFilters({
      filename: '',
      imageId: '',
      source: '',
      uploadDateFrom: '',
      uploadDateTo: '',
      usageMin: '',
      usageMax: '',
    });
  };

  const filteredImages = images.filter(img => {
    // Filename filter
    if (filters.filename && !img.originalName.toLowerCase().includes(filters.filename.toLowerCase())) {
      return false;
    }

    // Image ID / URL filter
    if (filters.imageId && !img.cloudinaryId.toLowerCase().includes(filters.imageId.toLowerCase()) &&
        !img.imageUrl.toLowerCase().includes(filters.imageId.toLowerCase())) {
      return false;
    }

    // Source filter
    if (filters.source && filters.source !== 'all' && img.source !== filters.source) {
      return false;
    }

    // Upload date filters
    if (filters.uploadDateFrom) {
      const filterDate = new Date(filters.uploadDateFrom);
      const imgDate = new Date(img.uploadDate.toDate?.() || img.uploadDate);
      if (imgDate < filterDate) return false;
    }

    if (filters.uploadDateTo) {
      const filterDate = new Date(filters.uploadDateTo);
      filterDate.setHours(23, 59, 59, 999); // End of day
      const imgDate = new Date(img.uploadDate.toDate?.() || img.uploadDate);
      if (imgDate > filterDate) return false;
    }

    // Usage count filters
    if (filters.usageMin && img.usageCount < parseInt(filters.usageMin)) {
      return false;
    }

    if (filters.usageMax && img.usageCount > parseInt(filters.usageMax)) {
      return false;
    }

    return true;
  });

  const filteredDuplicates = duplicates.filter(img =>
    img.cloudinaryId.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <AdminLayout title="🖼️ Cloudinary Image Manager">
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: '700', color: '#0b1220' }}>
            🖼️ Cloudinary Image Manager
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Manage all images used across the website. Review usage, find duplicates, and delete unused images to reduce costs.
          </p>
        </div>

        {/* Refresh Button */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={loadImageData}
            disabled={loading}
            style={{
              padding: '8px 16px',
              background: loading ? '#cbd5e1' : '#6C63FF',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '13px',
            }}
          >
            {loading ? '⏳ Loading...' : '🔄 Refresh Data'}
          </button>
          <button
            onClick={handleExport}
            style={{
              marginLeft: '8px',
              padding: '8px 16px',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
            }}
          >
            📥 Export to JSON
          </button>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '13px',
          }}>
            ⚠️ Error: {error}
          </div>
        )}

        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#64748b',
          }}>
            ⏳ Loading image data...
          </div>
        )}

        {!loading && (
          <>
            {/* Overview Tab */}
            {selectedTab === 'overview' && report && (
              <div>
                {/* Statistics Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}>
                  <div style={STAT_BOX_STYLE}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                      Total Unique Images
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#6C63FF' }}>
                      {report.totalUniqueImages}
                    </div>
                  </div>

                  <div style={STAT_BOX_STYLE}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                      Total Image References
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#0284c7' }}>
                      {report.totalImageReferences}
                    </div>
                  </div>

                  <div style={STAT_BOX_STYLE}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                      Duplicate Images
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#f97316' }}>
                      {report.duplicates.length}
                    </div>
                  </div>

                  <div style={STAT_BOX_STYLE}>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                      Unused Images
                    </div>
                    <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>
                      {report.imagesByUsageCount.notUsed}
                    </div>
                  </div>
                </div>

                {/* Usage Distribution */}
                <div style={CARD_STYLE}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '700' }}>
                    📊 Image Usage Distribution
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px',
                  }}>
                    <div style={{
                      padding: '12px',
                      background: '#dbeafe',
                      borderRadius: '6px',
                      borderLeft: '4px solid #0284c7',
                    }}>
                      <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: '600' }}>
                        Used Once
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#0284c7' }}>
                        {report.imagesByUsageCount.usedOnce}
                      </div>
                    </div>

                    <div style={{
                      padding: '12px',
                      background: '#dcfce7',
                      borderRadius: '6px',
                      borderLeft: '4px solid #15803d',
                    }}>
                      <div style={{ fontSize: '12px', color: '#15803d', fontWeight: '600' }}>
                        Used Multiple Times
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#15803d' }}>
                        {report.imagesByUsageCount.usedMultiple}
                      </div>
                    </div>

                    <div style={{
                      padding: '12px',
                      background: '#fee2e2',
                      borderRadius: '6px',
                      borderLeft: '4px solid #991b1b',
                    }}>
                      <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: '600' }}>
                        Never Used
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#991b1b' }}>
                        {report.imagesByUsageCount.notUsed}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Savings Info */}
                <div style={{
                  ...CARD_STYLE,
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700', color: '#047857' }}>
                    💰 Cost Optimization Tips
                  </h3>
                  <ul style={{
                    margin: 0,
                    paddingLeft: '20px',
                    fontSize: '13px',
                    color: '#065f46',
                    lineHeight: '1.6',
                  }}>
                    <li>Delete <strong>{report.imagesByUsageCount.notUsed}</strong> unused images to save storage</li>
                    <li>Consolidate <strong>{report.duplicates.length}</strong> duplicate images to reduce references</li>
                    <li>Each unique image in Cloudinary counts toward your storage quota</li>
                    <li>Bandwidth usage depends on number of downloads, not unique images</li>
                  </ul>
                </div>

                {/* Top Used Images */}
                {report.highestUsed.length > 0 && (
                  <div style={CARD_STYLE}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '700' }}>
                      🏆 Most Used Images (Top 10)
                    </h3>
                    <table style={TABLE_STYLE}>
                      <thead>
                        <tr>
                          <th style={TH_STYLE}>Filename</th>
                          <th style={TH_STYLE}>Source</th>
                          <th style={TH_STYLE}>Upload Date</th>
                          <th style={TH_STYLE}>Usage Count</th>
                          <th style={TH_STYLE}>Used In</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.highestUsed.map((img, idx) => (
                          <tr key={idx}>
                            <td style={TD_STYLE}>
                              <code style={{ fontSize: '10px', color: '#059669', wordBreak: 'break-all' }}>
                                {img.originalName}
                              </code>
                            </td>
                            <td style={TD_STYLE}>
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                fontSize: '10px',
                                fontWeight: '600',
                                background: img.source === 'cloudinary' ? '#dbeafe' : 
                                           img.source === 'firebase' ? '#fcd34d' : '#e5e7eb',
                                color: img.source === 'cloudinary' ? '#0284c7' : 
                                      img.source === 'firebase' ? '#92400e' : '#374151',
                              }}>
                                {img.source === 'cloudinary' ? '☁️' : img.source === 'firebase' ? '🔥' : '🌐'}
                              </span>
                            </td>
                            <td style={TD_STYLE}>
                              <span style={{ fontSize: '10px', color: '#64748b' }}>
                                {img.uploadDate ? new Date(img.uploadDate.toDate?.() || img.uploadDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </td>
                            <td style={TD_STYLE}>
                              <span style={{
                                display: 'inline-block',
                                background: getUsageBadgeColor(img.usageCount),
                                color: getUsageBadgeTextColor(img.usageCount),
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontWeight: '600',
                                fontSize: '12px',
                              }}>
                                {img.usageCount}x
                              </span>
                            </td>
                            <td style={TD_STYLE}>
                              {img.usage.slice(0, 2).map((u, i) => (
                                <div key={i} style={{ fontSize: '10px', color: '#64748b' }}>
                                  <strong>{u.type}</strong>: {u.itemName}
                                </div>
                              ))}
                              {img.usage.length > 2 && (
                                <div style={{ fontSize: '10px', color: '#94a3b8', fontStyle: 'italic' }}>
                                  +{img.usage.length - 2} more
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Tab Buttons */}
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSelectedTab('overview')}
                style={{
                  padding: '8px 16px',
                  background: selectedTab === 'overview' ? '#6C63FF' : '#f1f5f9',
                  color: selectedTab === 'overview' ? '#ffffff' : '#334155',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                }}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setSelectedTab('all')}
                style={{
                  padding: '8px 16px',
                  background: selectedTab === 'all' ? '#6C63FF' : '#f1f5f9',
                  color: selectedTab === 'all' ? '#ffffff' : '#334155',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                }}
              >
                🖼️ All Images ({images.length})
              </button>
              <button
                onClick={() => setSelectedTab('duplicates')}
                style={{
                  padding: '8px 16px',
                  background: selectedTab === 'duplicates' ? '#6C63FF' : '#f1f5f9',
                  color: selectedTab === 'duplicates' ? '#ffffff' : '#334155',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '13px',
                }}
              >
                ⚠️ Duplicates ({duplicates.length})
              </button>
            </div>

            {/* All Images Tab */}
            {selectedTab === 'all' && (
              <div>
                {/* Advanced Filters */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px',
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>🔍 Advanced Filters</h3>
                    <button
                      onClick={resetFilters}
                      style={{
                        padding: '6px 12px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                      }}
                    >
                      Reset All
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}>
                    {/* Filename Filter */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>
                        Original Filename
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., puzzle.png"
                        value={filters.filename}
                        onChange={(e) => setFilters({ ...filters, filename: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Image ID / URL Filter */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>
                        Image ID / URL
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., cloudinary ID"
                        value={filters.imageId}
                        onChange={(e) => setFilters({ ...filters, imageId: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Source Filter */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>
                        Source
                      </label>
                      <select
                        value={filters.source}
                        onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                          background: '#ffffff',
                        }}
                      >
                        <option value="">All Sources</option>
                        <option value="cloudinary">☁️ Cloudinary</option>
                        <option value="firebase">🔥 Firebase</option>
                        <option value="external">🌐 External</option>
                      </select>
                    </div>

                    {/* Upload Date From */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>
                        Upload Date From
                      </label>
                      <input
                        type="date"
                        value={filters.uploadDateFrom}
                        onChange={(e) => setFilters({ ...filters, uploadDateFrom: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Upload Date To */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>
                        Upload Date To
                      </label>
                      <input
                        type="date"
                        value={filters.uploadDateTo}
                        onChange={(e) => setFilters({ ...filters, uploadDateTo: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Usage Min */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>
                        Min Usage
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 2"
                        min="0"
                        value={filters.usageMin}
                        onChange={(e) => setFilters({ ...filters, usageMin: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Usage Max */}
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: '#334155' }}>
                        Max Usage
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 10"
                        min="0"
                        value={filters.usageMax}
                        onChange={(e) => setFilters({ ...filters, usageMax: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
                    Found <strong>{filteredImages.length}</strong> of <strong>{images.length}</strong> images
                  </div>
                </div>

                {filteredImages.length === 0 ? (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#64748b',
                    background: '#f8fafc',
                    borderRadius: '8px',
                  }}>
                    No images found
                  </div>
                ) : (
                  <div style={CARD_STYLE}>
                    <table style={TABLE_STYLE}>
                      <thead>
                        <tr>
                          <th style={TH_STYLE}>Original Filename</th>
                          <th style={TH_STYLE}>Image ID / URL</th>
                          <th style={TH_STYLE}>Source</th>
                          <th style={TH_STYLE}>Upload Date</th>
                          <th style={TH_STYLE}>Usage</th>
                          <th style={TH_STYLE}>Used In</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredImages.map((img, idx) => (
                          <tr key={idx}>
                            <td style={TD_STYLE}>
                              <code style={{ fontSize: '11px', color: '#059669', wordBreak: 'break-all' }}>
                                {img.originalName}
                              </code>
                            </td>
                            <td style={TD_STYLE}>
                              <button
                                onClick={() => setSelectedImage(img)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#3b82f6',
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                  fontSize: '11px',
                                  padding: 0,
                                  textAlign: 'left',
                                  maxWidth: '200px',
                                  wordBreak: 'break-word',
                                  fontFamily: 'monospace',
                                }}
                                title="Click to preview image"
                              >
                                {img.cloudinaryId !== 'N/A' ? img.cloudinaryId : img.imageUrl.substring(0, 35) + '...'}
                              </button>
                            </td>
                            <td style={TD_STYLE}>
                              <span style={{
                                display: 'inline-block',
                                padding: '2px 6px',
                                borderRadius: '3px',
                                fontSize: '11px',
                                fontWeight: '600',
                                background: img.source === 'cloudinary' ? '#dbeafe' : 
                                           img.source === 'firebase' ? '#fcd34d' : '#e5e7eb',
                                color: img.source === 'cloudinary' ? '#0284c7' : 
                                      img.source === 'firebase' ? '#92400e' : '#374151',
                              }}>
                                {img.source === 'cloudinary' ? '☁️ CDN' : 
                                 img.source === 'firebase' ? '🔥 Firebase' : '🌐 External'}
                              </span>
                            </td>
                            <td style={TD_STYLE}>
                              <span style={{ fontSize: '11px', color: '#64748b' }}>
                                {img.uploadDate ? new Date(img.uploadDate.toDate?.() || img.uploadDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </td>
                            <td style={TD_STYLE}>
                              <span style={{
                                display: 'inline-block',
                                background: getUsageBadgeColor(img.usageCount),
                                color: getUsageBadgeTextColor(img.usageCount),
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontWeight: '600',
                                fontSize: '12px',
                              }}>
                                {img.usageCount} {img.usageCount === 1 ? 'place' : 'places'}
                              </span>
                            </td>
                            <td style={TD_STYLE}>
                              {img.usage.map((u, i) => (
                                <div key={i} style={{ fontSize: '10px', color: '#64748b', marginBottom: '3px' }}>
                                  📌 <strong>{u.type}</strong>: {u.itemName}
                                  {u.puzzleType && <span style={{ fontSize: '9px', color: '#94a3b8' }}> ({u.puzzleType})</span>}
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Duplicates Tab */}
            {selectedTab === 'duplicates' && (
              <div>
                <input
                  type="text"
                  placeholder="Search duplicates..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    fontSize: '13px',
                  }}
                />

                {filteredDuplicates.length === 0 ? (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#64748b',
                    background: '#f8fafc',
                    borderRadius: '8px',
                  }}>
                    ✅ No duplicate images found!
                  </div>
                ) : (
                  <div style={CARD_STYLE}>
                    <p style={{
                      margin: '0 0 12px 0',
                      fontSize: '13px',
                      color: '#64748b',
                    }}>
                      ⚠️ These images are used multiple times. Consider consolidating references.
                    </p>
                    <table style={TABLE_STYLE}>
                      <thead>
                        <tr>
                          <th style={TH_STYLE}>Image ID</th>
                          <th style={TH_STYLE}>Total Uses</th>
                          <th style={TH_STYLE}>Used In</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDuplicates.map((img, idx) => (
                          <tr key={idx}>
                            <td style={TD_STYLE}>
                              <code style={{ fontSize: '11px', color: '#6C63FF', wordBreak: 'break-all' }}>
                                {img.cloudinaryId}
                              </code>
                            </td>
                            <td style={TD_STYLE}>
                              <span style={{
                                display: 'inline-block',
                                background: '#dcfce7',
                                color: '#15803d',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontWeight: '600',
                                fontSize: '12px',
                              }}>
                                {img.usageCount} times
                              </span>
                            </td>
                            <td style={TD_STYLE}>
                              {img.usage.map((u, i) => (
                                <div key={i} style={{
                                  fontSize: '11px',
                                  color: '#64748b',
                                  padding: '4px 0',
                                  borderBottom: i < img.usage.length - 1 ? '1px solid #f1f5f9' : 'none',
                                }}>
                                  <strong>{u.type}</strong>: {u.itemName}
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Image Preview Modal */}
        {selectedImage && (
          <div style={MODAL_OVERLAY} onClick={() => setSelectedImage(null)}>
            <div style={MODAL_CONTENT} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Image Preview</h2>
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#666',
                  }}
                >
                  ×
                </button>
              </div>

              {/* Image Display */}
              <div style={{
                marginBottom: '20px',
                textAlign: 'center',
                backgroundColor: '#f5f5f5',
                padding: '20px',
                borderRadius: '8px',
                maxHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.originalName}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    borderRadius: '4px',
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>

              {/* Image Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>Original Filename</h3>
                  <p style={{ margin: 0, wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '12px' }}>
                    {selectedImage.originalName}
                  </p>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>Cloudinary ID</h3>
                  <p style={{ margin: 0, wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '12px' }}>
                    {selectedImage.cloudinaryId}
                  </p>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>Source</h3>
                  <p style={{ margin: 0, fontSize: '12px' }}>
                    {selectedImage.source === 'cloudinary' ? '☁️ Cloudinary' :
                     selectedImage.source === 'firebase' ? '🔥 Firebase Storage' :
                     '🌐 External URL'}
                  </p>
                </div>

                <div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>Upload Date</h3>
                  <p style={{ margin: 0, fontSize: '12px' }}>
                    {selectedImage.uploadDate ? new Date(selectedImage.uploadDate.toDate?.() || selectedImage.uploadDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Full URL */}
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>Full Image URL</h3>
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  maxHeight: '100px',
                  overflow: 'auto',
                }}>
                  {selectedImage.imageUrl}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedImage.imageUrl);
                    alert('URL copied to clipboard!');
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '6px 12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Copy URL
                </button>
                <a
                  href={selectedImage.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: '8px',
                    padding: '6px 12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Open in New Tab
                </a>
              </div>

              {/* Usage Information */}
              <div>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>Used In ({selectedImage.usageCount} places)</h3>
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: '12px',
                  borderRadius: '4px',
                  maxHeight: '150px',
                  overflow: 'auto',
                  fontSize: '12px',
                }}>
                  {selectedImage.usage && selectedImage.usage.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                      {selectedImage.usage.map((u, i) => (
                        <li key={i} style={{ marginBottom: '6px' }}>
                          <strong>{u.type}</strong>: {u.itemName}
                          {u.puzzleType && <span style={{ color: '#666' }}> ({u.puzzleType})</span>}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ margin: 0, color: '#666' }}>No usage information available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
