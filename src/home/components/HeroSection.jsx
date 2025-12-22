// src/home/components/HeroSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/ui";

export default function HeroSection() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");

  return (
    <section className="bg-white">
      {/* FUTURE: Top Pink Banner - Join Game PIN Entry (for group play feature)
          Hidden for now, will be enabled when multiplayer/group play is implemented.
          To enable: Remove display:none style below.
      */}
      <div className="bg-gradient-to-r from-pink-200 to-pink-300 px-4 py-6 mb-8" style={{ display: 'none' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">
            Join Game? Enter PIN:
          </h2>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="123 456"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="px-4 py-2.5 rounded-full border-2 border-gray-900 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary-600"
              maxLength="6"
            />
            <Button variant="success" size="md" onClick={() => navigate("/quiz")}>
              Sign in
            </Button>
          </div>
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left: Logo & CTAs */}
          <div>
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
                AMAHA.COM
              </h1>
              <p className="text-lg text-gray-600">
                Learn through play. Test your knowledge. Win rewards.
              </p>
            </div>

            <div className="space-y-4">
              {/* Start Quiz Button */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => navigate("/quiz")}
              >
                🎮 Start Quiz
              </Button>

              {/* Sign Up Button */}
              <Button
                variant="secondary"
                size="lg"
                fullWidth
              >
                👤 Sign Up
              </Button>
            </div>
          </div>

          {/* Right: Decorative illustration area with advanced animations */}
          <div className="hidden md:flex items-center justify-center relative">
            {/* Main gradient card background */}
            <div className="w-full aspect-square bg-gradient-to-br from-purple-500 via-primary-400 to-cyan-400 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl">
              
              {/* Advanced animation styles */}
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes float {
                  0%, 100% { transform: translateY(0px) scale(1); opacity: 1; }
                  50% { transform: translateY(-30px) scale(1.1); opacity: 0.9; }
                }
                @keyframes float-reverse {
                  0%, 100% { transform: translateY(0px) scale(1); opacity: 1; }
                  50% { transform: translateY(30px) scale(0.9); opacity: 0.85; }
                }
                @keyframes rotate-slow {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes pulse-glow {
                  0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.4); }
                  50% { box-shadow: 0 0 40px rgba(255,255,255,0.8); }
                }
                @keyframes float-particle {
                  0% { transform: translateY(100px) translateX(-50px); opacity: 0; }
                  10% { opacity: 1; }
                  90% { opacity: 1; }
                  100% { transform: translateY(-100px) translateX(50px); opacity: 0; }
                }
                @keyframes orbit {
                  from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
                  to { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
                }
                @keyframes orbit-reverse {
                  from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
                  to { transform: rotate(-360deg) translateX(100px) rotate(360deg); }
                }
                @keyframes bounce-gentle {
                  0%, 100% { transform: translateY(0px); }
                  50% { transform: translateY(-15px); }
                }
                .float-icon-1 { animation: float 3s ease-in-out infinite; }
                .float-icon-2 { animation: float-reverse 4s ease-in-out infinite; }
                .float-icon-3 { animation: float 3.5s ease-in-out infinite; }
                .rotate-icon { animation: rotate-slow 8s linear infinite; }
                .rotate-reverse { animation: rotate-slow 10s linear infinite reverse; }
                .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
                .particle { animation: float-particle 3s ease-in infinite; }
                .orbit-icon { animation: orbit 6s linear infinite; }
                .orbit-reverse { animation: orbit-reverse 7s linear infinite; }
                .bounce-icon { animation: bounce-gentle 2.5s ease-in-out infinite; }
              `}} />

              {/* Particle effects - subtle floating elements */}
              <div className="absolute w-2 h-2 bg-white rounded-full particle" style={{ left: '20%', top: '30%', animationDelay: '0s' }}></div>
              <div className="absolute w-3 h-3 bg-white rounded-full particle" style={{ left: '70%', top: '20%', animationDelay: '0.5s', opacity: 0.7 }}></div>
              <div className="absolute w-1.5 h-1.5 bg-white rounded-full particle" style={{ left: '40%', top: '50%', animationDelay: '1s' }}></div>
              <div className="absolute w-2 h-2 bg-white rounded-full particle" style={{ left: '80%', top: '60%', animationDelay: '1.5s', opacity: 0.6 }}></div>

              {/* Outer orbiting icons - main features (clockwise) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div style={{ position: 'relative', width: '300px', height: '300px' }}>
                  {/* Quiz icon */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 orbit-icon" style={{ animationDelay: '0s' }}>
                    <div className="text-5xl drop-shadow-lg filter" title="Quizzes">❓</div>
                  </div>
                  {/* Puzzle icon */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 orbit-icon" style={{ animationDelay: '-1.5s' }}>
                    <div className="text-5xl drop-shadow-lg filter" title="Puzzles">🧩</div>
                  </div>
                  {/* Game icon */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 orbit-icon" style={{ animationDelay: '-3s' }}>
                    <div className="text-5xl drop-shadow-lg filter" title="Games">🎮</div>
                  </div>
                  {/* Learning icon */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 orbit-icon" style={{ animationDelay: '-4.5s' }}>
                    <div className="text-5xl drop-shadow-lg filter" title="Learning">📚</div>
                  </div>
                </div>
              </div>

              {/* Inner orbiting icons - supporting features (counter-clockwise) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                  {/* Rewards icon */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 orbit-reverse" style={{ animationDelay: '0s' }}>
                    <div className="text-4xl drop-shadow-lg filter" title="Rewards">🏆</div>
                  </div>
                  {/* Challenge icon */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 orbit-reverse" style={{ animationDelay: '-1.75s' }}>
                    <div className="text-4xl drop-shadow-lg filter" title="Challenges">⚡</div>
                  </div>
                  {/* Achievement icon */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 orbit-reverse" style={{ animationDelay: '-3.5s' }}>
                    <div className="text-4xl drop-shadow-lg filter" title="Achievements">🌟</div>
                  </div>
                </div>
              </div>

              {/* Center rotating rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 border-3 border-white border-opacity-30 rounded-full rotate-icon"></div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 border-2 border-white border-opacity-25 rounded-full rotate-reverse"></div>
              </div>

              {/* Center main icon with enhanced glow */}
              <div className="absolute flex items-center justify-center z-20">
                <div className="relative">
                  <div className="absolute inset-0 bg-white rounded-full opacity-25 blur-lg pulse-glow" style={{ transform: 'scale(2)' }}></div>
                  <div className="text-9xl float-icon-1 relative z-10 drop-shadow-2xl">✨</div>
                </div>
              </div>

              {/* Floating feature badges in corners with bounce */}
              <div className="absolute top-4 left-4 text-4xl float-icon-2 filter drop-shadow-xl bounce-icon">🎯</div>
              <div className="absolute top-6 right-6 text-5xl float-icon-3 filter drop-shadow-xl bounce-icon" style={{ animationDelay: '0.3s' }}>🚀</div>
              <div className="absolute bottom-6 left-6 text-5xl float-icon-1 filter drop-shadow-xl bounce-icon" style={{ animationDelay: '0.6s' }}>💡</div>
              <div className="absolute bottom-4 right-4 text-4xl float-icon-2 filter drop-shadow-xl bounce-icon" style={{ animationDelay: '0.9s' }}>🌈</div>

              {/* Premium gloss overlay */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white via-transparent to-transparent opacity-30 pointer-events-none"></div>
              
              {/* Enhanced corner gradient accents */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-pink-300 via-pink-200 to-transparent rounded-3xl opacity-25 blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-cyan-300 via-cyan-200 to-transparent rounded-3xl opacity-25 blur-2xl"></div>
              <div className="absolute top-1/2 right-0 w-32 h-32 bg-gradient-to-l from-purple-300 to-transparent rounded-3xl opacity-15 blur-2xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative illustration removed to fix JSX mismatch. */}
    </section>
  );
}