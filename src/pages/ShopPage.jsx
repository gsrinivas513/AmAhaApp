import React, { useState, useEffect } from 'react';
import { COSMETIC_SHOP, purchaseCosmetic, getUserProfile } from '../services/phase8Service';
import { useTheme } from '../context/ThemeContext';
import '../styles/shop.css';

const ShopPage = ({ userId, onPurchaseSuccess }) => {
  const { theme } = useTheme();
  const [userProfile, setUserProfile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('themes');
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const categories = {
    themes: 'Theme Packs',
    avatars: 'Avatars',
    badges: 'Badges',
    frames: 'Frames',
  };

  useEffect(() => {
    loadUserProfile();
  }, [userId]);

  const loadUserProfile = async () => {
    setLoading(true);
    const profile = await getUserProfile(userId);
    if (profile) {
      setUserProfile(profile);
      setPurchasedItems(profile.purchasedCosmetics || []);
    }
    setLoading(false);
  };

  const handlePurchase = async (item) => {
    if (purchasedItems.includes(item.id)) {
      setMessage(`You already own ${item.name}!`);
      return;
    }

    if (userProfile.totalCoins < item.cost) {
      setMessage(`Not enough coins! You need ${item.cost - userProfile.totalCoins} more.`);
      return;
    }

    const result = await purchaseCosmetic(userId, item.id, item.cost);
    if (result.success) {
      setPurchasedItems([...purchasedItems, item.id]);
      setUserProfile({
        ...userProfile,
        totalCoins: userProfile.totalCoins - item.cost,
      });
      setMessage(`✓ Successfully purchased ${item.name}!`);
      setTimeout(() => setMessage(''), 3000);
      onPurchaseSuccess?.(item);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  if (loading) {
    return <div className="shop-container"><p>Loading shop...</p></div>;
  }

  const categoryItems = COSMETIC_SHOP[selectedCategory] || [];

  return (
    <div className="shop-container" style={{ backgroundColor: theme.background, color: theme.textPrimary, transition: 'background-color 0.3s, color 0.3s' }}>
      {/* Shop Header */}
      <div className="shop-header" style={{ borderColor: theme.border }}>
        <h1 style={{ color: theme.textPrimary }}>🛍️ Cosmetics Shop</h1>
        <div className="wallet" style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border, color: theme.textPrimary }}>
          <span className="coin-icon">💰</span>
          <span className="coin-amount" style={{ color: theme.accentPrimary }}>{userProfile?.totalCoins || 0}</span>
          <span className="coin-label" style={{ color: theme.textSecondary }}>Coins</span>
        </div>
      </div>

      {/* Message Alert */}
      {message && <div className="shop-message" style={{ backgroundColor: theme.surfaceSecondary, color: theme.textPrimary, borderColor: theme.border }}>{message}</div>}

      {/* Category Navigation */}
      <div className="category-navigation" style={{ borderColor: theme.border }}>
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            className={`category-button ${selectedCategory === key ? 'active' : ''}`}
            onClick={() => setSelectedCategory(key)}
            style={{
              backgroundColor: selectedCategory === key ? theme.accentPrimary : theme.surfaceSecondary,
              color: selectedCategory === key ? 'white' : theme.textPrimary,
              borderColor: theme.border
            }}
          >
            {label}
            <span className="count">({COSMETIC_SHOP[key]?.length || 0})</span>
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="shop-grid">
        {categoryItems.map((item) => {
          const isOwned = purchasedItems.includes(item.id);

          return (
            <div key={item.id} className={`shop-item ${isOwned ? 'owned' : ''}`} style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
              <div className="item-preview">{item.icon}</div>
              <div className="item-info">
                <h3 style={{ color: theme.textPrimary }}>{item.name}</h3>
                <p className="item-description" style={{ color: theme.textSecondary }}>{item.description}</p>
                <div className="item-rarity">
                  <span className={`rarity-badge ${item.rarity}`} style={{ color: theme.accentPrimary }}>{item.rarity}</span>
                </div>
              </div>

              <div className="item-footer">
                {isOwned ? (
                  <button className="owned-badge" style={{ backgroundColor: theme.accentPrimary, color: 'white' }}>
                    ✓ Owned
                  </button>
                ) : (
                  <div className="purchase-section">
                    <span className="item-cost" style={{ color: theme.accentPrimary }}>
                      <span className="cost-icon">💰</span>
                      {item.cost}
                    </span>
                    <button
                      className={`purchase-btn ${userProfile.totalCoins < item.cost ? 'insufficient' : ''}`}
                      onClick={() => handlePurchase(item)}
                      disabled={userProfile.totalCoins < item.cost}
                      style={{ background: theme.gradientAccent, color: 'white' }}
                    >
                      {userProfile.totalCoins < item.cost ? 'Not Enough' : 'Buy'}
                    </button>
                  </div>
                )}
              </div>

              {isOwned && <div className="owned-checkmark" style={{ color: theme.accentPrimary }}>✓</div>}
            </div>
          );
        })}
      </div>

      {/* Featured Section */}
      <div className="featured-section" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h2 style={{ color: theme.textPrimary }}>⭐ Featured Items</h2>
        <div className="featured-grid">
          {COSMETIC_SHOP.themes?.slice(0, 3).map((item) => {
            const isOwned = purchasedItems.includes(item.id);
            return (
              <div key={item.id} className={`featured-card ${isOwned ? 'owned' : ''}`} style={{ backgroundColor: theme.surfacePrimary, borderColor: theme.border }}>
                <div className="featured-preview">{item.icon}</div>
                <h3 style={{ color: theme.textPrimary }}>{item.name}</h3>
                <p style={{ color: theme.textSecondary }}>{item.description}</p>
                <div className="featured-footer">
                  {isOwned ? (
                    <button className="owned-badge" style={{ backgroundColor: theme.accentPrimary, color: 'white' }}>✓ Owned</button>
                  ) : (
                    <button
                      className="featured-buy-btn"
                      onClick={() => handlePurchase(item)}
                      disabled={userProfile.totalCoins < item.cost}
                      style={{ background: theme.gradientAccent, color: 'white' }}
                    >
                      💰 {item.cost}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Shop Info */}
      <div className="shop-info" style={{ backgroundColor: theme.surfaceSecondary, borderColor: theme.border }}>
        <h3 style={{ color: theme.textPrimary }}>ℹ️ About the Shop</h3>
        <ul style={{ color: theme.textPrimary }}>
          <li>Earn coins by completing puzzles and challenges</li>
          <li>Collect cosmetics to customize your profile</li>
          <li>Show off your style with unique avatars and themes</li>
          <li>Limited edition items appear periodically</li>
        </ul>
      </div>
    </div>
  );
};

export default ShopPage;
