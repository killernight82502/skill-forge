export interface PremiumProduct {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  priceDisplay: string;
  features: string[];
  popular?: boolean;
  tier: "starter" | "elite" | "sovereign";
}

export const PREMIUM_PRODUCTS: PremiumProduct[] = [
  {
    id: "starter-premium",
    name: "Starter Premium",
    description: "Perfect for beginners",
    priceInCents: 499, // $4.99/month
    priceDisplay: "59RS",
    tier: "starter",
    features: [
      "3 Exclusive avatar skins",
      "Golden avatar frame",
      "Basic cosmetics shop access",
      "No ads",
      "Monthly cosmetic rewards",
    ],
  },
  {
    id: "elite-premium",
    name: "Elite Premium",
    description: "Most popular choice",
    priceInCents: 999, // $9.99/month
    priceDisplay: "159RS",
    tier: "elite",
    popular: true,
    features: [
      "All Starter features",
      "7 Exclusive avatar skins",
      "Diamond avatar frame",
      "Priority cosmetic releases",
      "XP boost (+25%)",
      "Celestial avatar frame",
      "Weekly cosmetic rewards",
      "Premium support",
    ],
  },
  {
    id: "sovereign-premium",
    name: "Sovereign Premium",
    description: "Ultimate experience",
    priceInCents: 1999, // $19.99/month
    priceDisplay: "359RS",
    tier: "sovereign",
    features: [
      "All Elite features",
      "All 12 Exclusive avatar skins",
      "Legendary avatar frame",
      "Infernal avatar frame",
      "XP boost (+50%)",
      "Custom cosmetic creation",
      "Daily cosmetic rewards",
      "Priority support (24/7)",
      "Exclusive hunter title",
      "Premium badge showcase",
    ],
  },
];

export function getProductById(id: string): PremiumProduct | undefined {
  return PREMIUM_PRODUCTS.find((p) => p.id === id);
}
