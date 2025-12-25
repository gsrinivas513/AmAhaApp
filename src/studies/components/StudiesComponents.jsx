import React, { useState, useEffect } from 'react';
import './studies.css';

/**
 * Studies UI Components - Display and interact with guided learning paths
 */

// ===== STUDY CARD =====

export function StudyCard({ study, onEnroll, onRate, isEnrolled = false }) {
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRate = () => {
    if (rating > 0) {
      onRate?.(study.id, rating);
      setShowRating(false);
      setRating(0);
    }
  };

  return (
    <div className="study-card">
      <div className="study-image-container">
        <img src={study.image || '/placeholder-study.png'} alt={study.title} className="study-image" />
        <div className="study-badge" style={{ background: getLevelColor(study.level) }}>
          {study.level}
        </div>
      </div>

      <div className="study-content">
        <h3 className="study-title">{study.title}</h3>
        <p className="study-creator">by {study.creatorName}</p>

        <div className="study-meta">
          <span className="study-category">{study.category}</span>
          <span className="study-duration">⏱️ {study.duration}h</span>
        </div>

        <p className="study-description">{study.description.substring(0, 100)}...</p>

        <div className="study-stats">
          <div className="stat">
            <span className="stat-label">Rating</span>
            <div className="stat-value">
              ⭐ {study.rating} ({study.ratingCount})
            </div>
          </div>
          <div className="stat">
            <span className="stat-label">Enrolled</span>
            <div className="stat-value">{study.enrollmentCount} students</div>
          </div>
        </div>

        {showRating && (
          <div className="rating-input">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                >
                  ⭐
                </span>
              ))}
            </div>
            <button className="btn btn-sm btn-primary" onClick={handleRate}>
              Submit Rating
            </button>
          </div>
        )}

        <div className="study-actions">
          {isEnrolled ? (
            <>
              <button className="btn btn-primary" onClick={() => onEnroll?.(study.id)}>
                Continue Learning
              </button>
              <button className="btn btn-secondary" onClick={() => setShowRating(!showRating)}>
                {showRating ? 'Cancel' : 'Rate Study'}
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => onEnroll?.(study.id)}>
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== LESSON CARD =====

export function LessonCard({ lesson, index, isCompleted = false, onStart }) {
  return (
    <div className={`lesson-card ${isCompleted ? 'completed' : ''}`}>
      <div className="lesson-number">{index + 1}</div>

      <div className="lesson-details">
        <h4 className="lesson-title">{lesson.title}</h4>
        <p className="lesson-description">{lesson.description}</p>

        <div className="lesson-meta">
          <span className="lesson-duration">⏱️ {lesson.duration} min</span>
          {lesson.quiz && <span className="lesson-has-quiz">📝 Has Quiz</span>}
        </div>
      </div>

      <div className="lesson-status">
        {isCompleted ? (
          <div className="badge badge-success">✓ Completed</div>
        ) : (
          <button className="btn btn-sm btn-primary" onClick={() => onStart?.(lesson.id)}>
            Start Lesson
          </button>
        )}
      </div>
    </div>
  );
}

// ===== STUDY PROGRESS BAR =====

export function StudyProgressBar({ completed, total, percentage }) {
  return (
    <div className="study-progress">
      <div className="progress-info">
        <span className="progress-label">Course Progress</span>
        <span className="progress-percentage">{Math.round(percentage)}%</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}>
          <span className="progress-text">{completed} of {total}</span>
        </div>
      </div>
    </div>
  );
}

// ===== CERTIFICATE MODAL =====

export function CertificateModal({ certificate, onClose, onDownload }) {
  if (!certificate) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal certificate-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="certificate">
          <div className="certificate-header">
            <h2>Certificate of Completion</h2>
            <div className="certificate-seal">🏆</div>
          </div>

          <div className="certificate-body">
            <p className="certificate-text">This is to certify that</p>
            <p className="certificate-name">{certificate.title}</p>
            <p className="certificate-text">has successfully completed</p>
            <p className="certificate-course">{certificate.title}</p>

            <div className="certificate-details">
              <div className="detail">
                <span className="detail-label">Certificate ID:</span>
                <span className="detail-value">{certificate.certificateId}</span>
              </div>
              <div className="detail">
                <span className="detail-label">Issue Date:</span>
                <span className="detail-value">{new Date(certificate.issueDate).toLocaleDateString()}</span>
              </div>
            </div>

            {certificate.skills && certificate.skills.length > 0 && (
              <div className="skills">
                <p className="skills-label">Skills Acquired:</p>
                <div className="skills-list">
                  {certificate.skills.map((skill, idx) => (
                    <span key={idx} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="certificate-actions">
            <button className="btn btn-primary" onClick={() => onDownload?.(certificate)}>
              Download Certificate
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== STUDY FILTERS =====

export function StudyFilters({ onFilter, categories, levels }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = () => {
    onFilter?.({
      category: selectedCategory,
      level: selectedLevel,
      search: searchTerm,
    });
  };

  return (
    <div className="study-filters">
      <div className="filter-group">
        <label htmlFor="search">Search Studies</label>
        <input
          id="search"
          type="text"
          placeholder="Search by title, tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
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
        <label htmlFor="level">Level</label>
        <select
          id="level"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="">All Levels</option>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" onClick={handleFilter}>
        Apply Filters
      </button>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====

function getLevelColor(level) {
  const colors = {
    beginner: '#4CAF50',
    intermediate: '#FF9800',
    advanced: '#F44336',
  };
  return colors[level] || '#2196F3';
}
