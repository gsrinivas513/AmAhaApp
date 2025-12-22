// src/admin/UpdateSubtopicTopics.jsx
import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Card, Button } from "../components/ui";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Map subtopic names to topics
const subtopicToTopic = {
  "Animals & Their Sounds": "Animals",
  "Wild vs Domestic Animals": "Animals",
  "Aquatic Animals": "Animals",
  "Baby Animals": "Animals",
  "Forest & Jungle Animals": "Animals",
  "National Animals & Birds": "Animals",
  
  "Birds & Insects": "Nature",
  "Trees & Plants": "Nature",
  "Weather & Seasons": "Nature",
  
  "Fruits & Vegetables": "Food",
  "Food & Drinks": "Food",
  
  "Colors & Shapes": "Learning Basics",
  "Alphabet (A–Z)": "Learning Basics",
  "Numbers (1–100)": "Learning Basics",
  "Opposites": "Learning Basics",
  "Colors Quiz": "Learning Basics",
  "Sequencing": "Learning Basics",
  "What Comes Next? (Patterns)": "Learning Basics",
  
  "Simple Math (Addition & Subtraction)": "Math",
  
  "Body Parts": "Body",
  
  "Solar System": "Space",
  "Planets & Stars": "Space",
  "Day & Night": "Space",
  
  "Transport (Land / Water / Air)": "Learning Basics",
  "Cartoon Characters": "Entertainment",
  "Disney Movies": "Entertainment",
  "Nursery Rhymes": "Learning Basics",
  
  "Indian Festivals": "Culture",
  "Famous Places": "Geography",
  "Famous Monuments (World)": "Geography",
};

export default function UpdateSubtopicTopics() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);

  const addLog = (message, type = "info") => {
    setLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  const updateSubtopicies = async () => {
    setLoading(true);
    setLogs([]);
    setSummary(null);

    try {
      addLog("🔍 Fetching existing subtopics...");
      
      const subtopicsSnap = await getDocs(collection(db, "subtopics"));
      
      addLog(`📊 Found ${subtopicsSnap.size} subtopics`);
      
      let updated = 0;
      let skipped = 0;
      let notFound = 0;
      
      for (const docSnap of subtopicsSnap.docs) {
        const data = docSnap.data();
        const subtopicName = data.name || data.label;
        
        // Check if topic already exists
        if (data.topic) {
          addLog(`⏭️  Skipping "${subtopicName}" - already has topic: ${data.topic}`);
          skipped++;
          continue;
        }
        
        // Find matching topic
        const topic = subtopicToTopic[subtopicName];
        
        if (topic) {
          await updateDoc(doc(db, "subtopics", docSnap.id), {
            topic: topic
          });
          addLog(`✅ Updated "${subtopicName}" → Topic: ${topic}`, "success");
          updated++;
        } else {
          addLog(`⚠️  No topic mapping found for: "${subtopicName}"`, "warning");
          notFound++;
        }
      }
      
      setSummary({
        total: subtopicsSnap.size,
        updated,
        skipped,
        notFound
      });
      
      addLog("✨ Update complete!", "success");
      
    } catch (error) {
      console.error("Error updating subtopics:", error);
      addLog(`❌ Error: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Card>
        <h2 className="text-2xl font-bold mb-4">Update Subtopic Topics</h2>
        
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ What this does:</strong> This tool adds a "topic" field to all existing subtopics 
            that don't have one yet. Topics help group related subtopics for better user experience.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Topic Mappings:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded">
              <strong className="text-gray-700">🐾 Animals:</strong>
              <p className="text-gray-600 text-xs mt-1">Animals & Their Sounds, Wild vs Domestic, Aquatic, Baby Animals, etc.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong className="text-gray-700">🌿 Nature:</strong>
              <p className="text-gray-600 text-xs mt-1">Birds & Insects, Trees & Plants, Weather & Seasons</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong className="text-gray-700">🍎 Food:</strong>
              <p className="text-gray-600 text-xs mt-1">Fruits & Vegetables, Food & Drinks</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong className="text-gray-700">🎨 Learning Basics:</strong>
              <p className="text-gray-600 text-xs mt-1">Colors & Shapes, Alphabet, Numbers, Opposites, Patterns</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong className="text-gray-700">🧮 Math:</strong>
              <p className="text-gray-600 text-xs mt-1">Simple Math (Addition & Subtraction)</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong className="text-gray-700">🧑 Body:</strong>
              <p className="text-gray-600 text-xs mt-1">Body Parts</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong className="text-gray-700">🚀 Space:</strong>
              <p className="text-gray-600 text-xs mt-1">Solar System, Planets & Stars, Day & Night</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong className="text-gray-700">🎬 Entertainment:</strong>
              <p className="text-gray-600 text-xs mt-1">Cartoon Characters, Disney Movies</p>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={updateSubtopicies}
          disabled={loading}
          className="mb-6"
        >
          {loading ? "Updating..." : "🚀 Update All Subtopicies"}
        </Button>

        {summary && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-bold text-green-900 mb-2">📈 Summary:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total:</span>
                <strong className="ml-2 text-gray-900">{summary.total}</strong>
              </div>
              <div>
                <span className="text-gray-600">Updated:</span>
                <strong className="ml-2 text-green-600">{summary.updated}</strong>
              </div>
              <div>
                <span className="text-gray-600">Skipped:</span>
                <strong className="ml-2 text-blue-600">{summary.skipped}</strong>
              </div>
              <div>
                <span className="text-gray-600">Not Mapped:</span>
                <strong className="ml-2 text-yellow-600">{summary.notFound}</strong>
              </div>
            </div>
          </div>
        )}

        {logs.length > 0 && (
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs overflow-auto max-h-96">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={`mb-1 ${
                  log.type === 'error' ? 'text-red-400' : 
                  log.type === 'success' ? 'text-green-400' : 
                  log.type === 'warning' ? 'text-yellow-400' : 
                  'text-gray-300'
                }`}
              >
                <span className="text-gray-500">[{log.time}]</span> {log.message}
              </div>
            ))}
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
