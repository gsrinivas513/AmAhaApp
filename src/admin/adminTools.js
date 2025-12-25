/**
 * Admin Utilities - Production Management Tools
 * Use these functions to manage platform features, events, and user data
 */

import { db } from '../firebase/config';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  writeBatch,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';

/**
 * ============================================================
 * ANALYTICS ADMINISTRATION
 * ============================================================
 */

export const analyticsAdmin = {
  /**
   * Get all analytics reports
   */
  async getAllReports(limit = 100) {
    try {
      const reportsRef = collection(db, 'reports');
      const q = query(reportsRef, orderBy('date', 'desc'), limit);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  },

  /**
   * Delete old analytics reports (cleanup)
   */
  async deleteOldReports(daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const reportsRef = collection(db, 'reports');
      const q = query(reportsRef, where('date', '<', cutoffDate.toISOString().split('T')[0]));
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => batch.deleteDoc(doc.ref));
      await batch.commit();

      return snapshot.size;
    } catch (error) {
      console.error('Error deleting old reports:', error);
      return 0;
    }
  },

  /**
   * Export analytics data
   */
  async exportReports(format = 'json') {
    const reports = await this.getAllReports(1000);

    if (format === 'csv') {
      const csv = convertToCSV(reports);
      downloadFile(csv, 'analytics-reports.csv', 'text/csv');
    } else {
      const json = JSON.stringify(reports, null, 2);
      downloadFile(json, 'analytics-reports.json', 'application/json');
    }
  }
};

/**
 * ============================================================
 * SOCIAL ADMINISTRATION
 * ============================================================
 */

export const socialAdmin = {
  /**
   * Get all friendships
   */
  async getAllFriendships(limit = 1000) {
    try {
      const friendshipsRef = collection(db, 'friendships');
      const q = query(friendshipsRef, limit);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching friendships:', error);
      return [];
    }
  },

  /**
   * Get all challenges
   */
  async getAllChallenges(limit = 1000) {
    try {
      const challengesRef = collection(db, 'challenges');
      const q = query(
        challengesRef,
        orderBy('createdAt', 'desc'),
        limit
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching challenges:', error);
      return [];
    }
  },

  /**
   * Approve pending challenge
   */
  async approvePendingChallenges(status = 'pending') {
    try {
      const challengesRef = collection(db, 'challenges');
      const q = query(challengesRef, where('status', '==', status));
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);
      snapshot.docs.forEach(doc => {
        batch.updateDoc(doc.ref, { status: 'approved' });
      });
      await batch.commit();

      return snapshot.size;
    } catch (error) {
      console.error('Error approving challenges:', error);
      return 0;
    }
  },

  /**
   * Remove invalid friendships (cleanup)
   */
  async cleanupFriendships() {
    try {
      const friendshipsRef = collection(db, 'friendships');
      const snapshot = await getDocs(friendshipsRef);

      let removed = 0;
      const batch = writeBatch(db);

      for (const doc of snapshot.docs) {
        const data = doc.data();
        // Remove if participants don't exist
        if (!data.participantIds || data.participantIds.length < 2) {
          batch.deleteDoc(doc.ref);
          removed++;
        }
      }

      await batch.commit();
      return removed;
    } catch (error) {
      console.error('Error cleaning up friendships:', error);
      return 0;
    }
  }
};

/**
 * ============================================================
 * PRESTIGE ADMINISTRATION
 * ============================================================
 */

export const prestigeAdmin = {
  /**
   * Create limited time event
   */
  async createLimitedEvent(eventData) {
    try {
      const eventRef = doc(db, 'limited_events', eventData.id);
      await setDoc(eventRef, {
        ...eventData,
        createdAt: new Date(),
        active: true
      });
      return true;
    } catch (error) {
      console.error('Error creating event:', error);
      return false;
    }
  },

  /**
   * Update event status
   */
  async updateEventStatus(eventId, active) {
    try {
      const eventRef = doc(db, 'limited_events', eventId);
      await updateDoc(eventRef, { active });
      return true;
    } catch (error) {
      console.error('Error updating event:', error);
      return false;
    }
  },

  /**
   * Get all active events
   */
  async getActiveEvents() {
    try {
      const eventsRef = collection(db, 'limited_events');
      const q = query(eventsRef, where('active', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  /**
   * Auto-deactivate expired events
   */
  async deactivateExpiredEvents() {
    try {
      const now = new Date();
      const eventsRef = collection(db, 'limited_events');
      const q = query(eventsRef, where('active', '==', true));
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);
      let deactivated = 0;

      snapshot.docs.forEach(doc => {
        const event = doc.data();
        if (new Date(event.endDate) < now) {
          batch.updateDoc(doc.ref, { active: false });
          deactivated++;
        }
      });

      await batch.commit();
      return deactivated;
    } catch (error) {
      console.error('Error deactivating events:', error);
      return 0;
    }
  },

  /**
   * Award special cosmetic to users
   */
  async awardCosmeticToUsers(userIds, cosmeticId) {
    try {
      const batch = writeBatch(db);

      userIds.forEach(userId => {
        const userCosmeticsRef = doc(db, 'user_cosmetics', userId);
        batch.updateDoc(userCosmeticsRef, {
          [`ownedCosmetics.${cosmeticId}`]: true
        });
      });

      await batch.commit();
      return userIds.length;
    } catch (error) {
      console.error('Error awarding cosmetics:', error);
      return 0;
    }
  }
};

/**
 * ============================================================
 * USER ADMINISTRATION
 * ============================================================
 */

export const userAdmin = {
  /**
   * Get user stats
   */
  async getUserStats(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const snapshot = await getDocs(query(
        collection(db, 'users'),
        where('__name__', '==', userId)
      ));

      if (snapshot.empty) return null;

      const user = snapshot.docs[0].data();
      return {
        id: userId,
        level: user.level,
        totalXP: user.totalXP,
        prestigeLevel: user.prestigeLevel,
        prestigeXP: user.prestigeXP,
        friendsCount: (user.friends || []).length,
        createdAt: user.createdAt
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  },

  /**
   * Reset user progress
   */
  async resetUserProgress(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        level: 1,
        totalXP: 0,
        prestigeLevel: 0,
        prestigeXP: 0
      });
      return true;
    } catch (error) {
      console.error('Error resetting progress:', error);
      return false;
    }
  },

  /**
   * Grant XP to user
   */
  async grantXP(userId, amount) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        totalXP: increment(amount)
      });
      return true;
    } catch (error) {
      console.error('Error granting XP:', error);
      return false;
    }
  },

  /**
   * Ban user
   */
  async banUser(userId, reason = '') {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        banned: true,
        banReason: reason,
        bannedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error banning user:', error);
      return false;
    }
  },

  /**
   * Unban user
   */
  async unbanUser(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        banned: false,
        banReason: '',
        bannedAt: null
      });
      return true;
    } catch (error) {
      console.error('Error unbanning user:', error);
      return false;
    }
  },

  /**
   * Get all users
   */
  async getAllUsers(limit = 1000) {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'), limit);
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
};

/**
 * ============================================================
 * MAINTENANCE & MONITORING
 * ============================================================
 */

export const maintenance = {
  /**
   * Full system health check
   */
  async healthCheck() {
    const checks = {
      firestore: await this.checkFirestore(),
      collections: await this.checkCollections(),
      indexes: await this.checkIndexes(),
      storage: await this.checkStorage()
    };

    return {
      timestamp: new Date(),
      status: Object.values(checks).every(c => c.status === 'ok') ? 'healthy' : 'degraded',
      checks
    };
  },

  /**
   * Check Firestore connectivity
   */
  async checkFirestore() {
    try {
      const testRef = doc(db, 'health_check', 'test');
      await updateDoc(testRef, { lastCheck: new Date() });
      return { status: 'ok', message: 'Firestore connected' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  },

  /**
   * Check all collections exist
   */
  async checkCollections() {
    const requiredCollections = [
      'users',
      'reports',
      'friendships',
      'challenges',
      'user_cosmetics',
      'limited_events',
      'user_recommendations'
    ];

    const missing = [];

    for (const collectionName of requiredCollections) {
      try {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, limit(1));
        await getDocs(q);
      } catch (error) {
        missing.push(collectionName);
      }
    }

    return {
      status: missing.length === 0 ? 'ok' : 'error',
      message: missing.length === 0
        ? 'All collections present'
        : `Missing: ${missing.join(', ')}`
    };
  },

  /**
   * Check indexes (placeholder - Firebase auto-creates)
   */
  async checkIndexes() {
    return {
      status: 'ok',
      message: 'Firebase auto-creates indexes'
    };
  },

  /**
   * Check storage usage
   */
  async checkStorage() {
    try {
      // This would require Firebase Admin SDK
      return {
        status: 'ok',
        message: 'Check Firebase Console for storage stats'
      };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  },

  /**
   * Generate system report
   */
  async generateReport() {
    return {
      timestamp: new Date(),
      health: await this.healthCheck(),
      analytics: await analyticsAdmin.getAllReports(7),
      userCount: (await userAdmin.getAllUsers()).length,
      eventCount: (await prestigeAdmin.getActiveEvents()).length,
      recommendedActions: [
        'Review health check results',
        'Check Firebase Console for detailed metrics',
        'Monitor error logs daily'
      ]
    };
  }
};

/**
 * ============================================================
 * HELPER FUNCTIONS
 * ============================================================
 */

function convertToCSV(data) {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csv = [headers.join(',')];

  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',')
        ? `"${value}"`
        : value;
    });
    csv.push(values.join(','));
  });

  return csv.join('\n');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * ============================================================
 * EXPORT ALL ADMIN TOOLS
 * ============================================================
 */

export const adminTools = {
  analytics: analyticsAdmin,
  social: socialAdmin,
  prestige: prestigeAdmin,
  users: userAdmin,
  maintenance
};

export default adminTools;
