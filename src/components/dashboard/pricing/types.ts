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
  createdAt: string;
  updatedAt: string;
}

export interface TokenTransactionData {
  _id: string;
  userId: string;
  amount: number;
  balanceAfter: number;
  type:
    | "signup_bonus"
    | "email_verification_bonus"
    | "package_purchase"
    | "admin_grant"
    | "ats_check"
    | "cover_letter"
    | "fit_analysis";
  description: string;
  packageId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
