import type { JobMarket, Wishlist } from "@/lib/validation";

export type { JobMarket, Wishlist };

export type JobMarketCategory =
  | "general"
  | "tech"
  | "remote"
  | "startups"
  | "freelance"
  | "design"
  | "local"
  | "other";

export type WishlistStatus = "saved" | "reviewing" | "decided";
