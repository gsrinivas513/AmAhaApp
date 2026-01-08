/**
 * Admin Rewards Manager Component
 * Configure reward rules, create/edit achievements and badges
 */

import React, { useState, useEffect } from 'react';
import {
  XP_CONFIG,
  COIN_CONFIG,
  EXTENDED_ACHIEVEMENTS,
  EXTENDED_LEVELS,
} from '../services/gamificationEnhancedService';
import '../admin/styles/rewards-manager.css';

const RewardsManager = () => {
  const [activeTab, setActiveTab] = useState('overview'); // overview | xp-config | coin-config | achievements | levels
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [formData, setFormData] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem('theme') || 'light';
      setTheme(newTheme);
    };

    window.addEventListener('themeChange', handleThemeChange);
    return () => window.removeEventListener('themeChange', handleThemeChange);
  }, []);

  const handleEditAchievement = (achievement) => {
    setEditingAchievement(achievement);
    setFormData(achievement);
  };

  const handleSaveAchievement = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(''), 2000);
    // Here you would send to backend
    console.log('Saving achievement:', formData);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={`rewards-manager ${theme}`}>
      {/* Header */}
      <div className="manager-header">
        <h1>⚙️ Rewards Manager</h1>
        <p>Configure reward system, achievements, and progression</p>
      </div>

      {/* Tab Navigation */}
      <div className="manager-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'xp-config' ? 'active' : ''}`}
          onClick={() => setActiveTab('xp-config')}
        >
          ⚡ XP Configuration
        </button>
        <button
          className={`tab-button ${activeTab === 'coin-config' ? 'active' : ''}`}
          onClick={() => setActiveTab('coin-config')}
        >
          💰 Coin Configuration
        </button>
        <button
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🎖️ Achievements
        </button>
        <button
          className={`tab-button ${activeTab === 'levels' ? 'active' : ''}`}
          onClick={() => setActiveTab('levels')}
        >
          📈 Level System
        </button>
      </div>

      {/* Tab Content */}
      <div className="manager-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-pane">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>📊 Reward Activities</h3>
                <ul>
                  <li>
                    <strong>Quiz Completion:</strong> {XP_CONFIG.QUIZ_COMPLETION.base}–
                    {XP_CONFIG.QUIZ_COMPLETION.base + XP_CONFIG.QUIZ_COMPLETION.maxBonus} XP
                  </li>
                  <li>
                    <strong>Puzzle Solve:</strong> {XP_CONFIG.PUZZLE_SOLVE.base}–
                    {XP_CONFIG.PUZZLE_SOLVE.base + XP_CONFIG.PUZZLE_SOLVE.maxBonus} XP
                  </li>
                  <li>
                    <strong>Challenge Complete:</strong> {XP_CONFIG.CHALLENGE_COMPLETE.base}–
                    {XP_CONFIG.CHALLENGE_COMPLETE.base + XP_CONFIG.CHALLENGE_COMPLETE.maxBonus} XP
                  </li>
                  <li>
                    <strong>Daily Login:</strong> {XP_CONFIG.DAILY_LOGIN} XP
                  </li>
                </ul>
              </div>

              <div className="overview-card">
                <h3>🏆 Total Achievements</h3>
                <p className="big-number">{Object.keys(EXTENDED_ACHIEVEMENTS).length}</p>
                <ul>
                  <li>Speed Challenges: 2</li>
                  <li>Accuracy Challenges: 2</li>
                  <li>Consistency Challenges: 2</li>
                  <li>Collection Achievements: 2</li>
                </ul>
              </div>

              <div className="overview-card">
                <h3>📈 Level Progression</h3>
                <p className="big-number">{EXTENDED_LEVELS.length}</p>
                <p>Total levels available for players</p>
                <div className="level-preview">
                  {EXTENDED_LEVELS.slice(0, 5).map((level) => (
                    <span key={level.level} className="level-preview-item">
                      {level.icon}
                    </span>
                  ))}
                  <span>...</span>
                </div>
              </div>

              <div className="overview-card">
                <h3>💡 Quick Stats</h3>
                <ul>
                  <li>
                    <strong>Average XP per Quiz:</strong> 75 XP
                  </li>
                  <li>
                    <strong>Average XP per Puzzle:</strong> 125 XP
                  </li>
                  <li>
                    <strong>Max Level Progression:</strong> 50,000 XP
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* XP Configuration Tab */}
        {activeTab === 'xp-config' && (
          <div className="tab-pane">
            <div className="config-section">
              <h3>⚡ XP Configuration</h3>
              <div className="config-table">
                <table>
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Base XP</th>
                      <th>Bonus XP</th>
                      <th>Total Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(XP_CONFIG).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key.replace(/_/g, ' ')}</td>
                        <td className="editable">
                          {typeof value === 'object' && value.base ? value.base : value}
                        </td>
                        <td className="editable">
                          {typeof value === 'object' && value.maxBonus ? value.maxBonus : 'N/A'}
                        </td>
                        <td>
                          {typeof value === 'object' && value.base
                            ? `${value.base}–${value.base + (value.maxBonus || 0)}`
                            : value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="save-button">💾 Save XP Configuration</button>
            </div>
          </div>
        )}

        {/* Coin Configuration Tab */}
        {activeTab === 'coin-config' && (
          <div className="tab-pane">
            <div className="config-section">
              <h3>💰 Coin Configuration</h3>
              <div className="config-table">
                <table>
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Base Coins</th>
                      <th>Bonus Coins</th>
                      <th>Total Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(COIN_CONFIG).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key.replace(/_/g, ' ')}</td>
                        <td className="editable">
                          {typeof value === 'object' && value.base ? value.base : value}
                        </td>
                        <td className="editable">
                          {typeof value === 'object' && value.perfect ? value.perfect : 'N/A'}
                        </td>
                        <td>
                          {typeof value === 'object' && value.base
                            ? `${value.base}–${value.perfect || value.base}`
                            : value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className="save-button">💾 Save Coin Configuration</button>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="tab-pane">
            <div className="achievements-manager">
              <h3>🎖️ Achievement Management</h3>
              <div className="achievements-list">
                {Object.values(EXTENDED_ACHIEVEMENTS).map((achievement) => (
                  <div key={achievement.id} className="achievement-item">
                    <div className="achievement-left">
                      <span className="achievement-icon">{achievement.icon}</span>
                      <div className="achievement-details">
                        <h4>{achievement.name}</h4>
                        <p>{achievement.description}</p>
                        <div className="achievement-rewards">
                          <span className="reward">⚡ {achievement.xpReward} XP</span>
                          <span className="reward">💰 {achievement.coinsReward} Coins</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="edit-button"
                      onClick={() => handleEditAchievement(achievement)}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                ))}
              </div>

              {/* Edit Form */}
              {editingAchievement && (
                <div className="edit-form">
                  <h4>Edit Achievement: {editingAchievement.name}</h4>
                  <div className="form-group">
                    <label>Achievement Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>XP Reward</label>
                      <input
                        type="number"
                        value={formData.xpReward || 0}
                        onChange={(e) => handleFormChange('xpReward', parseInt(e.target.value))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Coin Reward</label>
                      <input
                        type="number"
                        value={formData.coinsReward || 0}
                        onChange={(e) =>
                          handleFormChange('coinsReward', parseInt(e.target.value))
                        }
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="save-button" onClick={handleSaveAchievement}>
                      💾 Save Changes
                    </button>
                    <button
                      className="cancel-button"
                      onClick={() => {
                        setEditingAchievement(null);
                        setFormData({});
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                  {saveStatus && <p className="save-status">✅ Changes saved!</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Levels Tab */}
        {activeTab === 'levels' && (
          <div className="tab-pane">
            <div className="levels-manager">
              <h3>📈 Level System</h3>
              <div className="levels-table">
                <table>
                  <thead>
                    <tr>
                      <th>Level</th>
                      <th>Icon</th>
                      <th>Name</th>
                      <th>Title</th>
                      <th>XP Required</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {EXTENDED_LEVELS.map((level) => (
                      <tr key={level.level}>
                        <td className="level-number">{level.level}</td>
                        <td className="level-icon">{level.icon}</td>
                        <td>{level.name}</td>
                        <td>{level.title}</td>
                        <td className="xp-required">{level.xpRequired.toLocaleString()} XP</td>
                        <td>
                          <button className="edit-button">✏️ Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsManager;
