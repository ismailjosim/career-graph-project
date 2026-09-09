import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { TokenTransaction, type TokenTransactionType } from "@/lib/models";
import type { UserRole, UserStatus } from "@/lib/validation";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  status: UserStatus;
  tokens: number;
  verifiedBonusGiven?: boolean;
  phone?: string;
  location?: string;
  headline?: string;
  bio?: string;
  skills?: string[] | string;
  website?: string;
  linkedin?: string;
  experience?: string;
  education?: string;
  isProfileComplete?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getSessionUser(): Promise<AuthenticatedUser | null> {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });
    if (!session?.user) return null;

    let role =
      ((session.user as unknown as Record<string, unknown>).role as UserRole) ||
      "job_seeker";
    let status: UserStatus =
      ((session.user as unknown as Record<string, unknown>)
        .status as UserStatus) || "active";
    let dbDetails: Record<string, unknown> = {};

    // Query live DB user to avoid stale session cookies after role/status updates
    try {
      const mongoose = await connectDB();
      const db = mongoose.connection.db;
      if (db) {
        const userId = session.user.id;
        const userQuery = {
          $or: [
            ...(ObjectId.isValid(userId)
              ? [{ _id: new ObjectId(userId) }]
              : []),
            { _id: userId },
            { id: userId },
            { email: session.user.email },
          ],
        };
        const userCollection = db.collection<Record<string, unknown>>("user");
        const dbUser = await userCollection.findOne(
          userQuery as Parameters<typeof userCollection.findOne>[0],
        );
        if (dbUser) {
          if (dbUser.role) role = dbUser.role as UserRole;
          if (dbUser.status) status = dbUser.status as UserStatus;
          dbDetails = dbUser;
        }
      }
    } catch {
      // Fallback to session details
    }

    const rawTokens =
      typeof dbDetails.tokens === "number"
        ? dbDetails.tokens
        : typeof (session.user as Record<string, unknown>).tokens === "number"
          ? ((session.user as Record<string, unknown>).tokens as number)
          : 50;

    return {
      ...session.user,
      ...dbDetails,
      id: session.user.id,
      name: (dbDetails.name as string) || session.user.name,
      email: (dbDetails.email as string) || session.user.email,
      emailVerified:
        dbDetails.emailVerified !== undefined
          ? Boolean(dbDetails.emailVerified)
          : session.user.emailVerified,
      role,
      status,
      tokens: rawTokens,
      verifiedBonusGiven: Boolean(dbDetails.verifiedBonusGiven),
    } as AuthenticatedUser;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

export function blockedAccountResponse() {
  return NextResponse.json(
    {
      error:
        "Your account has been suspended or blocked by a platform administrator. Please contact support.",
    },
    { status: 403 },
  );
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Unauthorized: Please sign in to access this resource" },
    { status: 401 },
  );
}

export function forbiddenResponse(
  message = "Forbidden: You do not have permission to perform this action",
) {
  return NextResponse.json({ error: message }, { status: 403 });
}

export async function requireAdminUser(): Promise<
  { user: AuthenticatedUser } | { response: NextResponse }
> {
  // Ensure the system has at least one super_admin bootstrapped
  await ensureSuperAdminExists();

  const user = await getSessionUser();
  if (!user) {
    return { response: unauthorizedResponse() };
  }

  if (user.status === "blocked") {
    return { response: blockedAccountResponse() };
  }

  if (user.role !== "admin" && user.role !== "super_admin") {
    return {
      response: forbiddenResponse(
        "Access denied: Admin or Super Admin privileges required",
      ),
    };
  }

  return { user };
}

/**
 * Ensures at least one super_admin exists in the system.
 * If none exists, promotes the earliest registered user or SUPER_ADMIN_EMAIL.
 */
export async function ensureSuperAdminExists() {
  try {
    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) return;

    const userCollection = db.collection("user");
    const superAdmin = await userCollection.findOne({ role: "super_admin" });

    if (!superAdmin) {
      // Find designated email if configured, else the earliest user
      const targetUser =
        (process.env.SUPER_ADMIN_EMAIL
          ? await userCollection.findOne({
              email: process.env.SUPER_ADMIN_EMAIL,
            })
          : null) ||
        (await userCollection.find().sort({ createdAt: 1 }).limit(1).next());

      if (targetUser) {
        await userCollection.updateOne(
          { _id: targetUser._id },
          { $set: { role: "super_admin", updatedAt: new Date() } },
        );
      }
    }
  } catch (err) {
    console.error("Error checking super_admin presence:", err);
  }
}

function getUserQuery(id: string): Record<string, unknown> {
  try {
    return {
      $or: [{ _id: new ObjectId(id) }, { _id: id }, { id: id }],
    };
  } catch {
    return {
      $or: [{ _id: id }, { id: id }],
    };
  }
}

/**
 * Atomically deduct tokens from a user's balance and records the transaction.
 * Returns { success: false } if user has insufficient tokens.
 */
export async function deductUserTokens({
  userId,
  amount,
  type,
  description,
  packageId,
  metadata,
}: {
  userId: string;
  amount: number;
  type: TokenTransactionType;
  description: string;
  packageId?: string;
  metadata?: Record<string, unknown>;
}): Promise<{ success: boolean; newBalance: number; error?: string }> {
  try {
    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return { success: false, newBalance: 0, error: "Database unavailable" };
    }

    const userCollection = db.collection<Record<string, unknown>>("user");
    const query = getUserQuery(userId);
    const user = await userCollection.findOne(query);

    if (!user) {
      return { success: false, newBalance: 0, error: "User not found" };
    }

    const currentTokens = typeof user.tokens === "number" ? user.tokens : 50;

    if (currentTokens < amount) {
      return {
        success: false,
        newBalance: currentTokens,
        error: `Insufficient tokens. Required: ${amount}, available: ${currentTokens}`,
      };
    }

    const newBalance = currentTokens - amount;

    await userCollection.updateOne(query, {
      $set: { tokens: newBalance, updatedAt: new Date() },
    });

    try {
      await TokenTransaction.create({
        userId,
        amount: -amount,
        balanceAfter: newBalance,
        type,
        description,
        packageId,
        metadata,
        createdAt: new Date(),
      });
    } catch (txErr) {
      console.error("Failed to log token deduction transaction:", txErr);
    }

    return { success: true, newBalance };
  } catch (err) {
    console.error("deductUserTokens error:", err);
    return {
      success: false,
      newBalance: 0,
      error: err instanceof Error ? err.message : "Failed to deduct tokens",
    };
  }
}

/**
 * Atomically grant/add tokens to a user's account and records the transaction.
 */
export async function grantUserTokens({
  userId,
  amount,
  type,
  description,
  packageId,
  metadata,
}: {
  userId: string;
  amount: number;
  type: TokenTransactionType;
  description: string;
  packageId?: string;
  metadata?: Record<string, unknown>;
}): Promise<{ success: boolean; newBalance: number; error?: string }> {
  try {
    const mongoose = await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return { success: false, newBalance: 0, error: "Database unavailable" };
    }

    const userCollection = db.collection<Record<string, unknown>>("user");
    const query = getUserQuery(userId);
    const user = await userCollection.findOne(query);

    if (!user) {
      return { success: false, newBalance: 0, error: "User not found" };
    }

    const currentTokens = typeof user.tokens === "number" ? user.tokens : 50;
    const newBalance = currentTokens + amount;

    await userCollection.updateOne(query, {
      $set: { tokens: newBalance, updatedAt: new Date() },
    });

    try {
      await TokenTransaction.create({
        userId,
        amount,
        balanceAfter: newBalance,
        type,
        description,
        packageId,
        metadata,
        createdAt: new Date(),
      });
    } catch (txErr) {
      console.error("Failed to log token grant transaction:", txErr);
    }

    return { success: true, newBalance };
  } catch (err) {
    console.error("grantUserTokens error:", err);
    return {
      success: false,
      newBalance: 0,
      error: err instanceof Error ? err.message : "Failed to grant tokens",
    };
  }
}
