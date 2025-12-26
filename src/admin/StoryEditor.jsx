/**
 * StoryEditor.jsx
 * 
 * Admin page to create and manage stories
 * - Create new stories
 * - Add/edit chapters
 * - Publish stories
 * - View completion stats
 */

import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  getAllStoriesAdmin,
  createStory,
  updateStory,
  publishStory,
  deleteStory,
  addChapter,
  deleteChapter,
  updateChapter
} from '../services/storyService';
import ChapterDetailEditor from './modals/ChapterDetailEditor';
import './StoryEditor.css';

export default function StoryEditor() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Create, Step 2: Add chapters, Step 3: Publish

  const [storyForm, setStoryForm] = useState({
    title: '',
    description: '',
    targetAudience: 'kids', // kids, general, programmers
    coverImage: '',
    coverColor: '#667eea' // Default gradient color
  });

  const [editingChapter, setEditingChapter] = useState(null);
  const [showChapterEditor, setShowChapterEditor] = useState(false);

  const [chapterForm, setChapterForm] = useState({
    title: '',
    description: '',
    character: '',
    characterImage: ''
  });

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      const data = await getAllStoriesAdmin();
      setStories(data);
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
        coverImage: storyForm.coverImage,
        coverColor: storyForm.coverColor
      });

      setMessage({ type: 'success', text: 'Story created! Now add chapters.' });
      setIsCreating(false);
      setCurrentStep(1); // Reset step
      setStoryForm({
        title: '',
        description: '',
        targetAudience: 'kids',
        coverImage: '',
        coverColor: '#667eea'
      });
      loadStories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleAddChapter = async () => {
    try {
      if (!selectedStory) return;
      if (!chapterForm.title.trim()) {
        setMessage({ type: 'error', text: 'Chapter title is required' });
        return;
      }

      await addChapter(selectedStory.id, {
        title: chapterForm.title,
        description: chapterForm.description,
        character: chapterForm.character,
        characterImage: chapterForm.characterImage
      });

      setMessage({ type: 'success', text: 'Chapter added!' });
      setChapterForm({
        title: '',
        description: '',
        character: '',
        characterImage: ''
      });
      
      // Reload selected story
      const updated = await getAllStoriesAdmin();
      const newSelected = updated.find(s => s.id === selectedStory.id);
      setSelectedStory(newSelected);
      setStories(updated);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handlePublish = async (storyId) => {
    try {
      await publishStory(storyId);
      setMessage({ type: 'success', text: 'Story published!' });
      loadStories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleDelete = async (storyId) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;

    try {
      await deleteStory(storyId);
      setMessage({ type: 'success', text: 'Story deleted!' });
      setSelectedStory(null);
      loadStories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleOpenChapterEditor = () => {
    setEditingChapter(null);
    setShowChapterEditor(true);
  };

  const handleCloseChapterEditor = () => {
    setShowChapterEditor(false);
    setEditingChapter(null);
  };

  const handleAddChapterFromEditor = async (chapterData) => {
    try {
      if (!selectedStory) return;

      if (editingChapter) {
        // Update existing chapter
        await updateChapter(selectedStory.id, editingChapter.id, chapterData);
        setMessage({ type: 'success', text: '✅ Chapter updated!' });
      } else {
        // Create new chapter
        const chapters = selectedStory.chapters || [];
        const order = chapters.length + 1;

        const newChapter = {
          ...chapterData,
          order
        };

        await addChapter(selectedStory.id, newChapter);
        setMessage({ type: 'success', text: '✅ Chapter added!' });
      }

      setShowChapterEditor(false);
      setEditingChapter(null);
      loadStories();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  if (loading) return <div className="admin-loading">Loading stories...</div>;

  return (
    <AdminLayout>
      <div className="story-editor">
        <div className="page-header">
          <h2>📖 Story Management</h2>
          <p className="page-subtitle">Create engaging stories with chapters and quizzes</p>
        </div>

        {/* Quick Guide */}
        <div className="quick-guide">
          <h3>🎯 How to Create a Story</h3>
          <div className="steps-guide">
            <div className="guide-step">
              <div className="step-icon">1️⃣</div>
              <div className="step-content">
                <h4>Create Story</h4>
                <p>Click "Create New Story" and fill in the basic story details (title, description, audience, cover image or color)</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-icon">2️⃣</div>
              <div className="step-content">
                <h4>Add Chapters</h4>
                <p>Select your story and click "Add Chapter" to create story chapters with content blocks, images, and descriptions</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-icon">3️⃣</div>
              <div className="step-content">
                <h4>Add Assessments</h4>
                <p>For each chapter, add a quiz or puzzle assessment to test the user's understanding of the chapter content</p>
              </div>
            </div>
            <div className="guide-step">
              <div className="step-icon">4️⃣</div>
              <div className="step-content">
                <h4>Preview & Publish</h4>
                <p>Preview your story to see how it looks for users, then publish it to make it visible on the platform</p>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="editor-layout">
          {/* Stories List */}
          <div className="stories-panel">
            <h3>📚 Your Stories</h3>
            {!isCreating ? (
              <button className="btn-primary" onClick={() => setIsCreating(true)}>
                ➕ Create New Story
              </button>
            ) : (
              <form className="story-form" onSubmit={(e) => {
                e.preventDefault();
                handleCreateStory();
              }}>
                <h4>Story Details</h4>
                <input
                  type="text"
                  placeholder="Story Title"
                  value={storyForm.title}
                  onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                  required
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
                  <option value="kids">👶 Kids</option>
                  <option value="general">👥 General</option>
                  <option value="programmers">💻 Programmers</option>
                </select>
                <input
                  type="text"
                  placeholder="Cover Image URL (optional)"
                  value={storyForm.coverImage}
                  onChange={(e) => setStoryForm({ ...storyForm, coverImage: e.target.value })}
                />
                <div className="color-picker-group">
                  <label>Cover Color (if no image):</label>
                  <div className="color-picker-container">
                    <input
                      type="color"
                      value={storyForm.coverColor}
                      onChange={(e) => setStoryForm({ ...storyForm, coverColor: e.target.value })}
                      className="color-input"
                    />
                    <div 
                      className="color-preview"
                      style={{ backgroundColor: storyForm.coverColor }}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">✓ Create Story</button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="stories-list">
              {stories.length === 0 ? (
                <div className="empty-state">
                  <p>No stories yet. Create your first story!</p>
                </div>
              ) : (
                stories.map(story => (
                  <div
                    key={story.id}
                    className={`story-item ${selectedStory?.id === story.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedStory(story);
                      setCurrentStep(2);
                    }}
                  >
                    <h4>{story.title}</h4>
                    <div className="story-item-meta">
                      <span className="chapter-count">📚 {story.chapterCount} chapters</span>
                      {story.published && <span className="published-badge">✓ Published</span>}
                      {!story.published && <span className="draft-badge">Draft</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Story Details with Steps */}
          {selectedStory && (
            <div className="story-details">
              {/* Story Info */}
              <div className="story-section">
                <h3>📖 {selectedStory.title}</h3>

                <div className="story-info">
                  <div className="info-group">
                    <label>Audience</label>
                    <p>{selectedStory.targetAudience === 'kids' ? '👶 Kids' : selectedStory.targetAudience === 'general' ? '👥 General' : '💻 Programmers'}</p>
                  </div>
                  <div className="info-group">
                    <label>Description</label>
                    <p>{selectedStory.description || 'No description'}</p>
                  </div>
                  <div className="info-group">
                    <label>Status</label>
                    <p>{selectedStory.published ? '✅ Published' : '⏳ Draft'}</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Chapters */}
              <div className="chapters-section">
                <div className="section-header">
                  <h3>📚 Chapters ({selectedStory.chapterCount || 0})</h3>
                  <button 
                    className="btn-primary btn-add-chapter"
                    onClick={() => {
                      setEditingChapter(null);
                      setShowChapterEditor(true);
                      setCurrentStep(2);
                    }}
                  >
                    ➕ Add Chapter
                  </button>
                </div>

                {selectedStory.chapters && selectedStory.chapters.length > 0 ? (
                  <div className="chapters-grid">
                    {selectedStory.chapters.map((chapter, idx) => (
                      <div key={chapter.id} className="chapter-card">
                        <div className="chapter-number">
                          Chapter {idx + 1}
                        </div>
                        
                        <div className="chapter-content">
                          <h4>{chapter.title}</h4>
                          {chapter.description && (
                            <p className="chapter-desc">{chapter.description}</p>
                          )}
                          
                          {chapter.contentBlocks && chapter.contentBlocks.length > 0 && (
                            <div className="chapter-stats">
                              <span>📝 {chapter.contentBlocks.length} blocks</span>
                            </div>
                          )}
                          
                          {chapter.assessment && (
                            <div className="chapter-assessment">
                              <span className="assessment-badge">
                                {chapter.assessment.type === 'quiz' ? '❓ Quiz' : '🧩 Puzzle'}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="chapter-actions">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => {
                              setEditingChapter(chapter);
                              setShowChapterEditor(true);
                            }}
                            title="Edit chapter"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={async () => {
                              if (window.confirm('Delete this chapter?')) {
                                await deleteChapter(selectedStory.id, chapter.id);
                                loadStories();
                              }
                            }}
                            title="Delete chapter"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-chapters">
                    <p>📖 No chapters yet. Add your first chapter to get started!</p>
                  </div>
                )}
              </div>

              {/* Step 3: Publish */}
              <div className="publish-section">
                <h3>🎯 Publishing</h3>
                
                <div className="publish-checklist">
                  <div className={`checklist-item ${selectedStory.title ? 'done' : ''}`}>
                    <span className="check">{selectedStory.title ? '✓' : '○'}</span>
                    <span>Story title filled</span>
                  </div>
                  <div className={`checklist-item ${(selectedStory.chapters && selectedStory.chapters.length > 0) ? 'done' : ''}`}>
                    <span className="check">{(selectedStory.chapters && selectedStory.chapters.length > 0) ? '✓' : '○'}</span>
                    <span>At least one chapter added</span>
                  </div>
                  <div className={`checklist-item ${selectedStory.published ? 'done' : ''}`}>
                    <span className="check">{selectedStory.published ? '✓' : '○'}</span>
                    <span>Story published</span>
                  </div>
                </div>

                <div className="publish-actions">
                  <button
                    className="btn-preview"
                    onClick={() => window.open(`/story/${selectedStory.id}`, '_blank')}
                  >
                    👁️ Preview Story
                  </button>
                  {!selectedStory.published && (
                    <button
                      className="btn-success"
                      onClick={() => handlePublish(selectedStory.id)}
                      disabled={!selectedStory.chapters || selectedStory.chapters.length === 0}
                    >
                      🚀 Publish Story
                    </button>
                  )}
                  {selectedStory.published && (
                    <div className="published-status">
                      ✅ This story is published and visible to users
                    </div>
                  )}
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(selectedStory.id)}
                  >
                    🗑️ Delete Story
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chapter Detail Editor Modal */}
          {showChapterEditor && (
            <div className="modal-overlay">
              <ChapterDetailEditor
                chapter={editingChapter}
                onSave={handleAddChapterFromEditor}
                onCancel={handleCloseChapterEditor}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
