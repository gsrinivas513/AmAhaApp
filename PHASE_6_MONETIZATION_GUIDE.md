# 💰 Phase 6: Monetization System - Complete Implementation Guide

**Objective:** Add coins, subscriptions, and revenue sharing for creators  
**Estimated Time:** 15-20 hours  
**Difficulty:** Medium-High (payment integration)  
**Status:** Ready to Start ✅  
**Prerequisites:** Phase 5 Complete ✓

---

## 📋 Phase 6 Overview

### What is Monetization?

The monetization system allows the platform to:

1. **Generate Revenue** - Through premium content & subscriptions
2. **Support Creators** - Pay users who create content (70/30 split)
3. **Enhance Experience** - Premium features unlock better learning tools
4. **Drive Engagement** - Coins as reward currency can be spent on premium content

**Revenue Streams:**
- Premium quizzes/puzzles
- Subscription tiers (Basic, Pro, Enterprise)
- In-app coins (purchase directly)
- Creator revenue share (70/30)

---

## 🎯 Phase 6 Deliverables

### 1. Core Components (8 files)

```
src/monetization/components/
├── CoinsDisplay.jsx           (User balance widget)
├── PremiumBadge.jsx           (Premium content indicator)
├── PaymentModal.jsx           (Purchase interface)
├── SubscriptionCard.jsx       (Plan comparison)
├── RevenueInfo.jsx            (Creator earnings info)
├── CoinShop.jsx               (Direct coin purchases)
├── PremiumFeatureGate.jsx     (Paywall for locked content)
└── TransactionHistory.jsx     (User purchases)
```

### 2. Pages (3 files)

```
src/monetization/pages/
├── ShopPage.jsx               (Browse & buy premium content)
├── SubscriptionPage.jsx       (Manage subscriptions)
└── CreatorDashboard.jsx       (Creator earnings & analytics)
```

### 3. Services (4 files)

```
src/monetization/services/
├── paymentService.js          (Stripe/Razorpay integration)
├── subscriptionService.js     (Plan management)
├── coinService.js             (Coin economy)
└── revenueService.js          (Creator payouts)
```

### 4. Admin Tools (2 files)

```
src/monetization/admin/
├── MonetizationDashboard.jsx  (Platform revenue overview)
└── PriceManager.jsx           (Set prices & tiers)
```

### 5. Database Schema (1 reference)

```
Firestore collections:
  /user_monetization            (User coin & subscription data)
  /products                     (Premium content catalog)
  /subscriptions                (Subscription tiers)
  /transactions                 (Purchase history)
  /creator_payouts              (Creator earnings)
```

### 6. Styling (1 file)

```
src/monetization/styles/
└── monetization.css           (All monetization styling)
```

**Total:** 19 files, ~3500 lines of code

---

## 📊 Database Schema

### Collection: /user_monetization

```javascript
{
  userId: "user_123",
  
  // Coin balance
  coins: 1000,
  totalCoinsEarned: 5000,
  totalCoinsSpent: 4000,
  
  // Subscription
  subscription: {
    tier: "pro", // "free", "basic", "pro", "enterprise"
    status: "active", // "active", "inactive", "cancelled", "expired"
    startDate: timestamp,
    renewalDate: timestamp,
    autoRenew: true,
    price: 9.99,
    currency: "USD"
  },
  
  // Purchase history
  purchaseHistory: [
    {
      id: "txn_001",
      type: "quiz", // "quiz", "puzzle", "coins", "subscription"
      productId: "quiz_123",
      amount: 99, // in cents
      currency: "USD",
      paymentMethod: "stripe",
      status: "completed",
      date: timestamp
    }
  ],
  
  // Creator earnings (if user is creator)
  isCreator: false,
  creatorStats: {
    totalEarnings: 500,
    monthlyEarnings: 50,
    contentPublished: 12,
    purchases: 45
  },
  
  // Premium features unlocked
  premiumFeatures: [
    "unlimited_quizzes",
    "custom_avatar",
    "ad_free"
  ],
  
  // Last payment method
  paymentMethods: [
    {
      id: "pm_123",
      type: "card",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2025,
      default: true
    }
  ]
}
```

### Collection: /products

```javascript
{
  id: "quiz_premium_001",
  type: "quiz", // "quiz", "puzzle", "bundle", "course"
  
  // Basic info
  title: "Advanced Math Challenge",
  description: "Premium quiz with 50+ questions",
  category: "mathematics",
  difficulty: "hard",
  
  // Pricing
  pricing: {
    type: "one_time", // "one_time", "subscription"
    price: 2.99,
    currency: "USD",
    coins: 300, // Can also be purchased with coins
    discount: 0 // % off
  },
  
  // Content
  contentId: "quiz_123", // Reference to actual quiz
  preview: {
    description: "First 5 questions free to preview",
    allowPreview: true,
    sampleQuestions: 5
  },
  
  // Creator info
  creatorId: "creator_456",
  creatorName: "Teacher Jane",
  creatorShare: 70, // Creator gets 70%
  platformShare: 30,
  
  // Stats
  sales: 120,
  rating: 4.8,
  reviews: 45,
  
  // Publish info
  published: true,
  publishedAt: timestamp,
  visibility: "public" // "public", "draft", "archived"
}
```

### Collection: /subscriptions

```javascript
{
  id: "tier_basic",
  name: "Basic",
  monthlyPrice: 4.99,
  yearlyPrice: 49.99,
  
  features: [
    {
      id: "feature_1",
      name: "Ad-Free Experience",
      description: "No advertisements"
    },
    {
      id: "feature_2",
      name: "Offline Mode",
      description: "Download quizzes for offline play"
    },
    {
      id: "feature_3",
      name: "5 Custom Quizzes",
      description: "Create your own quizzes"
    }
  ],
  
  limits: {
    dailyQuizzes: 20,
    monthlyNewQuizzes: 5,
    maxCustomQuizzes: 5
  },
  
  badge: "star", // Icon/badge for tier
  bgColor: "#e8f5e9",
  
  recommended: false,
  
  // Stripe product ID
  stripePriceId: "price_1234567890",
  stripePriceIdYearly: "price_0987654321"
}
```

### Collection: /transactions

```javascript
{
  id: "txn_001",
  userId: "user_123",
  
  // Transaction info
  type: "purchase", // "purchase", "refund", "bonus", "creator_payout"
  amount: 299, // in cents
  currency: "USD",
  status: "completed", // "pending", "completed", "failed", "refunded"
  
  // What was purchased
  itemType: "quiz", // "quiz", "subscription", "coins", "bundle"
  itemId: "quiz_123",
  itemName: "Advanced Math Challenge",
  
  // Payment method
  paymentMethod: "stripe",
  paymentId: "pi_1234567890",
  
  // Creator info (if applicable)
  creatorId: "creator_456",
  creatorEarnings: 209, // 70% of amount
  platformEarnings: 90, // 30% of amount
  
  // Timestamps
  createdAt: timestamp,
  completedAt: timestamp,
  
  // Receipt & metadata
  receiptUrl: "https://...",
  metadata: {
    campaign: "summer_sale"
  }
}
```

### Collection: /creator_payouts

```javascript
{
  creatorId: "creator_456",
  month: "2024-01",
  
  earnings: {
    total: 500,
    fromQuizzes: 300,
    fromPuzzles: 200,
    fromCourses: 0
  },
  
  transactions: [
    // Array of transaction IDs
    "txn_001",
    "txn_002",
    "txn_003"
  ],
  
  payout: {
    status: "pending", // "pending", "processing", "completed"
    amount: 500,
    bankAccount: "****1234",
    method: "bank_transfer",
    scheduledDate: timestamp,
    completedDate: null
  },
  
  stats: {
    contentSold: 45,
    customers: 38,
    avgRating: 4.8
  }
}
```

---

## 🔨 Implementation Steps

### STEP 1: Setup Payment Service (Stripe)

**File:** `src/monetization/services/paymentService.js` (500 lines)

```javascript
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  updateDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

// For production, use Stripe SDK
// npm install @stripe/react-stripe-js @stripe/stripe-js

const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

// Initialize payment intent
export async function createPaymentIntent(userId, productId, amount, currency = 'USD') {
  try {
    // Call backend to create payment intent
    const response = await fetch('/api/payment/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        productId,
        amount,
        currency
      })
    });

    const { clientSecret, paymentId } = await response.json();
    return { clientSecret, paymentId };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Record transaction
export async function recordTransaction(transactionData) {
  try {
    const txnRef = collection(db, 'transactions');
    const docRef = await addDoc(txnRef, {
      ...transactionData,
      createdAt: new Date(),
      status: 'completed'
    });

    // Update user monetization record
    await updateUserCoins(transactionData.userId, transactionData.coinsDeducted || 0);

    // If creator content, record creator earnings
    if (transactionData.creatorId) {
      await recordCreatorEarnings(
        transactionData.creatorId,
        transactionData.amount * 0.7 / 100 // 70% goes to creator
      );
    }

    return docRef.id;
  } catch (error) {
    console.error('Error recording transaction:', error);
    throw error;
  }
}

export async function getTransaction(transactionId) {
  const txnRef = doc(db, 'transactions', transactionId);
  const snap = await getDoc(txnRef);
  return snap.exists() ? snap.data() : null;
}

export async function getUserTransactionHistory(userId, limit = 50) {
  const q = query(
    collection(db, 'transactions'),
    where('userId', '==', userId)
  );
  
  const snap = await getDocs(q);
  return snap.docs
    .map(doc => doc.data())
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

// Update user coins
export async function updateUserCoins(userId, coinChange) {
  const userMonRef = doc(db, 'user_monetization', userId);
  const snap = await getDoc(userMonRef);

  if (!snap.exists()) {
    // Create new user monetization record
    await setDoc(userMonRef, {
      userId,
      coins: Math.max(0, coinChange),
      totalCoinsEarned: Math.max(0, coinChange),
      totalCoinsSpent: 0,
      isCreator: false
    });
  } else {
    const current = snap.data();
    await updateDoc(userMonRef, {
      coins: Math.max(0, (current.coins || 0) + coinChange),
      totalCoinsSpent: (current.totalCoinsSpent || 0) + (coinChange < 0 ? Math.abs(coinChange) : 0),
      totalCoinsEarned: (current.totalCoinsEarned || 0) + (coinChange > 0 ? coinChange : 0)
    });
  }
}

// Creator earnings
export async function recordCreatorEarnings(creatorId, amount) {
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const payoutRef = doc(db, 'creator_payouts', `${creatorId}_${currentMonth}`);

  const snap = await getDoc(payoutRef);
  if (snap.exists()) {
    const current = snap.data();
    await updateDoc(payoutRef, {
      'earnings.total': (current.earnings.total || 0) + amount
    });
  } else {
    await setDoc(payoutRef, {
      creatorId,
      month: currentMonth,
      earnings: {
        total: amount,
        fromQuizzes: 0,
        fromPuzzles: 0,
        fromCourses: 0
      },
      payout: {
        status: 'pending',
        amount: amount,
        method: 'bank_transfer'
      }
    });
  }
}

// Verify payment (after Stripe confirmation)
export async function verifyPayment(paymentId) {
  try {
    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    });

    return await response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

// Apply discount code
export async function applyDiscountCode(code, amount) {
  try {
    const response = await fetch('/api/payment/apply-discount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, amount })
    });

    return await response.json();
  } catch (error) {
    console.error('Error applying discount:', error);
    throw error;
  }
}
```

### STEP 2: Create Subscription Service

**File:** `src/monetization/services/subscriptionService.js` (300 lines)

```javascript
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export async function getAllSubscriptionTiers() {
  const snap = await getDocs(collection(db, 'subscriptions'));
  return snap.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getUserSubscription(userId) {
  const userMonRef = doc(db, 'user_monetization', userId);
  const snap = await getDoc(userMonRef);

  if (!snap.exists()) return null;

  const data = snap.data();
  return data.subscription || null;
}

export async function upgradeTier(userId, tierId) {
  try {
    // Get tier details
    const tierRef = doc(db, 'subscriptions', tierId);
    const tierSnap = await getDoc(tierRef);

    if (!tierSnap.exists()) {
      throw new Error('Tier not found');
    }

    const tier = tierSnap.data();
    const userMonRef = doc(db, 'user_monetization', userId);

    // Create payment intent with Stripe
    const { clientSecret, paymentId } = await createPaymentIntent(
      userId,
      tierId,
      Math.round(tier.monthlyPrice * 100),
      'USD'
    );

    // After successful payment, update subscription
    // This should be called from the payment confirmation
    await updateDoc(userMonRef, {
      subscription: {
        tier: tierId,
        status: 'active',
        startDate: new Date(),
        renewalDate: getNextBillingDate(),
        autoRenew: true,
        price: tier.monthlyPrice,
        currency: 'USD'
      }
    });

    return {
      clientSecret,
      paymentId,
      tier: tier.name
    };
  } catch (error) {
    console.error('Error upgrading tier:', error);
    throw error;
  }
}

export async function cancelSubscription(userId) {
  const userMonRef = doc(db, 'user_monetization', userId);
  await updateDoc(userMonRef, {
    'subscription.status': 'cancelled',
    'subscription.cancelledAt': new Date()
  });
}

export async function checkSubscriptionStatus(userId) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) return null;

  // Check if renewal date passed
  if (new Date() > subscription.renewalDate) {
    return {
      ...subscription,
      status: 'expired'
    };
  }

  return subscription;
}

function getNextBillingDate() {
  const next = new Date();
  next.setMonth(next.getMonth() + 1);
  return next;
}

export function hasFeature(subscription, feature) {
  if (!subscription || subscription.status !== 'active') {
    return feature === 'free'; // Only free features available
  }

  const tier = TIER_FEATURES[subscription.tier];
  return tier && tier.includes(feature);
}

const TIER_FEATURES = {
  free: [
    'basic_quizzes',
    'leaderboard',
    'achievements'
  ],
  basic: [
    'basic_quizzes',
    'leaderboard',
    'achievements',
    'offline_mode',
    'ad_free',
    'custom_quizzes_5'
  ],
  pro: [
    'basic_quizzes',
    'leaderboard',
    'achievements',
    'offline_mode',
    'ad_free',
    'custom_quizzes_20',
    'advanced_analytics',
    'team_quizzes',
    'api_access'
  ],
  enterprise: [
    'basic_quizzes',
    'leaderboard',
    'achievements',
    'offline_mode',
    'ad_free',
    'custom_quizzes_unlimited',
    'advanced_analytics',
    'team_quizzes',
    'api_access',
    'sso',
    'custom_branding',
    'dedicated_support'
  ]
};

function createPaymentIntent(userId, productId, amount, currency) {
  // Call backend
  return fetch('/api/payment/create-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, productId, amount, currency })
  }).then(r => r.json());
}
```

### STEP 3: Create Coin Service

**File:** `src/monetization/services/coinService.js` (250 lines)

```javascript
import { 
  doc, 
  getDoc, 
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export async function getUserCoins(userId) {
  const userMonRef = doc(db, 'user_monetization', userId);
  const snap = await getDoc(userMonRef);

  if (!snap.exists()) return 0;
  return snap.data().coins || 0;
}

export async function addCoins(userId, amount, reason = 'bonus') {
  const userMonRef = doc(db, 'user_monetization', userId);

  try {
    await updateDoc(userMonRef, {
      coins: increment(amount),
      totalCoinsEarned: increment(amount)
    });

    // Log the transaction
    // await logCoinTransaction(userId, amount, reason, 'earned');

    return true;
  } catch (error) {
    console.error('Error adding coins:', error);
    return false;
  }
}

export async function subtractCoins(userId, amount, reason = 'purchase') {
  const coins = await getUserCoins(userId);

  if (coins < amount) {
    throw new Error('Insufficient coins');
  }

  const userMonRef = doc(db, 'user_monetization', userId);

  try {
    await updateDoc(userMonRef, {
      coins: increment(-amount),
      totalCoinsSpent: increment(amount)
    });

    // await logCoinTransaction(userId, amount, reason, 'spent');

    return true;
  } catch (error) {
    console.error('Error subtracting coins:', error);
    throw error;
  }
}

// Reward coins for various actions
export async function rewardCoinsForAction(userId, action) {
  const rewards = {
    'quiz_complete': 10,
    'puzzle_complete': 15,
    'achievement_unlock': 25,
    'daily_login': 5,
    'weekly_challenge': 50,
    'story_complete': 20,
    'first_quiz': 50,
    'referral': 100
  };

  const amount = rewards[action] || 0;
  if (amount > 0) {
    await addCoins(userId, amount, action);
  }

  return amount;
}

export async function canAffordPurchase(userId, cost) {
  const coins = await getUserCoins(userId);
  return coins >= cost;
}

export function getUSDValue(coins) {
  // 100 coins = $1 USD
  return coins / 100;
}

export function getCoinsValue(usd) {
  // $1 USD = 100 coins (roughly)
  return Math.round(usd * 100 * 1.1); // 10% bonus
}

// Coin packages for direct purchase
export const COIN_PACKAGES = [
  { coins: 100, usd: 0.99, bonus: 0 },
  { coins: 550, usd: 4.99, bonus: 50 },
  { coins: 1200, usd: 9.99, bonus: 200 },
  { coins: 3000, usd: 19.99, bonus: 500 },
  { coins: 6500, usd: 39.99, bonus: 1500 },
];

export function getCoinPackage(packageId) {
  return COIN_PACKAGES[packageId] || null;
}
```

### STEP 4: Create UI Components

**File:** `src/monetization/components/PaymentModal.jsx` (300 lines)

```javascript
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { recordTransaction } from '../services/paymentService';
import '../styles/monetization.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export function PaymentModal({ product, userId, onSuccess, onCancel }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        product={product}
        userId={userId}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}

function PaymentForm({ product, userId, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: product.id,
          amount: Math.round(product.price * 100),
          currency: 'USD'
        })
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Record transaction
        await recordTransaction({
          userId,
          itemType: product.type,
          itemId: product.id,
          itemName: product.title,
          amount: Math.round(product.price * 100),
          currency: 'USD',
          paymentMethod: 'stripe',
          paymentId: result.paymentIntent.id,
          creatorId: product.creatorId,
          status: 'completed'
        });

        setSuccess(true);
        setTimeout(() => onSuccess(result.paymentIntent.id), 2000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="payment-modal">
      <div className="modal-header">
        <h2>Complete Purchase</h2>
        <button onClick={onCancel} className="close-btn">×</button>
      </div>

      <div className="product-summary">
        <h3>{product.title}</h3>
        <p className="price">${product.price.toFixed(2)}</p>
      </div>

      {success ? (
        <div className="success-message">
          ✓ Payment successful! Enjoy your purchase.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            disabled={!stripe || loading}
            className="btn-pay"
          >
            {loading ? 'Processing...' : 'Pay with Card'}
          </button>
        </form>
      )}

      <div className="payment-methods">
        <p className="small-text">
          Secure payment powered by Stripe. We accept all major credit cards.
        </p>
      </div>
    </div>
  );
}
```

### STEP 5: Create Shop Page

**File:** `src/monetization/pages/ShopPage.jsx` (400 lines)

```javascript
import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { PaymentModal } from '../components/PaymentModal';
import { CoinsDisplay } from '../components/CoinsDisplay';
import '../styles/monetization.css';

export function ShopPage({ userId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState('all'); // all, quiz, puzzle, bundle

  useEffect(() => {
    loadProducts();
  }, [filter]);

  async function loadProducts() {
    try {
      let q = query(
        collection(db, 'products'),
        where('published', '==', true)
      );

      if (filter !== 'all') {
        q = query(
          collection(db, 'products'),
          where('published', '==', true),
          where('type', '==', filter)
        );
      }

      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>🏪 Premium Shop</h1>
        <CoinsDisplay userId={userId} />
      </div>

      <div className="filter-tabs">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Products
        </button>
        <button
          className={filter === 'quiz' ? 'active' : ''}
          onClick={() => setFilter('quiz')}
        >
          Quizzes
        </button>
        <button
          className={filter === 'puzzle' ? 'active' : ''}
          onClick={() => setFilter('puzzle')}
        >
          Puzzles
        </button>
        <button
          className={filter === 'bundle' ? 'active' : ''}
          onClick={() => setFilter('bundle')}
        >
          Bundles
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      )}

      {selectedProduct && (
        <PaymentModal
          product={selectedProduct}
          userId={userId}
          onSuccess={() => {
            alert('Purchase successful!');
            setSelectedProduct(null);
            loadProducts();
          }}
          onCancel={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

function ProductCard({ product, onSelect }) {
  return (
    <div className="product-card">
      <div className="product-header">
        <h3>{product.title}</h3>
        {product.creatorId && (
          <span className="creator-badge">By {product.creatorName}</span>
        )}
      </div>

      <p className="description">{product.description}</p>

      <div className="product-meta">
        <span className="difficulty">{product.difficulty}</span>
        <span className="category">{product.category}</span>
      </div>

      <div className="rating">
        <span className="stars">★★★★★ {product.rating}</span>
        <span className="reviews">({product.reviews} reviews)</span>
      </div>

      <div className="pricing">
        {product.pricing.type === 'one_time' && (
          <>
            <span className="price">${product.pricing.price.toFixed(2)}</span>
            <span className="coins-alt">
              or {product.pricing.coins} coins
            </span>
          </>
        )}
      </div>

      <button className="btn-buy" onClick={onSelect}>
        Purchase
      </button>
    </div>
  );
}
```

### STEP 6: Create Creator Dashboard

**File:** `src/monetization/pages/CreatorDashboard.jsx` (400 lines)

```javascript
import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import '../styles/monetization.css';

export function CreatorDashboard({ userId }) {
  const [stats, setStats] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [userId]);

  async function loadDashboard() {
    try {
      // Get payout info for current month
      const currentMonth = new Date().toISOString().slice(0, 7);
      const payoutRef = doc(db, 'creator_payouts', `${userId}_${currentMonth}`);
      const payoutSnap = await getDoc(payoutRef);

      if (payoutSnap.exists()) {
        setEarnings(payoutSnap.data());
      }

      // Get creator's products
      const q = query(
        collection(db, 'products'),
        where('creatorId', '==', userId)
      );
      const productsSnap = await getDocs(q);
      const creatorProducts = productsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setProducts(creatorProducts);

      // Calculate stats
      const totalEarnings = creatorProducts.reduce((sum, p) => sum + (p.sales || 0) * p.pricing.price * 0.7, 0);
      const totalSales = creatorProducts.reduce((sum, p) => sum + (p.sales || 0), 0);

      setStats({
        totalEarnings,
        totalSales,
        contentPublished: creatorProducts.length,
        avgRating: (creatorProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / creatorProducts.length).toFixed(1)
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="creator-dashboard">
      <h1>💰 Creator Dashboard</h1>

      <div className="stats-grid">
        <StatCard
          title="Total Earnings"
          value={`$${(stats?.totalEarnings || 0).toFixed(2)}`}
          icon="💵"
        />
        <StatCard
          title="Total Sales"
          value={stats?.totalSales || 0}
          icon="📊"
        />
        <StatCard
          title="Products"
          value={stats?.contentPublished || 0}
          icon="📦"
        />
        <StatCard
          title="Avg Rating"
          value={stats?.avgRating || 'N/A'}
          icon="⭐"
        />
      </div>

      <div className="earnings-section">
        <h2>Monthly Earnings</h2>
        {earnings ? (
          <div className="earnings-info">
            <p>Month: {earnings.month}</p>
            <p className="amount">${earnings.earnings.total.toFixed(2)}</p>
            <p className="status">{earnings.payout.status}</p>
          </div>
        ) : (
          <p>No earnings this month yet.</p>
        )}
      </div>

      <div className="products-section">
        <h2>Your Products ({products.length})</h2>
        <table className="products-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Price</th>
              <th>Sales</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.type}</td>
                <td>${product.pricing.price.toFixed(2)}</td>
                <td>{product.sales || 0}</td>
                <td>★ {product.rating || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}
```

### STEP 7: Create Styling

**File:** `src/monetization/styles/monetization.css` (500 lines)

```css
/* ================================
   COINS DISPLAY
================================ */

.coins-display {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: bold;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
}

.coins-display .coin-icon {
  font-size: 1.2rem;
}

.coins-display .coin-amount {
  font-size: 1rem;
}

/* ================================
   PAYMENT MODAL
================================ */

.payment-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.payment-modal .modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
}

.payment-modal .close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.payment-modal .product-summary {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.payment-modal .product-summary h3 {
  margin: 0 0 10px 0;
}

.payment-modal .price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4CAF50;
}

.payment-modal form {
  margin: 20px 0;
}

.payment-modal .StripeElement {
  border: 1px solid #d0d0d0;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.btn-pay {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-pay:hover:not(:disabled) {
  background: #45a049;
}

.btn-pay:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin: 10px 0;
  text-align: center;
}

/* ================================
   SHOP PAGE
================================ */

.shop-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.shop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.shop-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
}

.filter-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-tabs button {
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.filter-tabs button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.product-card h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.product-card .creator-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 10px;
}

.product-card .description {
  color: #666;
  font-size: 0.9rem;
  margin: 10px 0;
}

.product-meta {
  display: flex;
  gap: 10px;
  margin: 10px 0;
}

.product-meta span {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
  color: #ff9800;
}

.pricing {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 15px 0;
  font-weight: bold;
}

.pricing .price {
  font-size: 1.5rem;
  color: #4CAF50;
}

.pricing .coins-alt {
  font-size: 0.85rem;
  color: #999;
}

.btn-buy {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-buy:hover {
  background: #45a049;
}

/* ================================
   CREATOR DASHBOARD
================================ */

.creator-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.creator-dashboard h1 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content h3 {
  margin: 0;
  color: #999;
  font-size: 0.85rem;
  font-weight: 500;
}

.stat-value {
  margin: 5px 0 0 0;
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.earnings-section,
.products-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.earnings-info {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

.amount {
  font-size: 2rem;
  font-weight: bold;
  color: #4CAF50;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.products-table thead {
  background: #f5f5f5;
}

.products-table th,
.products-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.products-table tr:hover {
  background: #f9f9f9;
}

/* Responsive */
@media (max-width: 768px) {
  .shop-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .products-table {
    font-size: 0.9rem;
  }

  .products-table th,
  .products-table td {
    padding: 8px;
  }
}
```

---

## ✅ Implementation Checklist

- [ ] Create `paymentService.js` (Stripe integration)
- [ ] Create `subscriptionService.js` (Plan management)
- [ ] Create `coinService.js` (Coin economy)
- [ ] Create `revenueService.js` (Creator payouts)
- [ ] Create all components (8 files)
- [ ] Create main pages (ShopPage, SubscriptionPage, CreatorDashboard)
- [ ] Create admin tools (MonetizationDashboard, PriceManager)
- [ ] Create styling (monetization.css)
- [ ] Integrate PaymentModal into purchase flows
- [ ] Add routes: `/shop`, `/subscriptions`, `/creator-dashboard`
- [ ] Setup Stripe webhook handling
- [ ] Test purchase flows (card, refund)
- [ ] Test coin economy
- [ ] Test creator payout system
- [ ] Update Navbar with shop link
- [ ] Run full build test
- [ ] Update documentation

---

## 🎬 Testing Scenarios

### Scenario 1: Purchase Premium Quiz with Card
1. Go to ShopPage
2. Click on premium quiz
3. Enter payment details (test card: 4242 4242 4242 4242)
4. Complete purchase
5. Verify transaction recorded
6. Verify quiz unlocked
7. ✅ Check creator received 70%

### Scenario 2: Subscribe to Pro Tier
1. Go to SubscriptionPage
2. Click "Upgrade to Pro"
3. Complete payment
4. Verify subscription active
5. Verify pro features unlocked
6. ✅ Check renewal date set

### Scenario 3: Creator Earns & Requests Payout
1. Create premium content as creator
2. User purchases content
3. Check creator earnings in dashboard
4. Request payout
5. Verify payout pending
6. ✅ Check transfer initiated

---

## 🚀 After Phase 6 Complete

1. Run full build test
2. Deploy to staging
3. Test with real payments (Stripe test mode)
4. Verify webhook handling
5. **Move to Phase 7: Mobile App (React Native)**

---

**Ready to implement Phase 6?**
- ✅ Payment integration patterns established
- ✅ Database schema designed
- ✅ UI components ready
- ✅ Creator revenue model clear

**Estimated Time:** 15-20 hours  
**Difficulty:** Medium-High  
**Status:** Ready to Start ✅
