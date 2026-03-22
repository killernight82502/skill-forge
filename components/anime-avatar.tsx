"use client";

import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";

interface AnimeAvatarProps {
  level: number;
}

export function AnimeAvatar({ level }: AnimeAvatarProps) {
  const { user } = useAuth();
  const gender = user?.gender || "male";

  // Get avatar image and tier based on level and gender
  const getAvatarData = (lvl: number, gen: string) => {
    const prefix = gen === "female" ? "" : "male-";
    
    if (lvl < 5) return { image: `/avatars/${prefix}novice.jpg`, tier: "Novice", color: "#6366f1" };
    if (lvl < 10) return { image: `/avatars/${prefix}awakening.jpg`, tier: "Awakening", color: "#8b5cf6" };
    if (lvl < 15) return { image: `/avatars/${prefix}evolved.jpg`, tier: "Evolved", color: "#d946ef" };
    if (lvl < 20) return { image: `/avatars/${prefix}ascended.jpg`, tier: "Ascended", color: "#f97316" };
    if (lvl < 25) return { image: `/avatars/${prefix}awakened.jpg`, tier: "Awakened", color: "#eab308" };
    if (lvl < 30) return { image: `/avatars/${prefix}transcendent.jpg`, tier: "Transcendent", color: "#06b6d4" };
    return { image: `/avatars/${prefix}sovereign.jpg`, tier: "Sovereign", color: "#ec4899" };
  };

  const avatarData = getAvatarData(level, gender);

  // Weapon progression - every level gets a new weapon
  const weapons = [
    "Wooden Dagger", // Lv1
    "Bronze Dagger", // Lv2
    "Iron Dagger", // Lv3
    "Steel Sword", // Lv4
    "Iron Sword", // Lv5
    "Steel Sword +1", // Lv6
    "Silver Sword", // Lv7
    "Mithril Sword", // Lv8
    "Enchanted Blade", // Lv9
    "Twin Blades", // Lv10
    "Twin Blades +1", // Lv11
    "Dual Swords", // Lv12
    "Enchanted Twin Blades", // Lv13
    "Legendary Twin Blades", // Lv14
    "Enchanted Claymore", // Lv15
    "Holy Claymore", // Lv16
    "Divine Claymore", // Lv17
    "Ascended Claymore", // Lv18
    "Divine Blade", // Lv19
    "Divine Blade +1", // Lv20
    "Heavenly Blade", // Lv21
    "Divine Katana", // Lv22
    "Sacred Katana", // Lv23
    "Mythical Scythe", // Lv24
    "Mythical Scythe +1", // Lv25
    "Celestial Scythe", // Lv26
    "Eternal Scythe", // Lv27
    "Ancient Scythe", // Lv28
    "Transcendent Scythe", // Lv29
    "Legendary Trident", // Lv30
  ];

  const getTierName = (lvl: number) => {
    if (lvl < 5) return "Novice";
    if (lvl < 10) return "Awakening";
    if (lvl < 15) return "Evolved";
    if (lvl < 20) return "Ascended";
    if (lvl < 25) return "Awakened";
    if (lvl < 30) return "Transcendent";
    return "Sovereign";
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Anime Character Avatar - Realistic Image */}
      <div className="relative w-40 h-48 rounded-lg overflow-hidden border-2" style={{ borderColor: avatarData.color }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 z-10" />
        <Image
          src={avatarData.image}
          alt={`${avatarData.tier} Avatar - Level ${level}`}
          fill
          className="object-cover object-top"
          priority
        />
        
        {/* Level Badge */}
        <div className="absolute top-2 right-2 z-20 bg-black/70 px-2 py-1 rounded-full text-sm font-bold text-white border border-orange-500">
          Lv {level}
        </div>

        {/* Glow Effect for High Levels */}
        {level >= 15 && (
          <div className="absolute inset-0 z-20 pointer-events-none"
               style={{
                 boxShadow: `inset 0 0 30px ${avatarData.color}40`,
                 borderRadius: "0.5rem"
               }}
          />
        )}
      </div>

      {/* Avatar Stats */}
      <div className="text-center">
        <div className="text-sm font-semibold text-gray-300 mb-1">{avatarData.tier}</div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white" 
             style={{ backgroundColor: avatarData.color, opacity: 0.8 }}>
          {weapons[Math.min(level - 1, weapons.length - 1)]}
        </div>
      </div>
    </div>
  );
}
