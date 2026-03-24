"use client";

import { useGameState } from "@/hooks/use-game-state";
import { useAuth } from "@/hooks/use-auth";
import { PlayerHeader } from "@/components/player-header";
import { TaskForm } from "@/components/task-form";
import { TaskCard } from "@/components/task-card";
import { StatsPanel } from "@/components/stats-panel";
import { ProgressSpiderChart } from "@/components/progress-spider-chart";
import { CosmeticsShop } from "@/components/cosmetics-shop";
import { PremiumUpgradeBanner } from "@/components/premium-upgrade-banner";
import { AIChatWidget } from "@/components/ai-chat-widget";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const gameState = useGameState();
  const { user, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  if (!isLoaded || authLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-400 text-xl">Loading your journey...</div>
      </div>
    );
  }

  const activeTasks = gameState.getActiveTasks();
  const completedTasks = gameState.getCompletedTasks();
  const level = gameState.getCurrentLevel();

  const handleLogout = () => {
    logout();
    toast.info("Logged Out", {
      description: "Your session has ended. Come back soon, hunter.",
    });
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-2 italic">
              TIME BOT 
            </h1>
            <p className="text-gray-400">
              Welcome, <span className="text-orange-400 font-semibold">{user.username}</span>. Grow stronger by completing tasks.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/50 text-orange-400 px-4 py-2 rounded font-semibold transition-all"
          >
            Logout
          </button>
        </div>

        {/* Player Header */}
        <PlayerHeader
          totalXp={gameState.stats.totalXp}
          completedTasks={gameState.stats.completedTasks}
          currentStreak={gameState.stats.currentStreak}
        />

        {/* Premium Upgrade Banner */}
        <PremiumUpgradeBanner />

        {/* Spider Chart */}
        <ProgressSpiderChart
          totalXp={gameState.stats.totalXp}
          completedTasks={gameState.stats.completedTasks}
          currentStreak={gameState.stats.currentStreak}
          level={gameState.stats.level}
          totalTasks={gameState.tasks.length}
        />

        {/* Cosmetics Shop */}
        <CosmeticsShop />

        {/* Task Form */}
        <TaskForm
          onSubmit={(data) => {
            gameState.addTask({
              title: data.title,
              description: data.description,
              durationMinutes: data.durationMinutes,
              difficulty: data.difficulty,
            });
          }}
        />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Tasks */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-purple-400">⚔️</span>
                Active Quests ({activeTasks.length})
              </h2>

              {activeTasks.length === 0 ? (
                <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 text-center">
                  <div className="text-gray-400 mb-2">No active tasks</div>
                  <div className="text-sm text-gray-500">
                    Add a new task to begin your training and gain experience points.
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={gameState.completeTask}
                      onDelete={gameState.deleteTask}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  Conquered Quests ({completedTasks.length})
                </h2>
                <div className="space-y-3">
                  {completedTasks.slice(0, 5).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={gameState.completeTask}
                      onDelete={gameState.deleteTask}
                    />
                  ))}
                  {completedTasks.length > 5 && (
                    <div className="text-center text-gray-400 py-4">
                      +{completedTasks.length - 5} more completed tasks
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Stats & Achievements */}
          <div className="lg:col-span-1">
            <StatsPanel
              completedTasks={gameState.stats.completedTasks}
              totalXp={gameState.stats.totalXp}
              currentStreak={gameState.stats.currentStreak}
              unlockedAchievements={gameState.stats.unlockedAchievements}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>Your stats are saved automatically. Keep pushing forward, hunter.</p>
        </div>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget
        userLevel={level}
        userXP={gameState.stats.totalXp}
        userStreak={gameState.stats.currentStreak}
        currentTasks={activeTasks.length}
      />
    </main>
  );
}
