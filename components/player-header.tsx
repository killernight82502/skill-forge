"use client";

import { getLevelFromXp } from "@/lib/game-constants";
import { AnimeAvatar } from "./anime-avatar";
import { useAuth } from "@/hooks/use-auth";
import { COSMETICS } from "@/lib/premium-cosmetics";
import Link from "next/link";

interface PlayerHeaderProps {
  totalXp: number;
  completedTasks: number;
  currentStreak: number;
}

export function PlayerHeader({
  totalXp,
  completedTasks,
  currentStreak,
}: PlayerHeaderProps) {
  const { level, currentXp, nextLevelXp } = getLevelFromXp(totalXp);
  const progressPercent = (currentXp / nextLevelXp) * 100;
  const { user } = useAuth();
  const cosmetic = user?.selectedCosmetic ? COSMETICS[user.selectedCosmetic] : COSMETICS.default;

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-2 rounded-lg p-6 mb-6"
         style={{
           borderColor: cosmetic.borderColor,
           boxShadow: `0 0 20px ${cosmetic.glowColor}`,
         }}>
      <div className="flex gap-8 items-start mb-6">
        {/* Premium Badge / Upgrade Button */}
        {user?.isPremium ? (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 px-3 py-1 rounded-full">
            <span className="text-yellow-400 text-lg">⭐</span>
            <span className="text-yellow-400 text-sm font-semibold">Premium</span>
          </div>
        ) : (
          <Link
            href="/pricing"
            className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all"
          >
            Upgrade to Premium ⭐
          </Link>
        )}

        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <AnimeAvatar level={level} />
        </div>

        {/* Stats Section */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-gray-400 mb-1">Current Level</div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                {level}
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className="text-sm text-gray-400">Total XP</div>
              <div className="text-2xl font-bold text-amber-400">{totalXp.toLocaleString()}</div>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progress to Level {level + 1}</span>
              <span className="text-gray-400">
                {currentXp.toLocaleString()} / {nextLevelXp.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex gap-6 text-sm">
            <div className="flex-1">
              <div className="text-gray-400 mb-1">Tasks Completed</div>
              <div className="text-2xl font-bold text-green-400">{completedTasks}</div>
            </div>
            <div className="flex-1">
              <div className="text-gray-400 mb-1">Current Streak</div>
              <div className="text-2xl font-bold text-orange-400 flex items-center gap-1">
                {currentStreak}
                {currentStreak > 0 && <span>🔥</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
