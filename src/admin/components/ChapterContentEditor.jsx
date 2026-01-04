import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ChapterContentEditor.jsx
 * 
 * Rich content editor for story chapters
 * Allows admins to add multiple content blocks with different types:
 * - Text (various styles)
 * - Headings (H1, H2, H3)
 * - Images
 * - Bullet lists
 * - Quotes
 * - Separators
 * - Quizzes/Assessments
 */

const ChapterContentEditor = ({ contentBlocks = [], onChange }) => {
  const { theme } = useTheme();
  const [blocks, setBlocks] = useState(contentBlocks);
  const [editingBlockId, setEditingBlockId] = useState(null);

  const BLOCK_TYPES = [
    { id: 'text', label: '📝 Text', icon: '📝', color: '#4ECDC4' },
    { id: 'heading', label: '📌 Heading', icon: '📌', color: '#FF85A2' },
    { id: 'image', label: '🖼️ Image', icon: '🖼️', color: '#FFB366' },
    { id: 'bullet', label: '• Bullet List', icon: '•', color: '#A78BFA' },
    { id: 'quote', label: '💬 Quote', icon: '💬', color: '#81C995' },
    { id: 'separator', label: '─ Divider', icon: '─', color: '#B4A7D6' },
  ];

  const TEXT_STYLES = [
    { id: 'normal', label: 'Normal', style: {} },
    { id: 'small', label: 'Small', style: { fontSize: '12px' } },
    { id: 'large', label: 'Large', style: { fontSize: '18px' } },
    { id: 'bold', label: 'Bold', style: { fontWeight: 'bold' } },
    { id: 'italic', label: 'Italic', style: { fontStyle: 'italic' } },
    { id: 'uppercase', label: 'UPPERCASE', style: { textTransform: 'uppercase' } },
  ];

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: '',
      style: 'normal',
      order: blocks.length + 1,
    };

    if (type === 'image') {
      newBlock.url = '';
      newBlock.caption = '';
    }

    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    onChange(updatedBlocks);
    setEditingBlockId(newBlock.id);
  };

  const updateBlock = (blockId, updates) => {
    const updatedBlocks = blocks.map(b => 
      b.id === blockId ? { ...b, ...updates } : b
    );
    setBlocks(updatedBlocks);
    onChange(updatedBlocks);
  };

  const deleteBlock = (blockId) => {
    const updatedBlocks = blocks.filter(b => b.id !== blockId);
    setBlocks(updatedBlocks);
    onChange(updatedBlocks);
    setEditingBlockId(null);
  };

  const moveBlock = (blockId, direction) => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (direction === 'up' && index > 0) {
      const updatedBlocks = [...blocks];
      [updatedBlocks[index], updatedBlocks[index - 1]] = [updatedBlocks[index - 1], updatedBlocks[index]];
      setBlocks(updatedBlocks);
      onChange(updatedBlocks);
    } else if (direction === 'down' && index < blocks.length - 1) {
      const updatedBlocks = [...blocks];
      [updatedBlocks[index], updatedBlocks[index + 1]] = [updatedBlocks[index + 1], updatedBlocks[index]];
      setBlocks(updatedBlocks);
      onChange(updatedBlocks);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Add Block Buttons */}
      <div>
        <p style={{
          color: theme.textPrimary,
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '8px',
        }}>
          ➕ Add Content Block:
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
        }}>
          {BLOCK_TYPES.map(blockType => (
            <button
              key={blockType.id}
              onClick={() => addBlock(blockType.id)}
              style={{
                padding: '8px 12px',
                background: theme.background,
                border: `2px solid ${blockType.color}`,
                borderRadius: '6px',
                color: theme.textPrimary,
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                ':hover': {
                  background: blockType.color,
                  color: '#fff',
                },
              }}
              onMouseEnter={(e) => {
                e.target.style.background = blockType.color;
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = theme.background;
                e.target.style.color = theme.textPrimary;
              }}
            >
              {blockType.icon} {blockType.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Blocks List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {blocks.length === 0 ? (
          <div style={{
            padding: '20px',
            background: theme.background,
            border: `2px dashed ${theme.border}`,
            borderRadius: '8px',
            textAlign: 'center',
            color: theme.textSecondary,
            fontSize: '13px',
          }}>
            No content blocks yet. Click a button above to add one.
          </div>
        ) : (
          blocks.map((block, index) => (
            <div
              key={block.id}
              style={{
                padding: '12px',
                background: editingBlockId === block.id ? '#4ECDC425' : theme.background,
                border: `2px solid ${editingBlockId === block.id ? '#4ECDC4' : theme.border}`,
                borderRadius: '8px',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
              }}>
                <div>
                  <span style={{
                    color: theme.textPrimary,
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: theme.border,
                    borderRadius: '4px',
                    marginRight: '8px',
                  }}>
                    Block {index + 1}
                  </span>
                  <span style={{
                    color: theme.textSecondary,
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}>
                    {BLOCK_TYPES.find(t => t.id === block.type)?.label}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => moveBlock(block.id, 'up')}
                    disabled={index === 0}
                    style={{
                      padding: '4px 8px',
                      background: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '4px',
                      color: theme.textSecondary,
                      fontSize: '11px',
                      cursor: index === 0 ? 'not-allowed' : 'pointer',
                      opacity: index === 0 ? 0.5 : 1,
                    }}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveBlock(block.id, 'down')}
                    disabled={index === blocks.length - 1}
                    style={{
                      padding: '4px 8px',
                      background: 'transparent',
                      border: `1px solid ${theme.border}`,
                      borderRadius: '4px',
                      color: theme.textSecondary,
                      fontSize: '11px',
                      cursor: index === blocks.length - 1 ? 'not-allowed' : 'pointer',
                      opacity: index === blocks.length - 1 ? 0.5 : 1,
                    }}
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteBlock(block.id)}
                    style={{
                      padding: '4px 8px',
                      background: 'transparent',
                      border: `1px solid #FF6B6B`,
                      borderRadius: '4px',
                      color: '#FF6B6B',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Block Editor */}
              {editingBlockId === block.id && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: `1px solid ${theme.border}` }}>
                  {/* Text Block */}
                  {block.type === 'text' && (
                    <>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{
                          color: theme.textPrimary,
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'block',
                          marginBottom: '6px',
                        }}>
                          Text Style:
                        </label>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {TEXT_STYLES.map(style => (
                            <button
                              key={style.id}
                              onClick={() => updateBlock(block.id, { style: style.id })}
                              style={{
                                padding: '4px 8px',
                                background: block.style === style.id ? theme.accentPrimary : theme.background,
                                border: `1px solid ${theme.border}`,
                                borderRadius: '4px',
                                color: block.style === style.id ? '#fff' : theme.textSecondary,
                                fontSize: '11px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              {style.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        value={block.content || ''}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: theme.surfacePrimary,
                          border: `2px solid ${theme.border}`,
                          borderRadius: '6px',
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          minHeight: '80px',
                          resize: 'vertical',
                        }}
                        placeholder="Enter text content..."
                      />
                    </>
                  )}

                  {/* Heading Block */}
                  {block.type === 'heading' && (
                    <>
                      <label style={{
                        color: theme.textPrimary,
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '6px',
                      }}>
                        Heading Level:
                      </label>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                        {['h1', 'h2', 'h3'].map(level => (
                          <button
                            key={level}
                            onClick={() => updateBlock(block.id, { level })}
                            style={{
                              padding: '6px 12px',
                              background: block.level === level ? theme.accentPrimary : theme.background,
                              border: `1px solid ${theme.border}`,
                              borderRadius: '4px',
                              color: block.level === level ? '#fff' : theme.textSecondary,
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            {level.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={block.content || ''}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: theme.surfacePrimary,
                          border: `2px solid ${theme.border}`,
                          borderRadius: '6px',
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                        placeholder="Enter heading text..."
                      />
                    </>
                  )}

                  {/* Image Block */}
                  {block.type === 'image' && (
                    <>
                      <div style={{ marginBottom: '12px' }}>
                        <label style={{
                          color: theme.textPrimary,
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'block',
                          marginBottom: '6px',
                        }}>
                          Image URL:
                        </label>
                        <input
                          type="text"
                          value={block.url || ''}
                          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: theme.surfacePrimary,
                            border: `2px solid ${theme.border}`,
                            borderRadius: '6px',
                            color: theme.textPrimary,
                            fontSize: '13px',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                          }}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      <div>
                        <label style={{
                          color: theme.textPrimary,
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'block',
                          marginBottom: '6px',
                        }}>
                          Caption (Optional):
                        </label>
                        <textarea
                          value={block.caption || ''}
                          onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            background: theme.surfacePrimary,
                            border: `2px solid ${theme.border}`,
                            borderRadius: '6px',
                            color: theme.textPrimary,
                            fontSize: '13px',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                            minHeight: '60px',
                            resize: 'vertical',
                          }}
                          placeholder="Enter image caption..."
                        />
                      </div>
                      {block.url && (
                        <div style={{ marginTop: '12px' }}>
                          <img
                            src={block.url}
                            alt="Preview"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '200px',
                              borderRadius: '6px',
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Bullet List Block */}
                  {block.type === 'bullet' && (
                    <>
                      <label style={{
                        color: theme.textPrimary,
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'block',
                        marginBottom: '6px',
                      }}>
                        Bullet Points (one per line):
                      </label>
                      <textarea
                        value={block.content || ''}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: theme.surfacePrimary,
                          border: `2px solid ${theme.border}`,
                          borderRadius: '6px',
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          minHeight: '100px',
                          resize: 'vertical',
                        }}
                        placeholder="Line 1&#10;Line 2&#10;Line 3"
                      />
                    </>
                  )}

                  {/* Quote Block */}
                  {block.type === 'quote' && (
                    <>
                      <textarea
                        value={block.content || ''}
                        onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: theme.surfacePrimary,
                          border: `2px solid ${theme.border}`,
                          borderRadius: '6px',
                          color: theme.textPrimary,
                          fontSize: '13px',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                          minHeight: '80px',
                          resize: 'vertical',
                        }}
                        placeholder="Enter quote text..."
                      />
                    </>
                  )}

                  {/* Separator - no content needed */}
                  {block.type === 'separator' && (
                    <p style={{
                      color: theme.textSecondary,
                      fontSize: '12px',
                      fontStyle: 'italic',
                    }}>
                      No settings needed for divider.
                    </p>
                  )}

                  {/* Close Editor */}
                  <button
                    onClick={() => setEditingBlockId(null)}
                    style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: theme.accentPrimary,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Done
                  </button>
                </div>
              )}

              {/* Block Preview */}
              {editingBlockId !== block.id && (
                <button
                  onClick={() => setEditingBlockId(block.id)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: theme.surfacePrimary,
                    border: `1px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.textSecondary,
                    fontSize: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  {block.type === 'separator' ? '─────────────────' : (block.content || block.url || '(empty)')}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChapterContentEditor;
