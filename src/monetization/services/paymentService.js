import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  increment,
  query,
  where,
  orderBy
} from '../../firebase/firebaseConfig';
import { db } from '../../firebase/firebaseConfig';

// Initialize payment (create Stripe payment intent)
export async function createPaymentIntent(userId, productId, amount, currency = 'USD') {
  try {
    // In production, call your backend to create Stripe intent
    // For now, return mock response
    return {
      clientSecret: `pi_test_${Date.now()}`,
      paymentId: `py_${Date.now()}`,
      amount,
      currency
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

// Record transaction in Firestore
export async function recordTransaction(transactionData) {
  try {
    const txnRef = collection(db, 'transactions');
    const docRef = await addDoc(txnRef, {
      ...transactionData,
      createdAt: new Date().toISOString(),
      status: 'completed'
    });

    // Update user monetization record
    if (transactionData.coinsSpent) {
      await subtractCoins(transactionData.userId, transactionData.coinsSpent);
    }

    // Record creator earnings if applicable
    if (transactionData.creatorId && transactionData.amount) {
      await recordCreatorEarnings(
        transactionData.creatorId,
        transactionData.itemType || 'quiz',
        (transactionData.amount * 0.7) / 100 // Creator gets 70%
      );
    }

    return docRef.id;
  } catch (error) {
    console.error('Error recording transaction:', error);
    throw error;
  }
}

// Get transaction history
export async function getTransaction(transactionId) {
  try {
    const txnRef = doc(db, 'transactions', transactionId);
    const snap = await getDoc(txnRef);
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
}

export async function getUserTransactionHistory(userId, limit = 50) {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snap = await getDocs(q);
    return snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
}

// Coin management
export async function getUserCoins(userId) {
  try {
    const userMonRef = doc(db, 'user_monetization', userId);
    const snap = await getDoc(userMonRef);

    if (!snap.exists()) {
      return 0;
    }

    return snap.data().coins || 0;
  } catch (error) {
    console.error('Error fetching user coins:', error);
    return 0;
  }
}

export async function addCoins(userId, amount, reason = 'bonus') {
  try {
    const userMonRef = doc(db, 'user_monetization', userId);
    const snap = await getDoc(userMonRef);

    if (!snap.exists()) {
      // Create new record
      await setDoc(userMonRef, {
        userId,
        coins: amount,
        totalCoinsEarned: amount,
        totalCoinsSpent: 0,
        isCreator: false,
        createdAt: new Date().toISOString()
      });
    } else {
      // Update existing
      await updateDoc(userMonRef, {
        coins: increment(amount),
        totalCoinsEarned: increment(amount)
      });
    }

    return true;
  } catch (error) {
    console.error('Error adding coins:', error);
    throw error;
  }
}

export async function subtractCoins(userId, amount, reason = 'purchase') {
  try {
    const coins = await getUserCoins(userId);

    if (coins < amount) {
      throw new Error('Insufficient coins');
    }

    const userMonRef = doc(db, 'user_monetization', userId);
    await updateDoc(userMonRef, {
      coins: increment(-amount),
      totalCoinsSpent: increment(amount)
    });

    return true;
  } catch (error) {
    console.error('Error subtracting coins:', error);
    throw error;
  }
}

// Creator earnings
export async function recordCreatorEarnings(creatorId, contentType, amount) {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const payoutRef = doc(db, 'creator_payouts', `${creatorId}_${currentMonth}`);

    const snap = await getDoc(payoutRef);

    if (snap.exists()) {
      const data = snap.data();
      const earningsKey = `earnings.from${contentType.charAt(0).toUpperCase() + contentType.slice(1)}s`;

      await updateDoc(payoutRef, {
        'earnings.total': increment(amount),
        [earningsKey]: increment(amount)
      });
    } else {
      await setDoc(payoutRef, {
        creatorId,
        month: currentMonth,
        earnings: {
          total: amount,
          fromQuizzes: contentType === 'quiz' ? amount : 0,
          fromPuzzles: contentType === 'puzzle' ? amount : 0,
          fromCourses: contentType === 'course' ? amount : 0
        },
        transactions: [],
        payout: {
          status: 'pending',
          amount: amount,
          method: 'bank_transfer',
          scheduledDate: null
        }
      });
    }

    return true;
  } catch (error) {
    console.error('Error recording creator earnings:', error);
    throw error;
  }
}

export async function getCreatorPayouts(creatorId, months = 12) {
  try {
    const q = query(
      collection(db, 'creator_payouts'),
      where('creatorId', '==', creatorId),
      orderBy('month', 'desc')
    );

    const snap = await getDocs(q);
    return snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .slice(0, months);
  } catch (error) {
    console.error('Error fetching creator payouts:', error);
    throw error;
  }
}

// Verify payment
export async function verifyPayment(paymentId) {
  try {
    // In production, verify with Stripe
    const transaction = await collection(db, 'transactions')
      .where('paymentId', '==', paymentId)
      .get();

    return transaction.docs.length > 0;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

// Discount codes
export async function applyDiscountCode(code, amount) {
  try {
    // In production, validate against backend
    const discounts = {
      'WELCOME10': 10,
      'SUMMER20': 20,
      'FRIEND5': 5
    };

    const discountPercent = discounts[code] || 0;
    const discount = (amount * discountPercent) / 100;

    return {
      valid: discountPercent > 0,
      discountPercent,
      discountAmount: discount,
      finalAmount: amount - discount
    };
  } catch (error) {
    console.error('Error applying discount code:', error);
    throw error;
  }
}

// Refund transaction
export async function refundTransaction(transactionId) {
  try {
    const txnRef = doc(db, 'transactions', transactionId);
    const txnSnap = await getDoc(txnRef);

    if (!txnSnap.exists()) {
      throw new Error('Transaction not found');
    }

    const txn = txnSnap.data();

    // Update transaction
    await updateDoc(txnRef, {
      status: 'refunded',
      refundedAt: new Date().toISOString()
    });

    // Return coins to user if it was a coin purchase
    if (txn.coinsSpent && txn.coinsSpent > 0) {
      await addCoins(txn.userId, txn.coinsSpent, 'refund');
    }

    return true;
  } catch (error) {
    console.error('Error refunding transaction:', error);
    throw error;
  }
}
