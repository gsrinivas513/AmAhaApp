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

  const loadCategories = async () => {
    try {
      console.log("🔍 [QuizCategoryGrid] Starting to load categories...");
      
      // Load all categories from Firestore
      const categoriesSnap = await getDocs(collection(db, "categories"));
      console.log("📊 [QuizCategoryGrid] Firestore query returned:", {
        total: categoriesSnap.docs.length,
        empty: categoriesSnap.empty,
      });
      
      if (categoriesSnap.empty) {
        console.warn("⚠️ [QuizCategoryGrid] No categories found in Firestore, using fallback categories");
        console.log("🎨 [QuizCategoryGrid] Fallback categories:", fallbackCategories.map(c => c.title));
        setCategories(fallbackCategories);
        setLoading(false);
        return;
      }

      // Log all categories found
      console.log("📋 [QuizCategoryGrid] All categories in Firestore:");
      categoriesSnap.docs.forEach((doc, idx) => {
        console.log(`  ${idx + 1}. ID: ${doc.id}, Data:`, doc.data());
      });

      // Map Firestore categories to display format
      const quizCategories = categoriesSnap.docs
        .map(doc => {
          const data = doc.data();
          
          // Skip if explicitly not published
          if (data.isPublished === false) {
            console.log(`⏭️ [QuizCategoryGrid] Skipping ${doc.id} - not published`);
            return null;
          }

          // Find matching color scheme from fallback
          const fallback = fallbackCategories.find(f => f.key === doc.id);
          
          // Use category name or label for navigation (not doc.id)
          const categoryName = data.name || data.label || doc.id;
          
          const result = {
            key: doc.id,
            name: categoryName, // Use this for navigation
            title: data.label || data.name || doc.id,
            desc: data.description || fallback?.desc || "Quiz category",
            color: fallback?.color || ["#E0F2FE", "#BAE6FD"],
            icon: data.icon || fallback?.icon || "📚",
            quizCount: data.quizCount || 0,
            rating: generateRealisticRating(data.quizCount || 0, doc.id),
          };
          
          console.log(`✅ [QuizCategoryGrid] Mapped category:`, result);
          return result;
        })
        .filter(Boolean);

      console.log("🎯 [QuizCategoryGrid] Final categories to display:", {
        count: quizCategories.length,
        categories: quizCategories.map(c => ({ key: c.key, name: c.name, title: c.title })),
      });
      
      setCategories(quizCategories.length > 0 ? quizCategories : fallbackCategories);
    } catch (error) {
      console.error("❌ [QuizCategoryGrid] Error loading categories:", error);
      console.log("📌 [QuizCategoryGrid] Using fallback due to error");
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("🚀 [QuizCategoryGrid] Component mounted, starting load...");
    loadCategories();
  }, []);

  if (loading) {
    console.log("⏳ [QuizCategoryGrid] Still loading categories...");
    return (
      <section className="section">
        <div className="container">
          <p className="text-gray-600">Loading quiz categories...</p>
        </div>
      </section>
    );
  }

  console.log("📺 [QuizCategoryGrid] Render - Displaying categories:", {
    count: categories.length,
    items: categories.map(c => ({ key: c.key, name: c.name, title: c.title })),
    isUsingFallback: categories.every(c => fallbackCategories.find(f => f.key === c.key)),
  });

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
              onClick={() => {
                console.log("🖱️ [QuizCategoryGrid] Click detected on category:", {
                  key: c.key,
                  name: c.name,
                  title: c.title,
                  encodedName: encodeURIComponent(c.name),
                  navigationUrl: `/quiz/${encodeURIComponent(c.name)}`,
                });
                console.log("➡️ [QuizCategoryGrid] Navigating to:", `/quiz/${encodeURIComponent(c.name)}`);
                navigate(`/quiz/${encodeURIComponent(c.name)}`);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  console.log("⌨️ [QuizCategoryGrid] Keyboard navigation on:", c.name);
                  navigate(`/quiz/${encodeURIComponent(c.name)}`);
                }
              }}
              role="button"
              tabIndex={0}
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