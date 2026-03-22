"use client";

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { getLevelFromXp } from "@/lib/game-constants";

interface ProgressSpiderChartProps {
  totalXp: number;
  completedTasks: number;
  currentStreak: number;
  level: number;
  totalTasks: number;
}

export function ProgressSpiderChart({
  totalXp,
  completedTasks,
  currentStreak,
  level,
  totalTasks,
}: ProgressSpiderChartProps) {
  // Calculate normalized values (0-100 scale)
  const levelScore = Math.min((level / 50) * 100, 100);
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const streakScore = Math.min((currentStreak / 30) * 100, 100);
  const xpScore = Math.min((totalXp / 10000) * 100, 100);
  const avgDifficulty = completedTasks > 0 ? Math.min((completedTasks / 100) * 100, 100) : 0;

  const data = [
    {
      name: "Level",
      score: levelScore,
      fullMark: 100,
    },
    {
      name: "Completion",
      score: completionRate,
      fullMark: 100,
    },
    {
      name: "Streak",
      score: streakScore,
      fullMark: 100,
    },
    {
      name: "XP Earned",
      score: xpScore,
      fullMark: 100,
    },
    {
      name: "Mastery",
      score: avgDifficulty,
      fullMark: 100,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Progress Overview</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Spider Chart */}
        <div className="flex-1 min-h-[400px]">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <PolarGrid stroke="rgba(139, 92, 246, 0.2)" />
              <PolarAngleAxis
                dataKey="name"
                tick={{ fill: "rgba(209, 213, 219, 0.8)", fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "rgba(107, 114, 128, 0.6)", fontSize: 10 }}
              />
              <Radar
                name="Progress"
                dataKey="score"
                stroke="rgba(249, 115, 22, 0.8)"
                fill="rgba(249, 115, 22, 0.3)"
                strokeWidth={2}
                dot={{ fill: "rgba(249, 115, 22, 1)", r: 5 }}
                activeDot={{ r: 7, fill: "rgba(249, 115, 22, 1)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30, 27, 27, 0.9)",
                  border: "1px solid rgba(249, 115, 22, 0.5)",
                  borderRadius: "8px",
                  color: "rgba(249, 115, 22, 1)",
                }}
                formatter={(value) => `${Math.round(value as number)}%`}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Stats Details */}
        <div className="flex-1 space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Level Progress</span>
              <span className="text-orange-400 font-bold">{Math.round(levelScore)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-orange-500 h-full transition-all duration-500"
                style={{ width: `${levelScore}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Level {level} / 50</p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Task Completion</span>
              <span className="text-green-400 font-bold">{Math.round(completionRate)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {completedTasks} / {totalTasks} tasks
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Daily Streak</span>
              <span className="text-orange-400 font-bold">{Math.round(streakScore)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-full transition-all duration-500"
                style={{ width: `${streakScore}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{currentStreak} day streak</p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">XP Mastery</span>
              <span className="text-amber-400 font-bold">{Math.round(xpScore)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full transition-all duration-500"
                style={{ width: `${xpScore}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{totalXp.toLocaleString()} XP earned</p>
          </div>
        </div>
      </div>
    </div>
  );
}
