"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Zap, Star } from "lucide-react";

export function PremiumUpgradeBanner() {
  const { user } = useAuth();

  if (user?.isPremium) {
    return null; // Don't show banner to premium users
  }

  return (
    <div className="bg-gradient-to-r from-orange-900/40 to-yellow-900/40 border border-orange-500/50 rounded-lg p-6 mb-8 shadow-lg shadow-orange-500/10">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Star className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-orange-300 mb-2">Become a Premium Hunter</h3>
          <p className="text-gray-300 mb-4">
            Unlock exclusive avatar cosmetics, premium frames, and enhanced progression. Get access to rare limited-edition designs and special features.
          </p>
          <div className="flex gap-3">
            <Link
              href="/pricing"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Upgrade Now
            </Link>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
