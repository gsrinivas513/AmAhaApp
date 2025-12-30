/**
 * SharedImages.js
 * 
 * Centralized image URLs to prevent duplication
 * These images are used across multiple features, categories, topics, and puzzles
 * 
 * Benefits:
 * - Reduce Cloudinary bandwidth costs
 * - Single source of truth for reused images
 * - Easy to update images across entire platform
 * - Helps consolidate the 66 duplicate image references
 */

export const SHARED_IMAGES = {
  // ============================================================
  // 🏆 FEATURE IMAGES (Used in FeatureTiles)
  // ============================================================
  features: {
    quizzes: "https://res.cloudinary.com/amaha/image/upload/v1703769600/features/quizzes.jpg",
    puzzles: "https://res.cloudinary.com/amaha/image/upload/v1703769600/features/puzzles.jpg",
    stories: "https://res.cloudinary.com/amaha/image/upload/v1703769600/features/stories.jpg",
    games: "https://res.cloudinary.com/amaha/image/upload/v1703769600/features/games.jpg",
  },

  // ============================================================
  // 📂 CATEGORY IMAGES (Animals, Nature, Transport, etc.)
  // ============================================================
  categories: {
    animals: "https://res.cloudinary.com/amaha/image/upload/v1703769600/categories/animals.jpg",
    nature: "https://res.cloudinary.com/amaha/image/upload/v1703769600/categories/nature.jpg",
    transport: "https://res.cloudinary.com/amaha/image/upload/v1703769600/categories/transport.jpg",
    food: "https://res.cloudinary.com/amaha/image/upload/v1703769600/categories/food.jpg",
    family: "https://res.cloudinary.com/amaha/image/upload/v1703769600/categories/family.jpg",
    colors: "https://res.cloudinary.com/amaha/image/upload/v1703769600/categories/colors.jpg",
  },

  // ============================================================
  // 🧩 PUZZLE TYPE DEFAULT IMAGES
  // ============================================================
  puzzles: {
    findPairs: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/find-pairs-default.jpg",
    pictureWord: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/picture-word-default.jpg",
    spotDifference: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/spot-difference-default.jpg",
    pictureShadow: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/picture-shadow-default.jpg",
    ordering: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/ordering-default.jpg",
    sequencing: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/sequencing-default.jpg",
  },

  // ============================================================
  // 🎯 ANIMAL PUZZLE IMAGES (Your 18 Animal Images)
  // ============================================================
  animals: {
    lion: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/lion.jpg",
    tiger: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/tiger.jpg",
    elephant: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/elephant.jpg",
    giraffe: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/giraffe.jpg",
    zebra: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/zebra.jpg",
    monkey: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/monkey.jpg",
    dog: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/dog.jpg",
    cat: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/cat.jpg",
    bird: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/bird.jpg",
    fish: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/fish.jpg",
    snake: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/snake.jpg",
    penguin: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/penguin.jpg",
    deer: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/deer.jpg",
    bear: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/bear.jpg",
    rabbit: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/rabbit.jpg",
    owl: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/owl.jpg",
    turtle: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/turtle.jpg",
    wolf: "https://res.cloudinary.com/amaha/image/upload/v1703769600/puzzles/animals/wolf.jpg",
  },

  // ============================================================
  // 🎨 UI / PLACEHOLDER IMAGES
  // ============================================================
  ui: {
    placeholder: "https://res.cloudinary.com/amaha/image/upload/v1703769600/ui/placeholder.jpg",
    noImage: "https://res.cloudinary.com/amaha/image/upload/v1703769600/ui/no-image.jpg",
    loading: "https://res.cloudinary.com/amaha/image/upload/v1703769600/ui/loading.gif",
    logoSmall: "https://res.cloudinary.com/amaha/image/upload/v1703769600/ui/logo-small.png",
    logoBig: "https://res.cloudinary.com/amaha/image/upload/v1703769600/ui/logo-big.png",
  },

  // ============================================================
  // 📚 TOPIC / SUBTOPIC IMAGES
  // ============================================================
  topics: {
    jungleAnimals: "https://res.cloudinary.com/amaha/image/upload/v1703769600/topics/jungle-animals.jpg",
    domesticAnimals: "https://res.cloudinary.com/amaha/image/upload/v1703769600/topics/domestic-animals.jpg",
    wildAnimals: "https://res.cloudinary.com/amaha/image/upload/v1703769600/topics/wild-animals.jpg",
    zooAnimals: "https://res.cloudinary.com/amaha/image/upload/v1703769600/topics/zoo-animals.jpg",
  },
};

/**
 * USAGE EXAMPLES:
 * 
 * ============================================================
 * Example 1: In FeatureTiles Component
 * ============================================================
 * import { SHARED_IMAGES } from "../constants/SharedImages";
 * 
 * const featureData = {
 *   name: "Puzzles",
 *   imageUrl: SHARED_IMAGES.features.puzzles  // ✅ Shared
 * };
 * 
 * ============================================================
 * Example 2: In Category Feature
 * ============================================================
 * const category = {
 *   name: "Animals",
 *   imageUrl: SHARED_IMAGES.categories.animals  // ✅ Shared
 * };
 * 
 * ============================================================
 * Example 3: In Puzzle Data
 * ============================================================
 * const findPairsPuzzle = {
 *   name: "Find Lion Pair",
 *   type: "findpairs",
 *   imageUrl: SHARED_IMAGES.puzzles.findPairs,  // ✅ Default puzzle image
 *   data: {
 *     cards: [
 *       { image: SHARED_IMAGES.animals.lion },  // ✅ Reuses animal image
 *       { image: SHARED_IMAGES.animals.tiger },
 *     ]
 *   }
 * };
 * 
 * ============================================================
 * Example 4: In Topic
 * ============================================================
 * const topic = {
 *   name: "Jungle Animals",
 *   categoryId: "animals",
 *   imageUrl: SHARED_IMAGES.topics.jungleAnimals  // ✅ Shared
 * };
 * 
 * ============================================================
 * Benefits:
 * ============================================================
 * ✅ Single URL source - Update once, updates everywhere
 * ✅ Reduces Cloudinary bandwidth - Reuse same CDN URL
 * ✅ Consolidates duplicates - From 192 references to X unique
 * ✅ Easy to maintain - All images in one place
 * ✅ Type-safe - IDE autocomplete for all available images
 * ✅ Version control - Track image changes in git history
 */

/**
 * HELPER FUNCTION: Get all image URLs
 * Useful for auditing and ensuring no hardcoded URLs remain
 */
export const getAllSharedImageUrls = () => {
  const urls = [];
  Object.values(SHARED_IMAGES).forEach(category => {
    if (typeof category === 'object') {
      urls.push(...Object.values(category));
    }
  });
  return urls;
};

/**
 * HELPER FUNCTION: Check if URL is a shared image
 * Usage: if (isSharedImage(imageUrl)) { reused }
 */
export const isSharedImage = (imageUrl) => {
  return getAllSharedImageUrls().includes(imageUrl);
};

/**
 * HELPER FUNCTION: Find which shared image a URL represents
 * Usage: const imageName = findSharedImageName(imageUrl);
 */
export const findSharedImageName = (imageUrl) => {
  for (const [category, images] of Object.entries(SHARED_IMAGES)) {
    if (typeof images === 'object') {
      for (const [name, url] of Object.entries(images)) {
        if (url === imageUrl) {
          return { category, name };
        }
      }
    }
  }
  return null;
};
