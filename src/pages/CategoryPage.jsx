/**
 * CategoryPage.jsx
 * Landing page for a specific category
 * Shows all items in the category
 */

import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import SiteLayout from "../layouts/SiteLayout";

function CategoryPage() {
  const { id: categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  const categoryName = location.state?.categoryName;

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setLoading(true);

        // Fetch category details
        const categorySnapshot = await getDocs(
          query(collection(db, "categories"), where("id", "==", categoryId))
        );

        if (!categorySnapshot.empty) {
          const catData = categorySnapshot.docs[0].data();
          setCategory(catData);
        }

        // Fetch topics for this category
        const q = query(
          collection(db, "topics"),
          where("categoryId", "==", categoryId),
          where("isPublished", "==", true)
        );
        const snapshot = await getDocs(q);
        const topicsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(topicsData);
      } catch (error) {
        console.error("Error loading category data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      loadCategoryData();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <SiteLayout>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <p style={{ color: "#999" }}>Loading...</p>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div>
        {/* Header */}
        <div
          style={{
            marginBottom: "32px",
            paddingBottom: "24px",
            borderBottom: "2px solid #e0e0e0",
          }}
        >
          {category?.icon && (
            <span style={{ fontSize: "40px", display: "block", marginBottom: "12px" }}>
              {category.icon}
            </span>
          )}
          <h1
            style={{
              margin: 0,
              fontSize: "32px",
              fontWeight: "700",
              color: "#0b1220",
            }}
          >
            {categoryName || category?.name || "Category"}
          </h1>
          {category?.description && (
            <p
              style={{
                margin: "12px 0 0 0",
                fontSize: "16px",
                color: "#666",
              }}
            >
              {category.description}
            </p>
          )}
        </div>

        {/* Items Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  navigate(`/quiz/${categoryName}/${item.id}`);
                }}
                style={{
                  padding: "20px",
                  background: "white",
                  borderRadius: "12px",
                  border: "2px solid #e0e0e0",
                  cursor: "pointer",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6C63FF";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(108, 99, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {item.icon && (
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>
                    {item.icon}
                  </div>
                )}
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#0b1220",
                  }}
                >
                  {item.name || item.label}
                </h3>
                {item.description && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      color: "#999",
                      lineHeight: "1.4",
                    }}
                  >
                    {item.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px 20px",
                color: "#999",
              }}
            >
              <p>No items available in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

export default CategoryPage;
