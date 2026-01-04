import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * StoryReaderPreview.jsx
 * 
 * Displays a story preview in the admin panel
 * Shows how the story will look to users with chapter content blocks
 */

const StoryReaderPreview = ({ story, chapters, editingChapter, onChapterSelect }) => {
  const { theme } = useTheme();
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  if (!story || !chapters || chapters.length === 0) {
    return (
      <div style={{
        padding: '24px',
        background: theme.background,
        border: `2px solid ${theme.border}`,
        borderRadius: '12px',
        textAlign: 'center',
        color: theme.textSecondary,
      }}>
        <p>📚 No chapters yet. Add chapters to preview the story.</p>
      </div>
    );
  }

  // Use editing chapter if provided, otherwise use current chapter
  const displayChapter = editingChapter || chapters[currentChapterIndex];
  const currentIndex = chapters.findIndex(ch => ch.id === displayChapter.id);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentChapterIndex(currentIndex - 1);
      onChapterSelect?.(chapters[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentIndex + 1);
      onChapterSelect?.(chapters[currentIndex + 1]);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: theme.surfacePrimary,
      border: `2px solid ${theme.border}`,
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Story Header */}
      <div style={{
        padding: '16px 20px',
        background: theme.background,
        borderBottom: `2px solid ${theme.border}`,
      }}>
        <h2 style={{
          color: theme.textPrimary,
          fontSize: '18px',
          fontWeight: '700',
          margin: '0 0 4px 0',
        }}>
          📖 {story.title}
        </h2>
        <p style={{
          color: theme.textSecondary,
          fontSize: '12px',
          margin: '0',
        }}>
          {story.category} • {story.audience}
        </p>
      </div>

      {/* Reader Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
      }}>
        {/* Chapter Title */}
        <h3 style={{
          color: theme.textPrimary,
          fontSize: '20px',
          fontWeight: '700',
          marginTop: '0',
          marginBottom: '8px',
        }}>
          Chapter {displayChapter.order}: {displayChapter.title}
        </h3>

        {/* Chapter Description */}
        {displayChapter.description && (
          <p style={{
            color: theme.textSecondary,
            fontSize: '13px',
            fontStyle: 'italic',
            marginBottom: '16px',
            paddingBottom: '12px',
            borderBottom: `1px solid ${theme.border}`,
          }}>
            {displayChapter.description}
          </p>
        )}

        {/* Content Blocks */}
        <div style={{ marginTop: '20px' }}>
          {displayChapter.contentBlocks && displayChapter.contentBlocks.length > 0 ? (
            displayChapter.contentBlocks.map((block, idx) => {
              const getTextStyle = (style) => {
                const styles = {
                  normal: {},
                  small: { fontSize: '12px' },
                  large: { fontSize: '18px' },
                  bold: { fontWeight: 'bold' },
                  italic: { fontStyle: 'italic' },
                  uppercase: { textTransform: 'uppercase' },
                };
                return styles[style] || styles.normal;
              };

              return (
                <div key={idx} style={{ marginBottom: '16px' }}>
                  {/* Text Block */}
                  {block.type === 'text' && (
                    <p style={{
                      color: theme.textPrimary,
                      fontSize: '14px',
                      lineHeight: '1.6',
                      margin: '0',
                      ...getTextStyle(block.style),
                    }}>
                      {block.content}
                    </p>
                  )}

                  {/* Heading Block */}
                  {block.type === 'heading' && {
                    h1: <h1 style={{ color: theme.textPrimary, fontSize: '28px', fontWeight: '700', margin: '12px 0' }}>{block.content}</h1>,
                    h2: <h2 style={{ color: theme.textPrimary, fontSize: '22px', fontWeight: '700', margin: '12px 0' }}>{block.content}</h2>,
                    h3: <h3 style={{ color: theme.textPrimary, fontSize: '18px', fontWeight: '600', margin: '12px 0' }}>{block.content}</h3>,
                  }[block.level || 'h2']}

                  {/* Image Block */}
                  {block.type === 'image' && block.url && (
                    <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                      <img
                        src={block.url}
                        alt={block.caption || 'Story image'}
                        style={{
                          maxWidth: '100%',
                          height: 'auto',
                          borderRadius: '8px',
                          maxHeight: '300px',
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      {block.caption && (
                        <p style={{
                          color: theme.textSecondary,
                          fontSize: '12px',
                          fontStyle: 'italic',
                          margin: '6px 0 0 0',
                        }}>
                          {block.caption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Bullet List Block */}
                  {block.type === 'bullet' && (
                    <ul style={{
                      color: theme.textPrimary,
                      fontSize: '14px',
                      lineHeight: '1.6',
                      margin: '0',
                      paddingLeft: '20px',
                    }}>
                      {block.content?.split('\n').filter(line => line.trim()).map((line, i) => (
                        <li key={i} style={{ marginBottom: '6px' }}>
                          {line.trim()}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Quote Block */}
                  {block.type === 'quote' && (
                    <div style={{
                      borderLeft: `4px solid ${theme.accentPrimary}`,
                      paddingLeft: '12px',
                      marginLeft: '0',
                      fontStyle: 'italic',
                      color: theme.textSecondary,
                      fontSize: '14px',
                      lineHeight: '1.6',
                    }}>
                      "{block.content}"
                    </div>
                  )}

                  {/* Separator Block */}
                  {block.type === 'separator' && (
                    <hr style={{
                      border: 'none',
                      borderTop: `2px solid ${theme.border}`,
                      margin: '20px 0',
                    }} />
                  )}
                </div>
              );
            })
          ) : (
            <p style={{
              color: theme.textSecondary,
              fontSize: '13px',
              fontStyle: 'italic',
            }}>
              No content added yet.
            </p>
          )}
        </div>

        {/* Assessment Badge */}
        {displayChapter.assessment && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: theme.background,
            border: `2px solid ${theme.accentPrimary}`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            {displayChapter.assessment.type === 'quiz' && (
              <>
                <span style={{ fontSize: '16px' }}>📝</span>
                <span style={{ color: theme.textPrimary, fontWeight: '600', fontSize: '13px' }}>
                  Quiz attached (Required)
                </span>
              </>
            )}
            {displayChapter.assessment.type === 'puzzle' && (
              <>
                <span style={{ fontSize: '16px' }}>🧩</span>
                <span style={{ color: theme.textPrimary, fontWeight: '600', fontSize: '13px' }}>
                  Puzzle attached (Required)
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div style={{
        padding: '16px 20px',
        borderTop: `2px solid ${theme.border}`,
        background: theme.background,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          style={{
            padding: '8px 16px',
            background: currentIndex === 0 ? theme.border : theme.accentPrimary,
            color: currentIndex === 0 ? theme.textSecondary : '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 ? 0.5 : 1,
          }}
        >
          ← Previous
        </button>

        <span style={{
          color: theme.textSecondary,
          fontSize: '12px',
          fontWeight: '600',
        }}>
          Chapter {currentIndex + 1} of {chapters.length}
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex === chapters.length - 1}
          style={{
            padding: '8px 16px',
            background: currentIndex === chapters.length - 1 ? theme.border : theme.accentPrimary,
            color: currentIndex === chapters.length - 1 ? theme.textSecondary : '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: currentIndex === chapters.length - 1 ? 'not-allowed' : 'pointer',
            opacity: currentIndex === chapters.length - 1 ? 0.5 : 1,
          }}
        >
          Next →
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '4px',
        background: theme.border,
        position: 'relative',
      }}>
        <div style={{
          height: '100%',
          background: theme.accentPrimary,
          width: `${((currentIndex + 1) / chapters.length) * 100}%`,
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
};

export default StoryReaderPreview;
