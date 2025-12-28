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
      description: "Drag the apples from smallest to largest",
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
        items: [
          { id: "item-1", label: "Small Apple", image: "https://via.placeholder.com/60/FF0000/ffffff?text=Small", order: 1 },
          { id: "item-2", label: "Medium Apple", image: "https://via.placeholder.com/90/FF0000/ffffff?text=Medium", order: 2 },
          { id: "item-3", label: "Large Apple", image: "https://via.placeholder.com/120/FF0000/ffffff?text=Large", order: 3 }
        ],
        correctOrder: [1, 2, 3]
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
      title: "Number Sequence 1-5",
      description: "Arrange the numbers from 1 to 5 in correct order",
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
        items: [
          { id: "num-1", label: "Five", image: "https://via.placeholder.com/100/0000FF/ffffff?text=5", order: 5 },
          { id: "num-2", label: "Two", image: "https://via.placeholder.com/100/0000FF/ffffff?text=2", order: 2 },
          { id: "num-3", label: "Four", image: "https://via.placeholder.com/100/0000FF/ffffff?text=4", order: 4 },
          { id: "num-4", label: "One", image: "https://via.placeholder.com/100/0000FF/ffffff?text=1", order: 1 },
          { id: "num-5", label: "Three", image: "https://via.placeholder.com/100/0000FF/ffffff?text=3", order: 3 }
        ],
        correctOrder: [1, 2, 3, 4, 5]
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
                  <li>Go to: <a href="/quiz/Logic%20Puzzles" className="text-blue-600 hover:underline">Logic Puzzles Category</a></li>
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
                href="/quiz/Logic%20Puzzles"
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
