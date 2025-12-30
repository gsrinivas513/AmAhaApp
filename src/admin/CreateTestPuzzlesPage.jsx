/**
 * CreateTestPuzzlesPage.jsx
 * Admin page to create test puzzles via the web UI
 * 
 * Navigate to: http://localhost:3000/admin/create-test-puzzles
 */

import React, { useState } from 'react';
import { collection, addDoc, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import AdminLayout from './AdminLayout';

export default function CreateTestPuzzlesPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [completed, setCompleted] = useState(false);

  const testPuzzles = [
    {
      title: "Match Animals with Names",
      description: "Match each animal picture with its correct name",
      type: "picture-word",
      difficulty: "easy",
      ageGroup: "6-8",
      category: "Logic Puzzles",
      categoryId: "logic-puzzles",
      topic: "Picture Word Matching",
      topicId: "picture-word",
      subtopic: "Animals",
      subtopicId: "picture-word-animals",
      data: {
        pairs: [
          { id: "pair-1", image: "https://via.placeholder.com/100/0000FF/ffffff?text=🐱", word: "Cat" },
          { id: "pair-2", image: "https://via.placeholder.com/100/00FF00/ffffff?text=🐶", word: "Dog" },
          { id: "pair-3", image: "https://via.placeholder.com/100/FF0000/ffffff?text=🐭", word: "Mouse" },
          { id: "pair-4", image: "https://via.placeholder.com/100/FFFF00/000000?text=🦁", word: "Lion" }
        ],
        layout: "grid-2x2"
      }
    },
    {
      title: "Find 3 Differences",
      description: "Find all the differences between the two images",
      type: "spot-difference",
      difficulty: "easy",
      ageGroup: "6-8",
      category: "Logic Puzzles",
      categoryId: "logic-puzzles",
      topic: "Spot Difference",
      topicId: "spot-difference",
      subtopic: "Beginner",
      subtopicId: "spot-diff-beginner",
      data: {
        imageA: "https://via.placeholder.com/300x200/FF6B6B/ffffff?text=Image+A",
        imageB: "https://via.placeholder.com/300x200/4ECDC4/ffffff?text=Image+B",
        differences: [
          { x: 50, y: 50, radius: 30 },
          { x: 150, y: 75, radius: 25 },
          { x: 250, y: 120, radius: 20 }
        ],
        difficultyHint: 3
      }
    },
    {
      title: "Memory Game - Colors",
      description: "Flip cards to find matching color pairs",
      type: "find-pair",
      difficulty: "easy",
      ageGroup: "6-8",
      category: "Logic Puzzles",
      categoryId: "logic-puzzles",
      topic: "Find Pairs",
      topicId: "find-pairs",
      subtopic: "Colors",
      subtopicId: "find-pairs-colors",
      data: {
        cards: [
          { id: "card-1", image: "https://via.placeholder.com/80/FF0000/ffffff?text=Red", pairId: "pair-red" },
          { id: "card-2", image: "https://via.placeholder.com/80/00FF00/ffffff?text=Green", pairId: "pair-green" },
          { id: "card-3", image: "https://via.placeholder.com/80/0000FF/ffffff?text=Blue", pairId: "pair-blue" },
          { id: "card-4", image: "https://via.placeholder.com/80/FFFF00/000000?text=Yellow", pairId: "pair-yellow" },
          { id: "card-5", image: "https://via.placeholder.com/80/FF0000/ffffff?text=Red", pairId: "pair-red" },
          { id: "card-6", image: "https://via.placeholder.com/80/00FF00/ffffff?text=Green", pairId: "pair-green" },
          { id: "card-7", image: "https://via.placeholder.com/80/0000FF/ffffff?text=Blue", pairId: "pair-blue" },
          { id: "card-8", image: "https://via.placeholder.com/80/FFFF00/000000?text=Yellow", pairId: "pair-yellow" }
        ],
        layout: "grid-4x2"
      }
    },
    {
      title: "Match Objects with Shadows",
      description: "Match each object with its correct shadow",
      type: "picture-shadow",
      difficulty: "medium",
      ageGroup: "6-8",
      category: "Logic Puzzles",
      categoryId: "logic-puzzles",
      topic: "Picture Shadow",
      topicId: "picture-shadow",
      subtopic: "Shapes",
      subtopicId: "picture-shadow-shapes",
      data: {
        pairs: [
          { id: "shadow-pair-1", image: "https://via.placeholder.com/80/FF6B6B/ffffff?text=Cup", shadow: "https://via.placeholder.com/80/000000/ffffff?text=Shadow" },
          { id: "shadow-pair-2", image: "https://via.placeholder.com/80/4ECDC4/ffffff?text=Star", shadow: "https://via.placeholder.com/80/000000/ffffff?text=Shadow" },
          { id: "shadow-pair-3", image: "https://via.placeholder.com/80/45B7D1/ffffff?text=Tree", shadow: "https://via.placeholder.com/80/000000/ffffff?text=Shadow" },
          { id: "shadow-pair-4", image: "https://via.placeholder.com/80/96CEB4/ffffff?text=House", shadow: "https://via.placeholder.com/80/000000/ffffff?text=Shadow" }
        ]
      }
    },
    {
      title: "Order by Size - Small to Large",
      description: "Drag the items from smallest to largest",
      type: "ordering",
      difficulty: "easy",
      ageGroup: "6-8",
      category: "Logic Puzzles",
      categoryId: "logic-puzzles",
      topic: "Ordering",
      topicId: "ordering",
      subtopic: "Size Sequencing",
      subtopicId: "ordering-size",
      data: {
        type: "size",
        displayType: "sizes",
        items: [
          { id: "item-1", label: "Tiny", image: "https://via.placeholder.com/40/FF6B6B/ffffff?text=Tiny", order: 1, size: 40 },
          { id: "item-2", label: "Small", image: "https://via.placeholder.com/60/FF6B6B/ffffff?text=Small", order: 2, size: 60 },
          { id: "item-3", label: "Medium", image: "https://via.placeholder.com/80/FF6B6B/ffffff?text=Medium", order: 3, size: 80 },
          { id: "item-4", label: "Large", image: "https://via.placeholder.com/100/FF6B6B/ffffff?text=Large", order: 4, size: 100 },
          { id: "item-5", label: "Extra Large", image: "https://via.placeholder.com/120/FF6B6B/ffffff?text=XL", order: 5, size: 120 },
          { id: "item-6", label: "2X Large", image: "https://via.placeholder.com/140/FF6B6B/ffffff?text=2XL", order: 6, size: 140 },
          { id: "item-7", label: "3X Large", image: "https://via.placeholder.com/160/FF6B6B/ffffff?text=3XL", order: 7, size: 160 },
          { id: "item-8", label: "4X Large", image: "https://via.placeholder.com/180/FF6B6B/ffffff?text=4XL", order: 8, size: 180 }
        ],
        correctOrder: [1, 2, 3, 4, 5, 6, 7, 8]
      }
    },
    {
      title: "Match Fruit Names",
      description: "Match each fruit picture with its name",
      type: "picture-word",
      difficulty: "medium",
      ageGroup: "6-8",
      category: "Logic Puzzles",
      categoryId: "logic-puzzles",
      topic: "Picture Word Matching",
      topicId: "picture-word",
      subtopic: "Fruits",
      subtopicId: "picture-word-fruits",
      data: {
        pairs: [
          { id: "fruit-1", image: "https://via.placeholder.com/100/FF0000/ffffff?text=🍎", word: "Apple" },
          { id: "fruit-2", image: "https://via.placeholder.com/100/FFFF00/000000?text=🍌", word: "Banana" },
          { id: "fruit-3", image: "https://via.placeholder.com/100/FF7F00/ffffff?text=🍊", word: "Orange" },
          { id: "fruit-4", image: "https://via.placeholder.com/100/FF1493/ffffff?text=🍓", word: "Strawberry" },
          { id: "fruit-5", image: "https://via.placeholder.com/100/9370DB/ffffff?text=🍇", word: "Grapes" },
          { id: "fruit-6", image: "https://via.placeholder.com/100/00CED1/ffffff?text=🥥", word: "Coconut" }
        ],
        layout: "grid-3x2"
      }
    },
    {
      title: "Number Sequence 1-50",
      description: "Arrange numbers in correct order - choose a range from 1-10, 11-20, 21-30, 31-40, or 41-50",
      type: "ordering",
      difficulty: "medium",
      ageGroup: "6-8",
      category: "Logic Puzzles",
      categoryId: "logic-puzzles",
      topic: "Ordering",
      topicId: "ordering",
      subtopic: "Number Sequences",
      subtopicId: "ordering-numbers",
      data: {
        maxRange: 50,
        numberRanges: [
          { label: "1-10", min: 1, max: 10 },
          { label: "11-20", min: 11, max: 20 },
          { label: "21-30", min: 21, max: 30 },
          { label: "31-40", min: 31, max: 40 },
          { label: "41-50", min: 41, max: 50 }
        ],
        items: [
          // 1-10
          { id: "num-1", label: "1", number: 1, image: "https://via.placeholder.com/80/0000FF/ffffff?text=1", order: 1 },
          { id: "num-2", label: "2", number: 2, image: "https://via.placeholder.com/80/0000FF/ffffff?text=2", order: 2 },
          { id: "num-3", label: "3", number: 3, image: "https://via.placeholder.com/80/0000FF/ffffff?text=3", order: 3 },
          { id: "num-4", label: "4", number: 4, image: "https://via.placeholder.com/80/0000FF/ffffff?text=4", order: 4 },
          { id: "num-5", label: "5", number: 5, image: "https://via.placeholder.com/80/0000FF/ffffff?text=5", order: 5 },
          { id: "num-6", label: "6", number: 6, image: "https://via.placeholder.com/80/0000FF/ffffff?text=6", order: 6 },
          { id: "num-7", label: "7", number: 7, image: "https://via.placeholder.com/80/0000FF/ffffff?text=7", order: 7 },
          { id: "num-8", label: "8", number: 8, image: "https://via.placeholder.com/80/0000FF/ffffff?text=8", order: 8 },
          { id: "num-9", label: "9", number: 9, image: "https://via.placeholder.com/80/0000FF/ffffff?text=9", order: 9 },
          { id: "num-10", label: "10", number: 10, image: "https://via.placeholder.com/80/0000FF/ffffff?text=10", order: 10 },
          // 11-20
          { id: "num-11", label: "11", number: 11, image: "https://via.placeholder.com/80/0000FF/ffffff?text=11", order: 11 },
          { id: "num-12", label: "12", number: 12, image: "https://via.placeholder.com/80/0000FF/ffffff?text=12", order: 12 },
          { id: "num-13", label: "13", number: 13, image: "https://via.placeholder.com/80/0000FF/ffffff?text=13", order: 13 },
          { id: "num-14", label: "14", number: 14, image: "https://via.placeholder.com/80/0000FF/ffffff?text=14", order: 14 },
          { id: "num-15", label: "15", number: 15, image: "https://via.placeholder.com/80/0000FF/ffffff?text=15", order: 15 },
          { id: "num-16", label: "16", number: 16, image: "https://via.placeholder.com/80/0000FF/ffffff?text=16", order: 16 },
          { id: "num-17", label: "17", number: 17, image: "https://via.placeholder.com/80/0000FF/ffffff?text=17", order: 17 },
          { id: "num-18", label: "18", number: 18, image: "https://via.placeholder.com/80/0000FF/ffffff?text=18", order: 18 },
          { id: "num-19", label: "19", number: 19, image: "https://via.placeholder.com/80/0000FF/ffffff?text=19", order: 19 },
          { id: "num-20", label: "20", number: 20, image: "https://via.placeholder.com/80/0000FF/ffffff?text=20", order: 20 },
          // 21-30
          { id: "num-21", label: "21", number: 21, image: "https://via.placeholder.com/80/0000FF/ffffff?text=21", order: 21 },
          { id: "num-22", label: "22", number: 22, image: "https://via.placeholder.com/80/0000FF/ffffff?text=22", order: 22 },
          { id: "num-23", label: "23", number: 23, image: "https://via.placeholder.com/80/0000FF/ffffff?text=23", order: 23 },
          { id: "num-24", label: "24", number: 24, image: "https://via.placeholder.com/80/0000FF/ffffff?text=24", order: 24 },
          { id: "num-25", label: "25", number: 25, image: "https://via.placeholder.com/80/0000FF/ffffff?text=25", order: 25 },
          { id: "num-26", label: "26", number: 26, image: "https://via.placeholder.com/80/0000FF/ffffff?text=26", order: 26 },
          { id: "num-27", label: "27", number: 27, image: "https://via.placeholder.com/80/0000FF/ffffff?text=27", order: 27 },
          { id: "num-28", label: "28", number: 28, image: "https://via.placeholder.com/80/0000FF/ffffff?text=28", order: 28 },
          { id: "num-29", label: "29", number: 29, image: "https://via.placeholder.com/80/0000FF/ffffff?text=29", order: 29 },
          { id: "num-30", label: "30", number: 30, image: "https://via.placeholder.com/80/0000FF/ffffff?text=30", order: 30 },
          // 31-40
          { id: "num-31", label: "31", number: 31, image: "https://via.placeholder.com/80/0000FF/ffffff?text=31", order: 31 },
          { id: "num-32", label: "32", number: 32, image: "https://via.placeholder.com/80/0000FF/ffffff?text=32", order: 32 },
          { id: "num-33", label: "33", number: 33, image: "https://via.placeholder.com/80/0000FF/ffffff?text=33", order: 33 },
          { id: "num-34", label: "34", number: 34, image: "https://via.placeholder.com/80/0000FF/ffffff?text=34", order: 34 },
          { id: "num-35", label: "35", number: 35, image: "https://via.placeholder.com/80/0000FF/ffffff?text=35", order: 35 },
          { id: "num-36", label: "36", number: 36, image: "https://via.placeholder.com/80/0000FF/ffffff?text=36", order: 36 },
          { id: "num-37", label: "37", number: 37, image: "https://via.placeholder.com/80/0000FF/ffffff?text=37", order: 37 },
          { id: "num-38", label: "38", number: 38, image: "https://via.placeholder.com/80/0000FF/ffffff?text=38", order: 38 },
          { id: "num-39", label: "39", number: 39, image: "https://via.placeholder.com/80/0000FF/ffffff?text=39", order: 39 },
          { id: "num-40", label: "40", number: 40, image: "https://via.placeholder.com/80/0000FF/ffffff?text=40", order: 40 },
          // 41-50
          { id: "num-41", label: "41", number: 41, image: "https://via.placeholder.com/80/0000FF/ffffff?text=41", order: 41 },
          { id: "num-42", label: "42", number: 42, image: "https://via.placeholder.com/80/0000FF/ffffff?text=42", order: 42 },
          { id: "num-43", label: "43", number: 43, image: "https://via.placeholder.com/80/0000FF/ffffff?text=43", order: 43 },
          { id: "num-44", label: "44", number: 44, image: "https://via.placeholder.com/80/0000FF/ffffff?text=44", order: 44 },
          { id: "num-45", label: "45", number: 45, image: "https://via.placeholder.com/80/0000FF/ffffff?text=45", order: 45 },
          { id: "num-46", label: "46", number: 46, image: "https://via.placeholder.com/80/0000FF/ffffff?text=46", order: 46 },
          { id: "num-47", label: "47", number: 47, image: "https://via.placeholder.com/80/0000FF/ffffff?text=47", order: 47 },
          { id: "num-48", label: "48", number: 48, image: "https://via.placeholder.com/80/0000FF/ffffff?text=48", order: 48 },
          { id: "num-49", label: "49", number: 49, image: "https://via.placeholder.com/80/0000FF/ffffff?text=49", order: 49 },
          { id: "num-50", label: "50", number: 50, image: "https://via.placeholder.com/80/0000FF/ffffff?text=50", order: 50 }
        ],
        correctOrder: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50]
      }
    },
    {
      title: "Memory Game - Objects",
      description: "Flip cards to find matching object pairs (harder version)",
      type: "find-pair",
      difficulty: "hard",
      ageGroup: "9-12",
      category: "Logic Puzzles",
      categoryId: "logic-puzzles",
      topic: "Find Pairs",
      topicId: "find-pairs",
      subtopic: "Objects",
      subtopicId: "find-pairs-objects",
      data: {
        cards: [
          { id: "obj-1", image: "https://via.placeholder.com/80/FF6B6B/ffffff?text=🎸", pairId: "guitar" },
          { id: "obj-2", image: "https://via.placeholder.com/80/4ECDC4/ffffff?text=⚽", pairId: "ball" },
          { id: "obj-3", image: "https://via.placeholder.com/80/45B7D1/ffffff?text=🎮", pairId: "game" },
          { id: "obj-4", image: "https://via.placeholder.com/80/96CEB4/ffffff?text=📚", pairId: "book" },
          { id: "obj-5", image: "https://via.placeholder.com/80/FFEAA7/ffffff?text=🍕", pairId: "pizza" },
          { id: "obj-6", image: "https://via.placeholder.com/80/DFE6E9/ffffff?text=💻", pairId: "computer" },
          { id: "obj-7", image: "https://via.placeholder.com/80/FF6B6B/ffffff?text=🎸", pairId: "guitar" },
          { id: "obj-8", image: "https://via.placeholder.com/80/4ECDC4/ffffff?text=⚽", pairId: "ball" },
          { id: "obj-9", image: "https://via.placeholder.com/80/45B7D1/ffffff?text=🎮", pairId: "game" },
          { id: "obj-10", image: "https://via.placeholder.com/80/96CEB4/ffffff?text=📚", pairId: "book" },
          { id: "obj-11", image: "https://via.placeholder.com/80/FFEAA7/ffffff?text=🍕", pairId: "pizza" },
          { id: "obj-12", image: "https://via.placeholder.com/80/DFE6E9/ffffff?text=💻", pairId: "computer" }
        ],
        layout: "grid-4x3"
      }
    }
  ];

  const handleCreateTestPuzzles = async () => {
    setLoading(true);
    setCompleted(false);
    setProgress({ current: 0, total: testPuzzles.length + 6 }); // +6 for category, topics, subtopics, puzzle count update

    try {
      // Step 1: Create Logic Puzzles category
      setStatus("📂 Step 1: Creating Logic Puzzles category...");
      const categoryId = 'logic-puzzles';
      await setDoc(doc(db, 'categories', categoryId), {
        name: 'logic-puzzles',
        label: 'Logic Puzzles',
        icon: '🧩',
        featureId: 'puzzles',
        uiMode: 'puzzle',
        isPublished: true,
        createdAt: new Date(),
        quizCount: 0,
      });
      setProgress(p => ({ ...p, current: p.current + 1 }));

      // Step 2: Create topics (one for each puzzle type)
      setStatus("📌 Step 2: Creating puzzle topics...");
      const topicData = [
        { id: 'picture-word', name: 'Picture Word Matching', label: 'Picture Word Matching' },
        { id: 'spot-difference', name: 'Spot Difference', label: 'Spot Difference' },
        { id: 'find-pairs', name: 'Find Pairs', label: 'Find Pairs' },
        { id: 'picture-shadow', name: 'Picture Shadow', label: 'Picture Shadow Matching' },
        { id: 'ordering', name: 'Ordering', label: 'Ordering/Sequencing' }
      ];

      const topicIds = {};
      for (const topic of topicData) {
        await setDoc(doc(db, 'topics', topic.id), {
          id: topic.id,
          name: topic.name,
          label: topic.label,
          categoryId: categoryId,
          isPublished: true,
          sortOrder: 0,
          createdAt: new Date(),
        });
        topicIds[topic.id] = topic.id;
      }
      setProgress(p => ({ ...p, current: p.current + 4 }));

      // Step 3: Create subtopics for each topic
      setStatus("🎯 Step 3: Creating puzzle subtopics...");
      const subtopicData = [
        { id: 'picture-word-animals', topicId: 'picture-word', name: 'Animals', label: 'Animals' },
        { id: 'picture-word-fruits', topicId: 'picture-word', name: 'Fruits', label: 'Fruits' },
        { id: 'spot-diff-beginner', topicId: 'spot-difference', name: 'Beginner', label: 'Beginner' },
        { id: 'find-pairs-colors', topicId: 'find-pairs', name: 'Colors', label: 'Colors' },
        { id: 'find-pairs-objects', topicId: 'find-pairs', name: 'Objects', label: 'Objects' },
        { id: 'picture-shadow-shapes', topicId: 'picture-shadow', name: 'Shapes', label: 'Shapes' },
        { id: 'ordering-size', topicId: 'ordering', name: 'Size', label: 'Size Sequencing' },
        { id: 'ordering-numbers', topicId: 'ordering', name: 'Numbers', label: 'Number Sequences' }
      ];

      for (const subtopic of subtopicData) {
        await setDoc(doc(db, 'subtopics', subtopic.id), {
          id: subtopic.id,
          name: subtopic.name,
          label: subtopic.label,
          categoryId: categoryId,
          topicId: subtopic.topicId,
          featureId: 'puzzles',
          isPublished: true,
          sortOrder: 0,
          createdAt: new Date(),
        });
      }
      setProgress(p => ({ ...p, current: p.current + 1 }));

      // Step 4: Create puzzles
      setStatus("🧩 Step 4: Creating test puzzles...");
      
      // Track which subtopic each puzzle belongs to
      const subtopicPuzzleMap = {};
      
      for (let i = 0; i < testPuzzles.length; i++) {
        const puzzle = testPuzzles[i];
        setStatus(`🧩 Step 4: Creating puzzle ${i + 1}/${testPuzzles.length}: "${puzzle.title}"...`);
        
        await addDoc(collection(db, 'puzzles'), {
          ...puzzle,
          featureId: 'puzzles',
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          xpReward: puzzle.difficulty === 'easy' ? 10 : puzzle.difficulty === 'medium' ? 20 : 30,
          timeLimit: null,
          hints: 2,
          category: puzzle.category,
        });

        // Track puzzle count for each subtopic
        if (!subtopicPuzzleMap[puzzle.subtopicId]) {
          subtopicPuzzleMap[puzzle.subtopicId] = 0;
        }
        subtopicPuzzleMap[puzzle.subtopicId]++;

        setProgress(p => ({ ...p, current: p.current + 1 }));
      }

      // Step 5: Update subtopics with puzzle counts
      setStatus("📊 Step 5: Updating subtopic puzzle counts...");
      for (const subtopic of subtopicData) {
        const puzzleCount = subtopicPuzzleMap[subtopic.id] || 0;
        await setDoc(doc(db, 'subtopics', subtopic.id), {
          id: subtopic.id,
          name: subtopic.name,
          label: subtopic.label,
          categoryId: categoryId,
          topicId: subtopic.topicId,
          featureId: 'puzzles',
          isPublished: true,
          sortOrder: 0,
          createdAt: new Date(),
          puzzleCount: puzzleCount, // ✨ ADD PUZZLE COUNT
        });
      }
      setProgress(p => ({ ...p, current: p.current + 1 }));

      setStatus(`✅ Successfully created category, topics, subtopics, and ${testPuzzles.length} test puzzles!`);
      setCompleted(true);
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
      console.error('Error creating test puzzles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">🧩 Create Test Puzzles</h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">What This Does:</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Creates 9 test puzzles across all 5 puzzle types</li>
              <li>Sets them in "Logic Puzzles" category</li>
              <li>Makes them all published and ready to play</li>
              <li>Uses placeholder images for quick testing</li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">📋 Test Puzzles Included:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">🖼️ Picture-Word Matching</p>
                <p className="text-sm text-gray-600">• Animals (Easy)</p>
                <p className="text-sm text-gray-600">• Fruits (Medium)</p>
              </div>
              <div>
                <p className="font-medium">👁️ Spot the Difference</p>
                <p className="text-sm text-gray-600">• Find 3 Differences (Easy)</p>
              </div>
              <div>
                <p className="font-medium">🧩 Find Matching Pair</p>
                <p className="text-sm text-gray-600">• Colors Memory (Easy)</p>
                <p className="text-sm text-gray-600">• Objects Memory (Hard)</p>
              </div>
              <div>
                <p className="font-medium">🌑 Picture-Shadow Matching</p>
                <p className="text-sm text-gray-600">• Objects with Shadows (Medium)</p>
              </div>
              <div>
                <p className="font-medium">🔢 Ordering/Sequencing</p>
                <p className="text-sm text-gray-600">• Size Ordering (Easy)</p>
                <p className="text-sm text-gray-600">• Number Sequence 1-5 (Medium)</p>
              </div>
            </div>
          </div>

          {loading && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Creating Puzzles...</h2>
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-gray-700 mb-4">
                {progress.current} of {progress.total} puzzles created
              </p>
              <p className="text-gray-600">{status}</p>
            </div>
          )}

          {completed && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-green-700 mb-4">✅ Success!</h2>
              <p className="text-gray-700 mb-4">{status}</p>
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="font-semibold mb-2">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Go to: <a href="/puzzle/logic-puzzles" className="text-blue-600 hover:underline">Logic Puzzles Category</a></li>
                  <li>Or navigate through the menu: 🧩 Puzzles → Logic Puzzles</li>
                  <li>Start playing the test puzzles!</li>
                </ol>
              </div>
            </div>
          )}

          {!loading && !completed && (
            <button
              onClick={handleCreateTestPuzzles}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
            >
              🚀 Create Test Puzzles Now
            </button>
          )}

          {completed && (
            <div className="flex gap-4">
              <a
                href="/puzzle/logic-puzzles"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors text-center"
              >
                ➜ Go to Logic Puzzles
              </a>
              <button
                onClick={() => {
                  setCompleted(false);
                  setStatus('');
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                Create More
              </button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
