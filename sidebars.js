/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  mainSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Welcome',
    },
    {
      type: 'category',
      label: 'Platform Overview',
      items: [
        'platform/what-is-amaha',
        'platform/target-audience',
        'platform/core-philosophy',
        'platform/feature-summary',
      ],
    },
    {
      type: 'category',
      label: 'Quiz System',
      items: [
        'quizzes/overview',
        'quizzes/quiz-types',
        'quizzes/difficulty-variants',
        'quizzes/question-types',
        'quizzes/scoring-validation',
        'quizzes/quiz-structure',
      ],
    },
    {
      type: 'category',
      label: 'Puzzle System',
      items: [
        'puzzles/overview',
        'puzzles/puzzle-categories',
        'puzzles/puzzle-types',
        'puzzles/interaction-types',
        'puzzles/puzzle-structure',
      ],
    },
    {
      type: 'category',
      label: 'Interactive Activities',
      items: [
        'activities/overview',
        'activities/ordering',
        'activities/matching',
        'activities/free-play-challenge',
      ],
    },
    {
      type: 'category',
      label: 'Content Structure',
      items: [
        'content/hierarchy',
        'content/organization',
        'content/naming-conventions',
      ],
    },
    {
      type: 'category',
      label: 'User Experience',
      items: [
        'ux/design-principles',
        'ux/ui-approach',
        'ux/accessibility',
        'ux/user-flows',
      ],
    },
    {
      type: 'category',
      label: 'Admin & Content Creation',
      items: [
        'admin/overview',
        'admin/quiz-management',
        'admin/content-workflow',
        'admin/seeding-puzzles',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/frontend',
        'architecture/interaction-engine',
        'architecture/state-management',
        'architecture/firebase-integration',
      ],
    },
    {
      type: 'category',
      label: 'Future Features',
      collapsed: true,
      items: [
        'future/advanced-puzzles',
        'future/analytics',
        'future/monetization',
        'future/social-features',
      ],
    },
  ],
};

module.exports = sidebars;
