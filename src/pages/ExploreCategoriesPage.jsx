import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SiteLayout from '../layouts/SiteLayout';
import { useTheme } from '../context/ThemeContext';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ResponsiveImage } from '../components/OptimizedImage';

function ExploreCategoriesPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [features, setFeatures] = useState([]);
  const [featureData, setFeatureData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all features
      const featuresSnapshot = await getDocs(collection(db, 'features'));
      const featuresData = featuresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch categories and topics for each feature
      const dataMap = {};
      for (const feature of featuresData) {
        dataMap[feature.id] = {
          categories: [],
          categoryTopics: {},
        };

        // Fetch categories for this feature
        const categoriesSnapshot = await getDocs(
          query(
            collection(db, 'categories'),
            where('featureId', '==', feature.id),
            where('status', '==', 'published'),
            where('visibility', '!=', 'private')
          )
        );
        const categories = categoriesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })).sort((a, b) => {
          // Featured first, then by name
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (a.name || "").localeCompare(b.name || "");
        });

        dataMap[feature.id].categories = categories;

        // Fetch topics for each category
        for (const category of categories) {
          const topicsSnapshot = await getDocs(
            query(
              collection(db, 'topics'),
              where('categoryId', '==', category.id),
              where('status', '==', 'published'),
              where('visibility', '!=', 'private')
            )
          );
          const topics = topicsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })).sort((a, b) => {
            // Featured first, then by name
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return (a.name || "").localeCompare(b.name || "");
          });
          dataMap[feature.id].categoryTopics[category.id] = topics;
        }
      }

      setFeatures(featuresData);
      setFeatureData(dataMap);
      if (featuresData.length > 0) {
        setSelectedFeature(featuresData[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const featureColors = [
    theme.accentPrimary,
    theme.accentSecondary,
    theme.accentTertiary,
    theme.accentAccent,
  ];

  const getFeatureColor = (index) => featureColors[index % featureColors.length];

  const handleTopicClick = (feature, category, topic) => {
    if (feature.featureType === 'puzzle') {
      navigate(
        `/puzzle/${encodeURIComponent(category.name || category.label)}/${encodeURIComponent(
          topic.name || topic.label
        )}`
      );
    } else {
      navigate(
        `/quiz/${encodeURIComponent(category.name || category.label)}/${encodeURIComponent(
          topic.name || topic.label
        )}`
      );
    }
  };

  if (loading) {
    return (
      <SiteLayout>
        <div style={{ background: theme.background, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: theme.textSecondary, fontSize: '16px' }}>Loading content...</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  const currentFeature = features.find((f) => f.id === selectedFeature);
  const categories = featureData[selectedFeature]?.categories || [];
  const categoryTopics = featureData[selectedFeature]?.categoryTopics || {};

  return (
    <SiteLayout>
      <div style={{ background: theme.background, minHeight: '100vh', paddingTop: '40px' }}>
        {/* Hero Section */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: '800',
              color: theme.textPrimary,
              marginBottom: '16px',
            }}
          >
            🔍 Explore & Browse
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: theme.textSecondary,
              maxWidth: '600px',
              margin: '0 auto 40px',
              lineHeight: '1.6',
            }}
          >
            Discover all available topics, categories, and content across different learning areas.
          </p>
        </div>

        {/* Feature Tabs */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px 40px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {features.map((feature, idx) => (
            <button
              key={feature.id}
              onClick={() => setSelectedFeature(feature.id)}
              style={{
                padding: '12px 24px',
                border: selectedFeature === feature.id ? 'none' : `1px solid ${theme.border}`,
                background: selectedFeature === feature.id ? getFeatureColor(idx) : 'transparent',
                color: selectedFeature === feature.id ? theme.background : theme.textPrimary,
                borderRadius: '24px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (selectedFeature !== feature.id) {
                  e.target.style.background = theme.surfaceSecondary;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedFeature !== feature.id) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {feature.icon || '✨'} {feature.label || feature.name}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px 80px',
          }}
        >
          {categories.length > 0 ? (
            <>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: theme.textPrimary,
                  marginBottom: '32px',
                  textAlign: 'center',
                }}
              >
                {currentFeature?.label || currentFeature?.name} Categories
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '24px',
                }}
              >
                {categories.map((category) => {
                  const topics = categoryTopics[category.id] || [];
                  const featureColor = getFeatureColor(features.indexOf(currentFeature));

                  return (
                    <div
                      key={category.id}
                      style={{
                        padding: '24px',
                        background: theme.surfacePrimary,
                        border: `1px solid ${theme.border}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = `0 16px 32px ${featureColor}20`;
                        e.currentTarget.style.borderColor = featureColor;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = theme.border;
                      }}
                    >
                      {/* Decorative Background */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '-50%',
                          right: '-50%',
                          width: '200px',
                          height: '200px',
                          background: `radial-gradient(circle, ${featureColor}15, transparent)`,
                          pointerEvents: 'none',
                        }}
                      />

                      <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Icon */}
                        <div
                          style={{
                            fontSize: '40px',
                            marginBottom: '16px',
                          }}
                        >
                          {category.icon || '📚'}
                        </div>

                        {/* Title & Description */}
                        <h3
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: theme.textPrimary,
                            marginBottom: '8px',
                          }}
                        >
                          {category.label || category.name}
                        </h3>
                        <p
                          style={{
                            fontSize: '13px',
                            color: theme.textSecondary,
                            marginBottom: '20px',
                          }}
                        >
                          {topics.length} {topics.length === 1 ? 'Topic' : 'Topics'}
                        </p>

                        {/* Topics Preview */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: '8px',
                            marginBottom: '20px',
                          }}
                        >
                          {topics.slice(0, 4).map((topic) => (
                            <div
                              key={topic.id}
                              style={{
                                padding: '8px 12px',
                                background: `${featureColor}15`,
                                border: `1px solid ${featureColor}30`,
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: featureColor,
                                textAlign: 'center',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                              title={topic.label || topic.name}
                            >
                              {topic.label || topic.name}
                            </div>
                          ))}
                        </div>

                        {/* Explore Button */}
                        <button
                          onClick={() => navigate(`/category/${category.id}`)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            background: featureColor,
                            color: theme.background,
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s',
                          }}
                          onMouseEnter={(e) => (e.target.style.opacity = '0.8')}
                          onMouseLeave={(e) => (e.target.style.opacity = '1')}
                        >
                          Explore →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.accentPrimary}10, ${theme.accentSecondary}10)`,
                borderRadius: '16px',
                border: `1px solid ${theme.accentPrimary}30`,
              }}
            >
              <p style={{ color: theme.textSecondary, fontSize: '16px' }}>
                No categories available for {currentFeature?.label || currentFeature?.name} yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

export default ExploreCategoriesPage;

