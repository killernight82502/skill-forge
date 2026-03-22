"use client";

import { COSMETICS, PREMIUM_COSMETICS, FREE_COSMETICS } from "@/lib/premium-cosmetics";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export function CosmeticsShop() {
  const { user, updateCosmetic } = useAuth();
  const [selectedTab, setSelectedTab] = useState<"all" | "owned">("all");

  if (!user) return null;

  const ownedCosmetics = user.isPremium 
    ? Object.values(COSMETICS) 
    : FREE_COSMETICS;

  const displayedCosmetics = selectedTab === "owned" ? ownedCosmetics : Object.values(COSMETICS);

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30 rounded-lg p-6 mb-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
            Avatar Cosmetics
          </h2>
          {user.isPremium && (
            <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/50 px-3 py-1 rounded-full">
              <span className="text-yellow-400 text-lg">⭐</span>
              <span className="text-yellow-400 text-sm font-semibold">Premium Member</span>
            </div>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab("all")}
            className={`px-4 py-2 rounded font-semibold transition-all ${
              selectedTab === "all"
                ? "bg-orange-500 text-black shadow-lg shadow-orange-500/30"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            All Cosmetics
          </button>
          {user.isPremium && (
            <button
              onClick={() => setSelectedTab("owned")}
              className={`px-4 py-2 rounded font-semibold transition-all ${
                selectedTab === "owned"
                  ? "bg-orange-500 text-black shadow-lg shadow-orange-500/30"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              My Cosmetics
            </button>
          )}
        </div>
      </div>

      {/* Cosmetics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayedCosmetics.map((cosmetic) => {
          const isOwned = user.isPremium || !cosmetic.isPremium;
          const isSelected = user.selectedCosmetic === cosmetic.id;

          return (
            <button
              key={cosmetic.id}
              onClick={() => {
                if (isOwned) {
                  updateCosmetic(cosmetic.id);
                }
              }}
              disabled={!isOwned}
              className={`relative p-4 rounded-lg transition-all ${
                isSelected
                  ? `border-2 shadow-lg`
                  : "border border-gray-700 hover:border-gray-600"
              } ${
                isOwned
                  ? "cursor-pointer bg-gray-900/50 hover:bg-gray-800/50"
                  : "cursor-not-allowed bg-gray-900/30 opacity-60"
              }`}
              style={
                isSelected
                  ? {
                      borderColor: cosmetic.borderColor,
                      boxShadow: `0 0 15px ${cosmetic.glowColor}`,
                      backgroundColor: "rgba(0,0,0,0.7)",
                    }
                  : {}
              }
            >
              {/* Premium Badge */}
              {cosmetic.isPremium && !isOwned && (
                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                  PREMIUM
                </div>
              )}

              {/* Selected Check */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-green-500 px-2 py-1 rounded text-xs font-bold">
                  ✓ ACTIVE
                </div>
              )}

              {/* Avatar Preview */}
              <div
                className="w-full h-16 rounded mb-3 flex items-center justify-center border-2"
                style={{
                  borderColor: cosmetic.color,
                  backgroundColor: cosmetic.glowColor,
                }}
              >
                <div
                  className="text-2xl"
                  style={{ color: cosmetic.color }}
                >
                  ⚔️
                </div>
              </div>

              {/* Cosmetic Name */}
              <p className="font-bold text-sm mb-1" style={{ color: cosmetic.color }}>
                {cosmetic.name}
              </p>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-tight">
                {cosmetic.description}
              </p>

              {/* Owned Status */}
              {!isOwned && (
                <p className="text-xs text-orange-400 mt-2 font-semibold">
                  Unlock with Premium
                </p>
              )}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {displayedCosmetics.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No cosmetics to display</p>
        </div>
      )}
    </div>
  );
}
