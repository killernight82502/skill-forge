"use client";

import { ACHIEVEMENTS } from "@/lib/game-constants";

interface StatsPanelProps {
  completedTasks: number;
  totalXp: number;
  currentStreak: number;
  unlockedAchievements: string[];
}

export function StatsPanel({
  completedTasks,
  totalXp,
  currentStreak,
  unlockedAchievements,
}: StatsPanelProps) {
  const achievementList = Object.values(ACHIEVEMENTS);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Stats Cards */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="text-sm text-gray-400 mb-2">Total XP Earned</div>
        <div className="text-3xl font-bold text-amber-400">{totalXp.toLocaleString()}</div>
      </div>

      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
        <div className="text-sm text-gray-400 mb-2">Tasks Completed</div>
        <div className="text-3xl font-bold text-green-400">{completedTasks}</div>
      </div>

      {/* Achievements Section */}
      <div className="md:col-span-2">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-white mb-3">Achievements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {achievementList.map((achievement) => {
              const isUnlocked = unlockedAchievements.includes(achievement.id);

              return (
                <div
                  key={achievement.id}
                  className={`rounded-lg p-3 text-center transition-all ${
                    isUnlocked
                      ? "bg-gradient-to-br from-amber-900/50 to-orange-900/50 border border-amber-500/50"
                      : "bg-gray-800/50 border border-gray-700 opacity-50"
                  }`}
                  title={achievement.description}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <div className="text-xs font-medium text-gray-300">
                    {achievement.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
