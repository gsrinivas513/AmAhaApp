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
import {
  getAllStoriesAdmin,
  createStory,
  updateStory,
  publishStory,
  deleteStory,
  addChapter,
  deleteChapter
} from '../services/storyService';
import './StoryEditor.css';

export default function StoryEditor() {
  const [stories, setStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const [storyForm, setStoryForm] = useState({
    title: '',
    description: '',
    targetAudience: 'kids', // kids, general, programmers
    coverImage: ''
  });

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
        coverImage: storyForm.coverImage
      });

      setMessage({ type: 'success', text: 'Story created!' });
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

  if (loading) return <div className="admin-loading">Loading stories...</div>;

  return (
    <div className="story-editor">
      <h2>📖 Story Management</h2>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="editor-layout">
        {/* Stories List */}
        <div className="stories-panel">
          <h3>Stories</h3>
          {!isCreating ? (
            <button className="btn-primary" onClick={() => setIsCreating(true)}>
              + New Story
            </button>
          ) : (
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
                placeholder="Cover Image URL"
                value={storyForm.coverImage}
                onChange={(e) => setStoryForm({ ...storyForm, coverImage: e.target.value })}
              />
              <div className="form-actions">
                <button type="submit" className="btn-primary">Create</button>
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
            {stories.map(story => (
              <div
                key={story.id}
                className={`story-item ${selectedStory?.id === story.id ? 'active' : ''}`}
                onClick={() => setSelectedStory(story)}
              >
                <h4>{story.title}</h4>
                <p>{story.chapterCount} chapters</p>
                {story.published && <span className="published-badge">Published</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Story Details */}
        {selectedStory && (
          <div className="story-details">
            <h3>{selectedStory.title}</h3>

            <div className="story-info">
              <p><strong>Audience:</strong> {selectedStory.targetAudience}</p>
              <p><strong>Chapters:</strong> {selectedStory.chapterCount}</p>
              <p><strong>Status:</strong> {selectedStory.published ? '✅ Published' : '⏳ Draft'}</p>
            </div>

            {selectedStory.chapters && selectedStory.chapters.length > 0 && (
              <div className="chapters-list">
                <h4>Chapters</h4>
                {selectedStory.chapters.map((chapter, idx) => (
                  <div key={chapter.id} className="chapter-item">
                    <div className="chapter-header">
                      <h5>Chapter {idx + 1}: {chapter.title}</h5>
                      <button
                        className="btn-delete"
                        onClick={() => deleteChapter(selectedStory.id, chapter.id)}
                      >
                        🗑️
                      </button>
                    </div>
                    {chapter.description && <p>{chapter.description}</p>}
                  </div>
                ))}
              </div>
            )}

            <div className="add-chapter">
              <h4>Add Chapter</h4>
              <input
                type="text"
                placeholder="Chapter Title"
                value={chapterForm.title}
                onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={chapterForm.description}
                onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                rows="2"
              />
              <button className="btn-primary" onClick={handleAddChapter}>
                + Add Chapter
              </button>
            </div>

            <div className="story-actions">
              {!selectedStory.published && (
                <button
                  className="btn-primary"
                  onClick={() => handlePublish(selectedStory.id)}
                >
                  Publish Story
                </button>
              )}
              <button
                className="btn-delete"
                onClick={() => handleDelete(selectedStory.id)}
              >
                Delete Story
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
