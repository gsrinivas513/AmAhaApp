/**
 * Firestore Security Rules for Social Media Posts
 * 
 * Add this to your Firestore rules file:
 * 
 * match /social_posts/{document=**} {
 *   // Allow admins to read, write, and delete
 *   allow read, write, delete: if request.auth.token.isAdmin == true;
 *   
 *   // Allow admins only to publish
 *   allow update: if request.auth.token.isAdmin == true && 
 *                    resource.data.status in ['draft', 'approved', 'scheduled'] &&
 *                    request.resource.data.status == 'published';
 *   
 *   // Don't allow public reads
 *   allow read: if false;
 * }
 * 
 * Schema for social_posts collection:
 * {
 *   platform: string,              // 'instagram' | 'facebook' | 'twitter' | 'linkedin'
 *   caption: string,               // Full caption text
 *   hashtags: array<string>,       // Array of hashtags
 *   imageUrl: string,              // URL to image (from Cloudinary or content source)
 *   imagePrompt: string,           // AI prompt for image generation
 *   contentType: string,           // 'quiz' | 'puzzle' | 'feature' | 'challenge'
 *   contentId: string,             // Reference to original content (quiz ID or puzzle ID)
 *   contentCategory: string,       // 'kids' | 'programming' | 'general'
 *   cta: string,                   // Call to action text
 *   status: string,                // 'draft' | 'approved' | 'scheduled' | 'published' | 'deleted'
 *   createdAt: timestamp,          // Auto-set
 *   updatedAt: timestamp,          // Auto-set
 *   scheduledFor: timestamp,       // When to publish (if scheduled)
 *   timezone: string,              // Timezone for scheduling (e.g., 'PST', 'EST')
 *   publishedAt: timestamp,        // When it was published (if published)
 *   engagementMetrics: {
 *     likes: number,
 *     comments: number,
 *     shares: number,
 *     clicks: number,
 *     impressions: number,
 *     reach: number
 *   },
 *   notes: string,                 // Admin notes
 *   version: number                // For versioning if needed
 * }
 */

// This file is for documentation only
// Update your firestore.rules file with the rules above
