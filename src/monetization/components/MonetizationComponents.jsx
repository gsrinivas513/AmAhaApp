import React, { useState, useEffect } from 'react';
import { getUserCoins } from '../services/paymentService';
import '../styles/monetization.css';

export function CoinsDisplay({ userId, showLabel = true }) {
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoins();
  }, [userId]);

  async function loadCoins() {
    try {
      const balance = await getUserCoins(userId);
      setCoins(balance);
    } catch (error) {
      console.error('Error loading coins:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="coins-display skeleton"></div>;

  return (
    <div className="coins-display">
      <span className="coin-icon">💰</span>
      {showLabel && <span className="coin-label">Coins:</span>}
      <span className="coin-amount">{coins.toLocaleString()}</span>
    </div>
  );
}

export function PremiumBadge({ isPremium = false }) {
  if (!isPremium) return null;

  return (
    <div className="premium-badge">
      <span className="premium-icon">⭐</span>
      <span className="premium-text">PREMIUM</span>
    </div>
  );
}

export function PaymentModal({ product, userId, onSuccess, onCancel, useCoins = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(useCoins ? 'coins' : 'card');

  async function handlePayment() {
    setLoading(true);
    setError(null);

    try {
      let result;

      if (paymentMethod === 'coins') {
        // Payment with coins
        const coinsNeeded = product.pricing?.coins || Math.round(product.price * 100);
        const coinBalance = await getUserCoins(userId);

        if (coinBalance < coinsNeeded) {
          throw new Error(`Need ${coinsNeeded} coins, but only have ${coinBalance}`);
        }

        // In production, call purchaseWithCoins
        result = {
          success: true,
          method: 'coins',
          amount: coinsNeeded
        };
      } else {
        // Payment with card (Stripe)
        result = {
          success: true,
          method: 'card',
          paymentId: `py_${Date.now()}`
        };
      }

      if (result.success) {
        onSuccess(result);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Complete Purchase</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="product-summary">
          <h3>{product.title}</h3>
          <p className="product-desc">{product.description}</p>
          <div className="price-display">
            <span className="price">${product.price?.toFixed(2) || '0.00'}</span>
            {product.pricing?.coins && (
              <span className="coins-alt">or {product.pricing.coins} coins</span>
            )}
          </div>
        </div>

        <div className="payment-methods">
          <h4>Payment Method</h4>
          <div className="method-options">
            <label className="method-option">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="method-label">💳 Credit Card</span>
            </label>
            {product.pricing?.coins && (
              <label className="method-option">
                <input
                  type="radio"
                  value="coins"
                  checked={paymentMethod === 'coins'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-label">💰 Use Coins</span>
              </label>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-footer">
          <button
            onClick={handlePayment}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Processing...' : `Pay ${paymentMethod === 'card' ? 'with Card' : 'with Coins'}`}
          </button>
          <button onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function SubscriptionCard({ tier, currentTier, onUpgrade }) {
  const isCurrentTier = currentTier === tier.id;
  const isHigherTier = tier.monthlyPrice > (currentTier?.monthlyPrice || 0);

  return (
    <div className={`subscription-card ${isCurrentTier ? 'current' : ''} ${tier.recommended ? 'recommended' : ''}`}>
      {tier.recommended && <div className="recommended-badge">RECOMMENDED</div>}
      
      <div className="tier-header">
        <h3>{tier.name}</h3>
        <div className="tier-price">
          <span className="price">${tier.monthlyPrice?.toFixed(2)}</span>
          <span className="period">/month</span>
        </div>
        {tier.yearlyPrice && (
          <p className="yearly-price">
            or ${tier.yearlyPrice?.toFixed(2)}/year
          </p>
        )}
      </div>

      <ul className="features-list">
        {tier.features?.map((feature, idx) => (
          <li key={idx} className="feature">
            <span className="feature-icon">✓</span>
            <span className="feature-name">{feature.name}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onUpgrade(tier)}
        disabled={isCurrentTier}
        className={`btn ${isCurrentTier ? 'btn-secondary' : 'btn-primary'}`}
      >
        {isCurrentTier ? 'Current Plan' : 'Upgrade Now'}
      </button>
    </div>
  );
}

export function CoinShop({ onPurchase }) {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const coinPackages = [
    { coins: 100, usd: 0.99, bonus: 0 },
    { coins: 550, usd: 4.99, bonus: 50 },
    { coins: 1200, usd: 9.99, bonus: 200 },
    { coins: 3000, usd: 19.99, bonus: 500 },
    { coins: 6500, usd: 39.99, bonus: 1500 }
  ];

  return (
    <div className="coin-shop">
      <h2>💰 Coin Shop</h2>
      <p className="shop-subtitle">Buy coins and unlock premium content</p>

      <div className="coin-packages">
        {coinPackages.map((pkg, idx) => (
          <div
            key={idx}
            className={`coin-package ${selectedPackage === idx ? 'selected' : ''}`}
            onClick={() => setSelectedPackage(idx)}
          >
            <div className="coin-count">{pkg.coins}</div>
            <div className="coin-price">${pkg.usd}</div>
            {pkg.bonus > 0 && (
              <div className="bonus-badge">+{pkg.bonus} bonus</div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPurchase(pkg);
              }}
              className="btn btn-primary btn-sm"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PremiumFeatureGate({ feature, userSubscription, onUpgrade }) {
  const hasAccess = userSubscription?.status === 'active';

  if (hasAccess) {
    return null;
  }

  return (
    <div className="premium-gate">
      <div className="gate-content">
        <h3>🔒 Premium Feature</h3>
        <p>{feature.description}</p>
        <button onClick={onUpgrade} className="btn btn-primary">
          Upgrade to Premium
        </button>
      </div>
    </div>
  );
}

export function TransactionHistory({ userId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, [userId]);

  async function loadTransactions() {
    try {
      // In production: const history = await getUserTransactionHistory(userId);
      setTransactions([]);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading transactions...</div>;

  return (
    <div className="transaction-history">
      <h2>📋 Transaction History</h2>

      {transactions.length === 0 ? (
        <p className="empty">No transactions yet</p>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn, idx) => (
              <tr key={idx}>
                <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                <td>{txn.itemName}</td>
                <td>${(txn.amount / 100).toFixed(2)}</td>
                <td className={`status-${txn.status}`}>{txn.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
