/**
 * FeaturePage.jsx
 * Landing page for a feature
 * Shows all categories within the feature
 */

import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import SiteLayout from "../layouts/SiteLayout";

function FeaturePage() {
  const { id: featureId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feature, setFeature] = useState(null);

  const featureName = location.state?.featureName;

  useEffect(() => {
    const loadFeatureData = async () => {
      try {
        setLoading(true);

        // Fetch feature details
        const featuresSnapshot = await getDocs(
          query(collection(db, "features"), where("id", "==", featureId))
        );

        if (!featuresSnapshot.empty) {
          const featureData = featuresSnapshot.docs[0].data();
          setFeature(featureData);
        }

        // Fetch categories for this feature
        const q = query(
          collection(db, "categories"),
          where("featureId", "==", featureId),
          where("isPublished", "==", true)
        );
        const snapshot = await getDocs(q);
        const categoriesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading feature data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (featureId) {
      loadFeatureData();
    }
  }, [featureId]);

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
          {feature?.icon && (
            <span style={{ fontSize: "48px", display: "block", marginBottom: "12px" }}>
              {feature.icon}
            </span>
          )}
          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: "700",
              color: "#0b1220",
            }}
          >
            {featureName || feature?.name || feature?.label || "Feature"}
          </h1>
          {feature?.description && (
            <p
              style={{
                margin: "12px 0 0 0",
                fontSize: "16px",
                color: "#666",
                maxWidth: "600px",
              }}
            >
              {feature.description}
            </p>
          )}
        </div>

        {/* Categories Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "20px",
            marginTop: "24px",
          }}
        >
          {categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  navigate(`/category/${category.id}`, {
                    state: { categoryName: category.name },
                  });
                }}
                style={{
                  padding: "24px",
                  background: "white",
                  borderRadius: "16px",
                  border: "2px solid #e0e0e0",
                  cursor: "pointer",
                  transition: "all 250ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6C63FF";
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(108, 99, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Icon/Avatar */}
                {category.icon && (
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      background: "rgba(108, 99, 255, 0.1)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      marginBottom: "16px",
                    }}
                  >
                    {category.icon}
                  </div>
                )}

                {/* Title */}
                <h3
                  style={{
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#0b1220",
                  }}
                >
                  {category.name || category.label}
                </h3>

                {/* Description */}
                {category.description && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      color: "#666",
                      lineHeight: "1.5",
                      marginBottom: "12px",
                    }}
                  >
                    {category.description}
                  </p>
                )}

                {/* CTA */}
                <div
                  style={{
                    marginTop: "16px",
                    paddingTop: "12px",
                    borderTop: "1px solid #e0e0e0",
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#6C63FF",
                    }}
                  >
                    Explore →
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "60px 20px",
                color: "#999",
              }}
            >
              <p style={{ fontSize: "16px" }}>
                No categories available in this feature yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

export default FeaturePage;
