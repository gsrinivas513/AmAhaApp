// src/admin/SocialMediaManagerPage.jsx
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Button, Card, Input } from '../components/ui';
import SocialContentEngine from '../services/socialMedia/SocialContentEngine';
import SocialScheduler from '../services/socialMedia/SocialScheduler';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

function SocialMediaManagerPage() {
  const [activeTab, setActiveTab] = useState('generate');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [contentType, setContentType] = useState('quiz');
  const [postsToGenerate, setPostsToGenerate] = useState(3);
  const [schedule, setSchedule] = useState(null);
  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    if (activeTab === 'drafts') {
      fetchDraftPosts();
    } else if (activeTab === 'scheduled') {
      fetchScheduledPosts();
    }
  }, [activeTab]);

  const fetchDraftPosts = async () => {
    setLoading(true);
    try {
      const draftPosts = await SocialContentEngine.getPostsByStatus('draft');
      setPosts(draftPosts);
    } catch (error) {
      console.error('Error fetching draft posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledPosts = async () => {
    setLoading(true);
    try {
      const scheduledPosts = await SocialContentEngine.getPostsByStatus(
        'scheduled'
      );
      setPosts(scheduledPosts);
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePosts = async () => {
    setGenerating(true);
    try {
      const generated = await SocialContentEngine.generateFromTrendingContent(
        contentType,
        postsToGenerate
      );
      
      // Show success message
      alert(`✅ Generated ${generated.length} social media posts!`);
      console.log('Generated posts:', generated);
      
      // Immediately set the generated posts in state
      setPosts(generated);
      
      // Switch to drafts tab
      setActiveTab('drafts');
      
      // Also fetch from Firestore to ensure we have the latest
      setTimeout(async () => {
        try {
          setLoading(true);
          const draftPosts = await SocialContentEngine.getPostsByStatus('draft');
          console.log('Fetched draft posts from Firestore:', draftPosts);
          setPosts(draftPosts);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching draft posts:', error);
          // Keep the generated posts if fetch fails
          setLoading(false);
        }
      }, 500);
    } catch (error) {
      console.error('Error generating posts:', error);
      alert('Failed to generate posts. Check console for details.');
    } finally {
      setGenerating(false);
    }
  };

  const handleApprovePost = async (postId) => {
    try {
      await SocialContentEngine.updatePostStatus(postId, 'approved');
      setPosts(posts.map((p) => (p.id === postId ? { ...p, status: 'approved' } : p)));
      alert('Post approved!');
    } catch (error) {
      console.error('Error approving post:', error);
      alert('Failed to approve post');
    }
  };

  const handleSchedulePost = async (postId, date) => {
    try {
      await SocialScheduler.schedulePost(postId, new Date(date), timezone);
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, status: 'scheduled' } : p
        )
      );
      alert('Post scheduled!');
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert('Failed to schedule post');
    }
  };

  const handleDeletePost = async (postId) => {
    if (
      window.confirm('Are you sure you want to delete this post?')
    ) {
      try {
        const postRef = doc(db, 'social_posts', postId);
        await updateDoc(postRef, { status: 'deleted' });
        setPosts(posts.filter((p) => p.id !== postId));
        alert('Post deleted!');
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  const handleEditPost = (post) => {
    setSelectedPost(post);
    setShowPreview(true);
  };

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">📱 Social Media Manager</h1>
        <p className="text-gray-600 mb-8">
          Automatically generate and manage social media content for Instagram, Facebook, Twitter, and LinkedIn
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          {['generate', 'drafts', 'scheduled', 'published'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Generate Tab */}
        {activeTab === 'generate' && (
          <div className="space-y-6">
            <Card>
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Generate Posts from Trending Content</h2>
                <p className="text-gray-600">
                  Automatically create social media posts from your latest quizzes and puzzles
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Content Type
                    </label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                      <option value="quiz">Quiz</option>
                      <option value="puzzle">Puzzle</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Posts to Generate
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={postsToGenerate}
                      onChange={(e) => setPostsToGenerate(parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      onClick={handleGeneratePosts}
                      disabled={generating}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
                    >
                      {generating ? '⏳ Generating...' : '✨ Generate Posts'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Tips */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Quick Tips</h3>
                <ul className="space-y-3 text-gray-700">
                  <li>✓ Posts are generated in draft status - review before scheduling</li>
                  <li>✓ Each post includes custom captions, hashtags, and image prompts</li>
                  <li>✓ Platform-specific variations for Instagram, Facebook, Twitter & LinkedIn</li>
                  <li>✓ Kid-friendly tone for kids content, professional tone for programming</li>
                  <li>✓ Use the preview to see how posts will look before approval</li>
                </ul>
              </div>
            </Card>
          </div>
        )}

        {/* Drafts Tab */}
        {activeTab === 'drafts' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">Loading draft posts...</div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onEdit={() => handleEditPost(post)}
                    onApprove={() => handleApprovePost(post.id)}
                    onDelete={() => handleDeletePost(post.id)}
                    onSchedule={(date) => handleSchedulePost(post.id, date)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <div className="p-12 text-center">
                  <p className="text-gray-600 text-lg">No draft posts yet. Generate some posts to get started!</p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Scheduled Tab */}
        {activeTab === 'scheduled' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12">Loading scheduled posts...</div>
            ) : posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {posts.map((post) => (
                  <ScheduledPostCard
                    key={post.id}
                    post={post}
                    onEdit={() => handleEditPost(post)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <div className="p-12 text-center">
                  <p className="text-gray-600 text-lg">No scheduled posts. Approve and schedule some posts!</p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Post Preview Modal */}
        {showPreview && selectedPost && (
          <PostPreviewModal
            post={selectedPost}
            onClose={() => {
              setShowPreview(false);
              setSelectedPost(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}

// Post Card Component
function PostCard({ post, onEdit, onApprove, onDelete, onSchedule }) {
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                {post.platform}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                {post.contentType}
              </span>
            </div>
            <p className="text-gray-700 line-clamp-2">{post.caption}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {post.hashtags.map((tag, i) => (
            <span key={i} className="text-blue-600 text-sm">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onEdit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            👁️ Preview
          </Button>
          <Button
            onClick={onApprove}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            ✅ Approve
          </Button>
          <Button
            onClick={() => setShowSchedule(!showSchedule)}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            📅 Schedule
          </Button>
          <Button
            onClick={onDelete}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            🗑️ Delete
          </Button>
        </div>

        {showSchedule && (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  if (scheduleDate) {
                    onSchedule(scheduleDate);
                    setShowSchedule(false);
                  }
                }}
                className="flex-1 bg-purple-600 text-white"
              >
                Confirm Schedule
              </Button>
              <Button
                onClick={() => setShowSchedule(false)}
                className="flex-1 bg-gray-400 text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Scheduled Post Card Component
function ScheduledPostCard({ post, onEdit }) {
  const scheduledDate = post.scheduledFor
    ? new Date(post.scheduledFor.toDate ? post.scheduledFor.toDate() : post.scheduledFor).toLocaleString()
    : 'Not scheduled';

  return (
    <Card>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {post.platform}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                {post.status}
              </span>
            </div>
            <p className="text-gray-700 line-clamp-2">{post.caption}</p>
            <p className="text-sm text-gray-500 mt-2">📅 {scheduledDate}</p>
          </div>
        </div>

        <Button
          onClick={onEdit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          👁️ View Details
        </Button>
      </div>
    </Card>
  );
}

// Post Preview Modal
function PostPreviewModal({ post, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-96 overflow-y-auto">
        <div className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Post Preview</h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Platform</label>
            <p className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900 capitalize font-semibold">
              {post.platform}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Caption</label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 whitespace-pre-wrap">
              {post.caption}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hashtags</label>
            <div className="flex flex-wrap gap-2">
              {post.hashtags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {post.imageUrl && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image</label>
              <img src={post.imageUrl} alt="Post" className="max-w-full h-auto rounded-lg" />
            </div>
          )}

          {post.imagePrompt && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">AI Image Prompt</label>
              <p className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 text-sm italic">
                {post.imagePrompt}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">CTA</label>
            <p className="px-4 py-2 bg-gray-100 rounded-lg text-gray-900">{post.cta}</p>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default SocialMediaManagerPage;
