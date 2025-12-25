/**
 * Prestige Service - Prestige levels, seasons, cosmetics
 */

import { db } from '../firebase/firebaseConfig';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const PRESTIGE_LEVELS = [
  { level: 1, name: 'Bronze Prestige', xpRequired: 0, icon: '🥉' },
  { level: 2, name: 'Silver Prestige', xpRequired: 10000, icon: '🥈' },
  { level: 3, name: 'Gold Prestige', xpRequired: 25000, icon: '🥇' },
  { level: 4, name: 'Platinum Prestige', xpRequired: 50000, icon: '💎' },
  { level: 5, name: 'Diamond Prestige', xpRequired: 100000, icon: '✨' },
];

const SEASONS = [
  {
    id: 'season-1',
    name: 'Season 1: The Beginning',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    theme: 'journey',
  },
  {
    id: 'season-2',
    name: 'Season 2: Ascension',
    startDate: '2025-04-01',
    endDate: '2025-06-30',
    theme: 'growth',
  },
  {
    id: 'season-3',
    name: 'Season 3: Mastery',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    theme: 'excellence',
  },
];

/**
 * Get user prestige level
 */
export async function getPrestigeLevel(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const prestigeXP = userDoc.data()?.prestigeXP || 0;

    let level = 1;
    for (const prestige of PRESTIGE_LEVELS) {
      if (prestigeXP >= prestige.xpRequired) {
        level = prestige.level;
      } else {
        break;
      }
    }

    return {
      level,
      xp: prestigeXP,
      nextLevelAt: getNextPrestigeThreshold(level),
      name: PRESTIGE_LEVELS[level - 1]?.name || 'Unknown',
      icon: PRESTIGE_LEVELS[level - 1]?.icon || '?',
    };
  } catch (error) {
    console.error('Error getting prestige level:', error);
    return null;
  }
}

/**
 * Reset to prestige (rebirth system)
 */
export async function prestigeReset(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const currentXP = userDoc.data()?.totalXP || 0;

    // Calculate prestige bonus
    const prestigeBonus = Math.floor(currentXP * 0.1); // 10% of total XP

    await updateDoc(userRef, {
      previousLevel: userDoc.data()?.currentLevel || 1,
      previousXP: currentXP,
      totalXP: 0, // Reset level progress
      currentLevel: 1, // Reset to level 1
      prestigeXP: (userDoc.data()?.prestigeXP || 0) + prestigeBonus,
      prestigeResets: (userDoc.data()?.prestigeResets || 0) + 1,
      lastPrestigeAt: new Date(),
    });

    console.log('✅ Prestige reset completed');
    return true;
  } catch (error) {
    console.error('Error resetting prestige:', error);
    throw error;
  }
}

/**
 * Get current season
 */
export function getCurrentSeason() {
  const today = new Date();

  for (const season of SEASONS) {
    const start = new Date(season.startDate);
    const end = new Date(season.endDate);

    if (today >= start && today <= end) {
      return {
        ...season,
        daysRemaining: Math.ceil((end - today) / (1000 * 60 * 60 * 24)),
      };
    }
  }

  return SEASONS[0]; // Default to first season
}

/**
 * Get season pass info
 */
export function getSeasonPass(seasonId) {
  const season = SEASONS.find((s) => s.id === seasonId);

  return {
    ...season,
    tiers: generateSeasonTiers(),
    rewards: generateSeasonRewards(),
  };
}

/**
 * Claim season reward
 */
export async function claimSeasonReward(userId, seasonId, tierId) {
  try {
    const userRef = doc(db, 'users', userId);

    await updateDoc(userRef, {
      [`seasonRewards.${seasonId}.${tierId}`]: true,
      updatedAt: new Date(),
    });

    console.log('✅ Season reward claimed');
  } catch (error) {
    console.error('Error claiming season reward:', error);
    throw error;
  }
}

/**
 * Get available cosmetics
 */
export async function getAvailableCosmetics() {
  return {
    themes: [
      {
        id: 'dark',
        name: 'Dark Theme',
        icon: '🌙',
        price: 0,
        owned: true,
      },
      {
        id: 'light',
        name: 'Light Theme',
        icon: '☀️',
        price: 0,
        owned: true,
      },
      {
        id: 'cosmic',
        name: 'Cosmic Theme',
        icon: '🌌',
        price: 500,
        owned: false,
      },
      {
        id: 'nature',
        name: 'Nature Theme',
        icon: '🌿',
        price: 500,
        owned: false,
      },
    ],
    skins: [
      {
        id: 'avatar-scholar',
        name: 'Scholar Avatar',
        icon: '🧑‍🎓',
        price: 0,
        owned: true,
      },
      {
        id: 'avatar-wizard',
        name: 'Wizard Avatar',
        icon: '🧙',
        price: 300,
        owned: false,
      },
      {
        id: 'avatar-warrior',
        name: 'Warrior Avatar',
        icon: '⚔️',
        price: 300,
        owned: false,
      },
    ],
    badges: [
      {
        id: 'badge-founder',
        name: 'Founder Badge',
        icon: '🏅',
        price: 1000,
        owned: false,
      },
      {
        id: 'badge-legend',
        name: 'Legend Badge',
        icon: '👑',
        price: 2000,
        owned: false,
      },
    ],
  };
}

/**
 * Purchase cosmetic item
 */
export async function purchaseCosmetic(userId, cosmeticId, price) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const coins = userDoc.data()?.totalCoins || 0;

    if (coins < price) {
      throw new Error('Insufficient coins');
    }

    await updateDoc(userRef, {
      totalCoins: coins - price,
      [`ownedCosmetics.${cosmeticId}`]: true,
      updatedAt: new Date(),
    });

    console.log('✅ Cosmetic purchased:', cosmeticId);
    return true;
  } catch (error) {
    console.error('Error purchasing cosmetic:', error);
    throw error;
  }
}

/**
 * Get limited time events
 */
export function getLimitedTimeEvents() {
  return [
    {
      id: 'halloween-2025',
      name: '🎃 Halloween Hunt',
      startDate: '2025-10-15',
      endDate: '2025-10-31',
      description: 'Complete spooky challenges for exclusive rewards',
      rewards: ['👻 Ghost Badge', '🎃 Pumpkin Theme', '500 XP'],
    },
    {
      id: 'holiday-2025',
      name: '🎄 Winter Wonderland',
      startDate: '2025-12-15',
      endDate: '2026-01-05',
      description: 'Festive challenges and giveaways',
      rewards: ['❄️ Snowflake Badge', '🎁 Gift Theme', '1000 XP'],
    },
  ];
}

/**
 * Check if limited event is active
 */
export function isEventActive(eventId) {
  const event = getLimitedTimeEvents().find((e) => e.id === eventId);
  if (!event) return false;

  const today = new Date().toISOString().split('T')[0];
  return today >= event.startDate && today <= event.endDate;
}

/**
 * Helper functions
 */
function getNextPrestigeThreshold(currentLevel) {
  if (currentLevel >= PRESTIGE_LEVELS.length) return null;
  return PRESTIGE_LEVELS[currentLevel]?.xpRequired || null;
}

function generateSeasonTiers() {
  const tiers = [];
  for (let i = 1; i <= 10; i++) {
    tiers.push({
      tier: i,
      xpRequired: i * 1000,
      reward: {
        xp: 100 * i,
        coins: 50 * i,
        cosmetic: i % 2 === 0 ? `tier-${i}-cosmetic` : null,
      },
    });
  }
  return tiers;
}

function generateSeasonRewards() {
  return [
    { id: 'reward-1', name: 'XP Boost (2x)', type: 'boost' },
    { id: 'reward-2', name: 'Exclusive Badge', type: 'badge' },
    { id: 'reward-3', name: 'Theme Unlock', type: 'cosmetic' },
    { id: 'reward-4', name: 'Prestige Bonus', type: 'prestige' },
  ];
}

export default {
  getPrestigeLevel,
  prestigeReset,
  getCurrentSeason,
  getSeasonPass,
  claimSeasonReward,
  getAvailableCosmetics,
  purchaseCosmetic,
  getLimitedTimeEvents,
  isEventActive,
};
