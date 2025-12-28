// src/admin/InitializeFirebaseStructure.jsx
import React, { useState } from "react";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { FEATURES } from "../constants/FEATURES";
import { db } from "../firebase/firebaseConfig";
import AdminLayout from "./AdminLayout";

export default function InitializeFirebaseStructure() {
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState([]);
  const [running, setRunning] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState("all");

  const addProgress = (message) => {
    setProgress(prev => [...prev, message]);
  };

  const inspectCollections = async () => {
    try {
      setInspecting(true);
      setStatus("Inspecting Firebase collections...");
      setProgress([]);

      const collections = selectedCollection === "all" 
        ? ["features", "categories", "topics", "subtopics", "subcategories", "questions", "puzzles", "attempts", "scores", "users"]
        : [selectedCollection];

      for (const collectionName of collections) {
        addProgress(`\n📋 Collection: ${collectionName}`);
        addProgress("─".repeat(60));
        
        try {
          const snap = await getDocs(collection(db, collectionName));
          
          if (snap.empty) {
            addProgress(`   ⚠️  Empty collection (0 documents)`);
            continue;
          }

          addProgress(`   📊 Total documents: ${snap.size}`);
          
          // Show ALL documents (not just first 3)
          addProgress(`   📄 Showing all ${snap.size} document(s):\n`);
          
          snap.docs.forEach((doc, idx) => {
            const data = doc.data();
            addProgress(`   ${idx + 1}. Document ID: ${doc.id}`);
            
            // Show ALL fields for each document
            const allKeys = Object.keys(data);
            allKeys.forEach(key => {
              const value = data[key];
              if (value === null || value === undefined) {
                addProgress(`      - ${key}: null`);
              } else if (value instanceof Date || (value && value.toDate)) {
                // Handle Firestore Timestamps
                const dateVal = value.toDate ? value.toDate() : value;
                addProgress(`      - ${key}: ${dateVal.toISOString()}`);
              } else if (Array.isArray(value)) {
                addProgress(`      - ${key}: [Array with ${value.length} items]`);
                if (value.length > 0 && value.length <= 5) {
                  value.forEach((item, i) => {
                    if (typeof item === 'object') {
                      addProgress(`        [${i}]: ${JSON.stringify(item).substring(0, 100)}`);
                    } else {
                      addProgress(`        [${i}]: ${String(item).substring(0, 100)}`);
                    }
                  });
                }
              } else if (typeof value === 'object') {
                addProgress(`      - ${key}: ${JSON.stringify(value).substring(0, 150)}`);
              } else {
                addProgress(`      - ${key}: ${String(value).substring(0, 150)}`);
              }
            });
            addProgress("");
          });
          
        } catch (err) {
          addProgress(`   ❌ Error reading ${collectionName}: ${err.message}`);
        }
      }

      addProgress("\n✅ Inspection complete!");
      setStatus("✅ Inspection complete!");
      
    } catch (err) {
      console.error("❌ Error:", err);
      addProgress(`\n❌ Error: ${err.message}`);
      setStatus("❌ Inspection failed!");
    } finally {
      setInspecting(false);
    }
  };

  const initializeStructure = async () => {
    try {
      setRunning(true);
      setStatus("Starting Firebase structure initialization...");
      setProgress([]);

      // 1. Check and create Features
      addProgress("📋 Step 1: Checking Features collection...");
      const featuresSnap = await getDocs(collection(db, "features"));
      
      let quizFeatureId = null;
      let kidsFeatureId = null;
      
      if (featuresSnap.empty) {
        addProgress("➕ Creating Features...");
        
        // Create Quiz Feature
        const quizRef = await addDoc(collection(db, "features"), {
          name: FEATURES.QUIZZES.name,
          label: FEATURES.QUIZZES.label,
          featureType: FEATURES.QUIZZES.type,
          icon: FEATURES.QUIZZES.icon,
          description: FEATURES.QUIZZES.description,
          enabled: true,
          sortOrder: 1,
          createdAt: serverTimestamp()
        });
        quizFeatureId = quizRef.id;
        addProgress(`✅ Created Quiz feature (ID: ${quizFeatureId})`);
        
        // Create Kids Feature
        const kidsRef = await addDoc(collection(db, "features"), {
          name: "Kids",
          label: "Kids Learning",
          featureType: "kids",
          icon: "👶",
          description: "Educational content for children",
          enabled: true,
          sortOrder: 2,
          createdAt: serverTimestamp()
        });
        kidsFeatureId = kidsRef.id;
        addProgress(`✅ Created Kids feature (ID: ${kidsFeatureId})`);
        
      } else {
        addProgress(`✅ Features already exist (${featuresSnap.size} found)`);
        // Get existing feature IDs
        featuresSnap.forEach(doc => {
          const data = doc.data();
          if (data.featureType === FEATURES.QUIZZES.type) quizFeatureId = doc.id;
          if (data.featureType === "kids") kidsFeatureId = doc.id;
        });
      }

      // 2. Check and create Categories
      addProgress("\n📋 Step 2: Checking Categories collection...");
      const categoriesSnap = await getDocs(collection(db, "categories"));
      
      let animalsCategory = null;
      
      if (categoriesSnap.empty) {
        addProgress("➕ Creating Categories...");
        
        const animalsRef = await addDoc(collection(db, "categories"), {
          name: "Animals",
          label: "Animals",
          icon: "🐶",
          color: "#f59e0b",
          description: "Learn about different animals and their characteristics",
          featureId: kidsFeatureId || quizFeatureId,
          isPublished: true,
          sortOrder: 1,
          createdAt: serverTimestamp()
        });
        animalsCategory = { id: animalsRef.id, name: "Animals" };
        addProgress(`✅ Created Animals category (ID: ${animalsRef.id})`);
        
      } else {
        addProgress(`✅ Categories already exist (${categoriesSnap.size} found)`);
        // Find Animals category
        categoriesSnap.forEach(doc => {
          const data = doc.data();
          if (data.name === "Animals") {
            animalsCategory = { id: doc.id, name: data.name };
          }
        });
      }

      // 3. Check and create Topics
      addProgress("\n📋 Step 3: Checking Topics collection...");
      const topicsSnap = await getDocs(collection(db, "topics"));
      
      let animalsTopic = null;
      
      if (topicsSnap.empty) {
        addProgress("➕ Creating Topics...");
        
        if (animalsCategory) {
          const topicRef = await addDoc(collection(db, "topics"), {
            name: "Animals",
            label: "Animals",
            icon: "🦁",
            description: "Animal related learning content",
            categoryId: animalsCategory.id,
            isPublished: true,
            sortOrder: 1,
            quizCount: 0,
            createdAt: serverTimestamp()
          });
          animalsTopic = { id: topicRef.id, name: "Animals" };
          addProgress(`✅ Created Animals topic (ID: ${topicRef.id})`);
        }
      } else {
        addProgress(`✅ Topics already exist (${topicsSnap.size} found)`);
        // Find Animals topic
        topicsSnap.forEach(doc => {
          const data = doc.data();
          if (data.name === "Animals") {
            animalsTopic = { id: doc.id, name: data.name };
          }
        });
      }

      // 4. Check and create Subcategories (Subtopics)
      addProgress("\n📋 Step 4: Checking Subcategories collection...");
      const subcatsSnap = await getDocs(collection(db, "subtopics"));
      
      const subtopicsToCreate = [
        { name: "Animals & Their Sounds", icon: "🔊", description: "Learn what sounds different animals make" },
        { name: "Birds & Insects", icon: "🦅", description: "Discover birds and insects" },
        { name: "Body Parts", icon: "👁️", description: "Learn about body parts" },
        { name: "Colors & Shapes", icon: "🎨", description: "Explore colors and shapes" },
        { name: "Fruits & Vegetables", icon: "🍎", description: "Learn about healthy foods" },
        { name: "Math Basics", icon: "🔢", description: "Basic math concepts" }
      ];
      
      if (subcatsSnap.empty) {
        addProgress("➕ Creating Subcategories...");
        
        for (const subtopic of subtopicsToCreate) {
          if (animalsCategory && animalsTopic) {
            const subcatRef = await addDoc(collection(db, "subtopics"), {
              name: subtopic.name,
              label: subtopic.name,
              icon: subtopic.icon,
              description: subtopic.description,
              categoryId: animalsCategory.id,
              topicId: animalsTopic.id,
              topic: "Animals",
              isPublished: true,
              quizCount: 0,
              createdAt: serverTimestamp()
            });
            addProgress(`✅ Created ${subtopic.name} (ID: ${subcatRef.id})`);
          }
        }
      } else {
        addProgress(`✅ Subcategories already exist (${subcatsSnap.size} found)`);
      }

      addProgress("\n🎉 Firebase structure initialization complete!");
      setStatus("✅ Success! Structure is ready.");
      
    } catch (err) {
      console.error("❌ Error:", err);
      addProgress(`\n❌ Error: ${err.message}`);
      setStatus("❌ Failed! Check console for details.");
    } finally {
      setRunning(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          color: "white"
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 8 }}>
            🏗️ Initialize Firebase Structure
          </h1>
          <p style={{ margin: 0, opacity: 0.95, fontSize: 16 }}>
            Create the complete hierarchical structure: Features → Categories → Topics → SubTopics
          </p>
        </div>

        <div style={{
          background: "#fef3c7",
          border: "2px solid #f59e0b",
          borderRadius: 8,
          padding: 20,
          marginBottom: 24
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px 0", color: "#92400e" }}>
            ⚠️ What this will create:
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: "#92400e", lineHeight: 1.8 }}>
            <li><strong>Features:</strong> Quiz, Kids Learning</li>
            <li><strong>Categories:</strong> Animals</li>
            <li><strong>Topics:</strong> Animals</li>
            <li><strong>SubTopics:</strong> Animals & Their Sounds, Birds & Insects, Body Parts, Colors & Shapes, Fruits & Vegetables, Math Basics</li>
          </ul>
          <p style={{ margin: "12px 0 0 0", color: "#92400e", fontSize: 14 }}>
            💡 <strong>Note:</strong> This only creates missing items. Existing data will not be affected.
          </p>
        </div>

        {/* Initialize Button */}
        <button
          onClick={initializeStructure}
          disabled={running || inspecting}
          style={{
            padding: "14px 32px",
            background: (running || inspecting) ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 18,
            fontWeight: 600,
            cursor: (running || inspecting) ? "not-allowed" : "pointer",
            marginBottom: 24,
            boxShadow: (running || inspecting) ? "none" : "0 4px 12px rgba(102, 126, 234, 0.3)"
          }}
        >
          {running ? "⏳ Creating..." : "🚀 Initialize Structure"}
        </button>

        {/* Inspect Collections Section */}
        <div style={{
          marginBottom: 24,
          padding: 24,
          background: "#f9fafb",
          borderRadius: 12,
          border: "2px solid #e5e7eb"
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "#1f2937" }}>
            🔍 Inspect Collections
          </h3>
          
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              disabled={running || inspecting}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "2px solid #d1d5db",
                fontSize: 14,
                background: "white",
                cursor: (running || inspecting) ? "not-allowed" : "pointer",
                minWidth: 200,
                fontWeight: 500,
              }}
            >
              <option value="all">📚 All Collections</option>
              <option value="features">✨ Features</option>
              <option value="categories">📁 Categories</option>
              <option value="topics">📋 Topics</option>
              <option value="subtopics">📖 SubTopics</option>
              <option value="subcategories">📖 SubCategories (legacy)</option>
              <option value="questions">❓ Questions</option>
              <option value="puzzles">🧩 Puzzles</option>
              <option value="attempts">📊 Attempts</option>
              <option value="scores">🏆 Scores</option>
              <option value="users">👤 Users</option>
            </select>

            <button
              onClick={inspectCollections}
              disabled={running || inspecting}
              style={{
                padding: "10px 24px",
                background: inspecting ? "#9ca3af" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: (running || inspecting) ? "not-allowed" : "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              {inspecting ? "⏳ Inspecting..." : "🔍 Inspect"}
            </button>
          </div>

          <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
            View the contents of Firebase collections. Select a specific collection or inspect all at once.
            Shows ALL documents with ALL fields from each collection.
          </p>
        </div>

        {status && (
          <div style={{
            padding: 16,
            background: status.includes("❌") ? "#fee2e2" : status.includes("✅") ? "#d1fae5" : "#e0e7ff",
            color: status.includes("❌") ? "#991b1b" : status.includes("✅") ? "#065f46" : "#1e3a8a",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 16,
            fontWeight: 600
          }}>
            {status}
          </div>
        )}

        {progress.length > 0 && (
          <div style={{
            background: "#1f2937",
            borderRadius: 8,
            padding: 20,
            maxHeight: 500,
            overflowY: "auto"
          }}>
            <h3 style={{ color: "#10b981", fontSize: 16, fontWeight: 600, marginTop: 0 }}>
              📝 Progress Log:
            </h3>
            {progress.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  color: "#d1d5db",
                  fontSize: 14,
                  fontFamily: "monospace",
                  marginBottom: 6,
                  whiteSpace: "pre-wrap"
                }}
              >
                {msg}
              </div>
            ))}
          </div>
        )}

        <div style={{
          marginTop: 32,
          padding: 20,
          background: "#f3f4f6",
          borderRadius: 8,
          borderLeft: "4px solid #3b82f6"
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px 0" }}>
            📌 After initialization:
          </h3>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Go to <code>/admin/features</code> to manage the structure</li>
            <li>Import your questions using the structure's subtopic names</li>
            <li>Test by navigating through the hierarchy on the home page</li>
            <li>Delete this initialization page from the admin menu</li>
          </ol>
        </div>
      </div>
    </AdminLayout>
  );
}
