import React, { useState } from 'react';

/**
 * OrderingQuestion - Arrange items in correct order
 */
export default function OrderingQuestion({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  showFeedback,
  theme,
}) {
  // Parse items - handle both string arrays and object arrays
  const rawItems = question.items || [];
  const items = rawItems.map((item, idx) => ({
    id: `item-${idx}`,
    text: typeof item === 'string' ? item : item.text || item,
  }));

  const [order, setOrder] = useState(selectedAnswer || items);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, index) => {
    if (!answered) {
      setDraggedItem(index);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === targetIndex || answered) return;

    const newOrder = [...order];
    const draggedItemContent = newOrder[draggedItem];
    newOrder.splice(draggedItem, 1);
    newOrder.splice(targetIndex, 0, draggedItemContent);
    setOrder(newOrder);
    setDraggedItem(null);
  };

  const handleSwap = (index1, index2) => {
    if (answered) return;
    const newOrder = [...order];
    [newOrder[index1], newOrder[index2]] = [newOrder[index2], newOrder[index1]];
    setOrder(newOrder);
  };

  const handleSubmit = () => {
    if (!answered) {
      // Check if order is correct - compare text values
      const isCorrect = order.every((item, index) => item.text === items[index].text);
      onAnswer(order, isCorrect);
    }
  };

  const isCorrectOrder = order.every((item, index) => item.text === items[index].text);

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Instruction */}
      {(question.question || question.instruction) && (
        <p style={{
          color: theme.textSecondary,
          fontSize: '14px',
          marginBottom: '16px',
          fontStyle: 'italic',
        }}>
          {question.question || question.instruction}
        </p>
      )}

      {/* Items list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
        {order.map((item, index) => (
          <div
            key={`item-${item.id}`}
            draggable={!answered}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            style={{
              padding: '16px',
              background: answered
                ? isCorrectOrder
                  ? '#4ECB7115'
                  : theme.surfacePrimary
                : draggedItem === index
                ? `${theme.accentPrimary}30`
                : theme.surfacePrimary,
              border: `2px solid ${answered && isCorrectOrder ? '#4ECB71' : theme.border}`,
              borderRadius: '8px',
              cursor: answered ? 'default' : 'grab',
              opacity: draggedItem === index ? 0.5 : 1,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
            onDragEnd={() => setDraggedItem(null)}
          >
            {/* Step number */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '14px',
              flexShrink: 0,
            }}>
              {index + 1}
            </div>

            {/* Item text */}
            <span style={{
              flex: 1,
              fontSize: '15px',
              fontWeight: '500',
              color: theme.textPrimary,
            }}>
              {item.text}
            </span>

            {/* Action buttons */}
            {!answered && (
              <div style={{ display: 'flex', gap: '4px' }}>
                {index > 0 && (
                  <button
                    onClick={() => handleSwap(index, index - 1)}
                    style={{
                      padding: '4px 8px',
                      background: 'transparent',
                      border: `1px solid ${theme.border}`,
                      color: theme.textSecondary,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = `${theme.accentPrimary}20`;
                      e.currentTarget.style.borderColor = theme.accentPrimary;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = theme.border;
                    }}
                  >
                    ↑
                  </button>
                )}
                {index < order.length - 1 && (
                  <button
                    onClick={() => handleSwap(index, index + 1)}
                    style={{
                      padding: '4px 8px',
                      background: 'transparent',
                      border: `1px solid ${theme.border}`,
                      color: theme.textSecondary,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = `${theme.accentPrimary}20`;
                      e.currentTarget.style.borderColor = theme.accentPrimary;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = theme.border;
                    }}
                  >
                    ↓
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Submit button */}
      {!answered && (
        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '12px',
            background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 6px 20px ${theme.accentPrimary}30`;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          Submit Order
        </button>
      )}

      {/* Feedback */}
      {answered && showFeedback && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: isCorrectOrder ? '#4ECB7110' : '#FF6B6B10',
          border: `1px solid ${isCorrectOrder ? '#4ECB71' : '#FF6B6B'}`,
          borderRadius: '8px',
          color: isCorrectOrder ? '#4ECB71' : '#FF6B6B',
          textAlign: 'center',
          fontWeight: '600',
        }}>
          {isCorrectOrder ? '✓ Correct order!' : '✗ Incorrect order. Try again!'}
        </div>
      )}
    </div>
  );
}
