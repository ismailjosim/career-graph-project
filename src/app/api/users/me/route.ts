import { NextResponse } from "next/server";
import {
  ensureSuperAdminExists,
  getSessionUser,
  unauthorizedResponse,
} from "@/lib/server-auth";

export async function GET() {
  try {
    await ensureSuperAdminExists();
    const user = await getSessionUser();

    if (!user) {
      return unauthorizedResponse();
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
        emailVerified: user.emailVerified,
        isAdmin: user.role === "admin" || user.role === "super_admin",
        isSuperAdmin: user.role === "super_admin",
      },
    });
  } catch (error) {
    console.error("Error in /api/users/me:", error);
    return NextResponse.json(
      { error: "Failed to fetch user session info" },
      { status: 500 },
    );
  }
}
