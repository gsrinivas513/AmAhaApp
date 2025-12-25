import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy
} from '../../firebase/firebaseConfig';
import { db } from '../../firebase/firebaseConfig';

// Get all subscription tiers
export async function getAllSubscriptionTiers() {
  try {
    const q = query(
      collection(db, 'subscriptions'),
      orderBy('monthlyPrice', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching subscription tiers:', error);
    throw error;
  }
}

// Get user's current subscription
export async function getUserSubscription(userId) {
  try {
    const userMonRef = doc(db, 'user_monetization', userId);
    const snap = await getDoc(userMonRef);

    if (!snap.exists()) return null;

    const data = snap.data();
    return data.subscription || null;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    throw error;
  }
}

// Upgrade subscription tier
export async function upgradeTier(userId, tierId) {
  try {
    const tierRef = doc(db, 'subscriptions', tierId);
    const tierSnap = await getDoc(tierRef);

    if (!tierSnap.exists()) {
      throw new Error('Tier not found');
    }

    const tier = tierSnap.data();
    const userMonRef = doc(db, 'user_monetization', userId);

    // Calculate renewal date (30 days from now)
    const renewalDate = new Date();
    renewalDate.setDate(renewalDate.getDate() + 30);

    await updateDoc(userMonRef, {
      subscription: {
        tier: tierId,
        tierName: tier.name,
        status: 'active',
        startDate: new Date().toISOString(),
        renewalDate: renewalDate.toISOString(),
        autoRenew: true,
        price: tier.monthlyPrice,
        currency: 'USD'
      },
      premiumFeatures: tier.features?.map(f => f.id) || []
    });

    return {
      success: true,
      tier: tier.name,
      renewalDate: renewalDate.toISOString()
    };
  } catch (error) {
    console.error('Error upgrading tier:', error);
    throw error;
  }
}

// Cancel subscription
export async function cancelSubscription(userId) {
  try {
    const userMonRef = doc(db, 'user_monetization', userId);
    await updateDoc(userMonRef, {
      'subscription.status': 'cancelled',
      'subscription.cancelledAt': new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
}

// Check if subscription is active and not expired
export async function checkSubscriptionStatus(userId) {
  try {
    const subscription = await getUserSubscription(userId);

    if (!subscription) return null;

    const now = new Date();
    const renewalDate = new Date(subscription.renewalDate);

    // Check if expired
    if (renewalDate < now) {
      // Mark as expired
      const userMonRef = doc(db, 'user_monetization', userId);
      await updateDoc(userMonRef, {
        'subscription.status': 'expired'
      });

      return {
        ...subscription,
        status: 'expired'
      };
    }

    return subscription;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    throw error;
  }
}

// Check if user has a specific feature
export function hasFeature(subscription, feature) {
  if (!subscription || subscription.status !== 'active') {
    return feature === 'basic'; // Only free features
  }

  // Features by tier
  const tierFeatures = {
    free: ['basic'],
    basic: ['basic', 'offline_mode', 'ad_free', 'custom_quizzes_5'],
    pro: ['basic', 'offline_mode', 'ad_free', 'custom_quizzes_20', 'advanced_analytics', 'team_quizzes'],
    enterprise: ['basic', 'offline_mode', 'ad_free', 'custom_quizzes_unlimited', 'advanced_analytics', 'team_quizzes', 'sso', 'custom_branding']
  };

  const features = tierFeatures[subscription.tier] || tierFeatures['free'];
  return features.includes(feature);
}

// Get subscription details
export async function getSubscriptionDetails(tierId) {
  try {
    const tierRef = doc(db, 'subscriptions', tierId);
    const snap = await getDoc(tierRef);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
}

// Create subscription tier (admin only)
export async function createSubscriptionTier(tierData) {
  try {
    const tierRef = collection(db, 'subscriptions');
    const docRef = await addDoc(tierRef, {
      ...tierData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating subscription tier:', error);
    throw error;
  }
}

export const COIN_PACKAGES = [
  { coins: 100, usd: 0.99, bonus: 0, label: 'Starter' },
  { coins: 550, usd: 4.99, bonus: 50, label: 'Popular' },
  { coins: 1200, usd: 9.99, bonus: 200, label: 'Value' },
  { coins: 3000, usd: 19.99, bonus: 500, label: 'Best' },
  { coins: 6500, usd: 39.99, bonus: 1500, label: 'Premium' }
];

export function getCoinPackage(packageId) {
  return COIN_PACKAGES[packageId] || null;
}

export function getCoinsValue(usd) {
  // $1 = 100 coins (with 10% bonus on larger purchases)
  return Math.round(usd * 100 * 1.1);
}

export function getUSDValue(coins) {
  // Reverse calculation
  return (coins / 100 / 1.1).toFixed(2);
}
