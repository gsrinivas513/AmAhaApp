// src/admin/puzzle-editors/OrderingEditor.jsx
// Editor for ordering/sequencing puzzles
import React, { useState, forwardRef } from "react";
import CloudinaryImageUpload from "../../components/CloudinaryImageUpload";

const OrderingEditor = forwardRef(({ data, onChange }, ref) => {
  const [items, setItems] = useState(data.items || []);
  const [itemType, setItemType] = useState(data.itemType || "numbers");

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
    onChange({ items: newItems, itemType });
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    // Reorder remaining items
    newItems.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setItems(newItems);
    onChange({ items: newItems, itemType });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    onChange({ items: newItems, itemType });
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
    onChange({ items: newItems, itemType });
  };

  const handleItemTypeChange = (e) => {
    const newType = e.target.value;
    setItemType(newType);
    onChange({ items, itemType: newType });
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
                <CloudinaryImageUpload
                  onUpload={(url) => handleImageUpload(index, url)}
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
