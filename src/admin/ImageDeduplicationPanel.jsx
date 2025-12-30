/**
 * ImageDeduplicationPanel.jsx
 * 
 * Admin panel to manage and consolidate duplicate images
 * Located at: /admin/image-deduplication
 * 
 * Features:
 * - Analyze current image duplicates
 * - Find consolidation opportunities
 * - Preview consolidation changes
 * - Commit changes with one click
 */

import React, { useState, useEffect } from 'react';
import {
  analyzeImageDuplicates,
  findConsolidationOpportunities,
  generateDeduplicationReport,
  consolidateImageUrl,
  validateImageUrls,
} from '../services/imageDeduplicationService';

export default function ImageDeduplicationPanel() {
  const [activeTab, setActiveTab] = useState('analysis'); // analysis, opportunities, report, validate
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [opportunities, setOpportunities] = useState(null);
  const [report, setReport] = useState(null);
  const [validation, setValidation] = useState(null);
  const [consolidationProgress, setConsolidationProgress] = useState(null);

  // Load initial analysis
  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis = async () => {
    setLoading(true);
    try {
      const data = await analyzeImageDuplicates();
      setAnalysisData(data);
    } catch (error) {
      console.error('Error analyzing duplicates:', error);
    }
    setLoading(false);
  };

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const data = await findConsolidationOpportunities();
      setOpportunities(data);
    } catch (error) {
      console.error('Error finding opportunities:', error);
    }
    setLoading(false);
  };

  const loadReport = async () => {
    setLoading(true);
    try {
      const data = await generateDeduplicationReport();
      setReport(data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
    setLoading(false);
  };

  const loadValidation = async () => {
    setLoading(true);
    try {
      const data = await validateImageUrls();
      setValidation(data);
    } catch (error) {
      console.error('Error validating URLs:', error);
    }
    setLoading(false);
  };

  const handleConsolidate = async (oldUrl, newUrl) => {
    setConsolidationProgress({ status: 'running', message: 'Performing dry run...' });

    try {
      // Dry run first
      const dryResult = await consolidateImageUrl(oldUrl, newUrl, true);
      setConsolidationProgress({
        status: 'dryrun',
        message: `Dry run complete. Will update ${dryResult.updated} documents.`,
        dryResult,
      });

      // User confirm before actual consolidation
      const confirmed = window.confirm(
        `This will update ${dryResult.updated} document references.\n\nContinue?`
      );

      if (confirmed) {
        setConsolidationProgress({ status: 'running', message: 'Committing changes...' });
        const result = await consolidateImageUrl(oldUrl, newUrl, false);
        setConsolidationProgress({
          status: 'complete',
          message: `✅ Successfully updated ${result.updated} documents!`,
          result,
        });

        // Refresh data
        setTimeout(() => {
          loadAnalysis();
          loadOpportunities();
        }, 1000);
      }
    } catch (error) {
      setConsolidationProgress({
        status: 'error',
        message: `Error: ${error.message}`,
      });
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>
          🖼️ Image Deduplication Manager
        </h1>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {[
            { id: 'analysis', label: '📊 Analysis' },
            { id: 'opportunities', label: '💡 Opportunities' },
            { id: 'report', label: '📋 Report' },
            { id: 'validate', label: '✅ Validate' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'opportunities') loadOpportunities();
                if (tab.id === 'report') loadReport();
                if (tab.id === 'validate') loadValidation();
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: activeTab === tab.id ? '#3498db' : '#ecf0f1',
                color: activeTab === tab.id ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Analysis Tab */}
        {activeTab === 'analysis' && analysisData && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h2>Current Image Analysis</h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '15px',
                marginBottom: '30px',
              }}
            >
              <StatCard
                label="Total Unique Images"
                value={analysisData.totalUniqueImages}
                color="#27ae60"
              />
              <StatCard
                label="Duplicate Images"
                value={analysisData.totalDuplicates}
                color="#e74c3c"
              />
              <StatCard
                label="Extra References"
                value={analysisData.totalDuplicateReferences}
                color="#f39c12"
                subtitle="Could be eliminated"
              />
            </div>

            <h3>Top 20 Duplicated Images</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {analysisData.duplicates.slice(0, 20).map((dup, idx) => (
                <DuplicateImageCard key={idx} duplicate={dup} />
              ))}
            </div>
          </div>
        )}

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && opportunities && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h2>Consolidation Opportunities</h2>
            <p style={{ color: '#666' }}>
              Found <strong>{opportunities.totalOpportunities}</strong> images that match SHARED_IMAGES constants
            </p>

            {consolidationProgress && (
              <div
                style={{
                  padding: '15px',
                  marginBottom: '20px',
                  borderRadius: '4px',
                  backgroundColor:
                    consolidationProgress.status === 'error'
                      ? '#fadbd8'
                      : consolidationProgress.status === 'complete'
                      ? '#d5f4e6'
                      : '#fef5e7',
                  borderLeft: `4px solid ${
                    consolidationProgress.status === 'error'
                      ? '#e74c3c'
                      : consolidationProgress.status === 'complete'
                      ? '#27ae60'
                      : '#f39c12'
                  }`,
                }}
              >
                {consolidationProgress.message}
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '12px',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#ecf0f1' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Image URL</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Uses</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Shared Path</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.consolidationOpportunities.map((opp, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #ecf0f1' }}>
                      <td style={{ padding: '10px', maxWidth: '200px', wordBreak: 'break-all' }}>
                        <code style={{ fontSize: '10px' }}>{opp.imageUrl.substring(0, 50)}...</code>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <span style={{ backgroundColor: '#3498db', color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
                          {opp.currentLocations}x
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <code style={{ fontSize: '11px' }}>{opp.sharedPath}</code>
                      </td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>
                        <button
                          onClick={() =>
                            handleConsolidate(
                              opp.imageUrl,
                              `SHARED_IMAGES.${opp.sharedCategory}.${opp.sharedName}`
                            )
                          }
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '11px',
                          }}
                        >
                          Consolidate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Report Tab */}
        {activeTab === 'report' && report && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h2>Deduplication Report</h2>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                borderRadius: '4px',
                overflowX: 'auto',
                fontSize: '12px',
              }}
            >
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        )}

        {/* Validate Tab */}
        {activeTab === 'validate' && validation && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h2>Image URL Validation</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '15px',
                marginBottom: '30px',
              }}
            >
              <StatCard label="Validated" value={validation.validated} color="#27ae60" />
              <StatCard label="Broken" value={validation.broken.length} color="#e74c3c" />
              <StatCard label="Inaccessible" value={validation.inaccessible.length} color="#f39c12" />
            </div>

            {validation.broken.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#e74c3c' }}>⚠️ Broken Images</h3>
                <ul>
                  {validation.broken.map((img, idx) => (
                    <li key={idx}>
                      Status {img.status}: {img.url} (Used {img.usedIn} times)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {validation.inaccessible.length > 0 && (
              <div>
                <h3 style={{ color: '#f39c12' }}>⚠️ Inaccessible Images</h3>
                <ul>
                  {validation.inaccessible.map((img, idx) => (
                    <li key={idx}>
                      {img.error}: {img.url} (Used {img.usedIn} times)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Duplicate Image Card Component - Shows image preview and location details
 */
function DuplicateImageCard({ duplicate }) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [showAllLocations, setShowAllLocations] = React.useState(false);

  const visibleLocations = showAllLocations ? duplicate.locations : duplicate.locations.slice(0, 3);
  const hiddenLocationsCount = duplicate.locations.length - 3;

  return (
    <div
      style={{
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image Preview */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderBottom: '1px solid #eee',
        }}
      >
        {!imageError ? (
          <img
            src={duplicate.imageUrl}
            alt="Duplicate"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: imageLoaded ? 'block' : 'none',
            }}
          />
        ) : null}
        {!imageLoaded && !imageError && (
          <div style={{ color: '#999', fontSize: '14px' }}>Loading image...</div>
        )}
        {imageError && (
          <div style={{ color: '#e74c3c', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            ⚠️ Failed to load image
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Usage Badge */}
        <div style={{ marginBottom: '12px' }}>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: '#e74c3c',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            Used {duplicate.usageCount}x
          </span>
        </div>

        {/* Image URL */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Image ID:</div>
          <code
            style={{
              fontSize: '12px',
              backgroundColor: '#f5f5f5',
              padding: '8px',
              borderRadius: '4px',
              wordBreak: 'break-all',
              display: 'block',
            }}
          >
            {duplicate.imageUrl.split('/').pop() || duplicate.imageUrl.substring(0, 50)}
          </code>
        </div>

        {/* Locations List */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', color: '#999', marginBottom: '8px', fontWeight: 'bold' }}>
            Where it's used ({duplicate.locations.length}):
          </div>
          <div style={{ fontSize: '13px' }}>
            {visibleLocations.map((loc, i) => (
              <div
                key={i}
                style={{
                  padding: '8px',
                  marginBottom: '6px',
                  backgroundColor: '#f9f9f9',
                  borderLeft: '3px solid #3498db',
                  borderRadius: '3px',
                }}
              >
                <div style={{ fontWeight: '600', color: '#2c3e50' }}>
                  {loc.name || loc.docId}
                </div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                  <span style={{ backgroundColor: '#ecf0f1', padding: '2px 6px', borderRadius: '3px' }}>
                    {loc.collection}
                  </span>
                  {loc.field && (
                    <span style={{ marginLeft: '8px', color: '#999' }}>
                      • Field: {loc.field}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {!showAllLocations && hiddenLocationsCount > 0 && (
              <button
                onClick={() => setShowAllLocations(true)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '8px',
                  backgroundColor: '#ecf0f1',
                  border: '1px solid #bdc3c7',
                  borderRadius: '4px',
                  color: '#3498db',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                + {hiddenLocationsCount} more locations
              </button>
            )}
            {showAllLocations && hiddenLocationsCount > 0 && (
              <button
                onClick={() => setShowAllLocations(false)}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '8px',
                  backgroundColor: '#ecf0f1',
                  border: '1px solid #bdc3c7',
                  borderRadius: '4px',
                  color: '#999',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Show less
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({ label, value, color, subtitle }) {
  return (
    <div
      style={{
        backgroundColor: color,
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</div>
      <div style={{ fontSize: '14px', marginTop: '5px' }}>{label}</div>
      {subtitle && <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.9 }}>{subtitle}</div>}
    </div>
  );
}
