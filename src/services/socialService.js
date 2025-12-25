/**
 * Social Service - Friends, challenges, profiles
 */

import { db, auth } from '../firebase/firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';

/**
 * Add friend
 */
export async function addFriend(userId, friendId) {
  try {
    const userRef = doc(db, 'users', userId);
    const friendRef = doc(db, 'users', friendId);

    // Create relationship
    await setDoc(
      doc(db, 'friendships', `${userId}_${friendId}`),
      {
        userId,
        friendId,
        status: 'accepted',
        addedAt: new Date(),
      },
      { merge: true }
    );

    // Add to friends array
    await updateDoc(userRef, {
      friends: arrayUnion(friendId),
    });

    await updateDoc(friendRef, {
      friends: arrayUnion(userId),
    });

    console.log('✅ Friend added:', friendId);
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
}

/**
 * Remove friend
 */
export async function removeFriend(userId, friendId) {
  try {
    const userRef = doc(db, 'users', userId);
    const friendRef = doc(db, 'users', friendId);

    // Delete relationship
    await deleteDoc(doc(db, 'friendships', `${userId}_${friendId}`));
    await deleteDoc(doc(db, 'friendships', `${friendId}_${userId}`));

    // Remove from friends array
    await updateDoc(userRef, {
      friends: arrayRemove(friendId),
    });

    await updateDoc(friendRef, {
      friends: arrayRemove(userId),
    });

    console.log('✅ Friend removed:', friendId);
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
}

/**
 * Get user's friends
 */
export async function getUserFriends(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const friendIds = userDoc.data()?.friends || [];

    const friends = await Promise.all(
      friendIds.map(async (friendId) => {
        const friendDoc = await getDoc(doc(db, 'users', friendId));
        return {
          id: friendId,
          ...friendDoc.data(),
        };
      })
    );

    return friends;
  } catch (error) {
    console.error('Error getting friends:', error);
    return [];
  }
}

/**
 * Send challenge to friend
 */
export async function sendChallenge(userId, friendId, challengeData) {
  try {
    const challengeRef = collection(db, 'challenges');
    const challenge = {
      from: userId,
      to: friendId,
      type: challengeData.type,
      difficulty: challengeData.difficulty,
      targetScore: challengeData.targetScore,
      deadline: challengeData.deadline,
      status: 'pending',
      createdAt: new Date(),
      responses: [],
    };

    const docRef = await setDoc(doc(challengeRef), challenge);
    console.log('✅ Challenge sent:', docRef);
    return docRef;
  } catch (error) {
    console.error('Error sending challenge:', error);
    throw error;
  }
}

/**
 * Accept/reject challenge
 */
export async function respondToChallenge(challengeId, accept) {
  try {
    const challengeRef = doc(db, 'challenges', challengeId);

    await updateDoc(challengeRef, {
      status: accept ? 'accepted' : 'rejected',
      respondedAt: new Date(),
    });

    console.log('✅ Challenge response:', accept ? 'accepted' : 'rejected');
  } catch (error) {
    console.error('Error responding to challenge:', error);
    throw error;
  }
}

/**
 * Get friend leaderboard
 */
export async function getFriendLeaderboard(userId, limit = 20) {
  try {
    const friends = await getUserFriends(userId);
    const friendIds = friends.map((f) => f.id);

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('__name__', 'in', friendIds));

    const snapshot = await getDocs(q);
    const friendsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by XP
    return friendsData
      .sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting friend leaderboard:', error);
    return [];
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      return null;
    }

    const data = userDoc.data();
    const achievements = await getDoc(doc(db, 'achievements', userId));

    return {
      id: userId,
      ...data,
      unlockedAchievements: achievements.exists() ? achievements.data().unlocked : [],
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, profileData) {
  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      ...profileData,
      updatedAt: new Date(),
    });

    console.log('✅ Profile updated');
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

/**
 * Get activity feed for friends
 */
export async function getFriendsActivityFeed(userId, limit = 20) {
  try {
    const friends = await getUserFriends(userId);
    const friendIds = friends.map((f) => f.id);

    const eventsRef = collection(db, 'analytics_events');
    const q = query(
      eventsRef,
      where('userId', 'in', friendIds)
    );

    const snapshot = await getDocs(q);
    const events = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);

    return events;
  } catch (error) {
    console.error('Error getting activity feed:', error);
    return [];
  }
}

/**
 * Get pending challenges
 */
export async function getPendingChallenges(userId) {
  try {
    const challengesRef = collection(db, 'challenges');
    const q = query(
      challengesRef,
      where('to', '==', userId),
      where('status', '==', 'pending')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting pending challenges:', error);
    return [];
  }
}

export default {
  addFriend,
  removeFriend,
  getUserFriends,
  sendChallenge,
  respondToChallenge,
  getFriendLeaderboard,
  getUserProfile,
  updateUserProfile,
  getFriendsActivityFeed,
  getPendingChallenges,
};
