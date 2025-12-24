// src/admin/puzzle-editors/FindPairEditor.jsx
// Editor for find matching pairs (memory) puzzles
import React, { useState, forwardRef } from "react";
import ImageUpload from "../../components/ImageUpload";

const FindPairEditor = forwardRef(({ data, onChange }, ref) => {
  const [cards, setCards] = useState(data.cards || []);
  const [layout, setLayout] = useState(data.layout || "grid-2x4");

  const handleAddCard = () => {
    const newCard = {
      id: `card-${Date.now()}`,
      image: "",
    };
    const newCards = [...cards, newCard];
    setCards(newCards);
    onChange({ cards: newCards, layout });
  };

  const handleRemoveCard = (index) => {
    const newCards = cards.filter((_, i) => i !== index);
    setCards(newCards);
    onChange({ cards: newCards, layout });
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
    onChange({ cards: newCards, layout });
  };

  const handleLayoutChange = (e) => {
    const newLayout = e.target.value;
    setLayout(newLayout);
    onChange({ cards, layout: newLayout });
  };

  const handleImageUpload = (index, url) => {
    handleCardChange(index, "image", url);
  };

  const getGridClass = () => {
    switch (layout) {
      case "grid-2x4":
        return "grid-2x4";
      case "grid-3x4":
        return "grid-3x4";
      case "grid-4x4":
        return "grid-4x4";
      default:
        return "grid-2x4";
    }
  };

  return (
    <div className="editor-panel">
      <div className="editor-info">
        <h3>🧩 Find Matching Pair (Memory)</h3>
        <p>
          Upload images to create a memory matching game. Each image should
          appear exactly twice (or pair images together).
        </p>
      </div>

      <div className="editor-controls">
        <div className="form-group">
          <label>Grid Layout</label>
          <select
            value={layout}
            onChange={handleLayoutChange}
            className="form-input"
          >
            <option value="grid-2x4">2x4 Grid (8 cards)</option>
            <option value="grid-3x4">3x4 Grid (12 cards)</option>
            <option value="grid-4x4">4x4 Grid (16 cards)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleAddCard}
          className="btn btn-secondary"
        >
          + Add Card
        </button>
      </div>

      <div className="cards-list">
        {cards.map((card, index) => (
          <div key={card.id} className="card-item">
            <div className="card-number">{index + 1}</div>

            {card.image ? (
              <div className="image-preview">
                <img src={card.image} alt={`Card ${index + 1}`} />
                <button
                  type="button"
                  onClick={() => handleCardChange(index, "image", "")}
                  className="btn-remove"
                >
                  ✕
                </button>
              </div>
              ) : (
                <ImageUpload
                  value={card.image}
                  onChange={(result) => handleImageUpload(index, result.url || result)}
                  label={`Card ${index + 1} Image`}
                  folder="puzzles/find-pair"
                />
              )}

            <button
              type="button"
              onClick={() => handleRemoveCard(index)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        ))}

        {cards.length === 0 && (
          <div className="empty-state">
            <p>No cards yet. Click "Add Card" to get started.</p>
          </div>
        )}
      </div>

      <div className="editor-preview">
        <h4>Preview ({cards.length} cards)</h4>
        <div className={`preview-grid cards-grid ${getGridClass()}`}>
          {cards.map((card) => (
            <div key={card.id} className="preview-card-memory">
              {card.image && <img src={card.image} alt="" />}
            </div>
          ))}
        </div>
      </div>

      <div className="editor-note">
        <p>
          💡 Tip: For a proper memory game, upload the same image twice (or pair
          images that match). The game will shuffle cards randomly.
        </p>
      </div>
    </div>
  );
});

FindPairEditor.displayName = "FindPairEditor";
export default FindPairEditor;
