export interface TokenPackageData {
  _id: string;
  name: string;
  tokens: number;
  price: number;
  description: string;
  badge?: string;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
  sortOrder: number;
  category?: "bundle" | "token_only";
  polarProductId?: string;
  createdAt: string;
  updatedAt: string;
}

export type TokenTransactionType =
  | "signup_bonus"
  | "email_verification_bonus"
  | "package_purchase"
  | "admin_grant"
  | "ats_check"
  | "cover_letter"
  | "fit_analysis";

export interface TokenTransactionData {
  _id: string;
  userId: string;
  amount: number;
  balanceAfter: number;
  type: TokenTransactionType;
  description: string;
  packageId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface PolarCheckoutSessionResponse {
  url: string;
  sessionId: string;
}

export interface VerifyCheckoutResponse {
  success: boolean;
  message?: string;
  tokensGranted?: number;
  newBalance?: number;
}
