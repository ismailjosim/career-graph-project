import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import type { UserRole } from "@/lib/validation";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
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

    const user = session.user as unknown as Record<string, unknown>;
    const role = (user.role as UserRole) || "job_seeker";

    return {
      ...session.user,
      role,
    } as AuthenticatedUser;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
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
  const user = await getSessionUser();
  if (!user) {
    return { response: unauthorizedResponse() };
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
