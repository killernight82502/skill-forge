"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DIFFICULTY_RANKS, DifficultyRank } from "@/lib/game-constants";
import { toast } from "sonner";

interface TaskFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    durationMinutes: number;
    difficulty: DifficultyRank;
    deadline?: number;
  }) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyRank>("D");
  const [isOpen, setIsOpen] = useState(false);
  const [deadlineHours, setDeadlineHours] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !duration) {
      toast.error("Required Fields Missing", {
        description: "Please enter a task title and estimated duration.",
      });
      return;
    }

    const deadline = deadlineHours ? Date.now() + parseInt(deadlineHours) * 60 * 60 * 1000 : undefined;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      durationMinutes: parseInt(duration),
      difficulty,
      deadline,
    });

    toast.success("New Quest Added", {
      description: `"${title}" has been added to your active quests.${deadline ? " Deadline set!" : ""}`,
    });

    setTitle("");
    setDescription("");
    setDuration("");
    setDifficulty("D");
    setDeadlineHours("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-6"
      >
        + Add New Task
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-purple-500/20 rounded-lg p-6 mb-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Task Title *
          </label>
          <Input
            type="text"
            placeholder="e.g., Write blog post, Study React hooks"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-900 border-gray-700 text-white"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            placeholder="Additional details about this task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration (minutes) *
            </label>
            <Input
              type="number"
              placeholder="30"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="1"
              max="1440"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyRank)}
              className="w-full bg-gray-900 border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {Object.entries(DIFFICULTY_RANKS).map(([key, { label }]) => (
                <option key={key} value={key}>
                  {label} Rank
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deadline (hours)
            </label>
            <Input
              type="number"
              placeholder="24"
              value={deadlineHours}
              onChange={(e) => setDeadlineHours(e.target.value)}
              min="1"
              max="168"
              className="bg-gray-900 border-gray-700 text-white"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
          >
            Create Task
          </Button>
          <Button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
