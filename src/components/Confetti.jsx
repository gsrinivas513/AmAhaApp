// src/components/Confetti.jsx
// Simple confetti animation effect
import React, { useState, useEffect } from 'react';

export default function Confetti({ trigger = false }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger || particles.length > 0) return;

    // Create 50 confetti particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.2,
      duration: 2.5 + Math.random() * 0.5,
      size: 8 + Math.random() * 8,
      color: ['#4ECB71', '#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8E72'][Math.floor(Math.random() * 6)],
      opacity: Math.random() * 0.7 + 0.3,
      rotate: Math.random() * 360,
    }));

    setParticles(newParticles);

    // Clear particles after animation completes
    const timer = setTimeout(() => setParticles([]), 3000);
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'fixed',
            left: `${particle.left}%`,
            top: '-20px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: particle.color,
            borderRadius: '50%',
            opacity: particle.opacity,
            animation: `fall ${particle.duration}s linear ${particle.delay}s forwards`,
            pointerEvents: 'none',
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
