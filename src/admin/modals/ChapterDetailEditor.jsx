/**
 * ChapterDetailEditor.jsx
 * 
 * Advanced chapter editor with:
 * - Multiple content blocks (text, images)
 * - Flexible ordering/reordering
 * - Optional quiz/puzzle linking
 * - Character emoji support
 * - Full scenario-based architecture
 */

import React, { useState } from 'react';
import './ChapterDetailEditor.css';

export default function ChapterDetailEditor({ chapter, onSave, onCancel }) {
  const [editedChapter, setEditedChapter] = useState(chapter || {
    title: '',
    description: '',
    characterImage: '',
    contentBlocks: [], // Array of {id, type: 'text'|'image', content, order}
    assessment: {
      type: null, // 'quiz', 'puzzle', or null
      id: null,
      required: false // Should user complete assessment to mark chapter done?
    }
  });

  const [newBlockType, setNewBlockType] = useState('text');
  const [showAddBlock, setShowAddBlock] = useState(false);

  // Add a new content block
  const handleAddBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type: type,
      content: type === 'text' ? '' : '',
      order: editedChapter.contentBlocks?.length || 0
    };
    
    setEditedChapter({
      ...editedChapter,
      contentBlocks: [...(editedChapter.contentBlocks || []), newBlock]
    });
    setShowAddBlock(false);
  };

  // Update content block
  const handleUpdateBlock = (blockId, field, value) => {
    setEditedChapter({
      ...editedChapter,
      contentBlocks: editedChapter.contentBlocks.map(block =>
        block.id === blockId ? { ...block, [field]: value } : block
      )
    });
  };

  // Delete content block
  const handleDeleteBlock = (blockId) => {
    setEditedChapter({
      ...editedChapter,
      contentBlocks: editedChapter.contentBlocks.filter(block => block.id !== blockId)
    });
  };

  // Reorder blocks
  const handleMoveBlock = (blockId, direction) => {
    const index = editedChapter.contentBlocks.findIndex(b => b.id === blockId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === editedChapter.contentBlocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...editedChapter.contentBlocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];

    setEditedChapter({
      ...editedChapter,
      contentBlocks: newBlocks.map((block, idx) => ({ ...block, order: idx }))
    });
  };

  // Update assessment configuration
  const handleUpdateAssessment = (field, value) => {
    setEditedChapter({
      ...editedChapter,
      assessment: {
        ...editedChapter.assessment,
        [field]: value
      }
    });
  };

  // Handle save
  const handleSave = () => {
    if (!editedChapter.title.trim()) {
      alert('Chapter title is required');
      return;
    }
    onSave(editedChapter);
  };

  return (
    <div className="chapter-editor">
      <div className="editor-header">
        <h2>{chapter ? '✏️ Edit Chapter' : '➕ Create New Chapter'}</h2>
        <button className="btn-close" onClick={onCancel}>✕</button>
      </div>

      <div className="editor-content">
        {/* Chapter Metadata */}
        <div className="section">
          <h3>Chapter Information</h3>
          
          <div className="form-group">
            <label>Chapter Title *</label>
            <input
              type="text"
              value={editedChapter.title}
              onChange={(e) => setEditedChapter({ ...editedChapter, title: e.target.value })}
              placeholder="e.g., The Forest Entrance"
            />
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <input
              type="text"
              value={editedChapter.description}
              onChange={(e) => setEditedChapter({ ...editedChapter, description: e.target.value })}
              placeholder="e.g., Leo discovers a magical forest gate"
            />
          </div>

          <div className="form-group">
            <label>Character Emoji (Optional)</label>
            <input
              type="text"
              value={editedChapter.characterImage}
              onChange={(e) => setEditedChapter({ ...editedChapter, characterImage: e.target.value })}
              placeholder="e.g., 🦁"
              maxLength="2"
            />
          </div>
        </div>

        {/* Content Blocks */}
        <div className="section">
          <h3>Chapter Content Blocks</h3>
          <p className="section-hint">Add text and images in any order to create your story</p>

          {/* Existing Blocks */}
          <div className="content-blocks">
            {editedChapter.contentBlocks?.length === 0 && (
              <p className="empty-state">No content blocks yet. Add one to get started!</p>
            )}

            {editedChapter.contentBlocks?.map((block, index) => (
              <div key={block.id} className="content-block">
                <div className="block-header">
                  <span className="block-type">
                    {block.type === 'text' ? '📝 Text' : '🖼️ Image'} #{index + 1}
                  </span>
                  <div className="block-actions">
                    {index > 0 && (
                      <button 
                        className="btn-small"
                        onClick={() => handleMoveBlock(block.id, 'up')}
                        title="Move up"
                      >
                        ↑
                      </button>
                    )}
                    {index < editedChapter.contentBlocks.length - 1 && (
                      <button 
                        className="btn-small"
                        onClick={() => handleMoveBlock(block.id, 'down')}
                        title="Move down"
                      >
                        ↓
                      </button>
                    )}
                    <button 
                      className="btn-small btn-danger"
                      onClick={() => handleDeleteBlock(block.id)}
                      title="Delete block"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {block.type === 'text' ? (
                  <textarea
                    value={block.content}
                    onChange={(e) => handleUpdateBlock(block.id, 'content', e.target.value)}
                    placeholder="Enter paragraph text..."
                    rows="4"
                  />
                ) : (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => handleUpdateBlock(block.id, 'content', e.target.value)}
                    placeholder="Enter image URL..."
                  />
                )}
              </div>
            ))}
          </div>

          {/* Add Block Buttons */}
          <div className="add-block-section">
            <button
              className="btn-secondary"
              onClick={() => handleAddBlock('text')}
            >
              + Add Text Block
            </button>
            <button
              className="btn-secondary"
              onClick={() => handleAddBlock('image')}
            >
              + Add Image Block
            </button>
          </div>
        </div>

        {/* Assessment Configuration */}
        <div className="section">
          <h3>Assessment (Optional)</h3>
          <p className="section-hint">Link a quiz or puzzle to this chapter (optional)</p>

          <div className="form-group">
            <label>Assessment Type</label>
            <select
              value={editedChapter.assessment?.type || ''}
              onChange={(e) => handleUpdateAssessment('type', e.target.value || null)}
            >
              <option value="">None (No Assessment)</option>
              <option value="quiz">📝 Quiz</option>
              <option value="puzzle">🧩 Puzzle</option>
            </select>
          </div>

          {editedChapter.assessment?.type && (
            <>
              <div className="form-group">
                <label>
                  {editedChapter.assessment.type === 'quiz' ? 'Quiz ID' : 'Puzzle ID'}
                </label>
                <input
                  type="text"
                  value={editedChapter.assessment?.id || ''}
                  onChange={(e) => handleUpdateAssessment('id', e.target.value)}
                  placeholder="e.g., quiz_forest_1"
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={editedChapter.assessment?.required || false}
                    onChange={(e) => handleUpdateAssessment('required', e.target.checked)}
                  />
                  <span>
                    Required: User must complete {editedChapter.assessment.type} to mark chapter as done
                  </span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="editor-actions">
          <button className="btn-success" onClick={handleSave}>
            💾 {chapter ? 'Update Chapter' : 'Create Chapter'}
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
