import React, { useState, useEffect } from 'react';
import { initializeStoriesHierarchy } from '../utils/initializeStoriesHierarchy';

export default function InitializeStoriesPage() {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleInitialize = async () => {
    setIsLoading(true);
    setStatus('Initializing Stories Hierarchy...');
    
    try {
      await initializeStoriesHierarchy();
      setStatus('✅ Stories Hierarchy Initialized Successfully!');
      setIsComplete(true);
      
      // Redirect to stories page after 2 seconds
      setTimeout(() => {
        window.location.href = '/stories';
      }, 2000);
    } catch (error) {
      console.error('Error initializing stories:', error);
      setStatus(`❌ Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run initialization on mount
    handleInitialize();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
        <div className="mb-8">
          <span className="text-6xl">📖</span>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Initialize Stories</h1>
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
          {isLoading && !isComplete ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin mb-4">
                <span className="text-4xl">⏳</span>
              </div>
              <p className="text-gray-700 font-semibold">{status}</p>
            </div>
          ) : isComplete ? (
            <p className="text-green-600 font-semibold text-lg">{status}</p>
          ) : (
            <>
              <p className="text-gray-700 mb-4">
                Set up the Stories feature with categories, topics, and subtopics
              </p>
              <button
                onClick={handleInitialize}
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 px-8 rounded-lg transition-all"
              >
                {isLoading ? 'Initializing...' : 'Start Initialization'}
              </button>
            </>
          )}
        </div>

        {!isLoading && !isComplete && (
          <p className="text-sm text-gray-600">
            This will set up 4 categories, 9 topics, and 8+ subtopics
          </p>
        )}

        {isComplete && (
          <p className="text-sm text-gray-600">
            Redirecting to Stories page...
          </p>
        )}
      </div>
    </div>
  );
}
