import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../../firebase';

/**
 * Marketplace Service - User-generated content marketplace
 * Users can buy/sell quizzes, puzzles, stories, arts, and studies
 */

// ===== LISTING MANAGEMENT =====

/**
 * Create a marketplace listing
 * @param {Object} listingData - { contentId, contentType, title, description, price, seller, image }
 */
export async function createMarketplaceListing(listingData) {
  try {
    const listing = {
      contentId: listingData.contentId,
      contentType: listingData.contentType, // 'quiz', 'puzzle', 'story', 'arts', 'studies'
      title: listingData.title,
      description: listingData.description,
      price: listingData.price, // in coins or USD
      seller: listingData.seller, // userId
      sellerName: listingData.sellerName || 'Unknown Seller',
      image: listingData.image,
      status: 'active', // 'active', 'paused', 'archived'
      published: true,
      rating: 0,
      ratingCount: 0,
      sales: 0,
      views: 0,
      revenue: 0, // total earned from this listing
      tags: listingData.tags || [],
      category: listingData.category || '',
      currency: listingData.currency || 'coins', // 'coins', 'usd'
      discountPercentage: listingData.discountPercentage || 0,
      discountExpiry: listingData.discountExpiry || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiryDate: listingData.expiryDate || null,
    };

    const listingsRef = collection(db, 'marketplace_listings');
    const docRef = await addDoc(listingsRef, listing);
    return { id: docRef.id, ...listing };
  } catch (error) {
    console.error('Error creating marketplace listing:', error);
    throw error;
  }
}

/**
 * Get a marketplace listing
 */
export async function getMarketplaceListing(listingId) {
  try {
    const docRef = doc(db, 'marketplace_listings', listingId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    // Increment view count
    await updateDoc(docRef, {
      views: (docSnap.data().views || 0) + 1,
    });

    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error getting marketplace listing:', error);
    throw error;
  }
}

/**
 * Update a marketplace listing
 */
export async function updateMarketplaceListing(listingId, updates) {
  try {
    const docRef = doc(db, 'marketplace_listings', listingId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { id: listingId, ...updates };
  } catch (error) {
    console.error('Error updating marketplace listing:', error);
    throw error;
  }
}

/**
 * Delete a marketplace listing
 */
export async function deleteMarketplaceListing(listingId) {
  try {
    const docRef = doc(db, 'marketplace_listings', listingId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting marketplace listing:', error);
    throw error;
  }
}

// ===== LISTING QUERIES =====

/**
 * Get all active marketplace listings
 */
export async function getAllMarketplaceListings(pageSize = 20) {
  try {
    const q = query(
      collection(db, 'marketplace_listings'),
      where('status', '==', 'active'),
      where('published', '==', true),
      orderBy('sales', 'desc'),
      limit(pageSize)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching marketplace listings:', error);
    throw error;
  }
}

/**
 * Get listings by content type
 */
export async function getListingsByContentType(contentType) {
  try {
    const q = query(
      collection(db, 'marketplace_listings'),
      where('contentType', '==', contentType),
      where('status', '==', 'active'),
      where('published', '==', true),
      orderBy('sales', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching listings by content type:', error);
    throw error;
  }
}

/**
 * Get listings by seller
 */
export async function getListingsBySeller(sellerId) {
  try {
    const q = query(
      collection(db, 'marketplace_listings'),
      where('seller', '==', sellerId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching seller listings:', error);
    throw error;
  }
}

/**
 * Get listings by category
 */
export async function getListingsByCategory(category) {
  try {
    const q = query(
      collection(db, 'marketplace_listings'),
      where('category', '==', category),
      where('status', '==', 'active'),
      where('published', '==', true),
      orderBy('rating', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching listings by category:', error);
    throw error;
  }
}

/**
 * Search marketplace listings
 */
export async function searchMarketplaceListings(searchTerm, filters = {}) {
  try {
    const q = query(
      collection(db, 'marketplace_listings'),
      where('status', '==', 'active'),
      where('published', '==', true)
    );

    const querySnapshot = await getDocs(q);
    let results = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Text search
    const term = searchTerm.toLowerCase();
    results = results.filter((listing) => {
      return (
        listing.title.toLowerCase().includes(term) ||
        listing.description.toLowerCase().includes(term) ||
        (listing.tags && listing.tags.some((tag) => tag.toLowerCase().includes(term)))
      );
    });

    // Apply filters
    if (filters.contentType) {
      results = results.filter((listing) => listing.contentType === filters.contentType);
    }

    if (filters.maxPrice) {
      results = results.filter((listing) => listing.price <= filters.maxPrice);
    }

    if (filters.minPrice) {
      results = results.filter((listing) => listing.price >= filters.minPrice);
    }

    if (filters.minRating) {
      results = results.filter((listing) => listing.rating >= filters.minRating);
    }

    if (filters.currency) {
      results = results.filter((listing) => listing.currency === filters.currency);
    }

    // Sort
    if (filters.sortBy === 'price_asc') {
      results.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      results.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'newest') {
      results.sort((a, b) => b.createdAt - a.createdAt);
    }

    return results;
  } catch (error) {
    console.error('Error searching marketplace:', error);
    throw error;
  }
}

/**
 * Get trending marketplace listings
 */
export async function getTrendingMarketplaceListings(limit_count = 10) {
  try {
    const q = query(
      collection(db, 'marketplace_listings'),
      where('status', '==', 'active'),
      where('published', '==', true),
      orderBy('sales', 'desc'),
      limit(limit_count)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching trending listings:', error);
    throw error;
  }
}

// ===== PURCHASES & TRANSACTIONS =====

/**
 * Purchase a marketplace listing
 */
export async function purchaseMarketplaceListing(listingId, buyerId) {
  try {
    const listing = await getMarketplaceListing(listingId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    const purchase = {
      listingId,
      contentId: listing.contentId,
      contentType: listing.contentType,
      buyer: buyerId,
      seller: listing.seller,
      price: listing.price,
      currency: listing.currency,
      appliedDiscount: listing.discountPercentage || 0,
      finalPrice: listing.price * (1 - (listing.discountPercentage || 0) / 100),
      status: 'completed', // 'pending', 'completed', 'refunded'
      purchasedAt: serverTimestamp(),
      accessGrantedAt: serverTimestamp(),
    };

    // Create purchase record
    const purchasesRef = collection(db, 'marketplace_purchases');
    const purchaseDocRef = await addDoc(purchasesRef, purchase);

    // Update listing stats
    const listingRef = doc(db, 'marketplace_listings', listingId);
    const updatedListing = await getMarketplaceListing(listingId);
    await updateDoc(listingRef, {
      sales: (updatedListing.sales || 0) + 1,
      revenue: (updatedListing.revenue || 0) + purchase.finalPrice,
    });

    // Update seller earnings
    const sellerEarningsRef = collection(db, 'seller_earnings');
    const sellerQuery = query(
      sellerEarningsRef,
      where('seller', '==', listing.seller),
      where('listingId', '==', listingId)
    );

    const existingEarnings = await getDocs(sellerQuery);
    if (!existingEarnings.empty) {
      const earningsDoc = existingEarnings.docs[0];
      await updateDoc(earningsDoc.ref, {
        totalEarnings: (earningsDoc.data().totalEarnings || 0) + purchase.finalPrice,
        salesCount: (earningsDoc.data().salesCount || 0) + 1,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(sellerEarningsRef, {
        seller: listing.seller,
        listingId,
        contentType: listing.contentType,
        totalEarnings: purchase.finalPrice,
        salesCount: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return { id: purchaseDocRef.id, ...purchase };
  } catch (error) {
    console.error('Error purchasing marketplace listing:', error);
    throw error;
  }
}

/**
 * Get purchase history for a user
 */
export async function getUserPurchaseHistory(userId) {
  try {
    const q = query(
      collection(db, 'marketplace_purchases'),
      where('buyer', '==', userId),
      orderBy('purchasedAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching user purchase history:', error);
    throw error;
  }
}

/**
 * Check if user has purchased a listing
 */
export async function hasUserPurchasedListing(userId, listingId) {
  try {
    const q = query(
      collection(db, 'marketplace_purchases'),
      where('buyer', '==', userId),
      where('listingId', '==', listingId),
      where('status', '==', 'completed')
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking purchase:', error);
    throw error;
  }
}

/**
 * Refund a marketplace purchase
 */
export async function refundMarketplacePurchase(purchaseId) {
  try {
    const purchaseRef = doc(db, 'marketplace_purchases', purchaseId);
    const purchaseSnap = await getDoc(purchaseRef);

    if (!purchaseSnap.exists()) {
      throw new Error('Purchase not found');
    }

    const purchase = purchaseSnap.data();

    // Update purchase status
    await updateDoc(purchaseRef, {
      status: 'refunded',
      refundedAt: serverTimestamp(),
    });

    // Update listing stats
    const listingRef = doc(db, 'marketplace_listings', purchase.listingId);
    const listing = await getMarketplaceListing(purchase.listingId);
    await updateDoc(listingRef, {
      sales: Math.max(0, (listing.sales || 0) - 1),
      revenue: Math.max(0, (listing.revenue || 0) - purchase.finalPrice),
    });

    // Update seller earnings
    const sellerEarningsRef = collection(db, 'seller_earnings');
    const sellerQuery = query(
      sellerEarningsRef,
      where('seller', '==', purchase.seller),
      where('listingId', '==', purchase.listingId)
    );

    const existingEarnings = await getDocs(sellerQuery);
    if (!existingEarnings.empty) {
      const earningsDoc = existingEarnings.docs[0];
      await updateDoc(earningsDoc.ref, {
        totalEarnings: Math.max(0, (earningsDoc.data().totalEarnings || 0) - purchase.finalPrice),
        salesCount: Math.max(0, (earningsDoc.data().salesCount || 0) - 1),
        updatedAt: serverTimestamp(),
      });
    }

    return true;
  } catch (error) {
    console.error('Error refunding purchase:', error);
    throw error;
  }
}

// ===== SELLER MANAGEMENT =====

/**
 * Get seller earnings and statistics
 */
export async function getSellerEarningsStats(sellerId) {
  try {
    const q = query(
      collection(db, 'seller_earnings'),
      where('seller', '==', sellerId)
    );

    const querySnapshot = await getDocs(q);
    const earnings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const totalEarnings = earnings.reduce((sum, e) => sum + (e.totalEarnings || 0), 0);
    const totalSales = earnings.reduce((sum, e) => sum + (e.salesCount || 0), 0);

    return {
      totalEarnings,
      totalSales,
      itemsCount: earnings.length,
      earnings,
    };
  } catch (error) {
    console.error('Error fetching seller earnings:', error);
    throw error;
  }
}

/**
 * Get seller dashboard data
 */
export async function getSellerDashboardData(sellerId) {
  try {
    const listings = await getListingsBySeller(sellerId);
    const earnings = await getSellerEarningsStats(sellerId);

    // Calculate monthly earnings
    const purchasesQuery = query(
      collection(db, 'marketplace_purchases'),
      where('seller', '==', sellerId)
    );
    const purchasesSnap = await getDocs(purchasesQuery);
    const purchases = purchasesSnap.docs.map((doc) => doc.data());

    const monthlyEarnings = {};
    purchases.forEach((purchase) => {
      const date = new Date(purchase.purchasedAt.toDate());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyEarnings[monthKey] = (monthlyEarnings[monthKey] || 0) + purchase.finalPrice;
    });

    return {
      listings,
      earnings,
      monthlyEarnings,
      totalListings: listings.length,
      activeListings: listings.filter((l) => l.status === 'active').length,
    };
  } catch (error) {
    console.error('Error fetching seller dashboard data:', error);
    throw error;
  }
}

// ===== RATINGS & REVIEWS =====

/**
 * Rate a marketplace listing
 */
export async function rateMarketplaceListing(listingId, buyerId, rating, review = '') {
  try {
    const ratingData = {
      listingId,
      buyerId,
      rating, // 1-5
      review,
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, 'marketplace_ratings'), ratingData);

    // Update listing rating
    const ratingsQuery = query(
      collection(db, 'marketplace_ratings'),
      where('listingId', '==', listingId)
    );
    const ratingsDocs = await getDocs(ratingsQuery);
    const ratings = ratingsDocs.docs.map((doc) => doc.data().rating);
    const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    const listingRef = doc(db, 'marketplace_listings', listingId);
    await updateDoc(listingRef, {
      rating: Math.round(averageRating * 10) / 10,
      ratingCount: ratings.length,
    });

    return ratingData;
  } catch (error) {
    console.error('Error rating marketplace listing:', error);
    throw error;
  }
}

/**
 * Get marketplace listing ratings and reviews
 */
export async function getMarketplaceListingRatings(listingId) {
  try {
    const q = query(
      collection(db, 'marketplace_ratings'),
      where('listingId', '==', listingId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching marketplace ratings:', error);
    throw error;
  }
}
