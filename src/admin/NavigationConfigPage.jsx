/**
 * NavigationConfigPage.jsx
 * Admin page to configure top navigation menu behavior
 * Controls mega menu, topics display, ordering, etc.
 */

import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { collection, getDocs, updateDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const DEFAULT_CONFIG = {
  showMegaMenu: true,
  showTopics: false,
  maxCategoriesPerRow: 4,
  animationDuration: 250,
};

function NavigationConfigPage() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [features, setFeatures] = useState([]);
  const [featureOrder, setFeatureOrder] = useState({});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  // Load config and features on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load navigation config
        const configSnapshot = await getDocs(collection(db, "ui_navigation_config"));
        if (!configSnapshot.empty) {
          const configData = configSnapshot.docs[0].data();
          setConfig((prev) => ({ ...prev, ...configData }));
        }

        // Load features
        const featuresSnapshot = await getDocs(collection(db, "features"));
        const featuresData = featuresSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        setFeatures(featuresData);

        // Initialize feature order state
        const order = {};
        featuresData.forEach((f) => {
          order[f.id] = f.order || 0;
        });
        setFeatureOrder(order);
      } catch (error) {
        console.error("Error loading data:", error);
        setStatus("❌ Failed to load configuration");
      }
    };

    loadData();
  }, []);

  const handleConfigChange = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFeatureOrderChange = (featureId, newOrder) => {
    setFeatureOrder((prev) => ({
      ...prev,
      [featureId]: parseInt(newOrder) || 0,
    }));
  };

  const handleToggleFeatureVisibility = (featureId) => {
    // Find feature and toggle showInMenu
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === featureId
          ? { ...f, showInMenu: !f.showInMenu }
          : f
      )
    );
  };

  const saveConfiguration = async () => {
    try {
      setSaving(true);
      setStatus("💾 Saving configuration...");

      // Save navigation config
      const configRef = collection(db, "ui_navigation_config");
      const configDocs = await getDocs(configRef);
      
      if (configDocs.empty) {
        // Create new config document
        await setDoc(doc(configRef), config);
      } else {
        // Update existing config
        await updateDoc(configDocs.docs[0].ref, config);
      }

      // Save feature orders and visibility
      for (const feature of features) {
        const updatedData = {
          order: featureOrder[feature.id],
          showInMenu: feature.showInMenu !== false,
        };
        await updateDoc(doc(db, "features", feature.id), updatedData);
      }

      setStatus("✅ Configuration saved successfully!");
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Error saving configuration:", error);
      setStatus("❌ Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "32px",
            color: "white",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "700" }}>
            🗂️ Navigation Configuration
          </h1>
          <p style={{ margin: "8px 0 0 0", opacity: 0.95 }}>
            Control the top navigation menu behavior and feature visibility
          </p>
        </div>

        {/* Status Message */}
        {status && (
          <div
            style={{
              padding: "12px 16px",
              background: status.includes("✅") ? "#d4edda" : "#f8d7da",
              color: status.includes("✅") ? "#155724" : "#721c24",
              borderRadius: "8px",
              marginBottom: "24px",
              border: `1px solid ${status.includes("✅") ? "#c3e6cb" : "#f5c6cb"}`,
            }}
          >
            {status}
          </div>
        )}

        {/* Main Config */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px 0",
              fontSize: "20px",
              fontWeight: "700",
              color: "#0b1220",
            }}
          >
            Menu Behavior
          </h2>

          {/* Mega Menu Toggle */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              <input
                type="checkbox"
                checked={config.showMegaMenu}
                onChange={(e) => handleConfigChange("showMegaMenu", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>Show Mega Menu (Dropdown on Hover)</span>
            </label>
            <p style={{ margin: "8px 0 0 30px", fontSize: "13px", color: "#666" }}>
              When disabled, clicking a feature navigates directly without showing categories
            </p>
          </div>

          {/* Topics Toggle */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              <input
                type="checkbox"
                checked={config.showTopics}
                onChange={(e) => handleConfigChange("showTopics", e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span>Show Topics in Menu</span>
            </label>
            <p style={{ margin: "8px 0 0 30px", fontSize: "13px", color: "#666" }}>
              Shows topic list under each category in mega menu and mobile accordion
            </p>
          </div>

          {/* Max Categories Per Row */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "15px",
                fontWeight: "500",
                color: "#0b1220",
              }}
            >
              Max Categories Per Row
            </label>
            <select
              value={config.maxCategoriesPerRow}
              onChange={(e) =>
                handleConfigChange("maxCategoriesPerRow", parseInt(e.target.value))
              }
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #d0d0d0",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              <option value={2}>2 columns</option>
              <option value={3}>3 columns</option>
              <option value={4}>4 columns</option>
              <option value={5}>5 columns</option>
              <option value={6}>6 columns</option>
            </select>
            <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#666" }}>
              Controls how many categories display per row in the mega menu
            </p>
          </div>

          {/* Animation Duration */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "15px",
                fontWeight: "500",
                color: "#0b1220",
              }}
            >
              Animation Duration (ms)
            </label>
            <input
              type="number"
              value={config.animationDuration}
              onChange={(e) =>
                handleConfigChange("animationDuration", parseInt(e.target.value))
              }
              min="100"
              max="1000"
              step="50"
              style={{
                padding: "8px 12px",
                borderRadius: "6px",
                border: "1px solid #d0d0d0",
                fontSize: "14px",
                width: "150px",
              }}
            />
            <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#666" }}>
              How fast the menu opens/closes (recommended: 200-300ms)
            </p>
          </div>
        </div>

        {/* Feature Management */}
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px 0",
              fontSize: "20px",
              fontWeight: "700",
              color: "#0b1220",
            }}
          >
            Feature Management
          </h2>

          {/* Features Table */}
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px",
                      fontWeight: "600",
                      color: "#0b1220",
                    }}
                  >
                    Feature
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      fontWeight: "600",
                      color: "#0b1220",
                    }}
                  >
                    Show in Menu
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "12px",
                      fontWeight: "600",
                      color: "#0b1220",
                    }}
                  >
                    Order
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature) => (
                  <tr
                    key={feature.id}
                    style={{
                      borderBottom: "1px solid #f0f0f0",
                      background: feature.showInMenu === false ? "#f9f9f9" : "white",
                    }}
                  >
                    <td style={{ padding: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {feature.icon && <span>{feature.icon}</span>}
                        <span style={{ fontWeight: "500" }}>
                          {feature.name || feature.label}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={feature.showInMenu !== false}
                        onChange={() => handleToggleFeatureVisibility(feature.id)}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                    </td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      <input
                        type="number"
                        value={featureOrder[feature.id]}
                        onChange={(e) =>
                          handleFeatureOrderChange(feature.id, e.target.value)
                        }
                        style={{
                          width: "60px",
                          padding: "6px 8px",
                          borderRadius: "4px",
                          border: "1px solid #d0d0d0",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ margin: "16px 0 0 0", fontSize: "13px", color: "#666" }}>
            Lower order numbers appear first. Uncheck "Show in Menu" to hide a feature.
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={saveConfiguration}
          disabled={saving}
          style={{
            padding: "12px 24px",
            background: saving ? "#ccc" : "#6C63FF",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: saving ? "not-allowed" : "pointer",
            transition: "all 200ms ease",
          }}
          onMouseEnter={(e) => {
            if (!saving) e.currentTarget.style.background = "#5a52d5";
          }}
          onMouseLeave={(e) => {
            if (!saving) e.currentTarget.style.background = "#6C63FF";
          }}
        >
          {saving ? "💾 Saving..." : "💾 Save Configuration"}
        </button>
      </div>
    </AdminLayout>
  );
}

export default NavigationConfigPage;
