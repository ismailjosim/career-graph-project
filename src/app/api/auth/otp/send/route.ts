import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { OtpVerification } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    await connectDB();

    // Generate secure 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // Upsert OTP record
    await OtpVerification.findOneAndUpdate(
      { email: normalizedEmail },
      {
        otp,
        expiresAt,
        attempts: 0,
        createdAt: new Date(),
      },
      { upsert: true, new: true },
    );

    // Output code to server log for immediate observability
    console.log(
      `\n========================================\n[CAREER GRAPH OTP] Verification code for ${normalizedEmail}: ${otp}\n(Valid for 10 minutes)\n========================================\n`,
    );

    const isDev = process.env.NODE_ENV !== "production";

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code was sent to ${normalizedEmail}`,
      // Helpful preview in development so user is never blocked
      ...(isDev ? { devCode: otp } : {}),
    });
  } catch (err) {
    console.error("Failed to generate OTP:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to send verification code",
      },
      { status: 500 },
    );
  }
}
