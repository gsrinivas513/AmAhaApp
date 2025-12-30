/**
 * CreateOrderingPuzzlesFromTemplatesPage.jsx
 * Admin page to quickly create ordering puzzles from templates (Seasons, Months, Alphabet, Days)
 */

import React, { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import AdminLayout from './AdminLayout';

const ORDERING_PUZZLE_TEMPLATES = {
  daysOfWeek: {
    label: '📅 Days of Week',
    subtopicName: 'Days of the Week',
    title: 'Order by Days - Monday to Sunday',
    description: 'Arrange the days of the week in correct order',
    items: [
      { id: 'day-1', label: '📅 Monday', order: 1 },
      { id: 'day-2', label: '📅 Tuesday', order: 2 },
      { id: 'day-3', label: '📅 Wednesday', order: 3 },
      { id: 'day-4', label: '📅 Thursday', order: 4 },
      { id: 'day-5', label: '📅 Friday', order: 5 },
      { id: 'day-6', label: '📅 Saturday', order: 6 },
      { id: 'day-7', label: '📅 Sunday', order: 7 },
    ],
    hasRanges: false, // No ranges for Days (only 7)
  },
  monthsOfYear: {
    label: '🗓️ Months of Year',
    subtopicName: 'Months of Year',
    title: 'Order by Months - January to December',
    description: 'Arrange the months of the year in correct order',
    items: [
      { id: 'month-1', label: '🗓️ January', order: 1 },
      { id: 'month-2', label: '🗓️ February', order: 2 },
      { id: 'month-3', label: '🗓️ March', order: 3 },
      { id: 'month-4', label: '🗓️ April', order: 4 },
      { id: 'month-5', label: '🗓️ May', order: 5 },
      { id: 'month-6', label: '🗓️ June', order: 6 },
      { id: 'month-7', label: '🗓️ July', order: 7 },
      { id: 'month-8', label: '🗓️ August', order: 8 },
      { id: 'month-9', label: '🗓️ September', order: 9 },
      { id: 'month-10', label: '🗓️ October', order: 10 },
      { id: 'month-11', label: '🗓️ November', order: 11 },
      { id: 'month-12', label: '🗓️ December', order: 12 },
    ],
    hasRanges: true,
    ranges: [
      { label: 'Jan-Jun', min: 1, max: 6 },
      { label: 'Jul-Dec', min: 7, max: 12 },
      { label: 'All', min: 1, max: 12 },
    ]
  },
  seasons: {
    label: '🌸 Seasons',
    subtopicName: 'Seasons',
    title: 'Order by Seasons - Spring to Winter',
    description: 'Arrange the seasons in correct order',
    items: [
      { id: 'season-1', label: '🌸 Spring', order: 1 },
      { id: 'season-2', label: '☀️ Summer', order: 2 },
      { id: 'season-3', label: '🍂 Fall', order: 3 },
      { id: 'season-4', label: '❄️ Winter', order: 4 },
    ],
    hasRanges: false, // No ranges for Seasons (only 4)
  },
  alphabet: {
    label: '🔤 Alphabet (A-Z)',
    subtopicName: 'Alphabet',
    title: 'Order by Alphabet - A to Z',
    description: 'Arrange letters in alphabetical order',
    items: Array.from({ length: 26 }, (_, i) => ({
      id: `letter-${i + 1}`,
      label: String.fromCharCode(65 + i),
      order: i + 1
    })),
    hasRanges: true,
    ranges: [
      { label: 'A-P', min: 1, max: 16 },
      { label: 'Q-Z', min: 17, max: 26 },
      { label: 'All', min: 1, max: 26 },
    ]
  }
};

export default function CreateOrderingPuzzlesFromTemplatesPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [success, setSuccess] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState({
    daysOfWeek: false,
    monthsOfYear: false,
    seasons: false,
    alphabet: false,
  });

  const toggleTemplate = (key) => {
    setSelectedTemplates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const createPuzzles = async () => {
    const templatesToCreate = Object.keys(selectedTemplates).filter(key => selectedTemplates[key]);
    
    if (templatesToCreate.length === 0) {
      setStatus('❌ Please select at least one template');
      return;
    }

    setLoading(true);
    setStatus('');
    setSuccess(false);

    try {
      // Find the Ordering/Sequencing topic
      const topicsSnap = await getDocs(
        query(collection(db, 'topics'), where('name', '==', 'Ordering'))
      );
      
      if (topicsSnap.empty) {
        setStatus('❌ Ordering topic not found. Please create it first.');
        setLoading(false);
        return;
      }

      const topicId = topicsSnap.docs[0].id;
      const topicData = topicsSnap.docs[0].data();

      // Find Logic Puzzles category - if not found, create it
      let categoriesSnap = await getDocs(
        query(collection(db, 'categories'), where('name', '==', 'Logic Puzzles'))
      );
      
      let categoryId, categoryData;
      
      if (categoriesSnap.empty) {
        // Auto-create the Logic Puzzles category
        setStatus('⏳ Creating "Logic Puzzles" category...');
        const newCategoryRef = await addDoc(collection(db, 'categories'), {
          name: 'Logic Puzzles',
          label: 'Logic Puzzles',
          description: 'Logical reasoning and puzzle games',
          icon: '🧩',
          featureId: 'puzzles',
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        categoryId = newCategoryRef.id;
        categoryData = {
          name: 'Logic Puzzles',
          label: 'Logic Puzzles',
        };
      } else {
        categoryId = categoriesSnap.docs[0].id;
        categoryData = categoriesSnap.docs[0].data();
      }

      let created = 0;

      // Create a puzzle for each selected template
      for (const templateKey of templatesToCreate) {
        const template = ORDERING_PUZZLE_TEMPLATES[templateKey];
        
        // Find the subtopic
        const subtopicsSnap = await getDocs(
          query(
            collection(db, 'subtopics'),
            where('name', '==', template.subtopicName),
            where('topicId', '==', topicId)
          )
        );

        if (subtopicsSnap.empty) {
          console.warn(`Subtopic ${template.subtopicName} not found, skipping...`);
          continue;
        }

        const subtopicId = subtopicsSnap.docs[0].id;

        // Prepare puzzle data object
        const dataObj = {
          type: 'sequence',
          displayType: templateKey,
          items: template.items,
          correctOrder: template.items.map(item => item.order),
        };

        // Add ranges if this template has them
        if (template.hasRanges && template.ranges) {
          dataObj.numberRanges = template.ranges;
        }

        const puzzleData = {
          title: template.title,
          description: template.description,
          type: 'ordering',
          category: categoryData.label || categoryData.name,
          categoryId: categoryId,
          categoryName: categoryData.label || categoryData.name,
          topic: topicData.label || topicData.name,
          topicId: topicId,
          topicName: topicData.label || topicData.name,
          subtopic: template.subtopicName,
          subtopicId: subtopicId,
          subtopicName: template.subtopicName,
          difficulty: 'easy',
          ageGroup: '6-8',
          featureId: 'puzzles',
          isPublished: true,
          data: dataObj,
          createdAt: new Date(),
          updatedAt: new Date(),
          xpReward: 10,
          timeLimit: null,
          hints: 2,
        };

        await addDoc(collection(db, 'puzzles'), puzzleData);
        created++;
        setStatus(`✅ Created ${created}/${templatesToCreate.length} puzzles...`);
      }

      setStatus(`✅ Successfully created ${created} ordering puzzles!`);
      setSuccess(true);
    } catch (error) {
      console.error('❌ Error:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
        {/* HEADER WITH HELP BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ margin: '0 0 0.5rem 0' }}>⚡ Batch Create Ordering Puzzles</h2>
            <p style={{ color: '#666', margin: '0' }}>
              Pre-made puzzles for Days of Week, Months, Seasons & Alphabet
            </p>
          </div>
          <button
            onClick={() => setShowGuide(!showGuide)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f0f4ff',
              border: '1px solid #667eea',
              borderRadius: '4px',
              color: '#667eea',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
            }}
          >
            {showGuide ? '❌ Hide Guide' : '❓ How This Works'}
          </button>
        </div>

        {/* GUIDE SECTION - COLLAPSIBLE */}
        {showGuide && (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: '#f8f9ff',
              border: '2px solid #e0e7ff',
              borderRadius: '8px',
              marginBottom: '2rem',
            }}
          >
            <h3 style={{ marginTop: 0, color: '#667eea' }}>📖 Understanding This Tool</h3>
            <div style={{ lineHeight: '1.8', color: '#333' }}>
              <p>
                <strong>What Problem Does This Solve?</strong>
                <br/>
                You created <em>subtopic categories</em> (Days of Week, Months, etc.), but these are just organizational folders.
                To make them playable puzzles, you need actual <em>puzzle documents</em>.
              </p>
              
              <p>
                <strong>What Does This Button Do?</strong>
                <br/>
                Clicking "Create Selected Puzzles" instantly generates complete, ready-to-play ordering puzzles using pre-made templates.
              </p>

              <p>
                <strong>What Gets Created?</strong>
                <br/>
                Each puzzle includes:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                <li>✅ Pre-arranged items in correct order (Days: Mon→Sun, Months: Jan→Dec, etc.)</li>
                <li>✅ Linked to your existing subtopic</li>
                <li>✅ Added to "Logic Puzzles" category</li>
                <li>✅ Marked as published & ready to play</li>
                <li>✅ 2 hints and 10 XP reward</li>
              </ul>

              <p>
                <strong>Where Will They Appear?</strong>
                <br/>
                After creation, go to <strong>Admin → Puzzles → View Puzzles</strong> and you'll see your new puzzles in the table.
              </p>

              <p>
                <strong>Can I Edit Them Later?</strong>
                <br/>
                Yes! Go to "Create Visual" → "Sequence/Ordering" and select your puzzle from the list.
              </p>
            </div>
          </div>
        )}

        {/* STEP-BY-STEP INSTRUCTIONS */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#92400e' }}>🎯 Quick Steps:</h3>
          <ol style={{ paddingLeft: '1.5rem', color: '#333', lineHeight: '1.8', margin: 0 }}>
            <li>☑️ <strong>Check the boxes</strong> for the templates you want to create</li>
            <li>🚀 <strong>Click "Create Selected Puzzles"</strong> button</li>
            <li>⏳ <strong>Wait</strong> for the success message</li>
            <li>👀 <strong>View your puzzles</strong> in Admin → Puzzles → View Puzzles table</li>
          </ol>
        </div>

        {/* Template Selection */}
        <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h3>Select Templates to Create:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {Object.entries(ORDERING_PUZZLE_TEMPLATES).map(([key, template]) => (
              <label
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: selectedTemplates[key] ? '2px solid #667eea' : '2px solid #ddd',
                  borderRadius: '8px',
                  backgroundColor: selectedTemplates[key] ? '#f0f4ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedTemplates[key]}
                  onChange={() => toggleTemplate(key)}
                  style={{ marginRight: '0.75rem', width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontWeight: '600', fontSize: '1rem' }}>{template.label}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    {template.items.length} items
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Info Box - What Will Be Created */}
        <div
          style={{
            padding: '1.5rem',
            backgroundColor: '#f0f7ff',
            border: '2px solid #0284c7',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}
        >
          <h3 style={{ marginTop: 0, color: '#0284c7' }}>📝 What Will Be Created:</h3>
          {Object.values(selectedTemplates).every(v => !v) ? (
            <p style={{ color: '#999', margin: 0, fontStyle: 'italic' }}>
              👈 Select at least one template on the left to see what will be created
            </p>
          ) : (
            <ul style={{ lineHeight: '2', margin: '0.5rem 0 0 0', paddingLeft: '1.5rem' }}>
              {Object.entries(ORDERING_PUZZLE_TEMPLATES).map(([key, template]) => (
                selectedTemplates[key] && (
                  <li key={key} style={{ color: '#0284c7', fontWeight: '500' }}>
                    <strong>{template.label}</strong>
                    <br/>
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                      Title: "{template.title}"
                      <br/>
                      Items: {template.items.map(i => i.label).join(', ')}
                    </span>
                  </li>
                )
              ))}
            </ul>
          )}
        </div>

        {/* Create Button */}
        <button
          onClick={createPuzzles}
          disabled={loading || !Object.values(selectedTemplates).some(v => v)}
          style={{
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            backgroundColor: loading ? '#ccc' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            marginBottom: '1.5rem',
          }}
        >
          {loading ? '⏳ Creating...' : '🚀 Create Selected Puzzles'}
        </button>

        {/* Status Message */}
        {status && (
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: success ? '#e8f5e9' : '#fff3cd',
              border: `2px solid ${success ? '#4CAF50' : '#ff9800'}`,
              borderRadius: '4px',
              color: success ? '#2e7d32' : '#856404',
              fontWeight: success ? '600' : '400',
              textAlign: 'center',
              marginBottom: '1.5rem',
              fontSize: success ? '1.1rem' : '1rem',
            }}
          >
            {status}
            {success && (
              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#2e7d32' }}>
                ✅ Your puzzles are now in the system!
                <br/>
                <a href="/admin/puzzles" style={{ color: '#2e7d32', textDecoration: 'underline', fontWeight: 'bold' }}>
                  → View all puzzles now
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
