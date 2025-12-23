// src/components/ImageUpload.jsx
import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/firebaseConfig';
import { uploadToCloudinary, isCloudinaryConfigured } from '../config/cloudinaryConfig';

export default function ImageUpload({ value, onChange, label = "Image", folder = "amaha" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      // Try Cloudinary first if configured
      if (isCloudinaryConfigured()) {
        const result = await uploadToCloudinary(file, folder, setProgress);
        
        // Return object with both URL and cloudinaryId
        onChange({
          url: result.url,
          cloudinaryId: result.publicId,
        });
        
        setUploading(false);
        setProgress(0);
        return;
      }

      // Fallback to Firebase Storage
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `images/${filename}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(prog);
        },
        (error) => {
          console.error('Upload error:', error);
          setError('Upload failed. Please try again.');
          setUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Return URL string for Firebase (backward compatible)
          onChange(downloadURL);
          
          setUploading(false);
          setProgress(0);
        }
      );
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ display: 'block', marginBottom: 4, fontWeight: 600, fontSize: 14 }}>
        {label}
      </label>
      
      {/* Configuration Status */}
      {isCloudinaryConfigured() ? (
        <div style={{ 
          padding: '6px 10px', 
          background: '#d1fae5', 
          color: '#065f46', 
          borderRadius: 6, 
          fontSize: 11,
          fontWeight: 600
        }}>
          ✓ Cloudinary CDN Active
        </div>
      ) : (
        <div style={{ 
          padding: '6px 10px', 
          background: '#fef3c7', 
          color: '#92400e', 
          borderRadius: 6, 
          fontSize: 11,
          fontWeight: 600
        }}>
          ⚠️ Using Firebase Storage (Add Cloudinary config for CDN)
        </div>
      )}
      
      {/* URL Input */}
      <input
        type="text"
        value={typeof value === 'string' ? value : value?.url || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Or paste image URL"
        style={{
          width: '100%',
          padding: '10px 12px',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          fontSize: 14,
          fontFamily: 'inherit'
        }}
      />

      {/* File Upload Button */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label
          style={{
            padding: '8px 16px',
            background: uploading ? '#94a3b8' : '#0284c7',
            color: 'white',
            borderRadius: 6,
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontSize: 13,
            fontWeight: 600,
            display: 'inline-block',
            transition: 'all 0.2s'
          }}
        >
          {uploading ? `Uploading ${progress.toFixed(0)}%` : '📤 Upload Image'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
        <span style={{ fontSize: 12, color: '#64748b' }}>
          Max 2MB • JPG, PNG, GIF
        </span>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div style={{ 
          width: '100%', 
          height: 6, 
          background: '#e2e8f0', 
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          <div 
            style={{ 
              width: `${progress}%`, 
              height: '100%', 
              background: '#0284c7',
              transition: 'width 0.3s'
            }}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: 8, 
          background: '#fee2e2', 
          color: '#dc2626', 
          borderRadius: 6, 
          fontSize: 12 
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Image Preview & Remove Button (always visible if value exists) */}
      {(value || (typeof value === 'object' && value?.url)) && (
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#64748b' }}>
            Preview:
          </div>
          <div style={{ 
            width: '100%', 
            height: 120, 
            borderRadius: 8, 
            overflow: 'hidden', 
            border: '2px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={typeof value === 'string' ? value : value?.url} 
              alt="Preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.parentElement.innerHTML = '<span style="color: #ef4444; font-size: 12px;">⚠️ Invalid image URL</span>';
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            style={{
              marginTop: 8,
              padding: '6px 12px',
              background: '#fee2e2',
              color: '#dc2626',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🗑️ Remove Image
          </button>
        </div>
      )}
    </div>
  );
}
