import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

// Helper function to generate consistent rating (same as in FeatureTiles)
const generateRealisticRating = (quizCount = 0, categoryId = '') => {
  const minRating = 3.8;
  const maxRating = 5.0;
  const quizFactor = Math.min(quizCount / 100, 0.5);
  
  let hash = 0;
  for (let i = 0; i < categoryId.length; i++) {
    hash = ((hash << 5) - hash) + categoryId.charCodeAt(i);
    hash = hash & hash;
  }
  const normalizedHash = (Math.abs(hash) % 100) / 100;
  const consistentFactor = (normalizedHash - 0.5) * 0.4;
  
  let rating = minRating + quizFactor + consistentFactor;
  rating = Math.max(minRating, Math.min(maxRating, rating));
  return Math.round(rating * 10) / 10;
};

// Fallback static categories (used if Firebase load fails)
const fallbackCategories = [
  {
    key: "kids",
    title: "Kids",
    desc: "Fun & simple quizzes for young minds",
    color: ["#FFEDD5", "#FED7AA"],
    icon: "🧸",
  },
  {
    key: "students",
    title: "Students",
    desc: "School-level learning quizzes",
    color: ["#E0F2FE", "#BAE6FD"],
    icon: "🎓",
  },
  {
    key: "programming",
    title: "Programming",
    desc: "Test your coding knowledge",
    color: ["#ECFDF5", "#BBF7D0"],
    icon: "💻",
  },
  {
    key: "movies",
    title: "Movies",
    desc: "Cinema, actors & trivia",
    color: ["#FCE7F3", "#FBCFE8"],
    icon: "🎬",
  },
  {
    key: "science",
    title: "Science",
    desc: "Biology, physics & curious facts",
    color: ["#EEF2FF", "#E9D5FF"],
    icon: "🔬",
  },
  {
    key: "history",
    title: "History",
    desc: "Events, dates & famous people",
    color: ["#FEF3C7", "#FDE68A"],
    icon: "🏺",
  },
  {
    key: "geography",
    title: "Geography",
    desc: "Places, maps & landmarks",
    color: ["#E0F7FA", "#B2EBF2"],
    icon: "🗺️",
  },
  {
    key: "sports",
    title: "Sports",
    desc: "Rules, players & records",
    color: ["#FFF7ED", "#FFEDD5"],
    icon: "🏅",
  },
  {
    key: "languages",
    title: "Languages",
    desc: "Words, grammar & expressions",
    color: ["#F0FFF4", "#DCFCE7"],
    icon: "🗣️",
  },
  {
    key: "art",
    title: "Art",
    desc: "Design, painting & culture",
    color: ["#FFF1F2", "#FFE4E6"],
    icon: "🎨",
  },
];

export default function QuizCategoryGrid() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      // Load Quiz feature
      const featuresSnap = await getDocs(collection(db, "features"));
      const quizFeature = featuresSnap.docs.find(doc => {
        const data = doc.data();
        return data.type === 'quiz' || data.name?.toLowerCase() === 'quiz';
      });

      if (!quizFeature) {
        console.warn("Quiz feature not found, using fallback categories");
        setCategories(fallbackCategories);
        setLoading(false);
        return;
      }

      // Load categories for Quiz feature
      const categoriesSnap = await getDocs(collection(db, "categories"));
      const quizCategories = categoriesSnap.docs
        .map(doc => {
          const data = doc.data();
          if (data.featureId !== quizFeature.id || data.isPublished === false) {
            return null;
          }

          // Find matching color scheme from fallback
          const fallback = fallbackCategories.find(f => f.key === doc.id);
          
          return {
            key: doc.id,
            title: data.label || data.name || doc.id,
            desc: data.description || fallback?.desc || "Quiz category",
            color: fallback?.color || ["#E0F2FE", "#BAE6FD"],
            icon: data.icon || fallback?.icon || "📚",
            quizCount: data.quizCount || 0,
            rating: generateRealisticRating(data.quizCount || 0, doc.id),
          };
        })
        .filter(Boolean);

      setCategories(quizCategories.length > 0 ? quizCategories : fallbackCategories);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <p className="text-gray-600">Loading quiz categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {categories.map((c) => (
            <div
              key={c.key}
              onClick={() => navigate(`/quiz/${c.key}`)}
              style={{
                cursor: "pointer",
                padding: 18,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${c.color[0]} 0%, ${c.color[1]} 100%)`,
                boxShadow: "0 14px 42px rgba(2,6,23,0.10)",
                border: "1px solid rgba(255,255,255,0.6)",
                minHeight: 140,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                transition: "transform 220ms ease, box-shadow 220ms ease",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 48px rgba(2,6,23,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(2,6,23,0.08)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 30,
                    background: "rgba(255,255,255,0.72)",
                    boxShadow: "0 10px 30px rgba(2,6,23,0.12)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    flexShrink: 0,
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                  }}
                >
                  {c.icon}
                </div>

                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: "#0b1220" }}>{c.title}</h3>
                  <p style={{ margin: 0, marginTop: 6, color: "#334155" }}>{c.desc}</p>
                  {c.quizCount > 0 && (
                    <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#64748b" }}>
                      <span>{c.quizCount} {c.quizCount === 1 ? 'quiz' : 'quizzes'}</span>
                      {c.rating && (
                        <span style={{ color: "#fbbf24" }}>
                          ★ {c.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
                <span style={{ fontSize: 12, color: "#0b1220", fontWeight: 700 }}>Start →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}