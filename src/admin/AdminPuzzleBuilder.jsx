/**
 * Admin Puzzle Builder Component
 * Universal UI for creating and editing puzzles of any type
 * Multi-step builder following Quiz Builder pattern
 */

import React, { useState, useEffect } from 'react';
import { collection, addDoc, doc, setDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const PUZZLE_TYPES = [
  { id: 'find-pair', label: 'Find Pairs', icon: '🔍' },
  { id: 'ordering', label: 'Ordering', icon: '🔢' },
  { id: 'picture-shadow', label: 'Picture Shadow', icon: '🌙' },
  { id: 'picture-word', label: 'Picture Word', icon: '🖼️' },
  { id: 'spot-difference', label: 'Spot Difference', icon: '🔎' },
  { id: 'word-search', label: 'Word Search', icon: '🔤' },
  { id: 'jigsaw', label: 'Jigsaw', icon: '🧩' },
];

const AUDIENCES = ['All Users', 'Kids 5-12', 'Students 13-18', 'Professionals', 'Programmers'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Expert'];

// Map visual types to their Firestore typeKey
const typeKeyFor = (editorType) => ({
  'find-pair': 'findPairs',
  'picture-word': 'pictureWordMatching',
  'picture-shadow': 'pictureShadow',
  'word-search': 'wordSearch',
  'spot-difference': 'spotDifference',
  'ordering': 'ordering',
  'jigsaw': 'jigsaw',
}[editorType] || '');

/**
 * Step 1: Puzzle Metadata Form
 */
const PuzzleMetadataStep = ({ puzzle, onUpdate, theme, templates = [], templatesLoading = false }) => {
  const handleChange = (field, value) => {
    onUpdate({ ...puzzle, [field]: value });
  };

  return (
    <div className="form-step metadata-step" style={{ padding: '20px' }}>
      <h3 style={{ color: theme?.textPrimary, marginTop: 0 }}>Puzzle Details</h3>

      {/* Type & Template on same row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: theme?.textPrimary }}>
            Puzzle Type *
          </label>
          <select
            value={puzzle.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: `2px solid ${theme?.border}`,
              background: theme?.surfacePrimary,
              color: theme?.textPrimary,
              fontSize: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          >
            <option value="">Select a puzzle type</option>
            {PUZZLE_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.icon} {t.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: theme?.textPrimary }}>
            📋 Template {puzzle.type ? '' : '(select type first)'}
          </label>
          <select
            value={puzzle.templateId || ''}
            onChange={(e) => handleChange('templateId', e.target.value)}
            disabled={!puzzle.type || templatesLoading || templates.length === 0}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: `2px solid ${theme?.border}`,
              background: theme?.surfacePrimary,
              color: theme?.textPrimary,
              fontSize: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
              opacity: !puzzle.type ? 0.5 : 1,
            }}
          >
            <option value="">{!puzzle.type ? 'Select type first' : templatesLoading ? '⏳ Loading...' : 'Choose template (optional)'}</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          {puzzle.type && templates.length === 0 && !templatesLoading && (
            <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: theme?.textSecondary }}>
              No templates available
            </p>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: theme?.textPrimary }}>
          Title *
        </label>
        <input
          type="text"
          placeholder="e.g., Matching Numbers 1-5"
          value={puzzle.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          required
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: `2px solid ${theme?.border}`,
            background: theme?.surfacePrimary,
            color: theme?.textPrimary,
            fontSize: '14px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: theme?.textPrimary }}>
            Target Audience *
          </label>
          <select
            value={puzzle.ageGroup || ''}
            onChange={(e) => handleChange('ageGroup', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: `2px solid ${theme?.border}`,
              background: theme?.surfacePrimary,
              color: theme?.textPrimary,
              fontSize: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          >
            <option value="">Select audience</option>
            {AUDIENCES.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: theme?.textPrimary }}>
            Difficulty *
          </label>
          <select
            value={puzzle.difficulty || ''}
            onChange={(e) => handleChange('difficulty', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: `2px solid ${theme?.border}`,
              background: theme?.surfacePrimary,
              color: theme?.textPrimary,
              fontSize: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          >
            <option value="">Select difficulty</option>
            {DIFFICULTIES.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: theme?.textPrimary }}>
            XP Reward
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={puzzle.xpReward || 10}
            onChange={(e) => handleChange('xpReward', Number(e.target.value) || 10)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '8px',
              border: `2px solid ${theme?.border}`,
              background: theme?.surfacePrimary,
              color: theme?.textPrimary,
              fontSize: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: theme?.textPrimary }}>
          Description
        </label>
        <textarea
          placeholder="Optional description for this puzzle"
          value={puzzle.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: `2px solid ${theme?.border}`,
            background: theme?.surfacePrimary,
            color: theme?.textPrimary,
            fontSize: '14px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
            minHeight: '80px',
            resize: 'vertical',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme?.textPrimary, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={puzzle.isPublished || false}
            onChange={(e) => handleChange('isPublished', e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <span style={{ fontWeight: 600 }}>Publish this puzzle</span>
        </label>
      </div>
    </div>
  );
};

/**
 * Step 2: Advanced Settings
 */
const AdvancedSettingsStep = ({ puzzle, onUpdate, theme }) => {
  const handleChange = (field, value) => {
    onUpdate({ ...puzzle, [field]: value });
  };

  return (
    <div className="form-step advanced-step" style={{ padding: '20px' }}>
      <h3 style={{ color: theme?.textPrimary, marginTop: 0 }}>Advanced Settings</h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: theme?.textPrimary }}>
          Category
        </label>
        <input
          type="text"
          placeholder="e.g., Numbers, Shapes, Animals"
          value={puzzle.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: `2px solid ${theme?.border}`,
            background: theme?.surfacePrimary,
            color: theme?.textPrimary,
            fontSize: '14px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: theme?.textPrimary }}>
          Tags (comma-separated)
        </label>
        <input
          type="text"
          placeholder="e.g., learning, fun, interactive"
          value={(puzzle.tags || []).join(', ')}
          onChange={(e) => handleChange('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: `2px solid ${theme?.border}`,
            background: theme?.surfacePrimary,
            color: theme?.textPrimary,
            fontSize: '14px',
            fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ padding: '12px', background: theme?.background, borderRadius: '8px', marginTop: '16px' }}>
        <p style={{ color: theme?.textSecondary, margin: '0 0 8px 0', fontSize: '13px' }}>
          ℹ️ Content Management
        </p>
        <p style={{ color: theme?.textSecondary, margin: 0, fontSize: '12px' }}>
          You'll be able to add puzzle content (images, text, answers) after creating this puzzle.
        </p>
      </div>
    </div>
  );
};

/**
 * Main Puzzle Builder Component
 */
const AdminPuzzleBuilder = ({ 
  theme = {}, 
  initialData = null, 
  onSave, 
  onClose,
  TemplateInputForm = null,
  runTemplate = null,
}) => {
  const [puzzle, setPuzzle] = useState(
    initialData || {
      title: '',
      type: '',
      templateId: '',
      ageGroup: '',
      difficulty: '',
      xpReward: 10,
      isPublished: false,
      description: '',
      category: '',
      tags: [],
      data: {},
    }
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateInputs, setTemplateInputs] = useState(null);
  const [templateResult, setTemplateResult] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateError, setTemplateError] = useState('');

  const totalSteps = 3; // Always 3 steps: Basics, Template, Settings

  // Load templates when puzzle type changes
  useEffect(() => {
    const loadTemplates = async () => {
      if (!puzzle.type) {
        setTemplates([]);
        setSelectedTemplate(null);
        return;
      }

      try {
        setTemplatesLoading(true);
        const tk = typeKeyFor(puzzle.type);
        if (!tk) {
          setTemplates([]);
          return;
        }

        const q = query(collection(db, 'puzzleTemplates'), where('typeKey', '==', tk));
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setTemplates(list);

        // Auto-select first template if available
        if (list.length > 0 && !puzzle.templateId) {
          const firstTemplate = list[0];
          setPuzzle(prev => ({ ...prev, templateId: firstTemplate.id }));
          setSelectedTemplate(firstTemplate);
        }
      } catch (e) {
        console.warn('Failed to load templates:', e);
        setTemplates([]);
      } finally {
        setTemplatesLoading(false);
      }
    };

    loadTemplates();
  }, [puzzle.type]);

  // Update selectedTemplate when templateId changes
  useEffect(() => {
    if (puzzle.templateId && templates.length > 0) {
      const tpl = templates.find(t => t.id === puzzle.templateId);
      setSelectedTemplate(tpl || null);
      // Reset template inputs when template changes
      setTemplateInputs(null);
      setTemplateResult(null);
      setTemplateError('');
    }
  }, [puzzle.templateId, templates]);

  const canGoNext = () => {
    if (currentStep === 1) {
      return puzzle.title && puzzle.type && puzzle.ageGroup && puzzle.difficulty;
    }
    if (currentStep === 2) {
      // Template step is mandatory - require template selection and execution
      return puzzle.templateId && TemplateInputForm && runTemplate && !!templateResult;
    }
    return true;
  };

  const handleSave = async () => {
    if (!puzzle.title || !puzzle.type || !puzzle.ageGroup || !puzzle.difficulty) {
      setSaveStatus('error: Please fill all required fields on Basics step');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }
    if (!puzzle.templateId || !templateResult) {
      setSaveStatus('error: Please select a template and execute it on Template step');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    // If template selected, require template execution
    if (puzzle.templateId && TemplateInputForm && runTemplate && !templateResult) {
      setSaveStatus('error: Please execute the template first');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    setIsSaving(true);
    setSaveStatus('Saving...');

    try {
      const puzzleData = {
        ...puzzle,
        featureId: 'puzzles',
        puzzleType: 'template-driven',
        ...(templateResult && { data: templateResult }),
        createdAt: initialData?.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (initialData?.id) {
        // Update existing puzzle
        await setDoc(doc(db, 'puzzles', initialData.id), puzzleData);
        setSaveStatus('✓ Puzzle updated successfully!');
      } else {
        // Create new puzzle
        const docRef = await addDoc(collection(db, 'puzzles'), puzzleData);
        setSaveStatus('✓ Puzzle created successfully!');
        console.log('Created puzzle with ID:', docRef.id);
      }

      setTimeout(() => {
        setSaveStatus('saved');
        if (onSave) {
          onSave(puzzle);
        }
      }, 500);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus(`error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const currentType = PUZZLE_TYPES.find(t => t.id === puzzle.type);

  return (
    <div style={{
      color: theme.textPrimary,
      backgroundColor: theme.surfacePrimary || theme.cardBg || '#fff',
      borderRadius: '12px',
      padding: '0',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: `2px solid ${theme.border}`,
      }}>
        <div>
          <h2 style={{ margin: '0 0 4px 0', color: theme.textPrimary }}>
            {puzzle.title || 'Untitled Puzzle'}
          </h2>
          <p style={{ margin: 0, color: theme.textSecondary, fontSize: '13px' }}>
            {initialData ? '✏️ Editing' : '✨ Creating'} 
            {currentType && ` • ${currentType.icon} ${currentType.label}`}
            {puzzle.difficulty && ` • ${puzzle.difficulty}`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {saveStatus && (
            <span style={{
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: saveStatus.includes('error') ? '#FF8E72' : '#27AE60',
              color: '#fff',
            }}>
              {saveStatus === 'saved' ? '✓ Saved' : saveStatus === 'Saving...' ? '⏳ Saving...' : saveStatus}
            </span>
          )}
        </div>
      </div>

      {/* Step Indicator */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        justifyContent: 'space-between',
      }}>
        {['Basics', 'Template', 'Settings'].map((label, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentStep(idx + 1)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: `2px solid ${currentStep === idx + 1 ? theme.accentPrimary : theme.border}`,
              background: currentStep === idx + 1 ? theme.accentPrimary : 'transparent',
              color: currentStep === idx + 1 ? '#fff' : theme.textSecondary,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              opacity: currentStep === idx + 1 ? 1 : 0.7,
              transform: currentStep === idx + 1 ? 'scale(1)' : 'scale(0.98)',
            }}
            onMouseOver={(e) => {
              if (currentStep !== idx + 1) {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
            onMouseOut={(e) => {
              if (currentStep !== idx + 1) {
                e.currentTarget.style.opacity = '0.7';
                e.currentTarget.style.transform = 'scale(0.98)';
              }
            }}
          >
            {idx + 1}. {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ minHeight: '300px', marginBottom: '20px' }}>
        {currentStep === 1 && (
          <PuzzleMetadataStep puzzle={puzzle} onUpdate={setPuzzle} theme={theme} templates={templates} templatesLoading={templatesLoading} />
        )}
        {currentStep === 2 && TemplateInputForm && runTemplate && (
          <div style={{ padding: '20px' }}>
            <h3 style={{ color: theme.textPrimary, marginTop: 0 }}>Template Input</h3>
            <p style={{ color: theme.textSecondary, marginBottom: '16px' }}>
              Fill in the required fields to generate the puzzle:
            </p>
            <TemplateInputForm
              template={selectedTemplate}
              typeKey={puzzle.type}
              onInputsReady={async (inputs) => {
                setTemplateInputs(inputs);
                setTemplateLoading(true);
                setTemplateError('');
                try {
                  const result = await runTemplate(puzzle.type, selectedTemplate.schema, inputs);
                  if (!result.ok) {
                    setTemplateError(result.error || 'Failed to generate puzzle');
                    setTemplateResult(null);
                    return;
                  }
                  setTemplateResult(result.result);
                } catch (e) {
                  console.error('Template execution error:', e);
                  setTemplateError(e.message || 'Execution error');
                  setTemplateResult(null);
                } finally {
                  setTemplateLoading(false);
                }
              }}
              onLoading={(loading) => setTemplateLoading(loading)}
            />
            {templateError && (
              <div style={{ background: '#fee2e2', border: '2px solid #fca5a5', borderRadius: '8px', padding: '12px', marginTop: '16px', color: '#991b1b', fontSize: '13px' }}>
                ⚠️ {templateError}
              </div>
            )}
            {templateResult && (
              <div style={{ background: '#ecfdf5', border: '2px solid #86efac', borderRadius: '8px', padding: '12px', marginTop: '16px', color: '#166534', fontSize: '13px' }}>
                ✅ Puzzle template executed successfully!
              </div>
            )}
          </div>
        )}
        {currentStep === 3 && (
          <AdvancedSettingsStep puzzle={puzzle} onUpdate={setPuzzle} theme={theme} />
        )}
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'space-between',
        paddingTop: '16px',
        borderTop: `2px solid ${theme.border}`,
      }}>
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: `2px solid ${theme.border}`,
            background: 'transparent',
            color: currentStep === 1 ? theme.textSecondary : theme.textPrimary,
            fontWeight: 600,
            cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: currentStep === 1 ? 0.5 : 1,
          }}
        >
          ← Previous
        </button>

        <div style={{ display: 'flex', gap: '12px' }}>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: `2px solid ${theme.border}`,
                background: 'transparent',
                color: theme.textSecondary,
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ✕ Close
            </button>
          )}

          {currentStep < totalSteps ? (
            <button
              onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              disabled={!canGoNext()}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: canGoNext() ? theme.accentPrimary : theme.border,
                color: '#fff',
                fontWeight: 600,
                cursor: canGoNext() ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                opacity: canGoNext() ? 1 : 0.5,
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={isSaving || !canGoNext()}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                border: 'none',
                background: canGoNext() && !isSaving ? theme.accentPrimary : theme.border,
                color: '#fff',
                fontWeight: 600,
                cursor: canGoNext() && !isSaving ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                opacity: canGoNext() ? 1 : 0.5,
              }}
            >
              {isSaving ? '⏳ Saving...' : initialData ? '💾 Update Puzzle' : '💾 Save Puzzle'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPuzzleBuilder;
