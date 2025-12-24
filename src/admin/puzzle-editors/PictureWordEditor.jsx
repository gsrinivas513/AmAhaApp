// src/admin/puzzle-editors/PictureWordEditor.jsx
// Editor for picture-word matching puzzles
import React, { useState, forwardRef } from "react";
import CloudinaryImageUpload from "../../components/CloudinaryImageUpload";

const PictureWordEditor = forwardRef(({ data, onChange }, ref) => {
  const [pairs, setPairs] = useState(data.pairs || []);
  const [layout, setLayout] = useState(data.layout || "grid-2x2");

  const handleAddPair = () => {
    const newPairs = [
      ...pairs,
      {
        id: `pair-${Date.now()}`,
        image: "",
        word: "",
      },
    ];
    setPairs(newPairs);
    onChange({ pairs: newPairs, layout });
  };

  const handleRemovePair = (index) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
    onChange({ pairs: newPairs, layout });
  };

  const handlePairChange = (index, field, value) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
    onChange({ pairs: newPairs, layout });
  };

  const handleLayoutChange = (e) => {
    const newLayout = e.target.value;
    setLayout(newLayout);
    onChange({ pairs, layout: newLayout });
  };

  const handleImageUpload = (index, url) => {
    handlePairChange(index, "image", url);
  };

  return (
    <div className="editor-panel">
      <div className="editor-info">
        <h3>🖼️ Picture-Word Matching</h3>
        <p>
          Upload images and add corresponding words. Kids will match pictures to
          words by dragging or clicking.
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
            <option value="grid-2x2">2x2 Grid (4 pairs)</option>
            <option value="grid-3x3">3x3 Grid (9 pairs)</option>
            <option value="grid-2x3">2x3 Grid (6 pairs)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleAddPair}
          className="btn btn-secondary"
        >
          + Add Pair
        </button>
      </div>

      <div className="pairs-list">
        {pairs.map((pair, index) => (
          <div key={pair.id} className="pair-item">
            <div className="pair-number">{index + 1}</div>

            <div className="pair-image">
              <label>Image {index + 1}</label>
              {pair.image ? (
                <div className="image-preview">
                  <img src={pair.image} alt={`Pair ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => handlePairChange(index, "image", "")}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <CloudinaryImageUpload
                  onUpload={(url) => handleImageUpload(index, url)}
                  folder="puzzles/picture-word"
                />
              )}
            </div>

            <div className="pair-word">
              <label>Word/Label {index + 1}</label>
              <input
                type="text"
                value={pair.word}
                onChange={(e) => handlePairChange(index, "word", e.target.value)}
                placeholder="e.g., Apple, Dog, Cat"
                className="form-input"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemovePair(index)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        ))}

        {pairs.length === 0 && (
          <div className="empty-state">
            <p>No pairs yet. Click "Add Pair" to get started.</p>
          </div>
        )}
      </div>

      <div className="editor-preview">
        <h4>Preview</h4>
        <div className={`preview-grid ${layout}`}>
          {pairs.map((pair, index) => (
            <div key={pair.id} className="preview-card">
              {pair.image && <img src={pair.image} alt="" />}
              <span>{pair.word}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

PictureWordEditor.displayName = "PictureWordEditor";
export default PictureWordEditor;
