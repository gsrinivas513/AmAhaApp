import { addCoins, subtractCoins, getUserCoins } from './paymentService';

// Reward coins for completing actions
export async function rewardCoinsForAction(userId, action) {
  const rewards = {
    'quiz_complete': 10,
    'quiz_perfect': 50,
    'puzzle_complete': 15,
    'puzzle_perfect': 40,
    'achievement_unlock': 25,
    'daily_login': 5,
    'weekly_challenge': 50,
    'story_complete': 20,
    'story_perfect': 75,
    'first_quiz': 50,
    'referral': 100,
    'social_share': 10,
    'video_watch': 5
  };

  const amount = rewards[action] || 0;
  if (amount > 0) {
    await addCoins(userId, amount, action);
  }

  return amount;
}

// Check if user can afford purchase
export async function canAffordPurchase(userId, cost) {
  try {
    const coins = await getUserCoins(userId);
    return coins >= cost;
  } catch (error) {
    console.error('Error checking affordability:', error);
    return false;
  }
}

// Purchase with coins
export async function purchaseWithCoins(userId, productId, cost) {
  try {
    const canAfford = await canAffordPurchase(userId, cost);

    if (!canAfford) {
      throw new Error('Insufficient coins for this purchase');
    }

    await subtractCoins(userId, cost, 'product_purchase');

    return {
      success: true,
      remainingCoins: await getUserCoins(userId)
    };
  } catch (error) {
    console.error('Error purchasing with coins:', error);
    throw error;
  }
}

// Coin bonus calculation
export function calculateCoinBonus(baseCoins, multiplier = 1.0) {
  const bonus = Math.round(baseCoins * (multiplier - 1));
  return {
    baseCoins,
    bonus,
    total: baseCoins + bonus,
    multiplier
  };
}

// Loyalty rewards (tiered based on total coins earned)
export function getLoyaltyTier(totalCoinsEarned) {
  if (totalCoinsEarned >= 5000) return { tier: 'platinum', bonusMultiplier: 1.5 };
  if (totalCoinsEarned >= 2500) return { tier: 'gold', bonusMultiplier: 1.25 };
  if (totalCoinsEarned >= 1000) return { tier: 'silver', bonusMultiplier: 1.1 };
  return { tier: 'bronze', bonusMultiplier: 1.0 };
}

// Limited-time offers
export function getSeasonalBonus(currentDate = new Date()) {
  const month = currentDate.getMonth();
  const bonuses = {
    0: { name: 'New Year Bonus', multiplier: 1.5 },      // January
    11: { name: 'Holiday Bonus', multiplier: 1.5 },      // December
    6: { name: 'Summer Bonus', multiplier: 1.2 }         // July
  };

  return bonuses[month] || { name: 'Regular', multiplier: 1.0 };
}

// Daily login streak bonuses
export function getDailyLoginBonus(streak) {
  if (streak >= 30) return 50;
  if (streak >= 14) return 25;
  if (streak >= 7) return 15;
  return 5;
}

// Streak maintenance helper
export function shouldResetStreak(lastLoginDate) {
  const now = new Date();
  const last = new Date(lastLoginDate);
  const diffTime = Math.abs(now - last);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 1;
}
