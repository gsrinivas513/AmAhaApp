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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';

/**
 * Moderation Service - Content safety and review system
 * Manages content submission, approval workflow, and policy enforcement
 */

// ===== CONTENT SUBMISSION =====

/**
 * Submit content for review/moderation
 * @param {Object} submissionData - { contentId, contentType, submitter, title, description, contentUrl }
 */
export async function submitContentForReview(submissionData) {
  try {
    const submission = {
      contentId: submissionData.contentId,
      contentType: submissionData.contentType, // 'quiz', 'puzzle', 'story', 'arts', 'studies', 'marketplace_listing'
      submitter: submissionData.submitter,
      submitterName: submissionData.submitterName || 'Unknown',
      title: submissionData.title,
      description: submissionData.description,
      contentUrl: submissionData.contentUrl,
      status: 'pending', // 'pending', 'approved', 'rejected', 'needs_revision'
      submittedAt: serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null,
      reviewNotes: '',
      flags: submissionData.flags || [],
      autoScoreResult: null,
    };

    const submissionsRef = collection(db, 'pending_content');
    const docRef = await addDoc(submissionsRef, submission);

    // Run auto-moderation scan
    const autoScore = await runAutoModerationScan(submissionData);
    await updateDoc(docRef, { autoScoreResult: autoScore });

    return { id: docRef.id, ...submission };
  } catch (error) {
    console.error('Error submitting content for review:', error);
    throw error;
  }
}

/**
 * Run automated content moderation scan
 * Checks for prohibited content, inappropriate language, etc.
 */
export async function runAutoModerationScan(contentData) {
  try {
    const PROHIBITED_WORDS = [
      'violence', 'hate', 'discrimination', 'harassment', 'abuse', 'explicit'
    ];

    const content = `${contentData.title} ${contentData.description}`.toLowerCase();
    const foundFlags = PROHIBITED_WORDS.filter((word) => content.includes(word));

    const score = {
      riskLevel: foundFlags.length === 0 ? 'low' : foundFlags.length < 3 ? 'medium' : 'high',
      flaggedWords: foundFlags,
      timestamp: new Date().toISOString(),
      requiresManualReview: foundFlags.length > 0,
    };

    return score;
  } catch (error) {
    console.error('Error running auto moderation scan:', error);
    throw error;
  }
}

/**
 * Get pending content submissions
 */
export async function getPendingSubmissions(contentType = null, limit_count = 20) {
  try {
    let q;

    if (contentType) {
      q = query(
        collection(db, 'pending_content'),
        where('contentType', '==', contentType),
        where('status', '==', 'pending'),
        orderBy('submittedAt', 'desc')
      );
    } else {
      q = query(
        collection(db, 'pending_content'),
        where('status', '==', 'pending'),
        orderBy('submittedAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching pending submissions:', error);
    throw error;
  }
}

/**
 * Get all moderation logs
 */
export async function getModerationLogs(filters = {}) {
  try {
    const q = query(
      collection(db, 'pending_content'),
      orderBy('submittedAt', 'desc')
    );

    let logs = (await getDocs(q)).docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Apply filters
    if (filters.status) {
      logs = logs.filter((log) => log.status === filters.status);
    }

    if (filters.contentType) {
      logs = logs.filter((log) => log.contentType === filters.contentType);
    }

    if (filters.riskLevel && filters.riskLevel !== 'all') {
      logs = logs.filter((log) => log.autoScoreResult?.riskLevel === filters.riskLevel);
    }

    if (filters.reviewer) {
      logs = logs.filter((log) => log.reviewedBy === filters.reviewer);
    }

    return logs;
  } catch (error) {
    console.error('Error fetching moderation logs:', error);
    throw error;
  }
}

// ===== MODERATION ACTIONS =====

/**
 * Approve content
 */
export async function approveContent(submissionId, moderatorId) {
  try {
    const submissionRef = doc(db, 'pending_content', submissionId);
    const submissionSnap = await getDoc(submissionRef);

    if (!submissionSnap.exists()) {
      throw new Error('Submission not found');
    }

    const submission = submissionSnap.data();

    // Update submission status
    await updateDoc(submissionRef, {
      status: 'approved',
      reviewedAt: serverTimestamp(),
      reviewedBy: moderatorId,
      approvedAt: serverTimestamp(),
    });

    // Update content visibility based on type
    const contentRef = doc(db, getContentCollectionName(submission.contentType), submission.contentId);
    try {
      await updateDoc(contentRef, {
        published: true,
        approved: true,
        approvedAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn(`Could not update ${submission.contentType} document:`, e);
    }

    // Log moderation action
    await logModerationAction({
      submissionId,
      action: 'approved',
      moderatorId,
      contentType: submission.contentType,
    });

    return true;
  } catch (error) {
    console.error('Error approving content:', error);
    throw error;
  }
}

/**
 * Reject content with reason
 */
export async function rejectContent(submissionId, moderatorId, reason, notes = '') {
  try {
    const submissionRef = doc(db, 'pending_content', submissionId);
    const submissionSnap = await getDoc(submissionRef);

    if (!submissionSnap.exists()) {
      throw new Error('Submission not found');
    }

    const submission = submissionSnap.data();

    // Update submission status
    await updateDoc(submissionRef, {
      status: 'rejected',
      reviewedAt: serverTimestamp(),
      reviewedBy: moderatorId,
      rejectionReason: reason,
      reviewNotes: notes,
      rejectedAt: serverTimestamp(),
    });

    // Update content visibility
    const contentRef = doc(db, getContentCollectionName(submission.contentType), submission.contentId);
    try {
      await updateDoc(contentRef, {
        published: false,
        approved: false,
      });
    } catch (e) {
      console.warn(`Could not update ${submission.contentType} document:`, e);
    }

    // Log moderation action
    await logModerationAction({
      submissionId,
      action: 'rejected',
      moderatorId,
      reason,
      contentType: submission.contentType,
    });

    return true;
  } catch (error) {
    console.error('Error rejecting content:', error);
    throw error;
  }
}

/**
 * Request revision for content
 */
export async function requestContentRevision(submissionId, moderatorId, revisionNotes) {
  try {
    const submissionRef = doc(db, 'pending_content', submissionId);

    await updateDoc(submissionRef, {
      status: 'needs_revision',
      reviewedAt: serverTimestamp(),
      reviewedBy: moderatorId,
      reviewNotes: revisionNotes,
      revisionsRequestedAt: serverTimestamp(),
    });

    // Log moderation action
    await logModerationAction({
      submissionId,
      action: 'revision_requested',
      moderatorId,
      contentType: (await getDoc(submissionRef)).data().contentType,
    });

    return true;
  } catch (error) {
    console.error('Error requesting revision:', error);
    throw error;
  }
}

/**
 * Flag content as inappropriate
 */
export async function flagContent(contentId, contentType, reporterId, reason) {
  try {
    const flagData = {
      contentId,
      contentType,
      reporterId,
      reason,
      status: 'pending', // 'pending', 'reviewed', 'resolved'
      reportedAt: serverTimestamp(),
      severity: calculateFlagSeverity(reason),
    };

    const flagsRef = collection(db, 'content_flags');
    const docRef = await addDoc(flagsRef, flagData);

    // Get submission for this content
    const submissionsQuery = query(
      collection(db, 'pending_content'),
      where('contentId', '==', contentId),
      where('contentType', '==', contentType)
    );

    const submissions = await getDocs(submissionsQuery);
    if (!submissions.empty) {
      const submissionRef = submissions.docs[0].ref;
      const submission = submissions.docs[0].data();

      // Add flag to submission
      const flags = submission.flags || [];
      flags.push({ id: docRef.id, reason, severity: flagData.severity });

      await updateDoc(submissionRef, {
        flags,
        flagCount: flags.length,
      });
    }

    return { id: docRef.id, ...flagData };
  } catch (error) {
    console.error('Error flagging content:', error);
    throw error;
  }
}

/**
 * Get all flags for a content item
 */
export async function getContentFlags(contentId, contentType) {
  try {
    const q = query(
      collection(db, 'content_flags'),
      where('contentId', '==', contentId),
      where('contentType', '==', contentType)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching content flags:', error);
    throw error;
  }
}

/**
 * Review and resolve flagged content
 */
export async function resolveFlaggedContent(flagId, resolution, moderatorNotes = '') {
  try {
    const flagRef = doc(db, 'content_flags', flagId);
    const flagSnap = await getDoc(flagRef);

    if (!flagSnap.exists()) {
      throw new Error('Flag not found');
    }

    const flag = flagSnap.data();

    await updateDoc(flagRef, {
      status: 'resolved',
      resolution, // 'dismissed', 'action_taken', 'content_removed'
      resolvedAt: serverTimestamp(),
      moderatorNotes,
    });

    // If action taken, remove content
    if (resolution === 'content_removed') {
      const contentRef = doc(db, getContentCollectionName(flag.contentType), flag.contentId);
      try {
        await updateDoc(contentRef, {
          published: false,
          removed: true,
          removalReason: 'Community flag violation',
        });
      } catch (e) {
        console.warn(`Could not update ${flag.contentType} document:`, e);
      }

      // Ban creator if multiple violations
      const creatorFlags = query(
        collection(db, 'content_flags'),
        where('reporterId', '==', flag.reporterId),
        where('status', '==', 'resolved')
      );

      const flagCount = (await getDocs(creatorFlags)).size;
      if (flagCount >= 3) {
        await suspendCreator(flag.reporterId, 'Multiple content violations');
      }
    }

    return true;
  } catch (error) {
    console.error('Error resolving flagged content:', error);
    throw error;
  }
}

// ===== USER MODERATION =====

/**
 * Suspend a creator account
 */
export async function suspendCreator(userId, reason, duration = 30) {
  try {
    const suspensionData = {
      userId,
      reason,
      suspendedAt: serverTimestamp(),
      duration, // in days
      expiryDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
      status: 'active',
    };

    const suspensionsRef = collection(db, 'creator_suspensions');
    const docRef = await addDoc(suspensionsRef, suspensionData);

    // Update user profile
    const userRef = doc(db, 'users', userId);
    try {
      await updateDoc(userRef, {
        suspended: true,
        suspensionReason: reason,
        suspensionExpiry: suspensionData.expiryDate,
      });
    } catch (e) {
      console.warn('Could not update user profile:', e);
    }

    // Log action
    await logModerationAction({
      action: 'creator_suspended',
      targetUserId: userId,
      reason,
      duration,
    });

    return { id: docRef.id, ...suspensionData };
  } catch (error) {
    console.error('Error suspending creator:', error);
    throw error;
  }
}

/**
 * Unsuspend a creator account
 */
export async function unsuspendCreator(userId) {
  try {
    const suspensionQuery = query(
      collection(db, 'creator_suspensions'),
      where('userId', '==', userId),
      where('status', '==', 'active')
    );

    const suspensions = await getDocs(suspensionQuery);
    if (!suspensions.empty) {
      const suspensionRef = suspensions.docs[0].ref;
      await updateDoc(suspensionRef, { status: 'lifted' });
    }

    // Update user profile
    const userRef = doc(db, 'users', userId);
    try {
      await updateDoc(userRef, {
        suspended: false,
        suspensionReason: null,
      });
    } catch (e) {
      console.warn('Could not update user profile:', e);
    }

    return true;
  } catch (error) {
    console.error('Error unsuspending creator:', error);
    throw error;
  }
}

// ===== MODERATION POLICIES & RULES =====

/**
 * Create content moderation policy
 */
export async function createModerationPolicy(policyData) {
  try {
    const policy = {
      name: policyData.name,
      description: policyData.description,
      contentTypes: policyData.contentTypes, // array of content types it applies to
      rules: policyData.rules, // array of rule objects
      enabled: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const policiesRef = collection(db, 'moderation_policies');
    const docRef = await addDoc(policiesRef, policy);
    return { id: docRef.id, ...policy };
  } catch (error) {
    console.error('Error creating moderation policy:', error);
    throw error;
  }
}

/**
 * Get all moderation policies
 */
export async function getModerationPolicies() {
  try {
    const q = query(
      collection(db, 'moderation_policies'),
      where('enabled', '==', true)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching moderation policies:', error);
    throw error;
  }
}

// ===== HELPER FUNCTIONS =====

/**
 * Get collection name for content type
 */
function getContentCollectionName(contentType) {
  const collectionMap = {
    quiz: 'quizzes',
    puzzle: 'puzzles',
    story: 'stories',
    arts: 'arts_projects',
    studies: 'studies',
    marketplace_listing: 'marketplace_listings',
  };

  return collectionMap[contentType] || 'content';
}

/**
 * Calculate flag severity
 */
function calculateFlagSeverity(reason) {
  const severityMap = {
    violence: 'critical',
    hate_speech: 'critical',
    sexual_content: 'critical',
    copyright: 'high',
    misinformation: 'high',
    spam: 'low',
    inappropriate_content: 'medium',
  };

  return severityMap[reason] || 'medium';
}

/**
 * Log moderation action
 */
export async function logModerationAction(actionData) {
  try {
    const action = {
      ...actionData,
      timestamp: serverTimestamp(),
    };

    const logsRef = collection(db, 'moderation_logs');
    await addDoc(logsRef, action);

    return true;
  } catch (error) {
    console.error('Error logging moderation action:', error);
    throw error;
  }
}

/**
 * Get moderation statistics
 */
export async function getModerationStats() {
  try {
    const submissions = await getDocs(collection(db, 'pending_content'));
    const flags = await getDocs(collection(db, 'content_flags'));
    const suspensions = await getDocs(collection(db, 'creator_suspensions'));

    const pendingCount = submissions.docs.filter((doc) => doc.data().status === 'pending').length;
    const approvedCount = submissions.docs.filter((doc) => doc.data().status === 'approved').length;
    const rejectedCount = submissions.docs.filter((doc) => doc.data().status === 'rejected').length;
    const flagsCount = flags.size;
    const suspensionsCount = suspensions.size;

    return {
      pendingSubmissions: pendingCount,
      approvedSubmissions: approvedCount,
      rejectedSubmissions: rejectedCount,
      totalFlags: flagsCount,
      activeSuspensions: suspensionsCount,
      approvalRate: approvedCount / (approvedCount + rejectedCount) || 0,
    };
  } catch (error) {
    console.error('Error fetching moderation stats:', error);
    throw error;
  }
}
