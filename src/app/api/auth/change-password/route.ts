import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSessionUser, unauthorizedResponse } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current password and new password are required." },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long." },
        { status: 400 },
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password." },
        { status: 400 },
      );
    }

    try {
      // Call Better Auth built-in changePassword API
      await auth.api.changePassword({
        body: {
          currentPassword,
          newPassword,
          revokeOtherSessions: false,
        },
        headers: request.headers,
      });

      return NextResponse.json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (authErr: unknown) {
      const msg =
        authErr instanceof Error
          ? authErr.message
          : "Failed to update password. Please check your current password.";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while changing password",
      },
      { status: 500 },
    );
  }
}
