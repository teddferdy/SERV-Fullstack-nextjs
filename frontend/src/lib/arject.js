import arcjet, { tokenBucket } from "@arcjet/next";

export const aj = arcjet({
  key: process.env.NEXT_PUBLIC_ARCJECT_KEY,
  rules: [],
});

// Free Tier Pantry Scan limit (20 scans per month)
export const freePantryScans = aj.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 20,
    interval: "30d",
    capacity: 20,
  }),
);

// Free Tier Meal Recomendations (5 per month)
export const freeMealRecomendations = aj.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 5,
    interval: "30d",
    capacity: 5,
  }),
);

// Pro Tier - Effectively Unlimited (Very High Limits)
// 1000 request per day should be more than enough for any user
export const proTierLimit = aj.withRule(
  tokenBucket({
    mode: "LIVE",
    characteristics: ["userId"],
    refillRate: 1000,
    interval: "1d",
    capacity: 1000,
  }),
);
