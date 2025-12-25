import React, { useState } from 'react';
import './arts.css';

/**
 * Arts UI Components - Gallery, projects, and creative community
 */

// ===== ART PROJECT CARD =====

export function ArtProjectCard({ project, onLike, onComment, onView, isLiked = false }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    onLike?.(project.id, !isLiked);
  };

  const handleComment = () => {
    if (newComment.trim()) {
      onComment?.(project.id, newComment);
      setNewComment('');
    }
  };

  return (
    <div className="art-project-card">
      <div className="art-image-container">
        <img
          src={project.image || '/placeholder-art.png'}
          alt={project.title}
          className="art-image"
          onClick={() => onView?.(project.id)}
        />
        <div className="art-overlay">
          <div className="art-info">
            <h3>{project.title}</h3>
            <p>{project.creatorName}</p>
          </div>
        </div>
      </div>

      <div className="art-content">
        <h4 className="art-title">{project.title}</h4>
        <p className="art-creator">by {project.creatorName}</p>

        <div className="art-meta">
          <span className="art-category">{project.category}</span>
          {project.featured && <span className="featured-badge">⭐ Featured</span>}
        </div>

        <div className="art-stats">
          <div className="stat">
            <span className="icon">❤️</span>
            <span className="count">{project.likes}</span>
          </div>
          <div className="stat">
            <span className="icon">💬</span>
            <span className="count">{project.comments}</span>
          </div>
          <div className="stat">
            <span className="icon">👁️</span>
            <span className="count">{project.views}</span>
          </div>
          <div className="stat">
            <span className="icon">⭐</span>
            <span className="count">{project.rating}</span>
          </div>
        </div>

        <div className="art-actions">
          <button
            className={`btn btn-icon ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
            title="Like"
          >
            ❤️ Like
          </button>
          <button
            className="btn btn-icon"
            onClick={() => setShowComments(!showComments)}
            title="Comment"
          >
            💬 Comment
          </button>
          <button
            className="btn btn-icon"
            onClick={() => onView?.(project.id)}
            title="View"
          >
            👁️ View
          </button>
        </div>

        {showComments && (
          <div className="comment-section">
            <div className="comment-input-group">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={handleComment}
              >
                Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== ART GALLERY =====

export function ArtGallery({ projects, onProjectClick, loading = false, emptyMessage = 'No projects found' }) {
  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="gallery-empty">
        <p className="empty-icon">🎨</p>
        <p className="empty-text">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="art-gallery">
      {projects.map((project) => (
        <div
          key={project.id}
          className="gallery-item"
          onClick={() => onProjectClick?.(project.id)}
        >
          <img
            src={project.image || '/placeholder-art.png'}
            alt={project.title}
            className="gallery-image"
          />
          <div className="gallery-overlay">
            <h4>{project.title}</h4>
            <p>{project.creatorName}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== COMMENT SECTION =====

export function CommentsSection({ comments = [], onAddComment, onDeleteComment }) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment?.(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments ({comments.length})</h3>

      <div className="comment-input-group">
        <input
          type="text"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
        />
        <button className="btn btn-primary" onClick={handleSubmit}>
          Post Comment
        </button>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.userName}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-text">{comment.content}</p>
              {onDeleteComment && (
                <button
                  className="comment-delete"
                  onClick={() => onDeleteComment?.(comment.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ===== COLLABORATION PANEL =====

export function CollaborationPanel({ collaborators = [], onAddCollaborator, onRemoveCollaborator, isOwner = false }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [collaboratorId, setCollaboratorId] = useState('');

  const handleAddCollaborator = () => {
    if (collaboratorId.trim()) {
      onAddCollaborator?.(collaboratorId);
      setCollaboratorId('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="collaboration-panel">
      <h3 className="collaborators-title">Collaborators</h3>

      <div className="collaborators-list">
        {collaborators.length === 0 ? (
          <p className="no-collaborators">No collaborators yet</p>
        ) : (
          collaborators.map((collab) => (
            <div key={collab.userId} className="collaborator-item">
              <div className="collaborator-info">
                <span className="collaborator-name">{collab.userId}</span>
                <span className="collaborator-role">{collab.role}</span>
              </div>
              {isOwner && (
                <button
                  className="btn-remove"
                  onClick={() => onRemoveCollaborator?.(collab.userId)}
                >
                  ✕
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {isOwner && (
        <>
          {showAddForm ? (
            <div className="add-collaborator-form">
              <input
                type="text"
                placeholder="Enter collaborator user ID"
                value={collaboratorId}
                onChange={(e) => setCollaboratorId(e.target.value)}
                className="collaborator-input"
              />
              <div className="form-actions">
                <button className="btn btn-sm btn-primary" onClick={handleAddCollaborator}>
                  Add
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button className="btn btn-secondary btn-block" onClick={() => setShowAddForm(true)}>
              + Add Collaborator
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ===== ART FILTERS =====

export function ArtFilters({ onFilter, categories }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = () => {
    onFilter?.({
      category: selectedCategory,
      search: searchTerm,
      sortBy,
    });
  };

  return (
    <div className="art-filters">
      <div className="filter-group">
        <label htmlFor="art-search">Search Arts</label>
        <input
          id="art-search"
          type="text"
          placeholder="Search by title, tags, artist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="art-category">Category</label>
        <select
          id="art-category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="art-sort">Sort By</label>
        <select
          id="art-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="trending">Most Liked</option>
          <option value="rating">Highest Rated</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>

      <button className="btn btn-primary" onClick={handleFilter}>
        Apply Filters
      </button>
    </div>
  );
}

// ===== RATING COMPONENT =====

export function RatingComponent({ rating = 0, ratingCount = 0, onRate }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="rating-component">
      <div className="rating-display">
        <span className="rating-stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`star ${i < rating ? 'filled' : ''}`}
              onMouseEnter={() => setHoverRating(i + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => onRate?.(i + 1)}
            >
              ⭐
            </span>
          ))}
        </span>
        <span className="rating-text">
          {rating} / 5 ({ratingCount} reviews)
        </span>
      </div>
    </div>
  );
}
