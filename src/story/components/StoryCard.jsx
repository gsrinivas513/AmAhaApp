import React from 'react';
import '../styles/story.css';

export function StoryCard({ story, progress, onStart, onContinue, onView }) {
  const isStarted = !!progress?.startedAt;
  const isCompleted = !!progress?.completedAt;
  const progressPercent = progress && story.chapters
    ? (progress.completedChapters.length / story.chapters.length) * 100
    : 0;

  return (
    <div className="story-card">
      <div className="story-cover">
        {story.coverImage ? (
          <img src={story.coverImage} alt={story.title} />
        ) : (
          <div className="story-cover-placeholder">{story.icon || '📚'}</div>
        )}
        
        {isCompleted && (
          <div className="badge badge-completed">✓ Completed</div>
        )}
        {isStarted && !isCompleted && (
          <div className="badge badge-in-progress">
            {Math.round(progressPercent)}%
          </div>
        )}
      </div>

      <div className="story-info">
        <h3>{story.title}</h3>
        {story.description && (
          <p className="description">{story.description}</p>
        )}

        <div className="story-meta">
          {story.chapters && (
            <span className="chapters">
              {story.chapters.length} chapters
            </span>
          )}
          {story.difficulty && (
            <span className={`difficulty diff-${story.difficulty}`}>
              {story.difficulty}
            </span>
          )}
        </div>

        {isStarted && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        <div className="story-actions">
          {!isStarted && (
            <button onClick={onStart} className="btn btn-primary">
              Start Story
            </button>
          )}
          {isStarted && !isCompleted && (
            <button onClick={onContinue} className="btn btn-primary">
              Continue
            </button>
          )}
          {isCompleted && (
            <button onClick={onView} className="btn btn-secondary">
              View Certificate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function ChapterCard({ chapter, index, status, onSelect, locked = false }) {
  return (
    <div 
      className={`chapter-card ${status} ${locked ? 'locked' : ''}`}
      onClick={() => !locked && onSelect(index)}
    >
      <div className="chapter-number">{index + 1}</div>
      <div className="chapter-content">
        <h4>{chapter.title}</h4>
        {chapter.description && (
          <p>{chapter.description}</p>
        )}
        <div className="chapter-meta">
          {chapter.content?.items && (
            <span className="items-count">
              {chapter.content.items.length} items
            </span>
          )}
          {chapter.estimatedDuration && (
            <span className="duration">
              ~{chapter.estimatedDuration}m
            </span>
          )}
        </div>
      </div>
      {locked && <div className="lock-icon">🔒</div>}
      {status === 'completed' && (
        <div className="completion-badge">✓</div>
      )}
    </div>
  );
}

export function ProgressBar({ completed, total, score = null }) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="progress-text">
        <span className="progress-fraction">
          {completed} / {total} chapters
        </span>
        {score !== null && (
          <span className="progress-score">Score: {score}%</span>
        )}
      </div>
    </div>
  );
}

export function CertificateModal({ summary, onClose, onDownload }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content certificate-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎓 Certificate of Completion</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="certificate">
          <div className="certificate-header">
            <h1>Certificate of Completion</h1>
          </div>

          <div className="certificate-body">
            <p className="cert-label">This certifies that</p>
            <p className="cert-name">{summary.userName}</p>
            <p className="cert-label">has successfully completed</p>
            <p className="cert-story">{summary.storyTitle}</p>
            
            <div className="cert-details">
              <div className="cert-detail">
                <span className="label">Final Score</span>
                <span className="value">{summary.finalScore}%</span>
              </div>
              <div className="cert-detail">
                <span className="label">Chapters Completed</span>
                <span className="value">
                  {summary.chaptersCompleted}/{summary.totalChapters}
                </span>
              </div>
              <div className="cert-detail">
                <span className="label">Performance Level</span>
                <span className="value">{summary.performanceLevel}</span>
              </div>
            </div>

            <p className="cert-label">Completion Date</p>
            <p className="cert-date">
              {new Date(summary.completionDate).toLocaleDateString()}
            </p>

            <p className="cert-id">ID: {summary.certificateId}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onDownload} className="btn btn-primary">
            ⬇️ Download Certificate
          </button>
          <button onClick={onClose} className="btn btn-secondary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function RetryDialog({ chapter, score, retryPolicy, onRetry, onGiveUp }) {
  const canRetry = score < 70 && (retryPolicy === 'unlimited' || true);

  return (
    <div className="modal-overlay">
      <div className="modal-content retry-dialog">
        <div className="dialog-header">
          <h2>Chapter Complete!</h2>
        </div>

        <div className="dialog-body">
          <p className="score-text">Your Score: <strong>{score}%</strong></p>
          
          {score >= 75 ? (
            <p className="message success">
              ✓ Great job! You can proceed to the next chapter.
            </p>
          ) : (
            <p className="message warning">
              You didn't meet the minimum score (75%). You can retry this chapter.
            </p>
          )}

          <div className="chapter-stats">
            <h4>Chapter Statistics</h4>
            <ul>
              <li>Title: {chapter.title}</li>
              <li>Difficulty: {chapter.difficulty}</li>
              <li>Items: {chapter.content?.items?.length || 0}</li>
            </ul>
          </div>
        </div>

        <div className="dialog-footer">
          {canRetry && score < 75 && (
            <button onClick={onRetry} className="btn btn-primary">
              Retry Chapter
            </button>
          )}
          {score >= 75 && (
            <button onClick={onGiveUp} className="btn btn-primary">
              Next Chapter
            </button>
          )}
          <button onClick={onGiveUp} className="btn btn-secondary">
            {score >= 75 ? 'Skip' : 'Exit Chapter'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function HintSystem({ hints = [], used = 0, onUseHint }) {
  const remaining = hints.length - used;
  const hasHints = remaining > 0;

  return (
    <div className="hint-system">
      <div className="hint-indicator">
        <span className="hint-count">
          💡 Hints: {used}/{hints.length}
        </span>
      </div>

      {hasHints && (
        <button
          onClick={onUseHint}
          className="btn btn-hint"
          title="Get a hint for this chapter"
        >
          Get Hint
        </button>
      )}

      {!hasHints && (
        <span className="no-hints">No hints remaining</span>
      )}

      {used > 0 && hints[used - 1] && (
        <div className="hint-display">
          <p className="hint-label">Latest Hint:</p>
          <p className="hint-text">{hints[used - 1]}</p>
        </div>
      )}
    </div>
  );
}
