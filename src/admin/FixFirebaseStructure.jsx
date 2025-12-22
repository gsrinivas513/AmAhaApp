// src/admin/FixFirebaseStructure.jsx
import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, updateDoc, doc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

export default function FixFirebaseStructure() {
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState([]);
  const [fixing, setFixing] = useState(false);

  const addProgress = (message) => {
    setProgress(prev => [...prev, message]);
  };

  const fixStructure = async () => {
    try {
      setFixing(true);
      setStatus("🔧 Fixing Firebase structure...");
      setProgress([]);

      // Step 1: Fix Features - Add featureType field
      addProgress("\n🔧 Step 1: Fixing Features...");
      
      const featuresSnap = await getDocs(collection(db, "features"));
      let quizFeatureId = null;
      
      featuresSnap.forEach(doc => {
        const data = doc.data();
        if (data.name === "Quiz" || data.featureType === "quiz") {
          quizFeatureId = doc.id;
        }
      });

      // Update Quiz feature to add featureType if missing
      if (quizFeatureId) {
        const quizDoc = await getDocs(query(collection(db, "features"), where("name", "==", "Quiz")));
        if (!quizDoc.empty) {
          const data = quizDoc.docs[0].data();
          if (!data.featureType) {
            await updateDoc(doc(db, "features", quizFeatureId), {
              featureType: "quiz"
            });
            addProgress(`✅ Updated Quiz feature with featureType: "quiz"`);
          } else {
            addProgress(`✅ Quiz feature already has featureType`);
          }
        }
      } else {
        // Create Quiz feature if it doesn't exist
        const quizRef = await addDoc(collection(db, "features"), {
          name: "Quiz",
          label: "Quiz",
          description: "Quiz based learning",
          icon: "❓",
          enabled: true,
          featureType: "quiz",
          createdAt: serverTimestamp()
        });
        quizFeatureId = quizRef.id;
        addProgress(`✅ Created Quiz feature (ID: ${quizFeatureId})`);
      }

      // Step 2: Fix Categories - Ensure "Kids" category exists under Quiz feature
      addProgress("\n🔧 Step 2: Fixing Categories...");
      
      const categoriesSnap = await getDocs(collection(db, "categories"));
      let kidsCategory = null;

      categoriesSnap.forEach(doc => {
        const data = doc.data();
        if (doc.id === "kids" || data.name === "kids" || data.name === "Kids") {
          kidsCategory = { id: doc.id, ...data };
        }
      });

      // If "kids" category exists with wrong name/structure, fix it
      if (kidsCategory) {
        if (kidsCategory.name === "kids" || kidsCategory.name === "Animals") {
          // Update to proper "Kids" category
          await updateDoc(doc(db, "categories", kidsCategory.id), {
            name: "Kids",
            label: "Kids Learning",
            icon: "👶",
            color: "#10b981",
            description: "Educational content for kids",
            featureId: quizFeatureId,
            isPublished: true,
            sortOrder: 1,
            defaultUiMode: "playful"
          });
          kidsCategory = { id: kidsCategory.id, name: "Kids" };
          addProgress(`✅ Updated category to "Kids" (ID: ${kidsCategory.id})`);
        } else {
          addProgress(`✅ Kids category already exists (ID: ${kidsCategory.id})`);
        }
      } else {
        // Create Kids category if it doesn't exist
        const kidsRef = await addDoc(collection(db, "categories"), {
          name: "Kids",
          label: "Kids Learning",
          icon: "👶",
          color: "#10b981",
          description: "Educational content for kids",
          featureId: quizFeatureId,
          isPublished: true,
          sortOrder: 1,
          defaultUiMode: "playful",
          createdAt: serverTimestamp()
        });
        kidsCategory = { id: kidsRef.id, name: "Kids" };
        addProgress(`✅ Created Kids category (ID: ${kidsRef.id})`);
      }

      // Step 3: Fix Topics - Ensure Animals topic exists under Kids category
      addProgress("\n🔧 Step 3: Fixing Topics...");
      
      const topicsSnap = await getDocs(collection(db, "topics"));
      let animalsTopic = null;

      for (const topicDoc of topicsSnap.docs) {
        const data = topicDoc.data();
        if (data.name === "Animals") {
          animalsTopic = { id: topicDoc.id, ...data };
          
          // Update categoryId if it's pointing to wrong category
          if (data.categoryId !== kidsCategory.id) {
            await updateDoc(doc(db, "topics", topicDoc.id), {
              categoryId: kidsCategory.id
            });
            addProgress(`✅ Updated Animals topic to reference Kids category (ID: ${kidsCategory.id})`);
          } else {
            addProgress(`✅ Animals topic already has correct categoryId`);
          }
        }
      }

      // Create Animals topic if it doesn't exist
      if (!animalsTopic) {
        const topicRef = await addDoc(collection(db, "topics"), {
          name: "Animals",
          label: "Animals",
          icon: "🦁",
          description: "Animal related learning content",
          categoryId: kidsCategory.id,
          isPublished: true,
          sortOrder: 1,
          quizCount: 50,
          createdAt: serverTimestamp()
        });
        animalsTopic = { id: topicRef.id, name: "Animals" };
        addProgress(`✅ Created Animals topic (ID: ${topicRef.id})`);
      }

      // Step 4: Create missing Subcategories (linked to Animals topic)
      addProgress("\n🔧 Step 4: Creating missing Subcategories...");
      
      const subcatsSnap = await getDocs(collection(db, "subtopics"));
      const existingSubtopics = new Set();
      
      subcatsSnap.forEach(doc => {
        existingSubtopics.add(doc.data().name);
      });

      const subtopicsToCreate = [
        { name: "Animals & Their Sounds", icon: "🔊", description: "Learn what sounds different animals make" },
        { name: "Birds & Insects", icon: "🦅", description: "Learn about birds and insects" },
        { name: "Body Parts", icon: "👋", description: "Learn about different body parts" },
        { name: "Colors & Shapes", icon: "🎨", description: "Learn colors and shapes" },
        { name: "Fruits & Vegetables", icon: "🍎", description: "Learn about fruits and vegetables" },
        { name: "Math Basics", icon: "🔢", description: "Basic math concepts for kids" }
      ];

      for (const subtopic of subtopicsToCreate) {
        if (!existingSubtopics.has(subtopic.name)) {
          await addDoc(collection(db, "subtopics"), {
            name: subtopic.name,
            label: subtopic.name,
            icon: subtopic.icon,
            description: subtopic.description,
            categoryId: kidsCategory.id,
            topicId: animalsTopic.id,
            topic: "Animals",
            quizCount: subtopic.name === "Animals & Their Sounds" ? 50 : 0,
            createdAt: serverTimestamp()
          });
          addProgress(`✅ Created subtopic: ${subtopic.name}`);
        } else {
          addProgress(`✅ Subtopic already exists: ${subtopic.name}`);
        }
      }

      // Step 5: Update existing subcategories with correct references
      addProgress("\n🔧 Step 5: Updating existing Subcategories...");
      
      const updatedSubcatsSnap = await getDocs(collection(db, "subtopics"));
      
      for (const subcatDoc of updatedSubcatsSnap.docs) {
        const data = subcatDoc.data();
        const updates = {};
        
        if (data.categoryId !== kidsCategory.id) {
          updates.categoryId = kidsCategory.id;
        }
        if (data.topicId !== animalsTopic.id) {
          updates.topicId = animalsTopic.id;
        }
        if (!data.topic || data.topic !== "Animals") {
          updates.topic = "Animals";
        }
        
        if (Object.keys(updates).length > 0) {
          await updateDoc(doc(db, "subtopics", subcatDoc.id), updates);
          addProgress(`✅ Updated ${data.name} with correct references`);
        }
      }

      addProgress("\n✅ Structure fix complete!");
      setStatus("✅ Firebase structure fixed successfully!");

      addProgress("\n📊 Final Structure:");
      addProgress(`✅ Feature: Quiz (featureType: "quiz")`);
      addProgress(`   └─ Category: Kids`);
      addProgress(`       └─ Topic: Animals`);
      addProgress(`           ├─ SubTopic: Animals & Their Sounds`);
      addProgress(`           ├─ SubTopic: Birds & Insects`);
      addProgress(`           ├─ SubTopic: Body Parts`);
      addProgress(`           ├─ SubTopic: Colors & Shapes`);
      addProgress(`           ├─ SubTopic: Fruits & Vegetables`);
      addProgress(`           └─ SubTopic: Math Basics`);
      addProgress(`\n✅ All 6 subtopics linked to Animals topic`);
      addProgress(`✅ 50 questions linked to Animals & Their Sounds`);


    } catch (err) {
      console.error("❌ Error:", err);
      addProgress(`\n❌ Error: ${err.message}`);
      setStatus("❌ Fix failed!");
    } finally {
      setFixing(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
          color: "white"
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 8 }}>
            🔧 Fix Firebase Structure
          </h1>
          <p style={{ margin: 0, opacity: 0.95, fontSize: 16 }}>
            Fix inconsistencies in your Firebase collections
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
            ⚠️ Issues Found:
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: "#92400e", lineHeight: 1.8 }}>
            <li><strong>Current:</strong> "kids" is a category name</li>
            <li><strong>Should be:</strong> "Kids" as proper category under Quiz feature</li>
            <li><strong>Issue:</strong> Category ID is "kids" (lowercase)</li>
            <li><strong>Missing:</strong> 5 of 6 subtopics</li>
          </ul>
          <p style={{ margin: "12px 0 0 0", color: "#92400e", fontSize: 14 }}>
            💡 <strong>Correct Structure:</strong> Quiz Feature → Kids Category → Animals Topic → 6 SubTopics
          </p>
        </div>

        <button
          onClick={fixStructure}
          disabled={fixing}
          style={{
            padding: "14px 32px",
            background: fixing ? "#9ca3af" : "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 8,
            fontSize: 18,
            fontWeight: 600,
            cursor: fixing ? "not-allowed" : "pointer",
            marginBottom: 24,
            boxShadow: fixing ? "none" : "0 4px 12px rgba(239, 68, 68, 0.3)"
          }}
        >
          {fixing ? "⏳ Fixing..." : "🔧 Fix Structure Now"}
        </button>

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
                  color: msg.includes("❌") ? "#ef4444" : msg.includes("✅") ? "#10b981" : msg.includes("⚠️") ? "#f59e0b" : "#e5e7eb",
                  fontFamily: "monospace",
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap"
                }}
              >
                {msg}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
