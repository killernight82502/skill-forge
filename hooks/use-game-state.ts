"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  DIFFICULTY_RANKS,
  DifficultyRank,
  getXpForLevel,
  getCumulativeXp,
  getLevelFromXp,
  calculateTaskXp,
  ACHIEVEMENTS,
} from "@/lib/game-constants";

export interface Task {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: DifficultyRank;
  completed: boolean;
  completedAt?: number;
  xpReward: number;
  createdAt: number;
  deadline?: number;
  isOverdue?: boolean;
}

export interface PlayerStats {
  totalXp: number;
  level: number;
  completedTasks: number;
  currentStreak: number;
  lastTaskDate?: number;
  unlockedAchievements: string[];
}

export interface GameState {
  tasks: Task[];
  stats: PlayerStats;
  addTask: (task: Omit<Task, "id" | "completed" | "xpReward" | "createdAt" | "isOverdue">) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  getTotalXp: () => number;
  getCurrentLevel: () => number;
  getActiveTasks: () => Task[];
  getCompletedTasks: () => Task[];
  getNewAchievements: () => typeof ACHIEVEMENTS[keyof typeof ACHIEVEMENTS][];
  checkOverdueTasks: () => void;
}

const STORAGE_KEY = "solo_leveling_game";

export const useGameState = (): GameState => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<PlayerStats>({
    totalXp: 0,
    level: 1,
    completedTasks: 0,
    currentStreak: 0,
    unlockedAchievements: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { tasks: savedTasks, stats: savedStats } = JSON.parse(saved);
        setTasks(savedTasks);
        setStats(savedStats);
      } catch (error) {
        console.error("Failed to load game state:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, stats }));
    }
  }, [tasks, stats, isLoaded]);

  // Calculate streak
  useEffect(() => {
    if (tasks.length === 0) return;

    const completedToday = tasks.some((t) => {
      if (!t.completedAt) return false;
      const today = new Date();
      const completedDate = new Date(t.completedAt);
      return (
        completedDate.getFullYear() === today.getFullYear() &&
        completedDate.getMonth() === today.getMonth() &&
        completedDate.getDate() === today.getDate()
      );
    });

    setStats((prev) => {
      const lastTask = prev.lastTaskDate;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (completedToday) {
        if (!lastTask) {
          return { ...prev, currentStreak: 1, lastTaskDate: today.getTime() };
        }

        const lastTaskDate = new Date(lastTask);
        lastTaskDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((today.getTime() - lastTaskDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff === 1) {
          return { ...prev, currentStreak: prev.currentStreak + 1, lastTaskDate: today.getTime() };
        } else if (daysDiff === 0) {
          return prev;
        } else {
          return { ...prev, currentStreak: 1, lastTaskDate: today.getTime() };
        }
      }

      return prev;
    });
  }, [tasks]);

  // Check for overdue tasks and apply XP penalties
  useEffect(() => {
    if (tasks.length === 0) return;

    const now = Date.now();
    let xpPenaltyTotal = 0;
    let overdueCount = 0;

    tasks.forEach((task) => {
      if (!task.completed && task.deadline && now > task.deadline) {
        if (!task.isOverdue) {
          const xpPenalty = Math.floor(task.xpReward * 0.5); // 50% of task reward
          xpPenaltyTotal += xpPenalty;
          overdueCount++;
        }
      }
    });

    if (overdueCount > 0) {
      // Mark tasks as overdue
      setTasks((prev) =>
        prev.map((task) => {
          if (!task.completed && task.deadline && now > task.deadline) {
            return { ...task, isOverdue: true };
          }
          return task;
        })
      );

      // Apply XP penalty
      setStats((prev) => {
        const newTotalXp = Math.max(0, prev.totalXp - xpPenaltyTotal);
        const { level } = getLevelFromXp(newTotalXp);

        // Show warning toast
        toast.error("Task Deadline Missed!", {
          description: `You lost ${xpPenaltyTotal} XP for ${overdueCount} overdue task(s). Complete them to regain progress!`,
          icon: "⚠️",
        });

        return {
          ...prev,
          totalXp: newTotalXp,
          level,
        };
      });
    }
  }, [tasks]);

  const addTask = useCallback(
    (task: Omit<Task, "id" | "completed" | "xpReward" | "createdAt" | "isOverdue">) => {
      const xpReward = calculateTaskXp(task.durationMinutes, task.difficulty);
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        completed: false,
        xpReward,
        createdAt: Date.now(),
        isOverdue: false,
      };

      setTasks((prev) => [newTask, ...prev]);
    },
    []
  );

  const completeTask = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, completed: true, completedAt: Date.now() }
          : task
      )
    );

    setStats((prev) => {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return prev;

      const newTotalXp = prev.totalXp + task.xpReward;
      const { level } = getLevelFromXp(newTotalXp);
      const newUnlockedAchievements = [...prev.unlockedAchievements];

      // Level Up Toast
      if (level > prev.level) {
        toast.success(`Level Up! You are now Level ${level}`, {
          description: "Your power has grown. Arise!",
          icon: "⚡",
        });
      }

      // Check for new achievements
      const checkAndAddAchievement = (id: string, name: string) => {
        if (!newUnlockedAchievements.includes(id)) {
          newUnlockedAchievements.push(id);
          toast.success("New Achievement Unlocked!", {
            description: `${name}: Your progress has been noticed.`,
            icon: "🏆",
          });
        }
      };

      if (prev.completedTasks === 0) {
        checkAndAddAchievement("first_task", "Awakening");
      }
      if (prev.completedTasks + 1 === 50) {
        checkAndAddAchievement("fifty_tasks", "Rising Hunter");
      }
      if (prev.completedTasks + 1 === 100) {
        checkAndAddAchievement("hundred_tasks", "Veteran Hunter");
      }
      if (level >= 10 && prev.level < 10) {
        checkAndAddAchievement("level_10", "Ascension");
      }
      if (level >= 25 && prev.level < 25) {
        checkAndAddAchievement("level_25", "Realm Breaker");
      }
      if (task.difficulty === "S") {
        checkAndAddAchievement("s_rank_task", "Legendary");
      }
      if (prev.currentStreak === 10) {
        checkAndAddAchievement("ten_day_streak", "Perseverance");
      }

      return {
        ...prev,
        totalXp: newTotalXp,
        level,
        completedTasks: prev.completedTasks + 1,
        unlockedAchievements: newUnlockedAchievements,
      };
    });
  }, [tasks]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const getTotalXp = useCallback(() => stats.totalXp, [stats.totalXp]);

  const getCurrentLevel = useCallback(() => {
    const { level } = getLevelFromXp(stats.totalXp);
    return level;
  }, [stats.totalXp]);

  const getActiveTasks = useCallback(
    () => tasks.filter((t) => !t.completed),
    [tasks]
  );

  const getCompletedTasks = useCallback(
    () => tasks.filter((t) => t.completed),
    [tasks]
  );

  const getNewAchievements = useCallback(() => {
    return stats.unlockedAchievements
      .map((id) => Object.values(ACHIEVEMENTS).find((a) => a.id === id))
      .filter(Boolean) as typeof ACHIEVEMENTS[keyof typeof ACHIEVEMENTS][];
  }, [stats.unlockedAchievements]);

  const checkOverdueTasks = useCallback(() => {
    // This is called by the effect automatically, but can also be called manually
    // The effect above handles the checking
  }, []);

  return {
    tasks,
    stats,
    addTask,
    completeTask,
    deleteTask,
    getTotalXp,
    getCurrentLevel,
    getActiveTasks,
    getCompletedTasks,
    getNewAchievements,
    checkOverdueTasks,
  };
};
