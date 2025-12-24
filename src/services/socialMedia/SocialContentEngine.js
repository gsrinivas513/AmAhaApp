// src/services/socialMedia/SocialContentEngine.js
import { db } from '../../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

class SocialContentEngine {
  // Platform configurations
  platformConfigs = {
    instagram: {
      maxCaptionLength: 2200,
      hashtags: 15,
      style: 'engaging',
      emojis: 2,
    },
    facebook: {
      maxCaptionLength: 63206,
      hashtags: 5,
      style: 'friendly',
      emojis: 2,
    },
    twitter: {
      maxCaptionLength: 280,
      hashtags: 3,
      style: 'concise',
      emojis: 1,
    },
    linkedin: {
      maxCaptionLength: 3000,
      hashtags: 5,
      style: 'professional',
      emojis: 1,
    },
  };

  // Content type templates
  contentTemplates = {
    quiz_promotion: {
      instagram: {
        templates: [
          "Ready for a challenge? 🧠 Test your {category} knowledge with our latest quiz. Can you score 10/10?\n\n{caption}\n\n{hashtags}",
          "Learning is fun! 🎓 Dive into our {category} quiz and discover how much you know.\n\n{caption}\n\n{hashtags}",
          "Think you're an expert in {category}? 📚 Prove it with our new quiz!\n\n{caption}\n\n{hashtags}",
        ],
        cta: "Play now - link in bio",
      },
      facebook: {
        templates: [
          "Hey friends! 👋\n\nTake our {category} quiz and see how you compare with others. It's fun, fast, and totally free!\n\n{caption}\n\n{hashtags}\n\nPlay Now!",
          "Learning should be fun! 🎉\n\nOur {category} quiz is designed to teach and entertain. Challenge yourself today!\n\n{caption}\n\n{hashtags}",
        ],
        cta: "Click here to play",
      },
      twitter: {
        templates: [
          "Test your {category} skills 🧠 Our quiz is quick, fun, and challenging. Ready? {hashtags}",
          "Learn something new today 📚 {category} quiz awaits! {hashtags}",
        ],
        cta: "Play now",
      },
      linkedin: {
        templates: [
          "Did you know learning is more effective when it's fun? 💡\n\nOur {category} content helps professionals stay sharp.\n\n{caption}\n\n{hashtags}",
        ],
        cta: "Learn more",
      },
    },
    puzzle_promotion: {
      instagram: {
        templates: [
          "Puzzle time! 🧩 Can you solve this {category} challenge? Try now!\n\n{caption}\n\n{hashtags}",
          "Brain training made fun 🎯 Our {category} puzzles keep you sharp.\n\n{caption}\n\n{hashtags}",
          "Love puzzles? 🤔 This {category} challenge is perfect for you!\n\n{caption}\n\n{hashtags}",
        ],
        cta: "Solve it - link in bio",
      },
      facebook: {
        templates: [
          "Solve our {category} puzzle and challenge your friends! 🧩\n\n{caption}\n\n{hashtags}\n\nStart solving!",
          "Daily puzzle challenge 🎯\n\n{caption}\n\nCan you solve today's {category} puzzle?\n\n{hashtags}",
        ],
        cta: "Solve the puzzle",
      },
      twitter: {
        templates: [
          "Daily {category} puzzle challenge 🧩 Can you solve it? {hashtags}",
          "Brain teaser alert! 🤔 {category} puzzle inside. {hashtags}",
        ],
        cta: "Try it now",
      },
      linkedin: {
        templates: [
          "Cognitive exercises are proven to improve productivity 🧠\n\nTry our {category} puzzles to keep your mind sharp.\n\n{caption}\n\n{hashtags}",
        ],
        cta: "Try free",
      },
    },
    daily_challenge: {
      instagram: {
        templates: [
          "Today's Challenge 🌟 Can you beat it?\n\n{caption}\n\n{hashtags}",
          "Rise to the challenge! 💪 Today's {category} task awaits.\n\n{caption}\n\n{hashtags}",
        ],
        cta: "Accept the challenge",
      },
      facebook: {
        templates: [
          "Daily Challenge Alert 🎯\n\n{caption}\n\nReady to compete with your friends?\n\n{hashtags}",
        ],
        cta: "Join now",
      },
      twitter: {
        templates: [
          "Today's Challenge 🎯 Think you can solve it? {hashtags}",
        ],
        cta: "Try now",
      },
      linkedin: {
        templates: [
          "Professional Development Challenge\n\n{caption}\n\n{hashtags}",
        ],
        cta: "Participate",
      },
    },
  };

  // Hashtag libraries
  hashtagLibraries = {
    kids: [
      '#KidsLearning',
      '#FunLearning',
      '#EarlyEducation',
      '#KidsQuiz',
      '#LearningThroughPlay',
      '#EducationalGames',
      '#SmartKids',
      '#KidsChallenge',
      '#BrainGames',
      '#InteractiveLearning',
    ],
    programming: [
      '#CodingChallenge',
      '#Programming',
      '#JavaQuiz',
      '#LearnToCode',
      '#CodeNewbie',
      '#WebDevelopment',
      '#SoftwareDevelopment',
      '#ProgrammingQuiz',
      '#DeveloperLife',
      '#TechSkills',
    ],
    general: [
      '#AmAha',
      '#Learning',
      '#Quiz',
      '#Puzzle',
      '#Challenge',
      '#Knowledge',
      '#SmartLearning',
      '#FunFacts',
      '#SkillBuilding',
      '#MindChallenge',
    ],
  };

  /**
   * Fetch latest quizzes from Firestore
   */
  async getLatestQuizzes(categoryId = null, limit_ = 5) {
    try {
      let q;
      if (categoryId) {
        q = query(
          collection(db, 'questions'),
          where('categoryId', '==', categoryId),
          orderBy('createdAt', 'desc'),
          limit(limit_)
        );
      } else {
        q = query(
          collection(db, 'questions'),
          orderBy('createdAt', 'desc'),
          limit(limit_)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'quiz',
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }
  }

  /**
   * Fetch latest puzzles from Firestore
   */
  async getLatestPuzzles(categoryId = null, limit_ = 5) {
    try {
      let q;
      if (categoryId) {
        q = query(
          collection(db, 'puzzles'),
          where('category', '==', categoryId),
          orderBy('createdAt', 'desc'),
          limit(limit_)
        );
      } else {
        q = query(
          collection(db, 'puzzles'),
          orderBy('createdAt', 'desc'),
          limit(limit_)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        type: 'puzzle',
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching puzzles:', error);
      return [];
    }
  }

  /**
   * Get category name by ID
   */
  async getCategoryName(categoryId) {
    try {
      const docRef = doc(db, 'categories', categoryId);
      const snap = await getDocs(collection(db, 'categories'));
      const found = snap.docs.find((d) => d.id === categoryId);
      return found ? found.data().label || found.data().name : 'General';
    } catch (error) {
      console.error('Error fetching category:', error);
      return 'General';
    }
  }

  /**
   * Determine content category (kids, programming, general)
   */
  determineContentCategory(category, content) {
    const categoryLower = category.toLowerCase();
    const contentLower = JSON.stringify(content).toLowerCase();

    if (
      categoryLower.includes('kids') ||
      categoryLower.includes('children') ||
      categoryLower.includes('preschool')
    ) {
      return 'kids';
    }

    if (
      categoryLower.includes('java') ||
      categoryLower.includes('python') ||
      categoryLower.includes('programming') ||
      categoryLower.includes('code') ||
      contentLower.includes('code') ||
      contentLower.includes('function')
    ) {
      return 'programming';
    }

    return 'general';
  }

  /**
   * Select appropriate hashtags based on content category
   */
  selectHashtags(contentCategory, platformConfig, customHashtags = []) {
    const library = this.hashtagLibraries[contentCategory] || this.hashtagLibraries.general;
    const maxHashtags = platformConfig.hashtags;

    // Combine custom and library hashtags
    const combined = [...new Set([...customHashtags, ...library])];
    const selected = combined.slice(0, maxHashtags);

    return selected.map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));
  }

  /**
   * Generate image prompt for AI image generation
   */
  generateImagePrompt(content, contentType) {
    const { title, description, category } = content;
    const basePrompt = `Create a vibrant, engaging educational image for a ${category} ${contentType}`;

    const prompts = {
      quiz: `${basePrompt}. Features the question "${title}". Colorful, modern, kid-friendly style. Vector art. Bright background.`,
      puzzle: `${basePrompt}. Shows puzzle pieces coming together. Title "${title}". Engaging and fun. Modern illustration style.`,
    };

    return prompts[contentType] || basePrompt;
  }

  /**
   * Generate caption for content
   */
  generateCaption(content, contentType, style) {
    const { title, description, difficulty } = content;

    const captions = {
      quiz_kids: [
        `Think you know ${title}? Test your skills with our fun quiz!`,
        `${title} quiz time! How many questions can you answer correctly?`,
        `Challenge yourself with our ${title} quiz. It's more fun than you think!`,
      ],
      quiz_programming: [
        `Test your ${title} knowledge. Improve your coding skills with real challenges.`,
        `${title} challenge: Can you solve all the problems?`,
        `Sharpen your ${title} skills. Take the challenge and see how you rank.`,
      ],
      quiz_general: [
        `Time to test your ${title} knowledge!`,
        `Think you're a ${title} expert? Prove it!`,
        `Our ${title} quiz is here. Are you ready for the challenge?`,
      ],
      puzzle_kids: [
        `Puzzle time! Can you solve this ${title} challenge? 🧩`,
        `Brain training with ${title} puzzles. Fun for all ages!`,
        `Solve our ${title} puzzle and beat your high score!`,
      ],
      puzzle_programming: [
        `${title} problem-solving challenge. Level up your skills.`,
        `Can you solve this ${title} puzzle? Test your logic skills now.`,
        `${title} brain teaser: How quickly can you solve it?`,
      ],
      puzzle_general: [
        `Puzzle challenge: ${title}. Can you solve it?`,
        `Test your puzzle-solving skills with ${title}!`,
        `${title} puzzle awaits. Are you ready?`,
      ],
    };

    const key = `${contentType}_${style}`;
    const captionArray = captions[key] || captions[`${contentType}_general`];
    return captionArray[Math.floor(Math.random() * captionArray.length)];
  }

  /**
   * Generate social post for a specific platform
   */
  async generatePostForPlatform(content, platform, contentType = 'quiz') {
    const config = this.platformConfigs[platform];
    if (!config) {
      throw new Error(`Unknown platform: ${platform}`);
    }

    const category = await this.getCategoryName(content.categoryId || content.category);
    const contentCategory = this.determineContentCategory(category, content);
    const template =
      this.contentTemplates[`${contentType}_promotion`][platform];

    if (!template) {
      throw new Error(
        `No template for ${contentType} on ${platform}`
      );
    }

    // Generate components
    const caption = this.generateCaption(content, contentType, contentCategory);
    const hashtags = this.selectHashtags(
      contentCategory,
      config,
      ['AmAha', 'Learning']
    );
    const imagePrompt = this.generateImagePrompt(content, contentType);

    // Select random template
    const selectedTemplate =
      template.templates[Math.floor(Math.random() * template.templates.length)];

    // Fill template
    const fullCaption = selectedTemplate
      .replace('{category}', category)
      .replace('{caption}', caption)
      .replace('{hashtags}', hashtags.join(' '));

    return {
      platform,
      caption: fullCaption.substring(0, config.maxCaptionLength),
      hashtags,
      imagePrompt,
      imageUrl: content.imageUrl || null,
      contentType,
      contentId: content.id,
      contentCategory,
      cta: template.cta,
      status: 'draft',
      createdAt: new Date().toISOString(),
      scheduledFor: null,
    };
  }

  /**
   * Generate posts for all platforms
   */
  async generateMultiPlatformPosts(content, contentType = 'quiz') {
    const platforms = ['instagram', 'facebook', 'twitter', 'linkedin'];
    const posts = [];

    for (const platform of platforms) {
      try {
        const post = await this.generatePostForPlatform(
          content,
          platform,
          contentType
        );
        posts.push(post);
      } catch (error) {
        console.error(`Error generating post for ${platform}:`, error);
      }
    }

    return posts;
  }

  /**
   * Get content that hasn't been used for social posts today
   */
  async getUnusedTodayContent(contentType = 'quiz') {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of today
      
      // Get all posts created today
      const todayPostsQuery = query(
        collection(db, 'social_posts'),
        where('createdAt', '>=', today),
        where('contentType', '==', contentType)
      );
      const todayPostsSnap = await getDocs(todayPostsQuery);
      const usedContentIds = new Set(
        todayPostsSnap.docs.map((doc) => doc.data().contentId)
      );
      
      // Get all content
      let allContent;
      if (contentType === 'quiz') {
        allContent = await this.getLatestQuizzes(null, 50); // Get more to filter
      } else {
        allContent = await this.getLatestPuzzles(null, 50);
      }
      
      // Filter out already-used content
      return allContent.filter((item) => !usedContentIds.has(item.id));
    } catch (error) {
      console.error('Error getting unused content:', error);
      // Fallback to latest content if error
      return contentType === 'quiz' 
        ? await this.getLatestQuizzes(null, 10)
        : await this.getLatestPuzzles(null, 10);
    }
  }

  /**
   * Save generated posts to Firestore
   */
  async savePosts(posts) {
    try {
      const savedPosts = [];
      for (const post of posts) {
        const docRef = await addDoc(collection(db, 'social_posts'), {
          ...post,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          // Track which content was used
          contentId: post.contentId || null,
        });
        savedPosts.push({ id: docRef.id, ...post });
      }
      return savedPosts;
    } catch (error) {
      console.error('Error saving posts:', error);
      throw error;
    }
  }

  /**
   * Update post status
   */
  async updatePostStatus(postId, status, scheduledFor = null) {
    try {
      const postRef = doc(db, 'social_posts', postId);
      await updateDoc(postRef, {
        status,
        scheduledFor,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating post status:', error);
      throw error;
    }
  }

  /**
   * Get all drafted/scheduled posts
   */
  async getPostsByStatus(status) {
    try {
      // First try with orderBy (requires composite index)
      try {
        const q = query(
          collection(db, 'social_posts'),
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (indexError) {
        // If composite index doesn't exist, query without orderBy
        console.log('Composite index not available, fetching without orderBy');
        const q = query(
          collection(db, 'social_posts'),
          where('status', '==', status)
        );
        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Sort manually by createdAt
        return posts.sort((a, b) => {
          const timeA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const timeB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return timeB - timeA;
        });
      }
    } catch (error) {
      console.error('Error fetching posts by status:', error);
      return [];
    }
  }

  /**
   * Generate posts from trending content
   */
  /**
   * Generate posts from trending content with unique daily content tracking
   */
  async generateFromTrendingContent(contentType = 'quiz', limit_ = 3) {
    try {
      // Get content that hasn't been used today
      const content = await this.getUnusedTodayContent(contentType);
      
      // Take only the requested number
      const selectedContent = content.slice(0, limit_);
      
      if (selectedContent.length === 0) {
        throw new Error(
          `No unused ${contentType} content available today. All recent content has been used for social posts.`
        );
      }

      const allPosts = [];
      for (const item of selectedContent) {
        const posts = await this.generateMultiPlatformPosts(
          item,
          contentType
        );
        allPosts.push(...posts);
      }

      return await this.savePosts(allPosts);
    } catch (error) {
      console.error('Error generating posts from trending content:', error);
      throw error;
    }
  }
}

export default new SocialContentEngine();
