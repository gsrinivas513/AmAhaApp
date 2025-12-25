/**
 * DailyChallengeAdmin.jsx
 * 
 * Admin page to manage daily challenges
 * - View current challenge
 * - Create/edit challenges
 * - Enable/disable feature
 * - View completion stats
 */

import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import {
  getTodayChallenge,
  getUpcomingChallenges,
  createDailyChallenge,
  resetUserStreak
} from '../services/dailyChallengeService';
import './DailyChallengeAdmin.css';

export default function DailyChallengeAdmin() {
  const [challenges, setChallenges] = useState([]);
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    type: 'quiz', // or 'puzzle'
    difficulty: 'medium',
    xpReward: 50,
    coinsReward: 10,
    categoryName: 'math',
    topicName: 'basics'
  });
  
  const categories = [
    { id: 'math', name: 'Math' },
    { id: 'english', name: 'English' },
    { id: 'science', name: 'Science' },
    { id: 'history', name: 'History' },
    { id: 'programming', name: 'Programming' }
  ];
  
  const topics = {
    math: ['Basics', 'Algebra', 'Geometry', 'Calculus'],
    english: ['Vocabulary', 'Grammar', 'Literature', 'Writing'],
    science: ['Physics', 'Chemistry', 'Biology', 'General'],
    history: ['Ancient', 'Medieval', 'Modern', 'Current'],
    programming: ['Basics', 'JavaScript', 'Python', 'Web Dev']
  };
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadChallenges();
  }, []);

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
      const today = new Date().toISOString().split('T')[0];
      await createDailyChallenge(today, formData);

      setMessage({ type: 'success', text: 'Challenge created!' });
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

  if (loading) return <div className="admin-loading">Loading challenges...</div>;

  return (
    <AdminLayout>
      <div className="daily-challenge-admin">
      <h2>🎯 Daily Challenge Management</h2>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Today's Challenge */}
      <section className="admin-section">
        <h3>Today's Challenge</h3>
        {todayChallenge ? (
          <div className="challenge-display">
            <p><strong>Type:</strong> {todayChallenge.type}</p>
            <p><strong>Difficulty:</strong> {todayChallenge.difficulty}</p>
            <p><strong>XP Reward:</strong> {todayChallenge.xpReward}</p>
            <p><strong>Completions:</strong> {todayChallenge.completionCount || 0}</p>
          </div>
        ) : (
          <p className="no-challenge">No challenge created for today</p>
        )}
      </section>

      {/* Create Challenge */}
      <section className="admin-section">
        <h3>Create Challenge</h3>
        {!isCreating ? (
          <button className="btn-primary" onClick={() => setIsCreating(true)}>
            + Create New Challenge
          </button>
        ) : (
          <form className="challenge-form" onSubmit={(e) => {
            e.preventDefault();
            handleCreateChallenge();
          }}>
            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="quiz">Quiz</option>
                <option value="puzzle">Puzzle</option>
              </select>
            </div>

            <div className="form-group">
              <label>Difficulty</label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label>XP Reward</label>
              <input
                type="number"
                name="xpReward"
                value={formData.xpReward}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Coins Reward</label>
              <input
                type="number"
                name="coinsReward"
                value={formData.coinsReward}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Topic</label>
              <select
                name="topicName"
                value={formData.topicName}
                onChange={handleInputChange}
              >
                {topics[formData.categoryName]?.map(topic => (
                  <option key={topic} value={topic.toLowerCase().replace(/\s+/g, '-')}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

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
      </section>

      {/* Upcoming Challenges */}
      <section className="admin-section">
        <h3>Upcoming Challenges (7 days)</h3>
        {challenges.length > 0 ? (
          <table className="challenges-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Difficulty</th>
                <th>Rewards</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map(challenge => (
                <tr key={challenge.id}>
                  <td>{challenge.dateISO}</td>
                  <td>{challenge.type}</td>
                  <td>{challenge.difficulty}</td>
                  <td>{challenge.xpReward} XP / {challenge.coinsReward} 💰</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No upcoming challenges</p>
        )}
      </section>

      {/* Settings */}
      <section className="admin-section">
        <h3>Settings</h3>
        <div className="settings-grid">
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked /> Enable Daily Challenges
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked /> Show Streak Badge
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked /> Reset Streaks Automatically
            </label>
          </div>
        </div>
      </section>
    </div>
    </AdminLayout>
  );
}
