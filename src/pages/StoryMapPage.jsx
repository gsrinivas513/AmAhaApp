import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import SiteLayout from "../layouts/SiteLayout";
import StoryMapCard from "../components/Story/StoryMapCard";
import { getAllStories } from "../services/storyService";
import "../styles/StoryMapPage.css";

export default function StoryMapPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all"); // all, in-progress, completed, not-started

  useEffect(() => {
    const loadStories = async () => {
      try {
        setLoading(true);
        const storiesList = await getAllStories();
        console.log('Fetched stories from Firestore:', storiesList);
        setStories(storiesList || []);
        applyFilter(storiesList, filterType);
      } catch (err) {
        console.error("Failed to load stories:", err);
        setError("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };

    loadStories();
  }, []);

  const applyFilter = (storiesList, type) => {
    let filtered = storiesList;
    
    if (type === "in-progress") {
      filtered = storiesList.filter(s => s.progress > 0 && s.progress < s.totalChapters);
    } else if (type === "completed") {
      filtered = storiesList.filter(s => s.progress === s.totalChapters);
    } else if (type === "not-started") {
      filtered = storiesList.filter(s => s.progress === 0);
    }

    setFilteredStories(filtered);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    applyFilter(stories, type);
  };

  const handleSelectStory = (story) => {
    // Navigate to story detail/play page
    navigate(`/story/${story.id}`);
  };

  return (
    <SiteLayout>
      <div className="story-map-page">
        <div className="story-container">
          <div className="story-header">
            <h1>📖 Learning Stories</h1>
            <p>Complete stories to learn step-by-step</p>
          </div>

          <div className="story-filters">
            {[
              { value: "all", label: "All Stories" },
              { value: "in-progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
              { value: "not-started", label: "Not Started" },
            ].map((filter) => (
              <button
                key={filter.value}
                className={`filter-button ${filterType === filter.value ? "active" : ""}`}
                onClick={() => handleFilterChange(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="loading-spinner">Loading stories...</div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}

          {!loading && !error && filteredStories.length === 0 && (
            <div className="empty-state">
              <p>
                {filterType === "all"
                  ? "No stories available yet."
                  : `No ${filterType.replace("-", " ")} stories.`}
              </p>
              <p>Check back soon for new learning adventures!</p>
            </div>
          )}

          {!loading && !error && filteredStories.length > 0 && (
            <div className="story-grid">
              {filteredStories.map((story) => (
                <StoryMapCard
                  key={story.id}
                  story={story}
                  onSelectStory={handleSelectStory}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
