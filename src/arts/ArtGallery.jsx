import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getAllArtwork, deleteArtwork } from './services/ArtStorageService';

const ArtGallery = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [selectedArt, setSelectedArt] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = () => {
    const allArt = getAllArtwork();
    setArtworks(allArt.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleDelete = (id) => {
    deleteArtwork(id);
    loadArtworks();
    setSelectedArt(null);
    setDeleteConfirm(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.background,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <button
          onClick={() => navigate('/arts')}
          style={{
            width: '48px',
            height: '48px',
            background: theme.surfacePrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: '12px',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ←
        </button>
        <h1 style={{
          color: theme.textPrimary,
          fontSize: '32px',
          fontWeight: '700',
          margin: 0,
        }}>
          🖼️ My Artwork Gallery
        </h1>
      </div>

      {/* Gallery Grid */}
      {artworks.length === 0 ? (
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}>
          <div style={{
            fontSize: '64px',
            opacity: 0.5,
          }}>
            🎨
          </div>
          <p style={{
            color: theme.textSecondary,
            fontSize: '18px',
            fontWeight: '500',
            textAlign: 'center',
          }}>
            No artwork yet! Create some beautiful art first.
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px',
        }}>
          {artworks.map(art => (
            <div
              key={art.id}
              onClick={() => setSelectedArt(art)}
              style={{
                cursor: 'pointer',
                borderRadius: '12px',
                overflow: 'hidden',
                border: `2px solid ${theme.border}`,
                transition: 'all 0.2s ease',
                background: theme.surfacePrimary,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${theme.accentPrimary}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <img
                src={art.imageData}
                alt={art.title}
                style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover',
                }}
              />
              <div style={{
                padding: '12px',
              }}>
                <p style={{
                  color: theme.textPrimary,
                  fontSize: '13px',
                  fontWeight: '600',
                  margin: '0 0 4px 0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {art.title}
                </p>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '11px',
                  margin: 0,
                }}>
                  {art.type === 'digital-art' ? '🎨 Digital' : art.type === 'paint' ? '🖌️ Paint' : '✏️ Draw'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedArt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '20px',
            maxWidth: '600px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '16px',
            }}>
              <div>
                <h2 style={{
                  color: theme.textPrimary,
                  fontSize: '24px',
                  fontWeight: '700',
                  margin: 0,
                }}>
                  {selectedArt.title}
                </h2>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '12px',
                  margin: '4px 0 0 0',
                }}>
                  Created: {formatDate(selectedArt.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedArt(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            <img
              src={selectedArt.imageData}
              alt={selectedArt.title}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: '8px',
                marginBottom: '16px',
                background: theme.background,
                border: `1px solid ${theme.border}`,
              }}
            />

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: 'auto',
            }}>
              <button
                onClick={() => setSelectedArt(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                onClick={() => setDeleteConfirm(selectedArt.id)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#FF6B6B',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
        }}>
          <div style={{
            background: theme.surfacePrimary,
            border: `2px solid ${theme.border}`,
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
          }}>
            <h3 style={{
              color: theme.textPrimary,
              fontSize: '20px',
              fontWeight: '700',
              margin: '0 0 12px 0',
            }}>
              Delete This Artwork?
            </h3>
            <p style={{
              color: theme.textSecondary,
              fontSize: '14px',
              margin: '0 0 24px 0',
            }}>
              This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px',
            }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: theme.background,
                  border: `2px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.textPrimary,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#FF6B6B',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtGallery;
