import React from "react";
import { Card } from "../../components/ui";

const features = [
  {
    title: "Smart Quizzes",
    desc: "Carefully designed questions that grow with your level.",
    icon: "🧠",
  },
  {
    title: "Multiple Categories",
    desc: "Kids, Students, Programming, Movies and more.",
    icon: "📚",
  },
  {
    title: "Levels & Rewards",
    desc: "Progress through levels and earn XP & coins.",
    icon: "🏆",
  },
  {
    title: "Play Anywhere",
    desc: "Mobile-friendly experience, anytime learning.",
    icon: "📱",
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Why You'll Love AmAha
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Built to make learning enjoyable, effective, and rewarding.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Card key={f.title} variant="outlined">
              <div className="flex flex-col items-center text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {f.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
