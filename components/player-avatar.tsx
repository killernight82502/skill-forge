"use client";

interface PlayerAvatarProps {
  level: number;
}

export function PlayerAvatar({ level }: PlayerAvatarProps) {
  // Determine avatar progression based on level
  const getAvatarProgression = (lv: number) => {
    if (lv >= 30)
      return {
        tier: "Sovereign",
        tierColor: "text-red-400",
        bodyColor: "text-yellow-300",
        armorColor: "text-red-500",
        skills: ["Omnislash", "Reality Warp", "Dimensional Tear"],
        armorDesc: "Divine Sovereign Plate",
        hatSymbol: "👑",
      };
    if (lv >= 25)
      return {
        tier: "Transcendent",
        tierColor: "text-purple-400",
        bodyColor: "text-purple-300",
        armorColor: "text-purple-500",
        skills: ["Void Slash", "Time Stop", "Chaos Control"],
        armorDesc: "Transcendent Robes",
        hatSymbol: "✨",
      };
    if (lv >= 20)
      return {
        tier: "Awakened",
        tierColor: "text-cyan-400",
        bodyColor: "text-blue-300",
        armorColor: "text-cyan-500",
        skills: ["Shadow Clone", "Dark Step", "Mana Shield"],
        armorDesc: "Awakened Battle Suit",
        hatSymbol: "💎",
      };
    if (lv >= 15)
      return {
        tier: "Ascended",
        tierColor: "text-indigo-400",
        bodyColor: "text-indigo-300",
        armorColor: "text-indigo-500",
        skills: ["Swift Strike", "Power Surge", "Iron Skin"],
        armorDesc: "Ascended Armor",
        hatSymbol: "⚡",
      };
    if (lv >= 10)
      return {
        tier: "Evolved",
        tierColor: "text-blue-400",
        bodyColor: "text-blue-200",
        armorColor: "text-blue-500",
        skills: ["Double Slash", "Berserk", "Counter"],
        armorDesc: "Evolved Plate Mail",
        hatSymbol: "🔷",
      };
    if (lv >= 5)
      return {
        tier: "Awakening",
        tierColor: "text-cyan-300",
        bodyColor: "text-cyan-200",
        armorColor: "text-cyan-400",
        skills: ["Power Slash", "Guard", "Focus"],
        armorDesc: "Iron Armor",
        hatSymbol: "⚙️",
      };
    return {
      tier: "Novice",
      tierColor: "text-gray-400",
      bodyColor: "text-gray-300",
      armorColor: "text-gray-500",
      skills: ["Slash", "Block", "Rest"],
      armorDesc: "Leather Armor",
      hatSymbol: "🧢",
    };
  };

  const progression = getAvatarProgression(level);
  const skillCount = Math.min(3, Math.floor(level / 5) + 1);
  const activeSkills = progression.skills.slice(0, skillCount);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Humanoid Avatar */}
      <div className="relative w-40 h-48 rounded-lg bg-gradient-to-b from-gray-900/50 to-black/50 border-2 border-purple-500/30 flex flex-col items-center justify-center overflow-hidden p-4">
        {/* Head with Hat */}
        <div className="flex flex-col items-center gap-1 mb-2">
          <div className={`text-4xl ${progression.tierColor}`}>{progression.hatSymbol}</div>
          <div className={`w-10 h-10 rounded-full ${progression.bodyColor} text-2xl flex items-center justify-center font-bold`}>
            ●
          </div>
        </div>

        {/* Body/Armor */}
        <div className="flex flex-col items-center gap-1 flex-grow justify-center">
          {/* Chest Plate */}
          <div className={`${progression.armorColor} text-4xl`}>█</div>
          {/* Armor Details */}
          <div className={`${progression.armorColor} text-3xl tracking-wider`}>❯❮</div>
          {/* Legs */}
          <div className={`${progression.bodyColor} text-2xl`}>▌▌</div>
        </div>

        {/* Level Badge on Avatar */}
        <div className="absolute top-2 right-2 bg-purple-600/80 rounded-full w-8 h-8 flex items-center justify-center">
          <span className="text-xs font-bold text-white">{level}</span>
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Tier Information */}
      <div className="text-center">
        <div className={`text-sm font-bold ${progression.tierColor} mb-1`}>{progression.tier}</div>
        <div className={`text-xs ${progression.armorColor} font-semibold`}>{progression.armorDesc}</div>
      </div>

      {/* Skills Display */}
      <div className="w-full space-y-2">
        <div className="text-xs text-gray-400 text-center font-semibold mb-1">Active Skills ({skillCount})</div>
        <div className="space-y-1">
          {activeSkills.map((skill, index) => (
            <div
              key={index}
              className="text-xs bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded px-2 py-1 text-purple-300 text-center font-medium"
            >
              ✦ {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Progression Bar */}
      <div className="w-full">
        <div className="text-xs text-gray-500 text-center mb-1">Tier Progress</div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-300"
            style={{
              width: `${Math.min(((level % 5) / 4) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
