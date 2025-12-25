import React, { useState } from 'react';
import './marketplace.css';

/**
 * Marketplace UI Components - Buy/sell content and creator tools
 */

// ===== LISTING CARD =====

export function MarketplaceListingCard({ listing, onPurchase, onView, isPurchased = false, currentUser }) {
  const isSeller = currentUser === listing.seller;

  return (
    <div className="marketplace-card">
      <div className="listing-image-container">
        <img src={listing.image || '/placeholder-listing.png'} alt={listing.title} className="listing-image" />
        <div className="listing-badge">{listing.contentType}</div>
        {listing.discountPercentage > 0 && (
          <div className="discount-badge">-{listing.discountPercentage}%</div>
        )}
      </div>

      <div className="listing-content">
        <h3 className="listing-title">{listing.title}</h3>
        <p className="listing-seller">by {listing.sellerName}</p>
        <p className="listing-description">{listing.description.substring(0, 100)}...</p>

        <div className="listing-meta">
          <span className="listing-rating">⭐ {listing.rating} ({listing.ratingCount})</span>
          <span className="listing-sales">📊 {listing.sales} sold</span>
          <span className="listing-views">👁️ {listing.views} views</span>
        </div>

        <div className="listing-price">
          <span className="price-label">Price:</span>
          <span className="price-amount">
            {listing.currency === 'coins' ? '🪙' : '$'} {listing.price}
          </span>
          {listing.discountPercentage > 0 && (
            <span className="original-price">
              Original: {listing.currency === 'coins' ? '🪙' : '$'}
              {(listing.price / (1 - listing.discountPercentage / 100)).toFixed(2)}
            </span>
          )}
        </div>

        <div className="listing-actions">
          {isSeller ? (
            <button className="btn btn-secondary" disabled>
              Your Listing
            </button>
          ) : isPurchased ? (
            <button className="btn btn-success" disabled>
              ✓ Purchased
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => onPurchase?.(listing.id)}>
              Purchase
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => onView?.(listing.id)}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== MARKETPLACE FILTERS =====

export function MarketplaceFilters({ onFilter, contentTypes }) {
  const [contentType, setContentType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = () => {
    onFilter?.({
      contentType: contentType || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      sortBy,
      search: searchTerm,
    });
  };

  return (
    <div className="marketplace-filters">
      <div className="filter-group">
        <label htmlFor="marketplace-search">Search Listings</label>
        <input
          id="marketplace-search"
          type="text"
          placeholder="Search by title, tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="content-type">Content Type</label>
        <select value={contentType} onChange={(e) => setContentType(e.target.value)}>
          <option value="">All Types</option>
          {contentTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-row">
        <div className="filter-group">
          <label htmlFor="min-price">Min Price</label>
          <input
            id="min-price"
            type="number"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="max-price">Max Price</label>
          <input
            id="max-price"
            type="number"
            placeholder="999"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <label htmlFor="sort">Sort By</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="trending">Most Popular</option>
        </select>
      </div>

      <button className="btn btn-primary" onClick={handleFilter}>
        Apply Filters
      </button>
    </div>
  );
}

// ===== SELLER DASHBOARD CARD =====

export function SellerDashboardCard({ title, value, icon, trend = null }) {
  return (
    <div className="dashboard-card">
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <span className="card-title">{title}</span>
      </div>
      <div className="card-value">{value}</div>
      {trend && (
        <div className={`card-trend ${trend.direction}`}>
          {trend.direction === 'up' ? '📈' : '📉'} {trend.percentage}% {trend.period}
        </div>
      )}
    </div>
  );
}

// ===== PAYMENT MODAL =====

export function PaymentModal({ listing, onPaymentComplete, onClose, userCoins = 0 }) {
  const [paymentMethod, setPaymentMethod] = useState('coins');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
  });
  const [processing, setProcessing] = useState(false);

  const finalPrice = listing.price * (1 - (listing.discountPercentage || 0) / 100);
  const canPayWithCoins = userCoins >= finalPrice;

  const handlePayment = async () => {
    if (paymentMethod === 'coins' && !canPayWithCoins) {
      alert('Insufficient coins');
      return;
    }

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onPaymentComplete?.({ method: paymentMethod, amount: finalPrice });
      onClose?.();
    } catch (error) {
      alert('Payment failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2>Checkout</h2>

        <div className="order-summary">
          <div className="summary-item">
            <span className="summary-label">{listing.title}</span>
            <span className="summary-value">
              {listing.currency === 'coins' ? '🪙' : '$'} {listing.price}
            </span>
          </div>
          {listing.discountPercentage > 0 && (
            <div className="summary-item discount">
              <span className="summary-label">Discount ({listing.discountPercentage}%)</span>
              <span className="summary-value">
                -{listing.currency === 'coins' ? '🪙' : '$'}
                {(listing.price * listing.discountPercentage / 100).toFixed(2)}
              </span>
            </div>
          )}
          <div className="summary-item total">
            <span className="summary-label">Total</span>
            <span className="summary-value">
              {listing.currency === 'coins' ? '🪙' : '$'} {finalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="payment-methods">
          <div className="method-option">
            <input
              type="radio"
              id="coins"
              name="payment"
              value="coins"
              checked={paymentMethod === 'coins'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              disabled={!canPayWithCoins}
            />
            <label htmlFor="coins">
              <span className="method-name">🪙 Coins</span>
              <span className="method-info">Your balance: {userCoins} coins</span>
            </label>
          </div>

          <div className="method-option">
            <input
              type="radio"
              id="card"
              name="payment"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="card">
              <span className="method-name">💳 Credit Card</span>
            </label>
          </div>
        </div>

        {paymentMethod === 'card' && (
          <div className="card-form">
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardData.cardholderName}
              onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Card Number"
              value={cardData.cardNumber}
              onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
              className="form-input"
              maxLength="19"
            />
            <div className="form-row">
              <input
                type="text"
                placeholder="MM/YY"
                value={cardData.expiryDate}
                onChange={(e) => setCardData({ ...cardData, expiryDate: e.target.value })}
                className="form-input"
                maxLength="5"
              />
              <input
                type="text"
                placeholder="CVC"
                value={cardData.cvc}
                onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                className="form-input"
                maxLength="4"
              />
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button
            className="btn btn-primary btn-block"
            onClick={handlePayment}
            disabled={processing}
          >
            {processing ? 'Processing...' : `Pay ${listing.currency === 'coins' ? '🪙' : '$'} ${finalPrice.toFixed(2)}`}
          </button>
          <button className="btn btn-secondary btn-block" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== EARNINGS CHART =====

export function EarningsChart({ monthlyEarnings = {} }) {
  const months = Object.keys(monthlyEarnings).sort();
  const maxEarnings = Math.max(...Object.values(monthlyEarnings), 100);

  return (
    <div className="earnings-chart">
      <h3 className="chart-title">Monthly Earnings</h3>
      <div className="chart-container">
        {months.length === 0 ? (
          <p className="no-data">No earnings data yet</p>
        ) : (
          <div className="bars">
            {months.map((month) => {
              const earnings = monthlyEarnings[month];
              const percentage = (earnings / maxEarnings) * 100;
              return (
                <div key={month} className="bar-container">
                  <div className="bar" style={{ height: `${percentage}%` }}>
                    <span className="bar-value">💰 {earnings.toFixed(0)}</span>
                  </div>
                  <span className="bar-label">{month}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
