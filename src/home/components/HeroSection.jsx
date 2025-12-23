// src/home/components/HeroSection.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "../../components/ui";

export default function HeroSection() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

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
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Logo & CTAs */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-gray-700">10,000+ Active Learners</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                Play. Learn.
                <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Have Fun!
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl">
                Learn with fun through engaging quizzes, puzzles, and challenges. Master new skills while playing and earn amazing rewards!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate('/quiz')}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative z-10">🎮 Start Playing & Learning</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => navigate('/quiz')}
                className="px-8 py-4 bg-white text-purple-600 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl border-2 border-purple-200 hover:border-purple-400 transform hover:-translate-y-1 transition-all duration-300"
              >
                🧩 Explore Categories
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold">Free to Start</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-semibold">1M+ Questions</span>
              </div>
            </div>
          </div>

          {/* Right: Visual Element */}
          <div className="relative animate-fade-in-right">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
              {/* Feature showcase cards */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Personalized Learning</h3>
                    <p className="text-sm text-gray-600">AI-powered adaptive quizzes</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-2xl">
                    🏆
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Earn Rewards</h3>
                    <p className="text-sm text-gray-600">Unlock badges and certificates</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                    📊
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Track Progress</h3>
                    <p className="text-sm text-gray-600">Detailed analytics dashboard</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pink-50 to-yellow-50 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-yellow-500 rounded-xl flex items-center justify-center text-2xl">
                    🌍
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Global Community</h3>
                    <p className="text-sm text-gray-600">Learn with millions worldwide</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative bg-white/50 backdrop-blur-sm py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                1M+
              </div>
              <div className="text-gray-600 font-semibold">Questions</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-gray-600 font-semibold">Categories</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                10K+
              </div>
              <div className="text-gray-600 font-semibold">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 to-yellow-600 bg-clip-text text-transparent">
                4.9★
              </div>
              <div className="text-gray-600 font-semibold">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}