import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getUserProfile, updateUserProfile, addFriend, getFriendsList, AVATAR_OPTIONS, THEME_OPTIONS } from '../services/phase8Service';
import '../styles/user-profile.css';

const UserProfilePage = ({ userId, isOwnProfile = false }) => {
  const { theme } = useTheme();
  const [profile, setProfile] = useState(null);
  const [friends, setFriends] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    setLoading(true);
    const profileData = await getUserProfile(userId);
    if (profileData) {
      setProfile(profileData);
      setFormData(profileData);
      setSelectedAvatar(profileData.avatar || AVATAR_OPTIONS[0].emoji);
      setSelectedTheme(profileData.theme || 'default');
    }
    
    const friendsList = await getFriendsList(userId);
    setFriends(friendsList);
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    const result = await updateUserProfile(userId, {
      ...formData,
      avatar: selectedAvatar,
      theme: selectedTheme,
    });

    if (result.success) {
      setProfile({ ...profile, ...formData, avatar: selectedAvatar, theme: selectedTheme });
      setEditing(false);
    }
  };

  const handleAddFriend = async (friendId) => {
    const result = await addFriend(userId, friendId);
    if (result.success) {
      loadProfile();
    }
  };

  if (loading) {
    return <div className="user-profile-container"><p>Loading profile...</p></div>;
  }

  if (!profile) {
    return <div className="user-profile-container"><p>Profile not found</p></div>;
  }

  return (
    <div className="user-profile-container" style={{ backgroundColor: theme.background, color: theme.textPrimary, transition: 'background-color 0.3s, color 0.3s' }}>
      {/* Header Section */}
      <div className="profile-header" style={{ borderColor: theme.border }}>
        <div className="profile-avatar-section">
          <div className="avatar-display" style={{ color: theme.accentPrimary }}>{profile.avatar || '🧑'}</div>
          {isOwnProfile && editing && (
            <div className="avatar-selector">
              {AVATAR_OPTIONS.map((avatar) => (
                <button
                  key={avatar.id}
                  className={`avatar-option ${selectedAvatar === avatar.emoji ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(avatar.emoji)}
                >
                  {avatar.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="profile-info">
          {editing ? (
            <input
              type="text"
              value={formData.displayName || ''}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="Display Name"
              className="edit-input"
              style={{ backgroundColor: theme.surfacePrimary, color: theme.textPrimary, borderColor: theme.border }}
            />
          ) : (
            <h1 style={{ color: theme.textPrimary }}>{profile.displayName || profile.username || 'Anonymous'}</h1>
          )}

          <p className="username" style={{ color: theme.textSecondary }}>@{profile.username}</p>

          {editing ? (
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Bio"
              className="edit-textarea"
              style={{ backgroundColor: theme.surfacePrimary, color: theme.textPrimary, borderColor: theme.border }}
            />
          ) : (
            <p className="bio" style={{ color: theme.textSecondary }}>{profile.bio || 'No bio yet'}</p>
          )}

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value" style={{ color: theme.accentPrimary }}>{profile.currentLevel}</span>
              <span className="stat-label" style={{ color: theme.textSecondary }}>Level</span>
            </div>
            <div className="stat">
              <span className="stat-value" style={{ color: theme.accentPrimary }}>{profile.totalXP || 0}</span>
              <span className="stat-label" style={{ color: theme.textSecondary }}>XP</span>
            </div>
            <div className="stat">
              <span className="stat-value" style={{ color: theme.accentPrimary }}>{profile.totalCoins || 0}</span>
              <span className="stat-label" style={{ color: theme.textSecondary }}>Coins</span>
            </div>
            <div className="stat">
              <span className="stat-value" style={{ color: theme.accentPrimary }}>{profile.achievements?.length || 0}</span>
              <span className="stat-label" style={{ color: theme.textSecondary }}>Achievements</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {isOwnProfile && (
        <div className="profile-actions">
          {!editing ? (
            <button className="edit-btn" onClick={() => setEditing(true)} style={{ background: theme.gradientAccent, color: 'white' }}>
              ✏️ Edit Profile
            </button>
          ) : (
            <>
              <button className="save-btn" onClick={handleSaveProfile} style={{ background: theme.gradientAccent, color: 'white' }}>
                ✓ Save Changes
              </button>
              <button className="cancel-btn" onClick={() => setEditing(false)} style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.border }}>
                ✕ Cancel
              </button>
            </>
          )}
        </div>
      )}

      {/* Theme Selection */}
      {editing && (
        <div className="theme-selector-section" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
          <h3 style={{ color: theme.textPrimary }}>Select Theme</h3>
          <div className="theme-grid">
            {THEME_OPTIONS.map((themeOpt) => (
              <button
                key={themeOpt.id}
                className={`theme-option ${selectedTheme === themeOpt.id ? 'selected' : ''}`}
                style={{ 
                  backgroundColor: themeOpt.color,
                  borderColor: selectedTheme === themeOpt.id ? theme.accentPrimary : theme.border,
                  color: '#fff'
                }}
                onClick={() => setSelectedTheme(themeOpt.id)}
              >
                {themeOpt.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Section */}
      <div className="achievements-section" style={{ borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>🏆 Achievements ({profile.achievements?.length || 0})</h3>
        <div className="achievements-grid">
          {profile.achievements?.slice(0, 6).map((achievement, idx) => (
            <div key={idx} className="achievement-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border, color: theme.textPrimary }}>
              <span className="achievement-icon">🎖️</span>
              <p>{achievement.name}</p>
            </div>
          )) || <p style={{ color: theme.textSecondary }}>No achievements yet</p>}
        </div>
      </div>

      {/* Friends Section */}
      <div className="friends-section" style={{ borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>👥 Friends ({friends.length})</h3>
        <div className="friends-grid">
          {friends.map((friend) => (
            <div key={friend.id} className="friend-card" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border, color: theme.textPrimary }}>
              <span className="friend-avatar">{friend.avatar || '🧑'}</span>
              <p className="friend-name" style={{ color: theme.textPrimary }}>{friend.displayName || friend.username}</p>
              <p className="friend-level" style={{ color: theme.textSecondary }}>Level {friend.currentLevel}</p>
            </div>
          ))}
        </div>
        {friends.length === 0 && <p style={{ color: theme.textSecondary }}>No friends yet. Add some!</p>}
      </div>

      {/* Social Links */}
      {isOwnProfile && editing && (
        <div className="social-links-section" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
          <h3 style={{ color: theme.textPrimary }}>Social Links</h3>
          <input
            type="text"
            value={formData.socialLinks?.twitter || ''}
            onChange={(e) => setFormData({
              ...formData,
              socialLinks: { ...formData.socialLinks, twitter: e.target.value }
            })}
            placeholder="Twitter"
            className="edit-input"
            style={{ backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }}
          />
          <input
            type="text"
            value={formData.socialLinks?.instagram || ''}
            onChange={(e) => setFormData({
              ...formData,
              socialLinks: { ...formData.socialLinks, instagram: e.target.value }
            })}
            placeholder="Instagram"
            className="edit-input"
            style={{ backgroundColor: theme.background, color: theme.textPrimary, borderColor: theme.border }}
          />
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
