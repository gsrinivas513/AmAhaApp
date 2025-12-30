/**
 * TestDataButton.jsx
 * Simple button to generate test data
 * Add this to your admin panel for quick testing
 * 
 * Usage:
 * import TestDataButton from './TestDataButton';
 * <TestDataButton />
 */

import React, { useState } from 'react';
import { createTestStoryAndDelete } from '../services/storyTestDataGenerator';
import './TestDataButton.css';

export default function TestDataButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreateTestData = async () => {
    if (window.confirm('This will DELETE all existing stories and create a test story with chapters. Continue?')) {
      try {
        setIsLoading(true);
        setMessage('Creating test data...');
        await createTestStoryAndDelete();
        setMessage('✅ Test story created! Refresh page to see it.');
      } catch (error) {
        setMessage('❌ Error: ' + error.message);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="test-data-button-container">
      <button 
        onClick={handleCreateTestData}
        disabled={isLoading}
        className="test-data-button"
      >
        {isLoading ? '⏳ Creating...' : '🧪 Create Test Story'}
      </button>
      {message && <div className="test-data-message">{message}</div>}
    </div>
  );
}
