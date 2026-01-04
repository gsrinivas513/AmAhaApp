import React, { useState } from 'react';
import ClassicJigsawGame from './ClassicJigsawGame';

export default function JigsawTest() {
  // Create SVG data URI - no CORS issues
  const createSvgImage = () => {
    const svg = `
      <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#4ECDC4;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#45B7D1;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="600" height="400" fill="url(#grad)"/>
        <circle cx="150" cy="100" r="50" fill="rgba(255,255,255,0.3)"/>
        <circle cx="450" cy="300" r="60" fill="rgba(255,255,255,0.3)"/>
        <circle cx="300" cy="200" r="40" fill="rgba(255,255,255,0.2)"/>
        <text x="300" y="200" font-size="48" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">JIGSAW</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h1>Jigsaw Puzzle Test Component</h1>
      <p>Testing jigsaw puzzle piece generation and rendering</p>
      
      <ClassicJigsawGame 
        imageUrl={createSvgImage()} 
        rows={3}
        cols={4}
      />
    </div>
  );
}
