// src/services/socialMedia/PlatformIntegrations.js
/**
 * Platform Integration Templates
 * These are prepared for future API integrations
 * Do NOT auto-publish without admin approval
 */

class PlatformIntegrations {
  // Instagram / Facebook (Meta)
  static instagramConfig = {
    name: 'Instagram',
    endpoint: 'https://graph.instagram.com/v18.0',
    requiredAuth: ['accessToken', 'businessAccountId'],
    capabilities: {
      postCarousel: true,
      postReel: true,
      postImage: true,
      postVideo: false,
      stories: false,
    },
    postTypes: ['image', 'carousel', 'reel'],
    maxImageSize: '8MB',
    supportedFormats: ['jpg', 'png'],
    notes: 'Use Meta Business Suite for scheduling',
  };

  static facebookConfig = {
    name: 'Facebook',
    endpoint: 'https://graph.facebook.com/v18.0',
    requiredAuth: ['accessToken', 'pageId'],
    capabilities: {
      postLink: true,
      postVideo: true,
      postImage: true,
      postText: true,
      events: true,
    },
    postTypes: ['image', 'video', 'link', 'text'],
    maxImageSize: '10MB',
    supportedFormats: ['jpg', 'png', 'gif'],
    notes: 'Best for community engagement and reach',
  };

  // Twitter / X
  static twitterConfig = {
    name: 'X (Twitter)',
    endpoint: 'https://api.twitter.com/2',
    requiredAuth: ['bearerToken', 'userId'],
    capabilities: {
      tweet: true,
      reply: true,
      retweet: true,
      media: true,
    },
    maxPostLength: 280,
    maxMediaAttachments: 4,
    supportedFormats: ['jpg', 'png', 'gif', 'webp'],
    notes: 'Great for real-time engagement and announcements',
  };

  // LinkedIn
  static linkedinConfig = {
    name: 'LinkedIn',
    endpoint: 'https://api.linkedin.com/v2',
    requiredAuth: ['accessToken', 'organizationId'],
    capabilities: {
      postArticle: true,
      postImage: true,
      postVideo: true,
      postText: true,
      pollPost: true,
    },
    postTypes: ['text', 'image', 'video', 'article', 'poll'],
    maxImageSize: '10MB',
    supportedFormats: ['jpg', 'png'],
    notes: 'Professional audience - use professional tone',
  };

  /**
   * Prepare Instagram API call (not executed - for reference)
   */
  static prepareInstagramPost(post) {
    return {
      endpoint: `${this.instagramConfig.endpoint}/me/media`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer {ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: {
        image_url: post.imageUrl,
        caption: post.caption,
        user_tags: [], // Optional
        location_id: null, // Optional
      },
      note: 'REQUIRES ADMIN APPROVAL BEFORE PUBLISHING',
    };
  }

  /**
   * Prepare Facebook API call (not executed - for reference)
   */
  static prepareFacebookPost(post) {
    return {
      endpoint: `${this.facebookConfig.endpoint}/{PAGE_ID}/feed`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer {ACCESS_TOKEN}`,
      },
      data: {
        message: post.caption,
        link: post.ctaUrl,
        picture: post.imageUrl,
        caption: post.cta,
      },
      note: 'REQUIRES ADMIN APPROVAL BEFORE PUBLISHING',
    };
  }

  /**
   * Prepare Twitter API call (not executed - for reference)
   */
  static prepareTwitterPost(post) {
    return {
      endpoint: `${this.twitterConfig.endpoint}/tweets`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer {BEARER_TOKEN}`,
      },
      data: {
        text: post.caption,
        media: {
          media_ids: [], // Must upload media first
        },
      },
      note: 'REQUIRES ADMIN APPROVAL BEFORE PUBLISHING',
    };
  }

  /**
   * Prepare LinkedIn API call (not executed - for reference)
   */
  static prepareLinkedInPost(post) {
    return {
      endpoint: `${this.linkedinConfig.endpoint}/posts`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer {ACCESS_TOKEN}`,
        'X-Restli-Protocol-Version': '2.0.0',
      },
      data: {
        author: 'urn:li:organization:{ORGANIZATION_ID}',
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.share.v1': {
            shareCommentary: {
              text: post.caption,
            },
            shareMediaCategory: 'IMAGE',
            media: [
              {
                status: 'READY',
                media: post.imageUrl,
                title: {
                  text: post.title || 'Learning Content',
                },
              },
            ],
          },
        },
        visibility: {
          'com.linkedin.ugc.share.v1': {
            shareAudience: {
              visibilityType: 'PUBLIC',
            },
          },
        },
      },
      note: 'REQUIRES ADMIN APPROVAL BEFORE PUBLISHING',
    };
  }

  /**
   * Get all platform configs
   */
  static getAllPlatforms() {
    return {
      instagram: this.instagramConfig,
      facebook: this.facebookConfig,
      twitter: this.twitterConfig,
      linkedin: this.linkedinConfig,
    };
  }

  /**
   * Integration status checker
   */
  static getIntegrationStatus() {
    return {
      instagram: {
        name: 'Instagram',
        status: 'not-configured',
        setupUrl: '/admin/integrations/instagram',
        requiredFields: ['accessToken', 'businessAccountId'],
      },
      facebook: {
        name: 'Facebook',
        status: 'not-configured',
        setupUrl: '/admin/integrations/facebook',
        requiredFields: ['accessToken', 'pageId'],
      },
      twitter: {
        name: 'X (Twitter)',
        status: 'not-configured',
        setupUrl: '/admin/integrations/twitter',
        requiredFields: ['bearerToken', 'userId'],
      },
      linkedin: {
        name: 'LinkedIn',
        status: 'not-configured',
        setupUrl: '/admin/integrations/linkedin',
        requiredFields: ['accessToken', 'organizationId'],
      },
    };
  }

  /**
   * Validation rules for each platform
   */
  static validatePostForPlatform(post, platform) {
    const errors = [];

    switch (platform) {
      case 'twitter':
        if (post.caption.length > 280) {
          errors.push('Twitter post exceeds 280 characters');
        }
        break;
      case 'instagram':
        if (!post.imageUrl && !post.imagePrompt) {
          errors.push('Instagram requires an image');
        }
        break;
      case 'facebook':
        if (!post.caption || post.caption.length < 10) {
          errors.push('Facebook post needs meaningful content');
        }
        break;
      case 'linkedin':
        if (post.caption.length < 50) {
          errors.push('LinkedIn content should be more detailed');
        }
        break;
    }

    return errors;
  }
}

export default PlatformIntegrations;
