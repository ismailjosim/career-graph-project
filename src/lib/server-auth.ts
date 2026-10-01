import type { Filter } from "mongodb";
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
  technicalSkills?: string | unknown[];
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
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      (error as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE"
    ) {
      throw error;
    }
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

export function canManageSystemUsers(role?: string): boolean {
  return role === "admin" || role === "super_admin";
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

let superAdminCheckPromise: Promise<void> | null = null;

/**
 * Checks if the super admin exists in the database.
 * If exist, does nothing.
 * If not, injects that admin into the database for one time using Better Auth.
 */
export async function ensureSuperAdminExists(): Promise<void> {
  if (superAdminCheckPromise) return superAdminCheckPromise;

  superAdminCheckPromise = (async () => {
    try {
      const adminEmail = (
        process.env.SUPER_ADMIN_EMAIL || "superadmin@careergraph.com"
      )
        .toLowerCase()
        .trim();
      const adminPassword =
        process.env.SUPER_ADMIN_password ||
        process.env.SUPER_ADMIN_PASSWORD ||
        "z5h#nXxMLn8C6ko#dv&uaw$27pCrP^BN";

      const mongoose = await connectDB();
      const db = mongoose.connection.db;
      if (!db) return;

      const userCollection = db.collection("user");
      // 1. First check if this admin exists
      const existing = await userCollection.findOne({
        email: { $regex: new RegExp(`^${adminEmail}$`, "i") },
      });

      if (existing) {
        // If exist then don't do anything
        return;
      }

      // 2. If not, then inject that admin into db for one time using Better Auth
      console.log(
        `[BOOTSTRAP] Super admin (${adminEmail}) does not exist. Injecting into DB via Better Auth...`,
      );
      try {
        await auth.api.signUpEmail({
          body: {
            name: "Super Admin",
            email: adminEmail,
            password: adminPassword,
          },
        });
      } catch (signupErr) {
        console.warn("[BOOTSTRAP] Better Auth signUpEmail note:", signupErr);
      }

      // Promote to super_admin and set verified credentials
      await userCollection.updateOne(
        { email: { $regex: new RegExp(`^${adminEmail}$`, "i") } },
        {
          $set: {
            role: "super_admin",
            emailVerified: true,
            status: "active",
            tokens: 999999,
            isProfileComplete: true,
            phone: "+1-555-0199",
            headline: "Platform Super Administrator",
            updatedAt: new Date(),
          },
        },
      );
      console.log(
        `[BOOTSTRAP] Super admin (${adminEmail}) successfully injected into DB.`,
      );
    } catch (err) {
      console.error("[BOOTSTRAP] Error in ensureSuperAdminExists:", err);
    }
  })();

  return superAdminCheckPromise;
}

interface DbUserDocument {
  _id: ObjectId | string;
  id?: string;
  tokens?: number;
  status?: string;
  updatedAt?: Date;
  [key: string]: unknown;
}

function getUserQuery(id: string): Filter<DbUserDocument> {
  const orConditions: Filter<DbUserDocument>[] = [{ id }, { _id: id }];
  if (ObjectId.isValid(id)) {
    try {
      orConditions.push({ _id: new ObjectId(id) });
    } catch {
      // ignore
    }
  }
  return { $or: orConditions };
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

    const userCollection = db.collection<DbUserDocument>("user");
    const query = getUserQuery(userId);

    const userDoc = await userCollection.findOne(query);
    if (!userDoc) {
      return { success: false, newBalance: 0, error: "User not found" };
    }

    const currentBalance =
      typeof userDoc.tokens === "number" ? userDoc.tokens : 50;

    if (currentBalance < amount) {
      return {
        success: false,
        newBalance: currentBalance,
        error: `Insufficient tokens. Required: ${amount}, available: ${currentBalance}`,
      };
    }

    const newBalance = Math.max(0, currentBalance - amount);

    await userCollection.updateOne(
      { _id: userDoc._id },
      { $set: { tokens: newBalance, updatedAt: new Date() } },
    );

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

    const userCollection = db.collection<DbUserDocument>("user");
    const query = getUserQuery(userId);

    const userDoc = await userCollection.findOne(query);
    if (!userDoc) {
      return { success: false, newBalance: 0, error: "User not found" };
    }

    const currentBalance =
      typeof userDoc.tokens === "number" ? userDoc.tokens : 50;
    const newBalance = currentBalance + amount;

    await userCollection.updateOne(
      { _id: userDoc._id },
      { $set: { tokens: newBalance, updatedAt: new Date() } },
    );

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
