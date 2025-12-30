/**
 * StoryModal.jsx
 * 
 * Inline modal component for Story management
 * - Create/edit stories
 * - Add chapters
 * - Publish stories
 * - Real-time updates
 */

import React, { useState, useEffect } from 'react';
import {
  getAllStoriesAdmin,
  createStory,
  publishStory,
  deleteStory,
  addChapter,
  deleteChapter
} from '../../services/storyService';
import ChapterDetailEditor from './ChapterDetailEditor';
import './StoryModal.css';

export default function StoryModal({ isOpen, onClose }) {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingChapter, setEditingChapter] = useState(null);
  const [showChapterEditor, setShowChapterEditor] = useState(false);

  const [storyForm, setStoryForm] = useState({
    title: '',
    description: '',
    targetAudience: 'kids',
    coverImage: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadStories();
    }
  }, [isOpen]);

  const loadStories = async () => {
    try {
      setLoading(true);
      const data = await getAllStoriesAdmin();
      setStories(data);
      if (data.length > 0) {
        setSelectedStory(data[0]);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async () => {
    try {
      if (!storyForm.title.trim()) {
        setMessage({ type: 'error', text: 'Story title is required' });
        return;
      }

      await createStory({
        title: storyForm.title,
        description: storyForm.description,
        targetAudience: storyForm.targetAudience,
        coverImage: storyForm.coverImage
      });

      setMessage({ type: 'success', text: '✅ Story created!' });
      setIsCreating(false);
      setStoryForm({
        title: '',
        description: '',
        targetAudience: 'kids',
        coverImage: ''
      });
      loadStories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleAddChapter = async (chapterData) => {
    try {
      if (!selectedStory) return;

      const chapters = selectedStory.chapters || [];
      const order = chapters.length + 1;

      const newChapter = {
        ...chapterData,
        order
      };

      await addChapter(selectedStory.id, newChapter);

      setMessage({ type: 'success', text: '✅ Chapter added successfully!' });
      setShowChapterEditor(false);
      setEditingChapter(null);
      loadStories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleOpenChapterEditor = (chapter = null) => {
    setEditingChapter(chapter);
    setShowChapterEditor(true);
  };

  const handleCloseChapterEditor = () => {
    setShowChapterEditor(false);
    setEditingChapter(null);
  };

  const handlePublish = async (storyId) => {
    try {
      await publishStory(storyId);
      setMessage({ type: 'success', text: '✅ Story published!' });
      loadStories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (storyId) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;

    try {
      await deleteStory(storyId);
      setMessage({ type: 'success', text: '✅ Story deleted!' });
      setSelectedStory(null);
      loadStories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📖 Story Management</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="modal-loading">Loading stories...</div>
        ) : (
          <div className="modal-body">
            <div className="story-editor-layout">
              {/* Stories List */}
              <div className="stories-panel">
                <div className="panel-header">
                  <h3>Stories</h3>
                  {!isCreating && (
                    <button className="btn-small btn-primary" onClick={() => setIsCreating(true)}>
                      + New
                    </button>
                  )}
                </div>

                {isCreating && (
                  <form className="story-form" onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateStory();
                  }}>
                    <input
                      type="text"
                      placeholder="Story Title"
                      value={storyForm.title}
                      onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                    />
                    <textarea
                      placeholder="Description"
                      value={storyForm.description}
                      onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                      rows="3"
                    />
                    <select
                      value={storyForm.targetAudience}
                      onChange={(e) => setStoryForm({ ...storyForm, targetAudience: e.target.value })}
                    >
                      <option value="kids">Kids</option>
                      <option value="general">General</option>
                      <option value="programmers">Programmers</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Cover Image URL (optional)"
                      value={storyForm.coverImage}
                      onChange={(e) => setStoryForm({ ...storyForm, coverImage: e.target.value })}
                    />
                    <div className="form-actions">
                      <button type="submit" className="btn-primary">Create</button>
                      <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
                    </div>
                  </form>
                )}

                <div className="stories-list">
                  {stories.map(story => (
                    <div
                      key={story.id}
                      className={`story-item ${selectedStory?.id === story.id ? 'active' : ''}`}
                      onClick={() => setSelectedStory(story)}
                    >
                      <div className="story-item-header">
                        <h4>{story.title}</h4>
                        {story.published && <span className="published-badge">✅</span>}
                      </div>
                      <p className="story-item-meta">{story.chapterCount || 0} chapters</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Story Details */}
              {selectedStory && (
                <div className="story-details">
                  <h3>{selectedStory.title}</h3>

                  <div className="story-info-grid">
                    <div className="info-item">
                      <span className="label">Audience:</span>
                      <span>{selectedStory.targetAudience}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Chapters:</span>
                      <span>{selectedStory.chapterCount || 0}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Status:</span>
                      <span>{selectedStory.published ? '✅ Published' : '⏳ Draft'}</span>
                    </div>
                  </div>

                  {selectedStory.description && (
                    <div className="story-description">
                      <p>{selectedStory.description}</p>
                    </div>
                  )}

                  {/* Chapters */}
                  {selectedStory.chapters && selectedStory.chapters.length > 0 && (
                    <div className="chapters-list">
                      <h4>Chapters</h4>
                      {selectedStory.chapters.map((chapter, idx) => (
                        <div key={chapter.id} className="chapter-item">
                          <div className="chapter-header">
                            <h5>Chapter {idx + 1}: {chapter.title}</h5>
                            <button
                              className="btn-icon"
                              onClick={() => deleteChapter(selectedStory.id, chapter.id)}
                              title="Delete chapter"
                            >
                              🗑️
                            </button>
                          </div>
                          {chapter.description && <p>{chapter.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Chapter Button */}
                  <div className="add-chapter-section">
                    <button 
                      className="btn-primary"
                      onClick={() => handleOpenChapterEditor()}
                    >
                      + Add Chapter with Advanced Editor
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="story-actions">
                    {!selectedStory.published && (
                      <button
                        className="btn-success"
                        onClick={() => handlePublish(selectedStory.id)}
                      >
                        ✅ Publish Story
                      </button>
                    )}
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(selectedStory.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>

      {/* Chapter Detail Editor Modal */}
      {showChapterEditor && (
        <div className="modal-overlay">
          <ChapterDetailEditor
            chapter={editingChapter}
            onSave={handleAddChapter}
            onCancel={handleCloseChapterEditor}
          />
        </div>
      )}
    </div>
  );
}
