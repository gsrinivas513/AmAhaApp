import React from 'react';

export default function OverviewTab({
  theme,
  dashboardStats,
  dbStats,
  hoveredCard,
  setHoveredCard,
  showAddQuizForm,
  setShowAddQuizForm,
  showAddPuzzleForm,
  setShowAddPuzzleForm,
  showAddStoryForm,
  setShowAddStoryForm,
  quizFormData,
  setQuizFormData,
  puzzleFormData,
  setPuzzleFormData,
  puzzleDuplicateWarning,
  setPuzzleDuplicateWarning,
  storyFormData,
  setStoryFormData,
  CATEGORIES,
  AUDIENCES,
  DIFFICULTIES,
  PUZZLE_TYPES,
  STORY_CATEGORIES,
  RECENT_ACTIVITIES,
  addingSampleQuizzes,
  addSampleQuizzes,
  handleAddQuiz,
  handleAddPuzzle,
  handleAddStory,
  generateSlug,
  checkPuzzleNameDuplicate,
  checkPuzzleDuplicates,
}) {
  return (
    <>
      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
      }}>
        {dashboardStats.map((stat, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredCard(`stat-${idx}`)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: theme.surfacePrimary,
              border: `2px solid ${theme.border}`,
              borderRadius: '16px',
              padding: '24px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              transform: hoveredCard === `stat-${idx}` ? 'translateY(-8px)' : 'translateY(0)',
              borderColor: hoveredCard === `stat-${idx}` ? stat.color : theme.border,
              boxShadow: hoveredCard === `stat-${idx}` ? `0 12px 24px ${stat.color}25` : 'none',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>{stat.icon}</div>
            <div style={{ color: theme.textSecondary, fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
              {stat.label}
            </div>
            <div style={{ color: stat.color, fontSize: '32px', fontWeight: '800', marginBottom: '8px' }}>
              {stat.value}
            </div>
            <div style={{ color: theme.textSecondary, fontSize: '12px' }}>{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: theme.textPrimary, fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
          ⚡ Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <button
            onClick={() => setShowAddPuzzleForm(!showAddPuzzleForm)}
            style={{
              padding: '20px',
              background: '#FFE66D20',
              border: `2px solid #FFE66D`,
              borderRadius: '12px',
              color: '#FFE66D',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#FFE66D40';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#FFE66D20';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ➕ Add Puzzle
          </button>

          <button
            onClick={() => setShowAddStoryForm(!showAddStoryForm)}
            style={{
              padding: '20px',
              background: '#FF85A220',
              border: `2px solid #FF85A2`,
              borderRadius: '12px',
              color: '#FF85A2',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#FF85A240';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#FF85A220';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ➕ Add Story
          </button>

          <button
            style={{
              padding: '20px',
              background: '#95E1D320',
              border: `2px solid #95E1D3`,
              borderRadius: '12px',
              color: '#95E1D3',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#95E1D340';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = '#95E1D320';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📈 View Analytics
          </button>

          <button
            onClick={addSampleQuizzes}
            disabled={addingSampleQuizzes}
            style={{
              padding: '20px',
              background: '#FF85A220',
              border: `2px solid #FF85A2`,
              borderRadius: '12px',
              color: '#FF85A2',
              fontSize: '15px',
              fontWeight: '600',
              cursor: addingSampleQuizzes ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: addingSampleQuizzes ? 0.6 : 1,
            }}
            onMouseOver={e => {
              if (!addingSampleQuizzes) {
                e.currentTarget.style.background = '#FF85A240';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }
            }}
            onMouseOut={e => {
              if (!addingSampleQuizzes) {
                e.currentTarget.style.background = '#FF85A220';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {addingSampleQuizzes ? '⏳ Adding...' : '🧪 Add Sample Quizzes'}
          </button>
        </div>
      </div>

      {/* Database Statistics Section */}
      {dbStats && (
        <div style={{ marginBottom: '40px', background: theme.surfacePrimary, border: `2px solid ${theme.border}`, borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ color: theme.textPrimary, fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            📊 Database Overview
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
            <div style={{ background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                {dbStats.collections.features}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Features</div>
            </div>
            <div style={{ background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                {dbStats.collections.categories}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Categories</div>
            </div>
            <div style={{ background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                {dbStats.collections.topics}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Topics</div>
            </div>
            <div style={{ background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                {dbStats.collections.subtopics}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Subtopics</div>
            </div>
            <div style={{ background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: '#0284c7' }}>
                {dbStats.puzzles.valid}/{dbStats.puzzles.total}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Puzzles (valid)</div>
            </div>
            <div style={{ background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                {dbStats.collections.questions}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Questions</div>
            </div>
            <div style={{ background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                {dbStats.collections.quizzes}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Quizzes</div>
            </div>
            <div style={{ background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px', fontWeight: '700', color: theme.accentPrimary }}>
                {dbStats.collections.stories}
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Stories</div>
            </div>
          </div>
        </div>
      )}

      {/* Add Quiz Form - Inline */}
      {showAddQuizForm && (
        <div style={{ marginBottom: '40px', background: theme.surfacePrimary, border: `2px solid ${theme.border}`, borderRadius: '16px', padding: '32px' }}>
          <h3 style={{ color: theme.textPrimary, fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
            ➕ Add New Quiz
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Quiz Title"
              value={quizFormData.title}
              onChange={e => setQuizFormData({ ...quizFormData, title: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            />
            <select
              value={quizFormData.category}
              onChange={e => setQuizFormData({ ...quizFormData, category: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={quizFormData.audience}
              onChange={e => setQuizFormData({ ...quizFormData, audience: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            >
              <option value="">Select Audience</option>
              {AUDIENCES.map(aud => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Number of Questions"
              value={quizFormData.questions}
              onChange={e => setQuizFormData({ ...quizFormData, questions: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            />
            <select
              value={quizFormData.difficulty}
              onChange={e => setQuizFormData({ ...quizFormData, difficulty: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            >
              <option value="">Select Difficulty</option>
              {DIFFICULTIES.map(diff => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleAddQuiz}
              style={{ padding: '12px 32px', background: `linear-gradient(135deg, #4ECDC4, #FFE66D)`, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              Save Quiz
            </button>
            <button
              onClick={() => {
                setShowAddQuizForm(false);
                setQuizFormData({ title: '', category: '', audience: '', questions: '', difficulty: '' });
              }}
              style={{ padding: '12px 32px', background: 'transparent', color: theme.textPrimary, border: `2px solid ${theme.border}`, borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Puzzle Form - Inline */}
      {showAddPuzzleForm && (
        <div style={{ marginBottom: '40px', background: theme.surfacePrimary, border: `2px solid ${theme.border}`, borderRadius: '16px', padding: '32px' }}>
          <h3 style={{ color: theme.textPrimary, fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
            ➕ Add New Puzzle
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textSecondary, marginBottom: '6px' }}>
                Display Label (e.g., "Programming World")
              </label>
              <input
                type="text"
                placeholder="e.g., Programming World"
                value={puzzleFormData.displayLabel}
                onChange={async e => {
                  const newLabel = e.target.value;
                  const newName = generateSlug(newLabel);
                  setPuzzleFormData({ ...puzzleFormData, displayLabel: newLabel, name: newName });

                  if (newName) {
                    const isDuplicate = await checkPuzzleNameDuplicate(newName);
                    setPuzzleDuplicateWarning(prev => ({ ...(prev || {}), hasDuplicateName: !!isDuplicate, name: newName }));
                  } else {
                    setPuzzleDuplicateWarning(null);
                  }

                  if (newLabel.trim()) {
                    const similarResult = await checkPuzzleDuplicates(newLabel);
                    setPuzzleDuplicateWarning(prev => ({ ...(prev || {}), ...similarResult }));
                  }
                }}
                style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: `8px`, color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: theme.textSecondary, marginBottom: '6px' }}>
                Unique Name (auto-generated from label)
              </label>
              <input
                type="text"
                placeholder="Auto-generated from label"
                value={puzzleFormData.name}
                readOnly
                style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: `8px`, color: theme.textSecondary, fontSize: '14px', fontFamily: 'inherit', opacity: '0.6', cursor: 'not-allowed' }}
              />
            </div>
            <select
              value={puzzleFormData.type}
              onChange={e => setPuzzleFormData({ ...puzzleFormData, type: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            >
              <option value="">Select Puzzle Type</option>
              {PUZZLE_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              value={puzzleFormData.audience}
              onChange={e => setPuzzleFormData({ ...puzzleFormData, audience: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            >
              <option value="">Select Audience</option>
              {AUDIENCES.map(aud => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Number of Pieces"
              value={puzzleFormData.pieces}
              onChange={e => setPuzzleFormData({ ...puzzleFormData, pieces: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            />
            <select
              value={puzzleFormData.difficulty}
              onChange={e => setPuzzleFormData({ ...puzzleFormData, difficulty: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            >
              <option value="">Select Difficulty</option>
              {DIFFICULTIES.map(diff => (
                <option key={diff} value={diff}>
                  {diff}
                </option>
              ))}
            </select>
          </div>

          {puzzleDuplicateWarning && ((puzzleDuplicateWarning.hasDuplicateName) || (puzzleDuplicateWarning.similars && puzzleDuplicateWarning.similars.length > 0)) && (
            <div style={{ marginBottom: '24px', borderRadius: '12px', padding: '16px', background: puzzleDuplicateWarning.hasDuplicateName ? '#FEE2E2' : '#FFFBEB', borderLeft: `4px solid ${puzzleDuplicateWarning.hasDuplicateName ? '#DC2626' : '#F59E0B'}` }}>
              {puzzleDuplicateWarning.hasDuplicateName && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ color: '#DC2626', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
                    ⛔ NAME ALREADY EXISTS (UNIQUE)
                  </div>
                  <div style={{ color: '#991B1B', fontSize: '13px', lineHeight: '1.5' }}>
                    A puzzle with the unique name <strong>"{puzzleDuplicateWarning.name}"</strong> already exists. Please choose a different label.
                  </div>
                </div>
              )}

              {puzzleDuplicateWarning.similars && puzzleDuplicateWarning.similars.length > 0 && (
                <div>
                  <div style={{ color: '#D97706', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
                    ℹ️ RELATED PUZZLES FOUND ({puzzleDuplicateWarning.similars.length}) - FYI Only
                  </div>
                  <div style={{ color: '#92400E', fontSize: '13px', lineHeight: '1.6' }}>
                    These similar puzzles exist, but you can still create yours if it's intentional (e.g., different difficulty, variant):
                    {puzzleDuplicateWarning.similars.map((sim, idx) => (
                      <div key={idx} style={{ marginTop: '4px' }}>
                        • "{sim.title}" – {(sim.similarity * 100).toFixed(0)}% match
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleAddPuzzle}
              disabled={puzzleDuplicateWarning && puzzleDuplicateWarning.hasDuplicateName}
              style={{ padding: '12px 32px', background: puzzleDuplicateWarning && puzzleDuplicateWarning.hasDuplicateName ? '#CCCCCC' : `linear-gradient(135deg, #FFE66D, #FF85A2)`, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: puzzleDuplicateWarning && puzzleDuplicateWarning.hasDuplicateName ? 'not-allowed' : 'pointer', opacity: puzzleDuplicateWarning && puzzleDuplicateWarning.hasDuplicateName ? '0.6' : '1' }}
            >
              Save Puzzle
            </button>
            <button
              onClick={() => {
                setShowAddPuzzleForm(false);
                setPuzzleFormData({ displayLabel: '', name: '', type: '', audience: '', pieces: '', difficulty: '' });
              }}
              style={{ padding: '12px 32px', background: 'transparent', color: theme.textPrimary, border: `2px solid ${theme.border}`, borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Story Form - Inline */}
      {showAddStoryForm && (
        <div style={{ marginBottom: '40px', background: theme.surfacePrimary, border: `2px solid ${theme.border}`, borderRadius: '16px', padding: '32px' }}>
          <h3 style={{ color: theme.textPrimary, fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>
            ➕ Add New Story
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <input
              type="text"
              placeholder="Story Title"
              value={storyFormData.title}
              onChange={e => setStoryFormData({ ...storyFormData, title: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            />
            <select
              value={storyFormData.category}
              onChange={e => setStoryFormData({ ...storyFormData, category: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            >
              <option value="">Select Category</option>
              {STORY_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={storyFormData.audience}
              onChange={e => setStoryFormData({ ...storyFormData, audience: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            >
              <option value="">Select Audience</option>
              {AUDIENCES.map(aud => (
                <option key={aud} value={aud}>
                  {aud}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Number of Chapters"
              value={storyFormData.chapters}
              onChange={e => setStoryFormData({ ...storyFormData, chapters: e.target.value })}
              style={{ padding: '12px 16px', background: theme.background, border: `2px solid ${theme.border}`, borderRadius: '8px', color: theme.textPrimary, fontSize: '14px', fontFamily: 'inherit' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={handleAddStory}
              style={{ padding: '12px 32px', background: `linear-gradient(135deg, #FF85A2, #FF6B6B)`, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              Save Story
            </button>
            <button
              onClick={() => {
                setShowAddStoryForm(false);
                setStoryFormData({ title: '', category: '', audience: '', chapters: '', selectedTemplate: '' });
              }}
              style={{ padding: '12px 32px', background: 'transparent', color: theme.textPrimary, border: `2px solid ${theme.border}`, borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      <div>
        <h2 style={{ color: theme.textPrimary, fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>
          📋 Recent Activities
        </h2>
        <div style={{ background: theme.surfacePrimary, border: `2px solid ${theme.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          {RECENT_ACTIVITIES.map((activity, idx) => (
            <div
              key={idx}
              style={{
                padding: '16px 24px',
                borderBottom: idx !== RECENT_ACTIVITIES.length - 1 ? `1px solid ${theme.border}` : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flex: 1 }}>
                <div style={{ fontSize: '24px' }}>
                  {activity.type === 'quiz' ? '❓' : activity.type === 'puzzle' ? '🧩' : activity.type === 'story' ? '📖' : '👤'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: theme.textPrimary, fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                    {activity.action} {activity.title}
                  </div>
                  <div style={{ color: theme.textSecondary, fontSize: '12px' }}>by {activity.user}</div>
                </div>
              </div>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
