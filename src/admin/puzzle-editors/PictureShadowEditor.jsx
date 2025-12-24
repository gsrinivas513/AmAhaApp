// src/admin/puzzle-editors/PictureShadowEditor.jsx
// Editor for picture-shadow matching puzzles
import React, { useState, forwardRef } from "react";
import ImageUpload from "../../components/ImageUpload";

const PictureShadowEditor = forwardRef(({ data, onChange }, ref) => {
  const [pairs, setPairs] = useState(data.pairs || []);

  const handleAddPair = () => {
    const newPairs = [
      ...pairs,
      {
        id: `pair-${Date.now()}`,
        image: "",
        shadow: "",
      },
    ];
    setPairs(newPairs);
    onChange({ pairs: newPairs });
  };

  const handleRemovePair = (index) => {
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
    onChange({ pairs: newPairs });
  };

  const handlePairChange = (index, field, value) => {
    const newPairs = [...pairs];
    newPairs[index][field] = value;
    setPairs(newPairs);
    onChange({ pairs: newPairs });
  };

  const handleImageUpload = (index, field, url) => {
    handlePairChange(index, field, url);
  };

  return (
    <div className="editor-panel">
      <div className="editor-info">
        <h3>🌑 Picture-Shadow Matching</h3>
        <p>
          Upload an image and its shadow. Kids will match pictures with their
          shadows.
        </p>
      </div>

      <div className="editor-controls">
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
              <label>Picture {index + 1}</label>
              {pair.image ? (
                <div className="image-preview">
                  <img src={pair.image} alt={`Picture ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => handlePairChange(index, "image", "")}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <ImageUpload
                  value={pair.image}
                  onChange={(result) => handleImageUpload(index, "image", result.url || result)}
                  label={`Pair ${index + 1} Image`}
                  folder="puzzles/picture-shadow"
                />
              )}
            </div>

            <div className="pair-shadow">
              <label>Shadow {index + 1}</label>
              {pair.shadow ? (
                <div className="image-preview">
                  <img src={pair.shadow} alt={`Shadow ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => handlePairChange(index, "shadow", "")}
                    className="btn-remove"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <ImageUpload
                  value={pair.shadow}
                  onChange={(result) => handleImageUpload(index, "shadow", result.url || result)}
                  label={`Pair ${index + 1} Shadow`}
                  folder="puzzles/picture-shadow"
                />
              )}
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
        <div className="preview-pairs">
          {pairs.map((pair, index) => (
            <div key={pair.id} className="pair-preview">
              <div>
                <span className="preview-label">Picture {index + 1}</span>
                {pair.image && <img src={pair.image} alt="" />}
              </div>
              <div>
                <span className="preview-label">Shadow {index + 1}</span>
                {pair.shadow && <img src={pair.shadow} alt="" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

PictureShadowEditor.displayName = "PictureShadowEditor";
export default PictureShadowEditor;
