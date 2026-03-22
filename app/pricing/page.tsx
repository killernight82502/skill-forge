"use client";

import { PREMIUM_PRODUCTS } from "@/lib/premium-products";
import { Check } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PricingPage() {
  const { user, updatePremiumStatus } = useAuth();
  const router = useRouter();

  const handleUpgrade = (productId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    updatePremiumStatus(true);
    toast.success("Upgrade Successful!", {
      description: `You are now a Premium Hunter. Welcome to the elite!`,
    });
    
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-orange-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-tighter text-orange-500">
            {process.env.NEXT_PUBLIC_SITE_NAME?.toUpperCase() || 'SKILL FORGE'}
          </Link>
          <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Pricing Cards Section */}
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PREMIUM_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className={`relative rounded-2xl border flex flex-col transition-all duration-500 ${
                product.popular
                  ? "bg-gradient-to-b from-orange-950/40 to-black border-orange-500/50 shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)] z-10 scale-105"
                  : "bg-gray-900/40 border-white/10 hover:border-white/20"
              } p-8`}
            >
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-500/20">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-1 tracking-tight">{product.name}</h3>
                <p className="text-gray-400 text-sm font-medium">{product.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className={`text-5xl font-black tracking-tighter ${product.popular ? "text-orange-500" : "text-orange-400"}`}>
                  {product.priceDisplay}
                </span>
                <span className="text-gray-500 text-sm font-medium">/month</span>
              </div>

              <button
                onClick={() => handleUpgrade(product.id)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 mb-10 ${
                  product.popular
                    ? "bg-orange-500 text-black hover:bg-orange-400 hover:scale-[1.02] shadow-lg shadow-orange-500/20"
                    : "bg-gray-800/80 text-white border border-white/10 hover:bg-gray-700/80 hover:border-white/20"
                }`}
              >
                {user?.isPremium ? "Current Plan" : "Upgrade Now"}
              </button>

              <div className="space-y-4 mt-auto">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 transition-colors ${product.popular ? "text-orange-500" : "text-orange-400"}`} strokeWidth={3} />
                    <span className="text-sm text-gray-300 font-medium group-hover:text-white transition-colors">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
