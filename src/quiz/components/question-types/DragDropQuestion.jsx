import React from 'react';

/**
 * DragDropQuestion - Drag items to correct drop zones
 */
export default function DragDropQuestion({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
}) {
  const dropZones = question.dropZones || [];
  const items = question.items || [];
  const [dropMap, setDropMap] = React.useState(selectedAnswer || {});
  const [draggedItem, setDraggedItem] = React.useState(null);

  const handleDragStart = (itemId) => {
    if (!answered) {
      setDraggedItem(itemId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnZone = (zoneId) => {
    if (!draggedItem || answered) return;

    const newDropMap = { ...dropMap };
    newDropMap[draggedItem] = zoneId;
    setDropMap(newDropMap);
    setDraggedItem(null);
  };

  const handleSubmit = () => {
    if (!answered && Object.keys(dropMap).length === items.length) {
      onAnswer(dropMap);
    }
  };

  const allItemsDropped = items.every((item) => dropMap[item.id]);
  const isCorrect = items.every((item) => dropMap[item.id] === item.correctZone);

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Instruction */}
      {question.instruction && (
        <p style={{
          color: theme.textSecondary,
          fontSize: '14px',
          marginBottom: '16px',
          fontStyle: 'italic',
        }}>
          {question.instruction}
        </p>
      )}

      {/* Items to drag */}
      <div style={{
        marginBottom: '20px',
        padding: '16px',
        background: `${theme.accentPrimary}10`,
        border: `2px dashed ${theme.accentPrimary}30`,
        borderRadius: '8px',
      }}>
        <p style={{
          color: theme.textSecondary,
          fontSize: '12px',
          fontWeight: '600',
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}>
          Drag these items:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
          {items.map((item) => {
            const isDropped = !!dropMap[item.id];
            return (
              <div
                key={item.id}
                draggable={!answered && !isDropped}
                onDragStart={() => handleDragStart(item.id)}
                style={{
                  padding: '12px 16px',
                  background: draggedItem === item.id ? `${theme.accentPrimary}30` : theme.surfacePrimary,
                  border: `2px solid ${draggedItem === item.id ? theme.accentPrimary : theme.border}`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isDropped ? theme.textSecondary : theme.textPrimary,
                  cursor: isDropped ? 'default' : 'grab',
                  opacity: isDropped ? 0.5 : 1,
                  transition: 'all 0.2s ease',
                  textDecoration: isDropped ? 'line-through' : 'none',
                }}
              >
                {item.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* Drop zones */}
      <div style={{ display: 'grid', gap: '16px', marginBottom: '20px' }}>
        {dropZones.map((zone) => {
          const itemInZone = items.find((item) => dropMap[item.id] === zone.id);
          const isCorrectItem = itemInZone && itemInZone.correctZone === zone.id;

          return (
            <div
              key={zone.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDropOnZone(zone.id)}
              style={{
                padding: '16px',
                background: answered
                  ? itemInZone && isCorrectItem
                    ? '#4ECB7110'
                    : itemInZone
                    ? '#FF6B6B10'
                    : theme.surfacePrimary
                  : theme.surfacePrimary,
                border: `2px dashed ${
                  answered
                    ? itemInZone && isCorrectItem
                      ? '#4ECB71'
                      : itemInZone
                      ? '#FF6B6B'
                      : theme.border
                    : theme.border
                }`,
                borderRadius: '8px',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <p style={{
                  color: theme.textSecondary,
                  fontSize: '12px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}>
                  {zone.label}
                </p>
                {itemInZone ? (
                  <div style={{
                    padding: '12px 16px',
                    background: `linear-gradient(135deg, ${theme.accentPrimary}20, ${theme.accentSecondary}10)`,
                    border: `2px solid ${theme.accentPrimary}`,
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: theme.textPrimary,
                  }}>
                    {itemInZone.text}
                    {answered && (isCorrectItem ? ' ✓' : ' ✗')}
                  </div>
                ) : (
                  <p style={{ color: theme.textSecondary, fontSize: '13px' }}>Drop item here</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit button */}
      {!answered && (
        <button
          onClick={handleSubmit}
          disabled={!allItemsDropped}
          style={{
            width: '100%',
            padding: '12px',
            background: allItemsDropped
              ? `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`
              : `${theme.border}50`,
            color: allItemsDropped ? '#fff' : theme.textSecondary,
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: allItemsDropped ? 'pointer' : 'default',
            transition: 'all 0.3s ease',
          }}
        >
          Submit
        </button>
      )}

      {/* Feedback */}
      {answered && showFeedback && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: isCorrect ? '#4ECB7110' : '#FF6B6B10',
          border: `1px solid ${isCorrect ? '#4ECB71' : '#FF6B6B'}`,
          borderRadius: '8px',
          color: isCorrect ? '#4ECB71' : '#FF6B6B',
          textAlign: 'center',
          fontWeight: '600',
        }}>
          {isCorrect ? '✓ All items in correct zones!' : '✗ Some items are in wrong zones.'}
        </div>
      )}
    </div>
  );
}
