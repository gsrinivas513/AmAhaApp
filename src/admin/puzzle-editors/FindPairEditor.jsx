// src/admin/puzzle-editors/FindPairEditor.jsx
// Editor for find matching pairs (memory) puzzles
import React, { useState, forwardRef, useEffect } from "react";
import ImageUpload from "../../components/ImageUpload";
import { CLOUDINARY_CONFIG } from "../../config/cloudinaryConfig";
import { ValidationErrorDisplay } from "../../components/Admin/PuzzleValidationDisplay";
import { validatePuzzleData } from "../../services/puzzleValidationService";

const FindPairEditor = forwardRef(({ data, onChange }, ref) => {
  const [cards, setCards] = useState(data.cards || []);
  const [layout, setLayout] = useState(data.layout || "grid-6x6");
  const [useColorMode, setUseColorMode] = useState(data.useColorMode || false);
  const [validation, setValidation] = useState(null);

  const getCardCountForLayout = (layoutType) => {
    switch (layoutType) {
      case "grid-2x4":
        return 8;
      case "grid-3x4":
        return 12;
      case "grid-4x4":
        return 16;
      case "grid-5x5":
        return 25;
      case "grid-6x6":
        return 36;
      default:
        return 8;
    }
  };

  // Auto-create cards when layout changes
  useEffect(() => {
    const requiredCount = getCardCountForLayout(layout);
    const currentCount = cards.length;

    if (requiredCount > currentCount) {
      // Add missing cards
      const newCards = [...cards];
      for (let i = currentCount; i < requiredCount; i++) {
        const pairIndex = Math.floor(i / 2);
        newCards.push({
          id: `card-${Date.now()}-${i}`,
          image: "",
          pairId: `pair-${pairIndex}`
        });
      }
      setCards(newCards);
      onChange({ cards: newCards, layout });
    } else if (requiredCount < currentCount) {
      // Remove excess cards
      const newCards = cards.slice(0, requiredCount);
      setCards(newCards);
      onChange({ cards: newCards, layout });
    }
  }, [layout]);

  // Validate puzzle data whenever cards change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const puzzleData = { cards, layout, useColorMode };
    const result = validatePuzzleData({
      type: "find-pair",
      data: puzzleData
    });
    setValidation(result);
  }, [cards, layout, useColorMode]);

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
  };

  const handleImageUpload = (index, url) => {
    handleCardChange(index, "image", url);
  };

  const handleBulkUpload = async (event, requiredCount) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) {
      alert('Please select images');
      return;
    }
    
    if (files.length !== requiredCount) {
      alert(`Please select exactly ${requiredCount} images for ${requiredCount} pairs. You selected ${files.length}.`);
      return;
    }

    try {
      console.log(`Starting upload of ${files.length} images...`);
      
      // Upload all images with progress tracking
      const uploadedUrls = await Promise.all(
        files.map((file, index) => {
          console.log(`Uploading image ${index + 1}/${files.length}: ${file.name}`);
          return uploadImageToCloudinary(file)
            .catch(error => {
              console.error(`Failed to upload ${file.name}:`, error);
              throw new Error(`Failed to upload "${file.name}": ${error.message}`);
            });
        })
      );

      // Create paired cards from uploaded images
      const newCards = [];
      uploadedUrls.forEach((imageUrl, index) => {
        const pairIndex = index;
        // First card of the pair
        newCards.push({
          id: `card-${Date.now()}-${index * 2}`,
          image: imageUrl,
          pairId: `pair-${pairIndex}`
        });
        // Second card of the pair (same image)
        newCards.push({
          id: `card-${Date.now()}-${index * 2 + 1}`,
          image: imageUrl,
          pairId: `pair-${pairIndex}`
        });
      });

      setCards(newCards);
      onChange({ cards: newCards, layout, useColorMode });
      alert(`✅ Successfully uploaded and paired ${files.length} images!`);
      
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Bulk upload error:', error);
      alert(`❌ Upload failed: ${error.message}\n\nMake sure:\n- All files are images (PNG, JPG)\n- Each file is under 5MB\n- Your Cloudinary credentials are configured`);
    }
  };

  const uploadImageToCloudinary = async (file) => {
    try {
      // Validate file size (5MB = 5242880 bytes)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`File "${file.name}" is too large. Max size is 5MB.`);
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`File "${file.name}" is not an image.`);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', 'puzzles/find-pair');
      formData.append('resource_type', 'auto');

      console.log('Uploading to Cloudinary:', {
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        fileName: file.name,
        fileSize: file.size
      });

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudinary error:', errorData);
        throw new Error(errorData.error?.message || `Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Image uploaded:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
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
      {/* Validation Error Display */}
      <ValidationErrorDisplay validation={validation} showValidation={true} />

      <div className="editor-info">
        <h3>🧩 Find Matching Pair (Memory Game)</h3>
        <p>
          Create a fun memory matching game where kids find pairs of matching images. 
          Each image card should have an exact match.
        </p>
      </div>

      {/* Step-by-Step Guide */}
      <div style={{
        background: '#f0f9ff',
        border: '2px solid #0284c7',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h4 style={{ marginTop: 0, color: '#0284c7', marginBottom: '12px' }}>
          📋 How to Create a Memory Game:
        </h4>
        <ol style={{ margin: '0', paddingLeft: '20px', color: '#334155' }}>
          <li style={{ marginBottom: '8px' }}>
            <strong>Choose a Grid Size</strong> - Select 2x4 (8 cards = 4 pairs), 3x4 (12 cards = 6 pairs), or 4x4 (16 cards = 8 pairs)
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Card Slots Auto-Created</strong> - All card slots appear automatically when you select a grid size
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Upload Images</strong> - Upload an image for each card slot. For pairs, use the same image twice
          </li>
          <li style={{ marginBottom: '8px' }}>
            <strong>Pair Rule</strong> - You need 4 unique images for 8 cards. Upload each image twice to create the matching pairs.
          </li>
          <li style={{ marginBottom: '0px' }}>
            <strong>Preview</strong> - See your game preview below to verify all images are uploaded
          </li>
        </ol>
      </div>

      {/* Example Section */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h4 style={{ marginTop: 0, color: '#334155', marginBottom: '12px' }}>
          💡 Example: Animals Memory Game
        </h4>
        <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '14px' }}>
          <strong>For 2x4 grid: 4 unique images, uploaded twice each = 8 total cards</strong>
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          marginBottom: '12px'
        }}>
          {['🐱', '🐶', '🐘', '🦁'].map((emoji, i) => (
            <div key={i} style={{
              background: 'white',
              border: '2px solid #cbd5e1',
              borderRadius: '6px',
              padding: '12px',
              textAlign: 'center',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {emoji} ×2
            </div>
          ))}
        </div>
        <p style={{ margin: '0', color: '#64748b', fontSize: '12px' }}>
          Each unique image (above) appears exactly twice in the game. Upload each image 2 times to create matching pairs. Total: 4 unique images = 8 cards. When a child flips two cards, if they match, they stay flipped. Game is won when all pairs are found!
        </p>
      </div>

      {/* Image Requirements */}
      <div style={{
        background: '#fffbeb',
        border: '1px solid #fcd34d',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px'
      }}>
        <h4 style={{ marginTop: 0, color: '#92400e', marginBottom: '12px' }}>
          📷 Image Requirements:
        </h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#78350f' }}>
          <li><strong>Format:</strong> PNG, JPG, or WebP</li>
          <li><strong>Size:</strong> 100-200px square (will be resized to fit)</li>
          <li><strong>Clear Images:</strong> Use distinct, recognizable images for each pair</li>
          <li><strong>Consistency:</strong> All images should be same size and quality</li>
        </ul>
      </div>

      <div className="editor-controls">
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Grid Layout</span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              (Select size based on difficulty)
            </span>
          </label>
          <select
            value={layout}
            onChange={handleLayoutChange}
            className="form-input"
          >
            <option value="grid-2x4">2x4 Grid (8 cards = 4 pairs) - Easy</option>
            <option value="grid-3x4">3x4 Grid (12 cards = 6 pairs) - Medium</option>
            <option value="grid-4x4">4x4 Grid (16 cards = 8 pairs) - Hard</option>
            <option value="grid-5x5">5x5 Grid (25 cards) - Very Hard</option>
            <option value="grid-6x6">6x6 Grid (36 cards = 18 pairs) - Expert</option>
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span>Card Content Type</span>
          </label>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => {
                setUseColorMode(false);
                onChange({ cards, layout, useColorMode: false });
              }}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '6px',
                border: '2px solid',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
                borderColor: !useColorMode ? '#0284c7' : '#cbd5e1',
                background: !useColorMode ? '#0284c7' : 'white',
                color: !useColorMode ? 'white' : '#64748b'
              }}
            >
              📷 Upload Images
            </button>
            <button
              type="button"
              onClick={() => {
                setUseColorMode(true);
                onChange({ cards, layout, useColorMode: true });
              }}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '6px',
                border: '2px solid',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s',
                borderColor: useColorMode ? '#0284c7' : '#cbd5e1',
                background: useColorMode ? '#0284c7' : 'white',
                color: useColorMode ? 'white' : '#64748b'
              }}
            >
              🎨 Pick Colors
            </button>
          </div>
        </div>        <div style={{
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: '6px',
          padding: '12px',
          marginTop: '16px',
          color: '#166534',
          fontSize: '14px'
        }}>
          ✓ Ready to upload: <strong>{cards.length}/{getCardCountForLayout(layout)}</strong> card slots created
        </div>
      </div>

      <div className="cards-list">
        {cards.length > 0 && (
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #86efac',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '16px',
            color: '#166534',
            fontSize: '14px'
          }}>
            🎯 Unique image pairs ready: <strong>{Math.floor(cards.filter(c => c.image).length / 2)}</strong> / {getCardCountForLayout(layout) / 2} pairs ({Math.round((Math.floor(cards.filter(c => c.image).length / 2) / (getCardCountForLayout(layout) / 2)) * 100)}%)
          </div>
        )}

        {/* COLOR MODE - BULK COLOR PICKER */}
        {useColorMode && (
          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h4 style={{ marginTop: 0, color: '#b45309', marginBottom: '16px', fontSize: '16px' }}>
              🎨 Select {getCardCountForLayout(layout) / 2} Colors
            </h4>
            <p style={{ margin: '0 0 16px 0', color: '#78350f', fontSize: '14px' }}>
              Pick {getCardCountForLayout(layout) / 2} unique colors. Each color will automatically be paired twice.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px'
            }}>
              {Array.from({ length: getCardCountForLayout(layout) / 2 }).map((_, pairIdx) => {
                const colorValue = cards[pairIdx * 2]?.image || '#ffffff';
                const hexColor = colorValue.startsWith('#') ? colorValue : '#ffffff';
                return (
                  <div key={`color-${pairIdx}`} style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <input
                        type="color"
                        value={hexColor}
                        onChange={(e) => {
                          const newCards = [...cards];
                          newCards[pairIdx * 2] = { 
                            ...newCards[pairIdx * 2],
                            image: e.target.value,
                            pairId: `pair-${pairIdx}`
                          };
                          newCards[pairIdx * 2 + 1] = { 
                            ...newCards[pairIdx * 2 + 1],
                            image: e.target.value,
                            pairId: `pair-${pairIdx}`
                          };
                          setCards(newCards);
                          onChange({ cards: newCards, layout, useColorMode });
                        }}
                        style={{
                          width: '100%',
                          height: '80px',
                          border: '2px solid #d97706',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                        title={`Pair ${pairIdx + 1}`}
                      />
                    </div>
                    {/* Color code input */}
                    <input
                      type="text"
                      value={hexColor}
                      onChange={(e) => {
                        let colorCode = e.target.value;
                        // Validate hex color
                        if (!colorCode.startsWith('#')) {
                          colorCode = '#' + colorCode;
                        }
                        // Only update if valid hex
                        if (/^#[0-9A-F]{6}$/i.test(colorCode)) {
                          const newCards = [...cards];
                          newCards[pairIdx * 2] = { 
                            ...newCards[pairIdx * 2],
                            image: colorCode,
                            pairId: `pair-${pairIdx}`
                          };
                          newCards[pairIdx * 2 + 1] = { 
                            ...newCards[pairIdx * 2 + 1],
                            image: colorCode,
                            pairId: `pair-${pairIdx}`
                          };
                          setCards(newCards);
                          onChange({ cards: newCards, layout, useColorMode });
                        }
                      }}
                      placeholder="#FF5733"
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        fontSize: '12px',
                        border: '1px solid #d97706',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        textAlign: 'center'
                      }}
                      title="Enter hex color code (e.g., #FF5733)"
                    />
                    <div style={{ fontSize: '12px', color: '#78350f', marginTop: '4px', fontWeight: '600' }}>
                      Pair {pairIdx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* IMAGE MODE - BULK UPLOAD SECTION */}
        {!useColorMode && (
          <>
        <div style={{
          background: '#f0f9ff',
          border: '2px solid #0284c7',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h4 style={{ marginTop: 0, color: '#0284c7', marginBottom: '12px', fontSize: '16px' }}>
            ⚡ Quick Bulk Upload
          </h4>
          <p style={{ margin: '0 0 16px 0', color: '#475569', fontSize: '14px' }}>
            Upload {getCardCountForLayout(layout) / 2} unique images at once. Each image will automatically be paired twice.
          </p>
          
          <div style={{
            background: 'white',
            border: '2px dashed #0284c7',
            borderRadius: '6px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer'
          }}>
            <input
              type="file"
              multiple
              accept="image/*"
              id="bulk-upload"
              style={{ display: 'none' }}
              onChange={(e) => handleBulkUpload(e, getCardCountForLayout(layout) / 2)}
            />
            <label htmlFor="bulk-upload" style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
              <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                Click to upload or drag {getCardCountForLayout(layout) / 2} images
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                PNG, JPG up to 5MB each
              </div>
            </label>
          </div>
        </div>

        {/* OR DIVIDER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
          <span style={{ color: '#64748b', fontWeight: '600' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
        </div>

        {/* MANUAL UPLOAD SECTION */}
        <h4 style={{ margin: '0 0 16px 0', color: '#1e293b', fontSize: '16px' }}>
          ✏️ Manual Upload
        </h4>
        {Array.from({ length: getCardCountForLayout(layout) / 2 }).map((_, pairIdx) => {
          const card1Index = pairIdx * 2;
          const card2Index = pairIdx * 2 + 1;
          const card1 = cards[card1Index];
          const card2 = cards[card2Index];
          
          return (
            <div key={`pair-${pairIdx}`} style={{
              background: '#f8fafc',
              border: '2px solid #cbd5e1',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {pairIdx + 1}
                </div>
                <h5 style={{ margin: '0', color: '#1e293b', fontSize: '16px' }}>
                  Pair {pairIdx + 1} - Upload same image twice
                </h5>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                {/* First image of pair */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '12px'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                    Image A
                  </p>
                  {card1?.image ? (
                    <div style={{
                      position: 'relative',
                      marginBottom: '12px'
                    }}>
                      <img src={card1.image} alt={`Pair ${pairIdx + 1} - Image A`} style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }} />
                      <button
                        type="button"
                        onClick={() => handleCardChange(card1Index, "image", "")}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(255,255,255,0.9)',
                          border: 'none',
                          borderRadius: '4px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      background: '#f1f5f9',
                      border: '2px dashed #cbd5e1',
                      borderRadius: '4px',
                      padding: '12px',
                      textAlign: 'center',
                      minHeight: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px'
                    }}>
                      <ImageUpload
                        value={card1?.image || ""}
                        onChange={(result) => handleImageUpload(card1Index, result.url || result)}
                        label="Upload Image"
                        folder="puzzles/find-pair"
                      />
                    </div>
                  )}
                  {card1?.image && (
                    <button
                      type="button"
                      onClick={() => handleCardChange(card1Index, "image", "")}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: '1px solid #cbd5e1',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#64748b'
                      }}
                    >
                      Change Image
                    </button>
                  )}
                </div>

                {/* Second image of pair */}
                <div style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '12px'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                    Image B (same as Image A)
                  </p>
                  {card2?.image ? (
                    <div style={{
                      position: 'relative',
                      marginBottom: '12px'
                    }}>
                      <img src={card2.image} alt={`Pair ${pairIdx + 1} - Image B`} style={{
                        width: '100%',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }} />
                      <button
                        type="button"
                        onClick={() => handleCardChange(card2Index, "image", "")}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(255,255,255,0.9)',
                          border: 'none',
                          borderRadius: '4px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      background: '#f1f5f9',
                      border: '2px dashed #cbd5e1',
                      borderRadius: '4px',
                      padding: '12px',
                      textAlign: 'center',
                      minHeight: '100px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '12px'
                    }}>
                      <ImageUpload
                        value={card2?.image || ""}
                        onChange={(result) => handleImageUpload(card2Index, result.url || result)}
                        label="Upload Image"
                        folder="puzzles/find-pair"
                      />
                    </div>
                  )}
                  {card2?.image && (
                    <button
                      type="button"
                      onClick={() => handleCardChange(card2Index, "image", "")}
                      style={{
                        width: '100%',
                        background: 'none',
                        border: '1px solid #cbd5e1',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#64748b'
                      }}
                    >
                      Change Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </>
        )}

        {cards.length === 0 && (
          <div className="empty-state" style={{
            background: '#f1f5f9',
            border: '2px dashed #cbd5e1',
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>📸 No cards yet</p>
            <p style={{ fontSize: '14px', margin: 0 }}>Click "Add Card" above to start building your memory game</p>
          </div>
        )}
      </div>

      <div className="editor-preview">
        <h4 style={{ marginTop: 0, marginBottom: '12px' }}>
          👀 Live Preview ({cards.length} cards added)
        </h4>
        {cards.length > 0 ? (
          <div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 12px 0' }}>
              This is how the game will look when players are matching:
            </p>
            <div className={`preview-grid cards-grid ${getGridClass()}`} style={{
              background: '#f8fafc',
              padding: '16px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0'
            }}>
              {cards.map((card) => (
                <div key={card.id} className="preview-card-memory" style={{
                  background: '#e0e7ff',
                  border: '2px solid #4f46e5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  minHeight: '100px'
                }}>
                  {card.image && (
                    <img src={card.image} alt="" style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      borderRadius: '6px'
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            background: '#f1f5f9',
            border: '2px dashed #cbd5e1',
            borderRadius: '6px',
            padding: '40px 20px',
            textAlign: 'center',
            color: '#64748b'
          }}>
            <p>Preview will appear here once you add cards</p>
          </div>
        )}
      </div>

      <div className="editor-note" style={{
        background: '#fef3c7',
        border: '1px solid #fcd34d',
        borderRadius: '6px',
        padding: '16px',
        marginTop: '20px'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '8px', color: '#92400e' }}>
          💡 Pro Tips:
        </h4>
        <ul style={{ margin: '0', paddingLeft: '20px', color: '#78350f', fontSize: '14px' }}>
          <li><strong>Image Count:</strong> For 2x4 grid (8 cards), you need exactly 4 unique images, each uploaded twice</li>
          <li><strong>Example:</strong> 🐱 (cat), 🐶 (dog), 🐘 (elephant), 🦁 (lion) - each appears twice = 8 cards total</li>
          <li><strong>Variety:</strong> Use bright, recognizable images that kids can easily remember</li>
          <li><strong>Difficulty:</strong> Smaller grids (2x4) are easier; larger grids (4x4) are harder</li>
          <li><strong>Testing:</strong> Verify each image appears exactly twice before publishing</li>
        </ul>
      </div>
    </div>
  );
});

FindPairEditor.displayName = "FindPairEditor";
export default FindPairEditor;
