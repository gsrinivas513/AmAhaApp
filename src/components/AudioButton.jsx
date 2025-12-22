// src/components/AudioButton.jsx
import React, { useState, useEffect } from 'react';
import { ttsService } from '../utils/textToSpeech';

/**
 * AudioButton Component
 * Provides text-to-speech functionality for kids
 * Shows play/stop state with visual feedback
 */

function AudioButton({ 
  text, 
  className = '',
  size = 'md', // sm, md, lg
  variant = 'default', // default, outline, ghost
  autoPlay = false,
  onStart = null,
  onEnd = null,
  disabled = false,
  ariaLabel = 'Read text aloud'
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Check browser support
  useEffect(() => {
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);
  }, []);

  // Auto play if requested
  useEffect(() => {
    if (autoPlay && isSupported && text) {
      handlePlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, isSupported, text]);

  // Monitor TTS service
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && !ttsService.isPlayingAudio()) {
        setIsPlaying(false);
        if (onEnd) onEnd();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, onEnd]);

  const handlePlay = () => {
    if (!text || !isSupported || disabled) return;

    if (isPlaying) {
      // Stop
      ttsService.stop();
      setIsPlaying(false);
    } else {
      // Play
      setIsPlaying(true);
      ttsService.speak(text, {
        rate: 0.8, // Optimal speed for kids (5-12 years)
        pitch: 1.2, // Clearer, slightly higher pitch for kids
        volume: 1.0, // Full volume
        onStart: () => {
          setIsPlaying(true);
          if (onStart) onStart();
        },
        onEnd: () => {
          setIsPlaying(false);
          if (onEnd) onEnd();
        },
        onError: (err) => {
          console.error('Audio error:', err);
          setIsPlaying(false);
        },
      });
    }
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  // Variant styles
  const variantStyles = {
    default: isPlaying 
      ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg'
      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md',
    outline: isPlaying
      ? 'border-2 border-green-500 text-green-500 bg-green-50'
      : 'border-2 border-blue-500 text-blue-500 bg-blue-50 hover:bg-blue-100',
    ghost: isPlaying
      ? 'text-green-600 hover:bg-green-100'
      : 'text-blue-600 hover:bg-blue-100',
  };

  if (!isSupported) {
    return (
      <button
        disabled
        className={`px-3 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed ${className}`}
        title="Text-to-speech not supported"
      >
        🔊 Not Supported
      </button>
    );
  }

  return (
    <button
      onClick={handlePlay}
      disabled={!text || disabled}
      className={`
        inline-flex items-center gap-2 rounded-lg font-semibold
        transition-all duration-200 transform
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${!text || disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
        ${className}
      `}
      aria-label={ariaLabel}
      title={isPlaying ? 'Stop reading' : 'Read aloud'}
    >
      <span className={`text-lg transition-transform ${isPlaying ? 'animate-pulse' : ''}`}>
        {isPlaying ? '🔊' : '🔉'}
      </span>
      <span className="hidden sm:inline">
        {isPlaying ? 'Stop' : 'Read'}
      </span>
    </button>
  );
}

export default AudioButton;
