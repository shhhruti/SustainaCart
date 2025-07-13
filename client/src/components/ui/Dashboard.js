"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";

const COLORS = {
  A: "#22c55e",
  B: "#84cc16",
  C: "#eab308",
  D: "#f97316",
  E: "#ef4444",
  "N/A": "#9ca3af",
};

const countScores = (data, key) => {
  const counts = { A: 0, B: 0, C: 0, D: 0, E: 0, "N/A": 0 };
  data.forEach((item) => {
    const value = item[key]?.toUpperCase() || "N/A";
    if (counts[value] !== undefined) {
      counts[value]++;
    } else {
      counts["N/A"]++;
    }
  });

  return Object.entries(counts).map(([score, count]) => ({
    name: score,
    value: count,
    color: COLORS[score],
  }));
};

export default function Dashboard({ data }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !Array.isArray(data) || data.length === 0) return null;

  const ecoData = countScores(data, "ecoScore");
  const nutriData = countScores(data, "nutriScore");

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-6">
        📊 Sustainability Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
        {/* EcoScore Pie Chart */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow border dark:border-zinc-700">
          <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">
            EcoScore Distribution
          </h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={ecoData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {ecoData.map((entry, index) => (
                  <Cell key={`eco-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* NutriScore Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow border dark:border-zinc-700">
          <h3 className="text-lg font-semibold mb-2 text-green-700 dark:text-green-300">
            NutriScore Distribution
          </h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={nutriData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4ade80">
                {nutriData.map((entry, index) => (
                  <Cell key={`nutri-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
