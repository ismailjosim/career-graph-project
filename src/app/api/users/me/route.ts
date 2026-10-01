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
        status: user.status || "active",
        image: user.image,
        emailVerified: user.emailVerified,
        phone: user.phone || "",
        location: user.location || "",
        headline: user.headline || "",
        bio: user.bio || "",
        skills: user.skills || [],
        website: user.website || "",
        linkedin: user.linkedin || "",
        experience: user.experience || "",
        education: user.education || "",
        isProfileComplete: Boolean(user.isProfileComplete),
        tokens: typeof user.tokens === "number" ? user.tokens : 50,
        verifiedBonusGiven: Boolean(user.verifiedBonusGiven),
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
