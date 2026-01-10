import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export default function PuzzleTemplateModal({ isOpen, onClose, baseTemplates = [] }) {
  const { theme } = useTheme();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [croppingImage, setCroppingImage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    items: [],
    itemInput: '',
    itemImage: '',
    itemImageUrl: '',
    itemColor: '',
  });

  // Built-in templates
  const BUILT_IN_TEMPLATES = {
    daysOfWeek: {
      name: 'Days of Week',
      description: 'Monday through Sunday',
      items: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      isBuiltIn: true,
    },
    monthsOfYear: {
      name: 'Months of Year',
      description: 'January through December',
      items: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      isBuiltIn: true,
    },
    seasons: {
      name: 'Seasons',
      description: 'Spring, Summer, Fall, Winter',
      items: ['Spring', 'Summer', 'Fall', 'Winter'],
      isBuiltIn: true,
    },
    alphabet: {
      name: 'Alphabet (A-Z)',
      description: 'Letters A through Z',
      items: Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ'),
      isBuiltIn: true,
    },
  };

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const customSnapshot = await getDocs(collection(db, 'puzzleTemplates'));
      const customTemplates = customSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isBuiltIn: false,
      }));
      
      // Prepare base templates from props with proper IDs
      const baseTemplatesWithIds = baseTemplates.map((template, index) => ({
        id: `base-${template.typeKey || index}`,
        ...template,
        isBuiltIn: true,
      }));
      
      // Combine built-in (from BUILT_IN_TEMPLATES), base (from props), and custom templates
      const allTemplates = [
        ...Object.entries(BUILT_IN_TEMPLATES).map(([key, value]) => ({
          id: key,
          ...value,
        })),
        ...baseTemplatesWithIds,
        ...customTemplates,
      ];
      
      setTemplates(allTemplates);
      setError('');
    } catch (err) {
      setError('Error loading templates: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTemplate = async () => {
    if (!formData.name.trim()) {
      setError('Template name is required');
      return;
    }
    if (formData.items.length === 0) {
      setError('Please add at least one item');
      return;
    }

    try {
      if (editingTemplate) {
        // Update existing template (built-in or custom)
        await updateDoc(doc(db, 'puzzleTemplates', editingTemplate.id), {
          name: formData.name,
          description: formData.description,
          items: formData.items,
          updatedAt: new Date().toISOString(),
        });
        setSuccess('Template updated successfully!');
      } else {
        // Create new template
        await addDoc(collection(db, 'puzzleTemplates'), {
          name: formData.name,
          description: formData.description,
          items: formData.items,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setSuccess('Template created successfully!');
      }
      
      setTimeout(() => {
        loadTemplates();
        resetForm();
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError('Error saving template: ' + err.message);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    try {
      await deleteDoc(doc(db, 'puzzleTemplates', templateId));
      setSuccess('Template deleted successfully!');
      setTimeout(() => {
        loadTemplates();
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError('Error deleting template: ' + err.message);
    }
  };

  const handleAddItem = () => {
    const item = formData.itemInput.trim();
    if (item) {
      const newItem = {
        label: item,
      };
      
      // Only add image if provided
      if (formData.itemImage || formData.itemImageUrl) {
        newItem.image = formData.itemImage || formData.itemImageUrl;
      }
      
      // Only add color if provided
      if (formData.itemColor) {
        newItem.color = formData.itemColor;
      }
      
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem],
        itemInput: '',
        itemImage: '',
        itemImageUrl: '',
        itemColor: '',
      }));
      setError('');
    }
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('upload_preset', 'amaha_puzzles');

      const response = await fetch('https://api.cloudinary.com/v1_1/dgopu5apj/image/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();
      if (data.secure_url) {
        setFormData(prev => ({
          ...prev,
          itemImage: data.secure_url,
        }));
        setSuccess('Image uploaded successfully!');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      setError('Error uploading image: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      description: template.description,
      items: [...(template.items || [])],
      itemInput: '',
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({ 
      name: '', 
      description: '', 
      items: [], 
      itemInput: '',
      itemImage: '',
      itemImageUrl: '',
      itemColor: '',
    });
    setEditingTemplate(null);
    setShowAddForm(false);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.surfacePrimary,
          border: `2px solid ${theme.border}`,
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '800px',
          width: '95%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 80px rgba(0, 0, 0, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: theme.textPrimary, fontSize: '24px', fontWeight: '700', margin: 0 }}>
            📋 Puzzle Templates
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme.textSecondary,
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            background: '#FF6B6B25',
            color: '#FF6B6B',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{
            background: '#4ECDC425',
            color: '#4ECDC4',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '600',
          }}>
            ✓ {success}
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div style={{
            background: theme.background,
            border: `2px solid ${theme.border}`,
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <h3 style={{ color: theme.textPrimary, fontSize: '16px', fontWeight: '700', marginBottom: '16px', margin: '0 0 16px 0' }}>
              {editingTemplate ? '✏️ Edit Template' : '➕ Create New Template'}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Name */}
              <div>
                <label style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Template Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Countries, Planets, Alphabet..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: theme.surfacePrimary,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Brief description of this template"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: theme.surfacePrimary,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    color: theme.textPrimary,
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Items Input */}
              <div>
                <label style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                  Add Items (Text is required • Image & Color are optional)
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Enter item (e.g., Apple, Banana)"
                      value={formData.itemInput}
                      onChange={(e) => setFormData({ ...formData, itemInput: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddItem();
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        background: theme.surfacePrimary,
                        border: `2px solid ${theme.border}`,
                        borderRadius: '6px',
                        color: theme.textPrimary,
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      onClick={handleAddItem}
                      style={{
                        padding: '10px 16px',
                        background: theme.accentPrimary,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Add Item
                    </button>
                  </div>

                  {/* Optional Image Upload for Item */}
                  <div style={{ background: `${theme.accentPrimary}10`, padding: '10px', borderRadius: '6px' }}>
                    <label style={{ color: theme.textSecondary, fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
                      📷 Item Image (Optional)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        style={{ display: 'none', cursor: 'pointer' }}
                        id="itemImageInput"
                      />
                      <button
                        onClick={() => document.getElementById('itemImageInput').click()}
                        disabled={uploadingImage}
                        style={{
                          padding: '8px 12px',
                          background: theme.accentSecondary,
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: uploadingImage ? 'not-allowed' : 'pointer',
                          opacity: uploadingImage ? 0.6 : 1,
                        }}
                      >
                        {uploadingImage ? '⏳ Uploading...' : '📤 Upload Image'}
                      </button>
                      <input
                        type="text"
                        placeholder="Or paste image URL"
                        value={formData.itemImageUrl}
                        onChange={(e) => setFormData({ ...formData, itemImageUrl: e.target.value })}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          background: theme.surfacePrimary,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '6px',
                          color: theme.textPrimary,
                          fontSize: '11px',
                          fontFamily: 'inherit',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    {formData.itemImage && (
                      <div style={{ marginBottom: '8px' }}>
                        <img 
                          src={formData.itemImage} 
                          alt="preview" 
                          style={{ maxWidth: '60px', maxHeight: '60px', borderRadius: '4px' }} 
                        />
                      </div>
                    )}

                    {/* Color Picker - Optional */}
                    <label style={{ color: theme.textSecondary, fontSize: '11px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                      🎨 Fallback Color (Optional)
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={formData.itemColor}
                        onChange={(e) => setFormData({ ...formData, itemColor: e.target.value })}
                        style={{
                          width: '50px',
                          height: '40px',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      />
                      <span style={{ color: theme.textSecondary, fontSize: '11px', fontFamily: 'monospace' }}>
                        {formData.itemColor || 'None'}
                      </span>
                      <button
                        onClick={() => setFormData({ ...formData, itemColor: '' })}
                        style={{
                          padding: '4px 8px',
                          background: 'transparent',
                          color: theme.textSecondary,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          cursor: 'pointer',
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div>
                  <label style={{ color: theme.textSecondary, fontSize: '12px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                    Items ({formData.items.length})
                  </label>
                  <div style={{
                    background: theme.surfacePrimary,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    padding: '10px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {formData.items.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: theme.background,
                            border: `1px solid ${theme.border}`,
                            padding: '8px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'space-between',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.label} 
                                style={{ width: '30px', height: '30px', borderRadius: '4px', objectFit: 'cover' }} 
                              />
                            )}
                            {item.color && !item.image && (
                              <div 
                                style={{ 
                                  width: '30px', 
                                  height: '30px', 
                                  background: item.color, 
                                  borderRadius: '4px',
                                }} 
                              />
                            )}
                            <div>
                              <div style={{ color: theme.textPrimary, fontSize: '12px', fontWeight: '600' }}>
                                {item.label}
                              </div>
                              {item.color && (
                                <div style={{ color: theme.textSecondary, fontSize: '10px' }}>
                                  {item.color}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(idx)}
                            style={{
                              background: '#FF6B6B25',
                              border: 'none',
                              color: '#FF6B6B',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  onClick={resetForm}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    color: theme.textPrimary,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTemplate}
                  style={{
                    padding: '8px 16px',
                    background: theme.accentPrimary,
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {editingTemplate ? '💾 Update Template' : '➕ Create Template'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Template Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              width: '100%',
              padding: '12px',
              background: `linear-gradient(135deg, ${theme.accentPrimary}, ${theme.accentSecondary})`,
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              marginBottom: '24px',
            }}
          >
            ➕ Create New Template
          </button>
        )}

        {/* Templates List */}
        <div>
          <h3 style={{ color: theme.textPrimary, fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>
            {loading ? '⏳ Loading Templates...' : `Templates (${templates.length})`}
          </h3>
          
          {loading ? (
            <div style={{ textAlign: 'center', color: theme.textSecondary, padding: '20px' }}>
              Loading templates...
            </div>
          ) : templates.length === 0 ? (
            <div style={{ textAlign: 'center', color: theme.textSecondary, padding: '20px' }}>
              No templates available
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {templates.map(template => (
                <div
                  key={template.id}
                  style={{
                    background: theme.background,
                    border: `2px solid ${theme.border}`,
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <h4 style={{ color: theme.textPrimary, fontSize: '14px', fontWeight: '700', margin: 0 }}>
                        {template.name}
                      </h4>
                    </div>
                    <p style={{ color: theme.textSecondary, fontSize: '12px', margin: '0 0 8px 0' }}>
                      {template.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {(template.items || []).slice(0, 8).map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: `${theme.accentPrimary}20`,
                            color: theme.accentPrimary,
                            padding: '4px 8px',
                            borderRadius: '3px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.label} 
                              style={{ width: '14px', height: '14px', borderRadius: '2px', objectFit: 'cover' }} 
                            />
                          )}
                          {item.color && !item.image && (
                            <div 
                              style={{ 
                                width: '8px', 
                                height: '8px', 
                                background: item.color, 
                                borderRadius: '1px',
                              }} 
                            />
                          )}
                          <span>{item.label || item}</span>
                        </div>
                      ))}
                      {(template.items || []).length > 8 && (
                        <span style={{
                          color: theme.textSecondary,
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '3px 8px',
                        }}>
                          +{(template.items || []).length - 8} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '6px', minWidth: 'fit-content' }}>
                    <button
                    onClick={() => handleEditTemplate(template)}
                    style={{
                      padding: '6px 12px',
                      background: `${theme.accentPrimary}25`,
                      color: theme.accentPrimary,
                      border: `1px solid ${theme.accentPrimary}`,
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#FF6B6B25',
                      color: '#FF6B6B',
                      border: '1px solid #FF6B6B',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️ Delete
                  </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
