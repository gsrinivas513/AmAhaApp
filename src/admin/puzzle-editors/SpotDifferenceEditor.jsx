// src/admin/puzzle-editors/SpotDifferenceEditor.jsx
// Editor for spot the difference puzzles
import React, { useState, forwardRef, useRef } from "react";
import ImageUpload from "../../components/ImageUpload";

const SpotDifferenceEditor = forwardRef(({ data, onChange }, ref) => {
  const [imageA, setImageA] = useState(data.imageA || "");
  const [imageB, setImageB] = useState(data.imageB || "");
  const [differences, setDifferences] = useState(data.differences || []);
  const canvasARef = useRef(null);
  const canvasBRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState("A");

  const handleImageUpload = (image, url) => {
    if (image === "A") {
      setImageA(url);
      onChange({ imageA: url, imageB, differences });
    } else {
      setImageB(url);
      onChange({ imageA, imageB: url, differences });
    }
  };

  const handleCanvasClick = (e, image) => {
    const canvas = image === "A" ? canvasARef.current : canvasBRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newDifference = {
      id: `diff-${Date.now()}`,
      x: Math.round(x),
      y: Math.round(y),
      radius: 20,
    };

    const newDifferences = [...differences, newDifference];
    setDifferences(newDifferences);
    onChange({ imageA, imageB, differences: newDifferences });
  };

  const handleRemoveDifference = (id) => {
    const newDifferences = differences.filter((d) => d.id !== id);
    setDifferences(newDifferences);
    onChange({ imageA, imageB, differences: newDifferences });
  };

  const handleRadiusChange = (id, radius) => {
    const newDifferences = differences.map((d) =>
      d.id === id ? { ...d, radius: parseInt(radius) } : d
    );
    setDifferences(newDifferences);
    onChange({ imageA, imageB, differences: newDifferences });
  };

  return (
    <div className="editor-panel">
      <div className="editor-info">
        <h3>👁️ Spot the Difference</h3>
        <p>
          Upload two similar images and click on the differences. Kids will find
          all marked spots.
        </p>
      </div>

      <div className="editor-controls">
        <div className="form-group">
          <label>Image A</label>
          {imageA ? (
            <div className="image-preview">
              <img src={imageA} alt="Image A" />
              <button
                type="button"
                onClick={() => {
                  setImageA("");
                  onChange({ imageA: "", imageB, differences });
                }}
                className="btn-remove"
              >
                ✕
              </button>
            </div>
          ) : (
            <ImageUpload
              value={imageA}
              onChange={(result) => handleImageUpload("A", result.url || result)}
              label="Original Image"
              folder="puzzles/spot-difference"
            />
          )}
        </div>

        <div className="form-group">
          <label>Image B</label>
          {imageB ? (
            <div className="image-preview">
              <img src={imageB} alt="Image B" />
              <button
                type="button"
                onClick={() => {
                  setImageB("");
                  onChange({ imageA, imageB: "", differences });
                }}
                className="btn-remove"
              >
                ✕
              </button>
            </div>
          ) : (
            <ImageUpload
              value={imageB}
              onChange={(result) => handleImageUpload("B", result.url || result)}
              label="Modified Image"
              folder="puzzles/spot-difference"
            />
          )}
        </div>
      </div>

      {imageA && imageB && (
        <>
          <div className="editor-preview">
            <h4>Click on differences to mark them</h4>
            <div className="spot-difference-container">
              <div className="spot-image-wrapper">
                <h5>Image A</h5>
                <canvas
                  ref={canvasARef}
                  onClick={(e) => handleCanvasClick(e, "A")}
                  className="clickable-canvas"
                  style={{
                    backgroundImage: `url(${imageA})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "300px",
                    border: "2px solid #ddd",
                    cursor: "crosshair",
                  }}
                />
              </div>

              <div className="spot-image-wrapper">
                <h5>Image B</h5>
                <canvas
                  ref={canvasBRef}
                  onClick={(e) => handleCanvasClick(e, "B")}
                  className="clickable-canvas"
                  style={{
                    backgroundImage: `url(${imageB})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "300px",
                    border: "2px solid #ddd",
                    cursor: "crosshair",
                  }}
                />
              </div>
            </div>
          </div>

          <div className="differences-list">
            <h4>Differences ({differences.length})</h4>
            {differences.map((diff, index) => (
              <div key={diff.id} className="difference-item">
                <span className="diff-number">{index + 1}</span>
                <span className="diff-coords">
                  Position: {diff.x}%, {diff.y}%
                </span>
                <div className="diff-controls">
                  <label>
                    Radius:
                    <input
                      type="number"
                      value={diff.radius}
                      onChange={(e) =>
                        handleRadiusChange(diff.id, e.target.value)
                      }
                      min="10"
                      max="50"
                      className="form-input-small"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveDifference(diff.id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {(!imageA || !imageB) && (
        <div className="empty-state">
          <p>Upload both images to mark differences.</p>
        </div>
      )}
    </div>
  );
});

SpotDifferenceEditor.displayName = "SpotDifferenceEditor";
export default SpotDifferenceEditor;
