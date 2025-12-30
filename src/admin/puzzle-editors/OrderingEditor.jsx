// src/admin/puzzle-editors/OrderingEditor.jsx
// Editor for ordering/sequencing puzzles
import React, { useState, forwardRef } from "react";
import ImageUpload from "../../components/ImageUpload";

const ORDERING_TEMPLATES = {
  custom: {
    label: "Custom Items",
    description: "Create with custom items",
    items: [],
    hasRanges: false,
  },
  daysOfWeek: {
    label: "Days of Week",
    description: "Monday through Sunday",
    items: [
      { id: 'day-1', label: '📅 Monday', order: 1 },
      { id: 'day-2', label: '📅 Tuesday', order: 2 },
      { id: 'day-3', label: '📅 Wednesday', order: 3 },
      { id: 'day-4', label: '📅 Thursday', order: 4 },
      { id: 'day-5', label: '📅 Friday', order: 5 },
      { id: 'day-6', label: '📅 Saturday', order: 6 },
      { id: 'day-7', label: '📅 Sunday', order: 7 },
    ],
    hasRanges: false,
  },
  monthsOfYear: {
    label: "Months of Year",
    description: "January through December",
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
    label: "Seasons",
    description: "Spring, Summer, Fall, Winter",
    items: [
      { id: 'season-1', label: '🌸 Spring', order: 1 },
      { id: 'season-2', label: '☀️ Summer', order: 2 },
      { id: 'season-3', label: '🍂 Fall', order: 3 },
      { id: 'season-4', label: '❄️ Winter', order: 4 },
    ],
    hasRanges: false,
  },
  alphabet: {
    label: "Alphabet (A-Z)",
    description: "Letters in order",
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

const OrderingEditor = forwardRef(({ data, onChange }, ref) => {
  const [items, setItems] = useState(data.items || []);
  const [itemType, setItemType] = useState(data.itemType || "numbers");
  const [maxRange, setMaxRange] = useState(data.maxRange || 0);
  const [showNumberRangeHelper, setShowNumberRangeHelper] = useState(false);
  // Initialize selectedTemplate from data.displayType if available
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    if (data.displayType && ORDERING_TEMPLATES[data.displayType]) {
      return data.displayType;
    }
    return "custom";
  });
  const [currentRanges, setCurrentRanges] = useState(() => {
    if (data.displayType && ORDERING_TEMPLATES[data.displayType]) {
      const template = ORDERING_TEMPLATES[data.displayType];
      if (template.hasRanges && template.ranges) {
        return template.ranges;
      }
    }
    return [];
  });

  // Auto-detect template from existing data on data change
  React.useEffect(() => {
    if (data.displayType && ORDERING_TEMPLATES[data.displayType]) {
      setSelectedTemplate(data.displayType);
      const template = ORDERING_TEMPLATES[data.displayType];
      if (template.hasRanges && template.ranges) {
        setCurrentRanges(template.ranges);
      } else {
        setCurrentRanges([]);
      }
    }
  }, [data.displayType]);

  // Generate number ranges based on max range
  const generateNumberRanges = (max) => {
    if (max <= 0) return [];
    
    const ranges = [];
    for (let i = 1; i <= max; i += 10) {
      const start = i;
      const end = Math.min(i + 9, max);
      ranges.push({
        label: `${start}-${end}`,
        min: start,
        max: end,
      });
    }
    return ranges;
  };

  // Generate number items from 1 to maxRange
  const handleGenerateNumbers = () => {
    if (maxRange <= 0) {
      alert("Please enter a valid maximum range");
      return;
    }

    const newItems = [];
    for (let i = 1; i <= maxRange; i++) {
      newItems.push({
        id: `item-${i}`,
        image: "",
        label: String(i),
        order: i,
        number: i,
      });
    }

    setItems(newItems);
    onChange({ 
      items: newItems, 
      itemType: "numbers",
      maxRange,
      numberRanges: generateNumberRanges(maxRange),
    });
    setShowNumberRangeHelper(false);
  };

  const handleAddItem = () => {
    const newItems = [
      ...items,
      {
        id: `item-${Date.now()}`,
        image: "",
        label: "",
        order: items.length + 1,
      },
    ];
    setItems(newItems);
    onChange({ items: newItems, itemType, maxRange, numberRanges: generateNumberRanges(maxRange) });
  };

  const handleLoadTemplate = (templateKey) => {
    const template = ORDERING_TEMPLATES[templateKey];
    const newItems = template.items.map(item => ({
      ...item,
      id: item.id || `item-${Date.now()}-${Math.random()}`
    }));
    setItems(newItems);
    setSelectedTemplate(templateKey);
    
    // Show ranges preview
    if (template.hasRanges && template.ranges) {
      setCurrentRanges(template.ranges);
    } else {
      setCurrentRanges([]);
    }
    
    // Include ranges in the data if template has them
    const dataObj = { 
      items: newItems, 
      itemType: "sequence", 
      maxRange: 0,
      displayType: templateKey,
    };
    
    if (template.hasRanges && template.ranges) {
      dataObj.numberRanges = template.ranges;
    }
    
    onChange(dataObj);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    // Reorder remaining items
    newItems.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setItems(newItems);
    onChange({ items: newItems, itemType, maxRange, numberRanges: generateNumberRanges(maxRange) });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    onChange({ items: newItems, itemType, maxRange, numberRanges: generateNumberRanges(maxRange) });
  };

  const handleMoveItem = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === items.length - 1)
    ) {
      return;
    }

    const newItems = [...items];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newItems[index], newItems[targetIndex]] = [
      newItems[targetIndex],
      newItems[index],
    ];

    // Update orders
    newItems.forEach((item, idx) => {
      item.order = idx + 1;
    });

    setItems(newItems);
    onChange({ items: newItems, itemType, maxRange, numberRanges: generateNumberRanges(maxRange) });
  };

  const handleItemTypeChange = (e) => {
    const newType = e.target.value;
    setItemType(newType);
    onChange({ items, itemType: newType, maxRange, numberRanges: generateNumberRanges(maxRange) });
  };

  const handleImageUpload = (index, url) => {
    handleItemChange(index, "image", url);
  };

  return (
    <div className="editor-panel">
      <div className="editor-info">
        <h3>🔢 Ordering/Sequencing</h3>
        <p>
          Create a sequence that kids must arrange in the correct order. Can be
          numbers, steps, or any visual sequence.
        </p>
      </div>

      <div className="editor-controls">
        {/* Template Selector */}
        <div className="form-group">
          <label>📋 Quick Templates</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
            {Object.entries(ORDERING_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                type="button"
                onClick={() => handleLoadTemplate(key)}
                style={{
                  padding: '0.5rem',
                  border: selectedTemplate === key ? '2px solid #667eea' : '1px solid #ddd',
                  borderRadius: '4px',
                  backgroundColor: selectedTemplate === key ? '#f0f4ff' : '#fff',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: selectedTemplate === key ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ranges Preview */}
        {currentRanges.length > 0 && (
          <div className="form-group" style={{
            padding: '1rem',
            backgroundColor: '#f0f7ff',
            border: '1px solid #0284c7',
            borderRadius: '6px',
            marginBottom: '1rem'
          }}>
            <label style={{ color: '#0284c7', fontWeight: '600' }}>📊 Play Ranges (Preview)</label>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {currentRanges.map((range) => (
                <span
                  key={range.label}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#fff',
                    border: '1px solid #0284c7',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    color: '#0284c7'
                  }}
                >
                  {range.label}
                </span>
              ))}
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
              ✅ These ranges will be available when playing this puzzle
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Sequence Type</label>
          <select
            value={itemType}
            onChange={handleItemTypeChange}
            className="form-input"
          >
            <option value="numbers">Numbers (1, 2, 3...)</option>
            <option value="sequence">Visual Sequence</option>
            <option value="steps">Steps/Instructions</option>
          </select>
        </div>

        {itemType === "numbers" && (
          <div className="form-group">
            <label>Maximum Number Range</label>
            <div className="range-input-group">
              <input
                type="number"
                value={maxRange}
                onChange={(e) => setMaxRange(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="e.g., 50"
                min="0"
                step="10"
                className="form-input"
              />
              <button
                type="button"
                onClick={handleGenerateNumbers}
                className="btn btn-primary"
                disabled={maxRange <= 0}
              >
                Generate Numbers
              </button>
            </div>
            <p className="form-help">
              Enter max number (e.g., 50) to auto-generate ranges: 1-10, 11-20, 21-30, 31-40, 41-50
            </p>
            {maxRange > 0 && (
              <div className="range-preview">
                <strong>Ranges that will be created:</strong>
                <div className="ranges-list">
                  {generateNumberRanges(maxRange).map((range, idx) => (
                    <span key={idx} className="range-badge">{range.label}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddItem}
          className="btn btn-secondary"
        >
          + Add Item
        </button>
      </div>

      <div className="items-list">
        {items.map((item, index) => (
          <div key={item.id} className="item-row">
            <div className="item-order-badge">{item.order}</div>

            <div className="item-image">
              <label>Item Image</label>
              {item.image ? (
                <div className="image-preview-small">
                  <img src={item.image} alt={`Item ${item.order}`} />
                  <button
                    type="button"
                    onClick={() => handleItemChange(index, "image", "")}
                    className="btn-remove-small"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <ImageUpload
                  value={item.image}
                  onChange={(result) => handleImageUpload(index, result.url || result)}
                  label={`Item ${index + 1} Image`}
                  folder="puzzles/ordering"
                />
              )}
            </div>

            <div className="item-label">
              <label>Label/Description</label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleItemChange(index, "label", e.target.value)}
                placeholder="e.g., First step, Second step..."
                className="form-input"
              />
            </div>

            <div className="item-controls">
              <button
                type="button"
                onClick={() => handleMoveItem(index, "up")}
                disabled={index === 0}
                className="btn btn-small"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => handleMoveItem(index, "down")}
                disabled={index === items.length - 1}
                className="btn btn-small"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="btn btn-danger btn-small"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="empty-state">
            <p>No items yet. Click "Add Item" to get started.</p>
          </div>
        )}
      </div>

      <div className="editor-preview">
        <h4>Preview - Correct Order</h4>
        <div className="preview-sequence">
          {items.map((item, index) => (
            <div key={item.id} className="sequence-item">
              <span className="seq-number">{item.order}</span>
              {item.image && <img src={item.image} alt="" />}
              {item.label && <span className="seq-label">{item.label}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

OrderingEditor.displayName = "OrderingEditor";
export default OrderingEditor;
