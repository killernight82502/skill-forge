"use client";

import { Task } from "@/hooks/use-game-state";
import { DIFFICULTY_RANKS } from "@/lib/game-constants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  const difficulty = DIFFICULTY_RANKS[task.difficulty];
  const isCompleted = task.completed;

  const handleComplete = () => {
    onComplete(task.id);
    toast.success("Quest Complete!", {
      description: `You earned ${task.xpReward} XP for completing "${task.title}".`,
      icon: "✨",
    });
  };

  const handleDelete = () => {
    onDelete(task.id);
    toast.info("Quest Removed", {
      description: `"${task.title}" has been removed from your list.`,
    });
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        isCompleted
          ? "bg-gray-900/50 border-gray-700 opacity-60"
          : "bg-gray-800/50 border-purple-500/30 hover:border-purple-500/60"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3
              className={`font-semibold text-text-balance ${
                isCompleted ? "line-through text-gray-500" : "text-white"
              }`}
            >
              {task.title}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-bold text-white ${difficulty.color}`}>
              {difficulty.label}
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-gray-400">{task.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-gray-400">⏱️</span>
            <span className="text-gray-300">{task.durationMinutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-400">⭐</span>
            <span className="font-semibold text-amber-400">{task.xpReward} XP</span>
          </div>
        </div>
      </div>

      {task.deadline && (
        <div className={`text-xs mb-3 ${
          task.isOverdue 
            ? "text-red-400 font-semibold" 
            : new Date().getTime() > task.deadline - 3600000
              ? "text-orange-400"
              : "text-gray-400"
        }`}>
          {task.isOverdue ? (
            <span>⚠️ OVERDUE - Complete immediately to restore XP!</span>
          ) : (
            <span>📅 Due: {new Date(task.deadline).toLocaleString()}</span>
          )}
        </div>
      )}

      {task.completedAt && (
        <div className="text-xs text-green-400 mb-3">
          ✓ Completed {new Date(task.completedAt).toLocaleDateString()}
        </div>
      )}

      <div className="flex gap-2">
        {!isCompleted && (
          <Button
            onClick={handleComplete}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium"
          >
            Complete
          </Button>
        )}
        <Button
          onClick={handleDelete}
          variant="outline"
          className="flex-1 text-red-400 border-red-400/30 hover:bg-red-500/10"
        >
          {isCompleted ? "Remove" : "Delete"}
        </Button>
      </div>
    </div>
  );
}
