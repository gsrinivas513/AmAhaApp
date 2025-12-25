import React, { useState, useEffect } from 'react';
import { getAllSubscriptionTiers, getUserSubscription } from '../services/subscriptionService';
import { SubscriptionCard } from '../components/MonetizationComponents';
import '../styles/monetization.css';

export function SubscriptionPage({ userId, onSubscribe }) {
  const [tiers, setTiers] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  async function loadData() {
    try {
      const tiersData = await getAllSubscriptionTiers();
      const userSub = await getUserSubscription(userId);

      setTiers(tiersData);
      setUserSubscription(userSub);
    } catch (error) {
      console.error('Error loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading plans...</div>;

  return (
    <div className="subscription-page">
      <div className="page-header">
        <h1>📊 Subscription Plans</h1>
        <p>Choose the perfect plan for your learning journey</p>
      </div>

      <div className="subscription-comparison">
        <div className="comparison-header">
          <h3>Compare Plans</h3>
        </div>

        <div className="subscription-grid">
          {tiers.map(tier => (
            <SubscriptionCard
              key={tier.id}
              tier={tier}
              currentTier={userSubscription?.tier}
              onUpgrade={(tier) => onSubscribe(tier)}
            />
          ))}
        </div>
      </div>

      {userSubscription && (
        <div className="current-subscription">
          <h3>Your Current Plan</h3>
          <div className="subscription-info">
            <p>
              <strong>Plan:</strong> {userSubscription.tierName || 'Free'}
            </p>
            {userSubscription.renewalDate && (
              <p>
                <strong>Renews:</strong>{' '}
                {new Date(userSubscription.renewalDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ShopPage({ userId, onPurchase }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProducts();
  }, [filter]);

  async function loadProducts() {
    try {
      // In production: Load from database
      // const allProducts = await collection(db, 'products').where('published', '==', true).get();
      setProducts([]);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="shop-page">
      <div className="page-header">
        <h1>🏪 Premium Shop</h1>
        <p>Discover premium quizzes and puzzles</p>
      </div>

      <div className="filter-tabs">
        {['all', 'quiz', 'puzzle', 'bundle'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All Products' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <p>📭 No products available</p>
        </div>
      ) : (
        <div className="products-grid">
          {/* Product cards will be rendered here */}
        </div>
      )}
    </div>
  );
}

export function CreatorDashboard({ userId }) {
  const [earnings, setEarnings] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [userId]);

  async function loadDashboard() {
    try {
      // In production: Load creator data
      setEarnings({
        total: 0,
        thisMonth: 0,
        pending: 0
      });
      setProducts([]);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="creator-dashboard">
      <h1>💰 Creator Dashboard</h1>

      <div className="earnings-grid">
        <div className="earnings-card">
          <h3>Total Earnings</h3>
          <p className="amount">${earnings?.total?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="earnings-card">
          <h3>This Month</h3>
          <p className="amount">${earnings?.thisMonth?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="earnings-card">
          <h3>Pending Payout</h3>
          <p className="amount">${earnings?.pending?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      <div className="products-section">
        <h2>Your Products</h2>
        {products.length === 0 ? (
          <p>You haven't created any products yet</p>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Sales</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={idx}>
                  <td>{product.title}</td>
                  <td>{product.type}</td>
                  <td>{product.sales || 0}</td>
                  <td>${((product.sales || 0) * (product.price || 0) * 0.7).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ShopPage;
