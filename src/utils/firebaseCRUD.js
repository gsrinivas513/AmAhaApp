/**
 * Firestore CRUD Helper
 * Generic CRUD operations for Firestore collections
 * Reduces duplication across services
 * 
 * @module utils/firebaseCRUD
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Firestore CRUD Helper Class
 * Provides generic CRUD operations for any collection
 */
export class FirebaseCRUD {
  /**
   * Create a new document
   * @param {string} collectionPath - Collection path
   * @param {object} data - Document data
   * @param {string} docId - Optional document ID (if not provided, auto-generated)
   * @returns {Promise<string>} Document ID
   */
  static async create(collectionPath, data, docId = null) {
    try {
      const collectionRef = collection(db, collectionPath);
      
      if (docId) {
        const docRef = doc(collectionRef, docId);
        await setDoc(docRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return docId;
      } else {
        const docRef = await addDoc(collectionRef, {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return docRef.id;
      }
    } catch (e) {
      console.error(`[FirebaseCRUD] Error creating document in ${collectionPath}:`, e);
      throw e;
    }
  }

  /**
   * Read a single document
   * @param {string} collectionPath - Collection path
   * @param {string} docId - Document ID
   * @returns {Promise<object>} Document data with ID, or null if not found
   */
  static async read(collectionPath, docId) {
    try {
      const docRef = doc(db, collectionPath, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }

      return null;
    } catch (e) {
      console.error(
        `[FirebaseCRUD] Error reading document from ${collectionPath}/${docId}:`,
        e
      );
      throw e;
    }
  }

  /**
   * Read all documents in collection
   * @param {string} collectionPath - Collection path
   * @param {number} limitCount - Optional limit
   * @returns {Promise<Array>} Array of documents with IDs
   */
  static async readAll(collectionPath, limitCount = null) {
    try {
      let q = query(collection(db, collectionPath));
      if (limitCount) {
        q = query(collection(db, collectionPath), limit(limitCount));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      console.error(`[FirebaseCRUD] Error reading all from ${collectionPath}:`, e);
      throw e;
    }
  }

  /**
   * Read documents with query conditions
   * @param {string} collectionPath - Collection path
   * @param {Array} conditions - Query conditions [{ field, operator, value }]
   * @param {string} orderByField - Optional field to order by
   * @param {string} orderByDirection - 'asc' or 'desc'
   * @returns {Promise<Array>} Matching documents
   */
  static async readWithQuery(
    collectionPath,
    conditions = [],
    orderByField = null,
    orderByDirection = 'asc'
  ) {
    try {
      const collectionRef = collection(db, collectionPath);
      const constraints = [];

      // Add where conditions
      for (const condition of conditions) {
        const { field, operator = '==', value } = condition;
        constraints.push(where(field, operator, value));
      }

      // Add orderBy
      if (orderByField) {
        constraints.push(orderBy(orderByField, orderByDirection));
      }

      const q = query(collectionRef, ...constraints);
      const snapshot = await getDocs(q);

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      console.error(`[FirebaseCRUD] Error querying ${collectionPath}:`, e);
      throw e;
    }
  }

  /**
   * Update a document
   * @param {string} collectionPath - Collection path
   * @param {string} docId - Document ID
   * @param {object} data - Data to update (partial update)
   * @returns {Promise<void>}
   */
  static async update(collectionPath, docId, data) {
    try {
      const docRef = doc(db, collectionPath, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error(
        `[FirebaseCRUD] Error updating document in ${collectionPath}/${docId}:`,
        e
      );
      throw e;
    }
  }

  /**
   * Delete a document
   * @param {string} collectionPath - Collection path
   * @param {string} docId - Document ID
   * @returns {Promise<void>}
   */
  static async delete(collectionPath, docId) {
    try {
      const docRef = doc(db, collectionPath, docId);
      await deleteDoc(docRef);
    } catch (e) {
      console.error(
        `[FirebaseCRUD] Error deleting document from ${collectionPath}/${docId}:`,
        e
      );
      throw e;
    }
  }

  /**
   * Batch write multiple documents
   * @param {Array<object>} operations - Array of operations
   * @param {string} operations[].operation - 'set', 'update', or 'delete'
   * @param {string} operations[].path - Collection path
   * @param {string} operations[].docId - Document ID
   * @param {object} operations[].data - Document data (for set/update)
   * @returns {Promise<void>}
   */
  static async batchWrite(operations) {
    try {
      const batch = writeBatch(db);

      for (const op of operations) {
        const { operation, path, docId, data } = op;
        const docRef = doc(db, path, docId);

        if (operation === 'set') {
          batch.set(docRef, data);
        } else if (operation === 'update') {
          batch.update(docRef, data);
        } else if (operation === 'delete') {
          batch.delete(docRef);
        }
      }

      await batch.commit();
    } catch (e) {
      console.error('[FirebaseCRUD] Error executing batch write:', e);
      throw e;
    }
  }

  /**
   * Check if document exists
   * @param {string} collectionPath - Collection path
   * @param {string} docId - Document ID
   * @returns {Promise<boolean>}
   */
  static async exists(collectionPath, docId) {
    try {
      const docRef = doc(db, collectionPath, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (e) {
      console.error(
        `[FirebaseCRUD] Error checking existence in ${collectionPath}/${docId}:`,
        e
      );
      return false;
    }
  }

  /**
   * Count documents in collection
   * @param {string} collectionPath - Collection path
   * @returns {Promise<number>} Document count
   */
  static async count(collectionPath) {
    try {
      const snapshot = await getDocs(collection(db, collectionPath));
      return snapshot.size;
    } catch (e) {
      console.error(`[FirebaseCRUD] Error counting documents in ${collectionPath}:`, e);
      throw e;
    }
  }

  /**
   * Search documents by text in multiple fields
   * @param {string} collectionPath - Collection path
   * @param {string} searchText - Text to search for
   * @param {Array<string>} fields - Fields to search in
   * @returns {Promise<Array>} Matching documents
   */
  static async search(collectionPath, searchText, fields = []) {
    try {
      const allDocs = await this.readAll(collectionPath);
      const searchLower = searchText.toLowerCase();

      return allDocs.filter(doc => {
        return fields.some(field => {
          const value = doc[field];
          if (!value) return false;
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    } catch (e) {
      console.error(`[FirebaseCRUD] Error searching in ${collectionPath}:`, e);
      throw e;
    }
  }
}

export default FirebaseCRUD;
