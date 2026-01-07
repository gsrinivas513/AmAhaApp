import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/',
    component: ComponentCreator('/', '114'),
    routes: [
      {
        path: '/',
        component: ComponentCreator('/', '9d5'),
        routes: [
          {
            path: '/',
            component: ComponentCreator('/', '834'),
            routes: [
              {
                path: '/activities/free-play-challenge',
                component: ComponentCreator('/activities/free-play-challenge', '4ef'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/activities/matching',
                component: ComponentCreator('/activities/matching', '2c6'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/activities/ordering',
                component: ComponentCreator('/activities/ordering', '230'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/activities/overview',
                component: ComponentCreator('/activities/overview', 'd3a'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/admin/content-workflow',
                component: ComponentCreator('/admin/content-workflow', '869'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/admin/overview',
                component: ComponentCreator('/admin/overview', 'f2a'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/admin/quiz-management',
                component: ComponentCreator('/admin/quiz-management', '50b'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/architecture/firebase-integration',
                component: ComponentCreator('/architecture/firebase-integration', '57a'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/architecture/frontend',
                component: ComponentCreator('/architecture/frontend', '491'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/architecture/interaction-engine',
                component: ComponentCreator('/architecture/interaction-engine', 'be4'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/architecture/overview',
                component: ComponentCreator('/architecture/overview', 'fd5'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/architecture/state-management',
                component: ComponentCreator('/architecture/state-management', '5f7'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/content/hierarchy',
                component: ComponentCreator('/content/hierarchy', 'da8'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/content/naming-conventions',
                component: ComponentCreator('/content/naming-conventions', '1f4'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/content/organization',
                component: ComponentCreator('/content/organization', '5e4'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/future/advanced-puzzles',
                component: ComponentCreator('/future/advanced-puzzles', '0f8'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/future/analytics',
                component: ComponentCreator('/future/analytics', '628'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/future/monetization',
                component: ComponentCreator('/future/monetization', 'e6e'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/future/overview',
                component: ComponentCreator('/future/overview', '508'),
                exact: true
              },
              {
                path: '/future/social-features',
                component: ComponentCreator('/future/social-features', 'e46'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/intro',
                component: ComponentCreator('/intro', '9af'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/platform/core-philosophy',
                component: ComponentCreator('/platform/core-philosophy', '289'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/platform/feature-summary',
                component: ComponentCreator('/platform/feature-summary', '83d'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/platform/target-audience',
                component: ComponentCreator('/platform/target-audience', 'dcc'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/platform/what-is-amaha',
                component: ComponentCreator('/platform/what-is-amaha', 'beb'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/puzzles/interaction-types',
                component: ComponentCreator('/puzzles/interaction-types', 'e7e'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/puzzles/overview',
                component: ComponentCreator('/puzzles/overview', '096'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/puzzles/puzzle-categories',
                component: ComponentCreator('/puzzles/puzzle-categories', '313'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/puzzles/puzzle-structure',
                component: ComponentCreator('/puzzles/puzzle-structure', 'f12'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/puzzles/puzzle-types',
                component: ComponentCreator('/puzzles/puzzle-types', '2a5'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/quizzes/difficulty-variants',
                component: ComponentCreator('/quizzes/difficulty-variants', '2ec'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/quizzes/overview',
                component: ComponentCreator('/quizzes/overview', '140'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/quizzes/question-types',
                component: ComponentCreator('/quizzes/question-types', '8c0'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/quizzes/quiz-structure',
                component: ComponentCreator('/quizzes/quiz-structure', 'c05'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/quizzes/quiz-types',
                component: ComponentCreator('/quizzes/quiz-types', 'add'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/quizzes/scoring-validation',
                component: ComponentCreator('/quizzes/scoring-validation', '5e6'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/ux/accessibility',
                component: ComponentCreator('/ux/accessibility', '9fa'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/ux/design-principles',
                component: ComponentCreator('/ux/design-principles', 'ed7'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/ux/ui-approach',
                component: ComponentCreator('/ux/ui-approach', 'ff1'),
                exact: true,
                sidebar: "mainSidebar"
              },
              {
                path: '/ux/user-flows',
                component: ComponentCreator('/ux/user-flows', 'f37'),
                exact: true,
                sidebar: "mainSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
