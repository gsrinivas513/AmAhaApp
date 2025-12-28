/**
 * ManageTopicStoriesModal.jsx
 * 
 * Modal to manage stories for a specific topic subtopic
 * Shows all stories assigned to the subtopic and allows adding/editing/deleting
 */

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import './ManageTopicStoriesModal.css';

export default function ManageTopicStoriesModal({ 
  isOpen, 
  onClose, 
  subtopicId, 
  topicId, 
  categoryId,
  subtopic 
}) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [showStoryDetail, setShowStoryDetail] = useState(false);
  const [isEditingStory, setIsEditingStory] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [selectedChapterIdx, setSelectedChapterIdx] = useState(null);
  const [isEditingChapter, setIsEditingChapter] = useState(false);
  const [chapterForm, setChapterForm] = useState({});

  useEffect(() => {
    if (isOpen && subtopicId) {
      loadStoriesForSubtopic();
    }
  }, [isOpen, subtopicId]);

  useEffect(() => {
    // When a story is selected and we're in detail view, fetch full story details
    if (selectedStory && showStoryDetail) {
      loadFullStoryDetails();
    }
  }, [selectedStory?.id, showStoryDetail]);

  const loadFullStoryDetails = async () => {
    try {
      const storyRef = doc(db, 'stories', selectedStory.id);
      const storySnap = await getDoc(storyRef);
      if (storySnap.exists()) {
        const fullStory = {
          id: storySnap.id,
          ...storySnap.data()
        };
        console.log('Full story loaded:', fullStory);
        console.log('Chapters:', fullStory.chapters);
        setSelectedStory(fullStory);
      }
    } catch (error) {
      console.error('Error loading story details:', error);
    }
  };

  const loadStoriesForSubtopic = async () => {
    try {
      setLoading(true);
      // Fetch stories filtered by subtopicId
      const storiesQuery = query(
        collection(db, 'stories'),
        where('subtopicId', '==', subtopicId)
      );
      const storiesSnap = await getDocs(storiesQuery);
      const storiesList = storiesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStories(storiesList);
      setMessage(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    
    try {
      await deleteDoc(doc(db, 'stories', storyId));
      setMessage({ type: 'success', text: 'Story deleted successfully' });
      setSelectedStory(null);
      setShowStoryDetail(false);
      loadStoriesForSubtopic();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete story: ' + error.message });
    }
  };

  const handleEditStory = (story) => {
    setEditForm({
      title: story.title || '',
      description: story.description || '',
      targetAudience: story.targetAudience || 'kids',
      coverColor: story.coverColor || '#667eea'
    });
    setIsEditingStory(true);
  };

  const handleSaveStory = async () => {
    if (!editForm.title.trim()) {
      setMessage({ type: 'error', text: 'Story title is required' });
      return;
    }

    try {
      await updateDoc(doc(db, 'stories', selectedStory.id), {
        title: editForm.title,
        description: editForm.description,
        targetAudience: editForm.targetAudience,
        coverColor: editForm.coverColor
      });

      setMessage({ type: 'success', text: 'Story updated successfully' });
      
      // Update the selected story in state
      setSelectedStory(prev => ({
        ...prev,
        ...editForm
      }));

      // Update in stories array
      setStories(prev => prev.map(s => 
        s.id === selectedStory.id ? { ...s, ...editForm } : s
      ));

      setIsEditingStory(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save story: ' + error.message });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingStory(false);
    setEditForm({});
  };

  const handleEditChapter = (chapterIdx) => {
    const chapter = selectedStory.chapters[chapterIdx];
    setChapterForm({
      title: chapter?.title || '',
      description: chapter?.description || ''
    });
    setSelectedChapterIdx(chapterIdx);
    setIsEditingChapter(true);
  };

  const handleSaveChapter = async () => {
    if (!chapterForm.title.trim()) {
      setMessage({ type: 'error', text: 'Chapter title is required' });
      return;
    }

    try {
      const updatedChapters = [...(selectedStory.chapters || [])];
      updatedChapters[selectedChapterIdx] = {
        ...updatedChapters[selectedChapterIdx],
        title: chapterForm.title,
        description: chapterForm.description
      };

      await updateDoc(doc(db, 'stories', selectedStory.id), {
        chapters: updatedChapters
      });

      setMessage({ type: 'success', text: 'Chapter updated successfully' });

      // Update the selected story
      setSelectedStory(prev => ({
        ...prev,
        chapters: updatedChapters
      }));

      // Update in stories array
      setStories(prev => prev.map(s => 
        s.id === selectedStory.id ? { ...s, chapters: updatedChapters } : s
      ));

      setIsEditingChapter(false);
      setSelectedChapterIdx(null);
      setChapterForm({});
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save chapter: ' + error.message });
    }
  };

  const handleDeleteChapter = async (chapterIdx) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;

    try {
      const updatedChapters = selectedStory.chapters.filter((_, idx) => idx !== chapterIdx);

      await updateDoc(doc(db, 'stories', selectedStory.id), {
        chapters: updatedChapters
      });

      setMessage({ type: 'success', text: 'Chapter deleted successfully' });

      // Update the selected story
      setSelectedStory(prev => ({
        ...prev,
        chapters: updatedChapters
      }));

      // Update in stories array
      setStories(prev => prev.map(s => 
        s.id === selectedStory.id ? { ...s, chapters: updatedChapters } : s
      ));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete chapter: ' + error.message });
    }
  };

  const handleCancelChapterEdit = () => {
    setIsEditingChapter(false);
    setSelectedChapterIdx(null);
    setChapterForm({});
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Topic Stories</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {message && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="subtopic-info">
            <p><strong>Subtopic:</strong> {subtopic?.label || 'Unknown'}</p>
            <p><strong>Topic ID:</strong> {topicId}</p>
            <p><strong>Category ID:</strong> {categoryId}</p>
          </div>

          {loading ? (
            <div className="loading">Loading stories...</div>
          ) : !showStoryDetail ? (
            <div className="stories-list">
              <h3>Stories ({stories.length})</h3>
              {stories.length === 0 ? (
                <div className="no-stories">
                  <p>No stories available yet.</p>
                  <p>Click the ➕ button to add a new story for this subtopic.</p>
                </div>
              ) : (
                <div className="stories-grid">
                  {stories.map((story) => (
                    <div 
                      key={story.id} 
                      className="story-card"
                      onClick={async () => {
                        // Fetch full story details
                        try {
                          const storyRef = doc(db, 'stories', story.id);
                          const storySnap = await getDoc(storyRef);
                          if (storySnap.exists()) {
                            setSelectedStory({
                              id: storySnap.id,
                              ...storySnap.data()
                            });
                          } else {
                            setSelectedStory(story);
                          }
                        } catch (error) {
                          console.error('Error loading story:', error);
                          setSelectedStory(story);
                        }
                        setShowStoryDetail(true);
                      }}
                    >
                      <div className="story-cover" style={{ background: story.coverColor || '#667eea' }}>
                        {story.coverImage && (
                          <img src={story.coverImage} alt={story.title} />
                        )}
                        {!story.coverImage && <span className="cover-placeholder">📖</span>}
                      </div>
                      <div className="story-info">
                        <h4>{story.title}</h4>
                        <p className="story-description">{story.description}</p>
                        <p className="story-meta">
                          <span className="audience">👶 {story.targetAudience || 'kids'}</span>
                          <span className="chapters">📖 {story.chapters?.length || 0} chapters</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="story-detail">
              <button className="btn-back" onClick={() => {
                setShowStoryDetail(false);
                setIsEditingStory(false);
              }}>← Back to Stories</button>
              
              {!isEditingStory ? (
                // VIEW MODE
                <div className="story-detail-content">
                  <div className="story-detail-cover">
                    {selectedStory?.coverImage ? (
                      <img src={selectedStory.coverImage} alt={selectedStory.title} />
                    ) : (
                      <div style={{ background: selectedStory?.coverColor || '#667eea', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 48 }}>📖</span>
                      </div>
                    )}
                  </div>

                  <div className="story-detail-info">
                    <h2>{selectedStory?.title}</h2>
                    
                    <div className="detail-section">
                      <h4>Description</h4>
                      <p>{selectedStory?.description || 'No description'}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Details</h4>
                      <div className="detail-grid">
                        <div className="detail-item">
                          <span className="label">Target Audience:</span>
                          <span className="value">{selectedStory?.targetAudience || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Status:</span>
                          <span className="value">{selectedStory?.isPublished ? '✅ Published' : '⏳ Draft'}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Chapters:</span>
                          <span className="value">{selectedStory?.chapters?.length || 0}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Created:</span>
                          <span className="value">
                            {selectedStory?.createdAt 
                              ? new Date(selectedStory.createdAt.toDate?.() || selectedStory.createdAt).toLocaleDateString()
                              : 'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="chapters-section">
                      {selectedStory?.chapters && selectedStory.chapters.length > 0 ? (
                        <>
                          <h4>Chapters ({selectedStory.chapters.length})</h4>
                          <div className="chapters-list">
                            {selectedStory.chapters.map((chapter, idx) => (
                              <div key={idx} className="chapter-item">
                                <span className="chapter-number">{idx + 1}</span>
                                <div className="chapter-info">
                                  <p className="chapter-title">{chapter.title || 'Untitled Chapter'}</p>
                                  <p className="chapter-desc">{chapter.description}</p>
                                </div>
                                <div className="chapter-actions">
                                  <button 
                                    className="btn-chapter-edit"
                                    onClick={() => handleEditChapter(idx)}
                                    title="Edit Chapter"
                                  >
                                    ✏️
                                  </button>
                                  <button 
                                    className="btn-chapter-delete"
                                    onClick={() => handleDeleteChapter(idx)}
                                    title="Delete Chapter"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="no-chapters-section">
                          <h4>Chapters</h4>
                          <p className="no-chapters">No chapters in this story yet.</p>
                        </div>
                      )}
                    </div>

                    <div className="detail-actions">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditStory(selectedStory)}
                      >
                        ✏️ Edit Story
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteStory(selectedStory.id)}
                      >
                        🗑️ Delete Story
                      </button>
                    </div>
                  </div>
                </div>
              ) : isEditingChapter ? (
                // CHAPTER EDIT MODE
                <div className="story-edit-form">
                  <button className="btn-back-mini" onClick={handleCancelChapterEdit}>← Back</button>
                  <h3>Edit Chapter {selectedChapterIdx + 1}</h3>
                  
                  <div className="form-group">
                    <label>Chapter Title *</label>
                    <input
                      type="text"
                      value={chapterForm.title}
                      onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                      placeholder="Enter chapter title"
                    />
                  </div>

                  <div className="form-group">
                    <label>Chapter Description</label>
                    <textarea
                      value={chapterForm.description}
                      onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                      placeholder="Enter chapter description"
                      rows={4}
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn-save"
                      onClick={handleSaveChapter}
                    >
                      ✅ Save Chapter
                    </button>
                    <button 
                      className="btn-cancel"
                      onClick={handleCancelChapterEdit}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // STORY EDIT MODE
                <div className="story-edit-form">
                  <h3>Edit Story</h3>
                  
                  <div className="form-group">
                    <label>Story Title *</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Enter story title"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Enter story description"
                      rows={4}
                    />
                  </div>

                  <div className="form-group">
                    <label>Target Audience</label>
                    <select
                      value={editForm.targetAudience}
                      onChange={(e) => setEditForm({ ...editForm, targetAudience: e.target.value })}
                    >
                      <option value="kids">👶 Kids</option>
                      <option value="general">👨‍👩‍👧‍👦 General</option>
                      <option value="programmers">💻 Programmers</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Cover Color</label>
                    <div className="color-picker">
                      <input
                        type="color"
                        value={editForm.coverColor}
                        onChange={(e) => setEditForm({ ...editForm, coverColor: e.target.value })}
                      />
                      <div 
                        className="color-preview" 
                        style={{ background: editForm.coverColor }}
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button 
                      className="btn-save"
                      onClick={handleSaveStory}
                    >
                      ✅ Save Changes
                    </button>
                    <button 
                      className="btn-cancel"
                      onClick={handleCancelEdit}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
