/**
 * DailyChallengeModal.jsx
 * 
 * Inline modal component for Daily Challenge management
 * - Create/view challenges
 * - Category and topic selection
 * - Real-time updates
 */

import React, { useState, useEffect } from 'react';
import {
  getTodayChallenge,
  getUpcomingChallenges,
  createDailyChallenge
} from '../../services/dailyChallengeService';
import './DailyChallengeModal.css';

export default function DailyChallengeModal({ isOpen, onClose }) {
  const [challenges, setChallenges] = useState([]);
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    type: 'quiz',
    difficulty: 'medium',
    xpReward: 50,
    coinsReward: 10,
    categoryName: 'math',
    topicName: 'basics'
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const categories = [
    { id: 'math', name: 'Math' },
    { id: 'english', name: 'English' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' },
    { id: 'programming', name: 'Programming' }
  ];

  const topics = {
    math: ['basics', 'algebra', 'geometry', 'calculus'],
    english: ['vocabulary', 'grammar', 'literature', 'writing'],
    science: ['physics', 'chemistry', 'biology', 'general'],
    history: ['ancient', 'medieval', 'modern', 'current'],
    programming: ['basics', 'javascript', 'python', 'web-dev']
  };

  useEffect(() => {
    if (isOpen) {
      loadChallenges();
    }
  }, [isOpen]);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const today = await getTodayChallenge();
      setTodayChallenge(today);

      const upcoming = await getUpcomingChallenges(7);
      setChallenges(upcoming);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async () => {
    try {
      if (!formData.categoryName || !formData.topicName) {
        setMessage({ type: 'error', text: 'Please select category and topic' });
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      await createDailyChallenge(today, formData);

      setMessage({ type: 'success', text: '✅ Challenge created successfully!' });
      setIsCreating(false);
      setFormData({
        type: 'quiz',
        difficulty: 'medium',
        xpReward: 50,
        coinsReward: 10,
        categoryName: 'math',
        topicName: 'basics'
      });
      loadChallenges();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Reward') ? parseInt(value) : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎯 Daily Challenge Management</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="modal-loading">Loading challenges...</div>
        ) : (
          <div className="modal-body">
            {/* Today's Challenge */}
            <section className="challenge-section">
              <h3>Today's Challenge</h3>
              {todayChallenge ? (
                <div className="challenge-display">
                  <p><strong>Type:</strong> {todayChallenge.type}</p>
                  <p><strong>Difficulty:</strong> <span className={`difficulty-badge ${todayChallenge.difficulty}`}>{todayChallenge.difficulty}</span></p>
                  <p><strong>Category:</strong> {todayChallenge.categoryName || 'N/A'}</p>
                  <p><strong>Topic:</strong> {todayChallenge.topicName || 'N/A'}</p>
                  <p><strong>Rewards:</strong> {todayChallenge.xpReward} XP / {todayChallenge.coinsReward} 💰</p>
                  <p><strong>Completions:</strong> {todayChallenge.completionCount || 0}</p>
                </div>
              ) : (
                <p className="no-challenge">No challenge created for today</p>
              )}
            </section>

            {/* Create Challenge */}
            <section className="challenge-section">
              <h3>Create New Challenge</h3>
              {!isCreating ? (
                <button className="btn-primary" onClick={() => setIsCreating(true)}>
                  + Create Challenge
                </button>
              ) : (
                <form className="challenge-form" onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateChallenge();
                }}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Type</label>
                      <select name="type" value={formData.type} onChange={handleInputChange}>
                        <option value="quiz">Quiz</option>
                        <option value="puzzle">Puzzle</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Difficulty</label>
                      <select name="difficulty" value={formData.difficulty} onChange={handleInputChange}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select name="categoryName" value={formData.categoryName} onChange={handleInputChange}>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Topic</label>
                      <select name="topicName" value={formData.topicName} onChange={handleInputChange}>
                        {topics[formData.categoryName]?.map(topic => (
                          <option key={topic} value={topic}>
                            {topic.charAt(0).toUpperCase() + topic.slice(1).replace(/-/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>XP Reward</label>
                      <input type="number" name="xpReward" value={formData.xpReward} onChange={handleInputChange} min="0" />
                    </div>

                    <div className="form-group">
                      <label>Coins Reward</label>
                      <input type="number" name="coinsReward" value={formData.coinsReward} onChange={handleInputChange} min="0" />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn-primary">Create Challenge</button>
                    <button type="button" className="btn-secondary" onClick={() => setIsCreating(false)}>Cancel</button>
                  </div>
                </form>
              )}
            </section>

            {/* Upcoming Challenges */}
            <section className="challenge-section">
              <h3>Upcoming Challenges (7 days)</h3>
              {challenges.length > 0 ? (
                <div className="challenges-list">
                  {challenges.map(challenge => (
                    <div key={challenge.id} className="challenge-item">
                      <div className="challenge-date">{challenge.dateISO}</div>
                      <div className="challenge-info">
                        <span className="challenge-type">{challenge.type}</span>
                        <span className={`difficulty-badge ${challenge.difficulty}`}>{challenge.difficulty}</span>
                        <span className="challenge-category">{challenge.categoryName || 'N/A'}</span>
                      </div>
                      <div className="challenge-rewards">
                        {challenge.xpReward} XP / {challenge.coinsReward} 💰
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No upcoming challenges</p>
              )}
            </section>
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
