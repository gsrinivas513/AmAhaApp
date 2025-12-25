/**
 * Integration Examples for All New Features
 * This file demonstrates how to use all the new services
 */

import React, { useState, useEffect } from 'react';
import { cacheManager, CACHE_KEYS, CACHE_DURATIONS } from '../utils/cacheManager';
import { imageOptimizer } from '../utils/imageOptimizer';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { advancedAnalyticsService } from '../services/advancedAnalyticsService';
import { socialService } from '../services/socialService';
import { prestigeService } from '../services/prestigeService';
import { aiService } from '../services/aiService';

// ============================================================
// EXAMPLE 1: Using Cache Manager
// ============================================================

export function CacheExample() {
  const [cachedData, setCachedData] = useState(null);

  useEffect(() => {
    // Example 1: Cache user data
    const userData = { id: 'user123', name: 'John' };
    
    // Set cache with 1 hour duration
    cacheManager.set(
      CACHE_KEYS.USER_PROFILE,
      userData,
      CACHE_DURATIONS.LONG,
      'localStorage'
    );

    // Retrieve from cache
    const cached = cacheManager.get(CACHE_KEYS.USER_PROFILE);
    setCachedData(cached);

    // Example 2: Get cache statistics
    const stats = cacheManager.getStats();
    console.log('Cache Stats:', {
      hitRate: stats.hitRate,
      totalSize: stats.totalSize,
      itemCount: stats.itemCount
    });

    // Example 3: Clear specific cache key
    // cacheManager.remove(CACHE_KEYS.USER_PROFILE);

    // Example 4: Check storage availability
    const storageAvailable = cacheManager.isStorageAvailable('localStorage');
    console.log('LocalStorage available:', storageAvailable);
  }, []);

  return (
    <div className="cache-example">
      <h3>Cache Manager Example</h3>
      <pre>{JSON.stringify(cachedData, null, 2)}</pre>
    </div>
  );
}

// ============================================================
// EXAMPLE 2: Using Image Optimizer
// ============================================================

export function ImageOptimizerExample() {
  const imageId = 'amaha/puzzle-123'; // Your Cloudinary image ID

  return (
    <div className="image-optimizer-example">
      <h3>Image Optimization Examples</h3>

      {/* Example 1: Basic optimized image */}
      <div>
        <h4>Basic Optimized Image</h4>
        <img
          src={imageOptimizer.getOptimizedUrl(imageId, {
            width: 800,
            quality: 'auto',
            dpr: 'auto'
          })}
          alt="Optimized puzzle"
        />
      </div>

      {/* Example 2: Responsive image with srcSet */}
      <div>
        <h4>Responsive Image</h4>
        <img
          src={imageOptimizer.getOptimizedUrl(imageId, { width: 800 })}
          srcSet={imageOptimizer.generateSrcSet(imageId)}
          sizes="(max-width: 768px) 100vw, 50vw"
          alt="Responsive puzzle"
        />
      </div>

      {/* Example 3: Image with blur hash placeholder */}
      <div>
        <h4>Image with Blur Hash</h4>
        <picture>
          <source
            srcSet={imageOptimizer.getBlurHash(imageId)}
            media="(prefers-reduced-motion: no-preference)"
          />
          <img
            src={imageOptimizer.getOptimizedUrl(imageId, { width: 800 })}
            alt="Puzzle with blur effect"
          />
        </picture>
      </div>

      {/* Example 4: Video optimization */}
      <div>
        <h4>Optimized Video</h4>
        <video
          src={imageOptimizer.getOptimizedVideo('amaha/tutorial-1', {
            videoCodec: 'auto',
            quality: 'auto'
          })}
          controls
        />
      </div>
    </div>
  );
}

// ============================================================
// EXAMPLE 3: Using Service Worker Hook
// ============================================================

export function ServiceWorkerExample() {
  const { isOnline, swRegistration, isSupported } = useServiceWorker();

  return (
    <div className="service-worker-example">
      <h3>Service Worker Status</h3>
      <div>
        <p>Service Worker Supported: {isSupported ? '✓' : '✗'}</p>
        <p>Online Status: {isOnline ? '🟢 Online' : '🔴 Offline'}</p>
        <p>Registration: {swRegistration ? '✓ Registered' : '✗ Not registered'}</p>
      </div>

      {!isOnline && (
        <div className="offline-notice">
          <p>You are currently offline. Changes will sync when online.</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXAMPLE 4: Using Advanced Analytics Service
// ============================================================

export function AnalyticsExample() {
  const [reports, setReports] = useState({
    daily: null,
    weekly: null,
    monthly: null
  });

  useEffect(() => {
    loadAnalyticsReports();
  }, []);

  async function loadAnalyticsReports() {
    try {
      // Generate daily report
      const daily = await advancedAnalyticsService.generateDailyReport();
      
      // Generate weekly report
      const weekly = await advancedAnalyticsService.generateWeeklyReport();
      
      // Generate monthly report
      const monthly = await advancedAnalyticsService.generateMonthlyReport();

      setReports({ daily, weekly, monthly });

      // Example: User segmentation
      if (daily && daily.events) {
        const segmented = advancedAnalyticsService.segmentUsers(daily.events);
        console.log('User Segments:', {
          veryActive: segmented.veryActive,
          active: segmented.active,
          moderate: segmented.moderate,
          inactive: segmented.inactive
        });
      }

      // Example: Anomaly detection
      if (daily && daily.events) {
        const anomalies = advancedAnalyticsService.detectAnomalies(daily.events);
        console.log('Anomalies detected:', anomalies.length);
      }
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  return (
    <div className="analytics-example">
      <h3>Advanced Analytics Reports</h3>
      
      {reports.daily && (
        <div className="report">
          <h4>Daily Report</h4>
          <p>Active Users: {reports.daily.activeUsers}</p>
          <p>Total Events: {reports.daily.totalEvents}</p>
          <div>
            <h5>User Segments:</h5>
            <ul>
              <li>Very Active: {reports.daily.userSegments?.veryActive || 0}</li>
              <li>Active: {reports.daily.userSegments?.active || 0}</li>
              <li>Moderate: {reports.daily.userSegments?.moderate || 0}</li>
              <li>Inactive: {reports.daily.userSegments?.inactive || 0}</li>
            </ul>
          </div>
        </div>
      )}

      {reports.weekly && (
        <div className="report">
          <h4>Weekly Report</h4>
          <p>Weekly Active Users: {reports.weekly.activeUsers}</p>
          <p>Weekly Events: {reports.weekly.totalEvents}</p>
          <p>Growth Rate: {reports.weekly.growthRate}</p>
        </div>
      )}

      {reports.monthly && (
        <div className="report">
          <h4>Monthly Predictions</h4>
          <p>Predicted Events: {reports.monthly.predictions?.predictedEventCount}</p>
          <p>Predicted Users: {reports.monthly.predictions?.predictedActiveUsers}</p>
          <p>Growth Rate: {reports.monthly.predictions?.growthRate}</p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// EXAMPLE 5: Using Social Service
// ============================================================

export function SocialExample() {
  const [friends, setFriends] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [profile, setProfile] = useState(null);

  const userId = 'current-user-id'; // Replace with actual user ID

  useEffect(() => {
    loadSocialData();
  }, []);

  async function loadSocialData() {
    try {
      // Get user's friends
      const userFriends = await socialService.getUserFriends(userId);
      setFriends(userFriends);

      // Get pending challenges
      const pendingChallenges = await socialService.getPendingChallenges(userId);
      setChallenges(pendingChallenges);

      // Get user profile
      const userProfile = await socialService.getUserProfile(userId);
      setProfile(userProfile);
    } catch (error) {
      console.error('Social error:', error);
    }
  }

  async function handleAddFriend(friendId) {
    try {
      await socialService.addFriend(userId, friendId);
      await loadSocialData(); // Refresh data
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  }

  async function handleChallengeResponse(challengeId, accept) {
    try {
      await socialService.respondToChallenge(challengeId, accept);
      await loadSocialData(); // Refresh data
    } catch (error) {
      console.error('Error responding to challenge:', error);
    }
  }

  return (
    <div className="social-example">
      <h3>Social Features</h3>

      {/* User Profile */}
      {profile && (
        <div className="profile-section">
          <h4>User Profile</h4>
          <p>Name: {profile.displayName}</p>
          <p>Level: {profile.level}</p>
          <p>Total XP: {profile.totalXP}</p>
          <p>Friends: {profile.friendsCount}</p>
        </div>
      )}

      {/* Friends List */}
      <div className="friends-section">
        <h4>Friends ({friends.length})</h4>
        <ul>
          {friends.map(friend => (
            <li key={friend.id}>
              <span>{friend.displayName}</span>
              <span>Level {friend.level}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Challenges */}
      <div className="challenges-section">
        <h4>Pending Challenges ({challenges.length})</h4>
        {challenges.map(challenge => (
          <div key={challenge.id} className="challenge">
            <p>From: {challenge.fromUser}</p>
            <p>Type: {challenge.type}</p>
            <p>Target Score: {challenge.targetScore}</p>
            <button onClick={() => handleChallengeResponse(challenge.id, true)}>
              Accept
            </button>
            <button onClick={() => handleChallengeResponse(challenge.id, false)}>
              Decline
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// EXAMPLE 6: Using Prestige Service
// ============================================================

export function PrestigeExample() {
  const [prestige, setPrestige] = useState(null);
  const [season, setSeason] = useState(null);
  const [cosmetics, setCosmetics] = useState([]);

  const userId = 'current-user-id'; // Replace with actual user ID

  useEffect(() => {
    loadPrestigeData();
  }, []);

  async function loadPrestigeData() {
    try {
      // Get prestige level
      const prestigeData = await prestigeService.getPrestigeLevel(userId);
      setPrestige(prestigeData);

      // Get current season
      const currentSeason = prestigeService.getCurrentSeason();
      setSeason(currentSeason);

      // Get cosmetics
      const cosmeticsList = await prestigeService.getAvailableCosmetics();
      setCosmetics(cosmeticsList);
    } catch (error) {
      console.error('Prestige error:', error);
    }
  }

  async function handlePrestigeReset() {
    try {
      await prestigeService.prestigeReset(userId);
      await loadPrestigeData(); // Refresh data
      alert('Prestige reset successful! You received a bonus.');
    } catch (error) {
      console.error('Error resetting prestige:', error);
    }
  }

  async function handlePurchaseCosmetic(cosmeticId, price) {
    try {
      await prestigeService.purchaseCosmetic(userId, cosmeticId, price);
      await loadPrestigeData(); // Refresh data
    } catch (error) {
      console.error('Error purchasing cosmetic:', error);
    }
  }

  return (
    <div className="prestige-example">
      <h3>Prestige System</h3>

      {/* Prestige Level */}
      {prestige && (
        <div className="prestige-section">
          <h4>Your Prestige</h4>
          <div className="prestige-badge">{prestige.icon}</div>
          <p>{prestige.name}</p>
          <p>XP: {prestige.xp} / {prestige.nextThreshold}</p>
          <p>Level: {prestige.level} / 5</p>
          {prestige.canReset && (
            <button onClick={handlePrestigeReset}>Reset for Bonus</button>
          )}
        </div>
      )}

      {/* Season Info */}
      {season && (
        <div className="season-section">
          <h4>Current Season</h4>
          <p>{season.name}</p>
          <p>Days Remaining: {season.daysRemaining}</p>
          <p>Theme: {season.theme}</p>
        </div>
      )}

      {/* Cosmetics Shop */}
      <div className="cosmetics-section">
        <h4>Cosmetics Shop</h4>
        <div className="cosmetics-grid">
          {cosmetics.map(cosmetic => (
            <div key={cosmetic.id} className="cosmetic-item">
              <div className="cosmetic-preview">{cosmetic.icon}</div>
              <p>{cosmetic.name}</p>
              <p>{cosmetic.price} coins</p>
              {!cosmetic.owned && (
                <button onClick={() => handlePurchaseCosmetic(cosmetic.id, cosmetic.price)}>
                  Buy
                </button>
              )}
              {cosmetic.owned && <p>✓ Owned</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EXAMPLE 7: Using AI Service
// ============================================================

export function AIExample() {
  const [learningStyle, setLearningStyle] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [mentorChat, setMentorChat] = useState([]);
  const [nextLevel, setNextLevel] = useState(null);

  const userId = 'current-user-id'; // Replace with actual user ID

  useEffect(() => {
    loadAIData();
  }, []);

  async function loadAIData() {
    try {
      // Get user data (from your app state or Firestore)
      const userData = await getUserData(userId);

      // Detect learning style
      const style = aiService.detectLearningStyle(userData);
      setLearningStyle(style);

      // Get personalized path
      const path = await aiService.generatePersonalizedPath(userId);

      // Get recommendations
      const recs = await aiService.generateRecommendations(userData, style);
      setRecommendations(recs);

      // Predict next level
      const prediction = await aiService.predictNextLevel(userId);
      setNextLevel(prediction);

      // Initialize mentor chat
      const greeting = await aiService.chatWithMentor(userId, 'Hello!');
      setMentorChat([{ role: 'mentor', message: greeting.message }]);
    } catch (error) {
      console.error('AI error:', error);
    }
  }

  async function handleMentorMessage(message) {
    try {
      const response = await aiService.chatWithMentor(userId, message);
      setMentorChat(prev => [
        ...prev,
        { role: 'user', message },
        { role: 'mentor', message: response.message }
      ]);
    } catch (error) {
      console.error('Mentor chat error:', error);
    }
  }

  return (
    <div className="ai-example">
      <h3>AI Features</h3>

      {/* Learning Style */}
      {learningStyle && (
        <div className="learning-style-section">
          <h4>Your Learning Style</h4>
          <p>{learningStyle.charAt(0).toUpperCase() + learningStyle.slice(1)}</p>
        </div>
      )}

      {/* Recommendations */}
      <div className="recommendations-section">
        <h4>Recommended for You</h4>
        <ul>
          {recommendations.map((rec, index) => (
            <li key={index}>
              <strong>{rec.title}</strong>
              <p>{rec.description}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Level Prediction */}
      {nextLevel && (
        <div className="prediction-section">
          <h4>Level Progression</h4>
          <p>Current Level: {nextLevel.currentLevel}</p>
          <p>Next Level: {nextLevel.nextLevel}</p>
          <p>Days to Next Level: {nextLevel.daysToNextLevel}</p>
          <p>Estimated Date: {nextLevel.estimatedDate}</p>
        </div>
      )}

      {/* Mentor Chat */}
      <div className="mentor-chat-section">
        <h4>AI Mentor</h4>
        <div className="chat-history">
          {mentorChat.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Ask the mentor..."
          onKeyPress={e => {
            if (e.key === 'Enter') {
              handleMentorMessage(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
    </div>
  );
}

// ============================================================
// COMPLETE INTEGRATION EXAMPLE
// ============================================================

export function CompleteIntegration() {
  return (
    <div className="complete-integration">
      <h1>AmAha Platform - Complete Feature Integration</h1>

      <CacheExample />
      <ImageOptimizerExample />
      <ServiceWorkerExample />
      <AnalyticsExample />
      <SocialExample />
      <PrestigeExample />
      <AIExample />
    </div>
  );
}

export default CompleteIntegration;

// Helper function to get user data (implement based on your app)
async function getUserData(userId) {
  // This should fetch from your Firestore or app state
  return {
    id: userId,
    totalXP: 2500,
    level: 5,
    activities: {
      quizzesCompleted: 45,
      puzzlesSolved: 23,
      challengesCompleted: 12
    },
    scores: [85, 92, 78, 88, 95]
  };
}
